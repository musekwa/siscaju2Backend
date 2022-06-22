import router from "./index.js";
import {
  getFarmlands,
  addFarmland,
  getFarmlandById,
  updateFarmland,
  deleteFarmland,
} from "../controllers/farmland.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/farmlands")
  .post(protect, addFarmland)
  .get(protect, getFarmlands);

router
  .route("/farmlands/:farmlandId")
  .get(protect, getFarmlandById)
  .patch(protect, updateFarmland)
  .delete(protect, deleteFarmland);

export default router;
