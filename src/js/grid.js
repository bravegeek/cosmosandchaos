/**
 * Grid management system
 * Handles 10×10 grid with 5×4 viewport
 * Now uses centralized GameState
 */

import { gameState } from './state.js';
import { updateIOIndicators } from './cards.js';
import { addLogEntry, showErrorToast } from './utils.js';

console.log('📐 Grid module loaded');

// Grid state
const gridState = {
  rows: 4,
  cols: 5,
  cells: [] // 2D array of cell elements
};

// Create a single grid cell
function createGridCell(row, col) {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.dataset.occupied = 'false';

  // Add drop zone event handlers
  cell.addEventListener('dragover', handleDragOver);
  cell.addEventListener('dragleave', handleDragLeave);
  cell.addEventListener('drop', handleDrop);

  return cell;
}

// Drop zone handlers
function handleDragOver(e) {
  e.preventDefault(); // Allow drop

  const cell = e.currentTarget;
  const isEmpty = cell.dataset.occupied === 'false';

  // Phase 4 (T044): Check if dragged card is locked
  const draggedCard = document.querySelector('.dragging');
  const cardId = draggedCard?.dataset.cardId;
  const card = cardId ? gameState.getCard(cardId) : null;
  const isLocked = card && !card.unlocked;

  // Phase 4 (T045): Check if grid is full when placing from inventory
  let isGridFull = false;
  if (draggedCard) {
    const sourceCell = draggedCard.parentElement;
    const isFromInventory = !sourceCell?.classList.contains('grid-cell');
    if (isFromInventory) {
      const totalCells = gridState.rows * gridState.cols;
      const occupiedCount = Object.values(gameState.cards).filter(c => c.placed).length;
      isGridFull = occupiedCount >= totalCells;
    }
  }

  if (isEmpty && !isLocked && !isGridFull) {
    cell.classList.add('drop-target');
    cell.classList.remove('drop-invalid');
    e.dataTransfer.dropEffect = 'move';
  } else {
    cell.classList.add('drop-invalid');
    cell.classList.remove('drop-target');
    e.dataTransfer.dropEffect = 'none';
  }
}

function handleDragLeave(e) {
  const cell = e.currentTarget;
  cell.classList.remove('drop-target', 'drop-invalid');
}

function handleDrop(e) {
  e.preventDefault();

  const cell = e.currentTarget;
  const isEmpty = cell.dataset.occupied === 'false';

  if (!isEmpty) {
    console.warn('Cannot drop on occupied cell');
    return;
  }

  // Get the dragged card (from cards.js)
  const draggedCard = document.querySelector('.dragging');
  if (!draggedCard) return;

  const sourceCell = draggedCard.parentElement;
  const cardId = draggedCard.dataset.cardId;

  // Phase 4 (T044): Prevent placing locked cards
  const card = gameState.getCard(cardId);
  if (card && !card.unlocked) {
    console.warn(`Cannot place locked card: ${cardId}`);
    addLogEntry(`Cannot place locked card: ${cardId}`);
    return;
  }

  // Phase 4 (T045): Check if grid is full (only for new placements, not moves)
  const isMovingFromGrid = sourceCell && sourceCell.classList.contains('grid-cell');
  if (!isMovingFromGrid) {
    // Card is being placed from inventory - check if grid has space
    const totalCells = gridState.rows * gridState.cols;
    const occupiedCount = Object.values(gameState.cards).filter(c => c.placed).length;

    if (occupiedCount >= totalCells) {
      console.warn('Grid is full');
      showErrorToast('Grid is full. Remove a card first to place this one.');
      return;
    }
  }

  // Store old position for updating neighbors
  const oldRow = card ? card.row : null;
  const oldCol = card ? card.col : null;

  // Move card to new cell
  cell.appendChild(draggedCard);
  cell.dataset.occupied = 'true';

  // Update source cell
  if (sourceCell && sourceCell.classList.contains('grid-cell')) {
    sourceCell.dataset.occupied = 'false';
  }

  // Update gameState with new position
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  gameState.placeCard(cardId, row, col);

  // Update I/O indicators for this card and its neighbors
  updateIOIndicators(cardId);

  // Update indicators for all adjacent cards at the new position
  const adjacentCells = getAdjacentCells(row, col);
  adjacentCells.forEach(({ row: adjRow, col: adjCol }) => {
    const neighborCardId = Object.keys(gameState.cards).find(id => {
      const c = gameState.cards[id];
      return c.placed && c.row === adjRow && c.col === adjCol;
    });
    if (neighborCardId) {
      updateIOIndicators(neighborCardId);
    }
  });

  // Update indicators for all adjacent cards at the old position (if any)
  if (oldRow !== null && oldCol !== null) {
    const oldAdjacentCells = getAdjacentCells(oldRow, oldCol);
    oldAdjacentCells.forEach(({ row: adjRow, col: adjCol }) => {
      const neighborCardId = Object.keys(gameState.cards).find(id => {
        const c = gameState.cards[id];
        return c.placed && c.row === adjRow && c.col === adjCol;
      });
      if (neighborCardId) {
        updateIOIndicators(neighborCardId);
      }
    });
  }

  // Log the move
  if (typeof window !== 'undefined' && window.addLogEntry) {
    window.addLogEntry(`Moved ${cardId} to [${row},${col}]`);
  }

  console.log(`Card moved to [${row},${col}]`);
}

