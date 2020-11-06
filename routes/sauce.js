const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauce');

router.post('/', auth, multer, sauceController.createTheSauce);
router.post('/:id/like', auth, sauceController.likeTheSauce);
router.delete('/:id', auth, sauceController.removeTheSauce);
router.put('/:id', auth, multer, sauceController.updateTheSauce);
router.get('/:id', auth, sauceController.getTheSauce);
router.get('/', auth, sauceController.getAllSauces);


module.exports = router;
