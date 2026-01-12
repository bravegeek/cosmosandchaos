/**
 * Unit tests for UnlockManager (unlock.js)
 * Tests card unlock progression system - sequential and milestone unlocks
 * Phase 4: Early Game State
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameState } from '../src/js/state.js'
import { UnlockManager } from '../src/js/unlock.js'
import { CARDS, RESOURCES } from '../src/js/constants.js'

describe('UnlockManager - Sequential Unlocks', () => {
  let state
  let unlockManager

  beforeEach(() => {
    state = new GameState()
    unlockManager = new UnlockManager(state)
  })

  // T049: Sequential unlock chain
  it('should unlock Processor when Extractor upgraded to T1', () => {
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)

    // Upgrade Extractor to T1
    state.cards[CARDS.EXTRACTOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.EXTRACTOR,
      newTier: 1
    })

    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(true)
  })

  it('should unlock Reactor when Processor upgraded to T1', () => {
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(false)

    // Upgrade Processor to T1
    state.cards[CARDS.PROCESSOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.PROCESSOR,
      newTier: 1
    })

    expect(state.cards[CARDS.REACTOR].unlocked).toBe(true)
  })

  it('should unlock Sensor when Reactor upgraded to T1', () => {
    expect(state.cards[CARDS.SENSOR].unlocked).toBe(false)

    // Upgrade Reactor to T1
    state.cards[CARDS.REACTOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.REACTOR,
      newTier: 1
    })

    expect(state.cards[CARDS.SENSOR].unlocked).toBe(true)
  })

  // T049: Full sequential chain test
  it('should follow complete sequential chain: Extractor→Processor→Reactor→Sensor', () => {
    // Initial state: only Extractor unlocked
    expect(state.cards[CARDS.EXTRACTOR].unlocked).toBe(true)
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(false)
    expect(state.cards[CARDS.SENSOR].unlocked).toBe(false)

    // Step 1: Upgrade Extractor to T1
    state.cards[CARDS.EXTRACTOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.EXTRACTOR,
      newTier: 1
    })
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(true)
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(false)

    // Step 2: Upgrade Processor to T1
    state.cards[CARDS.PROCESSOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.PROCESSOR,
      newTier: 1
    })
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(true)
    expect(state.cards[CARDS.SENSOR].unlocked).toBe(false)

    // Step 3: Upgrade Reactor to T1
    state.cards[CARDS.REACTOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.REACTOR,
      newTier: 1
    })
    expect(state.cards[CARDS.SENSOR].unlocked).toBe(true)
  })

  it('should not unlock cards if upgrade tier is wrong', () => {
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)

    // Upgrade Extractor to T2 (not T1)
    state.cards[CARDS.EXTRACTOR].tier = 2
    state.emit('card:upgraded', {
      cardId: CARDS.EXTRACTOR,
      newTier: 2
    })

    // Processor should not unlock (requires T1 specifically)
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)
  })

  it('should not unlock already unlocked cards', () => {
    // Manually unlock Processor
    state.cards[CARDS.PROCESSOR].unlocked = true

    const eventSpy = vi.fn()
    state.on('card:unlocked', eventSpy)

    // Upgrade Extractor to T1
    state.cards[CARDS.EXTRACTOR].tier = 1
    state.emit('card:upgraded', {
      cardId: CARDS.EXTRACTOR,
      newTier: 1
    })

    // Should not emit unlock event for already unlocked card
    expect(eventSpy).not.toHaveBeenCalled()
  })
})

describe('UnlockManager - Milestone Unlocks', () => {
  let state
  let unlockManager

  beforeEach(() => {
    state = new GameState()
    unlockManager = new UnlockManager(state)
  })

  // T047: Milestone unlock tests
  it('should unlock Lab when Data reaches 50', () => {
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Add 50 data
    state.addResource(RESOURCES.DATA, 50)

    expect(state.cards[CARDS.LAB].unlocked).toBe(true)
  })

  it('should unlock Habitat when Energy reaches 100', () => {
    expect(state.cards[CARDS.HABITAT].unlocked).toBe(false)

    // Add 100 energy
    state.addResource(RESOURCES.ENERGY, 100)

    expect(state.cards[CARDS.HABITAT].unlocked).toBe(true)
  })

  it('should unlock Engine when Metal reaches 50', () => {
    expect(state.cards[CARDS.ENGINE].unlocked).toBe(false)

    // Add 50 metal
    state.addResource(RESOURCES.METAL, 50)

    expect(state.cards[CARDS.ENGINE].unlocked).toBe(true)
  })

  it('should unlock Storage when Ore reaches 200', () => {
    expect(state.cards[CARDS.STORAGE].unlocked).toBe(false)

    // Add 200 ore
    state.addResource(RESOURCES.ORE, 200)

    expect(state.cards[CARDS.STORAGE].unlocked).toBe(true)
  })

  it('should unlock when resource exceeds threshold', () => {
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Add 100 data (way more than 50)
    state.addResource(RESOURCES.DATA, 100)

    expect(state.cards[CARDS.LAB].unlocked).toBe(true)
  })

  it('should not unlock if threshold not reached', () => {
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Add 49 data (just under 50)
    state.addResource(RESOURCES.DATA, 49)

    expect(state.cards[CARDS.LAB].unlocked).toBe(false)
  })

  it('should unlock with incremental additions', () => {
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Add data incrementally
    state.addResource(RESOURCES.DATA, 20)
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    state.addResource(RESOURCES.DATA, 20)
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    state.addResource(RESOURCES.DATA, 10) // Total = 50
    expect(state.cards[CARDS.LAB].unlocked).toBe(true)
  })

  // T047: Out-of-order unlocks
  it('should handle out-of-order resource accumulation', () => {
    // Accumulate Energy first (not typical order)
    state.addResource(RESOURCES.ENERGY, 100)
    expect(state.cards[CARDS.HABITAT].unlocked).toBe(true)

    // Data comes later
    state.addResource(RESOURCES.DATA, 50)
    expect(state.cards[CARDS.LAB].unlocked).toBe(true)

    // Both should be unlocked regardless of order
    expect(state.cards[CARDS.HABITAT].unlocked).toBe(true)
    expect(state.cards[CARDS.LAB].unlocked).toBe(true)
  })

  it('should not unlock already unlocked milestone cards', () => {
    // Manually unlock Lab
    state.cards[CARDS.LAB].unlocked = true

    const eventSpy = vi.fn()
    state.on('card:unlocked', eventSpy)

    // Reach milestone
    state.addResource(RESOURCES.DATA, 50)

    // Should not emit unlock event for already unlocked card
    expect(eventSpy).not.toHaveBeenCalled()
  })
})

describe('UnlockManager - Milestone Independence', () => {
  let state
  let unlockManager

  beforeEach(() => {
    state = new GameState()
    unlockManager = new UnlockManager(state)
  })

  // T050: Milestone independence test
  it('should unlock Storage at 200 ore before Lab at 50 data', () => {
    // Initial state: both locked
    expect(state.cards[CARDS.STORAGE].unlocked).toBe(false)
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Accumulate 200 ore (unlock Storage)
    state.addResource(RESOURCES.ORE, 200)
    expect(state.cards[CARDS.STORAGE].unlocked).toBe(true)
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)

    // Later accumulate 50 data (unlock Lab)
    state.addResource(RESOURCES.DATA, 50)
    expect(state.cards[CARDS.STORAGE].unlocked).toBe(true)
    expect(state.cards[CARDS.LAB].unlocked).toBe(true)
  })

  it('should allow milestone cards to unlock independently of sequential chain', () => {
    // Processor, Reactor, Sensor still locked (sequential chain not progressed)
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(false)
    expect(state.cards[CARDS.SENSOR].unlocked).toBe(false)

    // But milestone cards can unlock
    state.addResource(RESOURCES.ENERGY, 100)
    state.addResource(RESOURCES.DATA, 50)

    expect(state.cards[CARDS.HABITAT].unlocked).toBe(true)
    expect(state.cards[CARDS.LAB].unlocked).toBe(true)

    // Sequential chain still locked
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(false)
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(false)
  })

  it('should allow sequential cards to unlock independently of milestone cards', () => {
    // Milestone cards still locked
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)
    expect(state.cards[CARDS.HABITAT].unlocked).toBe(false)
    expect(state.cards[CARDS.ENGINE].unlocked).toBe(false)
    expect(state.cards[CARDS.STORAGE].unlocked).toBe(false)

    // Progress sequential chain
    state.cards[CARDS.EXTRACTOR].tier = 1
    state.emit('card:upgraded', { cardId: CARDS.EXTRACTOR, newTier: 1 })

    state.cards[CARDS.PROCESSOR].tier = 1
    state.emit('card:upgraded', { cardId: CARDS.PROCESSOR, newTier: 1 })

    // Sequential cards unlock
    expect(state.cards[CARDS.PROCESSOR].unlocked).toBe(true)
    expect(state.cards[CARDS.REACTOR].unlocked).toBe(true)

    // Milestone cards still locked
    expect(state.cards[CARDS.LAB].unlocked).toBe(false)
    expect(state.cards[CARDS.HABITAT].unlocked).toBe(false)
  })
})

describe('UnlockManager - Unlock Progress', () => {
  let state
  let unlockManager

  beforeEach(() => {
    state = new GameState()
    unlockManager = new UnlockManager(state)
  })

  it('should report progress for sequential unlock', () => {
    const progress = unlockManager.getUnlockProgress(CARDS.PROCESSOR)

    expect(progress).toBeDefined()
    expect(progress.card).toBe(CARDS.PROCESSOR)
    expect(progress.unlocked).toBe(false)
    expect(progress.progress.current).toBe(0) // Extractor tier
    expect(progress.progress.required).toBe(1)
    expect(progress.progress.percentage).toBe(0)
  })

  it('should report progress for milestone unlock', () => {
    state.addResource(RESOURCES.DATA, 25)

    const progress = unlockManager.getUnlockProgress(CARDS.LAB)

    expect(progress).toBeDefined()
    expect(progress.card).toBe(CARDS.LAB)
    expect(progress.unlocked).toBe(false)
    expect(progress.progress.current).toBe(25)
    expect(progress.progress.required).toBe(50)
    expect(progress.progress.percentage).toBe(50)
  })

  it('should return null for cards without unlock rules', () => {
    const progress = unlockManager.getUnlockProgress(CARDS.EXTRACTOR)
    expect(progress).toBeNull()
  })

  it('should cap percentage at 100%', () => {
    state.addResource(RESOURCES.DATA, 100) // Over the 50 threshold

    const progress = unlockManager.getUnlockProgress(CARDS.LAB)
    expect(progress.progress.percentage).toBe(100)
  })
})

describe('UnlockManager - Locked Card Placement Prevention', () => {
  let state

  beforeEach(() => {
    state = new GameState()
  })

  // T048: Locked card placement tests
  it('should prevent placing locked card on grid', () => {
    const lockedCard = state.cards[CARDS.PROCESSOR]
    expect(lockedCard.unlocked).toBe(false)

    // Attempt to place locked card
    const result = state.placeCard(CARDS.PROCESSOR, 0, 0)

    // Should succeed at GameState level (it doesn't check unlock)
    // The check happens in grid.js handleDrop
    expect(result).toBe(true)

    // But the card should have placed flag
    expect(lockedCard.placed).toBe(true)
  })

  it('should allow placing unlocked card on grid', () => {
    const unlockedCard = state.cards[CARDS.EXTRACTOR]
    expect(unlockedCard.unlocked).toBe(true)

    const result = state.placeCard(CARDS.EXTRACTOR, 0, 0)

    expect(result).toBe(true)
    expect(unlockedCard.placed).toBe(true)
    expect(unlockedCard.row).toBe(0)
    expect(unlockedCard.col).toBe(0)
  })

  it('should track unlock state separately from placement', () => {
    const card = state.cards[CARDS.PROCESSOR]

    // Initially locked and not placed
    expect(card.unlocked).toBe(false)
    expect(card.placed).toBe(false)

    // Unlock the card
    card.unlocked = true
    expect(card.unlocked).toBe(true)
    expect(card.placed).toBe(false)

    // Place the card
    state.placeCard(CARDS.PROCESSOR, 1, 1)
    expect(card.unlocked).toBe(true)
    expect(card.placed).toBe(true)
  })
})

describe('UnlockManager - Event Emissions', () => {
  let state
  let unlockManager

  beforeEach(() => {
    state = new GameState()
    unlockManager = new UnlockManager(state)
  })

  it('should emit CARD_UNLOCKED event for sequential unlock', () => {
    const eventSpy = vi.fn()
    state.on('card:unlocked', eventSpy)

    // Trigger sequential unlock
    state.cards[CARDS.EXTRACTOR].tier = 1
    state.emit('card:upgraded', { cardId: CARDS.EXTRACTOR, newTier: 1 })

    expect(eventSpy).toHaveBeenCalledWith({
      cardId: CARDS.PROCESSOR,
      unlockType: 'sequential',
      trigger: {
        type: 'tier_upgrade',
        cardId: CARDS.EXTRACTOR,
        tier: 1
      }
    })
  })

  it('should emit CARD_UNLOCKED event for milestone unlock', () => {
    const eventSpy = vi.fn()
    state.on('card:unlocked', eventSpy)

    // Trigger milestone unlock
    state.addResource(RESOURCES.DATA, 50)

    expect(eventSpy).toHaveBeenCalledWith({
      cardId: CARDS.LAB,
      unlockType: 'milestone',
      trigger: {
        type: 'resource',
        resource: RESOURCES.DATA,
        threshold: 50
      }
    })
  })

  it('should emit multiple unlock events when multiple thresholds reached', () => {
    const eventSpy = vi.fn()
    state.on('card:unlocked', eventSpy)

    // Add enough resources to trigger multiple unlocks
    state.addResource(RESOURCES.ENERGY, 100) // Habitat
    state.addResource(RESOURCES.DATA, 50)    // Lab

    expect(eventSpy).toHaveBeenCalledTimes(2)
  })
})
