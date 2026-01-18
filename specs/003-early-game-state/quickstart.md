# Developer Quickstart: Early Game & Initial State

**Phase 1 Output** | **Date**: 2026-01-04 | **Plan**: [plan.md](./plan.md)

## Overview

This guide helps developers implement and test the early game state feature for Cosmos and Chaos. Follow these steps to add manual clicking, card unlocks, resource discovery, and initial game state setup.

---

## Prerequisites

- Phase 2 (Resource Automation) complete and tested
- Phase 3 (Tier Upgrades) complete and tested
- Node.js and npm installed
- Vitest test environment configured

**Verify Prerequisites**:
```bash
npm test  # Should show 175 tests passing from Phase 2
```

---

## Implementation Order

Follow this order to minimize integration issues:

1. **Resource Discovery** (extends GameState)
2. **Click Handler** (new module)
3. **Unlock System** (new module)
4. **Initial State Setup** (modify main.js)
5. **UI Updates** (card visuals, error messages)
6. **Save/Load Migration** (version 1 → 2)

---

## Step 1: Resource Discovery System

### 1.1 Extend GameState (src/js/state.js)

Add discovery tracking to GameState constructor:

```javascript
// In GameState constructor
constructor() {
  // ... existing fields

  // NEW: Resource discovery tracking
  this.discoveredResources = new Set([RESOURCES.ORE]); // Ore visible at start
}
```

Add discovery methods:

```javascript
/**
 * Mark a resource as discovered (makes it visible in UI)
 * @param {string} resourceType - Resource to discover
 * @returns {boolean} True if newly discovered
 */
discoverResource(resourceType) {
  if (this.discoveredResources.has(resourceType)) {
    return false; // Already discovered
  }

  this.discoveredResources.add(resourceType);
  this.emit(EVENTS.RESOURCE_DISCOVERED, { resourceType });
  return true;
}

/**
 * Check if a resource has been discovered
 * @param {string} resourceType - Resource to check
 * @returns {boolean} True if discovered
 */
isResourceDiscovered(resourceType) {
  return this.discoveredResources.has(resourceType);
}
```

Modify addResource to trigger discovery:

```javascript
addResource(resourceType, amount) {
  const oldValue = this.resources[resourceType];
  this.resources[resourceType] += amount;

  // NEW: Trigger discovery on 0 → positive transition
  if (oldValue === 0 && this.resources[resourceType] > 0) {
    this.discoverResource(resourceType);
  }

  this.emit(EVENTS.RESOURCE_CHANGED, {
    resource: resourceType,
    value: this.resources[resourceType]
  });
}
```

### 1.2 Add Event Constant (src/js/constants.js)

```javascript
export const EVENTS = {
  // ... existing events
  RESOURCE_DISCOVERED: 'resource_discovered'
};
```

### 1.3 Update Display Manager (src/js/display.js)

Modify updateResourceDisplays to filter by discovery:

```javascript
updateResourceDisplays() {
  for (const resourceType of Object.values(RESOURCES)) {
    const element = document.querySelector(`[data-resource="${resourceType}"]`);
    if (!element) continue;

    const container = element.parentElement;

    // NEW: Hide undiscovered resources
    if (!this.gameState.isResourceDiscovered(resourceType)) {
      container.style.display = 'none';
      continue;
    }

    // Show discovered resources
    container.style.display = 'flex';

    // Update value (existing logic)
    const value = this.gameState.resources[resourceType];
    element.textContent = formatNumber(value);
  }
}
```

Add discovery event listener in constructor:

```javascript
constructor(gameState) {
  this.gameState = gameState;

  // ... existing listeners

  // NEW: Listen for resource discoveries
  this.gameState.on(EVENTS.RESOURCE_DISCOVERED, (event) => {
    this.handleResourceDiscovery(event);
  });
}

handleResourceDiscovery(event) {
  const element = document.querySelector(`[data-resource="${event.resourceType}"]`);
  if (!element) return;

  const container = element.parentElement;
  container.style.display = 'flex';
  container.classList.add('resource-discovered'); // Optional fade-in animation

  // Update to current value
  this.updateResourceDisplays();
}
```

### 1.4 Test Resource Discovery

Create `tests/discovery.test.js`:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../src/js/state.js';
import { RESOURCES, EVENTS } from '../src/js/constants.js';

