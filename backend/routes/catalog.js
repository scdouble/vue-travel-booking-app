const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const verifyToken = require('../middleware/verify-token')

router.get('/', (req, res) => {
    const db = new sqlite3.Database('./db.sqlite');
    db.serialize(() => {
        db.all("SELECT * from catalog_items", [], (err, rows = []) => {
            res.json(rows)
        });
    })
    db.close();
})

router.post('/', verifyToken, (req, res,) => {
    const {name, description, imageUrl} = req.body
    const db = new sqlite3.Database('./db.sqlite');
    db.serialize(() => {
        const stmt = db.prepare(`
        INSERT INTO catalog_items (
        name,
        description,
        image_url
        ) VALUES (?, ?, ?)
        `
        );
        stmt.run(name, description, imageUrl)
        stmt.finalize();
        res.json({status: 'success'})
    })
    db.close();
});

router.delete('/:id', verifyToken, (req, res) => {
    const {id} = req.params;
    const db = new sqlite3.Database('./db.sqlite');
    db.serialize(() => {
        const stmt = db.prepare("delete from catalog_items where id = (?)");
        stmt.run(id);
        stmt.finalize();
        res.json({status: 'success'})
    })
    db.close();
})

module.exports = router;
