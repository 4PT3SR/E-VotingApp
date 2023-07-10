const router = require('express').Router();
const auth = require('../middleware/authentication');
const {
    createElection,
    createPost,
    createCandidate,
    vote,
    getAllElections,
    getElection,
    getPost
} = require('../controllers/electionController');
const {
    isAdmin,
    isStudent
} = require('../middleware/roleauth');
const upload = require('../utils/multer')

router.post('/', createElection);
router.post('/:id/post', auth, isAdmin, createPost);
router.post('/posts/:id/candidate', auth, isAdmin, upload.single('image'), createCandidate);
router.post('/vote', auth, isStudent, vote);
router.get('/', getAllElections);
router.get('/:id', getElection);
router.get('/posts/:id', getPost)
// router.get('/:id/results', auth, vote)


module.exports = router;
