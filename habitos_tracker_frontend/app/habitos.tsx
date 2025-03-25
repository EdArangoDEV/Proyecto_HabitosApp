import { useSelector, useDispatch } from "react-redux";
import { markAsDoneThunk } from "@/features/habito/habitoSlice";
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

const handleMarkAsDone = (habitoId: string, dispatch:AppDispatch) => {
  dispatch(markAsDoneThunk(habitoId));
  dispatch(fetchHabitosThunk());
}


export default function Habitos({ habitos }: HabitosProps) {

  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.habito.status);
  const error = useSelector((state: RootState) => state.habito.error);  

  const calcularProgreso = (days: number) : number => {
    return Math.min((days / 66) * 100, 100);
  };


  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Habitos</h1>
      <ul className="space-y-4">
        {habitos.map((habito:Habitos) => (
          <li className="flex items-center justify-between" key={habito.titulo}>
            <span className="text-black">{habito.titulo}</span>
            <div className="flex items-center space-x-2">
            <progress
                className="w-24"
                value= {calcularProgreso(habito.days)}
                max="100"
              ></progress>
              <button
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                onClick={() => handleMarkAsDone(habito._id, dispatch)}
              > {status[habito._id] === "loading" ? "Processing" : "Done"}
              </button>
              {status[habito._id] === "failed" && (
                <span className="text-red-500">{error[habito._id]}</span>
              )}
              {status[habito._id] === "success" && (
                <span className="text-green-500">Marcado como hecho</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
