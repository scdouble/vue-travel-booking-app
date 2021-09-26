const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const verifyToken = require ('../middleware/verify-token')

router.get('/',(req,res,next) => {
    const db = new sqlite3.Database('./db.sqlite');
    // we call the db.serialize function so that we can run the code inside the callback in sequence.
    db.serialize(()=>{
        //db.all method gets all the results returned from the query.
        db.all(
            `
            select
            bookings.*,
            catalog_items.name as catalog_item_name,
            catalog_items.description as catalog_item_description
            from bookings
            inner join catalog_items on catalog_items.id = bookings.catalog_item_id
            `,
            [],
            // The rows parameter has the results from the query.
            (err, rows=[]) => {
                res.json(rows)
            }
        );
    })
    db.close();
});

router.post('/',(req,res)=>{
    const db = new sqlite3.Database('./db.sqlite');
    const { catalogItemId, name, address, startDate, endDate} = req.body;
     db.serialize(()=>{
         const stmt = db.prepare(`
         INSERT INTO bookings (
            catalog_item_id,
            name,
            address,
            start_date,
            end_date
         ) VALUES (?,?,?,?,?)
         `);
        stmt.run(catalogItemId, name, address, startDate, endDate);
        stmt.finalize();
        res.json({catalogItemId, name, address, startDate, endDate})

     })
    db.close();
});


router.delete('/:id', verifyToken, (req, res)=>{
    const db = new sqlite3.Database('./db.sqlite');
    const {id } = req.params;
    db.serialize(()=>{
        const stmt = db.prepare("DELETE FROM bookings WHERE id = (?)");
        stmt.run(id);
        stmt.finalize();
        res.json({status: 'success'})
    })
    db.close();
});

module.exports = router;