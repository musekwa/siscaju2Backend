// import {
//   getFarmersService,
//   addFarmerService,
//   getFarmerByIdService,
//   getFarmerByDistrictService,
//   updateFarmerService,
//   deleteFarmerService,
// } from "../services/farmer.services.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Farmer from "../models/farmer.model.js";
import Farmland from "../models/farmland.model.js";
import UserPerformance from "../models/userPerformance.model.js";
import DistrictPerformance from "../models/districtPerformance.model.js";
import ProvincePerformance from "../models/provincePerformance.model.js";

const ObjectId = mongoose.Types.ObjectId;

//@desc
//@route
//@access
const getFarmers = asyncHandler(async (req, res) => {
  const { user } = req;
  const { district, from } = req.query;

  // console.log("farmers from district: ", district);

  let farmers;
  if (user?.role === "Produtor") {
    farmers = await Farmer.find({ "address.territory": from }).populate(
      "farmlands"
    );
  } else if (user?.role === "Extensionista") {
    farmers = await Farmer.find({ "address.district": from }).populate(
      "farmlands"
    );
  } else {
    farmers = await Farmer.find({ "address.province": from }).populate(
      "farmlands"
    );
  }

  if (farmers) {
    // if (from === 'province'){
    //   farmers = await Farmer.find({ "address.province": from });
    // }else if (from === 'district'){

    // }else if (from === 'territory'){

    // }

    // let farmlands = await Farmland.find({})

    // farmers = farmers.map((farmer)=>{
    //   let cashewTrees = 0;

    //   // add the number of cashew trees this farmer owns
    //   if (farmer.farmlands && farmer.farmlands.length > 0) {
    //     let foundFarmland = farmer.farmlands.find(farmlandId=>ObjectId(farmlands._id) === ObjectId(farmlandId))
    //     cashewTrees += foundFarmland?.totalTrees;
    //     farmer.trees = cashewTrees
    //     console.log('trees: ', farmer)
    //   }
    //   return farmers;
    // })

    // try {
    // switch (user?.role) {
    //   case "Extensionista":
    //     farmers = await Farmer.find({
    //       district: { adress: { district } },
    //     }).populate("farmlands");
    //     break;
    //   case "Produtor":
    //     farmers = await Farmer.findById(ObjectId(user._id)).populate(
    //   "farmlands"
    // );
    //     break;
    //   case "Gestor":
    //     farmers = await Farmer.find({});
    //     break;
    //   default:
    //     res.status(401);
    //     throw new Error("Nao autorizado");
    // }
    // farmers = await Farmer.find({});

    // sort by the update date
    farmers = farmers.sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  return res.status(200).json(farmers);
});

//@desc
//@route
//@access
// Duplicates must not be allowed
const addFarmer = asyncHandler(async (req, res) => {
  const { body, user } = req;

  // assign the user province and district to farmer's address.
  // no user  should register farmer outside their own district

  let registeredBy = {
    fullname: user?.fullname,
    email: user?.email,
    phone: user?.phone,
  };

  body.address.province = user.address.province;
  body.address.district = user.address.district;
  body["user"] = registeredBy; // add the user property (registeredBy)

  const newFarmer = new Farmer(body);
  const savedFarmer = await newFarmer.save();

  // save performance by user
  let userPerformance = await UserPerformance.findOne({ user: user?._id });

  if (!userPerformance) {
    let newUserPerformace = new UserPerformance({
      user: ObjectId(user?._id),
      district: user?.address?.district,
      farmers: new Array(ObjectId(savedFarmer._id)),
    });
    await newUserPerformace.save();
  } else {
    userPerformance.farmers.push(ObjectId(savedFarmer._id));
    await userPerformance.save();
  }

  // -----------------------------------------------------
  // save performance by district
  let districtPerformance = await DistrictPerformance.findOne({
    district: user?.address?.district,
  });

  if (!districtPerformance) {
    let newDistrictPerformace = new DistrictPerformance({
      district: user?.address.district,
      farmers: new Array(ObjectId(savedFarmer._id)),
    });
    await newDistrictPerformace.save();
    // return newPerformace;
  } else {
    districtPerformance.farmers.push(ObjectId(savedFarmer._id));
    await districtPerformance.save();
  }

  // -----------------------------------------------------
  // save performance by province
  let provincePerformance = await ProvincePerformance.findOne({
    province: user?.address?.province,
  });

  if (!provincePerformance) {
    let newProvincePerformace = new ProvincePerformance({
      province: user?.address?.province,
      farmers: new Array(ObjectId(savedFarmer._id)),
    });
    await newProvincePerformace.save();
  } else {
    provincePerformance.farmers.push(ObjectId(savedFarmer._id));
    await provincePerformance.save();
  }

  return res.status(201).json(savedFarmer);
});

//@desc
//@route
//@access
const getFarmerById = asyncHandler(async (req, res) => {
  const {
    params: { farmerId },
  } = req;
  if (!farmerId) {
    // return res.status(400).send({
    //   status: "FAILED",
    //   data: { error: "O parametro ':farmerId' nao pode ser vazio" },
    // });
    res.status(400);
    throw new Error("O parametro ':farmerId' nao pode ser vazio");
  }
  // try {
  const foundFarmer = await getFarmerByIdService(farmerId);
  if (!foundFarmer) {
    res.status(404);
    throw new Error("Produtor nao encontrado");
  }
  return res.status(200).type("application/json").json({
    status: "OK",
    data: foundFarmer,
  });
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

//@desc
//@route
//@access
const updateFarmer = asyncHandler(async (req, res) => {
  const {
    body,
    params: { farmerId },
  } = req;
  if (!farmerId) {
    res.status(400);
    throw new Error("O parametro ':farmerId' nao pode ser vazio");
  }

  // try {
  let updatedFarmer = await updateFarmerService(farmerId, body);
  if (!updatedFarmer) {
    res.status(404);
    throw new Error("Produtor nao encontrados");
  }
  return res.status(200).json({
    status: "OK",
    data: updatedFarmer,
  });
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

//@desc
//@route
//@access
const deleteFarmer = asyncHandler(async (req, res) => {
  const {
    params: { farmerId },
  } = req;
  if (!farmerId) {
    res.status(400);
    throw new Error("O parametro ':farmerId' nao pode ser vazio");
  }
  // try {
  let deletionResult = await deleteFarmerService(farmerId);
  return res.status(204).send(deletionResult);
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

export { addFarmer, getFarmerById, getFarmers, updateFarmer, deleteFarmer };
