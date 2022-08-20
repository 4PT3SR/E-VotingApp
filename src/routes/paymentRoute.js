const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authentication');
// const upload = require("../utils/multer");


router.post('/payment',auth,paymentController.payment);
router.get('/payment/verify',auth,paymentController.verifyPayment);


module.exports = router;