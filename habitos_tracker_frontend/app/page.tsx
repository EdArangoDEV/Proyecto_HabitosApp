"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitosThunk } from "@/features/habito/habitoSlice";
import {
  fetchRegisterUserThunk,
  fetchLoginUserThunk,
  addUser,
} from "@/features/user/userSlice";
import { RootState, AppDispatch } from "@/Redux/store";
import Habitos from "./habitos";
import { getCookie } from "cookies-next";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habitos = useSelector((state: RootState) => state.habito.habitos);
  const user = useSelector((state: RootState) => state.user.user);
  const [nombreUsuario, setnombreUsuario] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = getCookie("habitoToken");
    if (token) {
      dispatch(addUser(token));
    }
    if (user) {
      dispatch(fetchHabitosThunk(user.toString()));
    }
  }, [dispatch, user]);


  const handleLogin = () => {
    if (!nombreUsuario || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    dispatch(fetchLoginUserThunk({ nombreUsuario, password }))
      .unwrap()
      .then((userData) => {
        // Manejar el inicio de sesión exitoso
        console.log("Inicio de sesión exitoso", userData);
      })
      .catch((error) => {
        console.log("Error al iniciar sesión: " + error);
      });
  };
  

  const handleRegister = () => {
    if (!nombreUsuario || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    dispatch(fetchRegisterUserThunk({ nombreUsuario, password }))
      .unwrap()
      .then(() => {
        // Limpiar los campos después de un registro exitoso
        setnombreUsuario("");
        setPassword("");
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20 font-sans bg-gray-100">
      {!user && (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Login / Register</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setnombreUsuario(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Iniciar Sesion
            </button>
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Registrar
            </button>
          </div>
        </div>
      )}
      {user && <Habitos habitos={habitos} />}
    </div>
  );
}
