import bcrypt from "bcryptjs";
import { userModel } from "../../models/userModel.js";
import { uploadOnCloudinary } from "../../utils/Handle_cloudinary.js";

async function userSignUpController(req, res) {
  try {
    const { email, password, name } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      throw new Error("Already user exits.");
    }

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }
    if (!name) {
      throw new Error("Please provide name");
    }
    let avatar = null;
    console.log(req.file.path);
    if (req.file) {
      const avatarLocalPath = req.file.path;
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if(!avatar)
        throw new Error("Eror Witht cloudinary");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something is wrong");
    }
    console.log(avatar);
    const payload = {
      name,
      email,
      profilePic: avatar?.url || "",
      role: "GENERAL",
      password: hashPassword,
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created Successfully!",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export { userSignUpController };
