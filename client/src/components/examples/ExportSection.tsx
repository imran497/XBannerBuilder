import { useState } from "react";
import ExportSection from "../ExportSection";

export default function ExportSectionExample() {
  const [showSafeZone, setShowSafeZone] = useState(false);

  return (
    <div className="w-80 bg-sidebar">
      <ExportSection
        showSafeZone={showSafeZone}
        onSafeZoneToggle={setShowSafeZone}
        onExport={() => console.log("Export clicked")}
      />
    </div>
  );
}
