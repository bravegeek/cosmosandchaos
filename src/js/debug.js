/**
 * Debug Panel - Resource Manipulation for Testing
 * Toggle with Ctrl+Shift+D
 */

import { RESOURCES, DEBUG } from './constants.js';
import { gameState } from './state.js';

// Resource display names (matching the constants)
const RESOURCE_NAMES = {
  [RESOURCES.ORE]: 'Ore',
  [RESOURCES.METAL]: 'Metal',
  [RESOURCES.ENERGY]: 'Energy',
  [RESOURCES.DATA]: 'Data',
  [RESOURCES.PROTOCOLS]: 'Protocols',
  [RESOURCES.XENO_BLOOM]: 'Xeno-Bloom',
  [RESOURCES.FLUX_SHARD]: 'Flux-Shard'
};

class DebugPanel {
  constructor() {
    this.isVisible = false;
    this.panel = null;
    this.amounts = { add: 100, set: 1000 };
  }

  /**
   * Initialize the debug panel
   */
  init() {
    this.createPanel();
    this.setupKeyboardShortcut();
    if (DEBUG) console.log('🔧 Debug panel initialized (Ctrl+Shift+D to toggle)');
  }

  /**
   * Create the debug panel DOM structure
   */
  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.className = 'debug-panel hidden';
    panel.innerHTML = `
      <div class="debug-header">
        <span class="debug-title">DEBUG PANEL</span>
        <span class="debug-indicator">DEV MODE</span>
        <button class="debug-close" id="debug-close">✕</button>
      </div>
      <div class="debug-body">
        <div class="debug-section">
          <div class="debug-section-title">Resources</div>
          <div class="debug-amount-row">
            <label>Add Amount:</label>
            <input type="number" id="debug-add-amount" value="100" min="1" />
          </div>
          <div class="debug-amount-row">
            <label>Set Amount:</label>
            <input type="number" id="debug-set-amount" value="1000" min="0" />
          </div>
          <div class="debug-resources" id="debug-resources">
            ${this.createResourceControls()}
          </div>
        </div>
        <div class="debug-section">
          <div class="debug-section-title">Quick Actions</div>
          <div class="debug-actions">
            <button class="debug-btn" id="debug-add-all">+100 All</button>
            <button class="debug-btn" id="debug-clear-all">Clear All</button>
            <button class="debug-btn" id="debug-max-all">Max All (10K)</button>
            <button class="debug-btn" id="debug-discover-all">Discover All</button>
          </div>
        </div>
        <div class="debug-section">
          <div class="debug-section-title">Cards</div>
          <div class="debug-actions">
            <button class="debug-btn" id="debug-unlock-all">Unlock All Cards</button>
          </div>
        </div>
      </div>
      <div class="debug-footer">
        <span class="debug-hint">Ctrl+Shift+D to toggle</span>
      </div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;

    this.setupEventListeners();
  }

  /**
   * Create HTML for resource control buttons
   */
  createResourceControls() {
    return Object.entries(RESOURCE_NAMES).map(([key, name]) => `
      <div class="debug-resource-row" data-resource="${key}">
        <span class="debug-resource-name">${name}</span>
        <span class="debug-resource-value" data-value="${key}">0</span>
        <div class="debug-resource-btns">
          <button class="debug-btn debug-btn-sm debug-add" data-resource="${key}">+</button>
          <button class="debug-btn debug-btn-sm debug-sub" data-resource="${key}">-</button>
          <button class="debug-btn debug-btn-sm debug-set" data-resource="${key}">Set</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Setup event listeners for debug panel controls
   */
  setupEventListeners() {
    // Close button
    document.getElementById('debug-close').addEventListener('click', () => this.hide());

    // Amount inputs
    document.getElementById('debug-add-amount').addEventListener('change', (e) => {
      this.amounts.add = Math.max(1, parseInt(e.target.value) || 100);
    });
    document.getElementById('debug-set-amount').addEventListener('change', (e) => {
      this.amounts.set = Math.max(0, parseInt(e.target.value) || 1000);
    });

    // Resource controls
    this.panel.querySelectorAll('.debug-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const resource = e.target.dataset.resource;
        gameState.addResource(resource, this.amounts.add);
        this.updateResourceValues();
      });
    });

    this.panel.querySelectorAll('.debug-sub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const resource = e.target.dataset.resource;
        gameState.subtractResource(resource, this.amounts.add);
        this.updateResourceValues();
      });
    });

    this.panel.querySelectorAll('.debug-set').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const resource = e.target.dataset.resource;
        const current = gameState.getResource(resource);
        const diff = this.amounts.set - current;
        if (diff > 0) {
          gameState.addResource(resource, diff);
        } else if (diff < 0) {
          gameState.subtractResource(resource, Math.abs(diff));
        }
        this.updateResourceValues();
      });
    });

    // Quick actions
    document.getElementById('debug-add-all').addEventListener('click', () => {
      Object.keys(RESOURCE_NAMES).forEach(resource => {
        gameState.addResource(resource, 100);
      });
      this.updateResourceValues();
    });

    document.getElementById('debug-clear-all').addEventListener('click', () => {
      Object.keys(RESOURCE_NAMES).forEach(resource => {
        const current = gameState.getResource(resource);
        if (current > 0) {
          gameState.subtractResource(resource, current);
        }
      });
      this.updateResourceValues();
    });

    document.getElementById('debug-max-all').addEventListener('click', () => {
      Object.keys(RESOURCE_NAMES).forEach(resource => {
        const current = gameState.getResource(resource);
        const diff = 10000 - current;
        if (diff > 0) {
          gameState.addResource(resource, diff);
        }
      });
      this.updateResourceValues();
    });

    document.getElementById('debug-discover-all').addEventListener('click', () => {
      Object.keys(RESOURCE_NAMES).forEach(resource => {
        gameState.discoverResource(resource);
      });
    });

    document.getElementById('debug-unlock-all').addEventListener('click', () => {
      Object.keys(gameState.cards).forEach(cardId => {
        gameState.cards[cardId].unlocked = true;
      });
      // Trigger UI update
      Object.keys(gameState.cards).forEach(cardId => {
        gameState.emit('card:unlocked', { cardId, unlockType: 'debug' });
      });
    });
  }

  /**
   * Setup keyboard shortcut (Ctrl+Shift+D)
   */
  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Update resource values in the debug panel
   */
  updateResourceValues() {
    Object.keys(RESOURCE_NAMES).forEach(resource => {
      const valueEl = this.panel.querySelector(`[data-value="${resource}"]`);
      if (valueEl) {
        valueEl.textContent = Math.floor(gameState.getResource(resource));
      }
    });
  }

  /**
   * Show the debug panel
   */
  show() {
    this.isVisible = true;
    this.panel.classList.remove('hidden');
    this.updateResourceValues();
    document.body.classList.add('debug-mode-active');
  }

  /**
   * Hide the debug panel
   */
  hide() {
    this.isVisible = false;
    this.panel.classList.add('hidden');
    document.body.classList.remove('debug-mode-active');
  }

  /**
   * Toggle the debug panel visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

// Create singleton instance
export const debugPanel = new DebugPanel();

// Export for window access
if (typeof window !== 'undefined') {
  window.debugPanel = debugPanel;
}
