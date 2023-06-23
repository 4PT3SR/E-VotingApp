const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('you may have reached the test route');
});

module.exports = router;