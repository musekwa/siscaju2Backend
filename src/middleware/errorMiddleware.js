import { response } from "express";
import config from "../../config/config.js";

const errorHandler = (error, req, res, next) => {
  // res.header ("Content-Type", "application/json");

  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  // res.json({
  //     message: error.message,
  //     stack: config.env === 'production' ? null : error.stack,
  // })
  res.json(error.message);
  next(error);
};

const errorLogger = (error, req, res, next) => {
  console.log(`error ${error.message}`);
  next(error);
};

// const invalidPathHandler = (req, res, next)=>{
//     res.status(404);
//     response.json({message: 'Invalid path'})
// }

export {
  errorHandler,
  errorLogger,
  // invalidPathHandler,
};
