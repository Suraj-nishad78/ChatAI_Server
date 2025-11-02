import express from "express";

const router = express.Router();

import * as userCtrl from "./users.controller.js"

router.get("/allusers", userCtrl.getAllUsers);
router.post("/signin", userCtrl.userSignin);
router.post("/signup", userCtrl.userSignup);

export default router;