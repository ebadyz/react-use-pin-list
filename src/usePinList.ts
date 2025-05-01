import { useState, useEffect, useCallback, useMemo } from 'react';
import { PinListOptions, PinListResult, ItemId } from './types';

/**
 * React hook for managing a list of pinnable items
 * @param items Array of items to manage
 * @param options Configuration options for the pin list
 * @returns Combined state and actions for managing pinned items
 */
export const usePinList = <T>(items: T[], options: PinListOptions<T>): PinListResult<T> => {
  const { getItemId, defaultPinnedIds = [], onPinnedItemsChange, maxPinnedItems } = options;

  const [pinnedIds, setPinnedIds] = useState<Set<ItemId>>(() => {
    const limitedIds = maxPinnedItems
      ? defaultPinnedIds.slice(0, maxPinnedItems)
      : defaultPinnedIds;

    return new Set(limitedIds);
  });

  const itemIdMap = useMemo(() => {
    const map = new Map<T, ItemId>();
    items.forEach((item) => {
      map.set(item, getItemId(item));
    });
    return map;
  }, [items, getItemId]);

  const idToItemMap = useMemo(() => {
    const map = new Map<ItemId, T>();
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
        .filter((item): item is T => item !== undefined);
      onPinnedItemsChange(pinnedItems);
    }
  }, [pinnedIds, idToItemMap, onPinnedItemsChange]);

  const getItem = useCallback(
    (itemOrId: T | ItemId) => {
      if (typeof itemOrId === 'string' || typeof itemOrId === 'number') {
        return idToItemMap.get(itemOrId);
      }
      return itemOrId;
    },
    [idToItemMap]
  );

  const getId = useCallback(
    (itemOrId: T | ItemId) => {
      if (typeof itemOrId === 'string' || typeof itemOrId === 'number') {
        return itemOrId;
      }
      const id = itemIdMap.get(itemOrId);
      return id !== undefined ? id : getItemId(itemOrId);
    },
    [itemIdMap, getItemId]
  );

  const hasPinnedId = useCallback((id: ItemId) => pinnedIds.has(id), [pinnedIds]);

  const onPinStatus = useCallback(
    (itemOrId: T | ItemId) => {
      const id = getId(itemOrId);
      return hasPinnedId(id);
    },
    [getId, hasPinnedId]
  );

  const onPinItem = useCallback(
    (itemOrId: T | ItemId) => {
      const item = getItem(itemOrId);
      if (!item) return;

      const id =
        typeof itemOrId === 'string' || typeof itemOrId === 'number'
          ? itemOrId
          : itemIdMap.get(item) || getItemId(item);

      if (hasPinnedId(id)) return;

      setPinnedIds((prevPinnedIds) => {
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

  const onUnpinItem = useCallback(
    (itemOrId: T | ItemId) => {
      const id = getId(itemOrId);
      if (!hasPinnedId(id)) return;

      setPinnedIds((prevPinnedIds) => {
        const newPinnedIds = new Set(prevPinnedIds);
        newPinnedIds.delete(id);
        return newPinnedIds;
      });
    },
    [getId, hasPinnedId]
  );

  const onTogglePin = useCallback(
    (itemOrId: T | ItemId) => {
      const id = getId(itemOrId);
      if (hasPinnedId(id)) {
        onUnpinItem(id);
      } else {
        onPinItem(itemOrId);
      }
    },
    [getId, hasPinnedId, onUnpinItem, onPinItem]
  );

  const onClearPins = useCallback(() => {
    setPinnedIds(new Set());
  }, []);

  const pinnedIdsArray = useMemo(() => Array.from(pinnedIds), [pinnedIds]);

  const onReorderPin = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= pinnedIdsArray.length ||
        toIndex >= pinnedIdsArray.length
      ) {
        return;
      }

      setPinnedIds((prevPinnedIds) => {
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
    const pinnedMap = new Map<ItemId, T>();

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
      .filter((item): item is T => item !== undefined);

    return {
      pinnedItems: orderedPinnedItems,
      unpinnedItems,
      sortedItems: [...orderedPinnedItems, ...unpinnedItems],
    };
  }, [items, itemIdMap, getItemId, hasPinnedId, pinnedIdsArray]);

  return {
    pinnedIds,
    pinnedItems,
    unpinnedItems,
    sortedItems,
    onPinStatus,
    onPinItem,
    onUnpinItem,
    onTogglePin,
    onClearPins,
    onReorderPin,
  };
};
