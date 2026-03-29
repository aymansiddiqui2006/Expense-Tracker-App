import express, { json } from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controller/Authentication.controller.js";
import { Router } from "express";
import { verifyJwt } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import AssyncHandler from "../utils/AssyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiResponce.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/get-user").get(verifyJwt, getUser);

router.route("/upload-image").post(
  upload.single("image"),
  AssyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "no file uploads");
    }

    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

    return res.status(200).json(new ApiRes(200,{imageUrl},"file uploaded"))
  }),
);

export default router;
