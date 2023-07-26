const router = require('express').Router();
const auth = require('../middleware/authentication');
const {
    createElection,
    createPost,
    createCandidate,
    vote,
    getAllElections,
    getElection,
    getPost,
    getResult
} = require('../controllers/electionController');
const {
    isAdmin,
    isStudent
} = require('../middleware/roleauth');
const {
    isElectionActive
} = require('../middleware/isElectionActive');
const {
    isEligible
} = require('../middleware/isEligible');
const {
    electionEnded
} = require('../middleware/electionEnded')
const upload = require('../utils/multer')

router.post('/', auth, isAdmin, createElection);
router.post('/:id/post', auth, isAdmin, createPost);
router.post('/posts/:id/candidate', auth, isAdmin, upload.single('image'), createCandidate);
router.post('/:electionId/candidate/:candidateId/vote', auth, isStudent, isElectionActive, isEligible, vote);
router.get('/', getAllElections);
router.get('/:id', getElection);
router.get('/posts/:id', getPost);
router.get('/:electionId/posts/:postId/result', electionEnded, getResult);
// router.get('/:id/results', auth, vote)


module.exports = router;