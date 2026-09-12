// Initial Mock Data
let foodData = [
    { id: 1, title: "Fresh Sourdough Bread", category: "Bakery", location: "Downtown Bakery", expiry: "Today, 8 PM", claimed: false },
    { id: 2, title: "Organic Apples (5 kg)", category: "Produce", location: "Green Grocery", expiry: "Tomorrow", claimed: false },
    { id: 3, title: "Vegetable Curry Boxes", category: "Prepared", location: "Community Kitchen", expiry: "Today, 9 PM", claimed: false }
];

let activeCategory = 'all';

// Render Listings
function renderGrid() {
    const grid = document.getElementById('foodGrid');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    
    grid.innerHTML = '';

    const filtered = foodData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchVal) || item.location.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    if(filtered.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No items found.</p>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between ${item.claimed ? 'claimed-card' : ''}`;
        
        card.innerHTML = `
            <div>
                <span class="text-xs font-semibold uppercase px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">${item.category}</span>
                <h3 class="text-lg font-bold text-gray-900 mt-2">${item.title}</h3>
                <p class="text-sm text-gray-500 mt-1">📍 ${item.location}</p>
                <p class="text-sm text-gray-500">⏰ Available: ${item.expiry}</p>
            </div>
            <button 
                onclick="toggleClaim(${item.id})" 
                class="mt-4 w-full py-2 px-4 rounded-lg font-medium transition ${
                    item.claimed 
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }"
                ${item.claimed ? 'disabled' : ''}>
                ${item.claimed ? 'Reserved' : 'Claim Item'}
            </button>
        `;
        grid.appendChild(card);
    });
}

// Action: Reserve/Claim Item
function toggleClaim(id) {
    const item = foodData.find(f => f.id === id);
    if (item && !item.claimed) {
        item.claimed = true;
        renderGrid();
    }
}

// Action: Filter Categories
function setFilter(cat) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active-btn');
    });
    event.target.classList.add('active-btn');
    renderGrid();
}

// Action: Search Input
function filterFoodItems() {
    renderGrid();
}

// Modal Toggle
function toggleModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

// Action: Handle New Donation
function handleDonate(e) {
    e.preventDefault();
    const newFood = {
        id: Date.now(),
        title: document.getElementById('foodTitle').value,
        category: document.getElementById('foodCategory').value,
        location: document.getElementById('foodLocation').value,
        expiry: document.getElementById('foodExpiry').value,
        claimed: false
    };

    foodData.unshift(newFood);
    renderGrid();
    toggleModal();
    document.getElementById('donationForm').reset();
}

// Initial Load
document.addEventListener('DOMContentLoaded', renderGrid);