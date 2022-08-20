const router = require('express').Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authentication');
const {isAdmin} = require('../middleware/roleauth');

router.post('/post/:id/comment',auth,commentController.comment);

router.delete('/comment/:id',auth,isAdmin,commentController.deleteComment);




module.exports = router;