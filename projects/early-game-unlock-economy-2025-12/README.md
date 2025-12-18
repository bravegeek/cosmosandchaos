# Early Game Unlock Economy - Design Session

**Date**: 2025-12-17
**Status**: Design Complete, Ready for Implementation
**Phase**: Pre-Phase 4 Planning

---

## Quick Summary

This project documents a comprehensive CRI brainstorming session that designed the early game unlock economy and onboarding experience for Cosmos and Chaos.

### What Was Designed

1. **Card Unlock Economy** - New system where players purchase card types with resources
2. **Starting Experience** - Begin with 1 Ore Generator (manual clicking), unlock cards progressively
3. **Ghost Card UI** - Innovative spatial tutorial system showing unlock previews in grid
4. **Unlock Cost Structure** - Escalating costs (25 → 60 → 150 ore) competing with upgrade costs (50-60 ore)
5. **Resource Introduction** - Converter-driven progression (resources emerge through gameplay)
6. **Progressive Vista** - Dynamic visibility showing 2-3 steps ahead
7. **Emergent Alignment** - Wonder/Dread tracking through implicit upgrade choices
8. **Early Flow Bonuses** - Progressive adjacency rewards (converter boost → chain bonus → full Flow/Leech)

---

## Core Design Principles

**"Always See the Carrot"**
- Players constantly see how the game gets more fun as they progress
- Ghost cards preview what's unlockable
- Progressive vista shows 2-3 future unlocks
- Grayed-out content creates anticipation

**"Desire vs. Effort"**
- Balance wanting more (exploration drive) with working for it (resource cost)
- Unlock costs escalate to maintain tension
- Unlocks compete with upgrades for resources (breadth vs. depth)
- Sweet spot: "I can almost afford this, and I really want it"

**Emergent Strategies**
- Players discover synergies through experimentation
- Gradual blending from structured to open progression
- Multiple paths to same goals
- No single "correct" build

---

## Key Innovation: Ghost Card System

**What it is**: Unlockable cards appear as "ghost" previews in adjacent grid squares

**How it teaches**:
- Spatial positioning shows WHERE to place (teaches adjacency)
- Ghost next to Ore Generator = they connect (teaches I/O)
- Cost displayed on ghost (teaches resource requirements)
- Click ghost to unlock and place (intuitive interaction)

**Why it's novel**: Teaches through spatial relationships rather than text tutorials. Just-in-time guidance that doesn't interrupt flow.

---

## Early Game Flow (First 10 Minutes)

```
Minute 0:    Start with [Ore Generator] - manual clicking
             Ghost: [Refinery - 30 ore] appears adjacent

Minute 1-2:  Click to ~30 ore, unlock Refinery
             Place adjacent to Ore Generator
             Energy starts producing (second resource discovered!)
             ✓ Refinery gets +20% converter boost (glows green)
             Ghosts update: [Data Processor - 60 ore] and [Ore Storage - 50 ore]

Minute 3-5:  Choose: Unlock Data Processor (expand) OR Upgrade Ore Generator (deepen)
             First strategic choice: breadth vs. depth

Minute 5:    Unlock 4th card
             🎉 "CHAIN SYNERGY DISCOVERED!"
             All connected cards get +10% per connection

Minute 5-10: Build converter chain OR unlock parallel production
             Multiple resource types discovered through gameplay
             Placement strategy matters significantly
```

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Starting Cards** | 1 Ore Generator (manual) | Minimal cognitive load, ghost UI prevents feeling lost |
| **Unlock System** | Hybrid (purchase early, milestones later) | Structured learning → strategic freedom |
| **UI Guidance** | Ghosts + alerts + grayed-out | Spatial teaching, just-in-time info |
| **Unlock Costs** | Escalating (25→60→150) | Maintains desire vs. effort tension |
| **Upgrade Costs** | Stable (50-60) | Consistent deepening option |
| **Visibility** | Progressive Vista (2-3 ahead) | Anticipation without overwhelm |
| **Resource Intro** | Converter-Driven | Teaches through emergence and I/O connections |
| **Progression** | Gradual Blending | Smooth learning → mastery arc |
| **Wonder/Dread** | Emergent (implicit tracking) | Discover playstyle, reveal later |
| **Flow Bonuses** | Progressive (3 phases) | Converter boost → Chain bonus → Flow/Leech |

