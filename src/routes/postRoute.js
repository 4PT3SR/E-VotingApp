const router = require('express').Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authentication');
const upload = require("../utils/multer");
const {isAdmin} = require('../middleware/roleauth');



router.post('/',auth,upload.single('attachment'),postController.post);
router.get('/',postController.getAllPosts);
// router.post('/seed',auth,isAdmin,postController.dummyPosts)


module.exports = router;