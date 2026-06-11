const express = require('express');

const router = express.Router();

const itemController = require('../controllers/itemController');

router.get('/types', itemController.getItemTypes);

// Add Item
router.post('/', itemController.createItem);
router.get('/', itemController.getItems);
//update Item
router.put('/:id', itemController.updateItem);
//delete Item
router.delete('/:id', itemController.deleteItem);
module.exports = router;