/**
 * Game Constants
 * Central registry for all game enums and magic values
 */

console.log('📋 Constants module loaded');

/**
 * Resource Types
 * All resource identifiers used throughout the game
 */
export const RESOURCES = {
  ORE: 'ore',
  METAL: 'metal',
  ENERGY: 'energy',
  SCIENCE: 'science',
  DATA: 'data',
  XENO_BLOOM: 'xenoBloom',  // Renamed from BIOMASS (2025-12-25)
  FLUX_SHARD: 'fluxShard'   // Renamed from NANITES (2026-01-02)
};

/**
 * Card IDs
 * All card identifiers used throughout the game
 */
export const CARDS = {
  EXTRACTOR: 'extractor',
  SENSOR: 'sensor',
  STORAGE: 'storage',
  PROCESSOR: 'processor',
  REACTOR: 'reactor',
  ENGINE: 'engine',
  HABITAT: 'habitat',
  LAB: 'lab'
};

/**
 * LED Status Colors
 * Status LED color states for efficiency visualization
 */
export const LED_STATUS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red'
};

/**
 * Efficiency Thresholds
 * Defines when LED colors change based on efficiency %
 */
export const EFFICIENCY_THRESHOLDS = {
  HIGH: 0.80,   // >= 80% = green
  MEDIUM: 0.40  // >= 40% = yellow, < 40% = red
};

/**
 * Update Rates (Hz)
 * Display update frequencies for different priority levels
 */
export const UPDATE_RATES = {
  PRIMARY: 2,      // 2Hz (every 500ms) - High priority
  SECONDARY: 1,    // 1Hz (every 1000ms) - Medium priority
  TERTIARY: 0.5    // 0.5Hz (every 2000ms) - Low priority
};

/**
 * Game Events
 * Event names used in the event bus system
 */
export const EVENTS = {
  RESOURCE_CHANGED: 'resource:changed',
  CARD_PLACED: 'card:placed',
  CARD_REMOVED: 'card:removed',
  CARD_UPGRADED: 'card:upgraded',
  CARD_PRODUCED: 'card:produced',
  CARD_PRODUCTION: 'card:production',
  CARD_EFFICIENCY_CHANGED: 'card:efficiency:changed',
  STATE_RESTORED: 'state:restored',
  STATE_RESET: 'state:reset'
};

// Export for debugging
if (typeof window !== 'undefined') {
  window.GAME_CONSTANTS = { RESOURCES, CARDS, LED_STATUS, EVENTS };
}
