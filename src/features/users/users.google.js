import axios from "axios";
import bcrypt from "bcrypt";
import UsersModel from "./users.Schema.js";

const authGoogle = (req, res) => {
  const redirect_uri = process.env.REDIRECT_URI;
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const scope = ["openid", "email", "profile"].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
};

const authGoogleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }

  try {
    // Exchange the code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const user = userInfoResponse.data;
    const password = Math.floor(100000 * Math.random * 900000);
    const encryptPassword = await bcrypt.hash(password.toString(), 10);

    const newUser = {
      name: user.name,
      email: user.email,
      imageURL:
        "https://st4.depositphotos.com/11634452/21365/v/450/depositphotos_213659488-stock-illustration-picture-profile-icon-human-people.jpg",
      password: encryptPassword,
    };
    const checkEmail = await UsersModel.findOne({ email: user.email });
    if (checkEmail) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/upgrade?userId=${checkEmail._id}`
      );
    }
    const saveData = await UsersModel.create(newUser);
    res.redirect(`${process.env.FRONTEND_URL}/upgrade?userId=${saveData._id}`);
  } catch (err) {
    console.error("Error exchanging code:", err.message);
    res.status(500).send("Authentication failed");
  }
};

export { authGoogle, authGoogleCallback };
