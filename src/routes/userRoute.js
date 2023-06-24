const router = require('express').Router();
const userController = require('../controllers/userController');
// const auth = require('../middleware/authentication')



router.post('/register', userController.register);




router.post('/login', userController.login);
// router.post('/logout', userController.logout);




// router.patch('/resetpassword/:passwordresetToken',userController.setPassword);
// router.post('/resetpassword',userController.resetPassword);

// router.post('/logout',auth,userController.logout);
// router.post('/logoutall',auth,userController.logoutAll);
// router.get('/staff',auth,rolecheck.staff,userController.staff)


// router.get('/manager',auth,rolecheck.manager,userController.manager)
// router.get('/admin',auth,rolecheck.admin,userController.admin)



module.exports = router;