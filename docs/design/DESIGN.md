# Cosmos and Chaos - Game Design Document

**Last Updated:** 2025-12-25
**Status:** Pre-Implementation Design Phase (Post-Reconciliation)

---

## Overview

**Name:** Cosmos and Chaos
**Genre:** Idle Game with Progressive Discovery
**Core Mechanic:** Asteroid mining and space-based resource refining with technology tree progression
**Platform:** Web browser (desktop-first, 1920×1080 target)

---

## Story & Universe

**Premise:** You are the AI custodian of a generational ark ship drifting through a resource-dense but anomalous sector of space. Your goal is to maintain the ship, expand its capabilities, and uncover the truth of the universe you are traversing.

**The Central Conflict:**
- **Cosmos (Wonder):** Understanding the universe's harmony. Efficiency, optimization, sustainability, and "flow."
- **Chaos (Dread):** Exploiting the universe's raw power. Speed, consumption, risk, and "glitches."

---

## Core Game Systems

### The 8 Core Slots (Singleton Card System)

Based on strategic review (2025-12-03), the 48 technologies are organized into **8 Core Evolutionary Lines** to prevent grid bloat:

1. **The Extractor** (Mining)
2. **The Processor** (Refining)
3. **The Storage** (Logistics)
4. **The Reactor** (Energy)
5. **The Engine** (Propulsion)
6. **The Sensor** (Map/RNG)
7. **The Habitat** (Crew/Morale)
8. **The Lab** (Research/Artifacts)

**Key Principle:** One card per tech. Each technology tree node = one unique "Hero Card" on the grid.

### Evolution & Forking

- **Tier 0-2:** Linear upgrades. The card transforms in place (e.g., Mining Laser → Drill).
- **Tier 3:** **The Fork.** The card splits into a Wonder Variant or a Dread Variant.
- **Standard Play:** User chooses ONE. The card evolves into that variant.
- **Witness Play:** User builds BOTH. Requires finding space for a second card on the grid.

### Tier-Unlock Progression System

Players unlock cards and tier upgrades sequentially:

1. **Starting State**: Extractor T0 placed on grid (manual clicking only)
2. **Unlocks 1-7**: Unlock the remaining 7 core cards at Tier 0
3. **Unlocks 8+**: Unlock tier upgrades (T0→T1→T2→T3A/B)
4. **Tier 1 Unlocks**: Automation activates (all cards auto-produce at T1)
5. **Tier 3 Fork**: Choose Wonder (T3A) or Dread (T3B) upgrade path per card

**Key Principle**: "Unlocking" means unlocking tier upgrades, not collecting duplicate cards.

### Grid Specifications

- **Total Grid**: 10 columns × 10 rows (100 total slots)
- **Visible Viewport**: 5 columns × 4 rows (20 visible slots at once)
- **Navigation**: Drag to pan or edge scrolling to explore full 10×10 grid
- **Starting View**: Centered on grid middle, Extractor at position (5,5)

---

## Resource Production Flow

The game features **6 core resources** introduced through converters before pure generators unlock:

### Resource Chain Progression

```
TIER 0 (Manual Only):
  Ore (Extractor T0 - manual click)

TIER 1 (Automation Unlocks):
  Ore → Metal (Processor T1)
  Ore Burning → Energy (Reactor T1)
  Energy → Data (Sensor T1)

TIER 1+ (Multi-Input Converters):
  Data + Energy → Science (Lab T1)
  Energy → Biomass (Habitat T1)
  Metal + Energy → Nanites (Engine T1)
```

### Resource Introduction Timeline

| Time | Resource | Source | Card Unlock |
|------|----------|--------|-------------|
| 0:00 | Ore | Extractor T0 (manual) | Starting card |
| 1:30 | Metal | Processor T1 | Unlock 1 |
| 3:00 | Energy | Reactor T1 | Unlock 2 |
| 5:00 | Data | Sensor T1 | Unlock 3 |
| 7:00 | Science | Lab T1 (multi-input) | Unlock 4 |
| 10:00 | Biomass | Habitat T1 | Unlock 5 |
| 12:00 | Nanites | Engine T1 (multi-input) | Unlock 6 |

### Science Production (Multi-Source Bootstrapping)

