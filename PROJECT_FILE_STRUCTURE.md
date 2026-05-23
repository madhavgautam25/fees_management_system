# Project File Structure - Tiny Gems School Fees Management

## Complete File Organization

```
client/
├── src/
│   ├── App.tsx                          # Main app routing & provider setup
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Global styles & theme variables
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── StatCard.tsx            # Reusable statistics card component
│   │   │
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx     # Sidebar + navigation layout with export/import
│   │   │
│   │   └── ui/                         # shadcn/ui components (pre-built)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       ├── sheet.tsx
│   │       ├── avatar.tsx
│   │       └── ... (more ui components)
│   │
│   ├── context/
│   │   └── AppContext.tsx              # Global app state (auth, students, fees)
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── queryClient.ts              # React Query setup
│   │   ├── utils.ts                    # Utility functions
│   │   └── storage.ts                  # localStorage persistence layer
│   │
│   └── pages/
│       ├── auth/
│       │   └── Login.tsx               # Role-based login page
│       │
│       ├── dashboard/
│       │   └── Dashboard.tsx           # Home page with stats & charts
│       │
│       ├── students/
│       │   └── StudentList.tsx         # Student management CRUD
│       │
│       ├── fees/
│       │   └── Fees.tsx                # Monthly fee tracking & payment
│       │
│       ├── reports/
│       │   └── Reports.tsx             # Analytics & export functionality
│       │
│       └── not-found.tsx               # 404 page
│
├── index.html                           # HTML entry point with meta tags
└── public/
    └── favicon.png                      # App icon

ROOT/
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript config
├── vite.config.ts                       # Vite build config
├── tailwind.config.ts                   # Tailwind configuration
├── postcss.config.js                    # PostCSS configuration
│
├── DATABASE_STRUCTURE.md                # Database schema documentation
├── PROJECT_FILE_STRUCTURE.md            # This file
└── sample_db.json                       # Sample exported database
```

## Key Files Description

### Configuration Files
- **package.json**: All dependencies & npm scripts
- **vite.config.ts**: Frontend build configuration
- **tsconfig.json**: TypeScript settings
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.js**: CSS post-processing

### Context & State Management
- **AppContext.tsx**: Centralized state for users, students, fees
  - `useApp()` hook to access state in components
  - Login/logout functionality
  - CRUD operations for students & fees
  - Export/import data methods

### Storage & Persistence
- **storage.ts**: Browser localStorage wrapper
  - `storage.getStudents()` / `storage.saveStudents()`
  - `storage.getFees()` / `storage.saveFees()`
  - `storage.exportData()` - Download as JSON
  - `storage.importData()` - Load from JSON

### Page Components
1. **Login.tsx** - Authentication (mock-based)
   - Admin, Principal, Teacher roles
   - Quick access buttons for each role

2. **Dashboard.tsx** - Home page
   - Key statistics (students, collected fees, pending)
   - Bar charts for fee trends
   - Recent payment activity

3. **StudentList.tsx** - Student management
   - View all students (filtered by role)
   - Add new student dialog
   - Search & filter by class
   - Export to CSV

4. **Fees.tsx** - Fee tracking
   - Monthly fee status by student
   - Mark paid/Clear buttons
   - Send SMS reminder (mock)
   - Filter by month & class

5. **Reports.tsx** - Analytics
   - Class-wise fee collection chart
   - Paid vs Unpaid pie chart
   - PDF download
   - Share on WhatsApp (mock)

### Layout Components
- **DashboardLayout.tsx** - Main layout
  - Sidebar navigation
  - User profile section
  - Export/Import buttons (Admin only)
  - Mobile responsive

### UI Components (shadcn/ui)
Pre-built accessible components:
- Button, Card, Input, Label
- Table, Badge, Avatar
- Select, Dialog, Sheet
- And many more...

## Data Flow

```
User Login
    ↓
AppContext (Sets current user)
    ↓
DashboardLayout (Shows sidebar based on role)
    ↓
Pages (Render based on user role)
    ↓
Components (Use useApp() to access/update state)
    ↓
storage.ts (Saves to localStorage)
    ↓
Data persists across sessions
```

## Accessing Data

### In React Components:
```jsx
import { useApp } from "@/context/AppContext";

function MyComponent() {
  const { user, students, fees, markFeePaid } = useApp();
  
  // Use data here
}
```

### Directly in Browser Console:
```javascript
// Get all students
JSON.parse(localStorage.getItem('tinygems_students'))

// Get all fees
JSON.parse(localStorage.getItem('tinygems_fees'))

// Get all users
JSON.parse(localStorage.getItem('tinygems_users'))
```

## Environment & Dependencies

### Key Dependencies
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI components)
- react-hook-form
- recharts (for charts)
- wouter (lightweight routing)
- lucide-react (icons)

### Build & Runtime
- Vite (build tool)
- Node.js (runtime)
- npm (package manager)

## Scripts

```bash
npm run dev:client      # Start frontend dev server (port 5000)
npm run build           # Build for production
npm run check           # TypeScript type checking
```
