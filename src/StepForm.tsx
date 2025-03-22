import { useState } from "react";

type StepFormProps = {
  onAddStep: (date: string, distance: number) => void;
};

export default function StepForm({ onAddStep }: StepFormProps) {
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDistance = parseFloat(distance);
    if (!date || isNaN(parsedDistance) || parsedDistance <= 0) return;

    onAddStep(date, parsedDistance);
    setDate("");
    setDistance("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="Км"
        required
      />
      <button type="submit">OK</button>
    </form>
  );
}
