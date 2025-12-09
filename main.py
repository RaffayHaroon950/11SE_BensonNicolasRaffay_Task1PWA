from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('moviesDatabase.db')
    # To access tables by columns and not just rows:
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET', 'POST'])


def index():

    conn = get_db_connection()

    items = conn.execute('SELECT id, Name FROM Movies').fetchall()
    selected_item_text = None

    if request.method == 'POST':
        selected_item_id = request.form['item_dropdown']
        selected_item = conn.execute('SELECT * FROM Movies WHERE id = ?', (selected_item_id,))

        if selected_item:
            selected_item_text = f"Year: {selected_item['Year']}"

    
    conn.close()
    return render_template("movies.html", items=items, selected_item_text=selected_item_text)

if __name__ == '__main__':
    try:
        # Does the file exist?
        with open('moviesDatabase.db', 'r'):
            app.run(debug=True)
    except FileNotFoundError:
        print("WHERE'S MEE FILEEE??")

