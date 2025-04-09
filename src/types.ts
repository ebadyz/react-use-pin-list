/**
 * Configuration options for the usePinList hook
 */
export type UsePinListOptions<T> = {
  /**
   * Unique identifier function to get a unique key for each item
   * @param item The item to get the identifier for
   * @returns A unique string or number identifier
   */
  getItemId: (item: T) => string | number;

  /**
   * Optional initial pinned item IDs
   */
  initialPinnedIds?: Array<string | number>;

  /**
   * Optional callback triggered when pinned items change
   */
  onPinnedItemsChange?: (pinnedItems: T[]) => void;

  /**
   * Optional maximum number of pinned items
   */
  maxPinnedItems?: number;
};

/**
 * Return value of the usePinList hook
 */
export type UsePinListResult<T> = {
  /**
   * Array of pinned items
   */
  pinnedItems: T[];

  /**
   * Array of unpinned items
   */
  unpinnedItems: T[];

  /**
   * Sorted array with pinned items first, then unpinned items
   */
  sortedItems: T[];

  /**
   * Set of pinned item IDs for fast lookup
   */
  pinnedIds: Set<string | number>;

  /**
   * Function to pin an item
   */
  pinItem: (itemOrId: T | string | number) => void;

  /**
   * Function to unpin an item
   */
  unpinItem: (itemOrId: T | string | number) => void;

  /**
   * Function to toggle an item's pinned state
   */
  togglePin: (itemOrId: T | string | number) => void;

  /**
   * Function to check if an item is pinned
   */
  isPinned: (itemOrId: T | string | number) => boolean;

  /**
   * Function to clear all pinned items
   */
  clearPinnedItems: () => void;

  /**
   * Function to update the pin order (moves a pinned item to a new position)
   */
  updatePinOrder: (fromIndex: number, toIndex: number) => void;
};
