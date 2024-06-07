document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const viewBookshelfButton = document.getElementById('view-bookshelf');
    const bookshelfContainer = document.getElementById('bookshelf-page');
    const bookshelfDiv = document.getElementById('bookshelf');
    const backToSearchButton = document.getElementById('back-to-search');
    const searchPage = document.getElementById('search-page');

    searchInput.addEventListener('input', handleSearch);
    viewBookshelfButton.addEventListener('click', viewBookshelf);
    backToSearchButton.addEventListener('click', backToSearch);

    function handleSearch(e) {
        const query = e.target.value;
        if (query.length > 2) {
            fetch(`https://openlibrary.org/search.json?q=${query}&limit=10&page=1`)
                .then(response => response.json())
                .then(data => displayResults(data.docs));
        } else {
            searchResults.innerHTML = '';
        }
    }

    function displayResults(books) {
        searchResults.innerHTML = books.map(book => `
            <div class="book-card" style="display:flex;width:200px;height:250px;border:1px solid black;border-radius:5px">
                <p><strong>Book Title:</strong> ${book.title}</p>
                <p><strong>Edition Count:</strong>${book.edition_count ? book.edition_count: 'Unknown'}</p>
                <button id="result-button" onclick="addToBookshelf('${book.title.replace(/'/g, "\\'")}')">Add to Bookshelf</button>
            </div>
        `).join('');
    }

    function addToBookshelf(title) {
        const bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
        if (!bookshelf.includes(title)) {
            bookshelf.push(title);
            localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
            // alert(`${title} added to your bookshelf!`);
        } else {
            alert(`${title} is already in your bookshelf.`);
        }
    }

    function viewBookshelf() {
        searchPage.style.display = 'none';
        bookshelfContainer.style.display = 'block';
        const bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
        bookshelfDiv.innerHTML = bookshelf.length ? bookshelf.map(title => `
            <div class="book-card">
                <h3>${title}</h3>
                <button onclick="removeFromBookshelf('${title.replace(/'/g, "\\'")}')">Remove</button>
            </div>
        `).join('') : '<p>Your bookshelf is empty.</p>';
    }

    function backToSearch() {
        bookshelfContainer.style.display = 'none';
        searchPage.style.display = 'block';
    }

    window.addToBookshelf = addToBookshelf;
    window.removeFromBookshelf = function(title) {
        let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
        bookshelf = bookshelf.filter(book => book !== title);
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        viewBookshelf();
    };
});
