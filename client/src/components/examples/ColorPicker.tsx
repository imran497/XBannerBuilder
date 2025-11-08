import { useState } from "react";
import ColorPicker from "../ColorPicker";

export default function ColorPickerExample() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="p-6">
      <ColorPicker color={color} onChange={setColor} label="Choose Color" />
    </div>
  );
}
