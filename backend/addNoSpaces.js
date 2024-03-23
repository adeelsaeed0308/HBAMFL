const express = require("express");
const http = require("http");
require("dotenv").config({ path: "./config/config.env" });
const { connectDB } = require("./db");

const Brand = require("./models/Brand");
const Vendor = require("./models/Vendor");
const BrandRequest = require("./models/BrandRequest");
const removeSpaces = require("./utils/removeSpaces");

const addNoSpaces = async () => {
  await connectDB();
  console.log("updating brands...");
  const allBrands = await Brand.find();
  for (const brand of allBrands) {
    brand.nameNoSpaces = removeSpaces(brand.name);
    await brand.save();
  }
  console.log("updating brand requests...");
  const allBrandRequests = await BrandRequest.find();
  for (const brandRequest of allBrandRequests) {
    brandRequest.brandNameNoSpaces = removeSpaces(brandRequest.brandName);
    await brandRequest.save();
  }
  console.log("updating vendors...");
  const allVendors = await Vendor.find();
  for (const vendor of allVendors) {
    vendor.nameNoSpaces = removeSpaces(vendor.name);
    await vendor.save();
  }
  console.log("update complete!");
};

addNoSpaces();
