# Basic Usage: `usePinList`

This guide demonstrates a few more features of `usePinList` beyond the quick start, including pin status checks, clearing all pins, limiting the number of pins, and reacting to pin changes. For advanced features, see the advanced usage documentation.

## Example: Todo List with Pin Limit and Clear All

```tsx
import { usePinList } from 'react-use-pin-list';

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

const BasicPinList = () => {
  const { pinnedItems, sortedItems, onPinItem, onUnpinItem, onPinStatus, onClearPins } =
    usePinList<Todo>(todos, {
      getItemId: (todo) => todo.id,
      maxPinnedItems: 2,
      onPinnedItemsChange: (pinned) => {
        console.log('Pinned todos:', pinned);
      },
    });

  const handlePinTodo = (todoId: Todo['id']) => () => {
    onPinItem(todoId);
  };

  const handleUnpinTodo = (todoId: Todo['id']) => () => {
    onUnpinItem(todoId);
  };

  return (
    <div>
      <h2>Pinned Todos (max 2)</h2>
      <ul>
        {pinnedItems.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={handleUnpinTodo(todo.id)}>Unpin</button>
          </li>
        ))}
      </ul>
      <button
        onClick={onClearPins}
        aria-label="Clear all pinned todos"
        disabled={pinnedItems.length === 0}
      >
        Clear All Pins
      </button>
      <h2>All Todos</h2>
      <ul>
        {sortedItems.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button
              onClick={handlePinTodo(todo.id)}
              disabled={!onPinStatus(todo.id) && pinnedItems.length >= 2}
            >
              Pin
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Features shown:**

- Pin and unpin todos
- Check if a todo is pinned (`onPinStatus`)
- Limit the number of pinned items (`maxPinnedItems`)
- Clear all pins (`onClearPins`)
- React to pin changes (`onPinnedItemsChange`)

See the [Advanced Usage](./advanced-usage.md) documentation for more complex patterns including drag-and-drop reordering and virtualized lists.
