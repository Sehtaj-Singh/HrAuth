//external modules
const express = require(`express`);
const userRouter = express.Router();

const verifyUser = require('../middlewares/userAuthMiddleware');


//local module
const userController = require(`../controllers/userController`);

userRouter.get(`/register` , userController.getuserRegister);
userRouter.get(`/login` , userController.getuserLogin);
userRouter.post(`/register`, userController.postUserRegister);
userRouter.post(`/login`, userController.postUserLogin);




userRouter.get(`/` , userController.getHomePage);
userRouter.get(`/store` , userController.getStore);

userRouter.get(`/repair` , userController.getRepair);
userRouter.get(`/contact` , userController.getContact);


userRouter.get(`/Second-Hand/Details/:SHmobileId` , userController.getSHdetailPage);
userRouter.get(`/New/Details/:NmobileId` , userController.getNdetailPage);
userRouter.get(`/Accessory/Details/:accessoryId` , userController.getAdetailPage);

userRouter.use(verifyUser);

userRouter.get(`/orders` , userController.getOrders);

module.exports = userRouter;