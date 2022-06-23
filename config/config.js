import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "meitw2022@estudante",
  mongoURI: process.env.MONGODB_URI ? process.env.MONGODB_URI :
    "mongodb+srv://musekwa:meitw2022estudante@siscaju.8uwsr.mongodb.net/db22?retryWrites=true&w=majority",
};

export default config;
