import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UsersModel from "./users.Schema.js";

const getAllUsers = async (req, res) => {
  try {
    const user = await UsersModel.find().lean();
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (e) {
    console.log("Error while fetching all users: ", e);
  }
};

const userSignup = async (req, res) => {
  try {
    const { name, email, imageURL, password } = req.body;
    const checkEmail = await UsersModel.findOne({ email });
    if (checkEmail) {
      return res.status(403).json({
        status: "Failed",
        msg: "This email already exist in the system.",
      });
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email,imageURL, password: encryptPassword };
    const user = await UsersModel.create(newUser);
    return res.status(201).json({
      status: "Success",
      msg: "User signup successfully!",
      user,
    });
  } catch (e) {
    console.log("Error while sign up: ", e);
    return res.status(404).json({
      status: "Failed",
      msg: "User signup failed!",
    });
  }
};

const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        status: "Failed",
        msg: "You have entered wrong email!",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(402).json({
        status: "Failed",
        msg: "You have entered wrong password!",
      });
    }

    const token = jwt.sign(user.toJSON(), process.env.PRIVATE_KEY, {
      expiresIn: "10m",
    });

    return res
      .cookie("jwtToken", token, { httpOnly: true, maxAge: 10 * 60 * 1000 })
      .status(200)
      .json({
        status: "Success",
        msg: "User sign in successfully!",
        token,
      });

  } catch (e) {
    console.log("Error while sign in: ", e);
    return res.status(404).json({
      status: "Failed",
      msg: "User signup failed!",
    });
  }
};

export { getAllUsers, userSignin, userSignup };
