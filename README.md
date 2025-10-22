# NexoPay Website

A modern React application built with JavaScript and Tailwind CSS.

## Features

- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for styling
- ⚡ Vite for fast development and building
- 🔧 ESLint for code quality
- 📱 Responsive design

## Getting Started

### Prerequisites

Make sure you have Node.js installed (version 16 or higher).

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
nexopay-website/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Technologies Used

- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Development

The project uses Vite for fast development with hot module replacement. All React components are in the `src/` directory, and you can start building your application by modifying `src/App.jsx`.

Tailwind CSS is configured and ready to use. You can apply utility classes directly in your JSX components.
