const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.sqlite3');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database');
  }
});

// module.exports = db

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

module.exports = {
    executeQuery,
    db
};