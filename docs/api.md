# API Reference: `usePinList`

## Hook Signature

```ts
const result = usePinList<T>(items: T[], options: PinListOptions<T>): PinListResult<T>
```

---

## Parameters

### items: `T[]`

- **Description:** The array of items to be managed (can be any type).

### options: `PinListOptions<T>`

- **Description:** Configuration object for pinning behavior.
- **Properties:**
  - `getItemId: (item: T) => string | number` (**required**)
    - Function to extract a unique identifier from each item.
  - `defaultPinnedIds?: Array<string | number>`
    - Array of IDs to be pinned by default on initialization.
  - `onPinnedItemsChange?: (pinnedItems: T[]) => void`
    - Callback invoked whenever the pinned items change.
  - `maxPinnedItems?: number`
    - Maximum number of items that can be pinned at once.

---

## Return Value: `PinListResult<T>`

An object containing state and actions for managing pinned items:

### State

- `pinnedIds: Set<string | number>`
  - Set of currently pinned item IDs.
- `pinnedItems: T[]`
  - Array of pinned items, in their current order.
- `unpinnedItems: T[]`
  - Array of unpinned items.
- `sortedItems: T[]`
  - Array of all items, with pinned items first (in order), followed by unpinned items.

### Actions

- `onPinStatus(itemOrId: T | string | number): boolean`
  - Returns `true` if the item is currently pinned.
- `onPinItem(itemOrId: T | string | number): void`
  - Pins the specified item (if not already pinned and under the pin limit).
- `onUnpinItem(itemOrId: T | string | number): void`
  - Unpins the specified item (if currently pinned).
- `onTogglePin(itemOrId: T | string | number): void`
  - Toggles the pin state of the specified item.
- `onClearPins(): void`
  - Removes all pinned items.
- `onReorderPin(fromIndex: number, toIndex: number): void`
  - Moves a pinned item from one position to another (for drag-and-drop reordering).

---

## Usage Example

```tsx
const {
  pinnedItems,
  sortedItems,
  onPinItem,
  onUnpinItem,
  onTogglePin,
  onPinStatus,
  onClearPins,
  onReorderPin,
} = usePinList(items, {
  getItemId: (item) => item.id,
  defaultPinnedIds: ['1'],
  maxPinnedItems: 5,
  onPinnedItemsChange: (pinned) => {
    // handle pin state change
  },
});
```
