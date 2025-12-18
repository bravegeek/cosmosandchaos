# Early Game Unlock Economy Design Session

**Date**: 2025-12-17
**Project**: Cosmos and Chaos - Early Game Mechanics Design
**Focus**: Starting cards, tech tree unlocks, progression pacing, and onboarding experience

---

## Session Summary

This brainstorming session used the CRI framework (Context, Role, Interview) to design the early game experience for Cosmos and Chaos. The session explored how players should start the game, how the unlock economy should work, and how to teach core systems while enabling emergent strategic depth.

### Key Achievement
Designed a comprehensive early game system that:
- Teaches core mechanics through spatial UI and converter chains
- Creates meaningful "desire vs. effort" tension through unlock/upgrade cost competition
- Enables emergent Wonder/Dread alignment through implicit upgrade choices
- Balances structured learning with strategic freedom through gradual blending

---

## Context

### Game Overview
Cosmos and Chaos is a hybrid active/idle card-based resource management game with:
- 5 resource types: Ore, Energy, Data, Biomass, Nanites
- Cards with tiers (0-3+) that produce/convert/consume resources
- I/O connection system (cards link via adjacency)
- Efficiency mechanics based on input resource availability
- Wonder vs. Dread thematic alignment system (planned)

### Current Implementation Status
- Phase 2 complete: Automatic resource production, status LEDs, I/O indicators, multi-resource tracking
- Phase 4 planned: Economy systems, tech tree, unlock mechanics, Wonder/Dread alignment
- **Design Gap Identified**: No card unlock economy exists yet - only upgrade costs

### Design Goals
1. Create engaging tutorial/onboarding that teaches core systems
2. Design long-term progression (early-to-mid game)
3. Enable emergent strategies through upgrade combinations
4. Implement "always see the carrot" philosophy (constant forward visibility)
5. Balance "desire vs. effort" tension (exploration vs. optimization)
6. Connect mechanical choices to Wonder/Dread thematic core

---

## Expert Role Adopted

**Hybrid Game Design Strategist + Systems Designer**

Combining:
- Progression expertise (unlock pacing, retention mechanics)
- Systems thinking (tech trees, economic balancing)
- Player psychology understanding (onboarding, meaningful choices)
- Mathematical game balance (cost curves, difficulty scaling)

This role was chosen to address both tutorial/onboarding AND long-term progression in an integrated way.

---

## Interview Insights

### Player Experience Vision
**Hybrid Active/Idle Gameplay Loop**
- Players actively build and optimize production chains
- Players return periodically to expand and make strategic decisions
- Sessions blend active engagement with passive accumulation
- Automation carries progress between sessions

**Emergent Strategies as Core Pillar**
- Players discover synergies through upgrade combination experimentation
- No single "correct" build path
- Metagame evolves as players find optimal or creative combinations
- Discovery and experimentation are primary engagement drivers

### Design Philosophy: "Always See the Carrot"
- Players should constantly see how the game gets more fun as they progress
- Future possibilities visible but gated (creates anticipation)
- Progression provides steady stream of "what's next" moments
- Visibility of future content drives desire to continue playing

### Design Philosophy: "Desire vs. Effort"
- Core tension: Players balance desire for exploration/domination with effort they want to expend
- Too easy = trivial, no tension; too hard = frustrating, feels grindy
- Sweet spot: "I can almost afford this, and I really want it"
- This tension connects directly to Wonder (exploration) vs. Dread (optimization) thematic

---

## Design Decisions

### 1. Unlock System Architecture

**Decision**: Hybrid System (Purchase-based early, Milestone-based later)

**Implementation**:
- Early unlocks (cards 1-6): Purchase-based for structure and teaching
- Later unlocks (cards 7+): Milestone-based for openness and experimentation
- Smooth transition rather than hard boundary

**Rationale**:
- Provides structured learning phase when players need guidance
- Opens up strategic freedom once players understand core systems
- Supports both "teaching" and "emergent strategy" goals

**Future Exploration**: Card Placement/Production-based unlocks
- Where placing specific cards or producing resources reveals related upgrades
- Could add organic discovery layer in later phases
- Marked for Phase 4+ consideration

---

### 2. UI Guidance Systems

**Decision**: Three-pronged spatial guidance approach

**A. Grayed-Out Upgrades**
- Locked upgrades visible in tech tree but unaffordable
- Shows costs and requirements clearly
- Creates anticipation ("I can almost afford that")
- Common pattern in idle games - proven effective

