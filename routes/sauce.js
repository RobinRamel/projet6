const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const isOwner = require('../middleware/isOwner');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauce');

router.post('/', auth, multer, sauceController.createTheSauce);
router.post('/:id/like', auth, sauceController.likeTheSauce);
router.delete('/:id', auth, isOwner, sauceController.removeTheSauce);
router.put('/:id', auth, isOwner, multer, sauceController.updateTheSauce);
router.get('/:id', auth, sauceController.getTheSauce);
router.get('/', auth, sauceController.getAllSauces);


module.exports = router;
