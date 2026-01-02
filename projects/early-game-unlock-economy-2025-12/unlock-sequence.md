# First 12 Card Unlock Sequence

> **⚠️ SUPERSEDED**: This document describes a card-collection system that conflicts with the core singleton architecture.
>
> **See instead**: `unlock-sequence-RECONCILED.md` (2025-12-25)
>
> This file is kept for historical reference only.

**Date**: 2025-12-17
**Project**: Early Game Unlock Economy
**Purpose**: Defines the specific progression of the first 12 unlockable cards
**Status**: DEPRECATED - See RECONCILIATION.md for conflicts and resolution

---

## Design Principles Applied

1. **Converter-Driven**: Resources introduced through conversion before pure generators
2. **Escalating Costs**: 25 → 60 → 100 → 150 → 250 pattern with variation
3. **Gradual Blending**: Structured (unlocks 1-3) → Mixed (4-6) → Experimental (7-12)
4. **Progressive Vista**: Shows 2-3 ahead, unlocks expand options
5. **Flow Bonuses**: Converter boost (1-3), Chain discovery (4), Full benefits (4+)
6. **Implicit Alignment**: Wonder-leaning and Dread-leaning options appear naturally

---

## Starting State

### Unlock 0: Ore Generator (FREE - Starting Card)

**Card**: Proton Cutter
**Type**: Base Generator (Tier 0)
**Cost**: Free (starting card)
**I/O**: No inputs → Ore output
**Production**: Manual clicking only (Tier 0)

**Starting Placement**: Center of 5×4 grid (row 2, col 2)

**Player State**:
- Resources: 0 Ore
- Cards placed: 1
- Systems learned: Manual clicking

**Ghost Vista**: Shows Refinery adjacent (left or right)

---

## Phase 1: Converter-Driven Teaching (Unlocks 1-3)

### Unlock 1: Refinery (FIRST CONVERTER)

**Card**: Ore Refinery
**Type**: Converter (Tier 0)
**Cost**: 25 Ore
**I/O**: Ore input (3/sec) → Energy output (0.5/sec)
**Production**: Automatic when placed (Tier 0 converters auto-activate)

**Timing**: ~60-90 seconds of clicking (25 clicks if pure manual)

**Ghost Placement**: Adjacent to Ore Generator (teaches spatial connection)

**What Player Learns**:
- I/O connections matter (visual indicators light up)
- Second resource type emerges (Energy discovered!)
- Converter boost applies (+20% when adjacent to Ore Gen)
- Ghost cards show WHERE to place

**Visual Feedback**:
- Refinery glows green when adjacent to Ore Gen (converter boost active)
- Energy counter appears in global resource panel
- I/O indicators pulse between Ore Gen → Refinery

**Ghost Vista After Unlock**:
- Data Processor (60 ore) - adjacent to Refinery
- Ore Storage (40 ore) - adjacent to Ore Gen or Refinery

**Strategic Notes**:
- First meaningful placement decision
- Teaches converter-driven resource introduction
- Sets up for unlock 2 (chaining)

---

### Unlock 2: Data Processor (CHAIN TEACHING)

**Card**: Data Scanner
**Type**: Converter (Tier 0)
**Cost**: 60 Ore
**I/O**: Energy input (1/sec) → Data output (0.3/sec)
**Production**: Automatic

**Timing**: ~3-4 minutes total gameplay

**Ghost Placement**: Adjacent to Refinery (continues chain)

**What Player Learns**:
- Chaining converters (Ore → Energy → Data)
- Third resource type emerges
- Converter boost applies to Data Processor too
- Efficiency matters (needs steady Energy supply)

**Visual Feedback**:
- Data Processor glows green (converter boost)
- Data counter appears
- Chain visualization: Ore Gen → Refinery → Data Proc

**Ghost Vista After Unlock**:
- Reactor (80 ore) - Pure Energy generator (first pure gen!)
- Storage Vault (50 ore + 10 energy) - Multi-resource storage
- Ore Scanner (70 ore) - Ore production enhancer

**Strategic Notes**:
- Chain is now 3 cards long
- Players see bottlenecks (Refinery must keep up)
- Sets up desire for parallel production (Reactor)

---

### Unlock 3: Reactor (FIRST PURE GENERATOR)

**Card**: Basic Reactor
**Type**: Pure Generator (Tier 0)
**Cost**: 80 Ore + 10 Energy
**I/O**: No inputs → Energy output (0.8/sec)
**Production**: Automatic

