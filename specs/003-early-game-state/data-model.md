# Data Model: Early Game & Initial State

**Phase 1 Output** | **Date**: 2026-01-04 | **Plan**: [plan.md](./plan.md)

## Overview

This document defines the data structures and state schemas for the early game state feature. All entities extend the existing GameState architecture.

---

## Entity: CardState (Extended)

**Purpose**: Represents the runtime state of a card, tracking placement, production, and unlock status.

**Location**: `GameState.cards[cardId]` in `src/js/state.js`

### Schema

```typescript
interface CardState {
  // Existing fields (Phase 1-2)
  id: string;                    // Card identifier (CARDS.EXTRACTOR, etc.)
  placed: boolean;               // Whether card is on grid
  row: number | null;            // Grid row position (0-4)
  col: number | null;            // Grid column position (0-3)
  production: number;            // Total resources produced (lifetime counter)
  automated: boolean;            // Whether automation is active (tier >= 1)
  rate: number;                  // Production rate (units/second)
  tier: number;                  // Current tier level (0-2)
  ioIndicators: Array<object>;   // I/O connection indicators (Phase 2)

  // NEW: Phase 4 fields
  unlocked: boolean;             // Whether card is available for placement
}
```

### Validation Rules

- `id` must match CARDS constant
- `placed` must be `false` if `row === null || col === null`
- `unlocked` must be `true` if `placed === true` (can't place locked cards)
- `tier` must be `0` for new games (manual mode)
- `automated` must be `false` when `tier === 0`
- Extractor must have `unlocked === true` at all times (game requirement)

### State Transitions

```
New Game:
  Extractor: { unlocked: true, placed: true, row: 2, col: 2, tier: 0, automated: false }
  All Others: { unlocked: false, placed: false, row: null, col: null, tier: 0, automated: false }

Unlock Trigger:
  { unlocked: false } → { unlocked: true }
  (via UnlockManager when conditions met)

Card Placement:
  { unlocked: true, placed: false } → { placed: true, row: X, col: Y }
  (via grid.placeCard())

Tier Upgrade (T0 → T1):
  { tier: 0, automated: false } → { tier: 1, automated: true }
  (triggers sequential unlock for next card)
```

### Persistence

- Saved to LocalStorage via SaveManager
- Schema version tracking for migrations
- Unlock state persisted in `cards[cardId].unlocked` field

---

## Entity: DiscoveredResources (New)

**Purpose**: Tracks which resource types have been produced at least once, controlling UI visibility.

**Location**: `GameState.discoveredResources` in `src/js/state.js`

### Schema

```typescript
interface GameState {
  // ... existing fields
  discoveredResources: Set<string>;  // Resource types that have been encountered
}
```

**Initial State**: `new Set([RESOURCES.ORE])` (only ore visible at start)

**Example Runtime State**:
```javascript
// After producing energy for first time
gameState.discoveredResources = new Set(['ore', 'energy']);
```

### Validation Rules

- Must be a Set (no duplicates)
- All values must be valid RESOURCES constants
- ORE must always be present (can't be removed)
- Set persists to LocalStorage as Array (converted back to Set on load)

### State Transitions

```
Initial State:
  discoveredResources = Set(['ore'])

First Production of Resource:
  Resource value: 0 → >0
  discoveredResources.add(resourceType)
  Emit EVENTS.RESOURCE_DISCOVERED

Display Update:
  RESOURCE_DISCOVERED event → Show resource counter in UI
```

---

## Entity: UnlockRule (New)

**Purpose**: Configuration data defining unlock conditions for each card.

**Location**: `UnlockManager.unlockRules` in new `src/js/unlock.js` module

### Schema

```typescript
interface UnlockRule {
  card: string;           // Card ID to unlock (CARDS.PROCESSOR, etc.)
  trigger: UnlockTrigger; // Condition that unlocks this card
}

type UnlockTrigger =
  | { type: 'tier_upgrade', cardId: string, tier: number }  // Sequential unlock
  | { type: 'resource', resource: string, threshold: number }; // Milestone unlock
```

**Example Configuration**:
```javascript
const unlockRules = {
  sequential: [
    {
      card: CARDS.PROCESSOR,
      trigger: { type: 'tier_upgrade', cardId: CARDS.EXTRACTOR, tier: 1 }
    },
    {
      card: CARDS.REACTOR,
      trigger: { type: 'tier_upgrade', cardId: CARDS.PROCESSOR, tier: 1 }
    },
    {
      card: CARDS.SENSOR,
      trigger: { type: 'tier_upgrade', cardId: CARDS.REACTOR, tier: 1 }
    }
  ],
  milestones: [
    {
      card: CARDS.LAB,
      trigger: { type: 'resource', resource: RESOURCES.DATA, threshold: 50 }
    },
    {
      card: CARDS.HABITAT,
      trigger: { type: 'resource', resource: RESOURCES.ENERGY, threshold: 100 }
    },
    {
      card: CARDS.ENGINE,
      trigger: { type: 'resource', resource: RESOURCES.METAL, threshold: 50 }
    },
    {
      card: CARDS.STORAGE,
      trigger: { type: 'resource', resource: RESOURCES.ORE, threshold: 200 }
    }
  ]
};
```

### Validation Rules

- Each card can only have one unlock rule
- Sequential unlocks must form a valid chain (no cycles)
- Milestone thresholds must be positive numbers
- Extractor has no unlock rule (starts unlocked)

### Behavior Notes

- Milestone unlocks are independent (can unlock out of order per clarification #2)
- Sequential unlocks must complete in order
- Unlock checks trigger on EVENTS.CARD_UPGRADED and EVENTS.RESOURCE_CHANGED

---

## Entity: ClickRateLimit (New)

**Purpose**: Tracks per-card click timestamps for rate limiting.

**Location**: `ClickHandler.lastClickTimestamps` in new `src/js/clickHandler.js` module

### Schema

```typescript
interface ClickRateLimit {
  lastClickTimestamps: Map<string, number>;  // { cardId: timestamp (ms) }
  CLICK_COOLDOWN_MS: number;                 // Constant: 100ms (10 clicks/sec)
}
```

**Example Runtime State**:
```javascript
{
  lastClickTimestamps: {
    'extractor': 1704380400500,  // Last clicked at this timestamp
    'sensor': 1704380400300
  },
  CLICK_COOLDOWN_MS: 100
}
```

### Validation Rules

- Timestamps must be valid Date.now() values
- Cooldown is constant (100ms, not configurable)
- Rate limit applies per-card (independent cooldowns)
- Not persisted to LocalStorage (runtime state only)

### State Transitions

```
Click Attempt:
  IF (now - lastClickTimestamps[cardId]) < CLICK_COOLDOWN_MS:
    REJECT click → Trigger visual feedback
  ELSE:
    ACCEPT click → Update lastClickTimestamps[cardId] = now
    Process manual click yield
```

---

## Entity: ManualClickYield (New Config)

**Purpose**: Defines resource consumption and production for manual clicks on Tier 0 cards.

**Location**: `CARD_CONFIGS[cardId].manualClickYield` in `src/js/cardConfigs.js`

### Schema

```typescript
interface ManualClickYield {
  consume: { [resourceType: string]: number };  // Resources consumed per click
  produce: { [resourceType: string]: number };  // Resources produced per click
}
```

**Example Configuration**:
```javascript
[CARDS.EXTRACTOR]: {
  // ... existing config
  manualClickYield: {
    consume: {},  // No inputs required
    produce: { [RESOURCES.ORE]: 1 }  // 1 ore per click
  }
},
[CARDS.SENSOR]: {
  // ... existing config
  manualClickYield: {
    consume: { [RESOURCES.ENERGY]: 5 },  // Requires 5 energy
    produce: { [RESOURCES.DATA]: 2 }      // Produces 2 data
  }
}
```

### Validation Rules

- All resource types must be valid RESOURCES constants
- Amounts must be positive numbers
- Only Tier 0 cards use manual click yields
- Consume resources must be available in GameState before click processes

### Usage Notes

- Checked by ClickHandler before processing manual click
- Insufficient consume resources → Click rejected with error feedback
- Successful click → Consume inputs, produce outputs, trigger resource discovery

---

## Relationships

```
GameState
  ├── cards: Map<string, CardState>
  │   └── [cardId].unlocked ← Modified by UnlockManager
  ├── discoveredResources: Set<string> ← Updated by addResource()
  └── resources: Map<string, number> ← Modified by ClickHandler

UnlockManager
  ├── unlockRules: { sequential, milestones }
  └── Listens to: EVENTS.CARD_UPGRADED, EVENTS.RESOURCE_CHANGED
      ├── Checks: unlockRules conditions
      └── Modifies: GameState.cards[cardId].unlocked

ClickHandler
  ├── lastClickTimestamps: Map<string, number>
  └── On card click:
      ├── Checks: Rate limit (lastClickTimestamps)
      ├── Checks: Card tier === 0
      ├── Checks: Sufficient consume resources
      ├── Modifies: GameState.resources (consume + produce)
      └── Triggers: Resource discovery if value 0 → >0

CARD_CONFIGS
  └── [cardId].manualClickYield
      └── Used by: ClickHandler to determine click rewards
```

---

## Data Flow Examples

### Example 1: New Game Initialization

```
1. main.js calls initializeNewGame()
2. Create GameState:
   - cards[EXTRACTOR].unlocked = true, placed = true, row = 2, col = 2, tier = 0
   - All other cards.unlocked = false
   - discoveredResources = Set(['ore'])
3. Render grid with Extractor at (2,2)
4. Display only ORE counter (other resources hidden)
```

### Example 2: Manual Click on Extractor

```
1. Player clicks Extractor card element
2. ClickHandler.handleClick(CARDS.EXTRACTOR)
3. Check rate limit: now - lastClickTimestamps[extractor] >= 100ms ✓
4. Check tier: cards[EXTRACTOR].tier === 0 ✓
5. Get yield: CARD_CONFIGS[EXTRACTOR].manualClickYield
6. Check consume: {} (no requirements) ✓
7. Apply produce: resources[ORE] += 1
8. Update lastClickTimestamps[extractor] = now
9. Emit EVENTS.RESOURCE_CHANGED
10. DisplayUpdateManager updates ORE counter
```

### Example 3: Sequential Unlock (Extractor T0 → T1)

```
1. Player upgrades Extractor to T1 (costs 50 ore, see spec FR-015)
2. GameState.upgradeTier(EXTRACTOR, 1)
3. Emit EVENTS.CARD_UPGRADED { cardId: EXTRACTOR, tier: 1 }
4. UnlockManager receives event
5. Check unlockRules.sequential[0]: { card: PROCESSOR, trigger: { type: 'tier_upgrade', cardId: EXTRACTOR, tier: 1 } }
6. Condition met → GameState.cards[PROCESSOR].unlocked = true
7. Emit EVENTS.CARD_UNLOCKED { cardId: PROCESSOR }
8. UI updates to show Processor as available
```

### Example 4: Milestone Unlock (First Energy Production)

```
1. Sensor produces energy, resources[ENERGY] = 0 → 5
2. GameState.addResource(ENERGY, 5)
3. Check: oldValue === 0 && newValue > 0 → Trigger discovery
4. discoveredResources.add(ENERGY)
5. Emit EVENTS.RESOURCE_DISCOVERED { resourceType: ENERGY }
6. DisplayUpdateManager shows ENERGY counter
7. Emit EVENTS.RESOURCE_CHANGED { resource: ENERGY, value: 5 }
8. UnlockManager receives event
9. Check unlockRules.milestones: HABITAT unlocks at 100 energy
10. 5 < 100 → No unlock yet
... later when energy reaches 100 ...
11. UnlockManager checks: energy >= 100 ✓
12. GameState.cards[HABITAT].unlocked = true
13. Emit EVENTS.CARD_UNLOCKED { cardId: HABITAT }
```

---

## Migration Strategy

### Save File Schema Version

**Current Version**: 1 (from Phase 2)
**New Version**: 2 (Phase 4)

**Migration Path**:
```javascript
// In SaveManager.load()
if (data.version === 1) {
  // Add unlocked field to all cards
  for (const cardId of Object.keys(data.cards)) {
    data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
  }

  // Add discoveredResources
  data.discoveredResources = ['ore'];

  // Upgrade version
  data.version = 2;
}
```

### Corruption Recovery (Clarification #5)

```javascript
function validateAndRecoverUnlockState(data) {
  // Check for impossible states
  const isValid = validateUnlockState(data);

  if (!isValid) {
    console.warn('Corrupted unlock data detected. Resetting unlock state.');

    // Reset only unlock state
    for (const cardId of Object.keys(data.cards)) {
      data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
    }

    // Preserve:
    // - data.resources (all values kept)
    // - data.cards[*].placed, row, col, tier, production (grid state kept)
    // - data.cards[*].automated, rate (automation state kept if tier >= 1)
  }

  return data;
}
```

---

## Testing Considerations

### Unit Test Coverage

- **CardState**: Validate unlock state transitions, persistence
- **DiscoveredResources**: Test discovery triggers, Set → Array serialization
- **UnlockRule**: Test sequential and milestone unlock logic independently
- **ClickRateLimit**: Test cooldown enforcement, per-card isolation
- **ManualClickYield**: Test consume/produce calculations, insufficient resource handling

### Integration Test Scenarios

- New game initialization → Verify Extractor placed, unlocked, ore discovered
- Manual click → Rate limit → Visual feedback → Resource update
- T0 → T1 upgrade → Sequential unlock → UI update
- Resource milestone → Out-of-order unlock (clarification #2)
- Save/load → Unlock state persists → Discovered resources preserved
- Corrupted data → Recovery → Unlock reset, other state preserved

### Edge Cases

- Grid full → Attempt placement → Error message (clarification #4)
- Exactly 50 ore → Upgrade → 0 ore remaining (clarification #3)
- Rapid clicks → Rate limit → Shake animation
- Multiple milestones reached simultaneously → All unlock correctly
- Save file version 1 → Load → Auto-migrate to version 2
