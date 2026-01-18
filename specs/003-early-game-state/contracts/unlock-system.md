# API Contract: UnlockManager

**Module**: `src/js/unlock.js` (NEW)
**Purpose**: Manage card unlock progression via hybrid sequential and milestone-based system

---

## Class: UnlockManager

### Constructor

```javascript
constructor(gameState)
```

**Parameters**:
- `gameState: GameState` - Reference to centralized game state

**Initializes**:
- `unlockRules` - Configuration object with sequential and milestone unlock rules
- Event listeners for EVENTS.CARD_UPGRADED and EVENTS.RESOURCE_CHANGED

**Example**:
```javascript
const unlockManager = new UnlockManager(gameState);
```

---

### Property: unlockRules

```javascript
unlockRules: {
  sequential: Array<SequentialUnlockRule>,
  milestones: Array<MilestoneUnlockRule>
}
```

**Type Definitions**:
```typescript
interface SequentialUnlockRule {
  card: string;           // Card to unlock (CARDS.PROCESSOR, etc.)
  trigger: {
    type: 'tier_upgrade';
    cardId: string;       // Card that must be upgraded (CARDS.EXTRACTOR, etc.)
    tier: number;         // Target tier (1 for T0→T1)
  };
}

interface MilestoneUnlockRule {
  card: string;           // Card to unlock (CARDS.LAB, etc.)
  trigger: {
    type: 'resource';
    resource: string;     // Resource type (RESOURCES.DATA, etc.)
    threshold: number;    // Minimum value to unlock (50, 100, 200, etc.)
  };
}
```

**Configuration**:
```javascript
unlockRules = {
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

---

### Method: checkSequentialUnlocks

```javascript
checkSequentialUnlocks(cardId: string, tier: number): Array<string>
```

**Purpose**: Check if a tier upgrade triggers any sequential unlocks.

**Parameters**:
- `cardId: string` - Card that was upgraded
- `tier: number` - New tier level

**Returns**:
- `Array<string>` - Card IDs that were unlocked (empty if none)

**Behavior**:
1. Filter `unlockRules.sequential` for rules matching `cardId` and `tier`
2. For each matching rule:
   - Check if target card is already unlocked → Skip
   - Set `gameState.cards[rule.card].unlocked = true`
   - Emit EVENTS.CARD_UNLOCKED { cardId: rule.card }
   - Add to result array
3. Return array of newly unlocked card IDs

**Example**:
```javascript
// Extractor upgraded to T1
const unlocked = unlockManager.checkSequentialUnlocks(CARDS.EXTRACTOR, 1);
// Returns: [CARDS.PROCESSOR]
```

**Events Emitted**:
- `EVENTS.CARD_UNLOCKED` - { cardId } for each newly unlocked card

---

### Method: checkMilestoneUnlocks

```javascript
checkMilestoneUnlocks(resourceType: string, value: number): Array<string>
```

**Purpose**: Check if a resource value reaching a threshold triggers any milestone unlocks.

**Parameters**:
- `resourceType: string` - Resource that changed (RESOURCES.DATA, etc.)
- `value: number` - New resource value

**Returns**:
- `Array<string>` - Card IDs that were unlocked (empty if none)

**Behavior**:
1. Filter `unlockRules.milestones` for rules matching `resourceType`
2. For each matching rule:
   - Check if `value >= rule.trigger.threshold` → Continue
   - Check if target card is already unlocked → Skip
   - Set `gameState.cards[rule.card].unlocked = true`
   - Emit EVENTS.CARD_UNLOCKED { cardId: rule.card }
   - Add to result array
3. Return array of newly unlocked card IDs

**Example**:
```javascript
// Data reaches 50 for first time
const unlocked = unlockManager.checkMilestoneUnlocks(RESOURCES.DATA, 50);
// Returns: [CARDS.LAB]

// Energy increases from 90 to 105 (crosses threshold)
const unlocked2 = unlockManager.checkMilestoneUnlocks(RESOURCES.ENERGY, 105);
// Returns: [CARDS.HABITAT]

// Ore increases from 150 to 180 (below threshold still)
const unlocked3 = unlockManager.checkMilestoneUnlocks(RESOURCES.ORE, 180);
// Returns: [] (no unlock yet, need 200)
```

**Events Emitted**:
- `EVENTS.CARD_UNLOCKED` - { cardId } for each newly unlocked card

**Important**: Milestone unlocks are **independent** (clarification #2). Multiple milestones can unlock out of order.

---

### Method: setupListeners

```javascript
setupListeners(): void
```

**Purpose**: Register event listeners for unlock triggers (called in constructor).

**Behavior**:
1. Listen to `EVENTS.CARD_UPGRADED`:
   - Extract `cardId` and `tier` from event
   - Call `checkSequentialUnlocks(cardId, tier)`

2. Listen to `EVENTS.RESOURCE_CHANGED`:
   - Extract `resource` and `value` from event
   - Call `checkMilestoneUnlocks(resource, value)`

**Example**:
```javascript
// Automatic setup in constructor
constructor(gameState) {
  this.gameState = gameState;
  this.setupListeners(); // Registers event handlers
}
```

---

### Method: getUnlockProgress

```javascript
getUnlockProgress(cardId: string): UnlockProgress | null
```

**Purpose**: Get current unlock progress for a locked card (useful for UI tooltips).

**Parameters**:
- `cardId: string` - Card to check

**Returns**:
```typescript
interface UnlockProgress {
  card: string;
  unlocked: boolean;
  rule: SequentialUnlockRule | MilestoneUnlockRule;
  progress?: {
    current: number;
    required: number;
    percentage: number;
  };
}
```

**Example**:
```javascript
// Check Lab unlock progress (requires 50 data)
const progress = unlockManager.getUnlockProgress(CARDS.LAB);
// Returns: {
//   card: 'lab',
//   unlocked: false,
//   rule: { card: 'lab', trigger: { type: 'resource', resource: 'data', threshold: 50 } },
//   progress: { current: 25, required: 50, percentage: 50 }
// }