**B. Upgrade Alerts on Cards**
- When upgrade becomes available, glowing alert appears directly on the card
- Example: "Auto-miner available" alert on Ore Generator card
- Contextualizes improvements (players see WHAT can be improved)
- Reduces cognitive load (no menu hunting)

**C. Ghost Card Previews**
- New unlockable cards appear as "ghost" cards in adjacent grid squares
- Shows WHERE to place next unlock (teaches spatial relationships)
- Ghosts display unlock cost and requirements
- Position hints at I/O connections (ghost refinery next to ore generator)

**Innovation**: Ghost card system is novel - teaches through spatial positioning rather than text tutorials. This makes I/O connection learning implicit and intuitive.

---

### 3. Starting Card Configuration

**Decision**: Minimal Start (1 card) with spatial UI guidance

**Starting State**:
- Player begins with: 1 Ore Generator (Tier 0, manual clicking)
- Ghost cards appear showing first unlock options
- Upgrade alerts appear once affordable

**First Player Action**: Manual clicking to generate ore

**First Purchase Decision** (after ~30-40 ore accumulated):
- Ghost Refinery appears adjacent to Ore Generator (teaches placement)
- Cost displayed on ghost: 30 ore
- Player clicks ghost to unlock/place

**Rationale**:
- Absolute minimal cognitive load at start
- Immediate interaction (clicking feels good)
- Ghost system provides just-in-time guidance (not lost, not overwhelmed)
- First unlock teaches adjacency/connection immediately

---

### 4. Unlock Cost Economics

**Decision**: Escalating Unlock Costs competing with Upgrade Costs

**Cost Structure**:
```
Unlock #1 (Refinery): 25-30 ore
Unlock #2 (Energy Generator OR Data Processor): 60-80 ore
Unlock #3: 150-200 ore
...escalating pattern...

Card Upgrades (Tier 0 → Tier 1): 50-60 ore (consistent across cards)
```

**Economic Tension**:
- Early unlocks cheaper than upgrades (encourages initial expansion)
- Mid-tier unlocks competitive with upgrades (creates genuine choice)
- Later unlocks more expensive (requires strategic commitment)

**Rationale**:
- First unlock feels achievable quickly (teaches loop, builds confidence)
- Second unlock creates first real choice: "expand variety OR improve efficiency?"
- Escalating costs maintain "desire vs. effort" tension throughout
- Upgrade costs remain stable, providing consistent deepening option

**Connection to Design Philosophy**:
- "Always see the carrot": Grayed-out ghosts show what's coming, costs visible
- "Desire vs. effort": Can almost afford next unlock, creates pull forward
- Wonder vs. Dread: Unlocks = breadth (Wonder), Upgrades = depth (Dread)

---

### 5. Visibility & Information Architecture

**Decision**: Progressive Vista (Show 2-3 steps ahead dynamically)

**How It Works**:
- Player starts: Sees ghost for unlock #1 (Refinery)
- After unlocking Refinery: Ghosts appear for unlocks #2 AND #3 (Energy Generator + Data Processor)
- After unlocking one of those: Vista expands to show next 2-3 options
- Always seeing "what's next AND what's after that"

**Information Hierarchy**:
- **Available Now**: Full-color ghosts with affordable costs (can buy immediately)
- **Coming Soon**: Slightly faded ghosts with unaffordable costs (shows what to save for)
- **Locked Far Away**: Not visible yet (revealed when prerequisites met)

**Rationale**:
- Balances anticipation (see future possibilities) with focus (not overwhelmed)
- Creates planning opportunities ("Should I save for Data Hub or get Energy Gen first?")
- Supports emergent strategies (horizon expands, new combos become visible)
- Avoids overwhelming new players with entire tech tree at once

---

### 6. Resource Introduction Strategy

**Decision**: Converter-Driven Introduction

**Progression Flow**:
```
Start:     [Ore Generator] → manual clicking produces Ore

Unlock 1:  [Ore Generator] → [Refinery] → produces Energy from Ore
           (Teaches: conversion, I/O connections, second resource emerges)

Unlock 2:  [Ore Generator] → [Refinery] → [Data Processor] → produces Data
           (Teaches: chaining, multiple conversions, third resource)

Unlock 3:  [Reactor] - pure Energy generator (independent source)
           (Now: parallel production possible, strategic choice unlocked)

Unlock 4:  [Biomass Cultivator] - Data → Biomass converter
           (Fourth resource via conversion, extending chain thinking)

Unlock 5:  [Science Lab] - consumes Data + Energy → Science
           (Teaches: multi-input consumers, optimization of two resources)

Unlock 6+: Pure generators for Data, Biomass, Nanites become available
           (Strategic freedom: direct production OR conversion chains)
```

