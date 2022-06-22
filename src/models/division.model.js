import mongoose from "mongoose";
var Schema = mongoose.Schema;

const divisionsSchema = mongoose.Schema(
  {
    trees: Number,
    sowingYear: Number,
    spacing: {
      x: Number,
      y: Number,
      category: {
        type: String,
        enum: {
          values: ["regular", "irregular"],
          message: "{VALUE} nao e uma categoria permitida",
        },
        default: function () {
          if (this.spacing.x === this.spacing.y) {
            return "regular";
          } else {
            return "irregular";
          }
        },
      },
    },
    // plantingTechniques: [String],
    seedlingTypes: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    farmland: {
      type: Schema.Types.ObjectId,
      ref: "Farmland",
    },
  },
  { timestamps: true }
);

const Division = mongoose.model("Division", divisionsSchema);

export default Division;
