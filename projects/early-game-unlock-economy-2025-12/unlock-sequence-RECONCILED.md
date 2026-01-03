# Tier Unlock Progression - First 30 Minutes

**Date**: 2025-12-25 (Reconciled)
**Project**: Early Game Unlock Economy
**Purpose**: Defines tier-based unlock progression for the 8 singleton card system

---

## Design Decisions Applied

Based on reconciliation (2025-12-25):

1. **Pure Singleton System**: 8 core cards that evolve through tiers (not card collection)
2. **Tier-Unlock Progression**: Players unlock cards at T0, then unlock tier upgrades
3. **Metal Resource**: Second resource after Ore (Processor produces Metal, not Energy)
4. **Chain Bonus Discovery**: Triggers when player creates first 3-card chain (organic)
5. **Starting Config**: Extractor T0 only (Storage unlockable)
6. **6 Resources**: Ore → Metal → Energy → Data → Science → Xeno-Bloom → Flux-Shard
7. **No Ghost Vista**: Deferred to Phase 3+ (simple upgrade menu for now)
8. **Wonder/Dread**: No tracking until T3 (neutral progression)

---

## Starting State

### Player Starts With

**On Grid**:
- **Extractor T0** (Proton Cutter) - placed at grid center (5,5)
  - Manual clicking only (+1 ore per click)
  - No automation yet (unlocks at T1)

**Resources**:
- 0 Ore
- Default storage cap: 100 Ore

**UI State**:
- Grid viewport: 5×4 visible (of 10×10 total)
- Global resource panel shows: Ore (0/100)
- Upgrade menu shows: 7 locked card slots + 1 Extractor upgrade path

---

## Phase 1: Unlocking the 8 Core Cards (Tier 0)

Goal: Unlock all 8 cards at Tier 0, learn basic mechanics.

---

### Unlock 1: Processor Card (T0) - "Basic Smelter"

**Timing**: ~1-2 minutes (50 ore via manual clicking)

**Cost**: 50 Ore

**Card Stats (T0)**:
- **Type**: Converter
- **I/O**: Ore input → Metal output
- **Production**: Manual only (click "REFINE" to convert 5 ore → 2 metal)
- **Capacity**: Holds 20 metal (local buffer)

**What Player Learns**:
- Second resource type introduced: **Metal**
- Converters transform resources
- Manual batch processing (not auto yet)

**Visual Feedback**:
- Metal counter appears in global resource panel (0/100)
- I/O indicators show Ore input required

**Placement Strategy**:
- Place adjacent to Extractor (teaches spatial relationships)
- No chain bonus yet (pre-discovery)

---

### Unlock 2: Reactor Card (T0) - "Fuel Cell"

**Timing**: ~2-3 minutes total (100 ore + 30 metal)

**Cost**: 100 Ore + 30 Metal (first multi-resource cost!)

**Card Stats (T0)**:
- **Type**: Generator
- **I/O**: No inputs → Energy output
- **Production**: Manual only (click "IGNITE" to burn 2 ore → 5 energy)
- **Note**: Burns ore as fuel (consumes from storage)

**What Player Learns**:
- Third resource type: **Energy**
- Multi-resource unlock costs
- Pure generators exist (no inputs required, but uses fuel)

**Visual Feedback**:
- Energy counter appears (0/100)
- Ore consumption shown when generating

