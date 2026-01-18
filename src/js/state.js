/**
 * Centralized Game State Management
 * Single source of truth for all game data with event-driven architecture
 */

import { RESOURCES, CARDS, EVENTS, LED_STATUS, EFFICIENCY_THRESHOLDS, DEBUG } from './constants.js';
import { CARD_CONFIGS as IMPORTED_CARD_CONFIGS } from './cardConfigs.js';

// Helper to get CARD_CONFIGS (supports test mocking via window.CARD_CONFIGS)
const getCardConfigs = () => (typeof window !== 'undefined' && window.CARD_CONFIGS) || IMPORTED_CARD_CONFIGS;

if (DEBUG) console.log('🎮 State module loaded');

/**
 * GameState - Centralized store for all game data
 * - Provides single source of truth for save/load
 * - Event bus for decoupled UI updates
 * - Validation for all state mutations
 * - Serialization support
 */
class GameState {
  constructor() {
    // Schema version for save compatibility (T014: Phase 4 increments to v2)
    this.version = 2;

    // Resources
    this.resources = {
      [RESOURCES.ORE]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.ENERGY]: 0,
      [RESOURCES.PROTOCOLS]: 0,   // Phase 2: Renamed from SCIENCE (2026-01-03)
      [RESOURCES.DATA]: 0,
      [RESOURCES.XENO_BLOOM]: 0,  // Phase 2: Renamed from BIOMASS (2025-12-25)
      [RESOURCES.FLUX_SHARD]: 0   // Phase 2: Renamed from NANITES (2026-01-02)
    };

    // Card state - Each card tracks its full state
    this.cards = {
      [CARDS.EXTRACTOR]: {
        id: CARDS.EXTRACTOR,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: true  // Phase 4: Extractor starts unlocked
      },
      [CARDS.SENSOR]: {
        id: CARDS.SENSOR,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.STORAGE]: {
        id: CARDS.STORAGE,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.PROCESSOR]: {
        id: CARDS.PROCESSOR,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,  // Phase 4: Changed from tier: 1 to tier: 0
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.REACTOR]: {
        id: CARDS.REACTOR,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.ENGINE]: {
        id: CARDS.ENGINE,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.HABITAT]: {
        id: CARDS.HABITAT,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      },
      [CARDS.LAB]: {
        id: CARDS.LAB,
        placed: false,
        row: null,
        col: null,
        production: 0,
        automated: false,
        rate: 0,
        tier: 0,
        ioIndicators: [],
        unlocked: false  // Phase 4: All other cards start locked
      }
    };

    // Grid configuration
    this.grid = {
      rows: 4,
      cols: 5
    };

    // === PHASE 2 ADDITIONS ===

    // === PHASE 4 ADDITIONS ===
    // Resource discovery tracking - only ore visible at start (T007)
    this.discoveredResources = new Set([RESOURCES.ORE]);

    // Resource accumulators for fractional tracking
    this.resourceAccumulators = {
      [RESOURCES.ORE]: 0,
      [RESOURCES.METAL]: 0,
      [RESOURCES.ENERGY]: 0,
      [RESOURCES.PROTOCOLS]: 0,
      [RESOURCES.DATA]: 0,
      [RESOURCES.XENO_BLOOM]: 0,
      [RESOURCES.FLUX_SHARD]: 0
    };

    // Card production accumulators
    this.cardAccumulators = {
      [CARDS.EXTRACTOR]: 0,
      [CARDS.SENSOR]: 0,
      [CARDS.STORAGE]: 0,
      [CARDS.PROCESSOR]: 0,
      [CARDS.REACTOR]: 0,
      [CARDS.ENGINE]: 0,
      [CARDS.HABITAT]: 0,
      [CARDS.LAB]: 0
    };

    // Production rates for each card
    this.productionRates = {};

    // Efficiency tracking for each card
    this.efficiencies = {};

    // Game metadata
    this.meta = {
      phase: 'MVP Phase 1',
      playtime: 0,
      lastSave: null,
      initialized: false
    };

    // Event bus for pub/sub
    this.listeners = new Map();

