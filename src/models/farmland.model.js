import mongoose from "mongoose";
import Farmer from "./farmer.model.js";

var Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const farmlandsSchema = mongoose.Schema(
  {
    label: { type: String, lowercase: true },
    province: String,
    district: String,
    territory: String,
    declaredArea: Number,
    actualArea: {
      type: Number,
      default: function () {
        // get an array of all the areas for each division
        if (this.divisions && this.divisions.length) {
          let plantedAreas = this.divisions.map(
            (division) => division.plantedArea
          );

          plantedAreas = plantedAreas.filter((area) => !isNaN(area));

          if (plantedAreas.length === 0) {
            return 0;
          }
          // return the sum of the trees
          return plantedAreas.reduce(function (acc, el) {
            return acc + el;
          }, 0);
        } else {
          return 0;
        }
      },
    },

    totalTrees: {
      type: Number,
      default: function () {
        // get an array of all the trees for each division
        if (this.divisions && this.divisions.length) {
          let trees = this.divisions.map((division) => division.trees);

          // return the sum of the trees
          return trees.reduce(function (acc, el) {
            return acc + el;
          }, 0);
        } else {
          return 0;
        }
      },
    },
    geocoordinates: {
      latitude: Number,
      longitude: Number,
    },
    interCrops: [String],
    farmlandType: {
      type: String,
      enum: {
        values: [
          "pomar novo",
          "pomar estabelecido",
          "Tipo de pomar não definido",
        ],
        message: "{VALUE} nao e um tipo de pomar permitido",
      },
      default: function () {
        // get an array of all the sowing years for each division
        if (this.divisions && this.divisions.length) {
          let sowingYears = this.divisions.map(
            (division) => division.sowingYear
          );

          // remove undefined and null values
          sowingYears = sowingYears.filter((year) => !isNaN(year));

          if (sowingYears.length === 0) {
            return "Tipo de pomar não definido";
          }

          // get the sum of the sowing years
          let sum = sowingYears.reduce(function (acc, el) {
            return acc + el;
          }, 0);
          // if the sowing years' average is equal or greater than 5, then 'estabelecido' else 'novo'
          return new Date().getFullYear() -
            Math.floor(sum / sowingYears.length) >=
            5
            ? "pomar estabelecido"
            : "pomar novo";
        } else {
          return "Tipo de pomar não definido";
        }
      },
    },
    divisions: [
      {
        trees: Number,
        sowingYear: Number,
        plantedArea: Number,
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
              if (
                this.spacing.x &&
                this.spacing.y &&
                this.spacing.x === this.spacing.y
              ) {
                return "regular";
              } else {
                return "irregular";
              }
            },
          },
        },
        plantingTechniques: {
          seedling: String,
          grafting: [String],
        },
      },
    ],
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
    },
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

farmlandsSchema.pre("save", async function (next) {
  // try {
  //  let farmer = await Farmer.findById(this.farmer);
  //   if (farmer) {
  //     if (this.totalTrees >= 250 || this.actualArea > 5){
  //       farmer.category = "Produtor comercial";
  //     }
  //     else if (this.totalTrees > 0) {
  //       farmer.category = "Produtor familiar";
  //     }
  //     farmer.totalTrees = this.totalTrees;
  //   }
  //   await farmer.save()
  //   next();
  // } catch(error){
  //   next();
  // }
});

const Farmland = mongoose.model("Farmland", farmlandsSchema);

export default Farmland;
