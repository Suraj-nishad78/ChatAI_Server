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
    const { name, email, password } = req.body;
    const checkEmail = await UsersModel.findOne({ email });
    if (checkEmail) {
      return res.status(200).json({
        status: "Failed",
        msg: "This email already exist in the system.",
      });
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      imageURL:
        "https://st4.depositphotos.com/11634452/21365/v/450/depositphotos_213659488-stock-illustration-picture-profile-icon-human-people.jpg",
      password: encryptPassword,
    };
    const user = await UsersModel.create(newUser);
    return res.status(201).json({
      status: "Success",
      msg: "User signup successfully!",
      userId:user._id,
    });
  } catch (e) {
    console.log("Error while sign up: ", e);
    return res.status(500).json({
      status: "Failed",
      msg: "Something went wrong. Please try again!",
    });
  }
};

const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        status: "Failed",
        msg: "You have entered a wrong email!",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(200).json({
        status: "Failed",
        msg: "You have entered a wrong password!",
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
        userId: user._id,
      });
  } catch (e) {
    console.log("Error while sign in: ", e);
    return res.status(500).json({
      status: "Failed",
      msg: "Something went wrong. Please try again!",
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UsersModel.findOne({ _id: userId }).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "Failed",
        msg: "User not found.",
      });
    }
    return res.status(200).json({
      status: "Success",
      msg: "User found successfully!",
      user,
    });
  } catch (e) {
    console.log("Error occured while fetch user details: ", e);
    return res.status(500).json({
      status: "Failed",
      msg: "Something went wrong. Please try again!",
    });
  }
};

const addImage = async (req, res) => {
  try {
    const { userId, imageURL } = req.body;
    const updatedUser = await UsersModel.findByIdAndUpdate(
      userId,
      { $set: { imageURL } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: "Failed",
        msg: "Updating user data failed. try again!",
      });
    }
    return res.status(200).json({
      status: "Success",
      user: updatedUser,
    });
  } catch (e) {
    console.log("Error occured while adding image: ", e);
    return res.status(500).json({
      status: "Failed",
      msg: "Something went wrong. Please try again!",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UsersModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(403).json({
        status: "Failed",
        msg: "User Deletion Faild.",
      });
    }
    return res.status(200).json({
      status: "Success",
      msg: "User Deleted Successfully!",
    });
  } catch (e) {
    console.log("Error occured while deleting user: ", e);
    return res.status(500).json({
      status: "Failed",
      msg: "Something went wrong. Please try again!",
    });
  }
};

export {
  getAllUsers,
  userSignin,
  userSignup,
  getUserDetail,
  addImage,
  deleteUser,
};
