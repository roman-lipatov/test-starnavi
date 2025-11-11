# Testing Guide

## What Should Be Covered by Tests

### 1. **Utilities (Utils)**
- ✅ `graphBuilder.ts` - graph building logic
  - Creating nodes (person, film, starship)
  - Creating edges
  - Element positioning
  - Edge case handling (empty arrays)

- ✅ `heroImages.ts` - image utility functions
  - Returning correct images
  - Cycling through images for large IDs

### 2. **API Functions**
- ✅ `people.ts`, `films.ts`, `starships.ts`
  - Correct HTTP requests
  - Parameter handling (page, id)
  - Response typing

### 3. **React Hooks (TanStack Query)**
- ✅ `usePeopleQuery`, `usePersonQuery`, `useFilmsQuery`, `useStarshipsQuery`
  - Successful data loading
  - Loading states
  - Error handling
  - Caching

### 4. **Components**
- ✅ `HeroCard` - basic rendering, clicks
- ⚠️ `HeroList` - can add tests for pagination
- ⚠️ `HeroDetails` - can add tests for view mode switching
- ⚠️ `HeroGraph` - can add tests for graph display

### 5. **Providers**
- ⚠️ `QueryProvider` - can add tests for configuration
- ⚠️ `ThemeProvider` - can add tests for theme

## How to Work with Tests

### Running Tests

```bash
# Run all tests once
npm test -- --run

# Run tests in watch mode (automatically on changes)
npm test

# Run tests with UI
npm run test:ui

# Run tests with code coverage
npm run test:coverage
```

### Test Structure

Tests are located next to the files they test:
```
src/
  shared/
    utils/
      graphBuilder.ts
      graphBuilder.test.ts  ← test for graphBuilder
  features/
    hero-list/
      components/
        HeroCard.tsx
        HeroCard.test.tsx  ← test for HeroCard
      hooks/
        usePeopleQuery.ts
        usePeopleQuery.test.tsx  ← test for usePeopleQuery
```

### Mocking

#### Mocking API Functions
```typescript
vi.mock('@/shared/api/people', () => ({
  getPeople: vi.fn(),
}));

// In test
vi.mocked(getPeople).mockResolvedValue(mockData);
```

#### Mocking Axios
```typescript
vi.mock('./axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));
```

### Testing React Components

#### Basic Example
```typescript
import { render, screen } from '@testing-library/react';
import { HeroCard } from './HeroCard';

it('should render person name', () => {
  render(<HeroCard person={mockPerson} onClick={vi.fn()} />);
  expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
});
```

#### Testing with Providers (MUI, TanStack Query)
```typescript
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </QueryClientProvider>
);

render(
  <TestWrapper>
    <HeroCard person={mockPerson} onClick={handleClick} />
  </TestWrapper>
);
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';

const { result } = renderHook(() => usePeopleQuery(1), { wrapper });

await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

## Important Points

1. **Don't make real API requests** - always mock
2. **Test logic, not implementation details**
3. **Test edge cases** (empty data, errors)
4. **Use `waitFor` for async operations**
5. **Clear mocks after each test** (`vi.clearAllMocks()`)

## Code Coverage

After running `npm run test:coverage` you will see:
- Which files are covered by tests
- Coverage percentage
- Which lines are not covered

Goal: cover **core logic** (utilities, hooks, API functions) at **70-80%**.
