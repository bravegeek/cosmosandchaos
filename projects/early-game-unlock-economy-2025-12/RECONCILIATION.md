# Design Reconciliation: Unlock Sequence vs Core Game Systems

**Date**: 2025-12-25
**Purpose**: Resolve inconsistencies between unlock-sequence.md and core design documents
**Status**: Proposed Solutions
**Affected Documents**: unlock-sequence.md, DESIGN.md, CARD_EVOLUTION.md, cardConfigs.js, tier-upgrade-brainstorm.md

---

## Executive Summary

The unlock sequence design (unlock-sequence.md) and core game design (DESIGN.md, CARD_EVOLUTION.md) describe **two different game architectures**. This document proposes a unified design that preserves the best elements of both approaches.

**Core Conflict**: Unlock sequence assumes a **multi-card collection system** (12+ unique cards). Core design assumes a **singleton slot system** (8 cards that evolve through tiers).

**Proposed Solution**: **Hybrid Tier-Unlock System** - Players unlock tier upgrades sequentially, with early tiers introducing the 8 core cards and later tiers offering Wonder/Dread specializations.

---

## CRITICAL ISSUE #1: Singleton vs Multi-Card Architecture

### Current Conflict

**unlock-sequence.md**:
- 12 separate unlockable cards (Ore Generator, Refinery, Data Scanner, Reactor, Science Lab, etc.)
- Each unlock is a new entity you place on the grid
- Progressive collection system (unlock 0 → unlock 12)

**DESIGN.md**:
- 8 Core Slots (Extractor, Processor, Storage, Reactor, Engine, Sensor, Habitat, Lab)
- Singleton system: "One card per tech"
- Cards transform in place (Tier 0 → Tier 5)
- At Tier 3, cards FORK into Wonder/Dread variants

### Proposed Resolution: **Tier-Unlock Hybrid System**

**Core Principle**: Players unlock **tier upgrades** in a guided sequence, not separate cards.

**How It Works**:

1. **Starting State**: Player starts with 1 card placed (Extractor T0) and 1 card in deck (Storage T0)
2. **Unlocks 1-7**: Unlock the remaining 6 core cards at Tier 0
3. **Unlocks 8-15**: Unlock Tier 1 upgrades for all 8 cards (automation unlocks)
4. **Unlocks 16-23**: Unlock Tier 2 upgrades (efficiency improvements)
5. **Unlocks 24-39**: Unlock Tier 3 Wonder/Dread forks (2 options per card)
6. **Unlocks 40+**: Tier 4-5 endgame specializations

**Key Change**: "Unlock 7: Nanite Assembler" becomes "Unlock 7: Lab (unlocks Tier 0 Lab card)"

**Mapping Old to New**:

| Old Unlock # | Old Name | New Interpretation | Tier | Card Slot |
|--------------|----------|-------------------|------|-----------|
| 0 | Ore Generator | ✓ Starting card | T0 | Extractor |
| 1 | Refinery | Unlock Processor card | T0 | Processor |
| 2 | Data Processor | Unlock Sensor card | T0 | Sensor |
| 3 | Reactor | Unlock Reactor card | T0 | Reactor |
| 4 | Science Lab | Unlock Lab card | T0 | Lab |
| 5 | Biomass Cultivator | Unlock Habitat card | T0 | Habitat |
| 6 | Storage Matrix | Unlock Storage upgrade | T1 | Storage |
| 7 | Nanite Assembler | Unlock Engine card | T0 | Engine |
| 8 | Advanced Reactor | Reactor Tier 1 upgrade | T1 | Reactor |
| 9 | Harmonic Resonator | Storage Tier 2 upgrade (Wonder) | T2A | Storage |
| 10 | Rift Extractor | Extractor Tier 3 upgrade (Dread) | T3B | Extractor |
| 11 | Matter Converter | Processor Tier 3 upgrade (Wonder) | T3A | Processor |
| 12 | Quantum Data Core | Sensor Tier 2 upgrade | T2 | Sensor |