**Key Principle**: Resources introduced as conversion outputs BEFORE pure generators unlock.

**Teaching Sequence**:
1. **Minute 0-1**: Pure Ore (single resource, manual interaction)
2. **Minute 1-3**: Ore → Energy conversion (I/O connections, second resource)
3. **Minute 3-5**: Energy → Data conversion (chaining, third resource)
4. **Minute 5-10**: First pure generator unlocks (strategic choices emerge)
5. **Minute 10+**: Multi-input consumers, complex networks

**Why This Works**:
- **Teaches Through Emergence**: Energy doesn't appear arbitrary - player created it by building Refinery
- **Forces I/O Learning**: Can't progress without using adjacency/connections
- **Creates Efficiency Thinking**: Conversion chains create bottlenecks, players naturally optimize
- **Supports Emergent Strategy**: Multiple paths to same resource (pure generator vs. conversion chain)
- **Natural Pacing**: Complexity increases gradually, each unlock teaches one new concept

**Visual Teaching**:
- Ghost Refinery appears adjacent to Ore Generator (spatial hint)
- I/O indicators light up when connected (visual feedback)
- Efficiency LED shows green when working well (positive reinforcement)
- Resource counter appears first time resource is produced (discovery moment)

---

### 7. Strategic Opening & Progression Arc

**Decision**: Gradual Blending (No sharp transition from teaching to strategy)

**Progression Character**:
- **Unlocks 1-3**: Mostly converters (70% structured, 30% experimental)
- **Unlocks 4-6**: Mixed (50% converters/structured, 50% pure generators/synergies)
- **Unlocks 7-9**: Mostly experimental (30% structured, 70% strategic variety)
- **Unlocks 10+**: Full strategic freedom (equal mix, player-driven choices)

**How Variety Appears**:
- Early: Ghost vista shows "next in chain" plus occasional alternative
- Mid: Ghost vista shows multiple parallel options (converter OR pure generator)
- Late: Ghost vista shows synergy upgrades, multi-input cards, combo options

**Player Experience Arc**:
```
Minutes 0-3:   "I'm learning how this works" (following the path)
Minutes 3-7:   "I see what I could do differently" (seeing alternatives)
Minutes 7-15:  "I'm choosing my strategy" (planning my build)
Minutes 15+:   "I'm experimenting with combinations" (emergent play)
```

**Rationale**:
- No "tutorial prison" feeling (always some choice available)
- No "overwhelming complexity" (structured options remain throughout)
- Smooth transition feels natural, not gated
- Supports different player types (followers and explorers both accommodated)

---

### 8. Wonder vs. Dread Integration

**Decision**: Emergent Through Upgrade Choices (No explicit labels early)

**How It Works**:

**Implicit Upgrade Philosophy**:
Upgrades have inherent mechanical differences that align with Wonder or Dread:

**Wonder-Aligned Upgrades** (exploration, variety, discovery):
- "Unlock adjacent card types 20% faster"
- "Reveal additional ghost card options"
- "Gain bonus when using 3+ different resource types"
- "Cross-resource synergy: Data production +10% per unique resource produced"
- "New converter recipes unlocked"

**Dread-Aligned Upgrades** (efficiency, optimization, domination):
- "Single-resource production +40%"
- "Reduce unlock costs by 15%"
- "Double efficiency for this card only"
- "Specialized focus: Ore production +100%, all other resources -20%"
- "Maximize output when using single resource type"

**Player Experience**:
- No labels shown during early/mid game
- Players choose upgrades based on what feels rewarding to them
- Game tracks choices silently in background
- Much later (mid-to-late game): Reveal moment

**Reveal Moment** (example):
```
"Analysis Complete: Your production network favors exploration and diversity.
The path of Wonder calls to you..."

[Shows: 73% Wonder-aligned choices, 27% Dread-aligned choices]
[Unlocks: Wonder-specific upgrades and narrative content]
```

**Why This Approach**:
- Players discover their own playstyle organically
- No forced "choose your faction" moment that feels arbitrary
- "The game understands me" revelation is powerful emotional moment
- Supports emergent strategy goal (not telegraphing optimal paths)
- Allows players to shift alignment through future choices (not locked in)

