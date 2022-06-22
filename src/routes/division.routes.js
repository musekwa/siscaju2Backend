import express from "express";
import {
  getDivisions,
  addDivision,
  updateDivision,
  deleteDivision,
} from "../controllers/division.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/farmlands/:farmlandId/divisions")
  .post(protect, addDivision)
  .get(protect, getDivisions)
  .patch(protect, updateDivision)
  .delete(protect, deleteDivision);

export default router;