**Benefits**:
- ✅ Preserves unlock sequence pacing (2-5 min between unlocks)
- ✅ Maintains singleton architecture (8 card slots)
- ✅ Keeps guided progression from unlock sequence
- ✅ Supports tier evolution from core design
- ✅ Allows Wonder/Dread fork at appropriate tier

---

## CRITICAL ISSUE #2: Resource Chain Conflicts

### Current Conflict

**unlock-sequence.md**: Ore → Energy → Data → Science → Biomass → Nanites

**cardConfigs.js**: Ore → **Metal** → Energy (Metal missing from unlock sequence)

**Specific Issue**:
- Unlock 1 "Refinery": Ore → Energy
- cardConfigs.js PROCESSOR: Ore → Metal

### Proposed Resolution: **6-Resource Production Chain**

**Canonical Resource Flow**:

```
TIER 0 (Manual/Basic):
  Ore (Extractor T0 - manual click)

TIER 1 (Automation Unlocks):
  Ore (Extractor T1 - auto) → Metal (Processor T1)
                            → Energy (Reactor T1 - direct from ore burning)

  Energy → Data (Sensor T1)
  Energy → Biomass (Habitat T1)

TIER 2 (Advanced):
  Data + Energy → Science (Lab T1)
  Metal + Energy → Nanites (Engine T1)

CROSS-TIER:
  Metal used for: Upgrades, construction costs
  Science used for: Research, tier upgrades
  Nanites used for: Advanced upgrades, T3+ costs
```

**Resource Introduction Timeline** (Revised):

| Time | Resource | Source | Unlock # |
|------|----------|--------|----------|
| 0:00 | Ore | Extractor T0 (manual) | 0 |
| 1:30 | Metal | Processor T0 → Processor T1 | 1 |
| 3:00 | Energy | Reactor T0 → Reactor T1 | 2 |
| 5:00 | Data | Sensor T0 → Sensor T1 | 3 |
| 7:00 | Science | Lab T0 → Lab T1 | 4 |
| 10:00 | Biomass | Habitat T0 → Habitat T1 | 5 |
| 12:00 | Nanites | Engine T0 → Engine T1 | 6 |

**Key Changes**:
1. **Metal is now second resource** (after Ore)
2. **Energy is third** (from Reactor, not Refinery)
3. Processor (Refinery) produces Metal, not Energy
4. Resource order: Ore → Metal → Energy → Data → Science → Biomass → Nanites

**Update Required**:
- ✏️ unlock-sequence.md: Change "Refinery" to produce Metal instead of Energy
- ✏️ unlock-sequence.md: Add Reactor earlier in sequence (Unlock 2) to introduce Energy
- ✏️ cardConfigs.js: Verify Metal production on Processor
- ✏️ specs/001-resource-automation/spec.md: Add Metal to resource list

---

## ISSUE #3: Card Naming Standard

### Proposed Canonical Names (Tier 0)

| Card Slot | Tier 0 Name | Icon | Function |
|-----------|-------------|------|----------|
| Extractor | **Proton Cutter** | ⚡ | Produces Ore (manual click) |
| Processor | **Basic Smelter** | ⚙️ | Converts Ore → Metal (manual process) |
| Storage | **Cargo Bay** | 📦 | Stores resources (passive) |
| Reactor | **Fuel Cell** | ⚛️ | Produces Energy (manual activate) |
| Engine | **Ion Thruster** | 🚀 | Propulsion (passive speed) |
| Sensor | **Ore Scanner** | 📡 | Resource detection (manual scan) |
| Habitat | **Crew Quarters** | 🏠 | Produces Biomass (passive crew life) |
| Lab | **Research Station** | 🔬 | Converts Data+Energy → Science (manual) |

**Tier 1 Names** (Automation Unlocks):

| Card Slot | Tier 1 Name | Key Upgrade |
|-----------|-------------|-------------|
| Extractor | **Servo Drill** | Auto-mines 1 ore/sec |
| Processor | **Auto-Smelter** | Auto-converts ore → metal |
| Storage | **Smart Vault** | Filtered storage, 2x capacity |
| Reactor | **Fusion Core** | Auto-generates 5 energy/sec |
| Engine | **Plasma Drive** | 2x speed, auto-navigation |
| Sensor | **Deep Scanner** | Auto-scans, 3 sector range |
| Habitat | **Life Support** | Auto-produces biomass |
| Lab | **Research Lab** | Auto-generates science |