**Implementation Considerations** (for Phase 4):
- Track ratio of Wonder vs. Dread upgrade purchases
- Threshold for "alignment established" (e.g., >60% of one type)
- Reveal triggers at natural story beat or milestone
- Alignment affects which advanced upgrades become available

---

### 9. Early Flow Bonuses (Adjacency Rewards)

**Decision**: Progressive Introduction of Adjacency Bonuses (Combination Approach)

**Implementation Strategy**:
Three-phase introduction that teaches spatial thinking early while setting up the full Wonder/Dread Flow/Leech system later.

**Phase 1: Converter Boost (Unlocks 1-3)**

**When**: Immediately when first converter (Refinery) unlocks

**Mechanic**:
- Converters get +20% production when adjacent input source is connected
- Only affects cards with both inputs AND outputs (true converters)
- No bonus for base generators or pure consumers

**Example**:
```
[Refinery] with ore from global pool: 0.5 energy/sec (base)
[Ore Gen] → [Refinery] (adjacent):    0.6 energy/sec (+20% converter boost)
```

**Teaching Value**:
- Reinforces ghost card spatial placement hints
- Players immediately rewarded for following adjacency suggestions
- Learns "position matters" through doing, not tutorial text
- Visual feedback through subtle glow on boosted cards

**Technical Implementation**:
```javascript
function calculateProductionBonus(card) {
  let bonus = 1.0;

  // Phase 1: Converter Boost
  if (isConverter(card)) {
    const hasAdjacentInput = hasAdjacentInputSource(card);
    if (hasAdjacentInput) {
      bonus *= 1.2; // +20% converter boost
    }
  }

  return bonus;
}
```

---

**Phase 2: Chain Bonus Discovery (Unlock 4-6)**

**When**: After 4th card unlock, show discovery message

**Discovery Message**:
```
"⚡ CHAIN SYNERGY DISCOVERED!
Connected cards gain +10% output per connection."
```

**Mechanic**:
- Each connected neighbor adds +10% production
- Applies to ALL cards, not just converters
- Stacks with converter boost (multiplicative)
- Max connections per card: 4 (N, S, E, W)

**Example Progression**:
```
Before Chain Bonus:
[Ore Gen] → [Refinery]
- Ore Gen: 1.0 ore/sec (base)
- Refinery: 0.6 energy/sec (converter boost only)

After Chain Bonus Unlocks:
[Ore Gen] → [Refinery] → [Data Proc]
- Ore Gen: 1.1 ore/sec (base × 1.1 for 1 connection)
- Refinery: 0.79 energy/sec (base × 1.2 converter × 1.32 chain [2 connections])
- Data Proc: 0.44 data/sec (base × 1.2 converter × 1.1 chain [1 connection])
```

**Strategic Implications**:
- Grid layout starts mattering significantly
- Players experiment with different arrangements
- Long chains become visibly more effective
- Creates "aha!" moments when optimal placements discovered

**Technical Implementation**:
```javascript
// Extend bonus calculation
if (gameState.unlockMilestones.chainBonusUnlocked) {
  const connectedCount = getConnectedNeighbors(card).length;
  bonus *= (1 + connectedCount * 0.1); // +10% per connection
}
```

**Visual Feedback**:
```css
/* Chain bonus glow - intensity scales with connections */
.card.chain-1 { box-shadow: 0 0 10px rgba(33, 150, 243, 0.2); }
.card.chain-2 { box-shadow: 0 0 15px rgba(33, 150, 243, 0.4); }
.card.chain-3 { box-shadow: 0 0 20px rgba(33, 150, 243, 0.6); }
.card.chain-4 { box-shadow: 0 0 25px rgba(33, 150, 243, 0.8); }
```

---

**Phase 3: Full Flow/Leech System (Phase 5)**

**When**: Mid-game, after Wonder/Dread alignment established

**Wonder Path - Enhanced Flow Bonuses**:
- Chain bonus increases to +15% per connection
- "Resonance Chain" upgrade: +20% per connection
- Chain bonuses stack with adjacent chains (multiplicative)
- Visual: Colored harmony links between connected cards
- Encourages large, snake-like production networks

**Dread Path - Leech Mechanics**:
- Chain bonuses convert to parasitic drain
- +25-50% production per adjacent card (higher than Wonder)
- BUT drains neighbors: -1 HP/sec, -1 Morale/sec, or resource consumption
- Visual: Red borders between connected Dread cards
- Encourages compact, high-density, exploitative builds

**Witness Path** (Both alignments):
- Can use both Flow and Leech on different cards
- Balance harmony chains with parasitic extractors
- Higher complexity, higher potential optimization

