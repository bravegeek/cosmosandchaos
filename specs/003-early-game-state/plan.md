# Implementation Plan: Early Game & Initial State

**Branch**: `003-early-game-state` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-early-game-state/spec.md`

## Summary

Establish the foundational early game experience by initializing new games with a single Extractor card pre-placed on the grid, implementing a progressive card unlock system (hybrid: sequential T1 upgrades + resource milestones), enabling manual click-to-mine mechanics for Tier 0 cards, and implementing resource discovery (show only encountered resources in UI). This creates the critical first 5-10 minutes of gameplay where players transition from manual clicking to automated production.

**Technical Approach**: Extend existing GameState initialization to place Extractor at (2,2), add `unlocked` boolean to card state schema, implement unlock triggers via event listeners on card upgrades and resource thresholds, modify resource panel display to filter based on discovery state, and ensure manual click handlers work on Tier 0 cards.

## Technical Context

**Language/Version**: JavaScript ES6 (Browser/Vanilla JS)
**Primary Dependencies**: None (vanilla JS, no frameworks)
**Storage**: LocalStorage via existing SaveManager
**Testing**: Vitest (unit + integration tests)
**Target Platform**: Desktop web browsers (Chrome/Firefox/Safari, 1920×1080 target)
**Project Type**: Single-page web application (SPA structure)
**Performance Goals**: 60 FPS with grid updates, <100ms click response
**Constraints**: No build step (ES6 modules only), offline-capable after first load
**Scale/Scope**: 8 cards total, 20-cell visible grid (5×4), 7 resource types

## Constitution Check

*Note: Project constitution is not yet defined. Using general web game best practices.*

**General Gates** (inferred from codebase):
- ✅ **Module separation**: Feature uses existing modules (state.js, cards.js, grid.js, resources.js)
- ✅ **Test coverage**: Unit tests required for unlock logic, integration tests for initial state
- ✅ **Save/load compatibility**: Must extend SaveManager schema without breaking existing saves
- ✅ **Performance**: No blocking operations, use requestAnimationFrame for UI updates

## Project Structure

### Documentation (this feature)

```text
specs/003-early-game-state/
├── plan.md              # This file
├── research.md          # Phase 0 output (design decisions)
├── data-model.md        # Phase 1 output (state schema extensions)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── unlock-api.md    # Unlock system interface
│   └── discovery-api.md # Resource discovery interface
└── tasks.md             # Phase 2 output (NOT created by plan)
```

### Source Code (repository root)

```text
src/
├── js/
│   ├── state.js          # MODIFY: Add unlocked field, initial placement, unlock logic
│   ├── cards.js          # MODIFY: Add locked/unlocked visual states
│   ├── resources.js      # MODIFY: Add discovery tracking, filter display
│   ├── main.js           # MODIFY: Initialize with Extractor at (2,2)
│   ├── grid.js           # READ: Use existing placement methods
│   ├── modal.js          # READ: Trigger unlocks on upgrade
│   ├── production.js     # READ: Manual click handling
│   └── unlocks.js        # NEW: Unlock progression logic
├── css/
│   └── cards.css         # MODIFY: Add .card-locked styles
└── index.html            # MODIFY: Add card selection/deck UI

tests/
├── unlocks.test.js       # NEW: Unlock progression tests
├── initial-state.test.js # NEW: Game initialization tests
├── discovery.test.js     # NEW: Resource discovery tests
└── state.test.js         # MODIFY: Extend for unlocked field
```

**Structure Decision**: Single-page application structure matches existing codebase. New unlock system will be isolated in `unlocks.js` with integration points in `state.js` for triggers and persistence.

## Complexity Tracking

*No constitution violations - feature extends existing patterns cleanly.*
