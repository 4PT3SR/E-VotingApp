const router = require('express').Router();
const dataController = require('../controllers/dataController')
const auth = require('../middleware/authentication');
const {
    isAdmin
} = require('../middleware/roleauth');

router.post('/', auth, isAdmin, dataController.createData);
router.get('/:dataTitle', dataController.getData);


module.exports = router;