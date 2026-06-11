const db = require('../config/db');

exports.getItemTypes = (req,res)=>{

    const sql = `
        SELECT *
        FROM item_types
    `;

    db.query(sql,(err,result)=>{

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
};
exports.createItem = (req, res) => {

    const {
        name,
        purchase_date,
        stock_available,
        item_type_id
    } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({
            message: "Item Name is required"
        });
    }

    if (!purchase_date) {
        return res.status(400).json({
            message: "Purchase Date is required"
        });
    }

    if (!item_type_id) {
        return res.status(400).json({
            message: "Item Type is required"
        });
    }

    const sql = `
        INSERT INTO items
        (
            name,
            purchase_date,
            stock_available,
            item_type_id
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            purchase_date,
            stock_available,
            item_type_id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Item Added Successfully"
            });
        }
    );
};
exports.getItems = (req, res) => {

    const sql = `
        SELECT
            i.id,
            i.name,
            i.purchase_date,
            i.stock_available,
            it.type_name
        FROM items i
        INNER JOIN item_types it
            ON i.item_type_id = it.id
        ORDER BY i.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};
exports.updateItem = (req, res) => {

    const { id } = req.params;

    const {
        name,
        purchase_date,
        stock_available,
        item_type_id
    } = req.body;

    if (!name || !purchase_date || !item_type_id) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    const sql = `
        UPDATE items
        SET
            name = ?,
            purchase_date = ?,
            stock_available = ?,
            item_type_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            purchase_date,
            stock_available,
            item_type_id,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if(result.affectedRows === 0){
            return res.status(404).json({
            message: "Item not found"
            });
            }
            res.json({
                message: "Item Updated Successfully"
            });
        }
    );
};
exports.deleteItem = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM items
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }
        if(result.affectedRows === 0){
        return res.status(404).json({
        message: "Item not found"
         });
        }
        res.json({
            message: "Item Deleted Successfully"
        });
    });
};