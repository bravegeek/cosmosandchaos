# Implementation Tasks: Early Game & Initial State

**Feature Branch**: `003-early-game-state`
**Generated**: 2026-01-04
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Task Summary

- **Total Tasks**: 69
- **Parallelizable**: 23 tasks marked [P]
- **User Stories**: 5 (US1-US5)
- **Test Tasks**: 27 (unit + integration tests)
- **Implementation Tasks**: 42

---

## Implementation Strategy

**MVP Scope** (Minimal Viable Product):
- Phase 3: User Story 1 (Pre-placed Extractor) + User Story 2 (Manual Clicking)
- Delivers: Playable game with immediate engagement (click to mine ore)

**Incremental Delivery**:
1. **Sprint 1** (MVP): Phase 1-2 + Phase 3-4 → Manual clicking works
2. **Sprint 2**: Phase 5 → First automation milestone unlocks Processor
3. **Sprint 3**: Phase 6 → Full unlock progression system
4. **Sprint 4**: Phase 7 + Polish → Resource discovery, edge cases, final integration

Each phase is independently testable and delivers user value.

---

## Phase 1: Setup & Prerequisites

**Goal**: Prepare codebase for early game feature implementation.

### Tasks

- [X] T001 Add new event constants to src/js/constants.js (RESOURCE_DISCOVERED, CARD_UNLOCKED, CLICK_RATE_LIMITED, CARD_CLICKED)
- [X] T002 [P] Add manual click yield configurations to src/js/cardConfigs.js for all 8 cards (consume/produce mappings)
- [X] T003 [P] Create error toast CSS styles in src/css/cards.css (error-toast class with positioning and animations)
- [X] T004 [P] Add locked card visual styles to src/css/cards.css (opacity, grayscale filter, lock icon overlay)
- [X] T005 [P] Add rate limit animation styles to src/css/cards.css (shake keyframes for visual feedback)
- [X] T006 [P] Add resource discovery animation to src/css/cards.css (fade-in keyframes for new counters)

**Acceptance**: All CSS styles and constants defined, no runtime changes yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Implement core state extensions that all user stories depend on.

**Independent Test**: GameState extensions can be tested independently before any UI integration.

### Tasks

- [X] T007 Extend GameState constructor in src/js/state.js to add discoveredResources Set initialized with [RESOURCES.ORE]
- [X] T008 Add unlocked field to all card state objects in src/js/state.js (Extractor: true, all others: false)
- [X] T009 Implement GameState.discoverResource() method in src/js/state.js (add to Set, emit RESOURCE_DISCOVERED event)
- [X] T010 Implement GameState.isResourceDiscovered() method in src/js/state.js (check Set membership)
- [X] T011 Modify GameState.addResource() in src/js/state.js to trigger discovery on 0→positive transitions
- [X] T012 [P] Write unit tests for resource discovery in tests/discovery.test.js (initial state, 0→positive, no rediscovery)
- [X] T013 [P] Write unit tests for unlocked field initialization in tests/initialState.test.js (Extractor unlocked, others locked)
- [X] T014 Update SaveManager.save() in src/js/save.js to serialize discoveredResources Set to Array and increment version to 2
- [X] T015 Update SaveManager.load() in src/js/save.js to deserialize discoveredResources Array to Set
- [X] T016 Implement SaveManager.migrateV1toV2() in src/js/save.js (add unlocked field, auto-discover resources with value>0)
- [X] T017 Implement SaveManager.validateAndRecover() in src/js/save.js to detect corrupted unlock data and reset unlock state
- [X] T018 [P] Write unit tests for save migration in tests/save.test.js (v1→v2 migration, Set serialization, corruption recovery)

**Acceptance**: All state extensions tested, save/load handles unlock state and discovery correctly.

---

## Phase 3: User Story 1 - Start With One Card (P1)

**Goal**: New players start with Extractor T0 pre-placed at grid position (2,2).

**Why P1**: Foundational entry point - without a card on the grid, there's no game to play.

**Independent Test**: Start new game → Verify Extractor at (2,2), tier 0, unlocked, not automated.

### Tasks

- [X] T019 [US1] Implement initializeNewGame() function in src/js/main.js to create GameState with initial unlock states
- [X] T020 [US1] Add programmatic card placement logic to initializeNewGame() in src/js/main.js using grid.placeCard(EXTRACTOR, 2, 2)
- [X] T021 [US1] Set Extractor initial state in initializeNewGame() in src/js/main.js (placed: true, row: 2, col: 2, tier: 0, automated: false)
- [X] T022 [P] [US1] Write unit tests for initial game state in tests/initialState.test.js (Extractor at 2,2, tier 0, other cards locked)
- [X] T023 [P] [US1] Write integration test in tests/initialState.test.js for new game loading (verify DOM shows Extractor, no other cards)

