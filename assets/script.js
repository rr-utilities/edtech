const searchInput = document.querySelector('.search-bar');
const appItems = document.querySelectorAll('.app-item');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    appItems.forEach(item => {
        const title = item.querySelector('.app-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});