# Quick Start: `react-use-pin-list`

`usePinList` is a powerful and flexible React hook designed to help you manage lists of items where users can "pin" or prioritize certain entries. It efficiently handles pinning, unpinning, reordering, and tracking pinned items, making it ideal for dashboards, todo lists, favorites, and any UI where users want to keep important items easily accessible. The hook is fully typed, optimized for performance, and works seamlessly with large lists.

Here's an example of how to pin and unpin items in a todo list using `usePinList`.

## 1. Import the Hook

```tsx
import { usePinList } from 'react-use-pin-list';
```

## 2. Define Your Item Type

```tsx
type Todo {
  id: number;
  title: string;
}
```

## 3. Prepare Your Items

```tsx
const todos: Todo[] = [
  { id: 1, title: 'Get ready for meeting!' },
  { id: 2, title: 'Review pull requests' },
  { id: 3, title: 'Schedule team lunch' },
  { id: 4, title: 'Send weekly report' },
  { id: 5, title: 'Do some workout' },
];
```

## 4. Use the Hook in Your Component

```tsx
import { usePinList } from 'react-use-pin-list';

const PinListExample = () => {
  const { pinnedItems, sortedItems, onTogglePin, onPinStatus } = usePinList<Todo>(todos, {
    getItemId: (todo) => todo.id,
  });

  const togglePinTodo = (todoId: Todo['id']) => () => {
    onTogglePin(todoId);
  };

  return (
    <div>
      <h2>Pinned Todos</h2>
      <ul>
        {pinnedItems.map((todo) => (
          <li key={item.id}>
            <p>{item.name}</p>
            <button onClick={onTogglePin(todo.id)}>Unpin</button>
          </li>
        ))}
      </ul>
      <h2>All Todos</h2>
      <ul>
        {sortedItems.map((todo) => (
          <li key={todo.id}>
            <p>{todo.name}</p>
            <button onClick={onTogglePin(todo.id)}>{onPinStatus(todo.id) ? 'Unpin' : 'Pin'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## That's it!

You now have a working pin list in your React app. For more advanced usage, see the full documentation.

See the [Basic Usage](./basic-usage.md) documentation for more features.