---

## Files in This Project

### `session.md` (Main Document)
Comprehensive design decisions, rationale, implementation guidance. Read this for:
- Full design specifications
- Context and goals
- All design decisions with reasoning
- Research plan
- Next steps

### `session.meta.md` (Transparency Document)
Agent reasoning, thought process, question strategy. Read this for:
- How decisions were reached
- Why certain questions were asked
- What was learned from each answer
- Design evolution throughout session
- Interview techniques used

### `README.md` (This File)
Quick reference and overview.

---

## Implementation Checklist

When ready to implement (Phase 4):

- [ ] Review full design in `session.md`
- [ ] Conduct research (see Research Plan section)
- [ ] Design ghost card visual treatment
- [ ] Implement card unlock economy in GameState
- [ ] Create ghost card UI system
- [ ] Design first 12 card unlocks following converter-driven progression
- [ ] Implement Phase 1 flow bonuses (converter boost +20%)
- [ ] Implement Phase 2 flow bonuses (chain bonus discovery at unlock 4)
- [ ] Define Wonder vs. Dread upgrade variants
- [ ] Build progressive vista tech tree UI
- [ ] Playtest first 15 minutes
- [ ] Iterate based on feedback

---

## Research Plan (For Later Execution)

### Priority Research Topics

1. **Ghost Card UI Implementation** - Spatial tutorial patterns, visual design
2. **Unlock Cost Curves** - Optimal escalation rates, balancing with upgrades
3. **Converter-Chain Progression** - Teaching through conversion, case studies
4. **Emergent Alignment Tracking** - Silent tracking systems, reveal moments
5. **Progressive Vista UX** - Dynamic visibility patterns, lookahead distance
6. **Hybrid Active/Idle Onboarding** - First session hooks, retention mechanics

### Specific Questions to Answer

- How should ghost cards visually differentiate from real cards?
- What are optimal cost ratios for unlock #1 vs #2 vs #3?
- How do factory games teach conversion mechanics?
- When should the game reveal Wonder/Dread alignment tracking?
- What's the optimal lookahead distance (2 vs 3 future unlocks)?
- What happens in first 60 seconds of successful hybrid idle games?

See `session.md` Research Plan section for complete question list.

---

## Next Session Ideas

**Follow-up Design Sessions**:
- Mid-game progression (unlocks #13-30)
- Wonder/Dread reveal moment and narrative
- Card placement-based unlock triggers (noted for exploration)
- Advanced multi-input card balancing
- End-game unlock economy

**Implementation Sessions**:
- Ghost card UI prototyping
- Cost curve playtesting and tuning
- First 15 minutes playtest protocol design

---

## Connection to Game Vision

This early game design directly supports Cosmos and Chaos's core themes:

**Wonder Path (Exploration)**:
- Unlocking new card types = discovery
- Cross-resource synergies = experimentation
- Converter chains = understanding relationships

**Dread Path (Optimization)**:
- Upgrading existing cards = efficiency
- Single-resource focus = specialization
- Pure generators = maximum output

The early game teaches both paths through organic play, allowing players to discover which resonates with them. Later, the game validates their playstyle through alignment reveal.

---

## Credits

**Design Session**: CRI Framework (Context, Role, Interview, Research Planning)
**Facilitator**: Claude Sonnet 4.5
**Designer**: Greg (Cosmos and Chaos creator)
**Session Duration**: ~45 minutes
**Outcome**: Complete early game design ready for implementation

---

## Quick Start

1. **Read `session.md`** for full design specifications
2. **Review Research Plan** to identify what to research before implementing
3. **Reference this README** when you need quick lookup of decisions
4. **Check `session.meta.md`** if you want to understand the reasoning process

**Ready to implement?** Start with ghost card UI prototyping and first 3 unlock designs.
