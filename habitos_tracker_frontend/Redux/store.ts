import  {configureStore} from '@reduxjs/toolkit';
import habitoReducer from '../features/habito/habitoSlice';
import userReducer from '../features/user/userSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
        // Add reducers here
            habito: habitoReducer,
            user: userReducer
        },
    });
};


export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppStore = ReturnType<typeof makeStore>;


