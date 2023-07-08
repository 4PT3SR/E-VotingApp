const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authentication');
const {
    isAdmin
} = require('../middleware/roleauth');

router.get('/users', auth, isAdmin, adminController.getUsers);
router.patch('/users/:id/addadmin', auth, isAdmin, adminController.makeAdmin)
router.patch('/users/:id/removeadmin', auth, isAdmin, adminController.removeAdmin)

module.exports = router;