import { useState, useEffect, useCallback, useMemo } from 'react';
import { UsePinListOptions, UsePinListResult } from './types';

/**
 * React hook for efficiently managing pinned items in large lists
 * @param items The array of items to manage
 * @param options Configuration options
 * @returns Hook result with pinned items, methods and helpers
 */
export const usePinList = <T>(items: T[], options: UsePinListOptions<T>): UsePinListResult<T> => {
  const { getItemId, initialPinnedIds = [], onPinnedItemsChange, maxPinnedItems } = options;

  const [pinnedIds, setPinnedIds] = useState<Set<string | number>>(() => {
    const limitedIds = maxPinnedItems
      ? initialPinnedIds.slice(0, maxPinnedItems)
      : initialPinnedIds;

    return new Set(limitedIds);
  });

  const itemIdMap = useMemo(() => {
    const map = new Map<T, string | number>();
    items.forEach((item) => {
      map.set(item, getItemId(item));
    });
    return map;
  }, [items, getItemId]);

  const idToItemMap = useMemo(() => {
    const map = new Map<string | number, T>();
    items.forEach((item) => {
      const id = getItemId(item);
      map.set(id, item);
    });
    return map;
  }, [items, getItemId]);

  useEffect(() => {
    if (onPinnedItemsChange) {
      const pinnedItems = Array.from(pinnedIds)
        .map((id) => idToItemMap.get(id))
        .filter((item) => item !== undefined);
      onPinnedItemsChange(pinnedItems);
    }
  }, [pinnedIds, idToItemMap, onPinnedItemsChange]);

  const getItem = useCallback(
    (itemOrId: T | string | number) => {
      if (typeof itemOrId === 'string' || typeof itemOrId === 'number') {
        return idToItemMap.get(itemOrId);
      }
      return itemOrId;
    },
    [idToItemMap]
  );

  const getId = useCallback(
    (itemOrId: T | string | number) => {
      if (typeof itemOrId === 'string' || typeof itemOrId === 'number') {
        return itemOrId;
      }
      const id = itemIdMap.get(itemOrId);
      return id !== undefined ? id : getItemId(itemOrId);
    },
    [itemIdMap, getItemId]
  );

  const hasPinnedId = useCallback((id: string | number) => pinnedIds.has(id), [pinnedIds]);

  const isPinned = useCallback(
    (itemOrId: T | string | number) => {
      const id = getId(itemOrId);
      return hasPinnedId(id);
    },
    [getId, hasPinnedId]
  );

  const pinItem = useCallback(
    (itemOrId: T | string | number) => {
      const item = getItem(itemOrId);
      if (!item) return;

      const id =
        typeof itemOrId === 'string' || typeof itemOrId === 'number'
          ? itemOrId
          : itemIdMap.get(item) || getItemId(item);

      if (hasPinnedId(id)) return;

      setPinnedIds((prevPinnedIds: Set<string | number>) => {
        if (maxPinnedItems && prevPinnedIds.size >= maxPinnedItems) {
          return prevPinnedIds;
        }

        const newPinnedIds = new Set(prevPinnedIds);
        newPinnedIds.add(id);
        return newPinnedIds;
      });
    },
    [getItem, getItemId, itemIdMap, hasPinnedId, maxPinnedItems]
  );

  const unpinItem = useCallback(
    (itemOrId: T | string | number) => {
      const id = getId(itemOrId);
      if (!hasPinnedId(id)) return;

      setPinnedIds((prevPinnedIds: Set<string | number>) => {
        const newPinnedIds = new Set(prevPinnedIds);
        newPinnedIds.delete(id);
        return newPinnedIds;
      });
    },
    [getId, hasPinnedId]
  );

  const togglePin = useCallback(
    (itemOrId: T | string | number) => {
      const id = getId(itemOrId);
      if (hasPinnedId(id)) {
        unpinItem(id);
      } else {
        pinItem(itemOrId);
      }
    },
    [getId, hasPinnedId, unpinItem, pinItem]
  );

  const clearPinnedItems = useCallback(() => {
    setPinnedIds(new Set());
  }, []);

  const pinnedIdsArray = useMemo(() => Array.from(pinnedIds), [pinnedIds]);

  const updatePinOrder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= pinnedIdsArray.length ||
        toIndex >= pinnedIdsArray.length
      ) {
        return;
      }

      setPinnedIds((prevPinnedIds: Set<string | number>) => {
        const pinnedIdsArray = Array.from(prevPinnedIds);
        const [movedId] = pinnedIdsArray.splice(fromIndex, 1);
        pinnedIdsArray.splice(toIndex, 0, movedId);
        return new Set(pinnedIdsArray);
      });
    },
    [pinnedIdsArray]
  );

  const { pinnedItems, unpinnedItems, sortedItems } = useMemo(() => {
    const pinnedItems: T[] = [];
    const unpinnedItems: T[] = [];
    const pinnedMap = new Map<string | number, T>();

    items.forEach((item) => {
      const id = itemIdMap.get(item) || getItemId(item);
      if (hasPinnedId(id)) {
        pinnedItems.push(item);
        pinnedMap.set(id, item);
      } else {
        unpinnedItems.push(item);
      }
    });

    const orderedPinnedItems = pinnedIdsArray
      .map((id) => pinnedMap.get(id))
      .filter((item) => item !== undefined);

    return {
      pinnedItems: orderedPinnedItems,
      unpinnedItems,
      sortedItems: [...orderedPinnedItems, ...unpinnedItems],
    };
  }, [items, itemIdMap, getItemId, hasPinnedId, pinnedIdsArray]);

  return {
    pinnedItems,
    unpinnedItems,
    sortedItems,
    pinnedIds,
    pinItem,
    unpinItem,
    togglePin,
    isPinned,
    clearPinnedItems,
    updatePinOrder,
  };
};
