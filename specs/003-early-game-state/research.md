# Research: Early Game & Initial State

**Phase 0 Output** | **Date**: 2026-01-04 | **Plan**: [plan.md](./plan.md)

## Research Questions

This document resolves all unknowns and technical decisions for implementing the early game state feature.

---

## R1: Click Rate Limiting Implementation

**Decision**: Implement per-card timestamp-based rate limiting with 100ms cooldown (10 clicks/second)

**Rationale**:
- **Timestamp-based approach**: Track last click timestamp per card ID, reject clicks within 100ms window
- **Per-card isolation**: Each card maintains independent rate limit state (player can click multiple cards simultaneously)
- **Visual feedback**: CSS animation (shake/flash) when click is rejected, clear user communication
- **Performance**: Minimal overhead (1 timestamp comparison per click), no timers or intervals required

**Implementation Pattern**:
```javascript
class ClickHandler {
  constructor() {
    this.lastClickTimestamps = {}; // { cardId: timestamp }
    this.CLICK_COOLDOWN_MS = 100;  // 10 clicks/second
  }

  handleClick(cardId) {
    const now = Date.now();
    const lastClick = this.lastClickTimestamps[cardId] || 0;

    if (now - lastClick < this.CLICK_COOLDOWN_MS) {
      // Trigger rate limit feedback
      return { success: false, reason: 'rate_limit' };
    }

    this.lastClickTimestamps[cardId] = now;
    // Process click...
    return { success: true, reward: {...} };
  }
}
```

**Alternatives Considered**:
- **Token bucket algorithm**: Over-engineered for simple rate limiting, adds complexity
- **Global cooldown**: Would prevent multi-card clicking, poor UX
- **Server-side validation**: Not applicable (client-side only game)

**Testing Strategy**: Mock Date.now() to verify cooldown enforcement, test visual feedback triggers

---

## R2: Unlock System Architecture

**Decision**: Event-driven milestone detection with dual unlock paths (sequential + resource-based)

