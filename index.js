
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
// import expressValidator from "express-validator";
import userRoutes from "./src/routes/user.routes.js";
import farmerRoutes from "./src/routes/farmer.routes.js";
import farmlandRoutes from "./src/routes/farmland.routes.js";
import divisionRoutes from "./src/routes/division.routes.js";
// import monitoringRoutes from "./src/routes/monitoring.routes.js";
import userPerformanceRoutes from "./src/routes/performance.routes.js";
import dbConnection from "./config/db.js";

import {
  errorHandler,
  // invalidPathHandler,
  errorLogger,
} from "./src/middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";

const { connect, disconnect } = dbConnection;

const app = express();

// MongoDB connection
connect();

app.use(express.static("public"));
app.use(express.json()); // app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());

// Protection using helmet
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

app.use(cors());


app.use(userRoutes);
app.use(farmerRoutes);
app.use(farmlandRoutes);
app.use(divisionRoutes);
// app.use(monitoringRoutes);
app.use(userPerformanceRoutes);

// ----------------deployment---------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend
if (config.env === "production" || process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

// ----------------deployment---------------------------

app.use(errorHandler);
app.use(errorLogger);
// app.use(invalidPathHandler)

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Server started on port ${config.port}`);
});

export default app;