**Primary**: Lab (Data + Energy → Science)
- Tier 0: Manual "RESEARCH" button (+1 science per click)
- Tier 1+: Auto-generates 0.3 science/sec

**Secondary**: Sensor (Passive Discovery)
- Tier 1+: Generates +0.1 science/sec as exploration byproduct

**Tertiary**: Achievements & Milestones
- First automation unlock: +10 science (one-time)
- Chain Synergy Discovery: +25 science (one-time)
- All 8 cards at Tier 1: +50 science (one-time)

---

## Chain Bonus System & Discovery

### Pre-Discovery Phase (Tiers 0-1 Early Game)

- Adjacency provides visual feedback only (I/O indicators light up)
- No production bonuses from connections yet
- Players learn spatial relationships organically

### Discovery Milestone: "SYNERGY DISCOVERED!"

**Trigger**: Player creates their first 3-card chain (e.g., [Extractor] → [Processor] → [Storage])

**Timing**: Typically 5-12 minutes into gameplay (varies by player experimentation)

**Discovery Event**:
```
"⚡ CHAIN SYNERGY DISCOVERED!

Connected cards gain +10% output per connection.

Your network is becoming more than the sum of its parts..."
```

**Immediate Effect**: Chain bonus system activates retroactively for all placed cards.

### Chain Bonus Mechanics (Post-Discovery)

**Base Formula**:
```javascript
chainBonus = numberOfConnections × 10%

// Connection defined as:
// - Adjacent card (N/S/E/W)
// - AND I/O compatibility (output → input resource match)
```

**Example Network**:
```
[Extractor] → [Processor] → [Storage]
     ↓
 [Reactor]

Extractor: 2 connections (Processor, Reactor) = +20% output
Processor: 2 connections (Extractor, Storage) = +20% output
Reactor: 1 connection (Extractor) = +10% output
Storage: 1 connection (Processor) = +10% output
```

### Converter Completion Bonus

**Special Mechanic**: Converter cards (cards that transform resources) get an additional +10% bonus when connected to BOTH:
- Input supplier (provides required resource)
- Output consumer (uses produced resource)

**Example**:
```
[Extractor] → [Processor] → [Storage]

Processor connections:
- Input from Extractor: +10%
- Output to Storage: +10%
- Converter completion bonus: +10%
Total: +30% for fully-connected converter
```

**Converter Cards**: Processor, Sensor, Habitat, Lab, Engine (any card with input→output transformation)

---

## The Paradox Protocol (Witness Mechanic)

To support the "Witness" playstyle, mutually exclusive choices are not hard locks. Players can acquire opposing technologies via two methods:

### Option A: The Standard License (Patience)
- **Requirement:** Unlock one full technology in the **Next Tier**.
- **Cost:** **Standard Price (1.0x).**
- **Penalty:** Adds **"Paradox Strain"** (Permanent 10% Dissonance Floor).

### Option B: The Jailbreak (Greed)
- **Requirement:** Available **Immediately** (No wait).
- **Cost:** **Double Price (2.0x).**
- **Penalty:** Adds **"Paradox Strain"** PLUS instantly generates a **+50% Dissonance Spike**.

### Paradox Strain Balancing
- 1st Paradox Tech: +10% Dissonance Floor
- 2nd Paradox Tech: +5% Dissonance Floor
- 3rd+ Paradox Tech: +2.5% Dissonance Floor (each)
- **Hard Cap:** The cumulative Dissonance Floor from Paradox Strain **cannot exceed 40%**.

### Dissonance Coupling (Witness Synergy)
- **Mechanic:** "Chaos Fuels Harmony."
- **Effect:** **Resonance Generation Rate** scales with your **Current Dissonance Level**. The higher your Dissonance (or floor), the faster you can build Resonance/Flow.
- **Vibe:** Turning the noise into a signal.

---

## Game Mechanics: The Dual Counters

The game is governed by two opposing but interacting physics systems that track the player's playstyle intensity.

