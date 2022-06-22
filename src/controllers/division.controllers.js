import Division from "../models/division.model.js";
import _ from "lodash";
import mongoose from "mongoose";
import Farmland from "../models/farmland.model.js";
// import {
//   getDivisionsService,
//   getOneDivisionService,
//   addDivisionService,
//   updateDivisionService,
//   deleteDivisionService,
// } from "../services/division.services.js";
import asyncHandler from "express-async-handler";
import Farmer from "../models/farmer.model.js";

const ObjectId = mongoose.Types.ObjectId;

const CategorizeFarmer = (farmlands) => {
  // get all the actual areas for all the farmlands
  let actualAreas = 0;
  let totalTrees = 0;

  farmlands.forEach((farmland) => {
    actualAreas += farmland.actualArea;
    totalTrees += farmland.totalTrees;
    return;
  });

  if (actualAreas >= 5 || totalTrees >= 250) {
    return "Produtor comercial";
  } else if (actualAreas > 0 || totalTrees > 0) {
    return "Produtor familiar";
  } else {
    return "Subcategoria desconhecida";
  }
};

const categorizeSpacing = (spacing) => {
  if (spacing["x"] && spacing["y"] && spacing["x"] === spacing["y"]) {
    return "regular";
  } else {
    return "irregular";
  }
};

//@desc
//@route
//@access
// duplicates not being allowed
const addDivision = asyncHandler(async (req, res) => {
  const {
    body,
    params: { farmlandId },
  } = req;

  if (!farmlandId) {
    res.status(400);
    throw new Error("Deve especificar o 'farmlandId' do pomar");
  }

  let farmland = await Farmland.findById(ObjectId(farmlandId));

  let spacing = categorizeSpacing(body.spacing);
  body.spacing["category"] = spacing;

  farmland.divisions.push(body);

  // get farmland's owner
  let farmer = await Farmer.findById(ObjectId(farmland.farmer)).populate(
    "farmlands"
  );

  // total trees (Sum all the divisions' trees)
  if (farmland?.divisions?.length > 0 && body.trees) {
    let trees = farmland.divisions.map((division) => division.trees);

    //update farmland total trees
    farmland.totalTrees = trees.reduce((ac, el) => ac + el, 0);

    // update farmer's total trees
    farmer.totalTrees += body.trees;

    farmer.category = CategorizeFarmer(farmer.farmlands);

    await farmer.save();
  }

  // total actual area (Sum all the divisions' planted areas)
  let actualAreas = farmland.divisions.map((division) => division.plantedArea);
  farmland.actualArea = actualAreas.reduce((ac, el) => ac + el, 0);

  // average sowing year (Sum all the divisions' sowing year divided
  // by the number of divisions)
  let sowingYears = farmland.divisions.map((division) => division.sowingYear);
  let averageSowingYear =
    sowingYears.reduce((ac, el) => ac + el, 0) / farmland?.divisions?.length;

  // update the farmland type by average year
  if (new Date().getFullYear() - Math.floor(averageSowingYear) >= 5) {
    farmland.farmlandType = "pomar estabelecido";
  } else if (new Date().getFullYear() - Math.floor(averageSowingYear) < 5) {
    farmland.farmlandType = "pomar novo";
  }

  await farmland.save();
  return res.status(200).json(farmland);
});

//@desc
//@route
//@access
const getDivisions = asyncHandler(async (req, res) => {
  const {
    params: { farmlandId },
    query: { divisionId },
  } = req;
  // try {
  let foundDivisions;
  if (farmlandId && !divisionId) {
    foundDivisions = await getDivisionsService(farmlandId);
  } else if (farmlandId && divisionId) {
    foundDivisions = await getOneDivisionService(farmlandId, divisionId);
  }
  return res.status(200).json({
    status: "OK",
    data: foundDivisions,
  });
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

//@desc
//@route
//@access
const updateDivision = async (req, res) => {
  const {
    body,
    params: { farmlandId },
    query: { divisionId },
  } = req;
  if (farmlandId && divisionId) {
    try {
      let updatedDivision = await updateDivisionService(divisionId, body);
      return res.status(200).json({
        status: "OK",
        data: updatedDivision,
      });
    } catch (error) {
      res.status(error?.status || 500);
      throw new Error(error?.message || error.error || error);
    }
  } else {
    res.status(400);
    throw new Error("Deve especificar 'divisionId' e 'farmlandId'");
  }
};

//@desc
//@route
//@access
const deleteDivision = async (req, res) => {
  const {
    params: { farmlandId },
    query: { divisionId },
  } = req;
  try {
    let deletionResult = await deleteDivisionService(farmlandId, divisionId);
    return res
      .status(204)
      .json({
        status: "OK",
        message: "Subdivisao liminada com sucesso",
        data: deletionResult,
      });
  } catch (error) {
    res.status(error?.status || 500);
    throw new Error(error.message);
  }
};

export { addDivision, getDivisions, updateDivision, deleteDivision };
