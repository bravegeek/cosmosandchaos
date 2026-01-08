# API Contract: ClickHandler

**Module**: `src/js/clickHandler.js`
**Purpose**: Handle manual clicks on Tier 0 cards with rate limiting and resource rewards

---

## Class: ClickHandler

### Constructor

```javascript
constructor(gameState)
```

**Parameters**:
- `gameState: GameState` - Reference to centralized game state

**Initializes**:
- `lastClickTimestamps: Map<string, number>` - Empty map for per-card cooldowns
- `CLICK_COOLDOWN_MS: 100` - Constant cooldown (10 clicks/second)

**Example**:
```javascript
const clickHandler = new ClickHandler(gameState);
```

---

### Method: handleClick

```javascript
handleClick(cardId: string): ClickResult
```

**Purpose**: Process a manual click on a card, enforcing rate limits and tier restrictions.

**Parameters**:
- `cardId: string` - Card identifier (CARDS.EXTRACTOR, etc.)

**Returns**:
```typescript
interface ClickResult {
  success: boolean;
  reason?: 'rate_limit' | 'tier_too_high' | 'insufficient_resources';
  consumed?: { [resourceType: string]: number };
  produced?: { [resourceType: string]: number };
}
```

**Behavior**:
1. Check rate limit: `now - lastClickTimestamps[cardId] >= CLICK_COOLDOWN_MS`
   - If violated → Return `{ success: false, reason: 'rate_limit' }`
   - Emit EVENTS.CLICK_RATE_LIMITED for visual feedback

2. Check card tier: `gameState.cards[cardId].tier === 0`
   - If tier > 0 → Return `{ success: false, reason: 'tier_too_high' }`

3. Get manual click yield: `CARD_CONFIGS[cardId].manualClickYield`

4. Check resource availability:
   - For each resource in `yield.consume`:
     - If `gameState.resources[resource] < amount` → Return `{ success: false, reason: 'insufficient_resources' }`

5. Process click:
   - Consume resources: `gameState.resources[resource] -= amount`
   - Produce resources: `gameState.addResource(resourceType, amount)` (triggers discovery)
   - Update timestamp: `lastClickTimestamps[cardId] = now`
   - Emit EVENTS.CARD_CLICKED { cardId, consumed, produced }

6. Return `{ success: true, consumed, produced }`

**Example Usage**:
```javascript
// Player clicks Extractor
const result = clickHandler.handleClick(CARDS.EXTRACTOR);

if (!result.success) {
  if (result.reason === 'rate_limit') {
    // Trigger shake animation
    cardElement.classList.add('shake');
  }
} else {
  // Update card counter: result.produced.ore = 1
}
```

**Events Emitted**:
- `EVENTS.CLICK_RATE_LIMITED` - { cardId } when rate limit violated
- `EVENTS.CARD_CLICKED` - { cardId, consumed, produced } on successful click
- `EVENTS.RESOURCE_CHANGED` - via gameState.addResource() (indirect)

**Error Handling**:
- Invalid cardId → No-op (returns { success: false })
- Card not on grid → Process normally (clicking from deck preview)
- Negative resource values → Prevented by validation

---

### Method: getRemainingCooldown

```javascript
getRemainingCooldown(cardId: string): number
```

**Purpose**: Get remaining cooldown time for a card (useful for UI feedback).

**Parameters**:
- `cardId: string` - Card identifier

**Returns**:
- `number` - Remaining cooldown in milliseconds (0 if ready to click)

**Example**:
```javascript
const cooldown = clickHandler.getRemainingCooldown(CARDS.EXTRACTOR);
if (cooldown > 0) {
  console.log(`Wait ${cooldown}ms before next click`);
}
```

---

## Events

### EVENTS.CLICK_RATE_LIMITED

**Payload**:
```typescript
{
  cardId: string;
  timestamp: number;
}
```

**Triggered**: When player clicks too fast (within 100ms of last click)

**Listeners**: UI layer for visual feedback (shake animation, flash effect)

---

### EVENTS.CARD_CLICKED

**Payload**:
```typescript
{
  cardId: string;
  consumed: { [resourceType: string]: number };
  produced: { [resourceType: string]: number };
  timestamp: number;
}
```

**Triggered**: On successful manual click after rate limit and validation

**Listeners**:
- DisplayUpdateManager (update card counters)
- Achievement system (future)
- Analytics (future)

---

## Integration with Existing Systems

### GameState

**Dependencies**:
- `gameState.cards[cardId].tier` - Read for tier check
- `gameState.resources` - Read for consumption validation, write for consume/produce
- `gameState.addResource()` - Call to add produced resources (triggers discovery)

**Events**:
- Listens: None
- Emits: EVENTS.CARD_CLICKED (via handleClick)

### CARD_CONFIGS

**Dependencies**:
- `CARD_CONFIGS[cardId].manualClickYield` - Read to determine click rewards

**Example Config**:
```javascript
[CARDS.EXTRACTOR]: {
  manualClickYield: {
    consume: {},
    produce: { [RESOURCES.ORE]: 1 }
  }
}
```

### DisplayUpdateManager

**Integration**:
- DisplayUpdateManager listens to EVENTS.CARD_CLICKED
- Updates card counter displays
- Shows visual feedback for rate limits (listens to EVENTS.CLICK_RATE_LIMITED)

---

## Testing Contract

### Unit Tests Required

1. **Rate Limiting**:
   - Click within cooldown → Returns { success: false, reason: 'rate_limit' }
   - Click after cooldown → Returns { success: true }
   - Multiple cards → Independent cooldowns

2. **Tier Restriction**:
   - Tier 0 card → Click processes
   - Tier 1+ card → Returns { success: false, reason: 'tier_too_high' }

3. **Resource Consumption**:
   - Sufficient resources → Consumed and produced correctly
   - Insufficient resources → Returns { success: false, reason: 'insufficient_resources' }
   - Zero-consume clicks (Extractor) → Always succeed if rate limit OK

4. **Event Emission**:
   - Successful click → EVENTS.CARD_CLICKED emitted with correct payload
   - Rate limited → EVENTS.CLICK_RATE_LIMITED emitted
   - Resource discovery → EVENTS.RESOURCE_DISCOVERED triggered (via gameState.addResource)

### Integration Tests Required

1. **Click → Resource Update → Display**:
   - Click Extractor → Ore increases → Resource counter updates

2. **Click → Discovery → Display**:
   - Click Sensor (with energy) → Data increases from 0 → Data counter becomes visible

3. **Rapid Clicking**:
   - Click 20 times rapidly → Only ~10 clicks succeed (rate limit enforced)
   - Verify visual feedback shows on rate-limited clicks

---

## Performance Considerations

- **O(1) rate limit check**: Single Map lookup and timestamp comparison
- **No timers**: Timestamp-based, no setInterval/setTimeout overhead
- **Minimal memory**: Only stores last click timestamp per card (~8 entries max)
- **Event-driven updates**: No polling, updates only on user action

---

## Future Extensions

- **Combo system**: Track consecutive clicks within time window
- **Critical clicks**: Random chance for bonus rewards
- **Click achievements**: "Click 1000 times" milestone
- **Audio feedback**: Play sound on successful click (add to EVENTS.CARD_CLICKED listener)
