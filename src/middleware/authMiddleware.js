import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Nao autorizado!");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Nao autorizado por falta de 'token'");
  }
});

export { protect, generateToken };
