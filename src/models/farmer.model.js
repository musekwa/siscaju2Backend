import mongoose from "mongoose";

var Schema = mongoose.Schema;

const farmersSchema = mongoose.Schema(
  {
    fullname: { type: String, trim: true, required: true },
    gender: {
      type: String,
      enum: {
        values: ["F", "M"],
        message: "{VALUE} não é um genero autorizado",
      },
    },
    category: {
      type: String,
      enum: {
        values: [
          "Subcategoria desconhecida",
          "Produtor familiar",
          "Produtor comercial",
        ],
        message: "{VALUE} nao e uma categoria de produtores",
      },
      default: function () {
        return "Subcategoria desconhecida";
      },
    },
    birthDate: {
      type: Date,
      required: true,
    },
    birthPlace: {
      province: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
        // required: [true, "Obrigatorio indicar o distrito de nascimento"],
      },
      territory: { type: String, trim: true },
      village: { type: String, trim: true },
    },
    address: {
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      territory: { type: String, trim: true },
      village: { type: String, trim: true },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{9}/.test(v) || v === "";
        },
        message: (props) =>
          `${props.value} não é um numero de telefone valido!`,
      },
    },
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
    totalTrees: {
      type: Number,
      default: 0,
    },
    image: String,
    farmlands: [
      {
        type: Schema.Types.ObjectId,
        ref: "Farmland",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

// pre hooks

farmersSchema.pre("save", function (next) {
  if (true) {
    // do some stuffs
    next();
  } else {
    // throw error
    next(new Error("message error"));
  }
});

// // case-titling and sanitizing the name
farmersSchema.pre("save", function (next) {
  let names = this.fullname.split(" ");
  if (names.length > 1) {
    let filteredName = names.filter((name) => name !== "");
    let normalizedName = filteredName.map(
      (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    );
    this.fullname = normalizedName.join(" ");
  }
  next();
});

// validating the fullname
farmersSchema.path("fullname").validate(function (value) {
  return value.split(" ").length > 1;
}, "Nome completo e obrigatorio");

// post hooks

// instance method
// 1. set farmer category based on the # of cashew trees
// that they own (familiar; comercial?)
farmersSchema.method("setFarmerCategory", function () {});

// schema methods
// reject farmer registration if an only if another farmer of
// the same name, birth date, and address already exists
farmersSchema.methods.rejectDuplicates = function () {};

const Farmer = mongoose.model("Farmer", farmersSchema);

export default Farmer;

// enxertia e semente policlonal
