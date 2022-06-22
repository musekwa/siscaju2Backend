import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const districtPerformancesSchema = mongoose.Schema({
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

const DistrictPerformance = mongoose.model(
  "DistrictPerformance",
  districtPerformancesSchema
);

export default DistrictPerformance;
