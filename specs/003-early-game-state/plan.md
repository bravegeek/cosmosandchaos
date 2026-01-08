# Implementation Plan: Early Game & Initial State

**Branch**: `003-early-game-state` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-early-game-state/spec.md`

## Summary

Implement the initial game state and early-game progression loop for Cosmos and Chaos idle game. The feature introduces:
- Pre-placed Extractor T0 card at grid position (2,2) for immediate gameplay
- Manual clicking mechanics for Tier 0 cards (1 ore per click, rate-limited to 10 clicks/second)
- Card unlock system with hybrid progression (sequential unlocks via upgrades + milestone unlocks via resources)
- Resource discovery system showing only encountered resources in the UI
- First automation milestone (T0 → T1 upgrade unlocks automation + next card)

**Technical Approach**: Extend existing GameState with unlock tracking, add click handlers with rate limiting, implement milestone detection system, enhance resource display with discovery state, integrate with existing save/load system.

## Technical Context

**Language/Version**: JavaScript ES6+ (browser native modules)
**Primary Dependencies**: None (vanilla JS), Vitest 1.0+ for testing
**Storage**: LocalStorage (via existing SaveManager in `src/js/save.js`)
**Testing**: Vitest with jsdom environment for DOM interactions
**Target Platform**: Modern browsers (Chrome/Firefox/Safari, ES6 module support required)
**Project Type**: Single-page web application (client-side only, no backend)
**Performance Goals**: 60 FPS during gameplay, <100ms response to click events (SC-006), <5 second initial load (SC-001)
**Constraints**: 10 clicks/second rate limit per card, LocalStorage size limits (~5-10MB), maintain existing test coverage >70%
**Scale/Scope**: 8 card types, 7 resource types, 5x4 grid viewport, single-player offline game

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ⚠️ NO CONSTITUTION DEFINED

The project does not currently have a constitution file (`.specify/memory/constitution.md` is a template). This feature will proceed with industry best practices:
- Test-first development (existing pattern: 175 tests passing in Phase 2)
- Event-driven architecture (existing GameState event bus)
- Single source of truth (GameState centralization)
- Backwards-compatible save migrations (existing SaveManager pattern)

**Re-evaluation Point**: After Phase 1 design artifacts are complete, verify adherence to existing codebase patterns.

## Project Structure

### Documentation (this feature)

```text
specs/003-early-game-state/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (unknowns resolved)
├── data-model.md        # Phase 1 output (entity schemas)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── click-handler.md
│   ├── unlock-system.md
│   └── discovery-system.md
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT YET CREATED)
```

### Source Code (repository root)

```text
src/
├── index.html           # Main HTML (resource panel updates)
├── css/
│   ├── cards.css        # Card styles (locked state visuals)
│   └── variables.css    # CSS variables (colors, animations)
└── js/
    ├── main.js          # Entry point (new game initialization)
    ├── state.js         # GameState (add unlock tracking, discovery state)
    ├── cardConfigs.js   # Card configurations (manual click yields)
    ├── cards.js         # Card rendering (locked/unlocked visuals)
    ├── grid.js          # Grid management (programmatic placement)
    ├── production.js    # Production loop (already exists, no changes)
    ├── display.js       # Display updates (resource discovery filtering)
    ├── save.js          # SaveManager (unlock state persistence)
    ├── clickHandler.js  # NEW: Manual click logic with rate limiting
    └── unlock.js        # NEW: Card unlock progression system

tests/
├── clickHandler.test.js    # NEW: Click rate limiting, manual production
├── unlock.test.js          # NEW: Sequential + milestone unlock logic
├── discovery.test.js       # NEW: Resource visibility rules
├── initialState.test.js    # NEW: Pre-placed card, default unlock state
└── state.test.js           # EXTEND: Unlock state, discovery tracking
```

**Structure Decision**: Single-page web application structure maintained. Core logic in `src/js/` modules, tests mirror source structure in `tests/`. New feature adds 2 new modules (`clickHandler.js`, `unlock.js`) and 4 new test files, extends 4 existing modules (`state.js`, `cards.js`, `display.js`, `save.js`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations to track (no constitution defined). This section reserved for future use if project constitution is ratified.