// Initialize grid system
export function initGrid() {
  console.log('📐 Initializing 5×4 grid system...');

  const gridContainer = document.querySelector('.grid-container');
  if (!gridContainer) {
    console.error('Grid container not found!');
    return gridState;
  }

  // Clear any placeholder content
  gridContainer.innerHTML = '';

  // Create 5×4 grid (20 cells)
  for (let row = 0; row < gridState.rows; row++) {
    gridState.cells[row] = [];
    for (let col = 0; col < gridState.cols; col++) {
      const cell = createGridCell(row, col);
      gridState.cells[row][col] = cell;
      gridContainer.appendChild(cell);
    }
  }

  console.log(`✓ Grid created: ${gridState.cols}×${gridState.rows} cells (${gridState.rows * gridState.cols} total)`);

  return gridState;
}

// Get cell at position
export function getCell(row, col) {
  if (row >= 0 && row < gridState.rows && col >= 0 && col < gridState.cols) {
    return gridState.cells[row][col];
  }
  return null;
}

// Check if cell is occupied
export function isCellOccupied(row, col) {
  const cell = getCell(row, col);
  return cell ? cell.dataset.occupied === 'true' : false;
}

/**
 * Get adjacent cell coordinates for a given cell (N, S, E, W)
 * @param {number} row
 * @param {number} col
 * @returns {Array<Object>} Array of {row, col} for adjacent cells
 */
export function getAdjacentCells(row, col) {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, 1], [0, -1]]; // N, S, E, W

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < gridState.rows &&
        newCol >= 0 && newCol < gridState.cols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  return neighbors;
}

/**
 * Determine if two cards are logically connected based on I/O
 * @param {Object} cardA - First card object from gameState.cards
 * @param {Object} cardB - Second card object from gameState.cards
 * @returns {boolean} True if cardA produces something cardB consumes, or vice-versa
 */
export function areCardsConnected(cardA, cardB) {
  if (!cardA || !cardB) return false;

  // Check if cardA's outputs match cardB's inputs
  const aToB = (cardA.outputs || []).some(outputType =>
    (cardB.inputRequirements && cardB.inputRequirements[outputType])
  );

  // Check if cardB's outputs match cardA's inputs
  const bToA = (cardB.outputs || []).some(outputType =>
    (cardA.inputRequirements && cardA.inputRequirements[outputType])
  );

  return aToB || bToA;
}

/**
 * Get all placed and logically connected neighbor cards for a given card.
 * A neighbor is connected if it's adjacent and has matching I/O.
 * @param {Object} card - The card object (from gameState.cards) to find neighbors for.
 * @param {Object} [state] - Optional GameState instance (defaults to global gameState for testing)
 * @returns {Array<Object>} An array of connected neighbor card objects.
 */
export function getConnectedNeighbors(card, state = gameState) {
  if (!card || !card.placed) return [];

  const connectedNeighbors = [];
  const adjacentCells = getAdjacentCells(card.row, card.col);

  for (const { row, col } of adjacentCells) {
        // Directly query state for card at adjacent position
        const neighborCardId = Object.keys(state.cards).find(id => {
          const currentCard = state.cards[id];
          return currentCard.placed &&
                 currentCard.row === row &&
                 currentCard.col === col;
        });

        if (neighborCardId) {
      const neighborCard = state.getCard(neighborCardId);

      // Check if they are logically connected
      if (neighborCard && areCardsConnected(card, neighborCard)) {
        connectedNeighbors.push(neighborCard);
      }
    }
  }
  return connectedNeighbors;
}

export { gridState };
