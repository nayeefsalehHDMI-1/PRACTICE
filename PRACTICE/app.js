// Initial Mock Data
let foodData = [
    { id: 1, title: "Fresh Sourdough Bread", category: "Bakery", location: "Downtown Bakery", expiry: "Today, 8 PM", claimed: false },
    { id: 2, title: "Organic Apples (5 kg)", category: "Produce", location: "Green Grocery", expiry: "Tomorrow", claimed: false },
    { id: 3, title: "Vegetable Curry Boxes", category: "Prepared", location: "Community Kitchen", expiry: "Today, 9 PM", claimed: false }
];

let activeCategory = 'all';

// Render Listings inside App Feed
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
        grid.innerHTML = `<div class="text-center text-gray-400 py-12 text-sm">No items found.</div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between ${item.claimed ? 'claimed-card' : ''}`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start">
                    <span class="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md">${item.category}</span>
                    <span class="text-xs text-gray-400 font-medium">${item.expiry}</span>
                </div>
                <h3 class="text-base font-bold text-gray-900 mt-1.5">${item.title}</h3>
                <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1">📍 ${item.location}</p>
            </div>
            <button 
                onclick="toggleClaim(${item.id})" 
                class="mt-3 w-full py-2 px-4 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    item.claimed 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
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
        btn.classList.remove('active-btn', 'bg-emerald-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    event.target.classList.remove('bg-gray-100', 'text-gray-700');
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