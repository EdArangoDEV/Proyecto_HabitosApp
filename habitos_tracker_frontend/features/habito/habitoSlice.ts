import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabitos } from "./habitoAPI";

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

const initialState: HabitoState = {
  habitos: [],
  status: {},
  error: {},
};

export const fetchHabitosThunk = createAsyncThunk(
  "habito/fetchHabitos",
  async () => {
    return await fetchHabitos();
  }
);

export const markAsDoneThunk = createAsyncThunk(
  "habito/markAsDone",
  async (habitoId: string, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:3001/habitos/markasdone/${habitoId}`, {
      method: "PATCH",
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
        state.status[action.meta.arg] = "success";
        state.error[action.meta.arg] = null;
      })
      .addCase(markAsDoneThunk.rejected, (state, action) => {
        state.status[action.meta.arg] = "failed";
        state.error[action.meta.arg] = action.payload as string;
      });
  },
});

export const { addHabitos, addHabito, removeHabito } = habitoSlice.actions;
export default habitoSlice.reducer;
