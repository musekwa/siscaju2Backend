import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const provincePerformancesSchema = mongoose.Schema({
  province: { type: String },
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

const ProvincePerformance = mongoose.model(
  "ProvincePerformance",
  provincePerformancesSchema
);

export default ProvincePerformance;
