let db = null;
// The current movie cards shown onscreen
let currentResults = [];

// Make 'slug' version of string

function makeSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

async function loadDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        const response = await fetch('moviesDatabase.db');
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));

        console.log("Database loaded!");
        runQuery(getCurrentSort()); // initial load
    }   catch (error) {
        console.log("Error loading database!")
        console.error(error)
    }
}

function getCurrentSort() {
    const popFilter = document.getElementById('popFilter');
    return popFilter ? popFilter.value || "MOST POPULAR": "MOST POPULAR";
}

function runQuery(order = "MOST POPULAR") {
    if (!db) return;

    let temp = document.getElementById('genreFilter').value;
    const genre = `${temp.charAt(0).toUpperCase()}${temp.toLowerCase().slice(1)}`;
    const age = document.getElementById('ageFilter').value;
    const rating = document.getElementById('ratingFilter').value;
    const search = document.getElementById('searchInput').value.trim();
    const type = document.getElementById('typeFilter').value;

    let query = `
        SELECT Movies.rowid, Movies.Name, Movies.Rating, Movies.AgeRating, Movies.Medium
        FROM Movies
        WHERE 1=1
    `;
    const params = [];

    if (age !== "") {
        query += " AND Movies.AgeRating = ?";
        params.push(age);
    }
    if (rating !== "") {
        query += " And Movies.Rating = ?";
        params.push(parseInt(rating, 10));
    }
    if (genre !== "") {
        query += `
            AND EXISTS (
                SELECT 1 FROM MovieGenres
                WHERE MovieGenres.MovieName = Movies.Name
                    AND MovieGenres.Genre = ?
            )
        `;
        params.push(genre)
    }
    if (search !== "") {
        query += " AND Movies.Name LIKE ?";
        params.push(`%${search}%`);
    }
    if (type !== "") {
        query += "AND Movies.Medium = ?";
        params.push(type);
    }

    if (order === "MOST POPULAR") {
        query += " ORDER BY CAST(Movies.Rating AS INTEGER) DESC, Movies.Name COLLATE NOCASE ASC";
    } else if (order === "A-Z") {
        query += " ORDER BY Movies.Name COLLATE NOCASE ASC";
    } else if (order === "TOP BOX OFFICE") {
        query += " ORDER BY Movies.BoxOffice COLLATE NOCASE DESC";
    } else if (order === "NEWEST") {
        query += " ORDER BY Movies.Year COLLATE NOCASE DESC";
    }

    const stmt = db.prepare(query);
    stmt.bind(params);

    currentResults = []; // reset
    while (stmt.step()) {
        const row = stmt.getAsObject();
        row.Rating = Number(row.Rating) || 0;
        currentResults.push(stmt.getAsObject());
    }
    stmt.free()

    // By default, sort by popularity
    renderCards();
    updatePageTitle(order);
}

// Update page title dynamically
function updatePageTitle(order) {
    const age = document.getElementById('ageFilter').value;
    const rating = document.getElementById('ratingFilter').value;
    let temp = document.getElementById('genreFilter').value;
    const genre = `${temp.charAt(0).toUpperCase()}${temp.toLowerCase().slice(1)}`;
    const type = document.getElementById('typeFilter').value;

    let baseLabel;
    if(type === "movie") {
        baseLabel = "Movies";
    } else if (type === "show") {
        baseLabel = "Shows";
    } else {
        baseLabel = "Picks";
    }

    let parts = [];
    if (age) parts.push(`${age} Rated`);
    if (genre) parts.push(genre);
    
    let title;
    if (order === "MOST POPULAR") {
        if (parts.length > 0) {
            title = `Best ${parts.join(" ")} ${baseLabel}}`;
        } else {
            title = `Best ${baseLabel}`;
        }
    } else {
        if (parts.length > 0) {
            title = `${parts.join(" ")} ${baseLabel}`;
        } else {
            title = baseLabel;
        }
    }

    document.getElementById('pageTitle').textContent = title;
}

function renderCards() {
    const container = document.getElementById('movieCardContainer');
    container.innerHTML = '';

    if (currentResults.length === 0) {
        const msg = document.createElement('div');
        msg.className = "no-movies";
        msg.style = "text-align: center; width: 300px;";
        msg.innerHTML = `
            <img src="no-movies.png" width="200">
            <h2>Not in season just yet!</h2>
        `
        container.appendChild(msg);
        return;
    }

    currentResults.forEach(row => {
        const slug = makeSlug(row.Name);
        const card = document.createElement('a');
        card.href = `/movies/${slug}.html`
        card.className = "movie-card";
        card.innerHTML = `
            <img src="posters/${row.rowid}.png" alt="${row.Name} poster" class="poster">
            <h3>${row.Name}</h3>
            <p>${row.Medium.charAt(0).toUpperCase()}${row.Medium.toLowerCase().slice(1)}</p>
            <img src="stars_${row.Rating}.png" alt="" class="rating-icon" aria-hidden="true">
        `;
        container.appendChild(card)
    });
}

function sortResults(order) {
    if (order === "MOST POPULAR") {
        currentResults.sort((a, b) => b.Popularity - a.Popularity);
    } else if (order === "A-Z") {
        currentResults.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (order === "NEWEST") {
        currentResults.sort((a, b) => b.Year - a.Year);
    } else if (order === "TOP BOX OFFICE") {
        currentResults.sort((a, b) => b.BoxOffice - a.BoxOffice);
    }
    renderCards();
    updatePageTitle(order);
}

function resetFilters() {
    document.getElementById('ageFilter').value = "";
    document.getElementById('ratingFilter').value = "";
    document.getElementById('genreFilter').value = "";
    document.getElementById('popFilter').value = "MOST POPULAR";
    document.getElementById('searchInput').value = "";
    document.getElementById('typeFilter').value = "";
    
    runQuery()
}

// Hook elements up to event listeners

['ageFilter', 'ratingFilter', 'genreFilter', 'typeFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        runQuery(getCurrentSort())
    });
});

document.getElementById('popFilter').addEventListener('change', (e) => {
    runQuery(e.target.value);
});

document.getElementById('selectReset').addEventListener('click', resetFilters);

document.getElementById('searchInput').addEventListener('input', () => {
    runQuery(getCurrentSort());
});

document.getElementById('searchBtn').addEventListener('click', () => {
    runQuery(getCurrentSort());
})

loadDatabase();