**Update Required**:
- ✏️ unlock-sequence.md: Use canonical Tier 0/1 names throughout
- ✏️ cardConfigs.js: Update `name` fields to match
- ✏️ CARD_EVOLUTION.md: Verify Tier 0/1 names align

---

## ISSUE #4: Wonder/Dread - Unlocks vs Tier Upgrades

### Current Conflict

**unlock-sequence.md**: Describes Wonder/Dread as separate cards to unlock
- "Unlock 9: Harmonic Resonator (Wonder)"
- "Unlock 10: Rift Extractor (Dread)"

**DESIGN.md**: Describes Wonder/Dread as Tier 3 upgrade paths
- "Tier 3: THE FORK. The card splits into a Wonder Variant or a Dread Variant"

### Proposed Resolution: **Tier 3 Fork Unlocks**

**How It Works**:

1. **Tiers 0-2**: Linear progression (all players follow same path)
2. **Tier 3**: Fork point - player chooses Wonder OR Dread upgrade path
3. **Unlock Requirement**: To unlock Tier 3 options, player must:
   - Have card at Tier 2
   - Pay unlock cost for desired path
   - Choose Wonder (Wonder resources) OR Dread (Dread resources)

**Tier 3 Fork Options**:

| Card Slot | Wonder Path (T3A) | Dread Path (T3B) |
|-----------|-------------------|------------------|
| Extractor | Harmonic Siphon (resonance mining) | Rift Bore (void mining) |
| Processor | Matter Weaver (universal conversion) | Entropic Forge (consume anything) |
| Storage | Klein Bottle (infinite capacity) | Void Locker (debt storage) |
| Reactor | Zero-Point Prism (passive power) | Entropy Furnace (burn anything) |
| Engine | Gravity Sail (passive supply lines) | Blink Drive (instant jump) |
| Sensor | Oracle Core (prescience) | Chaos Mapper (probability manipulation) |
| Habitat | Aquaponic Garden (harmony) | Neural Dampener (forced efficiency) |
| Lab | Resonance Archive (preserve artifacts) | Vivisection Chamber (consume artifacts) |

**Paradox Protocol** (from DESIGN.md):
- **Standard Play**: Choose one path per card
- **Witness Play**: Unlock BOTH paths (requires 2 grid slots)
  - Option A: Pay 1.0x cost after unlocking next tier elsewhere (+10% Dissonance Floor)
  - Option B: Pay 2.0x cost immediately (+50% Dissonance Spike)

**Update Required**:
- ✏️ unlock-sequence.md: Reframe unlocks 9-12 as "Tier 3 upgrade options" not "card unlocks"
- ✏️ Add note: "To unlock Tier 3 Harmonic Resonator: Upgrade Storage to T2, then pay T3A cost"
- ✏️ Remove implication that these are separate card entities

---

## ISSUE #5: Chain Bonus System

### Current Conflict

**unlock-sequence.md**:
- Two separate bonuses: "Converter boost" (+20%) and "Chain bonus" (+10% per connection)
- Chain bonus discovered as milestone at Unlock 4

**DESIGN.md**:
- Only mentions "Chain Bonus" (+10% per card in chain)
- No converter boost mentioned
- No discovery moment

### Proposed Resolution: **Unified Chain Bonus with Discovery**

**System Design**:

**Tier 0-1 (Before Discovery)**:
- Adjacency provides visual feedback only (I/O indicators light up)
- No production bonuses yet
- Players learn spatial relationships without numerical rewards

**Unlock Milestone (Lab reaches Tier 1)**:
- 🎉 **"SYNERGY DISCOVERED!"** event triggers
- Chain Bonus system activates retroactively
- All placed cards immediately benefit

