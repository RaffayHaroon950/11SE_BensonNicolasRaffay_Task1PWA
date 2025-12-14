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
            
        }
}