---

**Early Game Flow Example (Minutes 0-6)**

```
Minute 0: [Ore Gen] - manual clicking
          Production: 1.0 ore/sec when automated (no bonuses)

Minute 1: Unlock Refinery (30 ore)
          Ghost appears adjacent to Ore Gen
          Place: [Ore Gen] → [Refinery]

          Production:
          - Ore Gen: 1.0 ore/sec (no chain bonus yet)
          - Refinery: 0.6 energy/sec (base 0.5 + 20% converter boost)
          ✓ Visual: Refinery glows green (converter boost active)

Minute 3: Unlock Data Processor (60 ore)
          Ghost appears adjacent to Refinery
          Place: [Ore Gen] → [Refinery] → [Data Proc]

          Production:
          - Ore Gen: 1.0 ore/sec (still no chain bonus)
          - Refinery: 0.6 energy/sec (converter boost)
          - Data Proc: 0.36 data/sec (base 0.3 + 20% converter boost)

Minute 5: Unlock 4th card (Reactor)
          🎉 "CHAIN SYNERGY DISCOVERED!"

          Production NOW:
          - Ore Gen: 1.1 ore/sec (base 1.0 × 1.1 for 1 connection)
          - Refinery: 0.79 energy/sec (base 0.5 × 1.2 converter × 1.32 for 2 connections)
          - Data Proc: 0.44 data/sec (base 0.3 × 1.2 converter × 1.1 for 1 connection)
          ✓ Visual: All cards glow blue (chain bonus active)

          Strategic moment: Players see +32% boost on Refinery just from placement!
```

---

**Why This Approach Works**

1. **Progressive Complexity**: Don't overwhelm new players, introduce bonuses gradually
2. **Immediate Rewards**: Converter boost makes ghost placement hints pay off from unlock 1
3. **Discovery Moment**: Chain bonus unlock feels like meaningful progression milestone
4. **Foundation for Phase 5**: Players understand spatial bonuses before Wonder/Dread diverges them
5. **Reinforces Core Teaching**: Converter-driven progression already teaches adjacency, this rewards it
6. **Fits "Always See Carrot"**: Each phase reveals new depth to spatial puzzle
7. **Supports Emergent Strategy**: Players experiment with layouts, discover optimal arrangements

**Connection to Wonder/Dread**:
- Wonder-aligned players will naturally build longer chains (variety exploration)
- Dread-aligned players will compact grids for maximum connections (efficiency optimization)
- Emergent alignment tracking can include "average chain length" as metric
- Phase 5 differentiation feels like natural evolution of existing mechanics

**Technical Debt Notes**:
- Converter boost requires defining "isConverter()" helper function
- Chain bonus requires unlock milestone tracking in GameState
- Visual glow system needs CSS classes for different bonus levels
- Performance: Bonus calculations happen during production tick (already throttled to 60fps)

---

## Research Plan

### Selected Research Areas

Based on design decisions, these research topics will inform implementation:

**1. UI/UX Patterns for Spatial Tutorial Systems**
- How games teach through spatial positioning
- Ghost card visual design patterns
- Just-in-time tutorial systems

**2. Unlock Economy Design & Pacing Analysis**
- Cost curve optimization (unlock vs. upgrade ratios)
- Escalating cost formulas
- "Desire vs. effort" balancing

**3. Converter-Chain Progression Systems**
- Teaching resource conversion mechanics
- Balancing converter efficiency vs. pure generators
- Visual feedback for conversion flows

**4. Emergent Alignment/Philosophy Systems**
- Implicit player choice tracking
- Reveal moment design and timing
- Upgrade design with philosophical differences

**5. Progressive Vista & Information Architecture**
- Optimal lookahead distance (2 vs. 3 steps)
- Grayed-out content communication
- Vista expansion UX patterns

**6. Hybrid Active/Idle Onboarding**
- First 60 seconds experience design
- First unlock timing optimization
- Retention mechanics for return sessions

### Specific Research Questions

**RQ1: Ghost Card UI Implementation**
- What are proven patterns for spatial tutorial hints in grid-based games?
- How should ghost cards visually differentiate from real cards?
- When should ghosts appear/disappear (timing, triggers, persistence)?
- How do games handle multiple ghost options without cluttering the grid?

**RQ2: Unlock Cost Curves & Early Game Pacing**
- What are optimal cost ratios for unlock #1 vs #2 vs #3 (escalation rate)?
- How should unlock costs compare to upgrade costs to create meaningful choice?
- At what resource threshold do players feel "ready" for their first unlock?
- What cost curves maintain engagement in hybrid active/idle games?

