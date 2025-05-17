# Cursor AI Prompt Templates for Frontend Workflow

## Create Vue Component
```prompt
Create a new Vue 3 component with TypeScript and <script setup> syntax. The component should:
- Be named [ComponentName]
- Accept props for [describe props]
- Emit events for [describe events]
- Include proper type definitions
- Have basic styling
```

## Create Pinia Store
```prompt
Create a new Pinia store with TypeScript that:
- Is named [StoreName]
- Includes state for [describe state]
- Has actions for [describe actions]
- Includes getters for [describe getters]
- Has proper type definitions
```

## Write Component Tests
```prompt
Create Vitest unit tests for the [ComponentName] component that:
- Test all props
- Test all emitted events
- Mock any store dependencies
- Include edge cases
- Follow Vue Test Utils best practices
```

## Add Component Documentation
```prompt
Create documentation for the [ComponentName] component including:
- Component description
- Props API
- Events API
- Usage examples
- Edge cases and limitations
```

## Optimize Performance
```prompt
Review and optimize the [ComponentName] component for performance:
- Check for unnecessary re-renders
- Optimize computed properties
- Review lifecycle hooks
- Suggest performance improvements
```

## Add TypeScript Types
```prompt
Add or improve TypeScript types for:
- Component props
- Emitted events
- Store state
- API responses
- Utility functions
```

## Create API Integration
```prompt
Create a typed API integration that:
- Uses [API name/endpoint]
- Includes proper error handling
- Has TypeScript interfaces
- Implements retry logic
- Includes loading states
```

## Style Component
```prompt
Add or update styles for [ComponentName] that:
- Follow project style guide
- Are responsive
- Use CSS variables
- Include transitions
- Handle dark/light modes
```

## Code Review
```prompt
Review the code for [ComponentName/StoreName/FileName] focusing on:

1. Architecture & Design:
- Component composition
- State management
- Props and events design
- Separation of concerns
- Code organization
- File structure

2. TypeScript Implementation:
- Type definitions
- Type inference
- Generic usage
- Interface design
- Type guards
- Utility types
- Type assertions

3. Vue.js Best Practices:
- Composition API usage
- Lifecycle hooks
- Computed properties
- Watchers
- Template syntax
- Component communication
- Directive usage
- Slots implementation

4. Performance:
- Render optimization
- Computed vs methods
- Reactive dependencies
- Memory leaks
- Bundle size impact
- Lazy loading
- Cache usage

5. Security:
- XSS prevention
- CSRF protection
- Input sanitization
- API security
- Authentication handling
- Sensitive data exposure
- Security dependencies

6. Testing:
- Unit test coverage
- Integration tests
- Component tests
- Store tests
- Mock implementation
- Test organization
- Edge cases

7. Accessibility:
- ARIA attributes
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

8. Code Quality:
- Naming conventions
- Documentation
- Error handling
- Code duplication
- Complexity
- Magic numbers
- Dead code

9. Modern Features:
- ES6+ features
- Vue 3 features
- TypeScript features
- Browser compatibility
- Progressive enhancement

Example Review Format:
```typescript
// Original Code
const handleSubmit = async (data: any) => {
  try {
    await api.post('/endpoint', data)
    store.items.push(data)
  } catch (e) {
    console.error(e)
  }
}

// Suggested Improvements
interface SubmitData {
  id: string;
  name: string;
}

const handleSubmit = async (data: SubmitData): Promise<void> => {
  try {
    const response = await api.post<SubmitData>('/endpoint', data);
    store.addItem(response.data); // Use store action instead of direct mutation
  } catch (error) {
    errorHandler.handle(error); // Centralized error handling
    throw new SubmissionError('Failed to submit data');
  }
}
```

Review Checklist:
- [ ] Code follows project style guide
- [ ] Types are properly defined
- [ ] Error handling is comprehensive
- [ ] Tests are adequate
- [ ] Performance is optimized
- [ ] Security is considered
- [ ] Accessibility is implemented
- [ ] Documentation is complete
- [ ] No unnecessary dependencies
- [ ] Code is maintainable
```

