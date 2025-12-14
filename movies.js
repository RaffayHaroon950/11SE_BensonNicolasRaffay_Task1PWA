let db = null;
// The current movie cards shown onscreen
let currentResults = [];

async function loadDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        const response = await fetch('moviesDatabase.db');
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));

        console.log("Database loaded!");
        runQuery(); // initial load
    }   catch (error) {
        console.log("Error loading database!")
        console.error(error)
    }
}

function runQuery() {
    if (!db) return;

    const genre = document.getElementById('genreFilter').value;
    const age = document.getElementById('ageFilter').value;
    const rating = document.getElementById('ratingFilter').value;
}