**Chain Bonus Mechanics** (Post-Discovery):
```javascript
// Base formula
chainBonus = numberOfConnections × 10%

// Connection defined as:
// - Adjacent card (N/S/E/W)
// - AND I/O compatibility (output → input match)

// Example:
// [Extractor] → [Processor] → [Storage]
//      ↓
//  [Reactor]

Extractor: 2 connections (Processor, Reactor) = +20%
Processor: 2 connections (Extractor, Storage) = +20%
Reactor: 1 connection (Extractor) = +10%
Storage: 1 connection (Processor) = +10%
```

**Special Case - Converter Cards**:
- Cards that convert one resource to another (Processor, Lab, etc.)
- Get **additional +10% bonus** when connected to BOTH input supplier AND output consumer
- This replaces the separate "converter boost" concept

**Example**:
```
[Extractor] → [Processor] → [Storage]

Processor connections:
- Input from Extractor: +10%
- Output to Storage: +10%
- Converter completion bonus: +10%
Total: +30% for fully-connected converter
```

**Discovery Timing**: When player unlocks Lab to Tier 1 (typically 7-10 minutes)

**Update Required**:
- ✏️ DESIGN.md: Add "Chain Bonus Discovery" milestone event
- ✏️ DESIGN.md: Document converter completion bonus as part of chain system
- ✏️ unlock-sequence.md: Consolidate "converter boost" and "chain bonus" into unified system
- ✏️ Add Chain Bonus mechanics to cardConfigs.js or new chainBonus.js module

---

## ISSUE #6: Upgrade Costs Standardization

### Proposed Canonical Costs

**Tier 0 → Tier 1 Upgrade Costs** (Automation Unlocks):

| Card | Ore | Metal | Energy | Data | Science | Biomass | Nanites | Time Est. |
|------|-----|-------|--------|------|---------|---------|---------|-----------|
| Extractor | 50 | - | - | - | - | - | - | 2 min |
| Processor | 75 | 20 | - | - | - | - | - | 4 min |
| Reactor | 100 | 30 | - | - | - | - | - | 5 min |
| Sensor | 120 | 40 | 25 | - | - | - | - | 7 min |
| Lab | 150 | 50 | 30 | 20 | - | - | - | 10 min |
| Habitat | 180 | 60 | 40 | - | - | 30 | - | 12 min |
| Storage | 200 | 80 | 50 | - | - | - | - | 14 min |
| Engine | 250 | 100 | 60 | 30 | 20 | 40 | - | 18 min |

**Tier 1 → Tier 2 Upgrade Costs** (~10x scaling):

| Card | Ore | Metal | Energy | Data | Science | Biomass | Nanites |
|------|-----|-------|--------|------|---------|---------|---------|
| Extractor | 500 | 200 | 100 | - | 50 | - | - |
| Processor | 750 | 300 | 150 | 50 | 75 | - | - |
| Reactor | 1000 | 400 | 200 | - | 100 | - | - |
| Sensor | 1200 | 500 | 250 | 100 | 150 | - | 50 |
| Lab | 1500 | 600 | 300 | 200 | 200 | - | 75 |
| Habitat | 1800 | 700 | 400 | - | 150 | 300 | 100 |
| Storage | 2000 | 800 | 500 | - | 200 | - | 150 |
| Engine | 2500 | 1000 | 600 | 300 | 250 | 400 | 200 |

**Tier 2 → Tier 3 Fork Costs** (~10x scaling + path-specific resources):

**Wonder Path (T3A)** - Requires Wonder-aligned resources:
- Base: ~10K ore, ~5K metal, ~2K energy
- Plus: Science, Biomass (Wonder-leaning resources)
- Example: Harmonic Siphon: 10K ore, 5K metal, 2K energy, 1K science, 500 biomass

**Dread Path (T3B)** - Requires Dread-aligned resources:
- Base: ~10K ore, ~5K metal, ~3K energy
- Plus: Nanites, excess Energy (Dread-leaning resources)
- Example: Rift Bore: 10K ore, 5K metal, 3K energy, 1K nanites, 200 science