**Acceptance Criteria**:
- [x] Extractor T0 appears at grid position (2,2) on new game
- [x] No other cards are placed initially
- [x] Extractor displays "T0" tier and is in manual mode

**Dependencies**: Phase 2 (GameState extensions)

**Parallel Opportunities**: T022, T023 can run in parallel with implementation tasks

---

## Phase 4: User Story 2 - Mine Resources Manually (P1)

**Goal**: Players can click Tier 0 Extractor to mine ore with rate limiting.

**Why P1**: Manual clicking is the only way to progress before automation unlocks.

**Independent Test**: Click Extractor → Ore increases by 1, rate limit enforced at 10 clicks/sec.

### Tasks

- [X] T024 [US2] Create ClickHandler class in new src/js/clickHandler.js with constructor initializing lastClickTimestamps Map and CLICK_COOLDOWN_MS constant
- [X] T025 [US2] Implement ClickHandler.handleClick() method in src/js/clickHandler.js with rate limit check, tier 0 validation, resource validation
- [X] T026 [US2] Implement click resource processing in ClickHandler.handleClick() in src/js/clickHandler.js (consume inputs, produce outputs, update timestamp)
- [X] T027 [US2] Add ClickHandler.getRemainingCooldown() method in src/js/clickHandler.js for UI cooldown queries
- [X] T028 [US2] Instantiate ClickHandler in src/js/main.js and attach click event listeners to card elements
- [X] T029 [US2] Add rate limit visual feedback handler in src/js/main.js (listen to CLICK_RATE_LIMITED, add shake animation class)
- [X] T030 [P] [US2] Write unit tests for ClickHandler rate limiting in tests/clickHandler.test.js (cooldown enforcement, per-card isolation)
- [X] T031 [P] [US2] Write unit tests for click processing in tests/clickHandler.test.js (resource consume/produce, tier 0 restriction)
- [X] T032 [P] [US2] Write unit tests for manual click yields in tests/clickHandler.test.js (Extractor: 1 ore, Sensor: 5 energy → 2 data)
- [X] T033 [P] [US2] Write integration test in tests/clickHandler.test.js (click → resource update → display update flow)

**Acceptance Criteria**:
- [x] Clicking Extractor T0 adds 1 ore to resource count
- [x] Ore counter displays current amount
- [x] Ore accumulates with each click
- [x] Tier 0 cards don't auto-produce (time passes = no change)

**Dependencies**: Phase 2 (GameState.addResource with discovery)

**Parallel Opportunities**: T030-T033 (all tests) can run in parallel

**Performance**: SC-006 requires <100ms click response (rate limit check is O(1))

---

## Phase 5: User Story 3 - Progress to First Automation (P2)

**Goal**: Upgrading Extractor T0→T1 unlocks Processor and starts automation.

**Why P2**: Critical transition from clicker to idle game, teaches upgrade system.

**Independent Test**: Accumulate 50 ore → Upgrade to T1 → Automation starts, Processor unlocks.

### Tasks

- [X] T034 [US3] Create UnlockManager class in new src/js/unlock.js with unlockRules configuration (sequential + milestones)
- [X] T035 [US3] Implement UnlockManager.setupListeners() in src/js/unlock.js to listen for CARD_UPGRADED and RESOURCE_CHANGED events
- [X] T036 [US3] Implement UnlockManager.checkSequentialUnlocks() in src/js/unlock.js (check tier upgrade triggers, unlock cards, emit CARD_UNLOCKED)
- [X] T037 [US3] Implement UnlockManager.checkMilestoneUnlocks() in src/js/unlock.js (check resource thresholds, unlock cards independently)
- [X] T038 [US3] Add UnlockManager.getUnlockProgress() method in src/js/unlock.js for UI progress queries
- [X] T039 [US3] Instantiate UnlockManager in src/js/main.js after GameState and ClickHandler initialization
- [X] T040 [P] [US3] Write unit tests for sequential unlocks in tests/unlock.test.js (Extractor T1 → Processor, chain progression)
- [X] T041 [P] [US3] Write unit tests for upgrade cost deduction in tests/unlock.test.js (50 ore → 0 ore after upgrade)
- [X] T042 [P] [US3] Write integration test in tests/unlock.test.js (50 ore → upgrade → automation starts → Processor unlocks)

**Acceptance Criteria**:
- [x] Upgrading with 50 ore deducts cost (0 ore remaining)
- [x] Card shows "T1" tier after upgrade
- [x] Ore accumulates automatically without clicking
- [x] One additional card (Processor) becomes unlocked

**Dependencies**: Phase 2 (GameState unlock field), Phase 4 (manual clicking to reach 50 ore)

**Parallel Opportunities**: T040-T042 (all tests) can run in parallel with implementation

---

