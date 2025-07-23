import React, { useState } from "react";

const TagsInput = ({ value = [], onChange }) => {
  const [input, setInput] = useState("");

  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1)); // Remove last tag
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-300 rounded-xl p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">
      {value.map((tag, index) => (
        <div
          key={index}
          className="bg-[#ebb26c] text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-black hover:text-red-500 text-sm"
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-1 w-full outline-none border-none bg-transparent"
        placeholder="Type and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagsInput;
