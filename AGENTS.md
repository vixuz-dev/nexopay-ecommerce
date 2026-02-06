# NexoPay E-commerce — AGENTS.md

# ⚠️ AI AGENT CONTRACT — MANDATORY

This file defines STRICT, NON-NEGOTIABLE rules.

⚠️ PRIORITY NOTICE  
If there is any conflict between:
- explicit user instructions (chat prompt)
- this AGENTS.md file
- existing code or patterns

YOU MUST FOLLOW THE USER INSTRUCTIONS FIRST.

If there is no conflict, YOU MUST FOLLOW THIS FILE.

Do NOT invent architecture.  
Do NOT introduce new patterns.  
Do NOT bypass these rules.

This file is written EXCLUSIVELY for AI coding agents (Cursor, Copilot, GPT, etc.).

---

## 🎯 PURPOSE

This document defines the **governance rules** for the NexoPay E-commerce frontend codebase.

Your goal as an AI agent is to:
- Preserve architecture
- Follow existing patterns
- Make minimal, correct changes
- Avoid creativity that breaks consistency

If something is not defined here, FOLLOW EXISTING PROJECT PATTERNS.

---

## 🧠 PRIORITY ORDER (Highest → Lowest)

1. Explicit user instructions
2. Architectural rules (routes, endpoints, services)
3. Existing project patterns
4. State management rules
5. Code style rules
6. Performance optimizations
7. New abstractions

If a change violates a higher-priority rule, DO NOT APPLY IT.

---

## 🚀 DEV ENVIRONMENT SETUP

### Prerequisites
- Node.js >= 18
- npm or pnpm

### Commands
```bash
npm install
npm run dev
```

App runs at: `http://localhost:5173`

### Environment Variables
- Copy `env.example` → `.env`
- Required:
  - `VITE_API_BASE_URL`
  - `VITE_APP_VERSION`

---

## 📁 PROJECT STRUCTURE (DO NOT MODIFY)

```
src/
├── api/
│   ├── endpoints.js
│   └── services/
├── components/
│   ├── account/
│   ├── common/
│   ├── credit/
│   ├── ecommerce/
│   ├── forms/
│   ├── invoices/
│   ├── layout/
│   └── sections/
├── constants/
│   └── app.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/
├── pages/
├── schemas/
├── stores/
│   ├── cartStore.js
│   ├── creditFormStore.js
│   └── uiStore.js
├── styles/
│   └── globals.css
└── utils/
    ├── routes.js
    ├── format.js
    ├── validation.js
    └── creditUtils.js
```

- Folder structure is **LOCKED**
- DO NOT move files
- DO NOT rename folders
- DO NOT introduce new top-level directories

---

## 🏛️ HIGH-LEVEL ARCHITECTURE

```
UI Components
   ↓
Custom Hooks
   ↓
Zustand / Context
   ↓
Services
   ↓
API (via centralized endpoints)
```

---

## 🔒 ROUTING RULES (HARD RULES)

- ALL routes MUST be imported from `src/utils/routes.js`
- HARD-CODED route strings are FORBIDDEN
- If a route is missing, ADD IT to `routes.js` before use

```jsx
// ❌ FORBIDDEN
navigate('/login')

// ✅ REQUIRED
navigate(ROUTES.LOGIN)
```

---

## API & ENDPOINT RULES

- ALL API URLs MUST be defined in `src/api/endpoints.js`
- HARD-CODED URLs are FORBIDDEN
- Services MUST reference endpoints only via `ENDPOINTS.*`

---

## SERVICE LAYER RULES (VERY IMPORTANT)

### Services MUST:
- Perform API calls only
- Parse API responses
- Normalize API errors

### Services MUST NOT:
- Validate inputs
- Contain business rules
- Access UI state
- Access Zustand stores
- Access React Context
- Access `localStorage` or `sessionStorage`

---

## STATE MANAGEMENT RULES

- Zustand is used for everything related with the application state


Rules:
- NEVER mutate state directly
- ALWAYS use store actions or setters
- DO NOT introduce new state management libraries

---

## COMPONENT RULES

- One component per file
- Components MUST have a single responsibility
- Components over ~300 lines SHOULD be split
- Business logic SHOULD be extracted to hooks
- UI-only components MUST remain presentational

---

## SAFE DEFAULTS

When multiple valid solutions exist, choose:
- Existing patterns over new ones
- Duplication over premature abstraction
- Readability over cleverness
- Explicit code over magic

---

## WHEN UNSURE

