# Feature Specification: Early Game & Initial State

**Feature Branch**: `003-early-game-state`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Phase 4: Early Game & Initial State - Set up the initial game state with Extractor T0 pre-placed on the grid at position (2,2). Implement card unlock system where 7 cards (Sensor, Storage, Processor, Reactor, Engine, Habitat, Lab) start locked. Add unlocked boolean to card state. Create unlock progression: unlock cards based on resource milestones or manual unlocks. Update UI to show locked vs unlocked cards in deck/selection area. Ensure manual clicking works on Tier 0 cards (before automation). Fix initial resource display to only show discovered resources. Early game flow: start with Extractor T0 → mine ore manually → save 50 ore → upgrade to T1 → automation activates → unlock next card."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start With One Card (Priority: P1)

As a new player, I want to start the game with a single mining card already on the grid so that I can immediately begin playing without setup complexity.

**Why this priority**: This is the foundational entry point. Without a card on the grid, there's no game to play. This establishes the core idle game loop.

**Independent Test**: Can be fully tested by starting a new game and verifying the Extractor card is placed at position (2,2) and is clickable.

**Acceptance Scenarios**:

1. **Given** a new game is started, **When** the game loads, **Then** the Extractor T0 card appears on the grid at position (2,2)
2. **Given** the Extractor T0 is on the grid, **When** viewing the grid, **Then** no other cards are placed initially
3. **Given** the Extractor T0 is on the grid, **When** viewing the card, **Then** it displays "T0" tier and is in manual mode (not automated)

---

### User Story 2 - Mine Resources Manually (Priority: P1)

As a new player, I want to click my mining card to gather ore so that I can experience the core mechanic and accumulate resources for my first upgrade.

**Why this priority**: Manual clicking is the only way to progress in the early game before automation unlocks. Without this, the game is unplayable.

**Independent Test**: Can be fully tested by clicking the Extractor card and verifying ore increases in the resource panel. Delivers the fundamental clicker mechanic.

**Acceptance Scenarios**:

1. **Given** the Extractor T0 card is on the grid, **When** the player clicks the card, **Then** ore is added to the resource count
2. **Given** ore has been mined, **When** viewing the resource panel, **Then** the ore counter displays the current amount
3. **Given** the card is clicked multiple times, **When** observing resources, **Then** ore accumulates with each click
4. **Given** the card is Tier 0, **When** time passes without clicking, **Then** no automatic resource generation occurs

---

### User Story 3 - Progress to First Automation (Priority: P2)

As a player who has gathered 50 ore, I want to upgrade my Extractor to Tier 1 so that it begins producing automatically and I unlock the next card.

**Why this priority**: This is the critical transition from manual clicking to idle gameplay. It's the first major milestone and teaches the upgrade system.

**Independent Test**: Can be tested by accumulating 50 ore, upgrading to T1, and verifying automation starts and the next card unlocks.

**Acceptance Scenarios**:

1. **Given** the player has 50 ore, **When** the Extractor is upgraded to T1, **Then** ore is deducted and the card shows "T1" tier
2. **Given** the Extractor is T1, **When** time passes, **Then** ore accumulates automatically without clicking
3. **Given** the Extractor is upgraded to T1, **When** the upgrade completes, **Then** one additional card becomes unlocked in the deck
4. **Given** automation is active, **When** the player clicks the card, **Then** clicking still works but is no longer necessary

---

### User Story 4 - Unlock Cards Progressively (Priority: P2)

As a player who is making progress, I want to unlock new cards at specific milestones so that I can expand my production capabilities and experience new mechanics.

**Why this priority**: Progressive unlocking creates a sense of achievement and pacing. It prevents overwhelming new players while providing clear goals.

**Independent Test**: Can be tested by reaching unlock milestones and verifying new cards appear in the deck/selection area as "unlocked."

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** viewing the card selection, **Then** 7 cards (Sensor, Storage, Processor, Reactor, Engine, Habitat, Lab) appear as locked
2. **Given** the player reaches an unlock milestone, **When** the condition is met, **Then** the next locked card changes to unlocked status
3. **Given** a card is unlocked, **When** viewing the card selection, **Then** the card can be placed on the grid
4. **Given** a card is still locked, **When** attempting to interact with it, **Then** it shows as unavailable with visual indication

---

### User Story 5 - See Only Discovered Resources (Priority: P3)

As a new player, I want to see only the resources I've actually encountered so that the interface isn't overwhelming with information about resources I haven't unlocked yet.

**Why this priority**: Reduces cognitive load for new players. Important for clean UI but not critical for core gameplay.

**Independent Test**: Can be tested by checking the resource panel on a new game and verifying only ore is visible initially.

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** viewing the resource panel, **Then** only ore is displayed
2. **Given** the player has not yet produced a resource type, **When** viewing the resource panel, **Then** that resource remains hidden
3. **Given** a new resource type is produced for the first time, **When** it's generated, **Then** it appears in the resource panel
4. **Given** multiple resources have been discovered, **When** viewing the resource panel, **Then** all discovered resources are visible in a logical order

---

### Edge Cases

