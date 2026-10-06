// Initial Mock Data - Updated slightly for better presentation
let foodData = [
    { id: 101, title: "Freshly Baked Sourdough", category: "Bakery", location: "Sugar & Spice Bakery", expiry: "Today, 8 PM", claimed: false },
    { id: 102, title: "Organic Gala Apples (5kg)", category: "Produce", location: "Community Garden", expiry: "Tomorrow, 12 PM", claimed: false },
    { id: 103, title: "Vegan Lentil Curry (4 portions)", category: "Prepared", location: "Chef Maria's Kitchen", expiry: "Today, 9 PM", claimed: false },
    { id: 104, title: "Assorted Bagels & Pastries", category: "Bakery", location: "The Daily Bagel", expiry: "Today, 7 PM", claimed: false },
];

let activeCategory = 'all';

// Render Listings inside App Feed
function renderGrid() {
    const grid = document.getElementById('foodGrid');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    
    grid.innerHTML = '';

    // Filter logic
    const filtered = foodData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchVal) || item.location.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    // Empty state
    if(filtered.length === 0) {
        grid.innerHTML = `<div class="text-center text-slate-500 py-16 px-6 bg-white rounded-2xl border border-slate-100">
            <svg class="w-16 h-16 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="mt-6 text-base font-medium">No items match your search.</p>
            <p class="mt-1 text-sm text-slate-400">Try adjusting your keywords or filters.</p>
        </div>`;
        return;
    }

    // Render cards
    filtered.forEach(item => {
        const card = document.createElement('div');
        // Card styling with subtle borders
        card.className = `bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow ${item.claimed ? 'claimed-card' : ''}`;
        
        const categoryColor = {
            'Produce': 'bg-lime-50 text-lime-700 border border-lime-100',
            'Bakery': 'bg-amber-50 text-amber-800 border border-amber-100',
            'Prepared': 'bg-sky-50 text-sky-800 border border-sky-100'
        }[item.category] || 'bg-slate-100 text-slate-600';

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start gap-3">
                    <span class="text-[11px] font-bold uppercase px-2.5 py-1 ${categoryColor} rounded-full tracking-wide">${item.category}</span>
                    <span class="text-xs text-slate-400 font-medium whitespace-nowrap">⏳ ${item.expiry}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-950 mt-3 leading-tight">${item.title}</h3>
                <p class="text-sm text-slate-600 mt-1.5 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L8.343 16.657M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" transform="translate(0, -7)"></path></svg>
                    ${item.location}
                </p>
            </div>
            <button 
                onclick="toggleClaim(${item.id})" 
                class="mt-5 w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    item.claimed 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-brand-orange text-white shadow-sm hover:bg-orange-600'
                }"
                ${item.claimed ? 'disabled' : ''}>
                ${item.claimed ? 'Item Reserved' : 'Claim This Item'}
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
        // Provide immediate visual feedback
        renderGrid();
        // Optional: You could add a browser notification here
    }
}

// Action: Filter Categories
function setFilter(cat) {
    activeCategory = cat;
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active-btn', 'bg-brand-teal', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-100');
    });
    event.currentTarget.classList.remove('bg-white', 'text-slate-600');
    event.currentTarget.classList.add('active-btn');
    renderGrid();
}

// Action: Search Input (Debounced for performance if data were large)
function filterFoodItems() {
    renderGrid();
}

// Modal Toggle
function toggleModal() {
    const modal = document.getElementById('donateModal');
    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
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

    foodData.unshift(newFood); // Add to start of list
    renderGrid();
    toggleModal();
    document.getElementById('donationForm').reset();
    
    // Optional: Confirmation message
    // alert('Thank you for sharing food!');
}

// Initial Load
document.addEventListener('DOMContentLoaded', renderGrid);