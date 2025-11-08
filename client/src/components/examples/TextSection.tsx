import TextSection from "../TextSection";

export default function TextSectionExample() {
  return (
    <div className="w-80 bg-sidebar">
      <TextSection 
        selectedTextProperties={null}
        onTextPropertiesChange={() => {}}
      />
    </div>
  );
}
