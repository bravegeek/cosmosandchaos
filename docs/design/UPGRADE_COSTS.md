# Upgrade Costs - Canonical Reference

**Last Updated:** 2025-12-25
**Status:** Reconciled Design

---

## Overview

This document defines the canonical upgrade costs for all 8 core card slots across all tier progressions (T0 → T1 → T2 → T3A/B → T4 → T5).

**Design Principles**:
1. **10x scaling per tier** (exponential idle game standard)
2. **Multi-resource costs increase with tier** (T1: 2-3 types, T2: 4-5 types, T3: 5-6 types)
3. **Time estimates** based on production rates (manual → automation → compound)
4. **Path signaling at T3** (Wonder uses Science+Xeno-Bloom, Dread uses Flux-Shard+Energy)

---

## Starting State (Tier 0)

### Starting Configuration

**On Grid**:
- Extractor T0 (Proton Cutter) - placed at grid center

**Available Resources**:
- Default storage cap: 100 Ore (increases with Storage card)

**Manual Production**:
- Ore: +1 per click on Extractor

---

## Tier 0 → Tier 1 Upgrade Costs (Automation Unlocks)

All cards unlock automation at Tier 1. Manual clicking still works but is no longer required.

| Card Slot | Ore | Metal | Energy | Data | Science | Xeno-Bloom | Flux-Shard | Time Est. |
|-----------|-----|-------|--------|------|---------|---------|---------|-----------|
| **Extractor** | 50 | - | - | - | - | - | - | 2 min |
| **Processor** | 75 | 20 | - | - | - | - | - | 4 min |
| **Reactor** | 100 | 30 | - | - | - | - | - | 5 min |
| **Sensor** | 120 | 40 | 25 | - | - | - | - | 7 min |
| **Lab** | 150 | 50 | 30 | 20 | - | - | - | 10 min |
| **Habitat** | 180 | 60 | 40 | - | - | 30 | - | 12 min |
| **Storage** | 200 | 80 | 50 | - | - | - | - | 14 min |
| **Engine** | 250 | 100 | 60 | 30 | 20 | 40 | - | 18 min |

### Tier 1 Production Rates (Auto-Generation)

After unlocking Tier 1, cards produce automatically:

| Card | Production Rate | Notes |
|------|----------------|-------|
| Extractor T1 | 1.0 ore/sec | Base generator |
| Processor T1 | 0.4 metal/sec | Consumes 1.0 ore/sec |
| Reactor T1 | 0.8 energy/sec | Burns ore (0.5 ore/sec) |
| Sensor T1 | 0.3 data/sec | Consumes 1.0 energy/sec |
| Lab T1 | 0.2 science/sec | Consumes 0.5 data/sec + 0.5 energy/sec |
| Habitat T1 | 0.3 xeno-bloom/sec | Consumes 1.0 energy/sec |
| Storage T1 | Passive | 2x capacity (2000 → storage cap) |
| Engine T1 | 0.15 flux-shard/sec | Consumes 0.5 metal/sec + 0.3 energy/sec |

**Note**: Lab T1 also unlocks Science. Sensor T1+ generates +0.1 science/sec as passive byproduct.

---

## Tier 1 → Tier 2 Upgrade Costs (Efficiency Improvements)

**~10x cost scaling** from Tier 1 unlock costs.

| Card Slot | Ore | Metal | Energy | Data | Science | Xeno-Bloom | Flux-Shard | Time Est. |
|-----------|-----|-------|--------|------|---------|---------|---------|-----------|
| **Extractor** | 500 | 200 | 100 | - | 50 | - | - | ~30 min |
| **Processor** | 750 | 300 | 150 | 50 | 75 | - | - | ~45 min |
| **Reactor** | 1000 | 400 | 200 | - | 100 | - | - | ~60 min |
| **Sensor** | 1200 | 500 | 250 | 100 | 150 | - | 50 | ~75 min |
| **Lab** | 1500 | 600 | 300 | 200 | 200 | - | 75 | ~90 min |
| **Habitat** | 1800 | 700 | 400 | - | 150 | 300 | 100 | ~105 min |
| **Storage** | 2000 | 800 | 500 | - | 200 | - | 150 | ~120 min |
| **Engine** | 2500 | 1000 | 600 | 300 | 250 | 400 | 200 | ~150 min |