    console.log('✓ GameState initialized');
  }

  // ===== RESOURCE MUTATIONS =====

  /**
   * Add resource with fractional support (Phase 2)
   * Automatically flushes whole units and emits events
   * @param {string} type - Resource type
   * @param {number} amount - Amount to add (fractional supported)
   * @returns {boolean} Success status
   */
  addResourceAccurate(type, amount) {
    // Validation
    if (!this.resources.hasOwnProperty(type)) {
      console.warn(`Invalid resource type: ${type}`);
      return false;
    }
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.warn(`Invalid amount: ${amount}`);
      return false;
    }

    // Add to accumulator
    this.resourceAccumulators[type] += amount;

    // Flush whole units
    if (Math.abs(this.resourceAccumulators[type]) >= 1) {
      const whole = Math.floor(this.resourceAccumulators[type]);
      this.resources[type] += whole;
      this.resourceAccumulators[type] -= whole;

      // Emit event for display updates
      this.emit(EVENTS.RESOURCE_CHANGED, {
        type,
        total: this.resources[type],
        accumulated: this.resourceAccumulators[type]
      });
    }

    return true;
  }

  /**
   * Get true resource value (whole + fractional)
   * @param {string} type - Resource type
   * @returns {number} Precise value
   */
  getTrueResourceValue(type) {
    if (!this.resources.hasOwnProperty(type)) {
      return 0;
    }
    return this.resources[type] + this.resourceAccumulators[type];
  }

  /**
   * Add resource with validation (legacy method for Phase 1 compatibility)
   * @param {string} type - Resource type (ore, metal, energy, science)
   * @param {number} amount - Amount to add
   * @returns {boolean} Success status
   */
  addResource(type, amount) {
    // Validation
    if (!this.resources.hasOwnProperty(type)) {
      console.warn(`Invalid resource type: ${type}`);
      return false;
    }
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.warn(`Invalid amount: ${amount}`);
      return false;
    }

    // Phase 4 (T011): Track old value for discovery trigger
    const oldValue = this.resources[type];

    // Mutation
    this.resources[type] += amount;

    // Phase 4 (T011): Trigger discovery on 0→positive transition
    if (oldValue === 0 && this.resources[type] > 0) {
      this.discoverResource(type);
    }

    // Emit event
    this.emit(EVENTS.RESOURCE_CHANGED, {
      type,
      amount,
      total: this.resources[type]
    });

    return true;
  }

  /**
   * Subtract resource with validation (prevents negative)
   * @param {string} type - Resource type
   * @param {number} amount - Amount to subtract
   * @returns {boolean} Success status
   */
  subtractResource(type, amount) {
    // Validation
    if (!this.resources.hasOwnProperty(type)) {
      console.warn(`Invalid resource type: ${type}`);
      return false;
    }
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.warn(`Invalid amount: ${amount}`);
      return false;
    }

    // Check if we have enough
    if (this.resources[type] < amount) {
      console.warn(`Insufficient ${type}: have ${this.resources[type]}, need ${amount}`);
      return false;
    }

    // Mutation
    this.resources[type] = Math.max(0, this.resources[type] - amount);

    // Emit event
    this.emit(EVENTS.RESOURCE_CHANGED, {
      type,
      amount: -amount,
      total: this.resources[type]
    });

    return true;
  }

  /**
   * Get resource amount
   * @param {string} type - Resource type
   * @returns {number} Current amount
   */
  getResource(type) {
    return this.resources.hasOwnProperty(type) ? this.resources[type] : 0;
  }

  // === PHASE 4: RESOURCE DISCOVERY ===

  /**
   * Mark a resource as discovered (makes it visible in UI) - T009
   * @param {string} resourceType - Resource to discover
   * @returns {boolean} True if newly discovered
   */
  discoverResource(resourceType) {
    if (this.discoveredResources.has(resourceType)) {
      return false; // Already discovered
    }

    this.discoveredResources.add(resourceType);
    this.emit(EVENTS.RESOURCE_DISCOVERED, { resourceType });
    console.log(`🔍 Resource discovered: ${resourceType}`);
    return true;
  }

  /**
   * Check if a resource has been discovered - T010
   * @param {string} resourceType - Resource to check
   * @returns {boolean} True if discovered
   */
  isResourceDiscovered(resourceType) {
    return this.discoveredResources.has(resourceType);
  }

  /**
   * Check if player has enough resources
   * @param {Object} costs - { ore: 10, metal: 5, ... }
   * @returns {boolean} Has enough resources
   */
  hasResources(costs) {
    for (const [type, amount] of Object.entries(costs)) {
      if (this.getResource(type) < amount) {
        return false;
      }
    }
    return true;
  }

  // ===== PHASE 2: EFFICIENCY & PRODUCTION =====

  /**
   * Enable automated production for a card (Phase 2 - User Story 1)
   * @param {string} cardId - Card identifier
   * @returns {boolean} Success status
   */
  startAutomation(cardId) {
    const card = this.cards[cardId];
    if (!card) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    // Check if card is Tier 1+
    if (card.tier < 1) {
      console.warn(`Card ${cardId} is Tier 0 (manual only)`);
      return false;
    }

    // Check if card is placed
    if (!card.placed) {
      console.warn(`Card ${cardId} must be placed on grid first`);
      return false;
    }

    // Enable automation
    card.automated = true;

    // Get card configuration to access baseRate and outputs
    const CARD_CONFIGS = getCardConfigs();
    const cardConfig = CARD_CONFIGS[cardId];
    if (!cardConfig) {
      console.error(`No configuration found for card: ${cardId}`);
      return false;
    }

    // Initialize production rate from card config
    const baseRate = cardConfig.baseRate || 1.0;
    const outputs = cardConfig.outputs || [];
    const resourceType = outputs[0] || RESOURCES.ORE;

    this.productionRates[cardId] = {
      resourceType,
      baseRate,
      efficiency: 1.0,
      actualRate: baseRate,
      lastUpdate: performance.now()
    };

    // Calculate initial efficiency
    this.calculateCardEfficiency(cardId);

    console.log(`✓ Automation started for ${cardId} - producing ${resourceType} at ${baseRate}/sec`);
    return true;
  }

  /**
   * Disable automated production for a card
   * @param {string} cardId - Card identifier
   * @returns {boolean} Success status
   */
  stopAutomation(cardId) {
    const card = this.cards[cardId];
    if (!card) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    card.automated = false;
    console.log(`✓ Automation stopped for ${cardId}`);
    return true;
  }

  /**
   * Calculate card efficiency based on input availability
   * @param {string} cardId - Card identifier
   * @returns {number} Efficiency from 0.0 to 1.0
   */
  calculateCardEfficiency(cardId) {
    const card = this.cards[cardId];
    if (!card) {
      console.warn(`Invalid card ID: ${cardId}`);
      return 0;
    }

    // Get card configuration (fallback to card state for tests/edge cases)
    const CARD_CONFIGS = getCardConfigs();
    const cardConfig = CARD_CONFIGS[cardId];

    // Prepare efficiency object
    if (!this.efficiencies[cardId]) {
      this.efficiencies[cardId] = {
        value: 1.0,
        bottleneck: null,
        isBaseProducer: false,
        lastCalculated: 0
      };
    }
    const efficiencyObj = this.efficiencies[cardId];

    // Base producer check (no inputs required)
    // Try card state first (for tests), fall back to config
    const inputRequirements = card.inputRequirements || cardConfig?.inputRequirements || {};
    if (!inputRequirements || Object.keys(inputRequirements).length === 0) {
      efficiencyObj.value = 1.0;
      efficiencyObj.bottleneck = null;
      efficiencyObj.isBaseProducer = true;
      efficiencyObj.lastCalculated = performance.now();

      return 1.0;
    }

    // Calculate ratio for each input
    const ratios = Object.entries(inputRequirements).map(([type, required]) => {
      const available = this.getTrueResourceValue(type);
      return Math.min(available / required, 1.0);
    });

    // Efficiency = minimum ratio (bottleneck determines overall efficiency)
    const efficiency = Math.min(...ratios);
    const bottleneckIndex = ratios.indexOf(efficiency);
    const bottleneck = Object.keys(inputRequirements)[bottleneckIndex];

    // Update existing efficiency object (recycle)
    efficiencyObj.value = efficiency;
    efficiencyObj.bottleneck = bottleneck;
    efficiencyObj.isBaseProducer = false;
    efficiencyObj.lastCalculated = performance.now();

    // Update production rate if it exists
    if (this.productionRates[cardId]) {
      this.productionRates[cardId].efficiency = efficiency;
      this.productionRates[cardId].actualRate =
        this.productionRates[cardId].baseRate * efficiency;
    }

    // Emit event
    this.emit(EVENTS.CARD_EFFICIENCY_CHANGED, {
      cardId,
      efficiency: efficiencyObj
    });

    return efficiency;
  }

  /**
   * Get status LED color based on efficiency
   * @param {string} cardId - Card identifier
   * @returns {string} 'green' | 'yellow' | 'red'
   */
  getCardStatusLED(cardId) {
    const efficiency = this.efficiencies[cardId];

    if (!efficiency || efficiency.isBaseProducer) {
      return LED_STATUS.GREEN;
    }

    if (efficiency.value >= EFFICIENCY_THRESHOLDS.HIGH) return LED_STATUS.GREEN;
    if (efficiency.value >= EFFICIENCY_THRESHOLDS.MEDIUM) return LED_STATUS.YELLOW;
    return LED_STATUS.RED;
  }

  // ===== CARD MUTATIONS =====

  /**
   * Increment card production count
   * @param {string} cardId - Card identifier
   * @returns {boolean} Success status
   */
  incrementProduction(cardId) {
    if (!this.cards.hasOwnProperty(cardId)) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    this.cards[cardId].production++;

    this.emit(EVENTS.CARD_PRODUCTION, {
      cardId,
      production: this.cards[cardId].production
    });

    return true;
  }

  /**
   * Update card position on grid
   * @param {string} cardId - Card identifier
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Success status
   */
  placeCard(cardId, row, col) {
    if (!this.cards.hasOwnProperty(cardId)) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    // Validation
    if (row < 0 || row >= this.grid.rows || col < 0 || col >= this.grid.cols) {
      console.warn(`Invalid position: [${row}, ${col}]`);
      return false;
    }

    // Mutation
    this.cards[cardId].placed = true;
    this.cards[cardId].row = row;
    this.cards[cardId].col = col;

    // Emit event
    this.emit(EVENTS.CARD_PLACED, {
      cardId,
      row,
      col
    });

    console.log(`Card ${cardId} placed at [${row}, ${col}]`);
    return true;
  }

  /**
   * Remove card from grid
   * @param {string} cardId - Card identifier
   * @returns {boolean} Success status
   */
  removeCard(cardId) {
    if (!this.cards.hasOwnProperty(cardId)) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    // Mutation
    this.cards[cardId].placed = false;
    this.cards[cardId].row = null;
    this.cards[cardId].col = null;

    // Emit event
    this.emit(EVENTS.CARD_REMOVED, { cardId });

    console.log(`Card ${cardId} removed from grid`);
    return true;
  }

  /**
   * Get card state
   * @param {string} cardId - Card identifier
   * @returns {Object|null} Card state
   */
  getCard(cardId) {
    return this.cards.hasOwnProperty(cardId) ? this.cards[cardId] : null;
  }

  // ===== PHASE 3: TIER UPGRADES =====

  /**
   * Check if a card can be upgraded (Phase 3 - US1)
   * @param {string} cardId - Card identifier
   * @returns {boolean} Can upgrade
   */
  canUpgrade(cardId) {
    const card = this.cards[cardId];
    if (!card) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    // Get card configuration to check upgrade costs
    const CARD_CONFIGS = getCardConfigs();
    const cardConfig = CARD_CONFIGS[cardId];
    if (!cardConfig || !cardConfig.upgradeCosts) {
      console.warn(`No upgrade configuration for ${cardId}`);
      return false;
    }

    const nextTier = card.tier + 1;
    const upgradeCost = cardConfig.upgradeCosts[nextTier];

    if (!upgradeCost) {
      console.warn(`No upgrade available for ${cardId} tier ${card.tier}`);
      return false;
    }

    // Check if player has enough resources for all costs
    return this.hasResources(upgradeCost);
  }

  /**
   * Upgrade a card to the next tier (Phase 3 - US1)
   * Handles resource deduction, state update, and automation enabling
   * @param {string} cardId - Card identifier
   * @returns {boolean} Success status
   */
  upgradeCard(cardId) {
    const card = this.cards[cardId];
    if (!card) {
      console.warn(`Invalid card ID: ${cardId}`);
      return false;
    }

    // Atomic check - verify we can still upgrade
    if (!this.canUpgrade(cardId)) {
      console.warn(`Cannot upgrade ${cardId} - insufficient resources or no upgrade available`);
      return false;
    }

    const CARD_CONFIGS = getCardConfigs();
    const cardConfig = CARD_CONFIGS[cardId];
    const nextTier = card.tier + 1;
    const upgradeCost = cardConfig.upgradeCosts[nextTier];
    const tierBenefit = cardConfig.tierBenefits[nextTier];

    // Deduct resources (atomic - all or nothing)
    for (const [resourceType, amount] of Object.entries(upgradeCost)) {
      if (!this.subtractResource(resourceType, amount)) {
        // This shouldn't happen if canUpgrade passed, but safety check
        console.error(`Failed to deduct ${amount} ${resourceType} during upgrade`);
        return false;
      }
    }

    // Update card tier
    card.tier = nextTier;

    // Apply tier benefits
    if (tierBenefit) {
      if (tierBenefit.automation && card.placed) {
        card.automated = true;
        this.startAutomation(cardId);
      }
    }

    // Emit upgrade event
    this.emit(EVENTS.CARD_UPGRADED, {
      cardId,
      newTier: nextTier,
      automated: card.automated,
      benefits: tierBenefit
    });

    console.log(`✓ ${cardId} upgraded to Tier ${nextTier}`);
    return true;
  }

  // ===== EVENT BUS =====

  /**
   * Subscribe to events
   * @param {string} event - Event name (e.g., 'resource:changed')
   * @param {Function} callback - Handler function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from events
   * @param {string} event - Event name
   * @param {Function} callback - Handler function to remove
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all subscribers
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Event handler error for ${event}:`, err);
        }
      });
    }
  }

  // ===== SERIALIZATION =====

  /**
   * Serialize to JSON for saving (Phase 2 updated)
   * @returns {Object} Serialized state
   */
  toJSON() {
    return {
      version: this.version,
      resources: { ...this.resources },
      resourceAccumulators: { ...this.resourceAccumulators },  // Phase 2
      cardAccumulators: { ...this.cardAccumulators },          // Phase 2
      productionRates: JSON.parse(JSON.stringify(this.productionRates)), // Phase 2
      cards: JSON.parse(JSON.stringify(this.cards)), // Deep copy
      grid: { ...this.grid },
      meta: { ...this.meta },
      // Phase 4 (T014): Serialize discoveredResources Set to Array
      discoveredResources: Array.from(this.discoveredResources)
    };
  }

  /**
   * Deserialize from JSON (for loading)
   * @param {Object} data - Saved state data
   * @returns {boolean} Success status
   */
  fromJSON(data) {
    try {
      // Version check
      if (data.version !== this.version) {
        console.warn(`Save version mismatch: ${data.version} vs ${this.version}`);
        data = this.migrate(data);
      }

      // Validation
      if (!this.validate(data)) {
        console.error('Invalid save data');
        return false;
      }

      // Phase 4 (T017): Validate and recover unlock state
      data = this.validateAndRecoverUnlockState(data);

      // Restore state
      this.resources = { ...data.resources };

      // Phase 2: Restore accumulators (backwards compatible)
      this.resourceAccumulators = data.resourceAccumulators || {
        [RESOURCES.ORE]: 0, [RESOURCES.METAL]: 0, [RESOURCES.ENERGY]: 0, [RESOURCES.PROTOCOLS]: 0,
        [RESOURCES.DATA]: 0, [RESOURCES.XENO_BLOOM]: 0, [RESOURCES.FLUX_SHARD]: 0
      };
      this.cardAccumulators = data.cardAccumulators || {
        [CARDS.EXTRACTOR]: 0, [CARDS.SENSOR]: 0, [CARDS.STORAGE]: 0, [CARDS.PROCESSOR]: 0,
        [CARDS.REACTOR]: 0, [CARDS.ENGINE]: 0, [CARDS.HABITAT]: 0, [CARDS.LAB]: 0
      };
      this.productionRates = data.productionRates || {};

      this.cards = JSON.parse(JSON.stringify(data.cards));
      this.grid = { ...data.grid };
      this.meta = { ...data.meta };

      // Phase 4 (T015): Deserialize discoveredResources Array to Set
      this.discoveredResources = data.discoveredResources
        ? new Set(data.discoveredResources)
        : new Set([RESOURCES.ORE]); // Default for old saves

      // Phase 2: Recalculate efficiencies after load
      Object.keys(this.cards).forEach(cardId => {
        if (this.cards[cardId].placed && this.cards[cardId].automated) {
          this.calculateCardEfficiency(cardId);
        }
      });

      // Emit restore event
      this.emit(EVENTS.STATE_RESTORED, { data });

      console.log('✓ State restored from save');
      return true;
    } catch (err) {
      console.error('Failed to restore state:', err);
      return false;
    }
  }

  /**
   * Validate save data
   * @param {Object} data - Data to validate
   * @returns {boolean} Is valid
   */
  validate(data) {
    // Check required fields
    if (!data.version || !data.resources || !data.cards) {
      return false;
    }

    // Validate resources
    for (const value of Object.values(data.resources)) {
      if (typeof value !== 'number' || !isFinite(value) || value < 0) {
        return false;
      }
    }

    // Validate cards
    for (const card of Object.values(data.cards)) {
      if (typeof card.production !== 'number' || card.production < 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Migrate old save to new version
   * @param {Object} data - Old save data
   * @returns {Object} Migrated data
   */
  migrate(data) {
    console.log(`Migrating save from v${data.version} to v${this.version}`);

    // Phase 4 (T016): Migrate v1 to v2
    if (data.version === 1) {
      console.log('Migrating v1 → v2: Adding unlock state and discovered resources');

      // Add unlocked field to all cards
      for (const cardId of Object.keys(data.cards)) {
        if (!data.cards[cardId].hasOwnProperty('unlocked')) {
          data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
        }
      }

      // Add discoveredResources (auto-discover any resource with value > 0)
      if (!data.discoveredResources) {
        data.discoveredResources = [RESOURCES.ORE]; // ORE always discovered
        for (const [resourceType, value] of Object.entries(data.resources)) {
          if (value > 0 && resourceType !== RESOURCES.ORE) {
            data.discoveredResources.push(resourceType);
          }
        }
      }

      data.version = 2;
    }

    return data;
  }

  /**
   * Validate and recover from corrupted unlock data (T017)
   * @param {Object} data - Save data to validate
   * @returns {Object} Recovered data
   */
  validateAndRecoverUnlockState(data) {
    let needsRecovery = false;

    // Check for impossible states
    if (data.cards && data.cards[CARDS.EXTRACTOR]) {
      // Extractor must always be unlocked
      if (!data.cards[CARDS.EXTRACTOR].unlocked) {
        console.warn('⚠️  Corrupted unlock data: Extractor not unlocked');
        needsRecovery = true;
      }

      // Placed cards must be unlocked
      for (const [cardId, card] of Object.entries(data.cards)) {
        if (card.placed && !card.unlocked) {
          console.warn(`⚠️  Corrupted unlock data: Placed card '${cardId}' is not unlocked`);
          needsRecovery = true;
          break;
        }
      }
    }

    if (needsRecovery) {
      console.warn('🔧 Resetting unlock state to default (preserving resources and grid)');
      // Reset only unlock state
      for (const cardId of Object.keys(data.cards)) {
        data.cards[cardId].unlocked = (cardId === CARDS.EXTRACTOR);
      }
      // Resources, grid state, tiers all preserved
    }

    return data;
  }

  // ===== DEBUG UTILITIES =====

  /**
   * Get full state snapshot (for debugging)
   * @returns {Object} Full state
   */
  inspect() {
    return this.toJSON();
  }

  /**
   * Reset to initial state
   */
  reset() {
    const fresh = new GameState();
    this.resources = fresh.resources;
    this.cards = fresh.cards;
    this.grid = fresh.grid;
    this.meta = fresh.meta;

    this.emit(EVENTS.STATE_RESET, {});
    console.log('✓ State reset to initial values');
  }
}

// Create singleton instance
const gameState = new GameState();

// Export
export { gameState, GameState };
