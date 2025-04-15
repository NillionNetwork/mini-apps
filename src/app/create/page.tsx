'use client';

import { useState, useEffect } from 'react';
import { AppData, Category } from '@/components/types';
import AppGallery from '@/components/AppGallery';
import AppTable from '@/components/AppTable';
import ITunesFrame from '@/components/ITunesFrame';
import Image from 'next/image';

export default function Home() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch app data from JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('/example-data.json');
        const data: AppData[] = await response.json();
        setApps(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((app) => app.category))
        );
        setCategories(uniqueCategories);

        // Set default selected app
        if (data.length > 0) {
          setSelectedApp(data[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading app data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter apps by selected category
  const filteredApps = selectedCategory
    ? apps.filter((app) => app.category === selectedCategory)
    : apps;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading || filteredApps.length === 0) return;

      // Find current index
      const index = selectedApp
        ? filteredApps.findIndex((app) => app.id === selectedApp.id)
        : 0;

      if (e.key === 'ArrowLeft' && index > 0) {
        // Navigate to previous app
        setSelectedApp(filteredApps[index - 1]);
        setCurrentIndex(index - 1);
      } else if (e.key === 'ArrowRight' && index < filteredApps.length - 1) {
        // Navigate to next app
        setSelectedApp(filteredApps[index + 1]);
        setCurrentIndex(index + 1);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedApp, filteredApps, isLoading]);

  const handleSelectApp = (app: AppData) => {
    setSelectedApp(app);
    // Update current index when app is selected
    const newIndex = filteredApps.findIndex((a) => a.id === app.id);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <ITunesFrame
        currentApp={
          selectedApp
            ? {
                name: selectedApp.name,
                category: selectedApp.category,
              }
            : undefined
        }
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalItems={filteredApps.length}
      >
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-xl text-gray-300'>Loading gallery...</p>
          </div>
        ) : (
          <div className='p-6'>
            <AppGallery
              apps={filteredApps}
              selectedApp={selectedApp}
              onSelectApp={handleSelectApp}
              currentIndex={currentIndex}
            />

            {/* App Table - displays all visible apps in a table format */}
            <div className='mt-8'>
              <AppTable
                apps={filteredApps}
                selectedAppId={selectedApp?.id}
                onSelectApp={handleSelectApp}
              />
            </div>
          </div>
        )}
      </ITunesFrame>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-center text-gray-500 text-sm'>
          Made by:{' '}
          <a
            className='underline mr-2'
            href='https://x.com/crypblizz'
            target='_blank'
            rel='noopener noreferrer'
          >
            crypblizz
          </a>
          |
          <a
            className='underline ml-2'
            href='https://github.com/NillionNetwork/mini-apps'
            target='_blank'
            rel='noopener noreferrer'
          >
            Github
          </a>
        </p>
      </div>
    </>
  );
}
