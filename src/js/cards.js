/**
 * Card system
 * Manages the 8 core cards and their interactions
 * Now uses centralized GameState
 */

import { RESOURCES, CARDS } from './constants.js';
import { CARD_CONFIGS } from './cardConfigs.js';
import { addResource, subtractResource, getResource } from './resources.js';
import { addLogEntry } from './utils.js';
import { gameState } from './state.js';
import { getConnectedNeighbors } from './grid.js';

console.log('🃏 Cards module loaded');

// Card registry (DOM elements)
const cards = {
  [CARDS.EXTRACTOR]: null,  // T01 Proton Cutter
  [CARDS.SENSOR]: null,     // T02 Ore Scanner
  [CARDS.STORAGE]: null,    // T03 Cargo Bay
  [CARDS.PROCESSOR]: null,  // T04 Refinery Module
  [CARDS.REACTOR]: null,    // Basic Reactor
  [CARDS.ENGINE]: null,     // Basic Thruster
  [CARDS.HABITAT]: null,    // Basic Quarters
  [CARDS.LAB]: null         // Basic Lab
};

// Note: CARD_CONFIGS imported from cardConfigs.js

// Handle card button clicks
function handleCardClick(cardId, buttonAction) {
  switch (cardId) {
    case CARDS.EXTRACTOR:
      // FIRE - Mine ore
      addResource(RESOURCES.ORE, 1);
      gameState.incrementProduction(cardId);
      updateCardCounter(cards[CARDS.EXTRACTOR], getResource(RESOURCES.ORE));
      addLogEntry('Proton Cutter: +1 Ore');
      flashCard(cards[CARDS.EXTRACTOR]);
      break;

    case CARDS.SENSOR:
      // SCAN - Perform scan
      gameState.incrementProduction(cardId);
      updateCardCounter(cards[CARDS.SENSOR], getResource(RESOURCES.DATA));
      addLogEntry(`Ore Scanner: Scan #${gameState.getCard(cardId).production} complete`);
      flashCard(cards[CARDS.SENSOR]);
      break;

    case CARDS.PROCESSOR:
      // REFINE - Convert 10 Ore → 1 Metal
      if (getResource(RESOURCES.ORE) >= 10) {
        subtractResource(RESOURCES.ORE, 10);
        addResource(RESOURCES.METAL, 1);
        gameState.incrementProduction(cardId);
        updateCardCounter(cards[CARDS.PROCESSOR], getResource(RESOURCES.METAL));
        addLogEntry('Refinery: -10 Ore, +1 Metal');
        flashCard(cards[CARDS.PROCESSOR]);
      } else {
        addLogEntry('Refinery: Insufficient Ore (need 10)');
        flashCard(cards[CARDS.PROCESSOR], 'error');
      }
      break;

    case CARDS.REACTOR:
      // GENERATE - Produce energy
      addResource(RESOURCES.ENERGY, 5);
      gameState.incrementProduction(cardId);
      updateCardCounter(cards[CARDS.REACTOR], getResource(RESOURCES.ENERGY));
      addLogEntry('Reactor: +5 Energy');
      flashCard(cards[CARDS.REACTOR]);
      break;

    case CARDS.LAB:
      // RESEARCH - Produce science
      addResource(RESOURCES.SCIENCE, 1);
      gameState.incrementProduction(cardId);
      updateCardCounter(cards[CARDS.LAB], getResource(RESOURCES.SCIENCE));
      addLogEntry('Lab: +1 Science');
      flashCard(cards[CARDS.LAB]);
      break;
  }
}

// Update a card's counter display
function updateCardCounter(card, value) {
  if (!card) return;
  const counterPrimary = card.querySelector('.counter-primary');
  if (counterPrimary) {
    counterPrimary.textContent = value;
  }
}

// Flash effect for visual feedback
function flashCard(card, type = 'success') {
  if (!card) return;
  const flashClass = type === 'error' ? 'flash-error' : 'flash-success';
  card.classList.add(flashClass);
  setTimeout(() => card.classList.remove(flashClass), 200);
}