## Debug Issue
```prompt
Help debug an issue where:
- Current behavior: [describe]
- Expected behavior: [describe]
- Related code: [paste code]
- Error messages: [if any]
```

## Refactor Component
```prompt
Refactor [ComponentName] to:
- Improve code organization
- Extract reusable logic
- Enhance type safety
- Improve performance
- Better handle edge cases
```

## Add Unit Test
```prompt
Create a comprehensive unit test suite that:
- Tests the [feature/component/store] named [name]
- Includes test cases for:
  - Initial state/setup
  - All public methods and properties
  - Edge cases and error conditions
  - Async operations (if applicable)
  - State mutations (for stores)
- Uses proper test isolation
- Follows AAA (Arrange-Act-Assert) pattern
- Includes meaningful test descriptions
- Mocks external dependencies appropriately
Example:
Write tests for a Pinia store that:
- Verifies initial state
- Tests all actions and getters
- Handles async operations
- Validates state mutations
- Mocks API calls
```

## REST API Integration
```prompt
Create a typed API integration for [API name/endpoint] that includes:

1. Types/Interfaces:
- Request payload types
- Response data types
- Error types
- API configuration types

2. API Client:
- Base configuration (baseURL, headers, timeout)
- Request interceptors
- Response interceptors
- Error handling middleware

3. Composable Function:
- Implement useQuery pattern
- Handle loading states
- Handle error states
- Handle success states
- Support pagination (if needed)
- Support caching
- Support request cancellation
- Implement retry logic

4. Error Handling:
- Network errors
- API errors
- Validation errors
- Timeout handling
- Offline state handling

5. Features:
- TypeScript type safety
- Automatic error retries
- Request debouncing/throttling
- Response caching
- Request queue management
- Authentication handling
- Refresh token logic (if needed)

Example Usage:
```typescript
const { 
  data,
  error,
  isLoading,
  isError,
  refetch
} = useApi<ResponseType>('/endpoint', {
  method: 'POST',
  payload: requestData,
  options: {
    cache: true,
    retries: 3
  }
})
```
```

## Accessibility Check
```prompt
Analyze the [ComponentName] for accessibility compliance, checking:

1. Semantic HTML:
- Proper heading hierarchy (h1-h6)
- Semantic elements (nav, main, article, aside)
- Lists for related items
- Tables for tabular data
- Landmarks and regions

2. ARIA Implementation:
- Appropriate ARIA roles
- Required ARIA attributes
- ARIA states and properties
- Live regions for dynamic content
- Dialog and modal accessibility

3. Keyboard Navigation:
- Tab order logic
- Focus management
- Focus trapping (for modals)
- Skip links
- Keyboard shortcuts

4. Forms and Inputs:
- Label associations
- Error messages
- Required fields
- Input validation
- Help text
- Form groups

5. Media and Content:
- Alt text for images
- Captions for videos
- Transcripts for audio
- SVG accessibility
- Icon accessibility

6. Interactive Elements:
- Button vs link usage
- Custom controls
- Tooltips and popovers
- Dropdown menus
- Accordions

7. Visual Design:
- Color contrast ratios
- Focus indicators
- Text spacing
- Responsive design
- Motion and animations

8. Dynamic Content:
- Status messages
- Loading states
- Error notifications
- Success feedback
- Progress indicators

Example Review:
```vue
<!-- Original -->
<div @click="toggle">
  <img src="icon.svg" /> Menu
</div>

<!-- Accessible Version -->
<button 
  @click="toggle"
  aria-expanded="false"
  aria-controls="menu-content"
>
  <img src="icon.svg" alt="Menu icon" />
  <span>Menu</span>
</button>

<div 
  id="menu-content"
  role="menu"
  v-show="isOpen"
>
  <!-- Menu content -->
</div>
```

Testing Checklist:
- Screen reader compatibility
- Keyboard-only navigation
- High contrast mode
- Browser zoom support
- Mobile accessibility
- Reduced motion preferences
```