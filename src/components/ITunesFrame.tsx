'use client';

import React from 'react';
import { Category } from './types';

interface ITunesFrameProps {
  children: React.ReactNode;
  currentApp?: {
    name: string;
    category: string;
  };
  categories?: Category[];
  selectedCategory: string | null;
  editorMode?: boolean;
  onSelectCategory: (category: string | null) => void;
  totalItems: number;
}

export default function ITunesFrame({
  children,
  currentApp,
  categories = [],
  selectedCategory,
  editorMode,
  onSelectCategory,
  totalItems = 0,
}: ITunesFrameProps) {
  return (
    <div
      className='w-full max-w-6xl mx-auto my-12 overflow-hidden rounded-lg'
      style={{
        boxShadow: `
          0 1px 2px rgba(0, 0, 0, 0.07), 
          0 2px 4px rgba(0, 0, 0, 0.07), 
          0 4px 8px rgba(0, 0, 0, 0.07), 
          0 8px 16px rgba(0, 0, 0, 0.07),
          0 16px 32px rgba(0, 0, 0, 0.07), 
          0 32px 64px rgba(0, 0, 0, 0.15)
        `,
        transform: 'translateY(0)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* iTunes-like silver metallic header with controls */}
      <div className='bg-gradient-to-b from-gray-300 to-gray-400 px-4 py-2 border-b border-gray-500 flex items-center'>
        <div className='flex space-x-2'>
          <div className='w-3 h-3 rounded-full bg-red-500 border border-red-600'></div>
          <div className='w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500'></div>
          <div className='w-3 h-3 rounded-full bg-green-400 border border-green-500'></div>
        </div>

        <div className='flex-1 text-center text-gray-700 font-medium'>
          Nillion Mini App
        </div>
      </div>

      {/* Main content area with sidebar and content */}
      <div className='flex'>
        {/* Blue sidebar - like iTunes */}
        {editorMode === false && (
          <div className='w-64 bg-[#D3DDE6] text-white p-2 hidden md:block'>
            <div className='mb-6'>
              <h3 className='text-xs font-semibold text-[#798592] px-2 mb-2'>
                LIBRARY
              </h3>
              <div className='font-medium text-sm space-y-1'>
                <div
                  className={`px-2 py-1 ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-400 text-black'
                  } rounded cursor-pointer`}
                  onClick={() => onSelectCategory(null)}
                >
                  All Apps
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-xs font-semibold text-[#798592] px-2 mb-2'>
                CATEGORIES
              </h3>
              <div className='font-medium text-sm space-y-1 overflow-y-auto'>
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-2 py-1 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-400 text-black'
                    } rounded cursor-pointer`}
                    onClick={() => onSelectCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className='flex-1 bg-black'>{children}</div>
      </div>

      {/* iTunes-like footer with status bar */}
      <div className='bg-gradient-to-b from-gray-400 to-gray-500 px-4 py-1 border-t border-gray-600 flex items-center justify-between text-xs text-gray-800'>
        <div>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </div>
      </div>
    </div>
  );
}
