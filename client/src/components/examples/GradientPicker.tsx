import { useState } from "react";
import GradientPicker, { Gradient } from "../GradientPicker";

export default function GradientPickerExample() {
  const [gradient, setGradient] = useState<Gradient>({
    type: "linear",
    angle: 135,
    stops: [
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 }
    ]
  });

  return (
    <div className="p-6 max-w-md">
      <GradientPicker gradient={gradient} onChange={setGradient} />
    </div>
  );
}
