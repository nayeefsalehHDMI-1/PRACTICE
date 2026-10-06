// Initial default food items matching original layout
const defaultItems = [
    {
        id: 'item-1',
        name: 'Fresh Sourdough Bread',
        category: 'bakery',
        location: 'Downtown Bakery',
        time: 'Today, 8 PM'
    },
    {
        id: 'item-2',
        name: 'Organic Apples (5 kg)',
        category: 'produce',
        location: 'Green Grocery',
        time: 'Available: Tomorrow'
    },
    {
        id: 'item-3',
        name: 'Vegetable Curry Boxes',
        category: 'prepared',
        location: 'Community Kitchen',
        time: 'Available: Today, 9 PM'
    }
];

// Load items & claimed state from localStorage or defaults
let items = JSON.parse(localStorage.getItem('sharebite_items')) || defaultItems;
let claimedIds = JSON.parse(localStorage.getItem('sharebite_claimed')) || [];

let currentCategory = 'all';
let searchQuery = '';

// DOM Elements
const itemsGrid = document.getElementById('itemsGrid');
const searchInput = document.getElementById('searchInput');
const filterChips = document.querySelectorAll('.filter-chip');
const donateModal = document.getElementById('donateModal');
const openDonateModal = document.getElementById('openDonateModal');
const closeDonateModal = document.getElementById('closeDonateModal');
const donateForm = document.getElementById('donateForm');
const resetStockBtn = document.getElementById('resetStockBtn');

// Render items on page load
function renderItems() {
    itemsGrid.innerHTML = '';

    const filtered = items.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        itemsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">No items found.</p>`;
        return;
    }

    filtered.forEach(item => {
        const isClaimed = claimedIds.includes(item.id);
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div>
                <span class="badge">${item.category.toUpperCase()}</span>
                <h3 class="item-title">${item.name}</h3>
                <div class="item-details">
                    <span>📍 ${item.location}</span>
                    <span>⏰ ${item.time}</span>
                </div>
            </div>
            <button class="claim-btn" data-id="${item.id}" ${isClaimed ? 'disabled' : ''}>
                ${isClaimed ? 'Stocked Out' : 'Claim Item'}
            </button>
        `;
        itemsGrid.appendChild(card);
    });

    // Attach event listeners to claim buttons
    document.querySelectorAll('.claim-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            claimItem(id);
        });
    });
}

// Permanently stock out an item (Persisted in localStorage across reloads and new tabs)
function claimItem(id) {
    if (!claimedIds.includes(id)) {
        claimedIds.push(id);
        localStorage.setItem('sharebite_claimed', JSON.stringify(claimedIds));
        renderItems();
    }
}

// Search handler
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderItems();
});

// Category filter handlers
filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
        filterChips.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        renderItems();
    });
});

// Modal toggle handlers
openDonateModal.addEventListener('click', () => {
    donateModal.classList.add('active');
});

closeDonateModal.addEventListener('click', () => {
    donateModal.classList.remove('active');
});

donateModal.addEventListener('click', (e) => {
    if (e.target === donateModal) {
        donateModal.classList.remove('active');
    }
});

// Add new donation form submission
donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: 'item-' + Date.now(),
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        location: document.getElementById('itemLocation').value,
        time: document.getElementById('itemTime').value
    };

    items.unshift(newItem);
    localStorage.setItem('sharebite_items', JSON.stringify(items));
    
    donateForm.reset();
    donateModal.classList.remove('active');
    renderItems();
});

// Reset Stock Button Handler
resetStockBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Initial render
renderItems();