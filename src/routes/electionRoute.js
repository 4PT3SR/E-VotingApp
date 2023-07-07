const router = require('express').Router();
const auth = require('../middleware/authentication');
const {
    createElection,
    createPost,
    createCandidate,
    vote,
    getAllElections,
    getElection
} = require('../controllers/electionController');
const {
    isAdmin,
    isStudent
} = require('../middleware/roleauth');
const upload = require('../utils/multer')

router.post('/', createElection);
router.post('/:id/post', auth, isAdmin, createPost);
router.post('/:id/candidate', auth, isAdmin, upload.single('image'), createCandidate);
router.post('/vote', auth, isStudent, vote);
router.get('/', auth, getAllElections);
router.get('/:id', auth, getElection);
// router.get('/:id/results', auth, vote)


module.exports = router;