**RQ3: Converter-Chain Teaching Progression**
- How do factory/automation games introduce conversion concepts?
- What's the ideal number of cards before introducing first pure generator?
- How should converter efficiency compare to pure generators (balance)?
- What visual/UI feedback best teaches "this consumes X to produce Y"?

**RQ4: Emergent Alignment Tracking**
- How do games track implicit player choices without making it obvious?
- When should the game reveal alignment tracking (timing of feedback)?
- What threshold constitutes alignment (% of choices)?
- How to design upgrades with philosophical differences that aren't mechanically identical?

**RQ5: Progressive Vista Tech Tree UX**
- What's the optimal lookahead distance (2 vs 3 vs 4 future unlocks)?
- How should grayed-out content communicate unlock requirements?
- How do games handle vista expansion when player unlocks something?
- What visual hierarchies work for "available now" vs "coming soon" vs "locked"?

**RQ6: First Session Hook & Retention**
- What happens in the first 60 seconds of successful hybrid active/idle games?
- How quickly should first unlock happen to maintain engagement?
- What "stopping point" encourages players to return for session 2?
- How do games teach "come back later" without explicitly saying it?

### Research Depth: To Be Determined

Options available:
- Quick Overview (30-60 mins): High-level insights, 2-3 examples per topic
- Deep Dive (2-4 hours): Detailed analysis, case studies, mechanical breakdowns
- Comprehensive Analysis (extensive): Multi-faceted exploration, implementation roadmap

---

## Next Steps

### Immediate Actions
1. **Review this session documentation** - Ensure design decisions align with overall game vision
2. **Select research depth and topics** - Determine which research questions to prioritize
3. **Conduct research** - Gather insights from similar games and UX patterns
4. **Validate design assumptions** - Test unlock costs and pacing with prototypes

### Implementation Path (Phase 4)
1. **Add card unlock economy system** - Extend GameState to track unlocked cards
2. **Implement ghost card UI** - Visual system for preview cards in grid
3. **Design unlock cost progression** - Specific values for unlocks #1-12
4. **Create upgrade alert system** - Notification UI for available card upgrades
5. **Build progressive vista tech tree** - Dynamic visibility of future unlocks
6. **Develop converter-chain cards** - First 6-8 cards following converter-driven progression
7. **Implement alignment tracking** - Silent Wonder/Dread choice monitoring
8. **Playtest first 15 minutes** - Validate onboarding flow and pacing

### Design Artifacts to Create
- Tech tree map (visual diagram of unlock progression)
- Card unlock specifications (costs, prerequisites, ghost positioning)
- Upgrade catalog (Wonder vs. Dread upgrade options per card)
- First-session flow diagram (minute-by-minute player experience)

### Open Questions for Future Sessions
- Exact cost values for unlocks #1-12 (requires playtesting)
- Ghost card visual design (opacity, animation, interaction)
- Alignment reveal narrative content (story/text for Wonder/Dread paths)
- Multi-input card balancing (efficiency calculations for complex consumers)
- Save/load implications (ghost state persistence, vista calculation on load)

---

## Key Insights & Takeaways

### Design Innovations
1. **Ghost Card Spatial Teaching** - Using grid positioning to teach I/O connections implicitly
2. **Converter-Driven Resource Introduction** - Resources emerge through gameplay, not tutorials
3. **Emergent Alignment** - Track playstyle, reveal understanding later (powerful player connection)
4. **Progressive Vista** - Dynamic lookahead creates anticipation without overwhelming

### Design Coherence
All decisions support core pillars:
- "Always see the carrot" → Progressive vista, grayed-out upgrades, ghost previews
- "Desire vs. effort" → Escalating costs, unlock vs. upgrade competition
- Emergent strategies → Gradual blending, converter choices, implicit alignment
- Hybrid active/idle → Manual start, automation unlocks, return hooks

### Connection to Game Theme
Wonder vs. Dread isn't just narrative flavor - it's embedded in mechanical choices:
- Wonder = exploration, variety, discovery (breadth)
- Dread = optimization, efficiency, domination (depth)
- Players naturally express alignment through upgrade preferences
- Game reflects understanding back, creating meaningful thematic resonance

---

## Session Metadata

**Duration**: ~45 minutes
**Framework**: CRI (Context, Role, Interview) + Research Planning
**Outcome**: Comprehensive early game design with clear implementation path
**Status**: Design complete, research planning deferred for later execution
