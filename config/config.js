import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "meitw2022@estudante",
  mongoURI: process.env.MONGODB_URI,
};

export default config;
