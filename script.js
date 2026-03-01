/**
 * EcoTap - Smart Bin Demo Application
 * AMD Slingshot Hackathon Submission
 */

// Application State
const appState = {
    transitBalance: 0,
    totalEarned: 0,
    bottlesCount: 0,
    cansCount: 0,
    rejectedCount: 0,
    co2Saved: 0,
    isProcessing: false
};

// Constants
const RATES = {
    bottle: 5,    // ₹5 per bottle
    can: 2,       // ₹2 per can
    trash: 0      // No credit for trash
};

const CO2_SAVED_PER_ITEM = {
    bottle: 0.082, // kg CO2 saved per bottle recycled
    can: 0.014    // kg CO2 saved per can recycled
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeDemo();
    setupEventListeners();
});

function initializeDemo() {
    console.log('EcoTap Demo initialized');
    updateUI();
    addLogEntry('System initialized - AMD Ryzen AI ready', 'system');
}

function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Main deposit function
function depositItem(itemType) {
    if (appState.isProcessing) return;
    
    appState.isProcessing = true;
    
    const depositSlot = document.querySelector('.deposit-slot');
    const detectionStatus = document.getElementById('detection-text');
    
    // Visual feedback - item being processed
    depositSlot.classList.add('active');
    detectionStatus.textContent = 'Processing...';
    detectionStatus.className = '';
    
    // Simulate AI processing delay
    setTimeout(() => {
        processDeposit(itemType);
        appState.isProcessing = false;
    }, 1500);
}

function processDeposit(itemType) {
    const detectionStatus = document.getElementById('detection-text');
    const depositSlot = document.querySelector('.deposit-slot');
    
    let result;
    
    if (itemType === 'bottle') {
        appState.bottlesCount++;
        appState.transitBalance += RATES.bottle;
        appState.totalEarned += RATES.bottle;
        appState.co2Saved += CO2_SAVED_PER_ITEM.bottle;
        
        detectionStatus.textContent = 'PET Bottle detected - ₹5 credited!';
        detectionStatus.className = 'success';
        addLogEntry(`PET Bottle deposited +₹${RATES.bottle}`, 'success');
        
        // Animate the screen
        animateScreen('success');
        
    } else if (itemType === 'can') {
        appState.cansCount++;
        appState.transitBalance += RATES.can;
        appState.totalEarned += RATES.can;
        appState.co2Saved += CO2_SAVED_PER_ITEM.can;
        
        detectionStatus.textContent = 'Aluminum Can detected - ₹2 credited!';
        detectionStatus.className = 'success';
        addLogEntry(`Aluminum Can deposited +₹${RATES.can}`, 'success');
        
        // Animate the screen
        animateScreen('success');
        
    } else if (itemType === 'trash') {
        appState.rejectedCount++;
        
        detectionStatus.textContent = 'Invalid item - Rejected';
        detectionStatus.className = 'error';
        addLogEntry('Non-recyclable item rejected', 'error');
        
        // Animate the screen
        animateScreen('error');
    }
    
    // Reset deposit slot visual
    setTimeout(() => {
        depositSlot.classList.remove('active');
        detectionStatus.textContent = 'Waiting for item...';
        detectionStatus.className = '';
    }, 2000);
    
    updateUI();
}

function animateScreen(type) {
    const binScreen = document.querySelector('.bin-screen');
    const originalColor = 'rgb(10, 10, 15)';
    
    if (type === 'success') {
        binScreen.style.background = 'rgba(0, 212, 170, 0.2)';
        binScreen.style.borderColor = 'rgba(0, 212, 170, 0.8)';
    } else if (type === 'error') {
        binScreen.style.background = 'rgba(255, 107, 53, 0.2)';
        binScreen.style.borderColor = 'rgba(255, 107, 53, 0.8)';
    }
    
    setTimeout(() => {
        binScreen.style.background = originalColor;
        binScreen.style.borderColor = 'rgba(0, 212, 170, 0.2)';
    }, 1000);
}

function updateUI() {
    // Update transit card balance
    document.getElementById('transit-balance').textContent = `₹${appState.transitBalance}`;
    document.getElementById('total-earned').textContent = `₹${appState.totalEarned}`;
    
    // Update session stats
    document.getElementById('bottles-count').textContent = appState.bottlesCount;
    document.getElementById('cans-count').textContent = appState.cansCount;
    document.getElementById('rejected-count').textContent = appState.rejectedCount;
    document.getElementById('co2-saved').textContent = `${appState.co2Saved.toFixed(3)} kg`;
}

function addLogEntry(message, type = 'system') {
    const logContainer = document.getElementById('transaction-log');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
    
    // Add to top of log
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { depositItem, appState, RATES };
}