**Placement Strategy**:
- Can place anywhere (doesn't need adjacency)
- May place near future energy consumers

---

### Unlock 3: Storage Card (T0) - "Cargo Bay"

**Timing**: ~4-5 minutes (150 ore + 40 metal)

**Cost**: 150 Ore + 40 Metal

**Card Stats (T0)**:
- **Type**: Utility (Passive)
- **I/O**: None (passive capacity bonus)
- **Effect**: +1,000 capacity for ALL resources
- **Production**: N/A

**What Player Learns**:
- Storage caps exist and can be expanded
- Utility cards provide passive benefits
- Not all cards produce resources

**Visual Feedback**:
- Resource caps update: Ore (X/1100), Metal (X/1100), Energy (X/1100)

**Placement Strategy**:
- Chain bonus still not discovered
- But placing near Processor/Extractor creates I/O visual feedback

---

### Unlock 4: Sensor Card (T0) - "Ore Scanner"

**Timing**: ~5-7 minutes (120 ore + 50 metal + 25 energy)

**Cost**: 120 Ore + 50 Metal + 25 Energy

**Card Stats (T0)**:
- **Type**: Converter
- **I/O**: Energy input → Data output
- **Production**: Manual only (click "SCAN" to convert 5 energy → 2 data)

**What Player Learns**:
- Fourth resource type: **Data**
- Energy has multiple uses (fuel for Sensor, fuel for Reactor)

**Visual Feedback**:
- Data counter appears (0/100)

**Placement Strategy**:
- May place near Reactor (energy supplier)

---

## MILESTONE: Chain Synergy Discovery

**Trigger**: Player creates first 3-card chain

**Example Chain**:
```
[Extractor] → [Processor] → [Storage]
```

**Requirements**:
- 3 cards placed on grid
- Connected via adjacency (N/S/E/W)
- I/O compatibility (output → input matches)

**Discovery Event**:
```
⚡ CHAIN SYNERGY DISCOVERED!

Connected cards gain +10% output per connection.

Your network is becoming more than the sum of its parts...

+25 Science (bonus reward)
```

**Immediate Effect**:
- All placed cards gain chain bonus retroactively
- I/O connection indicators pulse between cards
- Production rates immediately increase

**Example Boost**:
```
[Extractor] → [Processor] → [Storage]

Extractor: 2 connections (Processor + Storage) = +20%
Processor: 2 connections (Extractor + Storage) = +20%
  + Converter completion bonus: +10%
  Total: +30% for Processor
Storage: 1 connection (Processor) = +10%
```

**Strategic Impact**:
- Player immediately sees value of adjacency
- Encourages replanning grid layout
- Sets up for Lab unlock (needs resources)

---

### Unlock 5: Lab Card (T0) - "Research Station"

**Timing**: ~7-10 minutes (150 ore + 50 metal + 30 energy + 20 data)

**Cost**: 150 Ore + 50 Metal + 30 Energy + 20 Data

**Card Stats (T0)**:
- **Type**: Multi-Input Converter
- **I/O**: Data input + Energy input → Science output
- **Production**: Manual only (click "RESEARCH" - requires 3 data + 3 energy → 1 science)

**What Player Learns**:
- Fifth resource type: **Science**
- Multi-input cards require optimization
- Science used for tier upgrades

**Visual Feedback**:
- Science counter appears (0/100)
- Dual-input indicators show Data AND Energy required

**Placement Strategy**:
- Ideally between Sensor (data supplier) and Reactor (energy supplier)
- Converter completion bonus if connected to both

**Science Bootstrap**:
- Player manually researches to generate initial science
- Needed for T0→T1 upgrades starting next phase

---

### Unlock 6: Habitat Card (T0) - "Crew Quarters"

**Timing**: ~10-12 minutes (180 ore + 60 metal + 40 energy)

**Cost**: 180 Ore + 60 Metal + 40 Energy

**Card Stats (T0)**:
- **Type**: Converter
- **I/O**: Energy input → Xeno-Bloom output
- **Production**: Manual only (click "CULTIVATE" - 5 energy → 2 xeno-bloom)

**What Player Learns**:
- Sixth resource type: **Xeno-Bloom**
- Energy bottleneck (multiple energy consumers)
- Life support/crew systems exist

**Visual Feedback**:
- Xeno-Bloom counter appears (0/100)

---

### Unlock 7: Engine Card (T0) - "Ion Thruster"

**Timing**: ~12-15 minutes (200 ore + 80 metal + 50 energy + 30 data)

**Cost**: 200 Ore + 80 Metal + 50 Energy + 30 Data

**Card Stats (T0)**:
- **Type**: Multi-Input Converter
- **I/O**: Metal input + Energy input → Flux-Shard output
- **Production**: Manual only (click "FABRICATE" - 3 metal + 2 energy → 1 nanite)

**What Player Learns**:
- Seventh and final basic resource: **Flux-Shard**
- Advanced construction resource
- All 8 cards now unlocked!

**Visual Feedback**:
- Flux-Shard counter appears (0/100)
- "All cards unlocked!" achievement notification

---

## Phase 2: Unlocking Tier 1 Automation (15-30 Minutes)

Goal: Upgrade all 8 cards from T0 → T1 to unlock automation.

**Key Change**: At Tier 1, ALL cards auto-produce. No more manual clicking required (though manual still gives bonus).

---

### First T1 Upgrade: Extractor T0→T1

**Timing**: ~15-18 minutes

**Cost**: 50 Ore (Note: Science not required for Extractor T1)

**Upgrade Changes**:
- **Name**: Proton Cutter → **Servo Drill**
- **Production**: Manual only → **Auto-mines 1.0 ore/sec**
- **Visual**: Card upgrades with new art, glowing border

**What Player Learns**:
- Automation unlocks at Tier 1
- Production becomes passive
- Manual clicks still work (+1 ore bonus per click)

**Achievement**: "First Automation" → +10 Science bonus

---

### Subsequent T1 Upgrades (Unlocks 9-15)

Players choose upgrade order based on bottlenecks. Typical order:

| Priority | Card | Cost | Reason |
|----------|------|------|--------|
| 1 | **Processor** | 75 ore, 20 metal | Automates metal production |
| 2 | **Reactor** | 100 ore, 30 metal | Automates energy generation |
| 3 | **Sensor** | 120 ore, 40 metal, 25 energy | Automates data production |
| 4 | **Lab** | 150 ore, 50 metal, 30 energy, 20 data | Auto-science critical for future upgrades |
| 5 | **Habitat** | 180 ore, 60 metal, 40 energy | Auto-xeno-bloom |
| 6 | **Storage** | 200 ore, 80 metal, 50 energy | 2x capacity (2,000 cap) |
| 7 | **Engine** | 250 ore, 100 metal, 60 energy, 30 data, 20 science | Auto-flux-shard (endgame resource) |

**Production Rates (T1)**:
- Extractor: 1.0 ore/sec
- Processor: 0.4 metal/sec (consumes 1.0 ore/sec)
- Reactor: 0.8 energy/sec (burns 0.5 ore/sec)
- Sensor: 0.3 data/sec (consumes 1.0 energy/sec) + 0.1 science/sec passive
- Lab: 0.2 science/sec (consumes 0.5 data/sec + 0.5 energy/sec)
- Habitat: 0.3 xeno-bloom/sec (consumes 1.0 energy/sec)
- Engine: 0.15 flux-shard/sec (consumes 0.5 metal/sec + 0.3 energy/sec)

**Time Estimate**: All 8 cards at T1 by ~25-30 minutes (active play with chain bonuses)

**Achievement**: "Full Automation" → +50 Science bonus

---

## Progression Summary Table

| Time | Unlock # | Type | Card/Upgrade | Cost | Resources Introduced |
|------|----------|------|--------------|------|---------------------|
| 0:00 | 0 | Starting | Extractor T0 | FREE | Ore |
| 1-2m | 1 | Card Unlock | Processor T0 | 50 ore | Metal |
| 2-3m | 2 | Card Unlock | Reactor T0 | 100 ore, 30 metal | Energy |
| 4-5m | 3 | Card Unlock | Storage T0 | 150 ore, 40 metal | - |
| 5-7m | 4 | Card Unlock | Sensor T0 | 120 ore, 50 metal, 25 energy | Data |
| ~7m | MILESTONE | Discovery | Chain Synergy | (automatic) | +25 Science |
| 7-10m | 5 | Card Unlock | Lab T0 | 150 ore, 50 metal, 30 energy, 20 data | Science |
| 10-12m | 6 | Card Unlock | Habitat T0 | 180 ore, 60 metal, 40 energy | Xeno-Bloom |
| 12-15m | 7 | Card Unlock | Engine T0 | 200 ore, 80 metal, 50 energy, 30 data | Flux-Shard |
| 15-18m | 8 | Tier Upgrade | Extractor T1 | 50 ore | Automation unlocked |
| 18-20m | 9 | Tier Upgrade | Processor T1 | 75 ore, 20 metal | Auto-metal |
| 20-22m | 10 | Tier Upgrade | Reactor T1 | 100 ore, 30 metal | Auto-energy |
| 22-24m | 11 | Tier Upgrade | Sensor T1 | 120 ore, 40 metal, 25 energy | Auto-data |
| 24-26m | 12 | Tier Upgrade | Lab T1 | 150 ore, 50 metal, 30 energy, 20 data | Auto-science |
| 26-28m | 13 | Tier Upgrade | Habitat T1 | 180 ore, 60 metal, 40 energy | Auto-xeno-bloom |
| 28-30m | 14 | Tier Upgrade | Storage T1 | 200 ore, 80 metal, 50 energy | 2x capacity |
| 30+m | 15 | Tier Upgrade | Engine T1 | 250 ore, 100 metal, 60 energy, 30 data, 20 science | Auto-flux-shard |

---

## Resource Introduction Flow

```
Phase 1: Card Unlocks (T0)
  0m: Ore (Extractor T0 - manual)
  1m: Metal (Processor T0 - manual convert)
  3m: Energy (Reactor T0 - manual burn ore)
  5m: Data (Sensor T0 - manual scan)
  7m: Science (Lab T0 - manual research)
  10m: Xeno-Bloom (Habitat T0 - manual cultivate)
  12m: Flux-Shard (Engine T0 - manual fabricate)

Phase 2: Automation (T1)
  15m+: All resources auto-generate
  Compound production begins
  Economy transitions from manual → idle
```

---

## Chain Bonus Impact

**Pre-Discovery** (0-7 minutes):
- Visual I/O indicators only
- No production bonuses
- Learning phase

**Post-Discovery** (7+ minutes):
- +10% per connection (N/S/E/W)
- Converter completion bonus (+10% when connected to input AND output)
- Example 3-card chain: +20-30% total boost
- Strategic placement becomes critical

**With T1 Automation** (15+ minutes):
- Chain bonuses amplify automatic production
- Optimization puzzle: maximize connections vs. specialized placement
- Wonder (dense networks) vs. Dread (isolated efficiency) strategies emerge naturally

---

## Playtesting Validation Checkpoints

**After 5 minutes**:
- ✓ Player has unlocked 3-4 cards
- ✓ Understands converters (Processor, Sensor)
- ✓ Has 3 resource types (Ore, Metal, Energy/Data)

**After 10 minutes**:
- ✓ Chain bonus discovered (feels impactful)
- ✓ Player has 5-6 cards unlocked
- ✓ Science production started (Lab manual clicks)

**After 15 minutes**:
- ✓ All 8 cards unlocked at T0
- ✓ First T1 automation unlocked (Extractor)
- ✓ Production rates visible, economy understood

**After 30 minutes**:
- ✓ Most/all cards at T1 (full automation)
- ✓ Compound production working
- ✓ Player ready for T2 progression (not covered in this doc)

---

## Implementation Notes

### GameState Extensions

```javascript
gameState.cards = {
  extractor: { tier: 0, placed: true, gridPos: {x: 5, y: 5} },
  processor: { tier: 0, placed: false, unlocked: false },
  // ... other 6 cards
};

gameState.resources = {
  ore: 0,
  metal: 0,
  energy: 0,
  data: 0,
  science: 0,
  xenoBloom: 0,
  fluxShard: 0
};

gameState.unlockMilestones = {
  chainBonusDiscovered: false,
  firstAutomation: false,
  allCardsUnlocked: false,
  allCardsT1: false
};
```

### Unlock Validation

```javascript
function canUnlockCard(cardName) {
  const cost = CARD_UNLOCK_COSTS[cardName];
  return gameState.resources.ore >= cost.ore &&
         gameState.resources.metal >= (cost.metal || 0) &&
         // ... check all resources
}

function unlockCard(cardName) {
  // Deduct resources
  // Set gameState.cards[cardName].unlocked = true
  // Show placement UI
  // Trigger tutorial/tooltip
}
```

### Chain Bonus Detection

```javascript
function detectFirstChain() {
  const chains = findAllChains(gameState.cards);
  const firstThreeCardChain = chains.find(chain => chain.length >= 3);

  if (firstThreeCardChain && !gameState.unlockMilestones.chainBonusDiscovered) {
    triggerChainDiscoveryEvent();
    gameState.unlockMilestones.chainBonusDiscovered = true;
    gameState.resources.science += 25; // Bonus reward
  }
}
```

---

## Next Steps

**After First 30 Minutes** (not covered in this doc):
1. **Tier 2 Progression**: Efficiency upgrades (~10x cost scaling)
2. **Resource Optimization**: Balancing production chains
3. **Grid Expansion**: Using full 10×10 grid strategically
4. **Tier 3 Fork**: Wonder vs. Dread upgrade path choices (40-60 min mark)

See `UPGRADE_COSTS.md` for full tier progression costs.

---

**End of Tier Unlock Progression Document**

*This replaces the original unlock-sequence.md (card collection model)*
