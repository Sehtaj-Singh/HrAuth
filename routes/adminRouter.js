//external module
const express = require(`express`);
const adminRouter = express.Router();
// const verifyAdmin = require('../middlewares/authMiddleware');


//local module
const adminController = require(`../controllers/admin/adminController`);
const SHcontroller = require(`../controllers/admin/SHcontroller`);
const Ncontroller = require(`../controllers/admin/Ncontroller`);
const Acontroller = require(`../controllers/admin/Acontroller`);
const repairController = require(`../controllers/admin/repairController`);

const upload = require('../middlewares/multer');  // ✅ Import multer




//adminController

adminRouter.get(`/login`, adminController.getAdminLogin);
// सभी /Admin रूट्स को secure करें:

// 🔐 all routes below are protected
// adminRouter.use(verifyAdmin);

adminRouter.post("/logout", (req, res) => {
  res.clearCookie("session"); // 🍪 delete the session
  res.redirect("/Admin/login"); // 🔄 go back to login page
});

adminRouter.get(`/addMobile`, adminController.getAddMobile);
adminRouter.get(`/addMobile/Second-Hand`, adminController.getSHaddMobile);
adminRouter.get(`/addMobile/New`, adminController.getNaddMobile);
adminRouter.get(`/addMobile/Accessory`, adminController.getAaddMobile);
adminRouter.get(`/repair`, adminController.getrepair);
adminRouter.get(`/order`, adminController.getorder);
adminRouter.get(`/mobileList`, adminController.getMobileList);
adminRouter.get(`/repair/Add/Queue`, adminController.getAddRepairQueue);


//SHController
adminRouter.post("/addMobile/Second-Hand", upload.single('SHimage'), SHcontroller.postSHaddMobile);
adminRouter.post(`/mobileList/delete/SH/:SHmobileId`, SHcontroller.postDeleteSHmobile);


//NController
adminRouter.post("/addMobile/New", upload.single('Nimage'), Ncontroller.postNaddMobile);
adminRouter.post(`/mobileList/delete/N/:NmobileId`, Ncontroller.postDeleteNmobile);

//AController
adminRouter.post("/addMobile/Accessory", upload.single('Aimage'), Acontroller.postAaddMobile);
adminRouter.post(`/mobileList/delete/A/:accessoryId`, Acontroller.postDeleteAmobile);

//repairController
adminRouter.post(`/repair/Add/Queue`, repairController.postAddRepairQueue);
adminRouter.get(`/repair/Update/Queue`, repairController.getRepairQueue);
adminRouter.post(`/repair/delete/Queue/:repairId`, repairController.postDeleteRepairQueue);
adminRouter.get(`/repair/Edit/Queue/:repairId`, repairController.getEditRepairQueue);
adminRouter.post('/repair/Edit/Queue/:repairId', repairController.postEditRepairQueue);


exports.adminRouter = adminRouter;