## Phase 6: User Story 4 - Unlock Cards Progressively (P2)

**Goal**: Full unlock progression with 7 locked cards unlocking via sequential/milestone triggers.

**Why P2**: Creates achievement pacing, prevents overwhelming new players.

**Independent Test**: Reach milestones → Cards unlock, show as available in UI.

### Tasks

- [ ] T043 [US4] Update card rendering in src/js/cards.js to check unlocked field and apply locked CSS class (opacity, grayscale, lock icon)
- [ ] T044 [US4] Add grid placement validation in src/js/grid.js to prevent placing locked cards (check unlocked before placeCard)
- [ ] T045 [US4] Implement grid full error handling in src/js/grid.js (show error toast for 3 seconds when grid capacity reached)
- [ ] T046 [US4] Add CARD_UNLOCKED event listener in src/js/display.js to update card selection area when cards unlock
- [ ] T047 [P] [US4] Write unit tests for milestone unlocks in tests/unlock.test.js (Data 50 → Lab, Energy 100 → Habitat, out-of-order unlocks)
- [ ] T048 [US4] Write unit tests for locked card placement prevention in tests/unlock.test.js (attempt place locked card → error)
- [ ] T049 [P] [US4] Write integration test in tests/unlock.test.js (full unlock chain: Extractor→Processor→Reactor→Sensor sequential)
- [ ] T050 [P] [US4] Write integration test in tests/unlock.test.js (milestone independence: unlock Storage at 200 ore before Lab at 50 data)

**Acceptance Criteria**:
- [x] 7 cards (Sensor, Storage, Processor, Reactor, Engine, Habitat, Lab) appear locked at game start
- [x] Cards unlock when milestones/upgrades met
- [x] Unlocked cards can be placed on grid
- [x] Locked cards show visual indication (grayed out, lock icon)

**Dependencies**: Phase 5 (UnlockManager), Phase 2 (unlock field)

**Parallel Opportunities**: T047, T049, T050 can run in parallel

---

## Phase 7: User Story 5 - See Only Discovered Resources (P3)

**Goal**: Resource panel hides undiscovered resources, shows only ore initially.

**Why P3**: Reduces cognitive load for new players, clean UI.

**Independent Test**: New game → Only ore visible. Produce energy → Energy counter appears.

⚡ **Parallelization Note**: Phase 7 can start immediately after Phase 2 completion (only depends on GameState.discoveredResources). Does NOT require Phases 3-6 to complete first.

### Tasks

- [X] T051 [US5] Modify DisplayUpdateManager.updateResourceDisplays() in src/js/display.js to filter by discovery state (hide undiscovered)
- [X] T052 [US5] Add DisplayUpdateManager.handleResourceDiscovery() method in src/js/display.js to show newly discovered resources with fade-in
- [X] T053 [US5] Add RESOURCE_DISCOVERED event listener in DisplayUpdateManager constructor in src/js/display.js
- [X] T054 [P] [US5] Write unit tests for display filtering in tests/discovery.test.js (undiscovered resources hidden, discovered shown)
- [X] T055 [P] [US5] Write integration test in tests/discovery.test.js (new game → only ore visible, produce energy → energy appears)
- [X] T056 [P] [US5] Write integration test in tests/discovery.test.js (save/load → discovered resources persist, remain visible)

**Acceptance Criteria**:
- [x] New game shows only ore in resource panel
- [x] Undiscovered resources remain hidden
- [x] First production of resource (0→positive) reveals counter
- [x] Multiple discovered resources display in logical order

**Dependencies**: Phase 2 (GameState.discoveredResources)

**Parallel Opportunities**: T054-T056 (all tests) can run in parallel with implementation

---

## Phase 8: Polish & Integration

**Goal**: Handle edge cases, finalize integration, ensure all acceptance criteria met.

### Edge Cases

