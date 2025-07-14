const secondHandModel = require(`../models/secondHandMobileDB`);
const newModel = require(`../models/newMobileDB`);
const accessoryModel = require('../models/accessoryDB');
const repairModel = require('../models/repairDB');


const axios = require("axios");
const apiKey = process.env.FIREBASE_API_KEY;
const admin = require("../Firebase/fireBaseAdmin");
const expiresIn = 60 * 60 * 1000; // 1 hour
const adminDB = require(`../models/adminDB`);

exports.getuserLogin = (req,res,next) => {
  res.render(`store/userLogin`);
};

exports.getuserRegister = (req,res,next) => {
  res.render(`store/userRegister`);
};

// controllers/userController.js


exports.postUserRegister = async (req, res) => {
  console.log("✅ /register route hit", req.body);
  const { email, password, name } = req.body;
  console.log('🔥 REQ.BODY:', req.body);
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    console.log("✅ Firebase user created", userRecord.uid);

    // ✅ Set default user claim
    const claims = { role: "user" };
    await admin.auth().setCustomUserClaims(userRecord.uid, claims);
    console.log("✅ Custom user claims set:", claims);

    const loginRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const loginData = loginRes.data;
    console.log("✅ Firebase login success:", loginData);

    const { idToken, refreshToken } = loginData;

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      maxAge: 60*60*24*7*1000,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    console.log("✅ Creating session + saving to DB");
    await adminDB.findOneAndUpdate(
      { uid: userRecord.uid },
      { uid: userRecord.uid, email, name, refreshToken, sessionCookie },
      { upsert: true, new: true }
    );

   res.redirect('/orders');
  } catch (err) {
    console.error("❌ Full registration error:", err.response?.data || err);
    res.status(500).json({ error: err.response?.data?.error?.message || err.message || "Unknown error" });
  }
};

exports.postUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const loginData = loginRes.data;
    console.log("✅ Firebase login success:", loginData);

    const { idToken, refreshToken, localId } = loginData;

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    
    res.cookie("session", sessionCookie, {
      maxAge: 60*60*24*7*1000,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    await adminDB.findOneAndUpdate(
      { uid: localId },
      { uid: localId, email, refreshToken, sessionCookie },
      { upsert: true, new: true }
    );

    res.redirect('/orders');
  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err);

  const code = err.response?.data?.error?.message;
  let errorMessage = "Login failed. Please try again.";

  if (code === "INVALID_LOGIN_CREDENTIALS" || code === "INVALID_PASSWORD" || code === "EMAIL_NOT_FOUND") {
    errorMessage = "Email or password is incorrect. Please try again.";
  }

  res.status(401).render('store/userLogin', {
    error: errorMessage,
    email
  });
  }
};






exports.getHomePage = (req,res,next) => {

  Promise.all([
    secondHandModel.find(),
    newModel.find(),
    accessoryModel.find()
  ])
    .then(([registeredSHmobile, registeredNmobile, registeredAmobile]) => {
      res.render(`store/index`, {
        registeredSHmobile,
        registeredNmobile,
        registeredAmobile
      });
    })
    .catch(err => {
      console.error('Error loading mobile lists:', err);
      res.status(500).send('Failed to load mobile list');
    });
 
};

exports.getStore = (req,res,next) => {

  Promise.all([
    secondHandModel.find(),
    newModel.find(),
    accessoryModel.find()
  ])
    .then(([registeredSHmobile, registeredNmobile, registeredAmobile]) => {
      res.render(`store/store`, {
        registeredSHmobile,
        registeredNmobile,
        registeredAmobile
      });
    })
    .catch(err => {
      console.error('Error loading mobile lists:', err);
      res.status(500).send('Failed to load mobile list');
    });
 
  
};

exports.getOrders = (req,res,next) => {
  res.render(`store/orders`);
};

exports.getRepair = (req,res,next) => {
  repairModel.find()
  .then(repairList => {
    res.render('store/repair', {
      repairList
    });
  })
  .catch(err => {
    console.error('Error loading repair list:', err);
    res.status(500).send('Failed to load repair data');
  });
  
};

exports.getContact = (req,res,next) => {
  res.render(`store/contact`);
};

// Detail page


exports.getSHdetailPage = (req,res,next) => {
  res.render(`store/SHdetailsPage`);
};


exports.getNdetailPage = (req,res,next) => {
  res.render(`store/contact`);
};

exports.getAdetailPage = (req,res,next) => {
  res.render(`store/contact`);
};