// Create a card element
export function createCard(config) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.cardId = config.id;
  card.dataset.tier = config.tier || 0;

  // Make card draggable
  card.draggable = true;

  // Build body content with optional button
  let bodyContent = `
    <div class="card-icon">${config.icon || '⬡'}</div>
    ${config.button ? `<button class="card-button" data-action="${config.button.toLowerCase()}">${config.button}</button>` : ''}
    <div class="card-counter">
      <div class="counter-label">${config.counterLabel || 'COUNT'}</div>
      <div class="counter-primary">${config.counterValue || 0}</div>
      ${config.secondaryCounters ? `<div class="counter-secondary">${config.secondaryCounters}</div>` : ''}
    </div>
  `;

  // Build I/O indicators
  let ioIndicatorsHTML = '';
  const positions = ['left', 'right', 'top', 'bottom'];

  // Create output indicators (outputs go to the right by default)
  if (config.outputs && config.outputs.length > 0) {
    config.outputs.forEach((resourceType, index) => {
      const position = index === 0 ? 'right' : positions[index % positions.length];
      ioIndicatorsHTML += `<div class="card-io-indicator output ${position}" data-resource="${resourceType}" data-direction="output" data-position="${position}"></div>`;
    });
  }

  // Create input indicators (inputs come from the left by default)
  if (config.inputRequirements && Object.keys(config.inputRequirements).length > 0) {
    Object.keys(config.inputRequirements).forEach((resourceType, index) => {
      const position = index === 0 ? 'left' : positions[index % positions.length];
      ioIndicatorsHTML += `<div class="card-io-indicator input ${position}" data-resource="${resourceType}" data-direction="input" data-position="${position}"></div>`;
    });
  }

  // Card HTML structure (Phase 3 - T010: Add upgrade button)
  card.innerHTML = `
    <div class="card-header">
      <div class="card-name">${config.name}</div>
      <div class="card-tier">T${config.tier || 0}</div>
      <button class="card-upgrade-btn" data-card-id="${config.id}" title="Upgrade card">⬆</button>
      <div class="card-status">
        <div class="status-led ${config.active ? 'active' : ''}"></div>
      </div>
    </div>
    <div class="card-body">${bodyContent}</div>
    <div class="card-footer">
      <div class="status-bar">
        <div class="status-bar-fill">
          <div class="status-bar-progress" style="width: ${config.progress || 0}%"></div>
        </div>
        <div class="status-bar-text">${config.progress || 0}%</div>
      </div>
    </div>
    ${ioIndicatorsHTML}
  `;

  // Add click event listener to button if present
  if (config.button) {
    const button = card.querySelector('.card-button');
    if (button) {
      console.log(`✓ Adding click handler to ${config.name} button`);
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card drag when clicking button
        console.log(`🖱️ Button clicked: ${config.name}`);
        handleCardClick(config.id, config.button.toLowerCase());
      });
    } else {
      console.warn(`⚠️ Button not found for ${config.name}`);
    }
  }

  // Add click event listener to upgrade button (Phase 3 - T010)
  const upgradeBtn = card.querySelector('.card-upgrade-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card drag when clicking button
      console.log(`🔼 Upgrade button clicked: ${config.name}`);
      // This will be implemented in T013
      if (window.openUpgradeModal) {
        window.openUpgradeModal(config.id);
      } else {
        console.warn('openUpgradeModal not yet implemented');
      }
    });
  }

  // Add drag event handlers
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

// Drag event handlers
let draggedCard = null;
let sourceCell = null;

function handleDragStart(e) {
  draggedCard = e.target;
  sourceCell = draggedCard.parentElement;

  // Store card ID for drop handler
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', draggedCard.innerHTML);

  // Add dragging class for visual feedback
  setTimeout(() => {
    draggedCard.classList.add('dragging');
  }, 0);

  addLogEntry(`Dragging ${draggedCard.dataset.cardId}...`);
}

function handleDragEnd(e) {
  draggedCard.classList.remove('dragging');

  // Remove all drop-target highlights
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.remove('drop-target', 'drop-invalid');
  });

  draggedCard = null;
  sourceCell = null;
}

// Place a card on the grid
function placeCard(card, row, col) {
  const gridCell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
  if (gridCell && gridCell.dataset.occupied !== 'true') {
    gridCell.appendChild(card);
    gridCell.dataset.occupied = 'true';

    // Update gameState
    const cardId = card.dataset.cardId;
    gameState.placeCard(cardId, row, col);

    return true;
  }
  return false;
}

/**
 * Update I/O indicators for a card to show connections to adjacent cards
 * @param {string} cardId - The card ID to update
 */
