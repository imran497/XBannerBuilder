import { useState } from "react";
import BannerCanvas from "../BannerCanvas";

export default function BannerCanvasExample() {
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [background] = useState("#3b82f6");

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={() => setShowSafeZone(!showSafeZone)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Toggle Safe Zone
        </button>
      </div>
      <BannerCanvas background={background} showSafeZone={showSafeZone} />
    </div>
  );
}