### Tier 2 Production Rates

Tier 2 cards produce **~2-3x** faster than Tier 1:

| Card | T2 Production Rate | Improvement |
|------|-------------------|-------------|
| Extractor T2 | 2.5 ore/sec | +150% |
| Processor T2 | 1.0 metal/sec | +150% |
| Reactor T2 | 2.0 energy/sec | +150% |
| Sensor T2 | 0.8 data/sec | +166% |
| Lab T2 | 0.6 science/sec | +200% |
| Habitat T2 | 0.8 xeno-bloom/sec | +166% |
| Storage T2 | 10,000 cap | +5x capacity |
| Engine T2 | 0.4 flux-shard/sec | +166% |

---

## Tier 2 → Tier 3 Fork Costs (Wonder vs Dread)

**The Fork**: At Tier 3, each card splits into two upgrade paths. Player chooses Wonder (T3A) OR Dread (T3B).

**~10x cost scaling** from Tier 2 costs, plus path-specific resource requirements.

### Wonder Path (T3A) Costs

Wonder-leaning resources: **Science**, **Xeno-Bloom**, balanced resource usage.

| Card Slot | Wonder Variant | Ore | Metal | Energy | Data | Science | Xeno-Bloom | Flux-Shard |
|-----------|---------------|-----|-------|--------|------|---------|---------|---------|
| **Extractor** | Harmonic Siphon | 10K | 5K | 2K | - | 1K | 500 | - |
| **Processor** | Matter Weaver | 12K | 6K | 2.5K | 500 | 1.5K | - | 200 |
| **Storage** | Klein Bottle | 15K | 7K | 3K | - | 2K | - | 500 |
| **Reactor** | Zero-Point Prism | 18K | 8K | 3.5K | - | 2.5K | 1K | - |
| **Engine** | Gravity Sail | 20K | 9K | 4K | 1K | 3K | 1.5K | - |
| **Sensor** | Oracle Core | 22K | 10K | 4.5K | 2K | 3.5K | - | 800 |
| **Habitat** | Aquaponic Garden | 25K | 11K | 5K | - | 2K | 3K | - |
| **Lab** | Resonance Archive | 28K | 12K | 6K | 3K | 5K | 2K | 1K |

### Dread Path (T3B) Costs

Dread-leaning resources: **Flux-Shard**, **excess Energy**, aggressive resource usage.

| Card Slot | Dread Variant | Ore | Metal | Energy | Data | Science | Xeno-Bloom | Flux-Shard |
|-----------|--------------|-----|-------|--------|------|---------|---------|---------|
| **Extractor** | Rift Bore | 10K | 5K | 3K | - | 200 | - | 1K |
| **Processor** | Entropic Forge | 12K | 6K | 4K | - | 500 | - | 1.5K |
| **Storage** | Void Locker | 15K | 7K | 4.5K | - | 300 | - | 2K |
| **Reactor** | Entropy Furnace | 18K | 8K | 5K | - | 1K | - | 1K |
| **Engine** | Blink Drive | 20K | 9K | 6K | - | 1.5K | - | 2.5K |
| **Sensor** | Chaos Mapper | 22K | 10K | 6.5K | 1K | 800 | - | 3K |
| **Habitat** | Neural Dampener | 25K | 11K | 7K | - | 500 | 500 | 2K |
| **Lab** | Vivisection Chamber | 28K | 12K | 8K | - | 2K | - | 4K |

### Tier 3 Production Rates

Tier 3 cards produce **~3-5x** faster than Tier 2, with unique mechanics:

**Wonder Path (T3A)**:
- Harmonic bonuses (stacks with chain bonus)
- Area-of-effect benefits (+5% to nearby cards)
- Sustainable/efficient production

**Dread Path (T3B)**:
- Massive raw output (+200-300% over Wonder)
- Generates Dissonance as byproduct
- Consumes additional resources or creates penalties

---

## Tier 3 → Tier 4 Costs (Endgame Specialization)

**~100x cost scaling** from base Tier 3 costs. Requires significant production infrastructure.

