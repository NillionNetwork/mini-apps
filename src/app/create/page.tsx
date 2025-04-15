// app/create/page.tsx
// Didn't have much time for here so used Gemini.
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ITunesFrame from '@/components/ITunesFrame';
import AppGallery from '@/components/AppGallery';
import AppTable from '@/components/AppTable';
import { AppData, Category } from '@/components/types'; // Import types

// Define the categories - could also be dynamic like on home page if needed
const AVAILABLE_CATEGORIES: Category[] = [
  'AI',
  'Consumer',
  'Finance',
  'Games',
  'DevTools',
  'Security',
  'TEE',
  'Health',
  'zk',
  'DeFi',
  'DAO',
  'Nostalgia',
  'Productivity',
  'Utilities',
  'Media', // Ensure all categories from JSON are here
].sort();

export default function CreatePage() {
  // === State ===
  const [apps, setApps] = useState<AppData[]>([]); // Holds the master list of apps being edited
  const [currentAppId, setCurrentAppId] = useState<string | null>(null); // ID of the app selected in the editor list
  const [formData, setFormData] = useState<Partial<AppData>>({}); // Holds data for the app being edited in the form
  const [isLoading, setIsLoading] = useState(true);

  // State specifically for the *preview* ITunesFrame
  const [previewSelectedCategory, setPreviewSelectedCategory] = useState<
    string | null
  >(null);
  const [previewSelectedAppId, setPreviewSelectedAppId] = useState<
    string | null
  >(null); // ID of app selected *within* the preview pane
  const [previewCurrentIndex, setPreviewCurrentIndex] = useState(0); // Index for AppGallery in preview

  // === Data Loading ===
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // *** IMPORTANT: Ensure this filename matches the JSON you want to EDIT ***
        const response = await fetch('/example-data.json'); // Or '/apps-data.json'
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AppData[] = await response.json();
        setApps(data);

        // Select first app by default for editing AND preview
        if (data.length > 0) {
          setCurrentAppId(data[0].id);
          setFormData(data[0]);
          setPreviewSelectedAppId(data[0].id);
        } else {
          setCurrentAppId(null);
          setFormData({});
          setPreviewSelectedAppId(null);
        }
      } catch (error) {
        console.error('Error loading app data for editor:', error);
        // Handle error state appropriately, maybe show a message
        setApps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Load only once on mount

  // === Derived State & Memos ===

  // Get the full data for the app currently being edited in the form
  const currentAppForForm = useMemo(() => {
    return apps.find((app) => app.id === currentAppId) || null;
  }, [apps, currentAppId]);

  // Update formData when the selected app for editing changes
  useEffect(() => {
    if (currentAppForForm) {
      setFormData(currentAppForForm);
    } else {
      setFormData({}); // Clear form if no app is selected
    }
  }, [currentAppForForm]);

  // Calculate categories for the preview sidebar
  const categoriesForPreview = useMemo(() => {
    // Use a predefined list or derive dynamically like the home page
    // return Array.from(new Set(apps.map((app) => app.category)));
    return AVAILABLE_CATEGORIES; // Using predefined list for simplicity here
  }, [apps]); // Re-calculate if apps change, if deriving dynamically

  // Filter apps for the preview pane based on the preview's selected category
  const filteredAppsForPreview = useMemo(() => {
    return previewSelectedCategory
      ? apps.filter((app) => app.category === previewSelectedCategory)
      : apps;
  }, [apps, previewSelectedCategory]);

  // Get the full app data for the item selected *within* the preview pane
  const selectedAppForPreviewHeader = useMemo(() => {
    return apps.find((app) => app.id === previewSelectedAppId);
  }, [apps, previewSelectedAppId]);

  // === Event Handlers ===

  // Handle changes in the editor form fields
  const handleFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Handle changes in the creator input field (comma separated)
  const handleCreatorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const creators = e.target.value
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean); // Remove empty strings
      setFormData((prev) => ({
        ...prev,
        creator: creators,
      }));
    },
    []
  );

  // Save changes from the form to the main 'apps' state
  const handleSaveApp = useCallback(() => {
    if (!currentAppId) return; // Should not happen if button is enabled correctly

    setApps((prevApps) =>
      prevApps.map(
        (app) =>
          app.id === currentAppId ? ({ ...app, ...formData } as AppData) : app // Apply form changes, assert type
      )
    );
    // Optionally provide user feedback e.g., toast notification
    alert('App updated in state! Copy JSON to save permanently.');
  }, [currentAppId, formData]);

  // Add a new default app to the 'apps' state
  const handleAddApp = useCallback(() => {
    const newId = `new-app-${Date.now()}`;
    const newApp: AppData = {
      id: newId,
      name: 'New App',
      category: AVAILABLE_CATEGORIES[0] || 'AI', // Default to first category or 'AI'
      description: '',
      imageUrl: '', // Use empty string or a default placeholder URL
      demoUrl: '',
      githubUrl: '',
      creator: [],
      hackathon: '', // Add hackathon if it's part of your AppData type
    };

    setApps((prevApps) => [...prevApps, newApp]);
    setCurrentAppId(newId); // Select the new app for editing
    setFormData(newApp); // Load new app data into the form
    setPreviewSelectedAppId(newId); // Also select it in the preview
  }, []);

  // Delete the currently selected app
  const handleDeleteApp = useCallback(() => {
    if (
      !currentAppId ||
      !window.confirm(
        `Are you sure you want to delete "${formData.name || 'this app'}"?`
      )
    ) {
      return;
    }

    setApps((prevApps) => prevApps.filter((app) => app.id !== currentAppId));

    // Select the first app remaining, or clear selection
    const remainingApps = apps.filter((app) => app.id !== currentAppId);
    if (remainingApps.length > 0) {
      setCurrentAppId(remainingApps[0].id);
      setPreviewSelectedAppId(remainingApps[0].id);
    } else {
      setCurrentAppId(null);
      setPreviewSelectedAppId(null);
    }
  }, [currentAppId, formData.name, apps]); // Include apps dependency

  // Copy the current 'apps' state (JSON) to the clipboard
  const handleCopyJson = useCallback(() => {
    navigator.clipboard
      .writeText(JSON.stringify(apps, null, 2))
      .then(() =>
        alert(
          'Current app data (JSON) copied to clipboard! Paste this into your example-data.json file.'
        )
      )
      .catch((err) => console.error('Failed to copy JSON: ', err));
  }, [apps]);

  // Handle app selection *within the preview pane* (from gallery or table)
  const handlePreviewAppSelect = useCallback(
    (app: AppData) => {
      setPreviewSelectedAppId(app.id);
      // Update current index for the preview gallery
      const newIndex = filteredAppsForPreview.findIndex((a) => a.id === app.id);
      if (newIndex !== -1) {
        setPreviewCurrentIndex(newIndex);
      }
    },
    [filteredAppsForPreview]
  ); // Depend on filtered apps

  // Handle category selection *within the preview pane*
  const handlePreviewCategorySelect = useCallback((category: string | null) => {
    setPreviewSelectedCategory(category);
    // Optionally reset preview app selection when category changes?
    // setPreviewSelectedAppId(null);
    // setPreviewCurrentIndex(0);
  }, []);

  // === Render ===
  return (
    <div className='p-4 max-w-[90rem] mx-auto'>
      {' '}
      {/* Increased max-width */}
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Gallery Editor</h1>
        <button
          onClick={handleCopyJson}
          className='bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow'
        >
          Copy JSON to Clipboard
        </button>
      </div>
      {/* Main Layout: Editor | Preview */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* --- Column 1: Editor Panel (App List + Form) --- */}
        <div className='flex flex-col gap-6'>
          {' '}
          {/* Use flex-col to stack List and Form */}
          {/* App List Section */}
          <div className='bg-gray-100 p-4 rounded-lg border shadow-sm'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Apps ({apps.length})</h2>
              <button
                onClick={handleAddApp}
                className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow'
              >
                + Add App
              </button>
            </div>

            {isLoading ? (
              <p>Loading apps...</p>
            ) : apps.length === 0 ? (
              <p className='text-gray-500 italic'>
                No apps yet. Click "+ Add App" to create one.
              </p>
            ) : (
              <div className='max-h-[40vh] overflow-y-auto pr-2 border rounded bg-white'>
                {apps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      setCurrentAppId(app.id);
                      // Also update preview selection when clicking list item
                      setPreviewSelectedAppId(app.id);
                      // Find index in preview context
                      const newIndex = filteredAppsForPreview.findIndex(
                        (a) => a.id === app.id
                      );
                      if (newIndex !== -1) {
                        setPreviewCurrentIndex(newIndex);
                      } else {
                        // If not in current filter, reset index or handle appropriately
                        // Maybe switch preview category? For now, just reset index.
                        setPreviewCurrentIndex(0);
                      }
                    }}
                    className={`p-3 border-b last:border-b-0 cursor-pointer ${
                      currentAppId === app.id
                        ? 'bg-blue-100 border-l-4 border-l-blue-500' // Highlight selected for editing
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className='font-semibold'>
                      {app.name || '(Untitled)'}
                    </div>
                    <div className='text-sm text-gray-600'>{app.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* App Editor Form Section */}
          {currentAppId &&
            !isLoading && ( // Show form only when an app is selected and not loading
              <div className='bg-white p-4 rounded-lg border shadow-sm'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-lg font-semibold'>
                    Edit App:{' '}
                    <span className='font-normal'>{formData.name || ''}</span>
                  </h2>
                  <button
                    onClick={handleDeleteApp}
                    className='text-red-600 hover:text-red-800 text-sm'
                    title='Delete App'
                  >
                    Delete
                  </button>
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className='space-y-4'
                >
                  {/* ID (Read Only) */}
                  <div>
                    <label
                      htmlFor={`id-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      ID
                    </label>
                    <input
                      id={`id-${currentAppId}`}
                      type='text'
                      name='id'
                      value={formData.id || ''}
                      readOnly
                      className='w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed'
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor={`name-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Name
                    </label>
                    <input
                      id={`name-${currentAppId}`}
                      type='text'
                      name='name'
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor={`category-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Category
                    </label>
                    <select
                      id={`category-${currentAppId}`}
                      name='category'
                      value={formData.category || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded bg-white focus:ring-blue-500 focus:border-blue-500'
                    >
                      {AVAILABLE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor={`description-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Description
                    </label>
                    <textarea
                      id={`description-${currentAppId}`}
                      name='description'
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      rows={4}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label
                      htmlFor={`imageUrl-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Image URL
                    </label>
                    <input
                      id={`imageUrl-${currentAppId}`}
                      type='url'
                      name='imageUrl'
                      placeholder='https://...'
                      value={formData.imageUrl || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label
                      htmlFor={`githubUrl-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      GitHub URL
                    </label>
                    <input
                      id={`githubUrl-${currentAppId}`}
                      type='url'
                      name='githubUrl'
                      placeholder='https://github.com/...'
                      value={formData.githubUrl || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* Demo URL */}
                  <div>
                    <label
                      htmlFor={`demoUrl-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Demo URL
                    </label>
                    <input
                      id={`demoUrl-${currentAppId}`}
                      type='url'
                      name='demoUrl'
                      placeholder='https://...'
                      value={formData.demoUrl || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* Creators */}
                  <div>
                    <label
                      htmlFor={`creators-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Creators (comma separated)
                    </label>
                    <input
                      id={`creators-${currentAppId}`}
                      type='text'
                      name='creator' // Name matches state structure
                      value={
                        Array.isArray(formData.creator)
                          ? formData.creator.join(', ')
                          : ''
                      }
                      onChange={handleCreatorChange}
                      placeholder='Alice, Bob...'
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* Hackathon */}
                  <div>
                    <label
                      htmlFor={`hackathon-${currentAppId}`}
                      className='block text-sm font-medium mb-1'
                    >
                      Hackathon
                    </label>
                    <input
                      id={`hackathon-${currentAppId}`}
                      type='text'
                      name='hackathon'
                      value={formData.hackathon || ''}
                      onChange={handleFormChange}
                      className='w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>

                  {/* Save Button */}
                  <div className='flex justify-end pt-4'>
                    <button
                      type='button' // Use type="button" if not submitting a form traditionally
                      onClick={handleSaveApp}
                      className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow disabled:opacity-50'
                      // disabled={!currentAppId} // Button is only visible when currentAppId exists
                    >
                      Update App State
                    </button>
                  </div>
                </form>
              </div>
            )}
          {/* Show message if no app selected for editing */}
          {!currentAppId && !isLoading && (
            <div className='text-center text-gray-500 p-4 bg-white rounded-lg border shadow-sm'>
              {apps.length > 0
                ? 'Select an app from the list above to edit.'
                : 'Add an app to get started.'}
            </div>
          )}
        </div>
        {/* --- Column 2: Live Preview Panel --- */}
        <div className='sticky top-4 h-[calc(100vh-4rem)] overflow-hidden'>
          <div>
            <ITunesFrame
              // Pass the app selected *in the preview* to the header
              currentApp={
                selectedAppForPreviewHeader
                  ? {
                      name: selectedAppForPreviewHeader.name,
                      category: selectedAppForPreviewHeader.category,
                    }
                  : undefined
              }
              categories={categoriesForPreview}
              selectedCategory={previewSelectedCategory}
              onSelectCategory={handlePreviewCategorySelect} // Use preview-specific handler
              totalItems={filteredAppsForPreview.length}
            >
              {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                  <p className='text-xl text-gray-300'>Loading preview...</p>
                </div>
              ) : filteredAppsForPreview.length === 0 ? (
                <div className='flex items-center justify-center h-64'>
                  <p className='text-xl text-gray-300'>
                    No apps match the selected category.
                  </p>
                </div>
              ) : (
                <div className='p-6'>
                  {/* Match padding from home page? */}
                  <AppGallery
                    apps={filteredAppsForPreview}
                    selectedApp={selectedAppForPreviewHeader} // Pass app selected in preview
                    onSelectApp={handlePreviewAppSelect} // Use preview-specific handler
                    currentIndex={previewCurrentIndex}
                  />
                  <div className='mt-8'>
                    <AppTable
                      apps={filteredAppsForPreview}
                      selectedAppId={previewSelectedAppId} // Pass ID selected in preview
                      onSelectApp={handlePreviewAppSelect} // Use preview-specific handler
                    />
                  </div>
                </div>
              )}
            </ITunesFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
