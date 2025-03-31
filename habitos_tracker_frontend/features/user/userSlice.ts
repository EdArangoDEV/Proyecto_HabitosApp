import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLoginUser, fetchRegisterUser } from './userAPI';


interface userThunk {
    nombreUsuario: string;
    password: string;
}

type user = {
    token: string;
}

type userState = {
    user: user | null;
    status: 'idle' | 'loading' | 'failed' | 'success';
    error: string | null;
};

const initialState: userState = {
    user: null,
    status: 'idle',
    error: null,
};

export const fetchRegisterUserThunk = createAsyncThunk("user/fetchRegisterUser", async ({nombreUsuario, password}: userThunk, {rejectWithValue}) => {

    const response = await fetchRegisterUser(nombreUsuario, password);
    const responseJson = await response.json();
    console.log(responseJson.message.toString());
    if (!response.ok) {
        return rejectWithValue("Fallo al registrar el usuario");
    } else if (responseJson.message.toString() === "Usuario registrado correctamente") {
        return responseJson.message;
    } else {
        return rejectWithValue(responseJson.message);
    }
 });

 export const fetchLoginUserThunk = createAsyncThunk("user/fetchLoginUser", async ({nombreUsuario, password}: userThunk, {rejectWithValue}) => {
    
    const response = await fetchLoginUser(nombreUsuario, password);
    const responseJson = await response.json();
    console.log(responseJson.message.toString());

    if (!response.ok) {
        throw new Error("Falla al iniciar sesion el usuario");
    } else if (responseJson.message.toString() === "Inicio de sesion exitoso") {
        return responseJson.token;
    } else {
        return rejectWithValue(responseJson.message);
    }
 });    


 const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
            state.status = "success";
            state.user = null;
            state.error = action.payload as string;
            alert("Usuario registrado correctamente");
        }).addCase(fetchRegisterUserThunk.rejected, (state, action) => {
            state.status = "failed";
            state.user = null;
            state.error = action.payload as string;
            alert("No es posible registrar el usuario en este momento, intente mas tarde");
        }).addCase(fetchLoginUserThunk.rejected, (state, action) => { 
            state.status = "failed";
            state.error = action.payload as string;
            alert("No es posible iniciar sesion en este momento, intente mas tarde");
        }).addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
            state.status = "success";
            state.user = action.payload;
            state.error = action.payload as string;
            alert("Inicio de sesion exitoso");
        });
    }
 });

 export const { addUser } = userSlice.actions;
 export default userSlice.reducer;