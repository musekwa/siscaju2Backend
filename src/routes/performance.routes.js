import router from "./index.js";
import { getPerformances } from "../controllers/performance.controllers.js";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

router.route("/performances").get(protect, getPerformances);

export default router;
