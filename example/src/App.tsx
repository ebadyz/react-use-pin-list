import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { usePinList } from '../../src/';
import { STORAGE_KEY, ITEM_COUNTS } from './constant';
import type { Item } from './types';

const loadPinnedIds = () => {
  const fallbackIds = ['item-5', 'item-10', 'item-15'];
  try {
    const savedIds = localStorage.getItem(STORAGE_KEY);
    return savedIds ? JSON.parse(savedIds) : fallbackIds;
  } catch (error) {
    return fallbackIds;
  }
};

const savePinnedIds = (ids: Array<Item['id']>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving pinned IDs to localStorage:', error);
  }
};

const App = () => {
  const [itemCount, setItemCount] = useState(1000);
  const [renderStartTime, setRenderStartTime] = useState(0);
  const [renderEndTime, setRenderEndTime] = useState(0);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const items = useMemo(() => {
    const generatedItems: Item[] = Array.from({ length: itemCount }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i}`,
      description: `This is the description for item ${i}`,
    }));

    return generatedItems;
  }, [itemCount]);

  const { pinnedItems, sortedItems, pinItem, unpinItem, togglePin, isPinned, clearPinnedItems } =
    usePinList<Item>(items, {
      getItemId: (item: Item) => item.id,
      initialPinnedIds: loadPinnedIds(),
      maxPinnedItems: 20,
      onPinnedItemsChange: (items: Item[]) => {
        const pinnedIds = items.map((item) => item.id);
        savePinnedIds(pinnedIds);
      },
    });

  useEffect(() => {
    setRenderStartTime(performance.now());

    return () => {
      setRenderEndTime(performance.now());
    };
  }, [itemCount, showPinnedOnly]);

  const renderTime = renderEndTime - renderStartTime;

  const handleItemCountChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemCount(Number(e.target.value));
  }, []);

  const handleRandomPin = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    if (!isPinned(randomItem)) {
      pinItem(randomItem);
    }
  }, [items, pinItem, isPinned]);

  const handleRandomUnpin = useCallback(() => {
    if (pinnedItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * pinnedItems.length);
      const randomItem = pinnedItems[randomIndex];
      unpinItem(randomItem);
    }
  }, [pinnedItems, unpinItem]);

  return (
    <div className="app-container">
      <h1>react-use-pin-list Demo</h1>

      <div className="item-count-selector">
        <label htmlFor="item-count">Number of items:</label>
        <select id="item-count" value={itemCount} onChange={handleItemCountChange}>
          {ITEM_COUNTS.map((count) => (
            <option key={count} value={count}>
              {count.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="controls">
        <button onClick={() => setShowPinnedOnly(!showPinnedOnly)}>
          {showPinnedOnly ? 'Show All Items' : 'Show Pinned Only'}
        </button>
        <button onClick={handleRandomPin}>Pin Random Item</button>
        <button onClick={handleRandomUnpin}>Unpin Random Item</button>
        <button onClick={clearPinnedItems}>Clear All Pins</button>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{itemCount.toLocaleString()}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{pinnedItems.length.toLocaleString()}</div>
          <div className="stat-label">Pinned Items</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{renderTime.toFixed(2)}ms</div>
          <div className="stat-label">Render Time</div>
        </div>
      </div>

      <div className="list-container">
        <div className="list-section">
          <h2>Pinned Items</h2>
          <ul>
            {pinnedItems.length === 0 ? (
              <li>No pinned items yet</li>
            ) : (
              pinnedItems.map((item: Item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-actions">
                    <button className="unpin-button" onClick={() => unpinItem(item)}>
                      Unpin
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {!showPinnedOnly && (
          <div className="list-section">
            <h2>All Items</h2>
            <ul>
              {sortedItems.slice(0, 100).map((item: Item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      className={isPinned(item) ? 'unpin-button' : 'pin-button'}
                      onClick={() => togglePin(item)}
                    >
                      {isPinned(item) ? 'Unpin' : 'Pin'}
                    </button>
                  </div>
                </li>
              ))}
              {sortedItems.length > 100 && (
                <li>
                  <em>Showing 100 of {sortedItems.length.toLocaleString()} items</em>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="performance-info">
        <h3>Performance Info</h3>
        <p>
          This example demonstrates the performance of the <code>usePinList</code> hook with{' '}
          {itemCount.toLocaleString()} items.
        </p>
        <p>
          The hook efficiently manages pinned state without recreating the entire array on each
          update. It uses <code>Set</code> and <code>Map</code> for O(1) lookups and memoization to
          prevent unnecessary recalculations.
        </p>
        <p>
          <strong>Note:</strong> This example implements its own localStorage persistence using the{' '}
          <code>onPinnedItemsChange</code> callback, showing how the hook can be integrated with any
          storage solution.
        </p>
      </div>
    </div>
  );
};

export default App;
