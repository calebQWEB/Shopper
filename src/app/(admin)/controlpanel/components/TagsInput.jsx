"use client";
import { useState } from "react";
import { X } from "lucide-react";

const TagsInput = ({ value = [], onChange, id }) => {
  const [input, setInput] = useState("");

  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !value.includes(newTag)) onChange([...value, newTag]);
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

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5 focus-within:border-headline focus-within:ring-2 focus-within:ring-headline/15">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="text-slate-500 hover:text-rose-600">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          addTag(input);
          setInput("");
        }}
        placeholder={value.length ? "" : "Type a tag and press Enter"}
        className="min-w-[8rem] flex-1 border-none bg-transparent py-1 text-sm outline-none"
      />
    </div>
  );
};

export default TagsInput;