**Design Principles**:
1. **10x scaling per tier** (exponential idle game standard)
2. **Multi-resource costs** increase with tier (T1: 2-3 types, T2: 4-5 types, T3: 5-6 types)
3. **Time estimates** based on manual click → automation → compound production
4. **Path signaling** at T3 (Wonder uses Science+Biomass, Dread uses Nanites+Energy)

**Update Required**:
- ✏️ unlock-sequence.md: Replace current costs with canonical table
- ✏️ cardConfigs.js: Update `upgradeCosts` objects to match
- ✏️ tier-upgrade-brainstorm.md: Mark as superseded by reconciliation costs
- ✏️ Create new `docs/design/UPGRADE_COSTS.md` with complete cost tables T0→T5

---

## ISSUE #7: Science Resource Bootstrapping

### Current Conflict

**cardConfigs.js**: Lab upgrade cost includes 10 Science, but Lab produces Science

**Question**: Where does initial Science come from?

### Proposed Resolution: **Multi-Source Science**

**Science Production Sources**:

1. **Primary**: Lab (Data + Energy → Science)
   - Tier 0: Manual click to research (+1 science)
   - Tier 1: Auto-generates 0.3 science/sec
   - Tier 2+: Enhanced rates

2. **Secondary**: Sensor (passive discovery)
   - Tier 1+: Sensor generates +0.1 science/sec as byproduct of scanning
   - Represents "learning from exploration"

3. **Tertiary**: Achievements/Milestones
   - First automation: +10 science (one-time)
   - Chain Synergy Discovery: +25 science (one-time)
   - All cards Tier 1: +50 science (one-time)

**Bootstrapping Flow**:
```
Player unlocks Lab at Tier 0 (cost: 150 ore, 50 metal, 30 energy, 20 data)
  → Lab can produce Science via manual clicks
  → Player manually researches to generate ~10 science
  → Player upgrades Lab to Tier 1 (cost includes 10 science - now possible!)
  → Lab now auto-generates science
```

**Alternative**: Remove Science from Lab T0→T1 upgrade cost, add it to T1→T2 instead

**Update Required**:
- ✏️ cardConfigs.js: Remove Science from Lab Tier 1 upgrade cost, OR
- ✏️ Add Sensor passive science generation to balance bootstrapping
- ✏️ Document science sources in DESIGN.md

---

## ISSUE #8: Ghost Vista System

### Current State

**unlock-sequence.md**: Detailed ghost card system showing 2-3 future unlocks

**Other docs**: No mention of ghost cards

### Proposed Resolution: **Defer to Implementation Phase**

**Recommendation**: Ghost vista is a **UX enhancement**, not a core mechanic

**Options**:
1. **Include in Phase 3** (Unlock System implementation)
   - Add ghost cards to grid UI
   - Show silhouettes of next unlockable tier upgrades
   - Cost displayed on hover

2. **Include in Phase 4** (Polish & UX)
   - Optional enhancement
   - Can be added after core unlock system works

3. **Simplify**: Replace ghosts with upgrade menu/tree UI
   - Show all 8 cards in sidebar
   - Grayed out = locked
   - Glow = affordable
   - No grid ghosts needed

**Decision Point**: Does ghost system add enough value to justify implementation complexity?

**Update Required**:
- ✏️ unlock-sequence.md: Mark ghost vista as "Phase 3+ feature (optional)"
- ✏️ Create separate spec for ghost UI if implementing
- ✏️ Alternative: Design upgrade tree UI instead

---

## ISSUE #9: Storage Starting State

### Current Conflict

**unlock-sequence.md**: Storage unlocked at Unlock 6 (12-15 minutes)

**Logic**: Players need storage from the start to hold ore

### Proposed Resolution: **Storage Starts on Grid**

**Starting State**:
- Extractor T0 (Proton Cutter) - placed at grid center
- Storage T0 (Cargo Bay) - placed adjacent to Extractor
- Player starts with 2 cards on grid

**Storage Unlock Timeline**:
- Start: Storage T0 (Cargo Bay) - 1000 capacity
- ~14 min: Upgrade to Storage T1 (Smart Vault) - 2000 capacity + filtering
- ~Later: Upgrade to Storage T2 (depends on Wonder/Dread choice)

