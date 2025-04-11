'use client';

import { AppData } from './types';

interface AppTableProps {
  apps: AppData[];
  selectedAppId?: string;
  onSelectApp: (app: AppData) => void;
}

export default function AppTable({
  apps,
  selectedAppId,
  onSelectApp,
}: AppTableProps) {
  return (
    <div className='overflow-hidden border border-gray-700 rounded-md'>
      {/* Table header - fixed */}
      <div className='sticky top-0 z-10 grid grid-cols-12 bg-gradient-to-b from-gray-700 to-gray-800 text-gray-300 text-xs font-medium border-b border-gray-600'>
        <div className='col-span-5 p-2 border-r border-gray-600'>Name</div>
        <div className='col-span-3 p-2 border-r border-gray-600'>Category</div>
        <div className='col-span-2 p-2 border-r border-gray-600'>Demo</div>
        <div className='col-span-2 p-2'>GitHub</div>
      </div>

      {/* Table rows - scrollable with fixed height */}
      <div
        className='h-[200px] overflow-y-auto'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #111827',
        }}
      >
        <div className='min-h-full'>
          {apps.length === 0 ? (
            <div className='flex items-center justify-center h-full text-gray-400'>
              No apps found for this selection
            </div>
          ) : (
            apps.map((app, index) => (
              <div
                key={app.id}
                className={`grid grid-cols-12 text-sm ${
                  app.id === selectedAppId
                    ? 'bg-blue-600 text-white'
                    : index % 2 === 0
                    ? 'bg-gray-900 text-gray-300'
                    : 'bg-black text-gray-300'
                } hover:bg-gray-700 cursor-pointer`}
                onClick={() => onSelectApp(app)}
              >
                <div className='col-span-5 p-2 border-r border-gray-800 truncate'>
                  <div className='flex items-center'>{app.name}</div>
                </div>
                <div className='col-span-3 p-2 border-r border-gray-800 truncate'>
                  {app.category}
                </div>

                <div className='col-span-2 p-2 border-r border-gray-800'>
                  {app.demoUrl !== null ? (
                    <a
                      href={app.demoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      🔗
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
                <div className='col-span-2 p-2'>
                  {app.githubUrl !== null ? (
                    <a
                      href={app.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      🔗
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom scrollbar styling for webkit browsers */}
      <style jsx global>{`
        /* Scrollbar styling for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #111827;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 20px;
          border: 2px solid #111827;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
    </div>
  );
}
