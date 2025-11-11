# Star Wars Heroes

A modern React web application for exploring Star Wars characters, their films, and starships. Built with React, TypeScript, and React Flow for interactive graph visualization.

## 🌟 Features

- **Hero List**: Browse all Star Wars characters with pagination
- **Detailed Information**: View comprehensive details about each character
- **Graph Visualization**: Interactive graph showing relationships between heroes, films, and starships
- **Two View Modes**: Switch between text view and graph view
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Material-UI (MUI) for a polished user experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test-starnavi
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=https://sw-api.starnavi.io
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests in watch mode
- `npm test -- --run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## 🛠️ Technologies

### Core
- **React** 19.1.1 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.1.7 - Build tool and dev server

### UI & Styling
- **Material-UI (MUI)** 7.3.5 - Component library
- **Emotion** - CSS-in-JS styling

### Data Management
- **TanStack Query** 5.90.7 - Data fetching, caching, and synchronization
- **Axios** 1.13.2 - HTTP client

### Visualization
- **React Flow** 11.11.4 - Graph visualization library

### Testing
- **Vitest** 4.0.8 - Test runner
- **Testing Library** - React component testing utilities

## 📁 Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── hero-list/        # Hero list feature
│   │   ├── components/   # HeroList, HeroCard
│   │   └── hooks/        # usePeopleQuery
│   └── hero-details/     # Hero details feature
│       ├── components/   # HeroDetails, HeroGraph, CustomNodes
│       └── hooks/        # usePersonQuery, useFilmsQuery, etc.
├── shared/               # Shared resources
│   ├── api/             # API functions
│   ├── components/      # Shared components (Loader, ErrorMessage)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── providers/           # Context providers
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
└── test/                # Test setup
    └── setup.ts
```

## 🎯 Key Features Explained

### Hero List
- Displays all Star Wars characters in a responsive grid
- Pagination for easy navigation
- Click on any hero card to view detailed information

### Hero Details
- **Text View**: Shows character information (height, mass, hair color, etc.) and associated films
- **Graph View**: Interactive graph visualization with:
  - Hero node at the top
  - Film nodes in the middle row
  - Starship nodes at the bottom
  - Color-coded connections (blue for hero→films, different colors for film→starships)

### Graph Visualization
The graph uses a hierarchical top-down layout:
- **Person Node**: The selected hero
- **Film Nodes**: Films the hero appeared in
- **Starship Nodes**: Starships the hero traveled on in specific films
- **Edges**: Visual connections showing relationships

## 🧪 Testing

The project includes comprehensive unit tests for:
- Utility functions (`graphBuilder`, `heroImages`)
- API functions (with mocked requests)
- React Query hooks
- React components

All tests use mocked API calls to ensure fast and reliable testing.

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🌐 API

The application uses the Star Wars API: `https://sw-api.starnavi.io`

### Endpoints Used
- `GET /people/` - Get paginated list of people
- `GET /people/{id}/` - Get person by ID
- `GET /films/{id}/` - Get film by ID
- `GET /starships/{id}/` - Get starship by ID

## 🏗️ Architecture

The project follows a **feature-based architecture**:
- Features are self-contained modules with their own components and hooks
- Shared code (utilities, types, components) is in the `shared` directory
- Clean separation of concerns
- Reusable components and hooks

### Code Quality Principles
- **SOLID** principles
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- TypeScript for type safety
- English comments throughout the codebase

## 📦 Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🚢 Deployment

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

**Live Demo**: [View on GitHub Pages](https://roman-lipatov.github.io/test-starnavi/)

#### Automatic Deployment

The project uses GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
1. Builds the project on every push to `main` branch
2. Deploys the built files to GitHub Pages

**To enable GitHub Pages:**
1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy on the next push to `main`

#### Manual Deployment

If you need to deploy manually:

1. Build the project:
```bash
npm run build
```

2. The `vite.config.ts` is already configured with the correct `base` path:
```typescript
base: '/test-starnavi/'
```

3. Push to `main` branch - GitHub Actions will handle the deployment automatically.

## 📝 License

This project is created as a test assignment.

## 👤 Author

Created as part of a technical test assignment.

## 🙏 Acknowledgments

- Star Wars API: `sw-api.starnavi.io`
- React Flow for graph visualization
- Material-UI for the component library