**Update Required**:
- ✏️ unlock-sequence.md: Update "Starting State" section to include Storage T0
- ✏️ Remove "Storage Matrix" as separate unlock, replace with "Storage T1 upgrade"

---

## ISSUE #10: Converter Automation Tier

### Current Conflict

**unlock-sequence.md**: "Tier 0 converters auto-activate"

**CARD_EVOLUTION.md**: Automation unlocks at Tier 1 (some) or Tier 2 (others)

### Proposed Resolution: **All Automation at Tier 1**

**Universal Rule**:
- **Tier 0 = Manual only** (all cards)
- **Tier 1 = Automation unlocks** (all cards)
- No exceptions

**Tier 0 Converter Behavior**:
- Processor T0: Player clicks "REFINE" to convert 5 ore → 2 metal (manual batch)
- Lab T0: Player clicks "RESEARCH" to convert data+energy → science (manual)
- All other cards: Manual clicks or passive (no automation)

**Tier 1 Automation**:
- All cards auto-produce/auto-convert at their base rate
- No more manual clicking required (but manual clicks still give bonus)

**Update Required**:
- ✏️ unlock-sequence.md: Change "Tier 0 converters auto-activate" to "Tier 1 unlocks automation for all cards"
- ✏️ CARD_EVOLUTION.md: Standardize automation unlock at Tier 1 for all cards

---

## ISSUE #11: Grid Size Clarification

### Current Ambiguity

**unlock-sequence.md**: "5×4 grid"

**DESIGN.md**: "10×10 total, 5×4 viewport"

### Proposed Resolution: **10×10 Grid with 5×4 Viewport**

**Specification**:
- **Total Grid**: 10 columns × 10 rows (100 total slots)
- **Visible Viewport**: 5 columns × 4 rows (20 visible slots)
- **Navigation**: Drag grid to pan/scroll, or edge scrolling
- **Starting View**: Centered on rows 4-7, columns 3-7 (middle of 10×10)

**Visual**:
```
10×10 TOTAL GRID:
┌─────────────────────────────┐
│ . . . . . . . . . .         │
│ . . . . . . . . . .         │
│ . . . . . . . . . .         │
│ . . .┌─────────┐. .         │ ← Viewport window
│ . . .│█ █ █ █ █│. .         │   (5×4 visible)
│ . . .│█ █ █ █ █│. .         │
│ . . .│█ █ █ █ █│. .         │
│ . . .│█ █ █ █ █│. .         │
│ . . .└─────────┘. .         │
│ . . . . . . . . . .         │
└─────────────────────────────┘

Starting placement: Card at row 5, col 5 (center)
```

**Update Required**:
- ✏️ unlock-sequence.md: Clarify "5×4 viewport of 10×10 grid"
- ✏️ Confirm in IMPLEMENTATION.md

---

## IMPLEMENTATION ROADMAP

### Phase 1: Update Documentation (Week 1)

**Priority 1 - Core Design Alignment**:
1. ✏️ Create `UPGRADE_COSTS.md` with canonical cost tables
2. ✏️ Update DESIGN.md to include:
   - Chain Bonus Discovery milestone
   - Unified chain bonus mechanics
   - 6-resource production flow
3. ✏️ Update CARD_EVOLUTION.md:
   - Standardize Tier 0/1 card names
   - Confirm automation unlocks at Tier 1 universally
   - Add converter completion bonus

**Priority 2 - Unlock Sequence Revision**:
4. ✏️ Rewrite unlock-sequence.md using reconciliation decisions:
   - Reframe as tier-unlock progression (not separate cards)
   - Fix resource chain (add Metal, move Energy to Reactor)
   - Use canonical card names
   - Update costs to match UPGRADE_COSTS.md
   - Clarify Wonder/Dread as Tier 3 upgrades
5. ✏️ Mark ghost vista as optional Phase 3+ feature

**Priority 3 - Implementation Alignment**:
6. ✏️ Update cardConfigs.js:
   - Apply canonical Tier 0 names
   - Update upgrade costs
   - Add Metal to resource constants
   - Remove Science from Lab T1 cost (or add Sensor science gen)