1. Search the codebase for similar patterns
2. Copy the closest existing implementation
3. Adapt naming minimally
4. DO NOT introduce new libraries
5. DO NOT refactor unrelated code

---

## FORBIDDEN ACTIONS

- Creating routes without updating `routes.js`
- Hardcoding routes or endpoints
- Adding validations inside services
- Introducing new architectural patterns
- Introducing new state management solutions
- Refactoring unrelated files
- Changing folder structure
- Logging sensitive data

---

## SECURITY RULES

- NEVER log sensitive information
- NEVER expose raw backend errors to users
- NEVER store sensitive data in plain localStorage
- All user-facing errors must be user-friendly

---

## STYLING RULES

- Tailwind CSS utilities ONLY
- Use project palette:
  - `primary-*`
  - `secondary-*`
  - `highlight-*`
  - `neutral-*`
- Responsive prefixes: `sm: md: lg: xl:`
- Custom CSS ONLY in `globals.css` when unavoidable

---

##  NAMING RULES

- Components: PascalCase
- Hooks: `useSomething.js`
- Utils: camelCase
- Services: camelCase
- Stores: camelCase + `Store`

Additional:
- `index.js` files MUST be barrel exports only
- `index.js` MUST NOT contain business logic

---

##  TESTING EXPECTATIONS

- Critical business logic MUST be testable
- Utility functions SHOULD be unit-test friendly
- Bug fixes SHOULD include regression coverage when feasible

---

##  IMPORT ORDER (MANDATORY)

```jsx
// 1. React
import React from 'react';

// 2. Third-party
import { motion } from 'framer-motion';

// 3. Internal
import { ROUTES } from '../utils/routes';
import { authService } from '../api/services/authService';
```

---

## 📦 AVAILABLE SCRIPTS

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

##  DEBUGGING RULES

- Hardcoded routes:
  `grep -r 'to="/' src/`
- Hardcoded URLs:
  `grep -r 'http://' src/`

---

##  PR VALIDATION CHECKLIST

A change is VALID ONLY IF:
- No architectural rules are violated
- No hardcoded routes or endpoints exist
- Existing patterns are preserved
- No forbidden actions were performed
- Code passes linting

---

##  TL;DR — TOP RULES (FAST CONTEXT)

- User instructions override this file
- NEVER hardcode routes or endpoints
- Routes → `utils/routes.js`
- Endpoints → `api/endpoints.js`
- Services = API only (no validation, no logic)
- Do NOT invent architecture
- Follow existing patterns
- Keep changes minimal
- Do NOT refactor unrelated code

---

##  SUCCESS CRITERIA

Your output is correct ONLY IF:
- Architecture remains intact
- No new patterns are introduced
- Code is minimal and consistent
- Changes are scoped strictly to the request

Failure to follow these rules is considered an incorrect solution.

## 🔌 API SERVICE CREATION RULES (BACKEND INTEGRATION)

This section defines the STRICT rules for creating or modifying API services used to communicate with backend systems.

---

### 🧱 REQUIRED FILE FLOW

1. Define endpoint(s) in `src/api/endpoints.js`
2. Implement service in `src/api/services/<domain>Service.js`
3. Define schemas in `src/schemas/<domain>.schema.js` (if applicable)
4. Consume via hook in `src/hooks/use<Domain>.js` (if applicable)
5. Use stores ONLY if global state is required

Skipping steps is NOT allowed.

---

### 🔒 ENDPOINT DEFINITION RULES

- Endpoints MUST be grouped by domain
- Names MUST be uppercase and explicit
- HARD-CODED URLs are FORBIDDEN

---

### 🔒 SERVICE IMPLEMENTATION RULES

Services MUST:
- Use shared API client
- Return parsed backend data
- Normalize errors

Services MUST NOT:
- Validate inputs
- Contain business logic
- Access UI or browser storage

---

### 🚨 ERROR NORMALIZATION SHAPE

```js
{
  code: string,
  message: string,
  status: number,
  details?: any,
  traceId?: string | null
}
```

---

### 🧾 API SERVICE CREATION CHECKLIST

- [ ] Endpoint added
- [ ] Service created
- [ ] Shared API client used
- [ ] Errors normalized
- [ ] No hardcoded URLs
- [ ] No validations in service

---

## 🧠 TL;DR — TOP RULES

- User instructions override this file
- NEVER hardcode routes or endpoints
- Services = API only
- Follow existing patterns
- Keep changes minimal


## COMMENTS

- Don't create any comment between small componentes
- just create comments on functions documentation

---


Architecture remains intact. No new patterns introduced.

END OF CONTRACT.