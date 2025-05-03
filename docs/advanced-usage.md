# Advanced Usage: `usePinList`

This guide demonstrates advanced features of `usePinList`, including integration with [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop reordering of pinned items.

## Example: usePinList with hello-pangea/dnd

Below is a TypeScript React example showing how to combine `usePinList` with `@hello-pangea/dnd` to allow users to pin/unpin items and reorder pinned items via drag-and-drop.

```tsx
import { usePinList } from 'react-use-pin-list';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

type Todo = {
  id: number;
  title: string;
};

const todos: Todo[] = [
  { id: 1, title: 'Get ready for meeting!' },
  { id: 2, title: 'Review pull requests' },
  { id: 3, title: 'Schedule team lunch' },
  { id: 4, title: 'Send weekly report' },
  { id: 5, title: 'Do some workout' },
];

const AdvancedPinList = () => {
  const {
    pinnedItems,
    sortedItems,
    onPinItem,
    onUnpinItem,
    onTogglePin,
    onPinStatus,
    onReorderPin,
  } = usePinList<Todo>(todos, {
    getItemId: (todo) => todo.id,
    maxPinnedItems: 3,
  });

  const handleUnpinClick = (todoId: Todo['id']) => () => {
    onUnpinItem(todoId);
  };

  const handleTogglePinClick = (todoId: Todo['id']) => () => {
    onTogglePin(todoId);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onReorderPin(result.source.index, result.destination.index);
  };

  return (
    <div>
      <h2>Pinned Todos (drag to reorder, max 3)</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pinned-todos">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {pinnedItems.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <span>{todo.title}</span>
                      <button onClick={handleUnpinClick(todo.id)}>Unpin</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <h2>All Todos</h2>
      <ul>
        {sortedItems.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button
              onClick={handleTogglePinClick(todo.id)}
              disabled={!onPinStatus(todo.id) && pinnedItems.length >= 3}
            >
              {onPinStatus(todo.id) ? 'Unpin' : 'Pin'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**How it works:**

- Users can pin/unpin todos using the buttons.
- Pinned todos appear at the top and can be reordered by dragging (using `@hello-pangea/dnd`).
- The `onReorderPin` function from `usePinList` is called after a drag-and-drop reorder.
- The pin limit is enforced.

**Further Customization:**

- You can use all features of `@hello-pangea/dnd` for more complex drag-and-drop scenarios.
- For more on drag-and-drop, see the [@hello-pangea/dnd documentation](https://github.com/hello-pangea/dnd).

---

## Example: usePinList with TanStack Virtual

You can efficiently render large lists with pin/unpin support by combining `usePinList` with [TanStack Virtual](https://tanstack.com/virtual/latest). Below is a minimal example using the latest version of TanStack Virtual:

```tsx
import { usePinList } from 'react-use-pin-list';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

type Todo = {
  id: number;
  title: string;
};

// Generate a large list for demonstration
const todos: Todo[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  title: `Todo #${i + 1}`,
}));

const VirtualPinList = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { pinnedItems, sortedItems, onTogglePin, onPinStatus } = usePinList<Todo>(todos, {
    getItemId: (todo) => todo.id,
    maxPinnedItems: 10,
  });

  // Setup virtualizer for the sorted list
  const rowVirtualizer = useVirtualizer({
    count: sortedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const handleTogglePinClick = (todoId: Todo['id']) => () => {
    onTogglePin(todoId);
  };

  return (
    <div>
      <h2>Virtualized Todo List (with pinning)</h2>
      <div
        ref={parentRef}
        style={{
          height: '400px',
          width: '100%',
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        <ul
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const todo = sortedItems[virtualRow.index];
            return (
              <li
                key={todo.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #eee',
                  padding: '0 8px',
                }}
              >
                <span style={{ flex: 1 }}>{todo.title}</span>
                <button
                  onClick={handleTogglePinClick(todo.id)}
                  disabled={!onPinStatus(todo.id) && pinnedItems.length >= 10}
                >
                  {onPinStatus(todo.id) ? 'Unpin' : 'Pin'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
```

**How it works:**

- The list is virtualized for performance, rendering only visible rows.
- Pin/unpin logic is handled by `usePinList`.
- Pinned items always appear at the top of the virtualized list.
- The pin limit is enforced.

---

## Example: usePinList with Zustand for Persistent Pin State

You can use Zustand to persist and sync pinned items across your app. Here’s how to load default pinned items from Zustand and update the store when the pinned list changes:

```tsx
import { usePinList } from 'react-use-pin-list';
import { create } from 'zustand';

type Todo = {
  id: number;
  title: string;
};

// Create a Zustand store for pinned IDs
type PinnedItemsState = {
  pinnedIds: number[];
  setPinnedIds: (ids: number[]) => void;
};

const usePinnedItemsStore = create<PinnedItemsState>((set) => ({
  pinnedIds: [],
  setPinnedIds: (ids) => set({ pinnedIds: ids }),
}));

const todos: Todo[] = [
  { id: 1, title: 'Get ready for meeting!' },
  { id: 2, title: 'Review pull requests' },
  { id: 3, title: 'Schedule team lunch' },
  { id: 4, title: 'Send weekly report' },
  { id: 5, title: 'Do some workout' },
];

const ZustandPinList = () => {
  // Get pinned IDs and setter from Zustand
  const pinnedIds = usePinnedItemsStore((state) => state.pinnedIds);
  const setPinnedIds = usePinnedItemsStore((state) => state.setPinnedIds);

  const { pinnedItems, sortedItems, onTogglePin, onPinStatus } = usePinList<Todo>(todos, {
    getItemId: (todo) => todo.id,
    defaultPinnedIds: pinnedIds, // Load from Zustand
    onPinnedItemsChange: (pinned) => {
      // Update Zustand store when pinned items change
      setPinnedIds(pinned.map((item) => item.id));
    },
  });

  const handleTogglePinClick = (todoId: Todo['id']) => () => {
    onTogglePin(todoId);
  };

  return (
    <div>
      <h2>Zustand Pin List</h2>
      <ul>
        {sortedItems.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={handleTogglePinClick(todo.id)}>
              {onPinStatus(todo.id) ? 'Unpin' : 'Pin'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**How it works:**

- The pinned IDs are loaded from Zustand on initialization (`defaultPinnedIds`).
- Whenever the pinned items change, the Zustand store is updated via `onPinnedItemsChange`.
- This pattern allows you to persist and share pin state across your app.

---

**References:**

- [TanStack Virtual Documentation](https://tanstack.com/virtual/latest)
- [@hello-pangea/dnd Documentation](https://github.com/hello-pangea/dnd)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