- [ ] T057 [P] Write test for minimum cost upgrade in tests/unlock.test.js (exactly 50 ore → 0 remaining per clarification #3)
- [ ] T058 [P] Write test for rapid clicking in tests/clickHandler.test.js (20 clicks → only ~10 succeed, visual feedback shown)
- [ ] T059 [P] Write test for grid full scenario in tests/grid.test.js (20 cards placed → attempt 21st → error message)
- [ ] T060 [P] Write test for out-of-order milestones in tests/unlock.test.js (energy 100 before data 50 → both unlock independently)
- [ ] T061 [P] Write test for save/load unlock state in tests/save.test.js (save with 3 unlocked → load → 3 still unlocked)
- [ ] T062 [P] Write test for corrupted data recovery in tests/save.test.js (invalid unlock state → reset to Extractor only, preserve resources)

### Integration & Cross-Cutting

- [ ] T063 Verify all event listeners properly attached in src/js/main.js (CARD_UPGRADED, RESOURCE_CHANGED, RESOURCE_DISCOVERED, etc.)
- [ ] T064 Test full game flow integration (new game → click 50 times → upgrade → unlock Processor → place Processor → automation)
- [ ] T065 [P] Run full test suite and verify >70% coverage maintained (npm run coverage)
- [ ] T066 Manual browser testing per quickstart.md integration checklist (new game, first unlock, resource discovery, save/load)

### Performance Validation

- [ ] T067 Profile click response time (target <100ms per SC-006) using browser DevTools Performance tab
- [ ] T068 Verify 60 FPS maintained with Extractor + Processor running (no regression from Phase 2)
- [ ] T069 Validate time-to-automation metric (click 50 times → upgrade → verify 2-5 minute window per SC-002)

**Acceptance**: All edge cases handled, full integration tested, performance targets met.

---

## Dependencies & Execution Order

### Phase Completion Order

```
Phase 1 (Setup) → Phase 2 (Foundational)
                     ↓
           ┌─────────┴─────────┐
           ↓                   ↓
    Phase 3 (US1)      Phase 7 (US5)
           ↓
    Phase 4 (US2)
           ↓
    Phase 5 (US3)
           ↓
    Phase 6 (US4)
           ↓
    Phase 8 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 8

**Parallel Opportunities**:
- Phase 7 (US5) can start after Phase 2 (only depends on discoveredResources)
- Test tasks within each phase can run in parallel with implementation
- Phase 1 tasks T002-T006 (CSS/config) are all parallelizable

### User Story Dependencies

- **US1** (Start With Card): No dependencies, can start after Phase 2
- **US2** (Manual Clicking): Depends on US1 (need card to click)
- **US3** (First Automation): Depends on US2 (need to click 50 times for ore)
- **US4** (Unlock Progression): Depends on US3 (UnlockManager created)
- **US5** (Resource Discovery): No dependencies, can start after Phase 2

---

## Parallel Execution Examples

### Phase 2 (Foundational) Parallelization

```bash
# Terminal 1: Implement state extensions
# T007-T011 (sequential, same file)

# Terminal 2: Write discovery tests
# T012 (tests/discovery.test.js)

# Terminal 3: Write initial state tests
# T013 (tests/initialState.test.js)

# Terminal 4: Write save migration tests
# T018 (tests/save.test.js)

# Then: T014-T017 (sequential, SaveManager)
```

### Phase 4 (Manual Clicking) Parallelization

```bash
# Terminal 1: Implement ClickHandler
# T024-T027 (sequential, same class)

# Terminal 2: Write rate limit tests
# T030 (tests/clickHandler.test.js)

# Terminal 3: Write click processing tests
# T031, T032 (tests/clickHandler.test.js)

# Terminal 4: Write integration test
# T033 (tests/clickHandler.test.js)

# Then: T028-T029 (attach to main.js)
```

### Phase 8 (Polish) Parallelization

```bash
# Terminal 1: Edge case test (minimum cost)
# T057

# Terminal 2: Edge case test (rapid clicking)
# T058

# Terminal 3: Edge case test (grid full)
# T059

# Terminal 4: Edge case test (out-of-order)
# T060

# Terminal 5: Edge case test (save/load)
# T061

# Terminal 6: Edge case test (corruption)
# T062

# All 6 tests can run simultaneously (different test files)
```

---

## Task Validation Checklist

- [x] All tasks use strict checkbox format: `- [ ] [ID] [Labels] Description with path`
- [x] Task IDs sequential (T001-T069)
- [x] User story tasks have [US#] labels
- [x] Parallelizable tasks have [P] markers
- [x] All tasks include file paths
- [x] Each user story has independent test criteria
- [x] Dependencies clearly documented
- [x] MVP scope identified (Phase 3-4)
- [x] Parallel opportunities highlighted

---

## Quick Reference

**Next Steps**:
1. Run `/speckit.implement` to execute tasks (coming soon)
2. OR manually implement tasks in order (T001 → T069)
3. Track progress by checking off completed tasks

**Test First** (Optional):
- For TDD approach, run test tasks before implementation tasks in each phase
- Example: T012 (discovery tests) before T009-T011 (discovery implementation)

**Performance Targets**:
- Click response: <100ms (SC-006)
- Initial load: <5 seconds (SC-001)
- Frame rate: 60 FPS with automation active
- Rate limit: 10 clicks/second (100ms cooldown)

**Coverage Target**: >70% (maintain Phase 2 standard)

---

**Total Implementation Time Estimate**: 12-16 hours for experienced developer
- Phase 1-2: 2-3 hours (foundational setup)
- Phase 3-4: 3-4 hours (MVP - manual clicking)
- Phase 5-6: 4-5 hours (unlock system)
- Phase 7-8: 3-4 hours (discovery + polish)