describe('Resource Discovery', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('should start with only ore discovered', () => {
    expect(gameState.isResourceDiscovered(RESOURCES.ORE)).toBe(true);
    expect(gameState.isResourceDiscovered(RESOURCES.ENERGY)).toBe(false);
    expect(gameState.discoveredResources.size).toBe(1);
  });

  it('should discover resource on 0 to positive transition', () => {
    let discovered = null;
    gameState.on(EVENTS.RESOURCE_DISCOVERED, (event) => {
      discovered = event.resourceType;
    });

    gameState.addResource(RESOURCES.ENERGY, 5);

    expect(discovered).toBe(RESOURCES.ENERGY);
    expect(gameState.isResourceDiscovered(RESOURCES.ENERGY)).toBe(true);
  });

  it('should not rediscover already discovered resources', () => {
    gameState.addResource(RESOURCES.ENERGY, 5); // First discovery

    let eventCount = 0;
    gameState.on(EVENTS.RESOURCE_DISCOVERED, () => eventCount++);

    gameState.addResource(RESOURCES.ENERGY, 10); // Already > 0

    expect(eventCount).toBe(0); // No second discovery
  });
});
```

Run tests: `npm test discovery.test.js`

---

## Step 2: Click Handler

### 2.1 Create New Module (src/js/clickHandler.js)

```javascript
import { RESOURCES, CARDS, EVENTS } from './constants.js';
import { CARD_CONFIGS } from './cardConfigs.js';

/**
 * ClickHandler - Manages manual clicks on Tier 0 cards
 * Features:
 * - Rate limiting (10 clicks/second per card)
 * - Resource consumption/production
 * - Tier 0 restriction (automation replaces clicking at T1+)
 */
export class ClickHandler {
  constructor(gameState) {
    this.gameState = gameState;
    this.lastClickTimestamps = {}; // { cardId: timestamp }
    this.CLICK_COOLDOWN_MS = 100;  // 10 clicks/second
  }

  /**
   * Handle a manual click on a card
   * @param {string} cardId - Card identifier
   * @returns {object} { success, reason?, consumed?, produced? }
   */
  handleClick(cardId) {
    const now = Date.now();

    // Check rate limit
    const lastClick = this.lastClickTimestamps[cardId] || 0;
    if (now - lastClick < this.CLICK_COOLDOWN_MS) {
      this.gameState.emit(EVENTS.CLICK_RATE_LIMITED, { cardId, timestamp: now });
      return { success: false, reason: 'rate_limit' };
    }

    // Check card exists and is tier 0
    const card = this.gameState.cards[cardId];
    if (!card || card.tier !== 0) {
      return { success: false, reason: 'tier_too_high' };
    }

    // Get manual click yield
    const config = CARD_CONFIGS[cardId];
    const yield = config.manualClickYield;
    if (!yield) {
      return { success: false, reason: 'no_manual_yield' };
    }

    // Check resource availability for consumption
    for (const [resource, amount] of Object.entries(yield.consume)) {
      if (this.gameState.resources[resource] < amount) {
        return { success: false, reason: 'insufficient_resources' };
      }
    }

    // Consume resources
    const consumed = {};
    for (const [resource, amount] of Object.entries(yield.consume)) {
      this.gameState.resources[resource] -= amount;
      consumed[resource] = amount;
    }

    // Produce resources
    const produced = {};
    for (const [resource, amount] of Object.entries(yield.produce)) {
      this.gameState.addResource(resource, amount); // Triggers discovery
      produced[resource] = amount;
    }

    // Update timestamp
    this.lastClickTimestamps[cardId] = now;

    // Emit event
    this.gameState.emit(EVENTS.CARD_CLICKED, {
      cardId,
      consumed,
      produced,
      timestamp: now
    });

    return { success: true, consumed, produced };
  }

