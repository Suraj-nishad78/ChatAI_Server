import express from "express";

const router = express.Router();

import * as userCtrl from "./users.controller.js"

router.get("/allusers", userCtrl.getAllUsers);
router.post("/signin", userCtrl.userSignin);
router.post("/signup", userCtrl.userSignup);
router.post("/userDetails", userCtrl.getUserDetail);
router.patch("/updateProfileImage", userCtrl.addImage);

export default router;