// Check Processor unlock (requires Extractor T1)
const progress2 = unlockManager.getUnlockProgress(CARDS.PROCESSOR);
// Returns: {
//   card: 'processor',
//   unlocked: false,
//   rule: { card: 'processor', trigger: { type: 'tier_upgrade', cardId: 'extractor', tier: 1 } },
//   progress: { current: 0, required: 1, percentage: 0 }  // Tier 0/1
// }
```

---

## Events

### EVENTS.CARD_UNLOCKED

**Payload**:
```typescript
{
  cardId: string;
  unlockType: 'sequential' | 'milestone';
  trigger: SequentialUnlockRule['trigger'] | MilestoneUnlockRule['trigger'];
  timestamp: number;
}
```

**Triggered**: When a card transitions from locked to unlocked

**Listeners**:
- UI layer (show "New card unlocked!" notification)
- DisplayUpdateManager (update card selection UI)
- Achievement system (future)

---

## Integration with Existing Systems

### GameState

**Dependencies**:
- `gameState.cards[cardId].unlocked` - Read/write unlock state
- `gameState.cards[cardId].tier` - Read for sequential unlock checks
- `gameState.resources[resourceType]` - Read for milestone unlock checks
- `gameState.on(EVENTS.CARD_UPGRADED)` - Listen for tier upgrades
- `gameState.on(EVENTS.RESOURCE_CHANGED)` - Listen for resource changes

**Events**:
- Listens: EVENTS.CARD_UPGRADED, EVENTS.RESOURCE_CHANGED
- Emits: EVENTS.CARD_UNLOCKED

### SaveManager

**Integration**:
- Unlock state persisted via `gameState.cards[cardId].unlocked` field
- No separate unlock state object (unlocked is part of card state)
- Migration from version 1 → 2 adds unlocked field

---

## Testing Contract

### Unit Tests Required

1. **Sequential Unlocks**:
   - Extractor T0→T1 → Processor unlocks
   - Processor T0→T1 → Reactor unlocks
   - Reactor T0→T1 → Sensor unlocks
   - Already unlocked card → No duplicate unlock event

2. **Milestone Unlocks**:
   - Data reaches 50 → Lab unlocks
   - Energy reaches 100 → Habitat unlocks
   - Metal reaches 50 → Engine unlocks
   - Ore reaches 200 → Storage unlocks
   - Value below threshold → No unlock
   - Already unlocked card → No duplicate unlock event

3. **Independence** (Clarification #2):
   - Energy reaches 100 before Data reaches 50 → Habitat unlocks independently
   - Multiple milestones in single tick → All unlock correctly

4. **Event Emission**:
   - Each unlock → EVENTS.CARD_UNLOCKED emitted with correct payload
   - No unlock → No event emitted

5. **Progress Tracking**:
   - getUnlockProgress returns correct current/required values
   - Percentage calculated correctly

### Integration Tests Required

1. **Full Sequential Chain**:
   - New game → Upgrade Extractor → Processor unlocks
   - Upgrade Processor → Reactor unlocks
   - Upgrade Reactor → Sensor unlocks

2. **Out-of-Order Milestones**:
   - Produce 200 ore → Storage unlocks
   - Later produce 50 data → Lab unlocks (out of assumed order)

3. **UI Integration**:
   - Unlock triggers → Card selection UI updates
   - Locked card hover → Shows unlock progress tooltip

---

## Performance Considerations

- **O(n) unlock checks**: Iterates through rules array (max ~7 rules), negligible overhead
- **Event-driven**: No polling, only checks on relevant state changes
- **Minimal memory**: Only stores unlock rules config (~1KB)
- **Single unlock per card**: Cards can't unlock twice (already unlocked check prevents duplicates)

---

## Edge Cases

1. **Simultaneous Milestones**:
   - Single resource change crosses multiple thresholds → All unlock correctly
   - Example: Energy 0→150 unlocks Habitat (100 threshold)

2. **Save/Load**:
   - Unlocked state persists
   - Loading game doesn't re-trigger unlock events

3. **Corruption Recovery** (Clarification #5):
   - Invalid unlock state detected → Reset all to locked except Extractor
   - Grid state preserved (placed cards may become locked, but remain on grid)

4. **Already Unlocked**:
   - Triggering same unlock multiple times → No effect (idempotent)

---

## Future Extensions

- **Multi-condition unlocks**: "Unlock when X AND Y" (not in spec, YAGNI)
- **Temporary unlocks**: Time-limited card availability (events/challenges)
- **Unlock hints**: Show "75% progress to unlock Lab" in UI
- **Unlock animations**: Visual celebration when card unlocks
