/**
 * Card Configurations
 * Static configuration data for all 8 core cards
 *
 * Updated: 2025-12-25 (Reconciliation)
 * - Canonical T0/T1 names applied
 * - All cards start at Tier 0 (manual only)
 * - Tier 1 unlocks automation for all cards
 * - Costs updated to match UPGRADE_COSTS.md
 * - Production rates aligned with reconciled design
 */

import { RESOURCES, CARDS } from './constants.js';

console.log('🃏 Card configs module loaded');

// Card configurations for all 8 core cards
export const CARD_CONFIGS = {
  [CARDS.EXTRACTOR]: {
    id: CARDS.EXTRACTOR,
    name: 'PROTON CUTTER',
    tier: 0,
    icon: '⚡',
    counterLabel: 'ORE MINED',
    counterValue: 0,
    button: 'FIRE',
    secondaryCounters: '<span>Manual: +1 Ore/click</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: {},        // Base producer - no inputs
    outputs: [RESOURCES.ORE],             // Produces ore
    baseRate: 1.0,                 // 1 ore per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 50 },              // Cost to upgrade from Tier 0 to Tier 1
      2: { [RESOURCES.ORE]: 500, [RESOURCES.METAL]: 200, [RESOURCES.ENERGY]: 100, [RESOURCES.SCIENCE]: 50 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated ore mining'
      },
      2: {
        automation: true,
        rateMultiplier: 2.5,
        description: 'Increases mining rate (+150%)'
      }
    }
  },
  [CARDS.SENSOR]: {
    id: CARDS.SENSOR,
    name: 'ORE SCANNER',
    tier: 0,
    icon: '📡',
    counterLabel: 'DATA',
    counterValue: 0,
    button: 'SCAN',
    secondaryCounters: '<span>Manual: 5 Energy → 2 Data</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.ENERGY]: 1.0 },  // Consumes 1.0 energy/sec at T1
    outputs: [RESOURCES.DATA, RESOURCES.SCIENCE],     // Produces data + passive science
    baseRate: 0.3,                 // 0.3 data per second at Tier 1
    passiveScience: 0.1,           // +0.1 science/sec passive generation (T1+)
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 120, [RESOURCES.METAL]: 40, [RESOURCES.ENERGY]: 25 },
      2: { [RESOURCES.ORE]: 1200, [RESOURCES.METAL]: 500, [RESOURCES.ENERGY]: 250, [RESOURCES.DATA]: 100, [RESOURCES.SCIENCE]: 150, [RESOURCES.NANITES]: 50 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated scanning + passive science generation'
      },
      2: {
        automation: true,
        rateMultiplier: 2.67,
        description: 'Increases scan rate (+167%)'
      }
    }
  },
  [CARDS.STORAGE]: {
    id: CARDS.STORAGE,
    name: 'CARGO BAY',
    tier: 0,
    icon: '📦',
    counterLabel: 'CAPACITY',
    counterValue: '0/1000',
    secondaryCounters: '<span>Passive +1000 cap</span>',
    progress: 0,
    // Phase 2: Passive card - no production
    inputRequirements: {},
    outputs: [],
    baseRate: 0,
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 200, [RESOURCES.METAL]: 80, [RESOURCES.ENERGY]: 50 },
      2: { [RESOURCES.ORE]: 2000, [RESOURCES.METAL]: 800, [RESOURCES.ENERGY]: 500, [RESOURCES.SCIENCE]: 200, [RESOURCES.NANITES]: 150 }
    },
    tierBenefits: {
      1: {
        automation: false,
        capacityBonus: 1000,  // +2000 total capacity at T1
        description: 'Increases storage capacity + filtered views'
      },
      2: {
        automation: false,
        capacityBonus: 8000,  // +10000 total capacity at T2
        description: 'Massive capacity increase + smart organization'
      }
    }
  },
  [CARDS.PROCESSOR]: {
    id: CARDS.PROCESSOR,
    name: 'BASIC SMELTER',
    tier: 0,
    icon: '⚙️',
    counterLabel: 'METAL',
    counterValue: 0,
    button: 'REFINE',
    secondaryCounters: '<span>Manual: 5 Ore → 2 Metal</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.ORE]: 1.0 },  // Consumes 1.0 ore/sec at T1
    outputs: [RESOURCES.METAL],            // Produces metal
    baseRate: 0.4,                  // 0.4 metal per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 75, [RESOURCES.METAL]: 20 },
      2: { [RESOURCES.ORE]: 750, [RESOURCES.METAL]: 300, [RESOURCES.ENERGY]: 150, [RESOURCES.DATA]: 50, [RESOURCES.SCIENCE]: 75 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated ore → metal conversion'
      },
      2: {
        automation: true,
        rateMultiplier: 2.5,
        description: 'Increases refining efficiency (+150%)'
      }
    }
  },
  [CARDS.REACTOR]: {
    id: CARDS.REACTOR,
    name: 'FUEL CELL',
    tier: 0,
    icon: '⚛️',
    counterLabel: 'ENERGY',
    counterValue: 0,
    button: 'IGNITE',
    secondaryCounters: '<span>Manual: Burns 2 Ore → 5 Energy</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.ORE]: 0.5 },  // Burns 0.5 ore/sec as fuel at T1
    outputs: [RESOURCES.ENERGY],          // Produces energy
    baseRate: 0.8,                 // 0.8 energy per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 100, [RESOURCES.METAL]: 30 },
      2: { [RESOURCES.ORE]: 1000, [RESOURCES.METAL]: 400, [RESOURCES.ENERGY]: 200, [RESOURCES.SCIENCE]: 100 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated energy generation'
      },
      2: {
        automation: true,
        rateMultiplier: 2.5,
        description: 'Increases energy output (+150%)'
      }
    }
  },
  [CARDS.ENGINE]: {
    id: CARDS.ENGINE,
    name: 'ION THRUSTER',
    tier: 0,
    icon: '🚀',
    counterLabel: 'NANITES',
    counterValue: 0,
    button: 'FABRICATE',
    secondaryCounters: '<span>Manual: 3 Metal + 2 Energy → 1 Nanite</span>',
    progress: 0,
    // Phase 2: Multi-input converter
    inputRequirements: { [RESOURCES.METAL]: 0.5, [RESOURCES.ENERGY]: 0.3 },  // Dual input at T1
    outputs: [RESOURCES.NANITES],
    baseRate: 0.15,                // 0.15 nanites per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 250, [RESOURCES.METAL]: 100, [RESOURCES.ENERGY]: 60, [RESOURCES.DATA]: 30, [RESOURCES.SCIENCE]: 20, [RESOURCES.XENO_BLOOM]: 40 },
      2: { [RESOURCES.ORE]: 2500, [RESOURCES.METAL]: 1000, [RESOURCES.ENERGY]: 600, [RESOURCES.DATA]: 300, [RESOURCES.SCIENCE]: 250, [RESOURCES.XENO_BLOOM]: 400, [RESOURCES.NANITES]: 200 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated nanite fabrication'
      },
      2: {
        automation: true,
        rateMultiplier: 2.67,
        description: 'Increases fabrication rate (+167%)'
      }
    }
  },
  [CARDS.HABITAT]: {
    id: CARDS.HABITAT,
    name: 'CREW QUARTERS',
    tier: 0,
    icon: '🏠',
    counterLabel: 'XENO-BLOOM',
    counterValue: 0,
    button: 'CULTIVATE',
    secondaryCounters: '<span>Manual: 5 Energy → 2 Xeno-Bloom</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.ENERGY]: 1.0 },  // Consumes energy at T1
    outputs: [RESOURCES.XENO_BLOOM],      // Produces xeno-bloom (exotic organic matter)
    baseRate: 0.3,                 // 0.3 xeno-bloom per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 180, [RESOURCES.METAL]: 60, [RESOURCES.ENERGY]: 40, [RESOURCES.XENO_BLOOM]: 30 },
      2: { [RESOURCES.ORE]: 1800, [RESOURCES.METAL]: 700, [RESOURCES.ENERGY]: 400, [RESOURCES.SCIENCE]: 150, [RESOURCES.XENO_BLOOM]: 300, [RESOURCES.NANITES]: 100 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated xeno-bloom cultivation'
      },
      2: {
        automation: true,
        rateMultiplier: 2.67,
        description: 'Increases cultivation rate (+167%)'
      }
    }
  },
  [CARDS.LAB]: {
    id: CARDS.LAB,
    name: 'RESEARCH STATION',
    tier: 0,
    icon: '🔬',
    counterLabel: 'SCIENCE',
    counterValue: 0,
    button: 'RESEARCH',
    secondaryCounters: '<span>Manual: 3 Data + 3 Energy → 1 Science</span>',
    progress: 0,
    // Phase 2: Multi-input converter
    inputRequirements: { [RESOURCES.DATA]: 0.5, [RESOURCES.ENERGY]: 0.5 },  // Dual input at T1
    outputs: [RESOURCES.SCIENCE],         // Produces science
    baseRate: 0.2,                 // 0.2 science per second at Tier 1
    // Phase 3: Tier upgrades (NO SCIENCE COST for T1 - bootstrapping!)
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 150, [RESOURCES.METAL]: 50, [RESOURCES.ENERGY]: 30, [RESOURCES.DATA]: 20 },
      2: { [RESOURCES.ORE]: 1500, [RESOURCES.METAL]: 600, [RESOURCES.ENERGY]: 300, [RESOURCES.DATA]: 200, [RESOURCES.SCIENCE]: 200, [RESOURCES.NANITES]: 75 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated research'
      },
      2: {
        automation: true,
        rateMultiplier: 3.0,
        description: 'Increases research rate (+200%)'
      }
    }
  }
};

// Expose globally for browser console access and backwards compatibility
if (typeof window !== 'undefined') {
  window.CARD_CONFIGS = CARD_CONFIGS;
}
