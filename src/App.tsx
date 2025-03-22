import { useState, useEffect } from "react";

type Step = {
  date: string;
  distance: number;
};

export default function App() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);

  useEffect(() => {
    const savedSteps = localStorage.getItem("steps");
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("steps", JSON.stringify(steps));
  }, [steps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDistance = parseFloat(distance);
    if (!date || isNaN(parsedDistance) || parsedDistance <= 0) return;

    setSteps((prevSteps) => {
      if (editMode && editDate) {
        // Редактирование записи
        return prevSteps.map((step) =>
          step.date === editDate ? { date, distance: parsedDistance } : step
        );
      } else {
        // Добавление новой записи или обновление существующей
        const existingIndex = prevSteps.findIndex((step) => step.date === date);
        if (existingIndex !== -1) {
          const updatedSteps = [...prevSteps];
          updatedSteps[existingIndex].distance += parsedDistance;
          return updatedSteps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return [...prevSteps, { date, distance: parsedDistance }].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    });

    setDate("");
    setDistance("");
    setEditMode(false);
    setEditDate(null);
  };

  const handleDelete = (dateToRemove: string) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step.date !== dateToRemove));
  };

  const handleEdit = (step: Step) => {
    setDate(step.date);
    setDistance(step.distance.toString());
    setEditMode(true);
    setEditDate(step.date);
  };

  return (
    <div>
      <h1>Учёт тренировок</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Км" required />
        <button type="submit">{editMode ? "Сохранить" : "OK"}</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Пройдено км</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.date}>
                <td>{step.date}</td>
                <td>{step.distance}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(step)}>✎</button>
                  <button className="delete-button" onClick={() => handleDelete(step.date)}>✘</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
