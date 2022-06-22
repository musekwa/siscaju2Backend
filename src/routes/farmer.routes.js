import router from "./index.js";
import {
  addFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
} from "../controllers/farmer.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/farmers").post(protect, addFarmer).get(protect, getFarmers);

router
  .route("/farmers/:farmerId")
  .get(protect, getFarmerById)
  .patch(protect, updateFarmer)
  .delete(protect, deleteFarmer);

router;

export default router;
