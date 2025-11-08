import BackgroundSection from "../BackgroundSection";

export default function BackgroundSectionExample() {
  return (
    <div className="w-80 bg-sidebar">
      <BackgroundSection onBackgroundChange={(bg) => console.log("Background:", bg)} />
    </div>
  );
}
