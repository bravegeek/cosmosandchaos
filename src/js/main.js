/**
 * Main entry point for Cosmos and Chaos
 * Phase 1: Core Grid & Cards (MVP)
 * Phase 4: Early Game State
 */

import { initGrid, getCell } from './grid.js';
import { initCards, cards } from './cards.js';
import { initResources } from './resources.js';
import { gameState } from './state.js';
import { saveManager } from './save.js';
import { productionLoop } from './production.js'; // Phase 2
import { displayManager } from './display.js'; // Phase 2
import { initModal } from './modal.js'; // Phase 3
import { ClickHandler } from './clickHandler.js'; // Phase 4
import { UnlockManager } from './unlock.js'; // Phase 4
import { CARDS, EVENTS } from './constants.js'; // Phase 4
import { debugPanel } from './debug.js'; // Debug panel

console.log('🚀 Cosmos and Chaos - Initializing...');

// Phase 4: Game managers
let clickHandler = null;
let unlockManager = null;

// Initialize save/load UI
function initSaveUI() {
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const saveStatus = document.getElementById('save-status');

  if (!saveButton || !loadButton || !saveStatus) {
    console.warn('Save UI elements not found');
    return;
  }

  // Save button handler
  saveButton.addEventListener('click', () => {
    const success = saveManager.save();
    if (success) {
      saveStatus.textContent = '✓ Game saved';
      saveStatus.style.color = '#0f0';
      setTimeout(() => {
        saveStatus.textContent = '';
      }, 2000);
    } else {
      saveStatus.textContent = '✗ Save failed';
      saveStatus.style.color = '#f00';
    }
  });

  // Load button handler
  loadButton.addEventListener('click', () => {
    const result = saveManager.load();
    if (result) {
      saveStatus.textContent = '✓ Game loaded';
      saveStatus.style.color = '#0f0';

      // Trigger UI refresh by emitting events
      // The resource and card displays should auto-update via event subscriptions
      gameState.emit('state:restored', { data: result });

      // Force full page reload to ensure UI sync
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      saveStatus.textContent = '✗ No save found';
      saveStatus.style.color = '#f00';
    }
  });

  // Update load button state based on save availability
  if (!saveManager.hasSave()) {
    loadButton.disabled = true;
    loadButton.style.opacity = '0.5';
  }

  // Subscribe to save events to update button states
  gameState.on('game:saved', () => {
    loadButton.disabled = false;
    loadButton.style.opacity = '1';
  });

  console.log('✓ Save UI initialized');
}

// Phase 4 (T019-T021): Initialize new game with pre-placed Extractor
function initializeNewGame() {
  console.log('📦 Setting up new game state...');

  // Check if this is a truly new game (no cards placed yet)
  const hasPlacedCards = Object.values(gameState.cards).some(card => card.placed);

  if (!hasPlacedCards) {
    console.log('🎮 New game detected - pre-placing Extractor at (2,2)');

    // Get the target cell (row 2, col 2)
    const targetCell = getCell(2, 2);
    if (targetCell && cards[CARDS.EXTRACTOR]) {
      // Place Extractor card on grid
      targetCell.appendChild(cards[CARDS.EXTRACTOR]);
      targetCell.dataset.occupied = 'true';

      // Update GameState
      gameState.placeCard(CARDS.EXTRACTOR, 2, 2);

      console.log('✓ Extractor placed at (2,2)');
    } else {
      console.warn('⚠️  Could not place Extractor - cell or card not found');
    }
  } else {
    console.log('📂 Existing game state detected - skipping pre-placement');
  }
}

// Phase 4 (T028-T029, T039): Initialize Phase 4 systems
function initPhase4Systems() {
  console.log('🎮 Initializing Phase 4 systems...');

  // T028: Instantiate ClickHandler
  clickHandler = new ClickHandler(gameState);
  console.log('✓ ClickHandler initialized');

  // T039: Instantiate UnlockManager
  unlockManager = new UnlockManager(gameState);
  console.log('✓ UnlockManager initialized');

  // T028: Click listeners now attached via buttons in cards.js (Phase 4)
  // attachCardClickListeners(); // Disabled - using button-based clicking instead

  // T029: Listen for rate limit events and add visual feedback
  gameState.on(EVENTS.CLICK_RATE_LIMITED, (event) => {
    const cardElement = cards[event.cardId];
    if (cardElement) {
      cardElement.classList.add('rate-limited');
      setTimeout(() => {
        cardElement.classList.remove('rate-limited');
      }, 300);
    }
  });

  // T046: Listen for card unlock events
  gameState.on(EVENTS.CARD_UNLOCKED, (event) => {
    console.log(`🔓 Card unlocked: ${event.cardId}`);
    updateCardLockStates();
  });

  // T043: Set initial lock states
  updateCardLockStates();

  console.log('✓ Phase 4 systems ready');
}