- What happens when the player upgrades to T1 with exactly 50 ore (minimum required)?
- How does the system handle clicking Tier 0 cards extremely rapidly (e.g., autoclicker)?
- What happens if the player tries to place an unlocked card but the grid is full?
- How does the unlock system behave if milestones are reached out of expected order?
- What happens when the player loads a saved game - does it remember which cards were unlocked?
- How does the system handle the case where card unlock data becomes corrupted or inconsistent?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize new games with the Extractor card at Tier 0, placed at grid position (2,2), in manual mode
- **FR-002**: System MUST allow players to click Tier 0 cards to manually generate resources
- **FR-003**: System MUST track an "unlocked" boolean state for each card (Extractor starts unlocked, others start locked)
- **FR-004**: System MUST prevent players from placing locked cards on the grid
- **FR-005**: System MUST unlock one additional card when the player upgrades the Extractor from T0 to T1
- **FR-006**: System MUST display locked cards with visual indication (grayed out, lock icon, or similar) in the card selection area
- **FR-007**: System MUST display unlocked cards as available/selectable in the card selection area
- **FR-008**: System MUST hide resource types from the resource panel until they are produced for the first time
- **FR-009**: System MUST reveal a resource type in the resource panel when its value becomes greater than 0
- **FR-010**: System MUST persist card unlock states when saving and loading the game
- **FR-011**: System MUST unlock cards using hybrid progression: First 3 cards (Processor, Reactor, Sensor) unlock sequentially when the previous card is upgraded to T1. Remaining 4 cards (Lab, Habitat, Engine, Storage) unlock based on resource milestones
- **FR-012**: System MUST award 1 ore per click on Tier 0 Extractor (requires 50 clicks to reach first upgrade)

### Key Entities

- **Card State**: Represents the runtime state of a card, including: `id`, `placed`, `row`, `col`, `production`, `automated`, `rate`, `tier`, `unlocked` (new boolean field)
- **Unlock Milestone**: Represents a condition that triggers unlocking a card (e.g., "Upgrade Extractor to T1", "Accumulate 100 metal")
- **Resource Discovery**: Tracks which resource types have been produced at least once, controlling visibility in the UI

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New players can start clicking the Extractor card within 3 seconds of the game loading (immediate engagement)
- **SC-002**: Players can complete the journey from first click to first automation (T0 → T1 upgrade) in 2-5 minutes of active play
- **SC-003**: The resource panel shows only ore initially, with 100% of test players reporting clear understanding of what resources they have
- **SC-004**: Players can identify which cards are locked vs unlocked within 5 seconds of viewing the card selection interface
- **SC-005**: 90% of new players successfully unlock their second card within 10 minutes of starting the game
- **SC-006**: Manual clicking on Tier 0 cards provides responsive feedback (resource update visible within 100ms)
- **SC-007**: Save/load preserves card unlock states with 100% accuracy (no cards locked/unlocked incorrectly)

## Assumptions *(optional)*

- The grid position (2,2) refers to the 3rd row, 3rd column (0-indexed), placing the Extractor near the center of the visible 5x4 viewport
- Manual clicking on Tier 0 cards has no cooldown or rate limit (player can click as fast as they want)
- Card unlock progression follows this sequence:
  1. Extractor (unlocked at start)
  2. Processor (unlocked when Extractor upgraded to T1)
  3. Reactor (unlocked when Processor upgraded to T1)
  4. Sensor (unlocked when Reactor upgraded to T1)
  5. Lab (unlocked at 50 data - resource milestone)
  6. Habitat (unlocked at 100 energy - resource milestone)
  7. Engine (unlocked at 50 metal - resource milestone)
  8. Storage (unlocked at 200 ore - resource milestone)
- Locked cards are visible in the UI but non-interactive, similar to "tech tree" nodes that aren't yet available
- Resource discovery applies only to the resource panel display, not to underlying game state (resources can exist with value 0)

## Dependencies *(optional)*

### Upstream Dependencies (Must exist before starting)
- Phase 2: Resource automation system must be complete (provides the automation mechanics)
- Phase 3: Tier upgrade system must be complete (provides the T0 → T1 upgrade mechanism)
- Card configuration data must define manual click yields for Tier 0 cards
- Grid system must support programmatic card placement at specific coordinates

### Downstream Dependencies (Will need this feature)
- Phase 5+ features will build on the unlock system to gate higher-tier cards
- Tutorial/onboarding systems will reference the initial state as the starting point
- Achievement systems may track milestones like "first automation" or "unlock all 8 cards"

## Out of Scope *(optional)*

### Explicitly NOT Included
- Tutorial popups or guided onboarding (UI hints only, no interactive tutorials)
- Unlock animations or special effects (basic state change only)
- Alternative unlock methods (e.g., purchasing unlocks with premium currency)
- Card unlock prerequisites beyond single milestones (e.g., "unlock X AND Y to unlock Z")
- Unlocking higher tiers (T2, T3) - this feature only handles card availability, not tier availability
- Customizing initial card placement (always Extractor at position 2,2)
- Multiple save slots or profile management
- Analytics tracking for player progression metrics

### Future Considerations
- Achievement system that rewards first-time unlocks with bonuses
- "New card unlocked!" notification popup with card details
- Unlock hints ("Get 100 ore to unlock Processor" tooltip on locked cards)
- Reset/prestige system that preserves some unlock progress
- Alternative game start options (e.g., "Start with Processor instead of Extractor")
