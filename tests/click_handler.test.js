import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../src/js/state.js';
import { ClickHandler } from '../src/js/clickHandler.js';
import { CARDS } from '../src/js/constants.js';

describe('ClickHandler System', () => {
  let gameState;
  let clickHandler;

  beforeEach(() => {
    gameState = new GameState();
    clickHandler = new ClickHandler(gameState);
    
    // Ensure Proton Cutter is placed and unlocked
    gameState.cards[CARDS.EXTRACTOR].placed = true;
    gameState.cards[CARDS.EXTRACTOR].unlocked = true;
    gameState.cards[CARDS.EXTRACTOR].tier = 0;
    
    // Reset click cooldowns to ensure tests don't interfere
    clickHandler.lastClickTimestamps = {};
  });

  it('allows clicking at Tier 0', () => {
    const result = clickHandler.handleClick(CARDS.EXTRACTOR);
    expect(result.success).toBe(true);
  });

  it('allows clicking at Tier 1 (Manual Boost)', () => {
    // Upgrade to Tier 1
    gameState.cards[CARDS.EXTRACTOR].tier = 1;

    // Try to click
    const result = clickHandler.handleClick(CARDS.EXTRACTOR);
    
    // Should succeed allowing manual boost
    expect(result.success).toBe(true);
  });
});