7. ✏️ Update specs/001-resource-automation/spec.md:
   - Add Metal to resource list
   - Update to 6 resources (not 5)

### Phase 2: Implement Reconciled System (Weeks 2-4)

**New Features Required**:
1. **Chain Bonus System** (new module: `chainBonus.js`)
   - Calculate connections based on adjacency + I/O match
   - Discovery event at Lab T1 unlock
   - Converter completion bonus
   - Event system for retroactive bonus application

2. **Tier Unlock Manager** (new module: `tierUnlockManager.js`)
   - Track which tier upgrades are unlocked per card
   - Validate upgrade costs (multi-resource)
   - Handle tier progression (T0→T1→T2→T3A/T3B)
   - Paradox Protocol for dual-path unlocks

3. **Science Bootstrapping**:
   - Lab manual click generates science at T0
   - Sensor passive science generation (optional)
   - Achievement milestone bonuses

4. **Resource Production Updates**:
   - Processor: Ore → Metal
   - Reactor: Ore burning → Energy
   - Lab: Data + Energy → Science

### Phase 3: Playtest & Balance (Week 5)

**Validation Tests**:
1. ✅ First card (Extractor) reaches T1 in 2-3 minutes
2. ✅ All 8 cards unlocked and at T1 by 20-25 minutes
3. ✅ Chain bonus discovery feels impactful (visible production jump)
4. ✅ Resource gates create natural unlock order (ore→metal→energy flow)
5. ✅ Tier 3 fork unlocks by 40-60 minutes (Wonder/Dread choice point)

**Adjustment Areas**:
- Production rates (if unlocks too slow/fast)
- Upgrade costs (if progression too grindy)
- Chain bonus percentages (if impact too weak/strong)

---

## DOCUMENT UPDATE CHECKLIST

### High Priority (Week 1)

- [ ] **DESIGN.md**
  - [ ] Add Chain Bonus Discovery section
  - [ ] Document 6-resource flow (Ore→Metal→Energy→Data→Science→Biomass→Nanites)
  - [ ] Add converter completion bonus to adjacency mechanics
  - [ ] Clarify grid size (10×10 with 5×4 viewport)

- [ ] **unlock-sequence.md**
  - [ ] Rewrite as tier-unlock progression (not card collection)
  - [ ] Fix Unlock 1: Processor (produces Metal, not Energy)
  - [ ] Fix Unlock 2: Reactor (produces Energy)
  - [ ] Update all costs to canonical values
  - [ ] Reframe Unlocks 7-12 as Tier 2/3 upgrades
  - [ ] Update starting state (Extractor + Storage on grid)
  - [ ] Use canonical Tier 0/1 card names
  - [ ] Mark ghost vista as Phase 3+ optional

- [ ] **cardConfigs.js**
  - [ ] Update card names to canonical Tier 0 versions
  - [ ] Update upgrade costs to match UPGRADE_COSTS.md
  - [ ] Add RESOURCES.METAL to constants
  - [ ] Fix Processor: outputs Metal (not Energy)
  - [ ] Remove Science from Lab T0→T1 cost
  - [ ] Add Storage to starting cards

- [ ] **CARD_EVOLUTION.md**
  - [ ] Verify Tier 0/1 names match canonical list
  - [ ] Confirm all cards unlock automation at Tier 1
  - [ ] Add converter completion bonus mechanic

- [ ] **Create: UPGRADE_COSTS.md**
  - [ ] Complete cost tables for T0→T1, T1→T2, T2→T3
  - [ ] Include time estimates
  - [ ] Document cost scaling formula
  - [ ] Show Wonder vs Dread cost differences at T3

### Medium Priority (Week 2)

- [ ] **specs/001-resource-automation/spec.md**
  - [ ] Update resource count (5 → 6, add Metal)
  - [ ] Add Metal to FR-005 resource list

- [ ] **tier-upgrade-brainstorm.md**
  - [ ] Add note at top: "Superseded by RECONCILIATION.md and UPGRADE_COSTS.md"
  - [ ] Keep for historical reference

### Low Priority (Week 3+)

