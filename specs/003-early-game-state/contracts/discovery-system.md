# API Contract: Resource Discovery System

**Module**: Extensions to `src/js/state.js` (GameState) and `src/js/display.js` (DisplayUpdateManager)
**Purpose**: Progressive resource UI visibility based on first-time production

---

## GameState Extensions

### Property: discoveredResources

```javascript
discoveredResources: Set<string>
```

**Type**: Set of resource type strings (RESOURCES.ORE, RESOURCES.METAL, etc.)

**Initial State**: `new Set([RESOURCES.ORE])` (only ore visible at game start)

**Persistence**: Serialized to Array for LocalStorage, deserialized back to Set on load

**Example**:
```javascript
// New game
gameState.discoveredResources = new Set(['ore']);

// After producing energy and data
gameState.discoveredResources = new Set(['ore', 'energy', 'data']);
```

---

### Method: discoverResource

```javascript
discoverResource(resourceType: string): boolean
```

**Purpose**: Mark a resource as discovered (makes it visible in UI).

**Parameters**:
- `resourceType: string` - Resource to discover (RESOURCES.ENERGY, etc.)

**Returns**:
- `boolean` - `true` if newly discovered, `false` if already discovered

**Behavior**:
1. Check if `discoveredResources.has(resourceType)` → Return false (already discovered)
2. Add to set: `discoveredResources.add(resourceType)`
3. Emit `EVENTS.RESOURCE_DISCOVERED` { resourceType }
4. Return true

**Example**:
```javascript
const wasNew = gameState.discoverResource(RESOURCES.ENERGY);
// wasNew = true (first time)
// Emits: EVENTS.RESOURCE_DISCOVERED { resourceType: 'energy' }

const wasNew2 = gameState.discoverResource(RESOURCES.ENERGY);
// wasNew2 = false (already discovered)
// No event emitted
```

**Events Emitted**:
- `EVENTS.RESOURCE_DISCOVERED` - { resourceType } on first discovery only

---

### Method: addResource (Modified)

```javascript
addResource(resourceType: string, amount: number): void
```

**Purpose**: Add resources to game state, triggering discovery on 0→>0 transitions.

**Parameters**:
- `resourceType: string` - Resource type to add
- `amount: number` - Amount to add (positive or negative)

**Behavior** (MODIFIED from Phase 2):
1. Store old value: `const oldValue = this.resources[resourceType]`
2. Add amount: `this.resources[resourceType] += amount`
3. **NEW**: Check discovery condition:
   - If `oldValue === 0 && this.resources[resourceType] > 0`:
     - Call `this.discoverResource(resourceType)`
4. Emit `EVENTS.RESOURCE_CHANGED` { resource: resourceType, value: this.resources[resourceType] }

**Example**:
```javascript
// Initial state: energy = 0, not discovered
gameState.addResource(RESOURCES.ENERGY, 5);
// Triggers: discoverResource(ENERGY)
// Emits: RESOURCE_DISCOVERED { resourceType: 'energy' }
// Emits: RESOURCE_CHANGED { resource: 'energy', value: 5 }

// Later: energy = 5, already discovered
gameState.addResource(RESOURCES.ENERGY, 10);
// No discovery (already >0)
// Emits: RESOURCE_CHANGED { resource: 'energy', value: 15 }
```

**Important**: Discovery only triggers on **0 → positive** transitions (spec FR-009).

---

### Method: isResourceDiscovered

```javascript
isResourceDiscovered(resourceType: string): boolean
```

**Purpose**: Check if a resource has been discovered (useful for UI queries).

**Parameters**:
- `resourceType: string` - Resource type to check

**Returns**:
- `boolean` - `true` if discovered, `false` otherwise

**Example**:
```javascript
if (gameState.isResourceDiscovered(RESOURCES.DATA)) {
  // Show data-related UI elements
}
```

---

## DisplayUpdateManager Extensions

### Method: updateResourceDisplays (Modified)

```javascript
updateResourceDisplays(): void
```

**Purpose**: Update all resource counter displays, hiding undiscovered resources.

**Behavior** (MODIFIED from Phase 2):
1. For each resource in `RESOURCES`:
   - Get DOM element: `document.querySelector([data-resource="${resourceType}"])`
   - **NEW**: Check discovery state:
     - If `!gameState.isResourceDiscovered(resourceType)`:
       - Set `element.parentElement.style.display = 'none'` (hide counter)
       - Continue to next resource
     - Else:
       - Set `element.parentElement.style.display = 'flex'` (show counter)
   - Update counter value (existing logic)

**Example HTML Structure**:
```html
<!-- Discovered resource (ore) -->
<div class="resource-item" style="display: flex;">
  <span class="resource-label">ORE</span>
  <span class="resource-value" data-resource="ore">150</span>
</div>

<!-- Undiscovered resource (data) -->
<div class="resource-item" style="display: none;">
  <span class="resource-label">DATA</span>
  <span class="resource-value" data-resource="data">0</span>
</div>
```

**Events Listened**:
- `EVENTS.RESOURCE_DISCOVERED` - Re-render resource displays to show newly discovered resource

---

### Method: handleResourceDiscovery

```javascript
handleResourceDiscovery(event: { resourceType: string }): void
```

**Purpose**: Handle resource discovery events to update UI visibility.

**Parameters**:
- `event: { resourceType: string }` - Event payload from EVENTS.RESOURCE_DISCOVERED

