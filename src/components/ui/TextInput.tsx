type TextInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function TextInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: TextInputProps) {
  return (
    <label className="w-full">
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <input
        className="w-full h-11 rounded-lg bg-gray-200/70 px-4 outline-none focus:ring-2 focus:ring-gray-400"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