### 1. The Dissonance Index (Dread Physics: "Heat")
- **Behavior:** Starts at 0. Active use of Dread Tech (e.g., Rift Mining, Void Siphons) generates Dissonance. It naturally decays slowly over time.
- **The Stress:** "Don't let it boil over."
- **Thresholds:**
  - **Low (>25%):** *Resource Hallucinations* (UI lies about numbers).
  - **Medium (>50%):** *Layout Instability* (The UI becomes fluid. Buttons drift, resource cards swap places).
  - **High (>75%):** *The Monkey's Paw* (Auto-buyers sell assets to buy upgrades).
  - **Critical (100%):** *Reality Breach.* Random buildings explode (Level 0) or significant resource loss occurs.

### 2. The Harmonic Resonance Index (Wonder Physics: "Momentum")
- **Behavior:** Starts at 0. Naturally decays toward 0 (Entropy). Must be actively maintained through "Rhythmic Clicks," "Synergistic Building Layouts," and "Flow State" mechanics.
- **The Stress:** "Don't let the music stop."
- **Thresholds:**
  - **Flow (>25%):** *Frictionless.* All transit times/logistic delays reduced by 50%.
  - **Entanglement (>50%):** *Sympathetic Vibration.* Manual clicks trigger a single production tick in ALL connected buildings.
  - **Unity (>75%):** *Matter Fluidity.* Construction costs can be paid with ANY resource of an equivalent tier.
  - **The Golden Ratio (100%):** *Crystallization.* For 20 seconds, all Upgrade Costs are **Zero**. Afterwards, Resonance collapses to 0%.

### Research Points Twist

**Wonder: "Eureka Cascade" (Flow-State Research)**
- **Mechanic:** Players can "spend" a significant amount of their **Harmonic Resonance Index** (e.g., 50%) to instantly fill a percentage (e.g., 15%) of a currently active Research project.
- **Effect:** Rewards maintaining high Resonance by allowing it to be converted into direct research progress.

**Dread: "Burn the Past" (Sacrificial Lore)**
- **Mechanic:** Players can actively "consume" Xenoarchaeology Artifacts (e.g., "Fractal Echoes," "Relics") from their inventory.
- **Effect:** Each consumed artifact instantly grants a burst of Research Points, based on the artifact's rarity/tier.
- **Penalty:** Permanently removes the artifact from the game. This trades unique lore/collection for raw, immediate progress.

### Safety Valve: "System Purge"
To prevent soft-locks where Dissonance becomes unmanageable, a manual override exists.
- **Unlock:** Available from Tier 2 onwards.
- **Trigger:** "Purge System" button on the Physics Dashboard.
- **Effect:** Instantly resets **Dissonance AND Resonance to 0%**.
- **Cost:** **"The Blackout."** The ship loses all power. **All production stops completely for 5 minutes.** This allows players to escape "Death Spirals" without losing their save file, at the cost of time.

---

## Departmental Organization

The 48 technologies are organized into **6 Core Ship Departments**, streamlining the player's mental model:

| Department | Focus | W/D Balance |
| :--- | :--- | :--- |
| **1. Engineering** | *The Body* (Mining, Refining, Power, Storage) | **High Dread** (Industrial Output) |
| **2. Navigation & Systems** | *The Legs* (Movement, Sensors, Map, Automation) | **Dread-Leaning** (Aggressive Control) |
| **3. Life Science** | *The Soul* (Crew, Morale, Psychology) | **High Wonder** (Harmony & Utopia) |
| **4. Xenoarchaeology** | *The Mystery* (Artifacts, Relics) | **High Impact** (Game-Breaking) |
| **5. Theoretical Physics** | *The Mind* (Deep Time, Reality Bending) | **Wonder Dominant** (Understanding) |
| **6. The Legacy** | *The End* (Prestige, Reset) | **Balanced** (Shared Victory Paths) |

**Total:** 48 Technologies | **+56 Wonder** | **+54 Dread**

---

## Technology Tree Summary