**Timing**: ~5-7 minutes total gameplay

**Ghost Placement**: Anywhere (teaches independence from chain)

**What Player Learns**:
- Pure generators exist (not all cards need inputs)
- Multi-resource costs (first time paying with non-Ore)
- Parallel production (can produce Energy without Ore chain)
- Placement flexibility (doesn't need to be adjacent)

**Visual Feedback**:
- No converter boost (pure generator)
- But benefits from proximity if placed near consumers

**Ghost Vista After Unlock**:
- Science Lab (100 ore + 20 energy + 10 data) - Multi-input consumer (Wonder-leaning)
- Power Extractor (100 ore) - Ore → Energy aggressive converter (Dread-leaning)
- Biomass Cultivator (90 ore + 15 energy) - Energy → Biomass converter

**Strategic Notes**:
- First major choice: Continue chain OR build parallel
- Unlocking this triggers CHAIN BONUS milestone next unlock
- Sets up Wonder (diversity) vs Dread (efficiency) divergence

---

## Phase 2: Chain Bonus Discovery & Mixed Options (Unlocks 4-6)

### Unlock 4: Science Lab (MULTI-INPUT + CHAIN BONUS UNLOCK)

**Card**: Basic Research Lab
**Type**: Multi-Input Converter (Tier 0)
**Cost**: 100 Ore + 20 Energy + 10 Data
**I/O**: Data input (0.5/sec) + Energy input (0.5/sec) → Science output (0.2/sec)
**Production**: Automatic (requires BOTH inputs)

**Timing**: ~7-10 minutes total gameplay

**MILESTONE**: 🎉 **CHAIN SYNERGY DISCOVERED!**

**Discovery Message**:
```
"⚡ CHAIN SYNERGY DISCOVERED!
Connected cards gain +10% output per connection.

Your network is becoming more than the sum of its parts..."
```

**What Player Learns**:
- Multi-input cards require optimization
- Chain bonus retroactively applies to all placed cards
- Placement matters SIGNIFICANTLY now
- Science resource unlocked (used for upgrades)

**Immediate Effect**:
All previously placed cards get chain bonus:
```
[Ore Gen] → [Refinery] → [Data Proc]
        ↓
    [Reactor]

Before: Ore Gen = 1.0/sec, Refinery = 0.6/sec (conv boost)
After:  Ore Gen = 1.1/sec (+10% for 1 connection)
        Refinery = 0.79/sec (+20% conv + 32% for 2 connections)
        Reactor = 1.0/sec (isolated, no connections)
```

**Ghost Vista After Unlock**:
- Storage Matrix (120 ore + 30 energy) - Increases all resource caps
- Ore Synthesizer (150 ore + 25 data) - Data → Ore converter (Wonder-leaning: cross-resource)
- Thermal Drill (120 ore) - Pure Ore generator (Dread-leaning: specialization)

**Strategic Notes**:
- Major milestone moment
- Players immediately see chain bonus value
- Wonder players want to connect everything
- Dread players might isolate high-efficiency cards

---

### Unlock 5: Biomass Cultivator (FOURTH RESOURCE)

**Card**: Biomass Cultivator
**Type**: Converter (Tier 0)
**Cost**: 140 Ore + 25 Energy
**I/O**: Energy input (1/sec) → Biomass output (0.4/sec)
**Production**: Automatic

**Timing**: ~10-13 minutes

**What Player Learns**:
- Fourth resource type emerges
- Biomass used for life support/crew systems
- Energy is valuable (multiple uses: Data, Biomass, Science)
- Bottleneck optimization (need more Energy production)

**Ghost Vista After Unlock**:
- Habitat Module (180 ore + 40 biomass) - Biomass → Morale/buffs
- Advanced Reactor (200 ore + 50 energy) - Pure Energy (2x output)
- Data Synthesizer (160 ore + 30 energy + 20 data) - Data production boost

**Strategic Notes**:
- Energy becomes critical bottleneck
- Wonder: Diversify energy sources
- Dread: Maximize single energy source

---

### Unlock 6: Storage Matrix (CAPACITY + UTILITY)

**Card**: Resource Vault
**Type**: Passive Utility (Tier 0)
**Cost**: 150 Ore + 30 Energy
**I/O**: No inputs or outputs (passive effect)
**Effect**: +1000 capacity for ALL resource types
**Production**: N/A (passive)

**Timing**: ~12-15 minutes

**What Player Learns**:
- Not all cards produce resources
- Utility cards provide passive benefits
- Resource caps exist (may have hit them)
- Strategic placement for chain bonus still matters

**Visual Feedback**:
- Resource caps update in UI
- Chain bonus still applies (benefits adjacent cards)

**Ghost Vista After Unlock**:
- Nanite Assembler (250 ore + 50 data + 30 biomass) - Fifth resource! (Wonder)
- Compression Drill (200 ore + 40 energy) - Ore boost, high efficiency (Dread)
- Energy Conduit (180 ore + 35 energy) - Energy distribution enhancer
- Quantum Scanner (220 ore + 60 data) - Data production multiplier

**Strategic Notes**:
- First purely utility card
- Chain bonus makes placement still strategic
- Wonder/Dread options clearly diverging in vista

---

## Phase 3: Strategic Variety & Experimentation (Unlocks 7-12)

### Unlock 7: Nanite Assembler (FIFTH RESOURCE - Wonder-leaning)

**Card**: Nanite Fabricator
**Type**: Multi-Input Converter (Tier 0)
**Cost**: 250 Ore + 50 Data + 30 Biomass
**I/O**: Data input (0.3/sec) + Biomass input (0.2/sec) → Nanites output (0.15/sec)
**Production**: Automatic (requires both inputs)

**Timing**: ~15-18 minutes

**What Player Learns**:
- Fifth and final basic resource type
- Nanites = advanced construction/upgrades
- Multi-resource conversion chains
- Cross-resource thinking (Data + Biomass = Nanites)

**Alignment Signal**: Wonder (uses diverse inputs, creates advanced resource)

**Ghost Vista After Unlock**:
- Matter Converter (300 ore + 80 energy + 40 data) - Universal converter (Wonder)
- Rift Extractor (280 ore + 60 energy) - Aggressive Ore production (Dread)
- Harmonic Resonator (320 ore + 100 data + 20 nanites) - Chain bonus enhancer (Wonder)
- Thermal Spike (260 ore + 50 energy) - High single-output Energy (Dread)

---

### Unlock 8: Advanced Reactor (PURE GENERATOR UPGRADE - Dread-leaning)

**Card**: Advanced Fusion Reactor
**Type**: Pure Generator (Tier 1)
**Cost**: 300 Ore + 60 Energy + 20 Science
**I/O**: No inputs → Energy output (2.5/sec)
**Production**: Automatic

**Timing**: ~17-20 minutes

**What Player Learns**:
- Higher tier cards have significantly better output
- Pure generators can be powerful
- Specialization has value (single-resource focus)

**Alignment Signal**: Dread (efficiency, raw output, specialization)

**Ghost Vista After Unlock**:
- Ore Network (280 ore + 40 science) - Ore distribution system (Wonder)
- Data Compression Unit (350 ore + 120 data + 30 science) - Data multiplier
- Biomass Synthesizer (320 ore + 80 biomass + 25 science) - Biomass production

---

### Unlock 9: Harmonic Resonator (CHAIN BONUS ENHANCER - Wonder)

**Card**: Resonance Amplifier
**Type**: Passive Utility (Tier 1)
**Cost**: 350 Ore + 100 Data + 30 Nanites
**I/O**: No inputs/outputs
**Effect**: +5% chain bonus for ALL cards within 2 spaces (stacks with base chain bonus)
**Production**: N/A

**Timing**: ~19-22 minutes

**What Player Learns**:
- Chain bonuses can be enhanced
- Area-of-effect mechanics exist
- Placement becomes 3D chess (proximity to enhancer matters)

**Alignment Signal**: Wonder (harmony, interconnection, synergy)

**Visual Feedback**:
- Pulsing aura showing 2-space radius
- Connected cards show enhanced glow

---

### Unlock 10: Rift Extractor (AGGRESSIVE GENERATOR - Dread)

**Card**: Void Rift Drill
**Type**: Pure Generator (Tier 1)
**Cost**: 380 Ore + 80 Energy + 40 Science
**I/O**: No inputs → Ore output (3.0/sec)
**Production**: Automatic
**Side Effect**: Generates 0.1 "Instability" per second (early Dread mechanic preview)

**Timing**: ~21-24 minutes

**What Player Learns**:
- High output comes with costs
- Dread mechanics preview (instability)
- Raw power vs. harmony tradeoff

**Alignment Signal**: Dread (exploitation, raw power, instability)

---

### Unlock 11: Matter Converter (UNIVERSAL CONVERTER - Wonder)

**Card**: Universal Matter Converter
**Type**: Advanced Converter (Tier 1)
**Cost**: 400 Ore + 120 Energy + 60 Data + 30 Science
**I/O**: ANY basic resource input (1/sec) → ANY basic resource output (0.8/sec)
**Production**: Automatic (player selects input/output types)
**UI**: Dropdown menus to select conversion

**Timing**: ~23-27 minutes

**What Player Learns**:
- Advanced cards have flexible mechanics
- Resource interchangeability (Wonder theme)
- Strategic flexibility value

**Alignment Signal**: Wonder (harmony, fluidity, adaptability)

---

### Unlock 12: Quantum Data Core (MULTI-OUTPUT - Experimental)

**Card**: Quantum Data Core
**Type**: Multi-Output Converter (Tier 1)
**Cost**: 450 Ore + 150 Energy + 80 Data + 50 Nanites
**I/O**: Energy input (2/sec) → Data output (1.2/sec) + Science output (0.3/sec)
**Production**: Automatic

**Timing**: ~25-30 minutes

**What Player Learns**:
- Multi-output cards exist
- Efficiency through dual production
- Complex optimization opportunities

**Strategic Notes**:
- By unlock 12, players have full strategic freedom
- Wonder/Dread patterns are established
- Ready for alignment reveal (if tracking threshold met)

---

## Unlock Cost Summary Table

| # | Card Name | Type | Cost | Resources Introduced | Unlock Time | Wonder/Dread |
|---|-----------|------|------|---------------------|-------------|--------------|
| 0 | Ore Generator | Base Gen | FREE | Ore | 0:00 | Neutral |
| 1 | Refinery | Converter | 25 Ore | Energy | 1-2 min | Neutral |
| 2 | Data Processor | Converter | 60 Ore | Data | 3-4 min | Neutral |
| 3 | Reactor | Pure Gen | 80 Ore + 10 Energy | - | 5-7 min | Neutral |
| 4 | Science Lab | Multi-Input | 100 Ore + 20 Energy + 10 Data | Science | 7-10 min | Neutral |
| 5 | Biomass Cultivator | Converter | 140 Ore + 25 Energy | Biomass | 10-13 min | Neutral |
| 6 | Storage Matrix | Utility | 150 Ore + 30 Energy | - | 12-15 min | Neutral |
| 7 | Nanite Assembler | Multi-Input | 250 Ore + 50 Data + 30 Biomass | Nanites | 15-18 min | Wonder |
| 8 | Advanced Reactor | Pure Gen | 300 Ore + 60 Energy + 20 Science | - | 17-20 min | Dread |
| 9 | Harmonic Resonator | Utility | 350 Ore + 100 Data + 30 Nanites | - | 19-22 min | Wonder |
| 10 | Rift Extractor | Pure Gen | 380 Ore + 80 Energy + 40 Science | - | 21-24 min | Dread |
| 11 | Matter Converter | Advanced Conv | 400 Ore + 120 Energy + 60 Data + 30 Science | - | 23-27 min | Wonder |
| 12 | Quantum Data Core | Multi-Output | 450 Ore + 150 Energy + 80 Data + 50 Nanites | - | 25-30 min | Experimental |

---

## Progressive Vista Visibility Map

Shows what ghosts appear after each unlock (2-3 ahead):

**After Unlock 0 (Start)**:
- Ghost: Refinery (25 ore)

**After Unlock 1 (Refinery)**:
- Ghosts: Data Processor (60), Ore Storage (40)

**After Unlock 2 (Data Processor)**:
- Ghosts: Reactor (80+10E), Storage Vault (50+10E), Ore Scanner (70)

**After Unlock 3 (Reactor)**:
- Ghosts: Science Lab (100+20E+10D), Power Extractor (100), Biomass Cultivator (90+15E)

**After Unlock 4 (Science Lab + Chain Discovery)**:
- Ghosts: Storage Matrix (120+30E), Ore Synthesizer (150+25D), Thermal Drill (120)

**After Unlock 5 (Biomass Cultivator)**:
- Ghosts: Habitat (180+40B), Advanced Reactor (200+50E), Data Synthesizer (160+30E+20D)

**After Unlock 6 (Storage Matrix)**:
- Ghosts: Nanite Assembler (250+50D+30B), Compression Drill (200+40E), Energy Conduit (180+35E), Quantum Scanner (220+60D)

**After Unlock 7+ (Strategic Variety)**:
- Vista shows 3-4 options mixing Wonder/Dread/Experimental
- Player has clear choice between alignment paths

---

## Resource Introduction Timeline

1. **Ore** - Minute 0 (starting resource)
2. **Energy** - Minute 1-2 (via Refinery converter)
3. **Data** - Minute 3-4 (via Data Processor converter)
4. **Science** - Minute 7-10 (via Science Lab multi-input)
5. **Biomass** - Minute 10-13 (via Biomass Cultivator converter)
6. **Nanites** - Minute 15-18 (via Nanite Assembler multi-input)

All resources introduced through converters/consumers before pure generators unlock!

---

## Chain Bonus Impact Analysis

**Pre-Chain Bonus (Unlocks 1-3)**:
- Only converter boost active (+20%)
- Placement matters but not dramatically
- Learning phase

**Post-Chain Bonus (Unlocks 4+)**:
- Base +10% per connection
- Stacks with converter boost (multiplicative)
- Example 3-card chain: +20% conv × +32% chain = +58% total boost
- Placement becomes critical strategic decision

**Late Game with Enhancers (Unlock 9+)**:
- Harmonic Resonator adds +5% in radius
- Total possible: +20% conv × +37% chain × +5% harmony = ~70% boost
- Wonder players maximize this
- Dread players may ignore for raw output

---

## Wonder vs. Dread Tracking

**Implicit Signals Collected**:

**Wonder Indicators**:
- Unlocking cross-resource converters (Matter Converter, Nanite Assembler)
- Placing cards for long chains (>3 cards)
- Unlocking chain enhancers (Harmonic Resonator)
- Using diverse resource types
- Upgrading converters over pure generators

**Dread Indicators**:
- Unlocking pure generators (Advanced Reactor, Rift Extractor)
- Maximizing single resource output
- Isolating high-efficiency cards (avoiding connections for purity)
- Choosing aggressive extractors over balanced converters
- Specialization over diversification

**Tracking Threshold**:
- By Unlock 12, player likely has 60%+ alignment
- Ready for reveal at next major milestone (unlock 15-20)

---

## Implementation Notes

**GameState Extensions Needed**:
```javascript
gameState.unlockedCards = []; // Track which cards are unlocked
gameState.availableUnlocks = []; // Ghost cards currently shown
gameState.unlockMilestones = {
  chainBonusUnlocked: false, // Triggers at unlock 4
  wonderDreadTracking: { wonder: 0, dread: 0 } // Tracks alignment
};
```

**Ghost Card System**:
- After each unlock, call `updateGhostVista()`
- Shows 2-3 next unlocks based on current progression
- Ghosts appear in strategic grid positions (adjacent to relevant cards)

**Cost Escalation Formula**:
```javascript
// Base costs follow this pattern
const unlockCosts = {
  1: { ore: 25 },
  2: { ore: 60 },
  3: { ore: 80, energy: 10 },
  4: { ore: 100, energy: 20, data: 10 },
  // Escalates ~40-60% per unlock
  // Multi-resource costs after unlock 3
};
```

---

## Playtesting Checkpoints

**After Unlock 3 (5-7 min)**:
- ✓ Players understand converters
- ✓ Players see 3 resource types
- ✓ Ghost placement makes sense
- ✓ Converter boost is visible

**After Unlock 4 (7-10 min)**:
- ✓ Chain bonus discovery feels impactful
- ✓ Players immediately rearrange cards
- ✓ Multi-input cards are understandable
- ✓ Players see value in connections

**After Unlock 6 (12-15 min)**:
- ✓ Players have strategic choices
- ✓ Wonder/Dread options are visible
- ✓ All 5 basic resources introduced
- ✓ Placement strategy is developed

**After Unlock 12 (25-30 min)**:
- ✓ Full strategic freedom
- ✓ Alignment pattern is clear
- ✓ Players experimenting with builds
- ✓ Ready for mid-game content

---

## Next Steps

1. Create card configurations in `cardConfigs.js` for new cards
2. Implement unlock economy in `GameState`
3. Build ghost card UI system
4. Test unlock timing with playtesting
5. Adjust costs based on feedback
6. Validate Wonder/Dread tracking signals