| Card Slot | Ore | Metal | Energy | Data | Science | Xeno-Bloom | Flux-Shard |
|-----------|-----|-------|--------|------|---------|---------|---------|
| **Extractor** | 1M | 500K | 200K | - | 100K | 50K | 50K |
| **Processor** | 1.2M | 600K | 250K | 50K | 150K | - | 100K |
| **Storage** | 1.5M | 700K | 300K | - | 200K | - | 150K |
| **Reactor** | 1.8M | 800K | 350K | - | 250K | 100K | 100K |
| **Engine** | 2M | 900K | 400K | 100K | 300K | 150K | 200K |
| **Sensor** | 2.2M | 1M | 450K | 200K | 350K | - | 250K |
| **Habitat** | 2.5M | 1.1M | 500K | - | 400K | 500K | 150K |
| **Lab** | 2.8M | 1.2M | 600K | 300K | 500K | 200K | 300K |

**Note**: Tier 4 may have different variants per Wonder/Dread path. Costs TBD based on specific card abilities.

---

## Tier 4 → Tier 5 Costs (Victory Paths)

Tier 5 represents endgame victory conditions. Costs are massive, designed for late-game compound production.

**Estimated Costs** (per victory path):
- **Wonder Victory (World-Seeding Protocol)**: ~10M ore, ~5M metal, ~2M energy, ~1M science, ~500K xeno-bloom
- **Dread Victory (Autonomous Scaling Protocol)**: ~10M ore, ~5M metal, ~3M energy, ~2M flux-shard
- **Witness Victory (Apotheosis Engine)**: Requires BOTH Wonder + Dread paths, ~20M total resources

---

## Cost Scaling Formula

For reference, the cost scaling follows this pattern:

```javascript
// Base formula
tierCost = baseCost × (10 ** tier)

// Example: Extractor ore cost
T0 starting: FREE (on grid)
T0→T1: 50 ore
T1→T2: 500 ore (10x)
T2→T3: 10,000 ore (20x - fork premium)
T3→T4: 1,000,000 ore (100x - endgame jump)
T4→T5: ~10,000,000 ore (10x)

// Multi-resource costs increase per tier
T1: 1-2 resource types
T2: 2-4 resource types
T3: 4-6 resource types (path-dependent)
T4+: All 6 resource types required
```

---

## Time Estimates

Based on production rates with chain bonuses (~20-30% average boost):

| Tier Unlock | First Card | All 8 Cards | Notes |
|-------------|-----------|-------------|-------|
| **T0→T1** | 2-3 min | 20-25 min | Manual clicking → automation unlocks |
| **T1→T2** | 30-45 min | 2-3 hours | Building automation infrastructure |
| **T2→T3** | 3-5 hours | 8-12 hours | Mid-game optimization |
| **T3→T4** | 12-20 hours | 30-50 hours | Late-game compound production |
| **T4→T5** | 50-100 hours | N/A (single path) | Victory condition |

**Note**: Times assume active play with chain bonus optimization. Offline/idle time will extend these estimates.

---

## Special Notes

### Science Bootstrapping

Lab requires Science to upgrade, but produces Science. Bootstrap flow:
1. Unlock Lab at T0 (costs: 150 ore, 50 metal, 30 energy, 20 data)
2. Lab T0 has manual "RESEARCH" button (+1 science per click)
3. Manually generate ~10 science (no Science cost for T0→T1)
4. Upgrade Lab to T1 → auto-generates 0.3 science/sec
5. Sensor T1+ also generates +0.1 science/sec passively

### Storage Card

- T0: 1,000 capacity (all resources)
- T1: 2,000 capacity + filtered views
- T2: 10,000 capacity + smart organization
- T3A (Klein Bottle): Infinite capacity, bandwidth-limited retrieval
- T3B (Void Locker): Allows negative resources (debt system)

### Paradox Protocol (Witness Playstyle)

To unlock BOTH Wonder AND Dread paths at Tier 3:
- **Option A**: Unlock one full T4 tech elsewhere, then pay 1.0x cost (+10% Dissonance Floor)
- **Option B**: Pay 2.0x cost immediately (+50% Dissonance Spike)

---

**End of Upgrade Costs Reference**

*For implementation, see cardConfigs.js and tierUnlockManager.js*
