import React from 'react';
import type { CategoryConfig } from "@/models/categoryConfig";
import { getDefaultCategoryConfig } from "@/models/categoryConfig";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryFilterProps) {
  const getCategoryConfig = (category: string) => {
    return getDefaultCategoryConfig(category);
  };

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <button
        onClick={() => onCategorySelect("All")}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm backdrop-blur-md transition-all duration-300 border-2 ${
          selectedCategory === "All"
            ? "bg-blue-400/10 border-blue-400/50 text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]"
            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const config = getCategoryConfig(category);
        return (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all duration-300 border-2 ${
              selectedCategory === category
                ? `${config.colors} border-current shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]`
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            {React.createElement(config.icon, {
              className: "w-3 h-3 sm:w-4 sm:h-4",
            })}
            {category}
          </button>
        );
      })}
    </div>
  );
} 