import jwt from "jsonwebtoken";
import AssyncHandler from "../utils/AssyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiResponce.js";
import { User } from "../models/User.model.js";

const generateToken = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.GenerateAccessToken();
    const refreshToken = user.GenerateRefeshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("generateToken error:", error);
    throw new ApiError(500, "Token not generated");
  }
};

const registerUser = AssyncHandler(async (req, res) => {
  const { fullname, password, email, profileImageUrl } = req.body;

  if (!fullname || !password || !email) {
    throw new ApiError(400, "all fields are required");
  }

  const UserExited = await User.findOne({
    $or: [{ email }],
  });

  if (UserExited) {
    throw new ApiError(409, "user already existed");
  }

  const user = await User.create({
    fullname,
    email,
    password,
    profileImageUrl,
  });

  const userCreated = await User.findById(user._id).select("-password");

  if (!userCreated) {
    throw new ApiError(
      500,
      "user not created !! something went wrong in server",
    );
  }

  // const [profilePic]=req.file[0]

  return res
    .status(200)
    .json(new ApiRes(200, userCreated, "user register Successfully"));
});

const loginUser = AssyncHandler(async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw new ApiError(400, "all fields are require");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const isMatched = await user.isPasswordCorrect(password);

  if (!isMatched) {
    throw new ApiError(401, "User Password not Matched!!");
  }

  const { accessToken, refreshToken } = await generateToken(user._id);

  const LoggedUser = await User.findById(user._id).select(
    "-password -RefreshToken",
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .json(
      new ApiRes(
        200,
        {
          user: LoggedUser,
          AccessToken: accessToken,
          RefreshToken: refreshToken,
        },
        "user logged In !!",
      ),
    );
});

const getUser = AssyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );
  return res
    .status(200)
    .json(new ApiRes(200, user, "User fetched Successfully"));
});

export { registerUser, loginUser, getUser };
