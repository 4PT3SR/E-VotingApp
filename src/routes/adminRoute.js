const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authentication');
const {isAdmin} = require('../middleware/roleauth');

router.post('/admin/register',auth,isAdmin,adminController.registerAdmin);

module.exports = router;