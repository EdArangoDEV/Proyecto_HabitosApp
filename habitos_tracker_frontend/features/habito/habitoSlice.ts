import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabitos, fetchAddHabito } from "./habitoAPI";

type Habito = {
  _id: string;
  titulo: string;
  descripcion: string;
  createdAt: Date;
  days: number;
  lastDone: Date;
  lastUpdated: Date;
};

type HabitoState = {
  habitos: Habito[];
  status: Record<string, "idle" | "loading" | "failed" | "success">;
  error: Record<string, string | null>;
};

type markAsDoneThunkParams = {
  habitoId: string;
  token: string;
}

type addHabitoThunkParams = {
  token: string;
  titulo: string;
  descripcion: string;
}

const initialState: HabitoState = {
  habitos: [],
  status: {},
  error: {},
};

export const fetchHabitosThunk = createAsyncThunk(
  "habito/fetchHabitos",
  async (token: string, {rejectWithValue}) => {
    const response = await fetchHabitos(token);
    const responseJson = await response.json();
    if (!response.ok) {
      return rejectWithValue("Fallo al obtener los habitos");
    }
    console.log(responseJson);
    return responseJson;
  }
);

export const markAsDoneThunk = createAsyncThunk(
  "habito/markAsDone",
  async ({habitoId, token}: markAsDoneThunkParams, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:3001/habitos/markasdone/${habitoId}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token}
    });
    const responseJson = await response.json();
    // console.log(response);
    if (!response.ok) {
      return rejectWithValue("Falló al marcar como hecho");
    } else if (responseJson.message.toString() === "Habito reinicidado") {
      return rejectWithValue(responseJson.message);
    } else {
      return responseJson.message;
    }
  }
);

export const fetchAddHabitoThunk = createAsyncThunk("user/fetchAddHabito", async ({token, titulo, descripcion}: addHabitoThunkParams, { rejectWithValue }) => {
  const response = await fetchAddHabito(token, titulo, descripcion);
  const responseJson = await response.json();
  if (!response.ok) {
    return rejectWithValue("fallo al logear el usuario");
  } else if (responseJson.message.toString() === "Fallo al agregar el habito") {
    return rejectWithValue(responseJson.message);
  } else {
    return responseJson.token;
  }
});


const habitoSlice = createSlice({
  name: "habito",
  initialState,
  reducers: {
    addHabitos: (state, action) => {
      state.habitos = action.payload;
    },
    addHabito: (state, action) => {
      state.habitos.push(action.payload);
    },
    removeHabito: (state, action) => {
      state.habitos = state.habitos.filter(
        (habito) => habito._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitosThunk.fulfilled, (state, action) => {
        state.habitos = action.payload;
      })
      .addCase(markAsDoneThunk.fulfilled, (state, action) => {
        state.status[action.meta.arg.habitoId] = "success";
        state.error[action.meta.arg.habitoId] = null;
      })
      .addCase(markAsDoneThunk.rejected, (state, action) => {
        state.status[action.meta.arg.habitoId] = "failed";
        state.error[action.meta.arg.habitoId] = action.payload as string;
      }).addCase(fetchAddHabitoThunk.fulfilled, (state, action) => {
        state.habitos.push(action.payload);
      });
  },
});

export const { addHabitos, addHabito, removeHabito } = habitoSlice.actions;
export default habitoSlice.reducer;