**Behavior**:
1. Get resource element: `document.querySelector([data-resource="${event.resourceType}"])`
2. Show parent container: `element.parentElement.style.display = 'flex'`
3. Optionally: Add animation class for "reveal" effect
4. Update counter value to current resource amount

**Example**:
```javascript
// Listen to discovery event
gameState.on(EVENTS.RESOURCE_DISCOVERED, (event) => {
  displayManager.handleResourceDiscovery(event);
});

// When energy discovered:
// - Element changes from display:none to display:flex
// - Counter shows current value (e.g., "5")
```

**Animation** (Optional Enhancement):
```javascript
handleResourceDiscovery(event) {
  const element = document.querySelector(`[data-resource="${event.resourceType}"]`);
  const container = element.parentElement;

  container.style.display = 'flex';
  container.classList.add('resource-discovered'); // Fade-in animation
}
```

---

## Events

### EVENTS.RESOURCE_DISCOVERED

**Payload**:
```typescript
{
  resourceType: string;
  timestamp: number;
}
```

**Triggered**: When a resource value transitions from 0 to >0 for the first time

**Listeners**:
- DisplayUpdateManager (show resource counter)
- Ship log feed (future: "New resource discovered: Energy")
- Achievement system (future: "Discover all 7 resources")

---

## SaveManager Integration

### Serialization

**Challenge**: Set objects don't serialize to JSON directly

**Solution**:
```javascript
// In SaveManager.save()
save() {
  const data = {
    ...gameState,
    discoveredResources: Array.from(gameState.discoveredResources) // Set → Array
  };
  localStorage.setItem('gameState', JSON.stringify(data));
}

// In SaveManager.load()
load() {
  const data = JSON.parse(localStorage.getItem('gameState'));
  data.discoveredResources = new Set(data.discoveredResources); // Array → Set
  return data;
}
```

**Migration** (Version 1 → 2):
```javascript
if (data.version === 1) {
  // Add discoveredResources for old saves
  data.discoveredResources = ['ore']; // Default to ore only

  // Discover resources that already have values > 0
  for (const [resourceType, value] of Object.entries(data.resources)) {
    if (value > 0) {
      data.discoveredResources.push(resourceType);
    }
  }

  data.version = 2;
}
```

---

## Testing Contract

### Unit Tests Required

1. **Discovery Logic**:
   - Resource 0 → 5 → RESOURCE_DISCOVERED event emitted
   - Resource 0 → -5 → No discovery (must be positive)
   - Resource 5 → 10 → No discovery (already >0)
   - Resource 5 → 0 → 3 → No discovery (already discovered once)

2. **Idempotency**:
   - discoverResource() called twice → Only one event
   - discoveredResources set doesn't duplicate values

3. **Initial State**:
   - New game → Only ore discovered
   - discoveredResources = Set(['ore'])

4. **Persistence**:
   - Save game → discoveredResources serialized correctly
   - Load game → discoveredResources deserialized correctly
   - Set → Array → Set roundtrip preserves values

### Integration Tests Required

1. **UI Visibility**:
   - New game → Only ore counter visible
   - Produce energy → Energy counter becomes visible
   - Save/load → Discovered resources remain visible

2. **Discovery Flow**:
   - Manual click produces data (0 → 2) → Data counter appears
   - Automated production reaches new resource → Counter appears

3. **Migration**:
   - Load version 1 save with energy=100 → Energy already discovered on load

---

## Performance Considerations

- **O(1) discovery check**: Set.has() is constant time
- **O(n) display update**: Iterates all resources (7 total), negligible
- **Event-driven visibility**: Only updates on RESOURCE_DISCOVERED, not every frame
- **Minimal memory**: Set stores ~7 strings max (~100 bytes)

---

## Edge Cases

1. **Negative Resource Values**:
   - Resources consumed to 0 or negative → No discovery
   - Discovery only on 0 → positive (not 0 → any change)

2. **Simultaneous Discoveries**:
   - Multiple resources produced in same tick → Multiple RESOURCE_DISCOVERED events
   - Each handled independently

3. **Pre-discovered Resources**:
   - Ore starts discovered (can't be hidden)
   - Attempting to hide ore → No effect (always in discoveredResources)

4. **Save Corruption**:
   - Missing discoveredResources field → Default to ['ore']
   - Invalid values in set → Filter to valid RESOURCES constants

---

## UI/UX Considerations

### Display Order

**Spec Requirement** (SC-004): "All discovered resources are visible in a logical order"

**Recommended Order** (matches existing HTML):
1. ORE (always first, pre-discovered)
2. METAL
3. ENERGY
4. DATA
5. PROTOCOLS
6. XENO_BLOOM
7. FLUX_SHARD

**Implementation**: CSS `order` property or DOM element ordering in HTML

### Visual Feedback

**Options for Discovery Animation**:
1. **Fade-in**: Opacity 0 → 1 over 500ms
2. **Slide-in**: Transform translateY(-20px) → 0 with fade
3. **Glow effect**: Brief highlight around new counter
4. **Ship log message**: "New resource discovered: ENERGY"

**Recommended**: Fade-in (simple, clean, matches existing UI aesthetic)

---

## Future Extensions

- **Resource hints**: Show locked resources in grayed-out state with "???" value
- **Discovery bonuses**: First discovery of rare resource grants small bonus
- **Discovery achievements**: "Discover all resources in 10 minutes"
- **Discovery notifications**: Toast message "New resource: Energy +5"
