import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../db/config";

const BlogTypeSelect = ({ value, setValue }: { value: any; setValue: any }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [input, setInput] = useState(value);

  useEffect(() => {
    const fetchTypes = async () => {
      const snapshot = await getDocs(collection(db, "blog_types"));
      const types = snapshot.docs.map((doc) => doc.data().name);
      setOptions(types);
    };
    fetchTypes();
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (val: string) => {
    setInput(val);
    setValue(val);
  };

  const handleInput = (e: any) => {
    const val = e.target.value;
    setInput(val);
    setValue(val);
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium mb-1">Blog Type</label>
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={input}
        onChange={handleInput}
        placeholder="Search or type to add"
      />
      {input && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 rounded shadow w-full max-h-48 overflow-auto">
          {filtered.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogTypeSelect;
