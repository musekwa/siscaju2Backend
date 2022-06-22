import router from "./index.js";
import {
  getMonitorings,
  addMonitoringByVariability,
  // updateMonitoring,
  // deleteMonitoring,
} from "../controllers/monitoring.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/monitorings")
  .get(protect, getMonitorings)
  .post(protect, addMonitoringByVariability);

// router.patch("/monitorings/:monitoringId");
// router.delete("/monitorings/:monitoringId");

export default router;
