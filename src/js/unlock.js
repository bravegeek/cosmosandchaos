/**
 * UnlockManager - Card Unlock Progression System
 * Phase 4: Early Game State
 * Manages hybrid unlock system (sequential + milestone)
 */

import { CARDS, RESOURCES, EVENTS, DEBUG } from './constants.js';

if (DEBUG) console.log('🔓 UnlockManager module loaded');

/**
 * UnlockManager - Manages card unlock progression
 * Features:
 * - Sequential unlocks (upgrade-based chain)
 * - Milestone unlocks (resource threshold-based)
 * - Independent unlock paths (can unlock out of order)
 */
export class UnlockManager {
  constructor(gameState) {
    this.gameState = gameState;

    // Unlock rules configuration (T034)
    this.unlockRules = {
      sequential: [
        {
          card: CARDS.PROCESSOR,
          trigger: { type: 'tier_upgrade', cardId: CARDS.EXTRACTOR, tier: 1 }
        },
        {
          card: CARDS.REACTOR,
          trigger: { type: 'tier_upgrade', cardId: CARDS.PROCESSOR, tier: 1 }
        },
        {
          card: CARDS.SENSOR,
          trigger: { type: 'tier_upgrade', cardId: CARDS.REACTOR, tier: 1 }
        }
      ],
      milestones: [
        {
          card: CARDS.LAB,
          trigger: { type: 'resource', resource: RESOURCES.DATA, threshold: 50 }
        },
        {
          card: CARDS.HABITAT,
          trigger: { type: 'resource', resource: RESOURCES.ENERGY, threshold: 100 }
        },
        {
          card: CARDS.ENGINE,
          trigger: { type: 'resource', resource: RESOURCES.METAL, threshold: 50 }
        },
        {
          card: CARDS.STORAGE,
          trigger: { type: 'resource', resource: RESOURCES.ORE, threshold: 200 }
        }
      ]
    };

    this.setupListeners(); // T035
  }

  setupListeners() {
    // Listen for tier upgrades (T035)
    this.gameState.on(EVENTS.CARD_UPGRADED, (event) => {
      this.checkSequentialUnlocks(event.cardId, event.newTier);
    });

    // Listen for resource changes (T035)
    this.gameState.on(EVENTS.RESOURCE_CHANGED, (event) => {
      this.checkMilestoneUnlocks(event.type, event.total);
    });
  }

  /**
   * Check and trigger sequential unlocks (T036)
   * @param {string} cardId - Card that was upgraded
   * @param {number} tier - New tier level
   * @returns {Array} List of newly unlocked cards
   */
  checkSequentialUnlocks(cardId, tier) {
    const unlocked = [];

    for (const rule of this.unlockRules.sequential) {
      if (rule.trigger.cardId === cardId && rule.trigger.tier === tier) {
        if (!this.gameState.cards[rule.card].unlocked) {
          this.gameState.cards[rule.card].unlocked = true;
          this.gameState.emit(EVENTS.CARD_UNLOCKED, {
            cardId: rule.card,
            unlockType: 'sequential',
            trigger: rule.trigger
          });
          unlocked.push(rule.card);
          if (DEBUG) console.log(`🔓 Sequential unlock: ${rule.card} (${cardId} → T${tier})`);
        }
      }
    }

    return unlocked;
  }

  /**
   * Check and trigger milestone unlocks (T037)
   * @param {string} resourceType - Resource that changed
   * @param {number} value - New resource value
   * @returns {Array} List of newly unlocked cards
   */
  checkMilestoneUnlocks(resourceType, value) {
    const unlocked = [];

    for (const rule of this.unlockRules.milestones) {
      if (rule.trigger.resource === resourceType && value >= rule.trigger.threshold) {
        if (!this.gameState.cards[rule.card].unlocked) {
          this.gameState.cards[rule.card].unlocked = true;
          this.gameState.emit(EVENTS.CARD_UNLOCKED, {
            cardId: rule.card,
            unlockType: 'milestone',
            trigger: rule.trigger
          });
          unlocked.push(rule.card);
          if (DEBUG) console.log(`🔓 Milestone unlock: ${rule.card} (${resourceType} ≥ ${rule.trigger.threshold})`);
        }
      }
    }

    return unlocked;
  }

  /**
   * Get unlock progress for a specific card (T038)
   * @param {string} cardId - Card to check
   * @returns {Object|null} Progress information
   */
  getUnlockProgress(cardId) {
    // Find rule for this card
    let rule = this.unlockRules.sequential.find(r => r.card === cardId);
    if (!rule) {
      rule = this.unlockRules.milestones.find(r => r.card === cardId);
    }
    if (!rule) return null;

    const unlocked = this.gameState.cards[cardId].unlocked;

    if (rule.trigger.type === 'tier_upgrade') {
      const triggerCard = this.gameState.cards[rule.trigger.cardId];
      return {
        card: cardId,
        unlocked,
        rule,
        progress: {
          current: triggerCard.tier,
          required: rule.trigger.tier,
          percentage: (triggerCard.tier / rule.trigger.tier) * 100
        }
      };
    } else {
      const current = this.gameState.resources[rule.trigger.resource];
      return {
        card: cardId,
        unlocked,
        rule,
        progress: {
          current,
          required: rule.trigger.threshold,
          percentage: Math.min(100, (current / rule.trigger.threshold) * 100)
        }
      };
    }
  }
}
