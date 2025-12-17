/**
 * Card Configurations
 * Static configuration data for all 8 core cards
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
    secondaryCounters: '<span>+1/click</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: {},        // Base producer - no inputs
    outputs: [RESOURCES.ORE],             // Produces ore
    baseRate: 1.0,                 // 1 ore per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 50 }              // Cost to upgrade from Tier 0 to Tier 1
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated production'
      }
    }
  },
  [CARDS.SENSOR]: {
    id: CARDS.SENSOR,
    name: 'ORE SCANNER',
    tier: 0,
    icon: '📡',
    counterLabel: 'SCANS',
    counterValue: 0,
    button: 'SCAN',
    secondaryCounters: '<span>Reveals info</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: {},        // Base producer
    outputs: [RESOURCES.DATA],            // Produces data
    baseRate: 0.5,                 // 0.5 data per second at Tier 1
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 40, [RESOURCES.DATA]: 10 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated scanning'
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
    secondaryCounters: '<span>Passive</span>',
    progress: 0,
    // Phase 2: Passive card - no production
    inputRequirements: {},
    outputs: [],
    baseRate: 0,
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 30, [RESOURCES.METAL]: 10 }
    },
    tierBenefits: {
      1: {
        automation: false,
        capacityBonus: 1000,
        description: 'Increases storage capacity'
      }
    }
  },
  [CARDS.PROCESSOR]: {
    id: CARDS.PROCESSOR,
    name: 'REFINERY',
    tier: 1,
    icon: '⚙️',
    counterLabel: 'METAL',
    counterValue: 0,
    button: 'REFINE',
    secondaryCounters: '<span>10 Ore → 1 Metal</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.ORE]: 5 },  // Requires 5 ore per cycle
    outputs: [RESOURCES.METAL],            // Produces metal
    baseRate: 0.4,                  // 0.4 metal per second (2 metal per 5 seconds)
    // Phase 3: Tier upgrades (already Tier 1, so starts at 2)
    upgradeCosts: {
      2: { [RESOURCES.METAL]: 100, [RESOURCES.ENERGY]: 50 }
    },
    tierBenefits: {
      2: {
        automation: true,
        rateMultiplier: 1.5,
        description: 'Increases refining efficiency by 50%'
      }
    }
  },
  [CARDS.REACTOR]: {
    id: CARDS.REACTOR,
    name: 'BASIC REACTOR',
    tier: 0,
    icon: '⚛️',
    counterLabel: 'ENERGY',
    counterValue: 0,
    button: 'GENERATE',
    secondaryCounters: '<span>+5/click</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: {},        // Base producer
    outputs: [RESOURCES.ENERGY],          // Produces energy
    baseRate: 5.0,                 // 5 energy per second
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 60, [RESOURCES.METAL]: 20 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated energy generation'
      }
    }
  },
  [CARDS.ENGINE]: {
    id: CARDS.ENGINE,
    name: 'BASIC THRUSTER',
    tier: 0,
    icon: '🚀',
    counterLabel: 'SPEED',
    counterValue: '0 m/s',
    secondaryCounters: '<span>Passive</span>',
    progress: 0,
    // Phase 2: Passive card - no production
    inputRequirements: {},
    outputs: [],
    baseRate: 0,
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.METAL]: 50, [RESOURCES.ENERGY]: 100 }
    },
    tierBenefits: {
      1: {
        automation: false,
        speedBonus: 50,
        description: 'Increases ship speed'
      }
    }
  },
  [CARDS.HABITAT]: {
    id: CARDS.HABITAT,
    name: 'BASIC QUARTERS',
    tier: 0,
    icon: '🏠',
    counterLabel: 'CREW',
    counterValue: '10',
    secondaryCounters: '<span>Morale: 100%</span>',
    progress: 100,
    // Phase 2: Production automation
    inputRequirements: {},        // Base producer
    outputs: [RESOURCES.BIOMASS],         // Produces biomass
    baseRate: 0.2,                 // 0.2 biomass per second
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.ORE]: 45, [RESOURCES.BIOMASS]: 20 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated biomass production'
      }
    }
  },
  [CARDS.LAB]: {
    id: CARDS.LAB,
    name: 'BASIC LAB',
    tier: 0,
    icon: '🔬',
    counterLabel: 'SCIENCE',
    counterValue: 0,
    button: 'RESEARCH',
    secondaryCounters: '<span>+1/click</span>',
    progress: 0,
    // Phase 2: Production automation
    inputRequirements: { [RESOURCES.DATA]: 2, [RESOURCES.ENERGY]: 1 },  // Requires data and energy
    outputs: [RESOURCES.SCIENCE],         // Produces science
    baseRate: 0.3,                 // 0.3 science per second
    // Phase 3: Tier upgrades
    upgradeCosts: {
      1: { [RESOURCES.DATA]: 50, [RESOURCES.ENERGY]: 30, [RESOURCES.SCIENCE]: 10 }
    },
    tierBenefits: {
      1: {
        automation: true,
        rateMultiplier: 1.0,
        description: 'Unlocks automated research'
      }
    }
  }
};

// Expose globally for browser console access and backwards compatibility
if (typeof window !== 'undefined') {
  window.CARD_CONFIGS = CARD_CONFIGS;
}
