type Habitos = {
  titulo: string;
  descripcion: string;
};

type HabitosProps = {
  habitos: Habitos[];
};

export default function Habitos({ habitos }: HabitosProps) {
  return (
    <ul>
      {habitos.map((habito) => (
        <li key={habito.titulo}>{habito.descripcion}</li>
      ))}
    </ul>
  );
}
