import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const userPerformancesSchema = mongoose.Schema({
  user: ObjectId,
  district: { type: String },
  farmers: [ObjectId],
  farmlands: [ObjectId],
  monitorings: [
    {
      name: {
        type: String,
        enum: {
          values: [
            "disease",
            "pruning",
            "plague",
            "weeding",
            "insecticide",
            "fungicide",
            "harvest",
          ],
          message: "Este tipo de monitoria nao esta contemplado!",
        },
      },
      division: ObjectId,
    },
  ],
});

const UserPerformance = mongoose.model(
  "UserPerformance",
  userPerformancesSchema
);

export default UserPerformance;
