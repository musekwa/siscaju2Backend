import mongoose from "mongoose";
import config from "./config.js";

export default {
  connect: async () => {
    return await mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("MongoDB is connected successfully!");
      })
      .catch((err) => console.log(err));
  },

  close: () => mongoose.disconnect(),
};
