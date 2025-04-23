# Nillion Mini App Showcase

An interactive web component that displays applications in a Cover Flow-like interface, inspired by the classic iTunes Cover Flow. Built with Next.js, Framer Motion for animations, and Tailwind CSS for styling.

## Features

- Cover Flow gallery view with smooth animations and transitions
- Category filtering via sidebar
- Detailed app information display
- Responsive design

## Technologies Used

- Next.js
- TypeScript
- Framer Motion for animations
- Tailwind CSS for styling

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Structure

- `public/apps-data.json` - Sample application data
- `src/app` - Next.js app directory
- `src/components` - Reusable UI components
- `src/components/AppGallery.tsx` - Main Cover Flow gallery component
- `src/components/CategorySidebar.tsx` - Category filter sidebar
- `src/components/AppDetails.tsx` - App details display

## Customization

To add or modify applications, edit the `public/apps-data.json` file following the existing schema.

## Contribution
- In order to get your Nillion app added to the application, make a PR request to `public/apps-data.json` with the following fields
```
  {
    "id": "autonomousyield",
    "name": "AutonomousYield",
    "category": "XXX",
    "description": "XXX",
    "imageUrl": null, // optional - if if you want to add an image, upload it via i.postimg.cc as per the next.config.js file
    "demoUrl": "XXX",
    "githubUrl": "XXX",
    "creator": ["XXX"],
    "hackathon": "XXX" // optional - if no hackathon, just add false
  }
```