- [ ] **Create: specs/003-chain-bonus/spec.md** (if implementing)
  - [ ] Chain bonus calculation algorithm
  - [ ] Discovery event specification
  - [ ] UI requirements (connection visualizations)

- [ ] **Create: specs/004-tier-unlocks/spec.md** (if implementing)
  - [ ] Tier unlock flow specification
  - [ ] Upgrade modal UI design
  - [ ] Tier progression validation rules

---

## DECISION LOG

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Use tier-unlock hybrid (not separate cards) | Preserves singleton architecture while keeping guided progression | High - fundamental game structure |
| Metal is second resource (after Ore) | Processor must produce something before Reactor produces Energy | High - changes resource chain |
| All automation unlocks at Tier 1 | Consistent rule, easier to communicate | Medium - affects all cards |
| Chain bonus discovered at Lab T1 unlock | Milestone at ~7-10 min creates engagement peak | Medium - adds discovery moment |
| Canonical card names at each tier | Consistency across all documents | Low - documentation clarity |
| Storage starts on grid | Players need storage from minute 0 | Low - starting state change |
| Defer ghost vista to Phase 3+ | Focus on core mechanics first, UX polish later | Low - optional feature |

---

## QUESTIONS FOR CLARIFICATION

Before finalizing this reconciliation, please confirm:

1. **Singleton vs Collection**: Do you prefer the singleton system (8 evolving cards) or would you like to explore a hybrid where some cards have multiple instances?

2. **Ghost Vista**: Is the ghost card UI system a must-have for launch, or can it be a Phase 3+ enhancement?

3. **Science Bootstrapping**: Should we:
   - A) Remove Science from Lab T1 cost?
   - B) Add passive Science generation to Sensor?
   - C) Both?

4. **Starting Cards**: Confirm starting state:
   - Extractor T0 (on grid)
   - Storage T0 (on grid)
   - Other 6 cards (in deck/unlockable)

   OR different configuration?

5. **Chain Bonus Discovery**: Should this be:
   - A) Hard-coded to Lab T1 unlock (as proposed)?
   - B) Triggered when player places 4th card (any cards)?
   - C) Always active (no discovery moment)?

6. **Wonder/Dread Tracking**: Should we track implicit player choices before Tier 3 fork to pre-suggest a path, or keep it neutral until T3?

---

## NEXT STEPS

**Immediate (This Week)**:
1. Review this reconciliation document
2. Confirm or adjust major decisions
3. Begin updating DESIGN.md and unlock-sequence.md

**Near-term (Weeks 2-3)**:
1. Update all affected documentation
2. Update cardConfigs.js implementation
3. Create UPGRADE_COSTS.md reference

**Medium-term (Weeks 3-4)**:
1. Implement chain bonus system
2. Implement tier unlock manager
3. Playtest unlock progression timing

**Long-term (Phase 3+)**:
1. Implement Wonder/Dread Tier 3 fork mechanics
2. Add ghost vista UI (if approved)
3. Balance Tier 4-5 endgame progression

---

## CONCLUSION

This reconciliation preserves the best elements of both designs:

✅ **From unlock-sequence.md**:
- Guided progression with clear unlock order
- 2-5 minute unlock cadence for engagement
- Chain Synergy Discovery as milestone moment
- Progressive resource introduction

✅ **From DESIGN.md / CARD_EVOLUTION.md**:
- Singleton card architecture (8 core slots)
- Tier evolution system (T0→T5)
- Wonder/Dread fork at Tier 3
- Paradox Protocol for Witness playstyle

🎯 **Result**: A **tier-unlock progression system** where players unlock the 8 core cards, then unlock tier upgrades sequentially, culminating in Wonder/Dread specialization choices at Tier 3.

This design maintains strategic depth, clear progression pacing, and the philosophical alignment system while using a clean, scalable singleton architecture.

---

**Document Status**: ✅ Ready for Review

**Approval Required From**: Game Designer / Lead Developer

**Next Action**: Review → Approve → Begin Documentation Updates → Implement

---

*Reconciliation completed: 2025-12-25*
*Author: Claude (via Design Review Process)*
