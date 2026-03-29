import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import AssyncHandler from "../utils/AssyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const verifyJwt = AssyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.AccessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

    

  if (!token) {
    throw new ApiError(401, "User Unauthorized");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken",
  );
  if (!user) throw new ApiError(401, "Invalid token");

  req.user = user;
  next();
});