  /**
   * Get remaining cooldown time for a card
   * @param {string} cardId - Card identifier
   * @returns {number} Remaining cooldown in ms (0 if ready)
   */
  getRemainingCooldown(cardId) {
    const lastClick = this.lastClickTimestamps[cardId] || 0;
    const elapsed = Date.now() - lastClick;
    return Math.max(0, this.CLICK_COOLDOWN_MS - elapsed);
  }
}
```

### 2.2 Add Manual Click Yields (src/js/cardConfigs.js)

Add to each card configuration:

```javascript
[CARDS.EXTRACTOR]: {
  // ... existing config
  manualClickYield: {
    consume: {},
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
// Add for other cards as needed
```

### 2.3 Add Event Constants (src/js/constants.js)

```javascript
export const EVENTS = {
  // ... existing events
  CLICK_RATE_LIMITED: 'click_rate_limited',
  CARD_CLICKED: 'card_clicked'
};
```

### 2.4 Test Click Handler

Create `tests/clickHandler.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClickHandler } from '../src/js/clickHandler.js';
import { GameState } from '../src/js/state.js';
import { CARDS, RESOURCES, EVENTS } from '../src/js/constants.js';

describe('ClickHandler', () => {
  let gameState, clickHandler;

  beforeEach(() => {
    gameState = new GameState();
    clickHandler = new ClickHandler(gameState);

    // Mock Date.now for rate limit tests
    vi.useFakeTimers();
  });

  it('should process valid click on tier 0 card', () => {
    const result = clickHandler.handleClick(CARDS.EXTRACTOR);

    expect(result.success).toBe(true);
    expect(result.produced[RESOURCES.ORE]).toBe(1);
    expect(gameState.resources[RESOURCES.ORE]).toBe(1);
  });

  it('should enforce rate limit (10 clicks/sec)', () => {
    // First click succeeds
    const result1 = clickHandler.handleClick(CARDS.EXTRACTOR);
    expect(result1.success).toBe(true);

    // Second click within 100ms fails
    vi.advanceTimersByTime(50);
    const result2 = clickHandler.handleClick(CARDS.EXTRACTOR);
    expect(result2.success).toBe(false);
    expect(result2.reason).toBe('rate_limit');

    // Third click after 100ms succeeds
    vi.advanceTimersByTime(60);
    const result3 = clickHandler.handleClick(CARDS.EXTRACTOR);
    expect(result3.success).toBe(true);
  });

  it('should reject clicks on tier 1+ cards', () => {
    gameState.cards[CARDS.EXTRACTOR].tier = 1;

    const result = clickHandler.handleClick(CARDS.EXTRACTOR);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('tier_too_high');
  });

  it('should check resource requirements', () => {
    // Sensor requires 5 energy
    gameState.resources[RESOURCES.ENERGY] = 3; // Not enough

    const result = clickHandler.handleClick(CARDS.SENSOR);

    expect(result.success).toBe(false);
    expect(result.reason).toBe('insufficient_resources');
  });
});
```

Run tests: `npm test clickHandler.test.js`

---

## Step 3: Unlock System

### 3.1 Create Unlock Manager (src/js/unlock.js)

```javascript
import { CARDS, RESOURCES, EVENTS } from './constants.js';

/**
 * UnlockManager - Manages card unlock progression
 * Features:
 * - Sequential unlocks (upgrade-based chain)
 * - Milestone unlocks (resource threshold-based)
 * - Independent unlock paths (can unlock out of order)
 */
export class UnlockManager {
  constructor(gameState) {
    this.gameState = gameState;

    // Unlock rules configuration
    this.unlockRules = {
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

    this.setupListeners();
  }

  setupListeners() {
    // Listen for tier upgrades
    this.gameState.on(EVENTS.CARD_UPGRADED, (event) => {
      this.checkSequentialUnlocks(event.cardId, event.tier);
    });

    // Listen for resource changes
    this.gameState.on(EVENTS.RESOURCE_CHANGED, (event) => {
      this.checkMilestoneUnlocks(event.resource, event.value);
    });
  }

  checkSequentialUnlocks(cardId, tier) {
    const unlocked = [];

    for (const rule of this.unlockRules.sequential) {
      if (rule.trigger.cardId === cardId && rule.trigger.tier === tier) {
        if (!this.gameState.cards[rule.card].unlocked) {
          this.gameState.cards[rule.card].unlocked = true;
          this.gameState.emit(EVENTS.CARD_UNLOCKED, {
            cardId: rule.card,
            unlockType: 'sequential',
            trigger: rule.trigger
          });
          unlocked.push(rule.card);
        }
      }
    }

    return unlocked;
  }

  checkMilestoneUnlocks(resourceType, value) {
    const unlocked = [];

    for (const rule of this.unlockRules.milestones) {
      if (rule.trigger.resource === resourceType && value >= rule.trigger.threshold) {
        if (!this.gameState.cards[rule.card].unlocked) {
          this.gameState.cards[rule.card].unlocked = true;
          this.gameState.emit(EVENTS.CARD_UNLOCKED, {
            cardId: rule.card,
            unlockType: 'milestone',
            trigger: rule.trigger
          });
          unlocked.push(rule.card);
        }
      }
    }

    return unlocked;
  }

  getUnlockProgress(cardId) {
    // Find rule for this card
    let rule = this.unlockRules.sequential.find(r => r.card === cardId);
    if (!rule) {
      rule = this.unlockRules.milestones.find(r => r.card === cardId);
    }
    if (!rule) return null;

    const unlocked = this.gameState.cards[cardId].unlocked;

    if (rule.trigger.type === 'tier_upgrade') {
      const triggerCard = this.gameState.cards[rule.trigger.cardId];
      return {
        card: cardId,
        unlocked,
        rule,
        progress: {
          current: triggerCard.tier,
          required: rule.trigger.tier,
          percentage: (triggerCard.tier / rule.trigger.tier) * 100
        }
      };
    } else {
      const current = this.gameState.resources[rule.trigger.resource];
      return {
        card: cardId,
        unlocked,
        rule,
        progress: {
          current,
          required: rule.trigger.threshold,
          percentage: Math.min(100, (current / rule.trigger.threshold) * 100)
        }
      };
    }
  }
}
```

### 3.2 Add Unlocked Field to Card State (src/js/state.js)

Modify card initialization in GameState constructor:

```javascript
this.cards = {
  [CARDS.EXTRACTOR]: {
    id: CARDS.EXTRACTOR,
    placed: false,
    row: null,
    col: null,
    production: 0,
    automated: false,
    rate: 0,
    tier: 0,
    ioIndicators: [],
    unlocked: true  // NEW: Extractor starts unlocked
  },
  [CARDS.SENSOR]: {
    // ... existing fields
    unlocked: false  // NEW: All others start locked
  },
  // ... other cards with unlocked: false
};
```

### 3.3 Add Event Constant (src/js/constants.js)

```javascript
export const EVENTS = {
  // ... existing events
  CARD_UNLOCKED: 'card_unlocked'
};
```

### 3.4 Test Unlock System

Create `tests/unlock.test.js`:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { UnlockManager } from '../src/js/unlock.js';
import { GameState } from '../src/js/state.js';
import { CARDS, RESOURCES, EVENTS } from '../src/js/constants.js';

describe('UnlockManager', () => {
  let gameState, unlockManager;

  beforeEach(() => {
    gameState = new GameState();
    unlockManager = new UnlockManager(gameState);
  });

  it('should unlock Processor when Extractor upgraded to T1', () => {
    let unlocked = null;
    gameState.on(EVENTS.CARD_UNLOCKED, (event) => {
      unlocked = event.cardId;
    });

    // Simulate tier upgrade
    gameState.emit(EVENTS.CARD_UPGRADED, {
      cardId: CARDS.EXTRACTOR,
      tier: 1
    });

    expect(unlocked).toBe(CARDS.PROCESSOR);
    expect(gameState.cards[CARDS.PROCESSOR].unlocked).toBe(true);
  });

  it('should unlock milestone cards independently', () => {
    // Lab unlocks at 50 data
    gameState.addResource(RESOURCES.DATA, 50);
    expect(gameState.cards[CARDS.LAB].unlocked).toBe(true);

    // Storage unlocks at 200 ore (out of order)
    gameState.addResource(RESOURCES.ORE, 200);
    expect(gameState.cards[CARDS.STORAGE].unlocked).toBe(true);

    // Habitat still locked (need 100 energy)
    expect(gameState.cards[CARDS.HABITAT].unlocked).toBe(false);
  });
});
```

Run tests: `npm test unlock.test.js`

---

## Step 4: Initial State Setup

### 4.1 Modify Main Entry Point (src/js/main.js)

Add initial state setup:

```javascript
import { GameState } from './state.js';
import { Grid } from './grid.js';
import { ClickHandler } from './clickHandler.js';
import { UnlockManager } from './unlock.js';
import { CARDS, RESOURCES } from './constants.js';

function initializeNewGame() {
  const gameState = new GameState();

  // Pre-place Extractor at position (2,2)
  const grid = new Grid(gameState);
  grid.placeCard(CARDS.EXTRACTOR, 2, 2);

  // Set Extractor state (already unlocked by default)
  gameState.cards[CARDS.EXTRACTOR].placed = true;
  gameState.cards[CARDS.EXTRACTOR].row = 2;
  gameState.cards[CARDS.EXTRACTOR].col = 2;
  gameState.cards[CARDS.EXTRACTOR].tier = 0;
  gameState.cards[CARDS.EXTRACTOR].automated = false;

  // Initialize managers
  const clickHandler = new ClickHandler(gameState);
  const unlockManager = new UnlockManager(gameState);

  return { gameState, grid, clickHandler, unlockManager };
}

// Use on first load or new game
const game = initializeNewGame();
```

### 4.2 Test Initial State

Create `tests/initialState.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { GameState } from '../src/js/state.js';
import { CARDS, RESOURCES } from '../src/js/constants.js';

describe('Initial Game State', () => {
  it('should have Extractor unlocked and placed at (2,2)', () => {
    const gameState = new GameState();

    // Simulate initial setup
    gameState.cards[CARDS.EXTRACTOR].placed = true;
    gameState.cards[CARDS.EXTRACTOR].row = 2;
    gameState.cards[CARDS.EXTRACTOR].col = 2;

    expect(gameState.cards[CARDS.EXTRACTOR].unlocked).toBe(true);
    expect(gameState.cards[CARDS.EXTRACTOR].placed).toBe(true);
    expect(gameState.cards[CARDS.EXTRACTOR].row).toBe(2);
    expect(gameState.cards[CARDS.EXTRACTOR].col).toBe(2);
    expect(gameState.cards[CARDS.EXTRACTOR].tier).toBe(0);
  });

  it('should have all other cards locked', () => {
    const gameState = new GameState();

    expect(gameState.cards[CARDS.SENSOR].unlocked).toBe(false);
    expect(gameState.cards[CARDS.PROCESSOR].unlocked).toBe(false);
    expect(gameState.cards[CARDS.REACTOR].unlocked).toBe(false);
    // ... test all cards
  });

  it('should only discover ore initially', () => {
    const gameState = new GameState();

    expect(gameState.isResourceDiscovered(RESOURCES.ORE)).toBe(true);
    expect(gameState.isResourceDiscovered(RESOURCES.ENERGY)).toBe(false);
    expect(gameState.discoveredResources.size).toBe(1);
  });
});
```

---

## Step 5: UI Updates

### 5.1 Add Locked Card Visuals (src/css/cards.css)

```css
/* Locked card styling */
.card.locked {
  opacity: 0.5;
  filter: grayscale(100%);
  pointer-events: none;
  cursor: not-allowed;
}

.card.locked::after {
  content: '🔒';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
}

/* Rate limit visual feedback */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.card.rate-limited {
  animation: shake 0.3s ease-in-out;
}

/* Resource discovery animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.resource-item.resource-discovered {
  animation: fade-in 0.5s ease-out;
}
```

### 5.2 Add Click Event Listeners

In card rendering code (src/js/cards.js or main.js):

```javascript
function attachClickHandlers(clickHandler) {
  document.querySelectorAll('.card').forEach(cardElement => {
    cardElement.addEventListener('click', (event) => {
      const cardId = event.currentTarget.dataset.cardId;
      const result = clickHandler.handleClick(cardId);

      if (!result.success && result.reason === 'rate_limit') {
        cardElement.classList.add('rate-limited');
        setTimeout(() => {
          cardElement.classList.remove('rate-limited');
        }, 300);
      }
    });
  });
}
```

### 5.3 Grid Full Error Message

Add error toast system:

```javascript
function showError(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// In grid placement logic
if (placedCardCount >= gridCapacity) {
  showError("Grid is full. Remove a card first to place this one.");
  return;
}
```

CSS for error toast:

```css
.error-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4444;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-family: monospace;
  z-index: 1000;
  animation: fade-in 0.3s ease-out;
}
```

---

## Step 6: Save/Load Migration

### 6.1 Update SaveManager (src/js/save.js)

Add schema version and migration:

```javascript
save() {
  const data = {
    version: 2,  // NEW: Increment from 1 to 2
    resources: this.gameState.resources,
    cards: this.gameState.cards,
    discoveredResources: Array.from(this.gameState.discoveredResources), // Set → Array
    // ... other state
  };

  localStorage.setItem('cosmosandchaos_save', JSON.stringify(data));
}

load() {
  const savedData = localStorage.getItem('cosmosandchaos_save');
  if (!savedData) return null;

  let data = JSON.parse(savedData);

  // Migrate version 1 → 2
  if (data.version === 1) {
    data = this.migrateV1toV2(data);
  }

  // Validate and recover if corrupted
  data = this.validateAndRecover(data);

  // Deserialize Set
  data.discoveredResources = new Set(data.discoveredResources);

  return data;
}

migrateV1toV2(data) {
  // Add unlocked field to all cards
  for (const cardId of Object.keys(data.cards)) {
    data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
  }

  // Add discoveredResources (auto-discover any resource with value > 0)
  data.discoveredResources = [RESOURCES.ORE];
  for (const [resourceType, value] of Object.entries(data.resources)) {
    if (value > 0) {
      data.discoveredResources.push(resourceType);
    }
  }

  data.version = 2;
  return data;
}

validateAndRecover(data) {
  // Check for impossible states
  if (!data.cards[CARDS.EXTRACTOR].unlocked) {
    console.warn('Corrupted unlock data: Extractor not unlocked. Resetting unlock state.');
    this.resetUnlockState(data);
  }

  for (const card of Object.values(data.cards)) {
    if (card.placed && !card.unlocked) {
      console.warn('Corrupted unlock data: Placed card not unlocked. Resetting unlock state.');
      this.resetUnlockState(data);
      break;
    }
  }

  return data;
}

resetUnlockState(data) {
  // Reset only unlock state, preserve everything else
  for (const cardId of Object.keys(data.cards)) {
    data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
  }
  // Resources, grid state, tiers all preserved
}
```

---

## Testing Strategy

### Unit Test Coverage

Run all tests to ensure coverage:

```bash
npm test                    # Run all tests
npm run coverage            # Generate coverage report
```

**Expected Coverage**:
- discovery.test.js: Resource discovery logic
- clickHandler.test.js: Rate limiting, manual clicks
- unlock.test.js: Sequential and milestone unlocks
- initialState.test.js: New game setup
- state.test.js: Extended for unlocked field

### Integration Testing

Manually test the full flow:

1. **New Game**:
   ```
   - Start game → Verify Extractor at (2,2)
   - Check only ORE visible in resource panel
   - Click Extractor → Ore increases by 1
   ```

2. **First Unlock**:
   ```
   - Click 50 times → Reach 50 ore
   - Upgrade Extractor to T1
   - Verify Processor unlocks
   - Verify automation starts
   ```

3. **Resource Discovery**:
   ```
   - Produce energy → Energy counter appears
   - Produce data → Data counter appears
   ```

4. **Milestone Unlock**:
   ```
   - Accumulate 50 data → Lab unlocks
   - Verify Lab can be placed on grid
   ```

5. **Save/Load**:
   ```
   - Save game with unlocked cards
   - Reload page
   - Verify unlock state persists
   ```

---

## Common Issues & Solutions

### Issue: Resource counters not hiding

**Solution**: Check DisplayUpdateManager is listening to RESOURCE_DISCOVERED event and calling updateResourceDisplays() on discovery.

### Issue: Rate limit not working

**Solution**: Verify Date.now() is being used (not Date.getTime()) and CLICK_COOLDOWN_MS is 100.

### Issue: Unlocks not triggering

**Solution**: Check UnlockManager is initialized and setupListeners() is called. Verify EVENTS.CARD_UPGRADED is emitted when tier changes.

### Issue: Save migration fails

**Solution**: Ensure version check happens before deserializing discoveredResources Set. Check migration adds unlocked field to all cards.

---

## Performance Checklist

- [ ] Click response < 100ms (rate limit check is O(1))
- [ ] Discovery check < 1ms (Set.has is O(1))
- [ ] Unlock check < 5ms (iterates max 7 rules)
- [ ] Save/load < 100ms (small data size)
- [ ] 60 FPS maintained with 25+ cards (no change from Phase 2)

---

## Next Steps

After implementation:

1. Run full test suite: `npm test`
2. Verify coverage: `npm run coverage` (should be >70%)
3. Manual testing per quickstart integration tests above
4. Move to Phase 2: `npm run dev` and test in browser
5. Create tasks.md: Run `/speckit.tasks` command

---

## Reference Documentation

- [Feature Spec](./spec.md) - Requirements and acceptance criteria
- [Implementation Plan](./plan.md) - Architecture and approach
- [Data Model](./data-model.md) - Entity schemas and relationships
- [Contracts](./contracts/) - API contracts for each module
  - [ClickHandler](./contracts/click-handler.md)
  - [UnlockManager](./contracts/unlock-system.md)
  - [Discovery System](./contracts/discovery-system.md)

---

**Questions?** Refer to the contracts for detailed API signatures or the spec for requirements clarification.
