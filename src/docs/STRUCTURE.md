# NexoPay Website - Project Structure

## 📁 Directory Structure

```
nexopay-website/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Common components (Hero, Features, etc.)
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   └── index.js          # Component exports
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── NotFound.jsx
│   │   └── index.js          # Page exports
│   ├── hooks/                 # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   ├── useApi.js
│   │   ├── useDebounce.js
│   │   ├── useToggle.js
│   │   └── index.js          # Hook exports
│   ├── utils/                 # Utility functions
│   │   ├── format.js         # Formatting utilities
│   │   ├── validation.js     # Validation utilities
│   │   ├── helpers.js        # General helpers
│   │   └── index.js          # Utility exports
│   ├── api/                  # API layer
│   │   ├── services/         # API services
│   │   │   ├── authService.js
│   │   │   ├── paymentService.js
│   │   │   └── contactService.js
│   │   ├── endpoints.js      # API endpoints
│   │   └── index.js          # API exports
│   ├── context/              # React Context providers
│   │   ├── AuthContext.jsx   # Authentication context
│   │   ├── ThemeContext.jsx  # Theme context
│   │   └── index.js          # Context exports
│   ├── constants/            # Application constants
│   │   ├── app.js           # App configuration
│   │   ├── messages.js      # Messages and text
│   │   └── index.js          # Constant exports
│   ├── assets/               # Static assets
│   │   ├── images/          # Image files
│   │   ├── icons/           # Icon files
│   │   └── fonts/           # Font files
│   ├── styles/               # Global styles
│   │   └── globals.css       # Global CSS with Tailwind
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Application entry point
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite configuration
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── env.example               # Environment variables example
└── README.md                 # Project documentation
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Components**: UI components organized by functionality
- **Pages**: Route-level components
- **Hooks**: Reusable state logic
- **Utils**: Pure functions and helpers
- **API**: Data fetching and service layer
- **Context**: Global state management

### 2. **Scalability**
- Modular structure that grows with the project
- Clear separation between business logic and UI
- Reusable components and hooks
- Centralized configuration

### 3. **Maintainability**
- Consistent naming conventions
- Index files for clean imports
- Clear file organization
- Comprehensive documentation

## 📦 Key Features

### **Components Structure**
- **Layout**: Header, Footer, Navigation
- **Common**: Reusable UI components
- **Forms**: Form-specific components

### **Custom Hooks**
- `useLocalStorage`: Local storage management
- `useApi`: API call handling
- `useDebounce`: Debounced values
- `useToggle`: Toggle state management

### **API Layer**
- **Services**: Business logic for API calls
- **Endpoints**: Centralized URL management
- **Error Handling**: Consistent error management

### **State Management**
- **AuthContext**: Authentication state
- **ThemeContext**: Theme management
- **Local Storage**: Persistent data

### **Utilities**
- **Format**: Data formatting functions
- **Validation**: Input validation
- **Helpers**: General utility functions

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📝 Best Practices

### **File Naming**
- Components: PascalCase (e.g., `Header.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useLocalStorage.js`)
- Utils: camelCase (e.g., `format.js`)
- Constants: camelCase (e.g., `app.js`)

### **Import Organization**
- Use index files for clean imports
- Group imports: React, third-party, local
- Use named exports for better tree-shaking

### **Component Structure**
- One component per file
- Export components at the bottom
- Use functional components with hooks

### **State Management**
- Use Context for global state
- Use local state for component-specific data
- Use custom hooks for reusable logic

This structure provides a solid foundation for a scalable React application with modern best practices.
