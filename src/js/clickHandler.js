/**
 * ClickHandler - Manual Click System
 * Phase 4: Early Game State
 * Handles manual clicks on Tier 0 cards with rate limiting
 */

import { RESOURCES, CARDS, EVENTS, DEBUG } from './constants.js';
import { CARD_CONFIGS } from './cardConfigs.js';

if (DEBUG) console.log('🖱️  ClickHandler module loaded');

/**
 * ClickHandler - Manages manual clicks on Tier 0 cards
 * Features:
 * - Rate limiting (10 clicks/second per card)
 * - Resource consumption/production
 * - Tier 0 restriction (automation replaces clicking at T1+)
 */
export class ClickHandler {
  constructor(gameState) {
    this.gameState = gameState;
    this.lastClickTimestamps = {}; // { cardId: timestamp }
    this.CLICK_COOLDOWN_MS = 100;  // 10 clicks/second (T024)
  }

  /**
   * Handle a manual click on a card (T025-T026)
   * @param {string} cardId - Card identifier
   * @returns {object} { success, reason?, consumed?, produced? }
   */
  handleClick(cardId) {
    const now = Date.now();

    // Check rate limit
    const lastClick = this.lastClickTimestamps[cardId] || 0;
    if (now - lastClick < this.CLICK_COOLDOWN_MS) {
      this.gameState.emit(EVENTS.CLICK_RATE_LIMITED, { cardId, timestamp: now });
      return { success: false, reason: 'rate_limit' };
    }

    // Check card exists, is placed, and is tier 0
    const card = this.gameState.cards[cardId];
    if (!card) {
      return { success: false, reason: 'card_not_found' };
    }
    if (!card.placed) {
      return { success: false, reason: 'not_placed' };
    }

    // Get manual click yield
    const config = CARD_CONFIGS[cardId];
    const clickYield = config.manualClickYield;
    if (!clickYield) {
      return { success: false, reason: 'no_manual_yield' };
    }

    // Check resource availability for consumption
    for (const [resource, amount] of Object.entries(clickYield.consume)) {
      if (this.gameState.resources[resource] < amount) {
        return { success: false, reason: 'insufficient_resources' };
      }
    }

    // Consume resources
    const consumed = {};
    for (const [resource, amount] of Object.entries(clickYield.consume)) {
      this.gameState.resources[resource] -= amount;
      consumed[resource] = amount;
    }

    // Produce resources
    const produced = {};
    for (const [resource, amount] of Object.entries(clickYield.produce)) {
      this.gameState.addResource(resource, amount); // Triggers discovery
      produced[resource] = amount;
    }

    // Update timestamp
    this.lastClickTimestamps[cardId] = now;

    // Emit event
    this.gameState.emit(EVENTS.CARD_CLICKED, {
      cardId,
      consumed,
      produced,
      timestamp: now
    });

    return { success: true, consumed, produced };
  }

  /**
   * Get remaining cooldown time for a card (T027)
   * @param {string} cardId - Card identifier
   * @returns {number} Remaining cooldown in ms (0 if ready)
   */
  getRemainingCooldown(cardId) {
    const lastClick = this.lastClickTimestamps[cardId] || 0;
    const elapsed = Date.now() - lastClick;
    return Math.max(0, this.CLICK_COOLDOWN_MS - elapsed);
  }
}
