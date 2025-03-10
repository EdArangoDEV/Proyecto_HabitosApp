import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabitos } from "./habitoAPI";


type Habito = {
    id: string;
    titulo: string;
    descripcion: string;
    fechaCreado: string;
}

type HabitoState = {
    habitos: Habito[];
}

const initialState: HabitoState = {
    habitos: []
}

export const fetchHabitosThunk = createAsyncThunk("habito/fetchHabitos", async () => {
    return await fetchHabitos();
});

const habitoSlice = createSlice({
    name: 'habito',
    initialState,
    reducers: {
        addHabitos: (state, action) => {
            state.habitos = action.payload;
        },
        addHabito: (state, action) => {
            state.habitos.push(action.payload);
        },
        removeHabito: (state, action) => {
            state.habitos = state.habitos.filter(habito => habito.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitosThunk.fulfilled, (state, action) => {
            state.habitos = action.payload;
        });
    }
});

export const { addHabitos, addHabito, removeHabito } = habitoSlice.actions;
export default habitoSlice.reducer;