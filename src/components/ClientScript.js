'use client';

import { useEffect } from 'react';

export default function ClientScript() {
  useEffect(() => {
    // Create and load the first script
    const script = document.createElement('script');
    script.src = 'https://422c26e9.feedback-widget-u8y.pages.dev/widget.js';
    script.setAttribute(
      'data-server-url',
      'https://feedback-widget-orrr.onrender.com'
    );

    // Set up onload handler for first script
    script.onload = () => {
      // Check if the widget function exists
      if (window.embed_feedback_widget) {
        // Initialize the widget
        window
          .embed_feedback_widget('init', 'g9rj-3ctk-fneu')
          .then((config) => {
            console.log('Widget initialized with config:', config);
          });
      }
    };

    // Add script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