**Rationale**:
- **Event-driven**: Listen to EVENTS.CARD_UPGRADED and EVENTS.RESOURCE_CHANGED for unlock triggers
- **Dual paths**: Sequential unlocks (Processor→Reactor→Sensor via tier upgrades) + milestone unlocks (Lab/Habitat/Engine/Storage via resource thresholds)
- **Independence**: Milestone cards can unlock out of order (spec clarification #2), no dependencies between paths
- **State tracking**: `unlocked: boolean` field in GameState.cards, persisted via SaveManager

**Implementation Pattern**:
```javascript
class UnlockManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.unlockRules = {
      sequential: [
        { card: CARDS.PROCESSOR, trigger: { type: 'tier_upgrade', cardId: CARDS.EXTRACTOR, tier: 1 } },
        { card: CARDS.REACTOR, trigger: { type: 'tier_upgrade', cardId: CARDS.PROCESSOR, tier: 1 } },
        { card: CARDS.SENSOR, trigger: { type: 'tier_upgrade', cardId: CARDS.REACTOR, tier: 1 } }
      ],
      milestones: [
        { card: CARDS.LAB, trigger: { type: 'resource', resource: RESOURCES.DATA, threshold: 50 } },
        { card: CARDS.HABITAT, trigger: { type: 'resource', resource: RESOURCES.ENERGY, threshold: 100 } },
        { card: CARDS.ENGINE, trigger: { type: 'resource', resource: RESOURCES.METAL, threshold: 50 } },
        { card: CARDS.STORAGE, trigger: { type: 'resource', resource: RESOURCES.ORE, threshold: 200 } }
      ]
    };
    this.setupListeners();
  }

  checkUnlocks() {
    // Check both sequential and milestone paths
    // Unlock cards when conditions met
  }
}
```

**Alternatives Considered**:
- **Polling approach**: Inefficient, would check conditions every frame
- **Unified unlock path**: Spec requires hybrid approach, rejected for complexity
- **Manual unlock triggers**: Error-prone, event-driven is more maintainable

**Testing Strategy**: Unit tests for each unlock rule, integration tests for out-of-order scenarios

---

## R3: Resource Discovery System

**Decision**: Lazy initialization pattern with `discovered` flag per resource type

**Rationale**:
- **Lazy discovery**: Resources hidden until value > 0 for first time (FR-009)
- **Persistent state**: `discoveredResources: Set<string>` in GameState, persisted to LocalStorage
- **Display filtering**: DisplayUpdateManager checks discovery state before rendering resource counters
- **Initial state**: Only ORE discovered at game start (spec SC-003)

**Implementation Pattern**:
```javascript
// In GameState
class GameState {
  constructor() {
    this.discoveredResources = new Set([RESOURCES.ORE]); // Ore visible at start
  }

  addResource(resourceType, amount) {
    const oldValue = this.resources[resourceType];
    this.resources[resourceType] += amount;

    // Discover resource if transitioning from 0 to >0
    if (oldValue === 0 && this.resources[resourceType] > 0) {
      this.discoverResource(resourceType);
    }
  }

  discoverResource(resourceType) {
    if (!this.discoveredResources.has(resourceType)) {
      this.discoveredResources.add(resourceType);
      this.emit(EVENTS.RESOURCE_DISCOVERED, { resourceType });
    }
  }
}

// In DisplayUpdateManager
updateResourceDisplays() {
  for (const resourceType of Object.values(RESOURCES)) {
    const element = document.querySelector(`[data-resource="${resourceType}"]`);
    if (element) {
      // Show/hide based on discovery state
      element.parentElement.style.display =
        gameState.discoveredResources.has(resourceType) ? 'flex' : 'none';
    }
  }
}
```

**Alternatives Considered**:
- **Threshold-based discovery**: More complex, rejected for simplicity (spec uses >0 rule)
- **Manual discovery triggers**: Error-prone, automatic detection is cleaner
- **No discovery system**: Would overwhelm new players (spec priority P3 for good reason)

**Testing Strategy**: Test discovery on first resource gain, verify persistence, test display filtering

---

## R4: Initial State Setup

**Decision**: Programmatic card placement during new game initialization in main.js

**Rationale**:
- **Entry point**: `main.js` handles new game setup, calls `initializeNewGame()`
- **Pre-placement**: Use existing grid.placeCard() API to place Extractor at (2,2)
- **State initialization**: Set Extractor unlocked=true, tier=0, automated=false
- **Idempotency**: Only place card on new games, not on load (SaveManager handles loads)

**Implementation Pattern**:
```javascript
// In main.js
function initializeNewGame() {
  // Initialize GameState
  const gameState = new GameState();

  // Set initial unlock states
  gameState.cards[CARDS.EXTRACTOR].unlocked = true;
  // All other cards start locked (default false)

  // Pre-place Extractor at grid position (2,2)
  grid.placeCard(CARDS.EXTRACTOR, 2, 2);

  // Set Extractor state
  gameState.cards[CARDS.EXTRACTOR].placed = true;
  gameState.cards[CARDS.EXTRACTOR].row = 2;
  gameState.cards[CARDS.EXTRACTOR].col = 2;
  gameState.cards[CARDS.EXTRACTOR].tier = 0;
  gameState.cards[CARDS.EXTRACTOR].automated = false;

  // Discover ore resource
  gameState.discoveredResources.add(RESOURCES.ORE);

  return gameState;
}
```

**Alternatives Considered**:
- **Hard-coded HTML**: Would bypass grid system, rejected for consistency
- **Config-driven placement**: Over-engineered for single pre-placed card
- **User placement first**: Violates spec requirement for immediate playability

**Testing Strategy**: Test new game creates Extractor at (2,2), verify initial state values

---

## R5: Manual Click Yields for Tier 0 Cards

**Decision**: Config-driven manual click yields in CARD_CONFIGS with tier-specific behavior

**Rationale**:
- **Config-based**: Add `manualClickYield` field to CARD_CONFIGS for each card
- **Tier 0 only**: Manual clicking only works on tier 0 cards (spec FR-002)
- **Extractor yield**: 1 ore per click (spec FR-012), requires 50 clicks for T1 upgrade
- **Other cards**: Define manual yields for future Tier 0 cards (Sensor: 5 energy → 2 data per spec)

**Implementation Pattern**:
```javascript
// In cardConfigs.js
export const CARD_CONFIGS = {
  [CARDS.EXTRACTOR]: {
    // ... existing config
    manualClickYield: {
      consume: {},  // No inputs consumed
      produce: { [RESOURCES.ORE]: 1 }
    }
  },
  [CARDS.SENSOR]: {
    // ... existing config
    manualClickYield: {
      consume: { [RESOURCES.ENERGY]: 5 },
      produce: { [RESOURCES.DATA]: 2 }
    }
  }
  // ... other cards
};

// In clickHandler.js
processManualClick(cardId) {
  const card = gameState.cards[cardId];
  const config = CARD_CONFIGS[cardId];

  // Only Tier 0 cards support manual clicking
  if (card.tier !== 0) {
    return { success: false, reason: 'tier_too_high' };
  }

  const yield = config.manualClickYield;
  // Check if player has required inputs
  // Consume inputs, produce outputs
  // Trigger resource discovery if needed
}
```

**Alternatives Considered**:
- **Hard-coded yields**: Less maintainable, rejected for flexibility
- **All tiers clickable**: Violates spec design (automation replaces clicking at T1+)
- **Dynamic yields**: Not required by spec, YAGNI principle applies

**Testing Strategy**: Test manual click yields match config, verify tier 0 restriction, test input consumption

---

## R6: Error Handling for Grid Full Scenario

**Decision**: Inline error message/tooltip display with retry mechanism

**Rationale**:
- **User feedback**: Display error message "Grid is full. Remove a card first to place this one." (spec FR-016, clarification #4)
- **Tooltip mechanism**: Use existing modal system or create temporary error toast
- **No auto-removal**: Player must manually remove card (clarification #4 rejected auto-removal)
- **Retry flow**: Error clears when player attempts new action

**Implementation Pattern**:
```javascript
// In cards.js or grid.js
function attemptCardPlacement(cardId, row, col) {
  // Check if grid is full
  const placedCards = Object.values(gameState.cards).filter(c => c.placed).length;
  const gridCapacity = GRID_ROWS * GRID_COLS; // 5 * 4 = 20

  if (placedCards >= gridCapacity) {
    showError("Grid is full. Remove a card first to place this one.");
    return { success: false, reason: 'grid_full' };
  }

  // Proceed with placement...
}

function showError(message) {
  // Option 1: Use existing modal system
  // Option 2: Create temporary toast notification
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
```

**Alternatives Considered**:
- **Silent failure**: Poor UX, rejected (clarification #4 explicitly requires feedback)
- **Auto-remove oldest card**: Violates clarification #4 decision
- **Queueing system**: Over-engineered, rejected per clarification #4

**Testing Strategy**: Test grid full detection, verify error message display, test retry flow

---

## R7: Corrupted Unlock Data Recovery

**Decision**: Reset unlock state to default on detection, preserve other game state

**Rationale**:
- **Detection**: Validate unlock state during SaveManager.load(), check for impossible states
- **Recovery**: Reset all cards to default unlock state (only Extractor unlocked) on corruption
- **Preservation**: Keep resources, grid placement, card tiers intact (clarification #5)
- **Logging**: Console warn on recovery, inform player of reset

**Implementation Pattern**:
```javascript
// In save.js SaveManager
load() {
  const savedData = JSON.parse(localStorage.getItem('gameState'));

  // Validate unlock state
  if (!this.validateUnlockState(savedData)) {
    console.warn('Corrupted unlock data detected. Resetting unlock state to default.');
    savedData.cards = this.resetUnlockState(savedData.cards);
    // Keep resources, grid state, etc.
  }

  return savedData;
}

validateUnlockState(data) {
  // Check for impossible states:
  // - Extractor must be unlocked
  // - Cards can't be placed if not unlocked
  // - etc.

  const extractor = data.cards[CARDS.EXTRACTOR];
  if (!extractor.unlocked) return false;

  for (const card of Object.values(data.cards)) {
    if (card.placed && !card.unlocked) return false;
  }

  return true;
}

resetUnlockState(cards) {
  for (const cardId of Object.keys(cards)) {
    cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
  }
  return cards;
}
```

**Alternatives Considered**:
- **Fail to load**: Poor UX, player loses all progress (rejected per clarification #5)
- **Heuristic repair**: Complex, error-prone, timestamp-based detection unreliable
- **Unlock all cards**: Violates progression system, rejected per clarification #5

**Testing Strategy**: Test detection of various corruption scenarios, verify recovery preserves resources/grid

---

## Summary of Key Decisions

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| **Click Rate Limiting** | Timestamp-based, per-card, 100ms cooldown | Simple, performant, clear user feedback |
| **Unlock System** | Event-driven dual paths (sequential + milestones) | Matches spec hybrid model, scalable |
| **Resource Discovery** | Lazy initialization with Set tracking | Clean discovery rule (>0), persistent |
| **Initial State** | Programmatic placement in main.js | Centralized initialization, testable |
| **Manual Click Yields** | Config-driven with tier 0 restriction | Maintainable, matches spec behavior |
| **Grid Full Error** | Inline error message/tooltip | Clear feedback, matches clarification |
| **Data Corruption** | Reset unlocks, preserve other state | Balanced recovery, minimal player loss |

## Next Steps

Phase 1 (Design & Contracts):
1. Generate data-model.md with entity schemas
2. Create API contracts in /contracts/
3. Write quickstart.md developer guide
4. Update agent context with research findings
