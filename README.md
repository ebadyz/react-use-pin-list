# react-use-pin-list

A high-performance React hook for efficiently managing pinned items in large lists.

## Features

- Fast and optimized for large lists (50,000+ items)
- Tiny bundle size with zero dependencies (< 1KB gzipped)
- TypeScript support with full type definitions
- No built-in storage dependencies (choose your own storage solution)
- Customizable with several configuration options
- Memory-efficient state management

## Bundle Size

| Format   | Size   | Gzipped |
| -------- | ------ | ------- |
| ESM      | 2.7 KB | 0.97 KB |
| CommonJS | 1.9 KB | 0.83 KB |

## Installation

```bash
# Using npm
npm install react-use-pin-list

# Using yarn
yarn add react-use-pin-list

# Using pnpm
pnpm add react-use-pin-list

# Using bun
bun add react-use-pin-list
```

## Usage

```tsx
import { usePinList } from 'react-use-pin-list';

interface Item {
  id: string;
  name: string;
  // ...other properties
}

const MyComponent = () => {
  // Your list of items
  const items = useMemo(
    () => [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
      // ... more items
    ],
    []
  );

  // Use the hook
  const {
    pinnedItems, // Array of pinned items
    unpinnedItems, // Array of unpinned items
    sortedItems, // Combined array (pinned first, then unpinned)
    pinnedIds, // Set of pinned IDs for fast lookup
    pinItem, // Function to pin an item
    unpinItem, // Function to unpin an item
    togglePin, // Function to toggle an item's pinned state
    isPinned, // Function to check if an item is pinned
    clearPinnedItems, // Function to clear all pinned items
    updatePinOrder, // Function to reorder pinned items
  } = usePinList(items, {
    getItemId: (item) => item.id, // Function to get a unique ID
    initialPinnedIds: ['1'], // Optional initial pinned IDs
    maxPinnedItems: 10, // Optional maximum number of pins
    onPinnedItemsChange: (pinnedItems) => {
      // Optional callback when pinned items change
      console.log(pinnedItems);

      // Example: Save pinned IDs to localStorage
      localStorage.setItem('my-pinned-items', JSON.stringify(pinnedItems.map((item) => item.id)));
    },
  });

  return (
    <div>
      <h2>Pinned Items</h2>
      <ul>
        {pinnedItems.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => unpinItem(item)}>Unpin</button>
          </li>
        ))}
      </ul>

      <h2>All Items</h2>
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => togglePin(item)}>{isPinned(item) ? 'Unpin' : 'Pin'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Persisting Pinned Items

The hook doesn't implement any specific storage solution, giving you the freedom to choose your own:

### With localStorage

```tsx
// Load pinned IDs from localStorage on initialization
const loadPinnedIds = () => {
  try {
    const saved = localStorage.getItem('my-pinned-items');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading pinned items:', error);
    return [];
  }
};

// In your component
const { pinnedItems /* ... */ } = usePinList(items, {
  getItemId: (item) => item.id,
  initialPinnedIds: loadPinnedIds(), // Load from localStorage
  onPinnedItemsChange: (items) => {
    // Save to localStorage when items change
    localStorage.setItem('my-pinned-items', JSON.stringify(items.map((item) => item.id)));
  },
});
```

### With Redux

```tsx
// In your Redux slice
const pinnedItemsSlice = createSlice({
  name: 'pinnedItems',
  initialState: { ids: [] },
  reducers: {
    setPinnedIds: (state, action) => {
      state.ids = action.payload;
    },
  },
});

// In your component
const dispatch = useDispatch();
const pinnedIds = useSelector((state) => state.pinnedItems.ids);

const { pinnedItems /* ... */ } = usePinList(items, {
  getItemId: (item) => item.id,
  initialPinnedIds: pinnedIds, // From Redux store
  onPinnedItemsChange: (items) => {
    // Update Redux store when items change
    dispatch(setPinnedIds(items.map((item) => item.id)));
  },
});
```

## API

### usePinList

```tsx
const result = usePinList(items, options);
```

#### Options

| Option                | Type                            | Required | Description                                          |
| --------------------- | ------------------------------- | -------- | ---------------------------------------------------- |
| `getItemId`           | `(item: T) => string \| number` | Yes      | Function to extract a unique identifier from an item |
| `initialPinnedIds`    | `Array<string \| number>`       | No       | Array of IDs to initially pin                        |
| `onPinnedItemsChange` | `(pinnedItems: T[]) => void`    | No       | Callback when pinned items change                    |
| `maxPinnedItems`      | `number`                        | No       | Maximum number of items that can be pinned           |

#### Return Value

| Property           | Type                                           | Description                                           |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| `pinnedItems`      | `T[]`                                          | Array of pinned items                                 |
| `unpinnedItems`    | `T[]`                                          | Array of unpinned items                               |
| `sortedItems`      | `T[]`                                          | Combined array with pinned items first, then unpinned |
| `pinnedIds`        | `Set<string \| number>`                        | Set of pinned item IDs for fast lookup                |
| `pinItem`          | `(itemOrId: T \| string \| number) => void`    | Function to pin an item                               |
| `unpinItem`        | `(itemOrId: T \| string \| number) => void`    | Function to unpin an item                             |
| `togglePin`        | `(itemOrId: T \| string \| number) => void`    | Function to toggle an item's pinned state             |
| `isPinned`         | `(itemOrId: T \| string \| number) => boolean` | Function to check if an item is pinned                |
| `clearPinnedItems` | `() => void`                                   | Function to clear all pinned items                    |
| `updatePinOrder`   | `(fromIndex: number, toIndex: number) => void` | Function to reorder pinned items                      |

## Performance Considerations

- The hook uses memoization extensively to prevent unnecessary recalculations
- For very large lists, consider using virtualization libraries like `react-window` or `react-virtualized` alongside this hook
- The hook uses Sets and Maps internally for O(1) lookups
- Optimized for minimal bundle size to reduce your application's overall footprint

## License

MIT
