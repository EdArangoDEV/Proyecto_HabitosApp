import { addHabito } from "@/features/habito/habitoSlice";

type Habitos = {
  titulo: string;
  descripcion: string;
};

type HabitosProps = {
  habitos: Habitos[];
};

export default function Habitos({ habitos }: HabitosProps) {
  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">Habitos</h1>
      <ul className="space-y-4">
        {habitos.map((habito:Habitos) => (
          <li className="flex items-center justify-between" key={habito.titulo}>
            <span className="text-black">{habito.titulo}</span>
            <div className="flex items-center space-x-2">
              <progress className="w-24" value="50" max="100"></progress>
              <button className="px-2 py-1 text-sm text-white bg-blue-500 rounded">Done</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
