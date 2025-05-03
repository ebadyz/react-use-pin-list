/**
 * Type representing an item identifier
 */
export type ItemId = string | number;

/**
 * Configuration options for the usePinList hook
 */
export type PinListOptions<T> = {
  /**
   * Function to extract a unique identifier from an item
   * @param item The item to get the identifier for
   */
  getItemId: (item: T) => ItemId;

  /**
   * Optional array of initially pinned item IDs
   */
  defaultPinnedIds?: ItemId[];

  /**
   * Optional callback triggered when pinned items change
   * @param items The current array of pinned items
   */
  onPinnedItemsChange?: (items: T[]) => void;

  /**
   * Optional maximum number of items that can be pinned
   */
  maxPinnedItems?: number;
};

/**
 * Actions available for managing pinned items
 */
export type PinListActions<T> = {
  /**
   * Returns the pinned status of an item
   */
  onPinStatus: (itemOrId: T | ItemId) => boolean;

  /**
   * Pin an item to the list
   */
  onPinItem: (itemOrId: T | ItemId) => void;

  /**
   * Unpin an item from the list
   */
  onUnpinItem: (itemOrId: T | ItemId) => void;

  /**
   * Toggle an item's pinned state
   */
  onTogglePin: (itemOrId: T | ItemId) => void;

  /**
   * Remove all pinned items
   */
  onClearPins: () => void;

  /**
   * Reorder a pinned item's position
   */
  onReorderPin: (fromIndex: number, toIndex: number) => void;
};

/**
 * State values for the pin list
 */
export type PinListState<T> = {
  /**
   * Set of currently pinned item IDs
   */
  pinnedIds: Set<ItemId>;

  /**
   * Array of pinned items in their current order
   */
  pinnedItems: T[];

  /**
   * Array of unpinned items
   */
  unpinnedItems: T[];

  /**
   * Combined array of all items with pinned items first
   */
  sortedItems: T[];
};

/**
 * Combined return type for the usePinList hook
 */
export type PinListResult<T> = PinListState<T> & PinListActions<T>;