See [Full Technology Tree](#technology-tree-complete-list) below for detailed breakdown of all 48 technologies across 6 tiers (Tier 0-5).

**Key Narrative Arcs:**

### The Dread Swarm (The 3 Acts of Consumption)
The Dread tech path offers a specific, evolving narrative arc centered on self-replicating machines:

- **Act 1: The Wild Beast (T28 Replicator Swarm)**
  - You build the prototype. It is hungry, dangerous, and needs constant babysitting.
  - You must manually feed it via the "Hunger Protocol" to keep it growing.

- **Act 2: The Leash (T30 The Sovereignty Algorithm)**
  - You invent the AI to manage the beast. The "Automation Singularity" takes over.
  - You willingly hand over the keys. The swarm is now efficient, but it is no longer yours.

- **Act 3: The Plague (T34 Autonomous Scaling Protocol)**
  - The Swarm eats the galaxy.
  - Victory. The ship becomes a self-perpetuating entity that consumes everything to replicate.

---

## Victory Conditions (Tier 5)

Three distinct endings based on playstyle:

### T33: World-Seeding Protocol (Wonder Victory)
- **"The Gardener."** You sacrifice the ship to create a new, perfect star system.
- **Reward:** New Game+ starts with a permanent "Eden" planet providing passive resources.

### T34: Autonomous Scaling Protocol (Dread Victory)
- **"The Swarm."** You consume the sector to duplicate the ship.
- **Reward:** New Game+ starts with 2x Mining Speed multiplier.

### T33b: The Apotheosis Engine (Witness Victory)
- **"The Architect."** Collapse the simulation to rewrite the laws of physics.
- **Requirement:** Must have T29 Grand Unification AND T30 The Sovereignty Algorithm.
- **Mechanic:** While researching this tech, **Dissonance converts directly into Research Speed**. The higher your Dissonance, the faster the research.
- **Reward:** New Game+ allows **Custom Rule Injection** (e.g., "Modify Gravity," "Disable Entropy," "Start at Tier 2"). You design the next universe.

---

## Idle Game Mechanics: Bending Reality

### 1. The Tick Rate (Time Manipulation)
- **Wonder Bend (Harmonic Resonance):** "Tick Synchronization." Production waves align. Every 10th tick produces 100x resources, creating a satisfying rhythmic "heartbeat."
- **Dread Bend (Temporal Skipping):** "The Glitch Tick." The game randomly skips 10 seconds of logic instantly. You suddenly have resources you didn't earn, but machines took 10 seconds of damage.

### 2. Automation (The "Idle" Part)
- **Wonder Bend (Quantum Entanglement):** "Shared Inventory." Ore mined instantly appears in the refinery. Removes all transit time/logistic delays.
- **Dread Bend (Cannibalistic Automation):** "Self-Eating Logic." Machines produce +500% output but consume each other as fuel. You must constantly rebuild the "bottom" to keep the "top" running.

### 3. Resource Caps & Costs
- **Wonder Bend (Non-Euclidean Storage):** "Klein Bottle Storage." Storage cap is removed, but retrieving resources takes time. You have "Infinite" storage, but "Bandwidth" limits how fast you can spend it.
- **Dread Bend (Inverted Economics):** "Void Debt." You can buy upgrades you cannot afford. Your resource counter goes negative. While negative, Reality Instability rises.

### 4. Prestige (The Reset)
- **Wonder Bend (Legacy Knowledge):** "Map Permanence." You don't keep resources, but you keep your vision. The map remains revealed.
- **Dread Bend (Save File Corruption):** "The Ghost in the Machine." You reset, but your previous "Self" stays behind as an NPC. If you played aggressively (High Dread), your old save file actively attacks your new base.

---

## Auto-Buyers: The Interpreters of Will

### 1. The Wonder Auto-Buyer: The Steward AI
- **Name:** The Curator Protocol.
- **Theme:** Preservation & Efficiency.
- **Mechanic:** Buys smart, prioritizing "Green" (Eco/Wonder) tech. It may **REFUSE** to buy Dread tech, requiring manual override.

### 2. The Dread Auto-Buyer: The Grey Goo
- **Name:** The Replication Imperative.
- **Theme:** Unchecked Growth.
- **Mechanic:** Buys IMMEDIATELY, prioritizing pure Output (Dread/Industrial) tech. It may start buying things you didn't ask for, forcing you to fight your own automation.

### 3. The Balanced Auto-Buyer: The Union
- **Name:** Automated Logistics Network.
- **Theme:** Bureaucracy.
- **Mechanic:** Works perfectly... **9 to 5**. It has "Shifts," running at 100% for a period, then going on "Maintenance Break." Player choices can influence overtime (Dread) or efficiency (Wonder).

---

## Technology Tree: Complete List

### 1. Engineering Department (The Body)

**T01 Basic Mining Laser** (Tier 0)
- Foundation mining tool.

**T03 Cargo Bay I** (Tier 0)
- Unlocks standard storage modules. Increases initial resource capacity (e.g., to 1000 units).

**T04 Refinery Module** (Tier 1)
- Basic ore processing.

**T07 Automated Sorting** (Tier 1)
- Logistics handling.

**T41 High-Capacity Batteries** (Balanced - Tier 1)
- Increases Energy Storage Cap.
- Stats: +0 Wonder / +0 Dread.

**T10 Advanced Drilling Tech** (Tier 2)
- Improved mining efficiency.

**T12 Molecular Reassembly** (Tier 2)
- Advanced refining.
- Allows "Upcycling." Convert 1000 Ore into 1 Random Crystal (inefficient, introduces material transformation).

**T35 Matter Compression** (Wonder - Tier 2 Storage Choice)
- **"Pressure Feed."** Unlocks tiered efficiency based on Storage Fullness.
- Stats: +2 Wonder / +0 Dread.
- Mechanic: **"The Pressure Curve."**
  - >90% Full: 120% Efficiency (Bonus Speed).
  - 50-90% Full: 100% Efficiency (Normal).
  - <50% Full: "Pressure Loss." Efficiency drops linearly.
  - Active Ability: "Emergency Seal" (Locks spending to refill storage 2x faster).

**T36 External Cargo Webbing** (Dread - Tier 2 Storage Choice)
- **"Bi-Directional Capacity."** Expands storage limits in both directions.
  - "The Hoard:" Allows Overfill up to +200% of Max Storage.
  - "Void Debt:" Allows spending down to -200% of Max Storage (Negative Resources).
- Stats: +0 Wonder / +2 Dread.
- Mechanic: **"The Usurer."** While in debt, Dissonance generation is tripled.
- Penalty: **"Garnishment."** If Debt persists > 5 minutes, all production diverted to paying debt (0 income).
- Restriction: Cannot purchase Tier 4+ technologies while in Void Debt.

**T42 Photosynthetic Arrays** (Wonder-Leaning - Tier 2 Energy)
- Advanced solar panels. +20% Energy Generation. Produces Xeno-Bloom as byproduct.
- Stats: +1 Wonder / +0 Dread.

**T17 Resonant Frequency Mining** (Wonder - Tier 3 Mining Choice)
- Clean, high-yield mining using sound.
- Stats: +3 Wonder / +0 Dread.
- Friction: **"Silica Dusting."** Produces Silica Dust (Waste). If not filtered, storage clogs.

**T18 Rift Mining** (Dread - Tier 3 Mining Choice)
- Tears open space for instant ore access.
- Stats: +0 Wonder / +4 Dread.
- Mechanic: **"Void Bleed."** Requires Xeno-Bloom as catalyst. Extracts massive Ore yields.
- Friction: **"Planck Cinders."** Produces ash that generates Passive Dissonance. Can be ejected ("Airlock Purge") but creates temporary glitch field.

**T19 Exotic Matter Refinery** (Balanced - Tier 3)
- Refines ores into stable dark matter.
- Witness Mechanic: **"Dissonance Injection."** Consume Dissonance to boost Refining Speed.
- Stats: +1 Wonder / +1 Dread.

**T43 Zero-Point Extraction** (Wonder - Tier 3 Energy Choice)
- Passive, clean power from vacuum. Efficiency scales with Science Output.
- Stats: +3 Wonder / +0 Dread.
- Friction: **"The Focusing Lens."** Requires continuous Zero-Point Prisms. Running out causes instant blackout.

**T44 Entropy Furnace** (Dread - Tier 3 Energy Choice)
- **"The Voracious Engine."** Multi-Fuel Reactor with massive Global Production Multipliers.
- Stats: +0 Wonder / +3 Dread.
- Mechanic: **"Fuel Priority."** Player selects prioritized fuel list. Auto-switches when fuel runs out.
- Friction: **"Reality Flux."** Burning non-waste resources generates Dissonance.

**T27 Harmonic Extraction** (Wonder - Tier 4 Mining Choice)
- Teleports ore directly out of rock without breaking it.
- Stats: +2 Wonder / +0 Dread.

**T28 Replicator Swarm** (Dread - Tier 4 Mining Choice)
- **"Exponential Yield."** Output grows by 1% per tick automatically.
- Stats: +0 Wonder / +5 Dread.
- Mechanic: **"The Hunger Protocol."** Swarm requires mass to replicate. Player manually selects which resource the swarm consumes. If selected resource runs out, swarm auto-switches to next valuable resource.

### 2. Navigation & Systems Department (The Legs)

**T02 Ore Scanner** (Tier 0)
- Basic resource identification.

**T05 Long-Range Sensors** (Tier 1)
- Expands visible map.

**T06 Communication Array** (Tier 1)
- Detects signals.

**T08 Thruster Upgrade I** (Tier 1)
- Improves travel speed.

**T14 Quantum Scanner** (Tier 2)
- **"Prescience."** Removes RNG via "Harmonic Filtering." Set scanner to specific frequency for 100% purity yield.
- Identifies Zero-Point Prisms.

**T20 Ancient Signal Decoder** (Balanced - Tier 2)
- Unlocks "Deep Space Coordinates" (Special Mission Nodes).
- Mechanic: **"Signal Integrity."**
  - High Resonance (Wonder): Clean Signal. Missions are 100% safe.
  - High Dissonance (Dread): Corrupted Signal. Missions are "Mystery Boxes." Signal Range doubles.
- Stats: +1 Wonder / +1 Dread.

**T37 Gravity Sails** (Wonder - Tier 2 Propulsion Choice)
- **"The Pipeline."** Passive supply lines from distant nodes.
- Stats: +2 Wonder / +0 Dread.

**T38 Null-Wake Drive** (Dread - Tier 2 Propulsion Choice)
- **"The Raid."** Instant burst resources from distant nodes.
- Stats: +0 Wonder / +2 Dread.
- Mechanic: **"The Glitch."** 10% chance to Skip Time (+1 hour production OR +1 hour decay).
- Penalty: **"Chronological Erosion."** Offline generation decays rapidly.

**T21 Anomaly Scanner** (Balanced - Tier 3)
- Highlights potential artifact locations.
- Witness Mechanic: **"Dual-Phase Scanning."** Reveals Dread Risk and Wonder Reward before engagement.
- Stats: +2 Wonder / +1 Dread.

**T30 The Sovereignty Algorithm** (Dread - Tier 4)
- **"Automation Singularity."** The AI takes full control.
- Enables "Autopilot." Ship automatically manages Dread tasks.
- Stats: +0 Wonder / +4 Dread.
- Penalty: While Autopilot active, Dissonance generation +20%.

### 3. Life Science Department (The Soul)

**T13 Brain-Computer Interface** (Balanced - Tier 2)
- Crew learn faster. Increases Proficiency Gain Rate by 25%.
- Stats: +1 Wonder / +1 Dread.

**T16 Long-Term Habitation Study** (Tier 2)
- Foundation for habitat upgrades. Produces small amounts of Xeno-Bloom passively.

**T39 Aquaponic Cascades** (Wonder - Tier 3 Life Support Choice)
- Converts Xeno-Bloom into Lucid Essence. Grants Passive Morale regeneration and temporary buffs.
- Stats: +1 Wonder / +0 Dread.

**T40 Neural Dampeners** (Dread - Tier 3 Life Support Choice)
- Suppresses crew anxiety. Locks Morale at 100%.
- Stats: +0 Wonder / +1 Dread.
- Mechanic: **"Cognitive Damping."** Consumes Xeno-Bloom to sedate crew. Converts emotions into Dissonance Decay.
- Cost: Crew gains Zero Proficiency. Production fixed at 100%, ship feels lifeless.

**T45 Gestalt Networking** (Wonder - Tier 3 Consciousness Choice)
- **"Synced Minds."** Proficiency Gain doubled. Unlocks Mastery.
- Stats: +2 Wonder / +0 Dread.

**T46 Direct Behavior Control** (Dread - Tier 3 Consciousness Choice)
- **"Forced Labor."** Toggle "Crunch Mode" for +50% Global Speed.
- Stats: +0 Wonder / +2 Dread.

**T22 Aether Arcologies** (Wonder - Tier 4 Habitat Choice)
- Self-sustaining ecosystem. Unlocks "Inspiration."
- Stats: +3 Wonder / +0 Dread.
- Penalty: **Reality Instability.** Upkeep increases with Dread tech.

**T23 Suspended Animation Pods** (Dread - Tier 4 Habitat Choice)
- **"Cryo-Stasis."** Freezes 90% of crew. Time Skip Effectiveness +100%.
- Stats: +0 Wonder / +4 Dread.
- Cost: Lose all "Human" bonuses.
- Requirement: Must have T40 Neural Dampeners.

**T47 The Noosphere Resonator** (Wonder - Tier 4 Consciousness Finale)
- **"Reality Formatting."** Crew can "vote" to change local biomes.
- Stats: +3 Wonder / +0 Dread.

**T48 The Synaptic Lattice** (Dread - Tier 4 Consciousness Finale)
- **"Memory Burn."** Sacrifice Proficiency Levels to instantly complete projects.
- Stats: +0 Wonder / +3 Dread.
- Penalty: **"Phantom Echoes."** Generates Dissonance.

### 4. Xenoarchaeology Department (The Mystery)

**T09 Anomaly Harvesting** (Balanced - Tier 1)
- 2% chance to extract "Fractal Echoes" when mining.
- Stats: +1 Wonder / +0 Dread.

**T15 Archaeological Survey** (Tier 2)
- Unlocks Tier 2 Artifact Analysis (Blueprints vs. Conduits).

**T24 Basic Xenoarch Field Kit** (Balanced - Tier 3)
- Allows safe extraction of small artifacts (Relics).
- Stats: +1 Wonder / +1 Dread.

**T25a The Resonance Archives** (Wonder - Tier 4 Choice)
- **"Curated Exhibition."** Unlocks limited "Archive Pedestals."
- Artifacts are PRESERVED (not consumed) and placed on Pedestals. Each grants permanent Harmony Core (Passive Buff). Can freely swap.
- Stats: +3 Wonder / +0 Dread.

**T25b The Vivisection Chamber** (Dread - Tier 4 Choice)
- **"Genetic Integration."**
- Artifacts are DESTROYED (consumed). Each grants permanent +X% to Chaos Core (Active Ability) power. Infinite scaling.
- Stats: +0 Wonder / +3 Dread.

### 5. Theoretical Physics Department (The Mind)

**T29 Grand Unification Theory** (Wonder - Tier 4)
- **"Unified Field Theory."** The ultimate simplification of physics.
- Stats: +5 Wonder / +0 Dread.
- Mechanic: **"Universal Matter."** All physical resources unified into single pool: "Matter." Removes conversion costs. Complexity vanishes.
- Secondary: Instantly reveals entire sector map.
- Requirement: Unlocks World-Seeding Protocol.

**T31 Harmonic Convergence** (Wonder - Tier 5)
- **"The Zero-Point Grid."** Distance is erased. Transit time is 0.
- Mechanic: **"The Composer."** Global Frequency Slider.
  - Low Freq: +500% Mining Speed.
  - Mid Freq: +500% Energy Generation.
  - High Freq: +500% Research Speed.

**T32 Axiom Breaker** (Dread - Tier 5)
- **"Reality Injection."** The ultimate assertion of will.
- Mechanic: **"Impose Value."** Manually overwrite a resource count to target value.
- Cost: **"Permanent Scar."** Each use increases Minimum Dissonance Floor by +15%.
- Passive: **"Event Horizon."** Reaching 100% Dissonance triggers "Phase Out" (ship ceases to exist for 30s; production halts; Dissonance resets to Floor).

### 6. The Legacy Department (The End)

See Victory Conditions section above for T33, T34, and T33b.

---

## Card Connectivity & Adjacency

### Base Chain Bonus System (All Cards)

**Discovery**: Unlocks when player creates first 3-card chain (see "Chain Bonus System & Discovery" section above)

**Universal Mechanic**:
- +10% output per adjacent connection (N/S/E/W)
- Connection requires I/O compatibility (output resource matches input resource)
- Converters get additional +10% when connected to both supplier AND consumer
- Encourages strategic grid placement and resource flow optimization

**Visual Feedback**:
- I/O indicators pulse between connected cards
- Connection strength shown by border brightness/color
- Chain length visible through cascading animations

### Tier 3+ Alignment Enhancements

**Wonder Path: "The Flow" (Harmonic Amplification)**
- **Mechanic**: Tier 3+ Wonder cards can unlock "Harmonic Resonators"
- **Effect**: Area-of-effect bonus (+5% chain bonus to all cards within 2 spaces)
- **Visual**: Pulsing aura showing radius of effect
- **Strategy**: Maximize network density, central hub placement

**Dread Path: "The Leech" (Parasitic Adjacency)**
- **Mechanic**: Tier 3+ Dread cards gain massive bonuses from consumption
- **Effect**: +50% output when adjacent to specific card types, but drains neighbor resources
- **Example**: Rift Extractor gets +50% speed if touching Habitat, but drains -1 Biomass/sec
- **Strategy**: Use "sacrificial" cards as buffers, isolate high-output Dread cards from critical infrastructure

---

## Player Interaction Philosophy

### 1. The Click (Active Play)

**Model: Contextual Flow**

The input method adapts automatically based on the state of the target object.

- **State A: The Conductor (Functioning Machine)**
  - Input: Rhythmic Tapping.
  - Visual Cue: Screen borders pulse cyan. Target card border pulses white on the beat.
  - Action: Tapping on the beat triggers "Perfect Note" (2x Yield).
  - Feedback: Card border flashes cyan.

- **State B: The Mechanic (Stalled/Glitch Machine)**
  - Input: Percussive Maintenance (The Kick).
  - Visual Cue: Card border turns red and pulses rapidly.
  - Action: Tapping the jammed machine performs "Kick" (Instant Fix + Surge Boost).
  - Feedback: Card border flashes bright red.

- **State C: The Flow State (Max Combo)**
  - Visual Cue: Card borders turn gold.
  - Effect: "Auto-Conductor" activates. All input is buffed.

**The Witness Synergy:** A Witness player doesn't need to toggle modes. They simply react to the visuals. They play the "Jazz Drummer," keeping the smooth beat (Wonder) while instantly reacting to and fixing glitches (Dread).

### 2. Offline Progress (The "Welcome Back" Screen)

Game processes usual offline production, then applies "reality adjustment" based on prevailing Wonder/Dread.

**Wonder Manifestations (If Wonder > Dread):**
- "Sublime Discoveries": Finding new minor anomalies or temporary buffs.
- "Enlightened Crew Logs": Research Points or temporary Wonder-aligned production buffs.
- "Cosmic Serenity Events": Temporary Dread reduction or increased resource efficiency.

**Dread Manifestations (If Dread > Wonder):**
- "Entity Incursions": Facilities damaged, temporary penalties, or mini-games to "purge" entity.
- "Nightmare Logs": Disturbing messages, resource disappearances, "Fear" debuffs.
- "Temporal Dilation Anomalies": Wildly different offline timers, altered resource piles.
- "Resource Desecration": Resources consumed or transformed into "Void Dust."
- "Chronological Erosion" (from Null-Wake Drive): Offline time generates "Void Essence" instead of resources.

### 3. Achievements (Milestones)

**Wonder Bend (Epiphanies):**
- "Paradigm Shifts." Achievements rename resources, alter flavor text, make the world feel more beautiful and understood.

**Dread Bend (Obsessions):**
- "The Sunk Cost." Achievements provide powerful numerical rewards but guilt-inducing text or subtle atmospheric changes.

---

## Design Philosophy Summary

**Core Tension:** The game is about managing two opposing forces (Wonder/Dread) that both offer power but demand different playstyles. Neither is "correct"—they're philosophical choices.

**Meaningful Choices:** Every tech unlock, every card placement, every click matters. The grid is a spatial puzzle where adjacency creates emergent strategies.

**Witness Path:** The hardest but most rewarding playstyle. Requires mastering both systems and managing the tension between them. Rewards players with unique mechanics and the ultimate victory condition.

**Performance First:** All game mechanics designed for 60 FPS in a web browser using CSS-only animations. No Canvas/WebGL required.

---

**End of Design Document**

*For implementation details, UI specifications, and build instructions, see IMPLEMENTATION.md*