// T043-T046: Update card lock visual states
function updateCardLockStates() {
  Object.entries(cards).forEach(([cardId, cardElement]) => {
    if (!cardElement) return;

    const isLocked = !gameState.cards[cardId].unlocked;

    if (isLocked) {
      cardElement.classList.add('locked');
    } else {
      cardElement.classList.remove('locked');
    }
  });
}

// T028: Whole-card clicking disabled - now using button-based clicking (see cards.js)
// function attachCardClickListeners() {
//   console.log('🖱️  Attaching card click listeners...');
//
//   Object.entries(cards).forEach(([cardId, cardElement]) => {
//     if (!cardElement) return;
//
//     // Add click handler for manual clicks
//     cardElement.addEventListener('click', (event) => {
//       // Don't interfere with button clicks or drag operations
//       if (event.target.classList.contains('card-button') ||
//           event.target.classList.contains('card-upgrade-btn') ||
//           cardElement.classList.contains('dragging')) {
//         return;
//       }
//
//       // Attempt manual click
//       const result = clickHandler.handleClick(cardId);
//
//       if (result.success) {
//         // Visual feedback for successful click
//         cardElement.classList.add('flash-success');
//         setTimeout(() => {
//           cardElement.classList.remove('flash-success');
//         }, 200);
//       } else if (result.reason === 'insufficient_resources') {
//         // Show error feedback
//         cardElement.classList.add('flash-error');
//         setTimeout(() => {
//           cardElement.classList.remove('flash-error');
//         }, 200);
//       }
//       // Rate limit feedback is handled by CLICK_RATE_LIMITED event listener
//     });
//   });
//
//   console.log('✓ Card click listeners attached');
// }

// Initialize game systems
function init() {
  console.log('📦 Initializing game systems...');

  // Step 1: Initialize grid
  initGrid();

  // Step 2: Initialize cards
  initCards();

  // Step 3: Initialize resources
  initResources();

  // Step 4: Phase 4 - Initialize new game (pre-place Extractor if new game)
  initializeNewGame();

  // Step 5: Phase 4 - Initialize Phase 4 systems (ClickHandler, UnlockManager)
  initPhase4Systems();

  // Step 6: Initialize save system
  initSaveUI();

  // Step 7: Start auto-save (every 30 seconds)
  saveManager.startAutoSave(30000);

  // Check for existing auto-save on load
  if (saveManager.hasSave(true)) {
    const autoSaveInfo = saveManager.getSaveInfo(true);
    if (autoSaveInfo) {
      console.log(`💾 Auto-save found from ${new Date(autoSaveInfo.timestamp).toLocaleString()}`);
    }
  }

  // Step 8: Start production loop (Phase 2)
  productionLoop.start();

  // Step 9: Start display loop (Phase 2)
  displayManager.startUpdateLoop();

  // Step 10: Initialize modal system (Phase 3)
  initModal();

  // Step 11: Initialize debug panel (Ctrl+Shift+D to toggle)
  debugPanel.init();

  // Mark as initialized
  gameState.meta.initialized = true;
  console.log('✓ Game systems ready');
  console.log('Current Phase:', gameState.meta.phase);

  // Expose for console debugging
  window.gameState = gameState;
  window.productionLoop = productionLoop; // Phase 2
  window.displayManager = displayManager; // Phase 2
  window.clickHandler = clickHandler; // Phase 4
  window.unlockManager = unlockManager; // Phase 4
  window.dev = {
    state: () => console.table(gameState.toJSON()),
    resources: () => console.table(gameState.resources),
    cards: () => console.table(gameState.cards),
    save: () => saveManager.save(),
    load: () => saveManager.load(),
    export: () => console.log(saveManager.exportSave()),
    reset: () => saveManager.newGame(false),
    // Phase 2: Production debugging
    production: () => console.table(gameState.productionRates),
    efficiency: () => console.table(gameState.efficiencies),
    accumulators: () => console.table(gameState.resourceAccumulators),
    automate: (cardId) => gameState.startAutomation(cardId),
    // Phase 4: Early game debugging
    discovered: () => console.log('Discovered resources:', Array.from(gameState.discoveredResources)),
    unlocked: () => {
      const unlocked = {};
      Object.entries(gameState.cards).forEach(([id, card]) => {
        unlocked[id] = card.unlocked;
      });
      console.table(unlocked);
    },
    unlock: (cardId) => {
      gameState.cards[cardId].unlocked = true;
      gameState.emit(EVENTS.CARD_UNLOCKED, { cardId });
      console.log(`✓ Unlocked ${cardId}`);
    },
    click: (cardId) => clickHandler.handleClick(cardId),
    unlockProgress: (cardId) => console.log(unlockManager.getUnlockProgress(cardId))
  };

  console.log('💡 Tip: Use window.dev.state() to inspect game state');
  console.log('💡 Phase 4: Use window.dev.click("extractor") to test manual clicking');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { gameState };
