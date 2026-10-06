// Mock Data Store
let foodData = [
    { id: 101, title: "Fresh Artisan Sourdough Loaf", category: "Bakery", location: "Sugar & Spice Bakery", expiry: "Today, 8 PM", claimed: false },
    { id: 102, title: "Organic Gala Apples (5kg bag)", category: "Produce", location: "Community Garden Hub", expiry: "Tomorrow, 12 PM", claimed: false },
    { id: 103, title: "Vegan Lentil Curry (4 portions)", category: "Prepared", location: "Chef Maria's Kitchen", expiry: "Today, 9 PM", claimed: false },
    { id: 104, title: "Assorted Croissants & Bagels", category: "Bakery", location: "The Daily Bagel", expiry: "Today, 7 PM", claimed: false },
    { id: 105, title: "Crisp Spinach & Kale Bundle", category: "Produce", location: "Green Valley Farm Stand", expiry: "Tomorrow, 3 PM", claimed: false },
    { id: 106, title: "Wood-fired Margherita Pizza Boxes", category: "Prepared", location: "Trattoria Bella", expiry: "Tonight, 10 PM", claimed: false }
];

let activeCategory = 'all';

// Render Feed Grid
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
        grid.innerHTML = `<div class="col-span-full text-center py-20 bg-white/60 backdrop-blur-md rounded-[2rem] border border-slate-200/80 shadow-glass">
            <svg class="w-16 h-16 text-slate-300 mx-auto mb-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="text-base font-bold text-slate-800">No surplus items match your query</p>
            <p class="text-sm text-slate-400 mt-1">Try tweaking your search keywords or category filters.</p>
        </div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `food-card bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/80 shadow-sm flex flex-col justify-between ${item.claimed ? 'claimed-card' : ''}`;
        
        const categoryColor = {
            'Produce': 'bg-lime-50 text-lime-700 border border-lime-200/60',
            'Bakery': 'bg-amber-50 text-amber-800 border border-amber-200/60',
            'Prepared': 'bg-sky-50 text-sky-800 border border-sky-200/60'
        }[item.category] || 'bg-slate-100 text-slate-600';

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start gap-2">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 ${categoryColor} rounded-full">${item.category}</span>
                    <span class="text-xs font-semibold text-slate-400 whitespace-nowrap bg-slate-50 px-2.5 py-1 rounded-full">⏳ ${item.expiry}</span>
                </div>
                <h3 class="text-lg font-black text-slate-900 mt-4 tracking-tight">${item.title}</h3>
                <p class="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                    <span class="inline-block w-2 h-2 rounded-full bg-brand-orange"></span>
                    ${item.location}
                </p>
            </div>
            <button 
                onclick="toggleClaim(${item.id})" 
                class="mt-6 w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    item.claimed 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-brand-teal text-white shadow-md shadow-brand-teal/20 hover:bg-brand-darkTeal hover:shadow-lg'
                }"
                ${item.claimed ? 'disabled' : ''}>
                ${item.claimed ? 'Reserved Successfully ✓' : 'Claim Item Free'}
            </button>
        `;
        grid.appendChild(card);
    });
}

// Action: Claim Item with Smooth Feedback
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
        btn.classList.remove('active-btn', 'bg-brand-teal', 'text-white', 'shadow-sm');
        btn.classList.add('bg-slate-50', 'text-slate-600', 'border', 'border-slate-200/80');
    });
    event.currentTarget.classList.remove('bg-slate-50', 'text-slate-600', 'border');
    event.currentTarget.classList.add('active-btn');
    renderGrid();
}

// Action: Search Input
function filterFoodItems() {
    renderGrid();
}

// Modal Toggle with Body Scroll Lock
function toggleModal() {
    const modal = document.getElementById('donateModal');
    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Action: Handle New Donation Entry
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