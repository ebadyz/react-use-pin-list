# react-use-pin-list

## Getting Started

`usePinList` is a high-performance, fully-typed React hook for managing pinned items in large lists. The bundle size is under 1KB gzipped. It can be seamlessly integrated with [TanStack Virtual](https://tanstack.com/virtual/latest) for virtualized lists and [hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop reordering.

- **React version required:** `react` and `react-dom` >=16.8.0 (Hooks support and compatibility)

## Supported Feature Set

- Pin, unpin, and toggle pin state for any item
- Reorder pinned items (with optional drag-and-drop integration)
- Limit the maximum number of pinned items
- Efficient for very large lists
- TypeScript support with full type definitions
- No built-in storage dependencies (bring your own persistence)
- Customizable callbacks for pin state changes
- Memory-efficient state management (uses Set/Map internally)
- Works with virtualization libraries (e.g., TanStack Virtual)
- Works with drag-and-drop libraries (e.g., hello-pangea/dnd)
- Zero dependencies, minimal bundle size

## Documentation

- [Installation](docs/installation.md)
- [Quick Start](docs/quick-start.md)
- [Basic Usage](docs/basic-usage.md)
- [Advanced Usage](docs/advanced-usage.md)
- [API Reference](docs/api.md)

For API details, usage patterns, and integration examples, see the relevant markdown files above.

---

MIT License
