'use client';

import { AppData } from './types';
import { motion } from 'framer-motion';

interface AppDetailsProps {
  app: AppData;
}

export default function AppDetails({ app }: AppDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={app.id}
      className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{app.name}</h2>
      <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm mb-4">
        {app.category}
      </div>
      
      <p className="text-gray-600 mb-6">{app.description}</p>
      
      <div className="flex flex-wrap gap-4">
        {app.demoUrl && (
          <a
            href={app.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-colors shadow-sm"
          >
            <span className="mr-2">✨</span>
            View Demo
          </a>
        )}
        
        {app.githubUrl && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-md transition-colors shadow-sm border border-gray-300"
          >
            <span className="mr-2">🔍</span>
            View Code
          </a>
        )}
      </div>
    </motion.div>
  );
}