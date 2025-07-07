export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="m-2 px-4 py-2 border border-gray-300 rounded w-full"
    />
  );
}