export function updateIOIndicators(cardId) {
  const card = gameState.getCard(cardId);
  if (!card || !card.placed) return;

  // Get the DOM element
  const cardElement = document.querySelector(`.card[data-card-id="${cardId}"]`);
  if (!cardElement) return;

  // Get all I/O indicators for this card
  const indicators = cardElement.querySelectorAll('.card-io-indicator');

  // Reset all indicators to disconnected state
  indicators.forEach(indicator => {
    indicator.classList.remove('connected');
  });

  // Get connected neighbors
  const connectedNeighbors = getConnectedNeighbors(card);

  if (connectedNeighbors.length === 0) return;

  // For each connected neighbor, highlight the appropriate indicators
  connectedNeighbors.forEach(neighbor => {
    // Get neighbor's card configuration
    const neighborConfig = CARD_CONFIGS[neighbor.id];
    if (!neighborConfig) return;

    // Determine the direction from this card to the neighbor
    const rowDiff = neighbor.row - card.row;
    const colDiff = neighbor.col - card.col;

    let position = '';
    if (rowDiff === -1) position = 'top';
    else if (rowDiff === 1) position = 'bottom';
    else if (colDiff === -1) position = 'left';
    else if (colDiff === 1) position = 'right';

    // Find indicators that match this position and resource type
    indicators.forEach(indicator => {
      const indicatorPosition = indicator.dataset.position;
      const indicatorResource = indicator.dataset.resource;
      const indicatorDirection = indicator.dataset.direction;

      // Check if this indicator should be connected
      if (indicatorPosition === position) {
        // Check if the resource types match using neighbor's config
        const neighborInputs = neighborConfig.inputRequirements || {};
        const neighborOutputs = neighborConfig.outputs || [];

        if (indicatorDirection === 'output' && neighborInputs[indicatorResource]) {
          indicator.classList.add('connected');
        } else if (indicatorDirection === 'input' && neighborOutputs.includes(indicatorResource)) {
          indicator.classList.add('connected');
        }
      }
    });
  });
}

// Initialize card system
export function initCards() {
  console.log('🃏 Initializing card system...');

  // Create all 8 core cards
  cards[CARDS.EXTRACTOR] = createCard(CARD_CONFIGS[CARDS.EXTRACTOR]);
  cards[CARDS.SENSOR] = createCard(CARD_CONFIGS[CARDS.SENSOR]);
  cards[CARDS.STORAGE] = createCard(CARD_CONFIGS[CARDS.STORAGE]);
  cards[CARDS.PROCESSOR] = createCard(CARD_CONFIGS[CARDS.PROCESSOR]);
  cards[CARDS.REACTOR] = createCard(CARD_CONFIGS[CARDS.REACTOR]);
  cards[CARDS.ENGINE] = createCard(CARD_CONFIGS[CARDS.ENGINE]);
  cards[CARDS.HABITAT] = createCard(CARD_CONFIGS[CARDS.HABITAT]);
  cards[CARDS.LAB] = createCard(CARD_CONFIGS[CARDS.LAB]);

  // Place cards on grid in starting layout (2 rows of 4)
  const layout = [
    { card: cards[CARDS.EXTRACTOR], row: 0, col: 0 },
    { card: cards[CARDS.SENSOR], row: 0, col: 1 },
    { card: cards[CARDS.STORAGE], row: 0, col: 2 },
    { card: cards[CARDS.PROCESSOR], row: 0, col: 3 },
    { card: cards[CARDS.REACTOR], row: 1, col: 0 },
    { card: cards[CARDS.ENGINE], row: 1, col: 1 },
    { card: cards[CARDS.HABITAT], row: 1, col: 2 },
    { card: cards[CARDS.LAB], row: 1, col: 3 }
  ];

  let placedCount = 0;
  layout.forEach(({ card, row, col }) => {
    if (placeCard(card, row, col)) {
      placedCount++;
    }
  });

  console.log(`✓ ${placedCount}/8 cards placed on grid`);

  return cards;
}

// Expose for debugging and backwards compatibility
window.cards = cards;
window.handleCardClick = handleCardClick;
window.CARD_CONFIGS = CARD_CONFIGS;  // Backwards compatibility - prefer importing from cardConfigs.js

export { cards, CARD_CONFIGS };
