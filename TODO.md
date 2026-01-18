# Cosmos and Chaos - TODO List

## Pending Tasks

_No pending tasks._

---

## Completed Tasks

### 1. Improve Button Click Response Performance
**Priority**: High
**Status**: Complete

Button clicking response was too slow. Fixed by:
- [x] Added DEBUG flag to constants.js (default false)
- [x] Removed console.log from hot paths (addResource, subtractResource in state.js)
- [x] Removed console.log from button click handlers (cards.js)
- [x] Wrapped module load console.logs in DEBUG checks (state.js, display.js, clickHandler.js, unlock.js)
- [x] All 203 tests passing

**Notes**: Set `DEBUG = true` in constants.js to re-enable verbose logging for development.

---

### 2. Debug/Admin Panel for Resource Manipulation
**Priority**: Medium
**Status**: Complete

Created a debug/admin panel for testing:
- [x] Designed panel UI (floating bottom-left, toggleable)
- [x] Added controls for each resource type (Ore, Metal, Energy, Data, Protocols, Xeno-Bloom, Flux-Shard)
- [x] Implemented add/remove/set resource functions with configurable amounts
- [x] Added keyboard shortcut to toggle panel (Ctrl+Shift+D)
- [x] Visual indicator when debug mode is active (pulsing bar at top of screen)
- [x] Quick actions: +100 All, Clear All, Max All (10K), Discover All
- [x] Card unlock button to unlock all cards

**Files Added**:
- `src/js/debug.js` - Debug panel module
- `src/css/debug.css` - Debug panel styles

**Usage**: Press Ctrl+Shift+D to toggle the debug panel.

---

**Last Updated**: 2026-01-17
