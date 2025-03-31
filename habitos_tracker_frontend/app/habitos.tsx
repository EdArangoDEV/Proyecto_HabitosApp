import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsDoneThunk,
  fetchAddHabitoThunk,
} from "@/features/habito/habitoSlice";
import { RootState, AppDispatch } from "@/Redux/store";
import { fetchHabitosThunk } from "@/features/habito/habitoSlice";

type Habitos = {
  _id: string;
  titulo: string;
  descripcion: string;
  createdAt: Date;
  days: number;
  lastDone: Date;
  lastUpdated: Date;
};

type HabitosProps = {
  habitos: Habitos[];
};

const handleMarkAsDone = (
  habitoId: string,
  token: string,
  dispatch: AppDispatch
) => {
  dispatch(markAsDoneThunk({ habitoId, token }));
  if (token) {
    dispatch(fetchHabitosThunk(token));
  }
};

export default function Habitos({ habitos }: HabitosProps) {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.habito.status);
  const error = useSelector((state: RootState) => state.habito.error);
  const user = useSelector((state: RootState) => state.user.user);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const calcularProgreso = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };

  const handleAddHabit = async  () => {
    if (!titulo || !descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (titulo && descripcion) {
      try {
        // Agrega el hábito
        await dispatch(
          fetchAddHabitoThunk({
            token: user ? user.toString() : "",
            titulo,
            descripcion,
          })
        );
  
        // Limpia los campos del formulario
        setTitulo("");
        setDescripcion("");
  
        // Obtén la lista actualizada de hábitos
        await dispatch(fetchHabitosThunk(user ? user.toString() : ""));
      } catch (error) {
        console.error("Error al agregar el hábito:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">
        Habitos
      </h1>
      <ul className="space-y-4">
        {habitos.length > 0 ? (
          habitos.map((habito: Habitos) => (
            <li
              className="flex items-center justify-between"
              key={habito.titulo}
            >
              <span className="text-black">{habito.titulo}</span>
              <div className="flex items-center space-x-2">
                <progress
                  className="w-24"
                  value={calcularProgreso(habito.days)}
                  max="100"
                ></progress>
                <button
                  className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                  onClick={() =>
                    handleMarkAsDone(
                      habito._id,
                      user ? user.toString() : "",
                      dispatch
                    )
                  }
                >
                  {" "}
                  {status[habito._id] === "loading" ? "Processing" : "Hecho"}
                </button>
                {status[habito._id] === "failed" && (
                  <span className="text-red-500">{error[habito._id]}</span>
                )}
                {status[habito._id] === "success" && (
                  <span className="text-green-500">Marcado como hecho</span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Habitos no disponibles</li>
        )}
      </ul>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-black">Agregar nuevo habito</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Titulo
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Descripcion
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
          />
        </div>
        <button
          onClick={handleAddHabit}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
