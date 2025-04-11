'use client';

import { Category } from './types';
import { motion } from 'framer-motion';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-md overflow-hidden">
      <div className="bg-gradient-to-b from-gray-200 to-gray-300 px-4 py-2 border-b border-gray-300">
        <h2 className="text-gray-800 font-semibold">Categories</h2>
      </div>
      
      <ul className="py-2">
        <li key="all">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-4 py-2 transition-colors text-sm ${
              selectedCategory === null
                ? 'bg-blue-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Apps
          </button>
        </li>
        
        {categories.map((category) => (
          <motion.li
            key={category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-4 py-2 transition-colors text-sm ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}