const asyncHandler = require("../utils/async");
const { ErrorResponse } = require("../utils/errors");
const path = require("path");
const multer = require("multer");
const Brand = require("../models/Brand");
const BrandItem = require("../models/BrandItem");
const Excel = require("exceljs");
const Jimp = require("jimp");
const promisify = require("util").promisify;
const readImage = promisify(Jimp.read).bind(Jimp);
const fs = require("fs");
const tmp = require("tmp-promise");
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const { gridFs } = require("../middleware/upload");
const chunkify = require("../utils/chunkify");
const { getSpotRate } = require("../utils/getSpotRate");
const currencies = require("../data/allCurrencies.json");
const removeSpaces = require("../utils/removeSpaces");
const { isKanda } = require("../utils/isKanda");
const sendEmail = require("../utils/sendEmail");
const { getJSReport } = require("../utils/jsReport");
const { head } = require("lodash");

const SKU_ROW = "B";
const BARCODE_ROW = "C";
const DESCRIPTION_ROW = "D";
const SIZE_ROW = "E";
const MSRP_ROW = "F";
const SALON_ROW = "G";
const DISCOUNT_ROW = "H";
const WHOLESALE_ROW = "I";
const UNITS_PER_CASE_ROW = "J";
const CASE_QTY_ROW = "K";
const ORDER_UNITS_ROW = "L";
const ORDER_VALUE_ROW = "M";

const excelHeaderColumns = [
  "Barcode",
  "Sku",
  "Description",
  "Size",
  "UnitsPerCase",
  "CostPrice",
  "WholesalePrice",
  "MSRP",
];
exports.downloadSampleExcel = asyncHandler(async (req, res, next) => {
  res.sendFile(
    path.resolve(__dirname, "..", "templates", "ImportTemplate.xlsx")
  );
});
exports.uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx") {
      return callback(new ErrorResponse("Only Excel files allowed", 400));
    }
    callback(null, true);
  },
});
exports.updateBrands = asyncHandler(async (req, res, next) => {
  //determine if we need to regenerate the excel
  let needToRegenerate = false;
  const brand = await Brand.findById(req.params.id).populate({
    path: "items",
    options: { sort: { _id: 1 } },
  });
  if (
    ("name" in req.body && brand.name !== req.body.name) ||
    ("image" in req.body && brand.image !== req.body.image) ||
    ("currency" in req.body &&
      brand.currency.symbol != req.body.currency?.symbol) ||
    ("soldByCaseOnly" in req.body &&
      brand.soldByCaseOnly != req.body.soldByCaseOnly)
  ) {
    needToRegenerate = true;
    brand.excelBuffer = undefined;
  }
  delete req.body.itemsHaveMSRP;
  delete req.body.itemsHaveWholesalePrice;
  delete req.body.itemsHaveCostPrice;
  delete req.body.excelBuffer;

  for (let [k, v] of Object.entries(req.body)) {
    brand[k] = v;
    if (k === "name") {
      brand.nameNoSpaces = removeSpaces(v);
    }
  }

  const result = await brand.save({
    new: true,
    runValidators: true,
  });
  res.json(result);
  if (needToRegenerate) {
    genExcel(brand, brand.items, async ({ buffer, bufferKanda }) => {
      await Brand.findByIdAndUpdate(brand._id, {
        excelBuffer: buffer,
        excelBufferKanda: bufferKanda,
      });
    });
  }
});

exports.getBulkSample = asyncHandler(async (req, res, next) => {
  const client = getJSReport();
  const brands = await Brand.find();
  const items = [];
  const XLSX = require("xlsx");
  const workbook = XLSX.utils.book_new();
  const data_xlsx = [];
  data_xlsx.push([
    "_id",
    "name",
    "minimumMargin",
    "suggestedMargin",
    "maximumMargin",
    "notes",
    "fobPoint",
    "leadTime",
    "specialDiscountNotes",
    "shippingCost",
    "commissionCost",
    "otherCosts",
  ]);
  for (const brand of brands) {
    data_xlsx.push([
      brand?.id || "",
      brand?.name || "",
      brand?.minimumMargin || "",
      brand?.suggestedMargin || "",
      brand?.maximumMargin || "",
      brand?.notes || "",
      brand?.fobPoint || "",
      brand?.leadTime || "",
      brand?.specialDiscountNotes || brand?.specialDiscountNoutes || "",
      brand?.shippingCost || "",
      brand?.commissionCost || "",
      brand?.otherCosts || "",
    ]);
  }
  const worksheet = XLSX.utils.aoa_to_sheet(data_xlsx);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=BrandBulkImportSample.xlsx"
  );

  res.send(buffer);
  //  for(const brand of brands) {
  //     items.push({ _id: brand.id, name: brand.name, shippingCost: null, commissionCost: null, otherCosts:null})
  //  }
  //  const data = {
  //   template: {
  //     name: "BrandBulkImportSample",
  //   },
  //   data: {
  //    items
  //   },
  // };
  // console.log(items);
  // console.log(data);
  // client.render(data).then((response) => {

  //   res.writeHead(200, {
  //     "Content-Type":
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     "Content-Disposition": `inline; filename=import_template.xlsx`,
  //   });
  //   response.pipe(res);
  // });
});

exports.bulkUpdate = asyncHandler(async (req, res, next) => {
  if (!req.file.buffer) {
    return next(new ErrorResponse("You must attach a file"), 400);
  }
  const xlsx = require("node-xlsx").default;
  let { data } = xlsx.parse(req.file.buffer)[0];
  const validator = {
    minimumMargin: (value) =>
      !isNaN(Number(value)) && value >= 0 && value <= 100,
    suggestedMargin: (value) =>
      !isNaN(Number(value)) && value <= 100 && value >= 0,
    maximumMargin: (value) =>
      !isNaN(Number(value)) && value <= 100 && value >= 0,
    shippingCost: (value) =>
      !isNaN(Number(value)) && value >= 0 && value <= 100,
    commissionCost: (value) =>
      !isNaN(Number(value)) && value >= 0 && value <= 100,
    otherCosts: (value) => !isNaN(Number(value)) && value >= 0 && value <= 100,
    name: (value) => typeof value === "string",
    nameNoSpaces: (value) => typeof value === "string",
    tabName: (value) => typeof value === "string",
    minimumOrderDollarAmount: (value) => !isNaN(Number(value)) && value >= 0,
    minimumOrderItems: (value) => (value) =>
      !isNaN(Number(value)) && value >= 0,
    maximumOrderDollarAmount: (value) => typeof value === "number",
    maximumOrderItems: (value) => typeof value === "number",
    notes: (value) => typeof value === "string",
    fobPoint: (value) => typeof value === "string",
    leadTime: (value) => typeof value === "string",
    specialDiscountNotes: (value) => typeof value === "string",
  };
  const getDefault = {
    minimumMargin: (value) => (typeof value === "number" ? value : 0),
    suggestedMargin: (value) => (typeof value === "number" ? value : 0),
    maximumMargin: (value) => (typeof value === "number" ? value : 0),
    shippingCost: (value) => (typeof value === "number" ? value : 0),
    commissionCost: (value) => (typeof value === "number" ? value : 0),
    otherCosts: (value) => (typeof value === "number" ? value : 0),
    name: (value) => value,
    nameNoSpaces: (value) => value,
    tabName: (value) => value,
    minimumOrderDollarAmount: (value) =>
      typeof value === "number" ? value : 0,
    minimumOrderItems: (value) => (typeof value === "number" ? value : 0),
    maximumOrderDollarAmount: (value) =>
      typeof value === "number" ? value : 0,
    maximumOrderItems: (value) => (typeof value === "number" ? value : 0),
    notes: (value) => value ?? null,
    fobPoint: (value) => value ?? null,
    leadTime: (value) => value ?? null,
    specialDiscountNotes: (value) => value ?? null,
  };
  const description = {
    minimumMargin:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    suggestedMargin:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    maximumMargin:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    shippingCost:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    commissionCost:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    otherCosts:
      "Has to be a number greater then or equal to 0, and less then or equal to 100",
    name: "Has to be of type string",
    nameNoSpaces: "Has to be of type string",
    tabName: "Has to be of type string",
    minimumOrderDollarAmount: "Has to be of type number",
    minimumOrderItems: "Has to be of type number",
    maximumOrderDollarAmount: typeof value === "number",
    maximumOrderItems: typeof value === "number",
    notes: "Has to be of type string",
    fobPoint: "Has to be of type string",
    leadTime: "Has to be of type string",
    specialDiscountNotes: "Has to be of type string",
  };
  const headers = data.splice(0, 1)[0];
  data = data.filter((i) => i.length);
  const allowedHeaders = Object.keys(validator).reduce(
    (acc, item) => ({ ...acc, [item]: item }),
    {}
  );

  for (const row of data) {
    const dataToUpdate = {};
    for (let i = 1; i < row.length; ++i) {
      let isDataValid = false;
      let data = getDefault[headers[i]](row[i]);
      if (headers[i]) {
        isDataValid = allowedHeaders[headers[i]] && validator[headers[i]](data);
      }
      if (!isDataValid) {
        return next(
          new ErrorResponse(
            `Import Failed. Line ${data.indexOf(row) + 2} Column ${
              headers[i]
            }  ${description[headers[i]]}`
          )
        );
      }
      if (data || data === 0) {
        dataToUpdate[headers[i]] = data;
      }
    }
    if (Object.keys(dataToUpdate).length && row[0]) {
      try {
        await Brand.findByIdAndUpdate(row[0], dataToUpdate);
        console.log(row[0], dataToUpdate);
      } catch (e) {
        return next(
          new ErrorResponse(
            `Stopped at line ${data.indexOf(row) + 2}. Error: ${e.message}`
          )
        );
      }
    }
  }
  res.sendStatus(200);
});
exports.regenAll = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find().populate({
    path: "items",
    options: { sort: { _id: 1 } },
  });
  let currInd = 0;

  function run() {
    genExcel(
      brands[currInd],
      brands[currInd].items,
      async ({ buffer, bufferKanda }) => {
        await Brand.findByIdAndUpdate(brands[currInd]._id, {
          excelBuffer: buffer,
          excelBufferKanda: bufferKanda,
        });
        currInd++;
        if (brands[currInd]) run();
        else res.send("done");
      }
    );
  }

  run();
});

const isCategoryLine = (item) => {
  const { description, brand, ...rest } = item;
  const hasDescription = !!description && !!brand;
  const hasNothingElse = Object.values(rest).every((r) => !r);
  return hasDescription && hasNothingElse;
};

exports.uploadItems = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new ErrorResponse("Invalid Brand"));
  }
  const xlsx = require("node-xlsx").default;
  let data = xlsx.parse(req.file.buffer);
  data = data[0].data;
  const headers = data.shift();
  const missingColumns = [];
  for (let j = 0; j < headers.length; j++) {
    if (headers[j] !== excelHeaderColumns[j]) {
      const column = numToColumn(j + 1);
      missingColumns.push({
        column,
        message: `Column  ${column} (first row): Has to be ${
          excelHeaderColumns[j] || "empty"
        } but is "${headers[j] || ""}"`,
      });
    }
  }
  if (missingColumns.length) {
    return next(new ErrorResponse(missingColumns));
  }
  let errors = [];
  data = data.filter((e) => e.length);
  if (!data.length) {
    return next(new ErrorResponse("Please add items"));
  }

  await chunkify(
    data,
    (item, i) => {
      const obj = { brand: brand._id };
      for (let j = 0; j < headers.length; j++) {
        obj[toCamel(headers[j])] = item[j];
      }
      obj.isCategoryLine = isCategoryLine(obj);
      data[i] = obj;
    },
    50
  );

  let currentCategory = "";
  for (const item of data) {
    if (item.isCategoryLine) currentCategory = item.description;
    if (currentCategory) item.category = currentCategory;
  }

  data = data.filter((d) => !d.isCategoryLine);

  // if any row has barcode, then all need to have'm, so we check if have more then 0, then its required for all (same for all columns)
  const requiredErrors = [];
  const ifOneHasAllNeed = ["wholesalePrice", "costPrice"];
  for (const headerColumn of ifOneHasAllNeed) {
    const rowsWithHeader = data.filter(
      (e) => e[headerColumn] !== undefined || e.isCategoryLine
    );
    if (rowsWithHeader.length && rowsWithHeader.length !== data.length) {
      requiredErrors.push({
        message: `Not all rows have ${headerColumn} filled out`,
      });
    }
  }
  if (requiredErrors.length) {
    return next(new ErrorResponse(requiredErrors));
  }

  await chunkify(
    data,
    (item, i) => {
      item.row = i + 1;
      if (!item.barcode && !item.sku && !item.description) {
        errors.push({
          row: i + 1,
          message: `Must get at least one of these columns: Barcode,Sku,Description`,
        });
      }
      if (!item.costPrice && !item.MSRP) {
        errors.push({
          row: i + 1,
          message: `Must get at least one of these columns: MSRP,CostPrice`,
        });
      }
      if (
        item.costPrice != undefined &&
        typeof item.costPrice !== "number" &&
        isNaN(new Number(item.costPrice))
      ) {
        errors.push({
          row: i + 1,
          message: `CostPrice has to be a number`,
        });
      } else if (item.costPrice != undefined) {
        item.costPrice = new Number(item.costPrice);
      }
      if (
        item.wholesalePrice != undefined &&
        typeof item.wholesalePrice !== "number" &&
        isNaN(new Number(item.wholesalePrice))
      ) {
        errors.push({
          row: i + 1,
          message: `wholesalePrice has to be a number`,
        });
      } else if (item.wholesalePrice != undefined) {
        item.wholesalePrice = new Number(item.wholesalePrice);
      }
      if (
        item.MSRP != undefined &&
        typeof item.MSRP !== "number" &&
        isNaN(new Number(item.MSRP))
      ) {
        errors.push({
          row: i + 1,
          message: `MSRP has to be a number`,
        });
      } else if (item.MSRP != undefined) {
        item.MSRP = new Number(item.MSRP);
      }
    },
    50
  );

  if (errors.length) {
    return next(new ErrorResponse(errors));
  }

  await BrandItem.deleteMany({ brand: brand._id });
  //this has to be syncronous not to loose the order of the data
  for (let item of data) {
    await BrandItem.create(item);
  }

  const bUpdate = await Brand.findById(brand._id);
  bUpdate.excelBuffer = undefined;
  bUpdate.itemsHaveMSRP = data.every((e) => e.MSRP !== undefined);
  bUpdate.itemsHaveWholesalePrice = data.every(
    (e) => e.wholesalePrice !== undefined
  );
  bUpdate.itemsHaveCostPrice = data.every((e) => e.costPrice !== undefined);
  bUpdate.lastUploadedBy = req.user.id;
  await bUpdate.save();
  res.status(200).end();
  genExcel(brand, data, async ({ buffer, bufferKanda }) => {
    await Brand.findByIdAndUpdate(brand._id, {
      excelBuffer: buffer,
      excelBufferKanda: bufferKanda,
      lastModifiedPricesheet: new Date(),
    });
  });
});

exports.downloadExcelOfItems = asyncHandler(async (req, res, next) => {
  await genExcel2(req, next, (buffer, brand, workbook) => {
    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${brand.name.replace(
        /[^\w+]/g,
        ""
      )}.xlsx`,
      "Content-Length": buffer.length,
    });
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  });
});

exports.emailExcelOfItems = asyncHandler(async (req, res, next) => {
  if (typeof req.body.to !== "string") {
    return next(new ErrorResponse("to is required && has to be a string"));
  }
  if (typeof req.body.subject !== "string") {
    return next(new ErrorResponse("subject is required && has to be a string"));
  }
  if (typeof req.body.html !== "string") {
    return next(new ErrorResponse("html is required && has to be a string"));
  }
  if (req.body.cc && typeof req.body.cc !== "string") {
    return next(new ErrorResponse("cc has to be a string"));
  }
  if (req.body.cc && typeof req.body.bcc !== "string") {
    return next(new ErrorResponse("bcc has to be a string"));
  }
  await genExcel2(req, next, async (buffer, brand) => {
    await require("../utils/sendEmail")({
      to: req.body.to,
      fromEmail: req.user.zohoEmailAlias
        ? req.user.zohoEmailAlias
        : process.env.FROM_EMAIL,
      fromName: req.user.name,
      subject: brand.name || req.body.subject,
      html: req.body.html,
      cc: req.body.cc,
      bcc: req.body.bcc,
      sentBy: req.user._id,
      attachment: {
        filename: `${brand.name}.xlsx`,
        content: buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    res.end();
  });
});
function numToColumn(num) {
  var s = "",
    t;
  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
}
function toCamel(str = "") {
  if (!str) return str;
  if (str === "MSRP") return str;
  const firstChar = str.slice(0, 1);
  return firstChar.toLowerCase() + str.slice(1).replace(/ /g, "");
}
function formatDate(date = new Date()) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}
async function getImageDimensions(path) {
  const image = await readImage(path);
  const maxHeight = 64;
  const maxWidth = 640;
  let height = image.bitmap.height;
  let width = image.bitmap.width;
  if (height <= maxHeight && width <= maxWidth) {
    //all good
  } else if (height > maxHeight) {
    const divideBy = height / maxHeight;
    height = height / divideBy;
    width = width / divideBy;
    if (width > maxWidth) {
      const divideBy = width / maxWidth;
      width = width / divideBy;
      height = height / divideBy;
    }
  } else if (width > maxWidth) {
    const divideBy = width / maxWidth;
    width = width / divideBy;
    height = height / divideBy;
    if (height > maxWidth) {
      const divideBy = height / maxWidth;
      height = height / divideBy;
      width = width / divideBy;
    }
  }
  return { height, width };
}
function openExcelWithCurrentWhereItsCurrently(workbook) {
  return workbook.xlsx.writeBuffer().then((buffer) => {
    try {
      const fileName = `C:\\Users\\mwied\\Downloads\\${Math.random()
        .toString(36)
        .slice(2)}.xlsx`;
      require("fs").writeFileSync(fileName, buffer);
      require("child_process").exec(fileName);
    } catch (error) {
      console.error(error);
    }
  });
}
function numberfy(str) {
  if (str == "0") return 0;
  //need to parse becuase otherwise if it comes from mongoose, its not type 'number' even though its passed through new Number
  const newNum = parseFloat(new Number(str));
  if (isNaN(newNum)) return str;
  return newNum;
}

const setupWorkbook = async (
  workbook = new Excel.Workbook(),
  brand = {},
  items = []
) => {
  const worksheet = workbook.getWorksheet("Sheet1");
  const currSymbol = brand.currency.symbol;

  worksheet.getColumn(BARCODE_ROW).width = 20;
  worksheet.getColumn(DESCRIPTION_ROW).width = 64;
  worksheet.getColumn(WHOLESALE_ROW).width = 18;
  worksheet.getColumn(DISCOUNT_ROW).width = 18;
  worksheet.getColumn(SALON_ROW).width = 18;
  worksheet.getColumn(MSRP_ROW).width = 18;
  worksheet.getColumn(SIZE_ROW).width = 18;
  worksheet.getColumn(MSRP_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;
  worksheet.getColumn(SALON_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;
  worksheet.getColumn(WHOLESALE_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;
  worksheet.getCell(`${ORDER_UNITS_ROW}16`).numFmt = `#,##0`;
  worksheet.getColumn(ORDER_VALUE_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;
  worksheet.getCell(`${WHOLESALE_ROW}11`).value = formatDate();
  worksheet.getCell(`${CASE_QTY_ROW}14`).value = brand.soldByCaseOnly
    ? "Case Quantity"
    : "Unit Quantity";
  worksheet.getCell(
    `${SIZE_ROW}1`
  ).value = `Wholesale Price List & Order Form - ${brand.name}`;

  let currentCategory = "";
  let categoryOffset = 0;
  await chunkify(
    items,
    (item, index) => {
      // const d = openExcelWithCurrentWhereItsCurrently;
      let i = categoryOffset + index;
      if (item.category && currentCategory !== item.category) {
        currentCategory = item.category;
        worksheet.duplicateRow(16 + i, 1, true);
        worksheet.getRow(16 + i).getCell(DESCRIPTION_ROW).value =
          currentCategory;
        categoryOffset++;
        i++;
      }
      // if (i > 0) {
      const row = 16 + i;
      worksheet.duplicateRow(row, 1, true);
      // }
      // await d(workbook);
      // await d(workbook);
      worksheet.getRow(row).getCell(SKU_ROW).value = {
        formula: `"${item.sku || ""}"`,
        result: item.sku || "",
      };
      worksheet.getRow(row).getCell(SKU_ROW).numFmt = "0";
      worksheet.getRow(row).getCell(BARCODE_ROW).value = {
        formula: `"${item.barcode || ""}"`,
        result: item.barcode || "",
      };
      worksheet.getRow(row).getCell(BARCODE_ROW).numFmt = "0";
      worksheet.getRow(row).getCell(DESCRIPTION_ROW).value =
        item.description || "";
      worksheet.getRow(row).getCell(DESCRIPTION_ROW).alignment = {
        vertical: "middle",
        wrapText: true,
      };

      worksheet.getRow(row).getCell(SIZE_ROW).value = item.size || "";

      if (item.MSRP) {
        worksheet.getRow(row).getCell(MSRP_ROW).value = numberfy(item.MSRP);
        worksheet.getRow(row).getCell(SALON_ROW).value = item.MSRP / 2;
      }
      worksheet.getRow(row).getCell(UNITS_PER_CASE_ROW).value =
        item.unitsPerCase || "N/A";
      worksheet.getRow(row).getCell(ORDER_UNITS_ROW).value = {
        formula: item.unitsPerCase
          ? `${UNITS_PER_CASE_ROW}${row}*${CASE_QTY_ROW}${row}`
          : `${CASE_QTY_ROW}${row}`,
      };
      worksheet.getRow(row).getCell(ORDER_VALUE_ROW).value = {
        formula: `${ORDER_UNITS_ROW}${row}*${WHOLESALE_ROW}${row}`,
      };
      // await d(workbook);
      // const dd = '';
    },
    3
  );

  const totalLength = items.length + categoryOffset;
  const totalRow = 18 + totalLength;
  const totalEnd = 15 + totalLength;

  worksheet.spliceRows(16 + totalLength, 1);
  worksheet.getCell(`${ORDER_VALUE_ROW}${totalRow}`).value = {
    formula: `sum(${ORDER_VALUE_ROW}16:${ORDER_VALUE_ROW}${totalEnd})`,
  };
  worksheet.getCell(`${ORDER_UNITS_ROW}${totalRow}`).value = {
    formula: `sum(${ORDER_UNITS_ROW}16:${ORDER_UNITS_ROW}${totalEnd})`,
  };
  if (brand.image) {
    const [file, tmpFile] = await Promise.all([
      gridFs.gfs.files.findOne({ filename: brand.image }),
      tmp.file(),
    ]);
    if (file) {
      await pipeline(
        gridFs.gridfsBucket.openDownloadStream(file._id),
        fs.createWriteStream(tmpFile.path)
      );
      const { width, height } = await getImageDimensions(tmpFile.path);
      const imageId = workbook.addImage({
        filename: tmpFile.path,
        extension: path.extname(brand.image).slice(1),
      });
      worksheet.addImage(imageId, {
        tl: { col: 1, row: 1 },
        ext: { width, height },
      });
    }
  }
};

//this function is used to generate the excel and save it to DB. the only cells that could change is the "wholesale price" column. next function takes care of that
async function genExcel(brand, items, callback) {
  try {
    const workbook = new Excel.Workbook();
    workbook.creator = "WorkPortal";
    workbook.lastModifiedBy = "WorkPortal";
    await workbook.xlsx.readFile(
      path.resolve(__dirname, "..", "templates", `ExportTemplate.xlsx`)
    );
    await setupWorkbook(workbook, brand, items);
    const buffer = await workbook.xlsx.writeBuffer();

    const workbookKanda = new Excel.Workbook();
    workbookKanda.creator = "K and A Group";
    workbookKanda.lastModifiedBy = "K and A Group";
    await workbookKanda.xlsx.readFile(
      path.resolve(__dirname, "..", "templates", `ExportTemplateKanda.xlsx`)
    );
    await setupWorkbook(workbookKanda, brand, items);
    const bufferKanda = await workbookKanda.xlsx.writeBuffer();

    await callback({ buffer, bufferKanda });
  } catch (error) {
    sendEmail({
      to: process.env.DEVELOPER_EMAIL,
      subject: "Error generating excel for brand" + brand.name,
      text: `
    ${JSON.stringify(error)}
    ${error.name}
    ${error.message}
    `,
    });
  }
}

//previous function is used to generate the excel and save it to DB.
//the only cells that could change is the "wholesale price" column.
//this function takes care of that

async function genExcel2(req, next, callback) {
  const excelKey = isKanda() ? "excelBufferKanda" : "excelBuffer";
  const brand = await Brand.findById(req.params.id)
    .select(`+${excelKey}`)
    .populate([
      "brand",
      { path: "items", options: { sort: { _id: 1 } } },
      "brandList",
    ]);
  if (brand.brandList.find((e) => e.isInactive)) {
    return next(new ErrorResponse("This brand is inactive"));
  }
  const {
    items,
    currency: { code, symbol },
  } = brand;

  if (!items.length) {
    return next(new ErrorResponse("This brand does not have any items"));
  }

  if (!brand[excelKey]) {
    return next(
      new ErrorResponse(
        "Excel file not fully ready yet, please try again in a few seconds"
      )
    );
  }

  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(brand[excelKey]);
  if (req.query.payload) {
    req.query = JSON.parse(req.query.payload);
  }
  const margin = new Number(req.query.margin);
  let MSRPDiscount = new Number(req.query.MSRPDiscount);
  if (!brand) {
    return next(new ErrorResponse("Invalid Brand"));
  }
  if (req.query.margin && req.query.MSRPDiscount) {
    return next(new ErrorResponse("Cant do both"));
  }
  if (req.query.margin && isNaN(margin)) {
    return next(new ErrorResponse("Margin has to a valid number"));
  }
  if (req.query.margin && margin < 0) {
    return next(new ErrorResponse("Can't have negative margin"));
  }
  if (req.query.margin && margin >= 100) {
    return next(new ErrorResponse("Can't have margin of 100% or more"));
  }
  if (req.query.margin && !brand.itemsHaveCostPrice) {
    return next(
      new ErrorResponse(
        "This brand do not have CostPrice, Cant calculate margin"
      )
    );
  }
  if (
    (req.user.priceSheetsRole !== "Admin" && req.user.email !== 'ms@hbamfl.com') &&
    req.query.margin &&
    margin < brand.minimumMargin &&
    !isKanda()
  ) {
    return next(
      new ErrorResponse(
        `You entered a margin that is less than the Minimum Margin for this brand(${brand.minimumMargin})`
      )
    );
  }
  if (req.query.MSRPDiscount && isNaN(MSRPDiscount)) {
    return next(new ErrorResponse("MSRPDiscount has to a valid number"));
  }
  if (req.query.MSRPDiscount && !brand.itemsHaveMSRP) {
    return next(new ErrorResponse("This brand does not have MSRP"));
  }
  if (req.query.MSRPDiscount && MSRPDiscount < 0) {
    return next(new ErrorResponse("Can't have negative Discount"));
  }
  if (req.query.MSRPDiscount && MSRPDiscount > 100) {
    return next(new ErrorResponse("Can't have Discount of more then 100%"));
  }
  const { isRaw, toCurrency } = req.query;

  //we can calculate wholesalePrice by the following precedence:
  //1) user passes in "margin", and itemsHaveCostPrice - we calculate wholesale price by margin on top of cost
  //2) user passes in "MSRPDiscount" and itemsHaveMSRP - we calcualte wholesale price by disounting off MSRP
  //3) if itemsHaveWholsaelPrice  and no "margin" or "discount" was passed, we used that as the wholesale price
  //4) if itemsHaveCostPrice and brand has minimum margin, we take the minimum margin as the margin on top of the costPrice
  //5) otherwise, we throw errors
  if (
    !req.query.MSRPDiscount &&
    !req.query.margin &&
    !brand.itemsHaveWholesalePrice &&
    (!brand.itemsHaveCostPrice || !brand.minimumMargin) &&
    !isRaw
  ) {
    if (brand.itemsHaveMSRP && brand.itemsHaveCostPrice) {
      return next(new ErrorResponse("Please pass in discount or margin"));
    }
    if (brand.itemsHaveCostPrice) {
      return next(new ErrorResponse("Please pass in margin"));
    }
    if (brand.itemsHaveMSRP) {
      return next(new ErrorResponse("Please pass in discount"));
    }
  }

  const worksheet = workbook.getWorksheet("Sheet1");

  const to = toCurrency || code;

  const rate = await getSpotRate(code, to);

  const currSymbol = currencies.find((c) => c.code === to)?.symbol || symbol;

  worksheet.getColumn(WHOLESALE_ROW).numFmt = `[$${currSymbol}] #,##0.00`;
  worksheet.getColumn(WHOLESALE_ROW).font.size = 12;
  worksheet.getColumn(ORDER_VALUE_ROW).numFmt = `[$${currSymbol}] #,##0.00`;
  worksheet.getColumn(MSRP_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;
  worksheet.getColumn(SALON_ROW).numFmt = `[$${currSymbol}]\\ #,##0.00`;

  if (req.query.margin < 12) {
    const alertCell = worksheet.getCell(12, 4);
    alertCell.value = "Prepaid Terms for This Order";
    alertCell.font = { color: { argb: "ffff6347" }, size: 16, bold: true };
    alertCell.alignment = {
      horizontal: "center",
      wrapText: true,
    };
  }

  if (brand.soldByCaseOnly) {
    const cell = worksheet.getCell(5, 9);
    cell.value = "MUST ORDER BY CASE";
    cell.font = { color: { argb: "ff0000" }, size: 16, bold: true };
  }

  let currentCategory = "";
  let categoryOffset = 0;
  await chunkify(
    items,
    (item, i) => {
      categoryOffset +=
        item.category && currentCategory !== item.category ? 1 : 0;
      currentCategory = item.category;
      const row = 16 + i + categoryOffset;
      const getCell = (key) => worksheet.getCell(`${key}${row}`);
      worksheet.getRow(row).height = 18;
      let otherCostsOnItem = 0;
      if (brand.itemsHaveCostPrice) {
        if (brand.shippingCost) {
          otherCostsOnItem += item.costPrice * (brand.shippingCost / 100);
        }
        if (brand.otherCosts) {
          otherCostsOnItem += item.costPrice * (brand.otherCosts / 100);
        }
        if (brand.commissionCost) {
          otherCostsOnItem += item.costPrice * (brand.commissionCost / 100);
        }
      }

      if (!req.user.exportOriginalWithCost && isRaw) {
        otherCostsOnItem = 0;
      }

      let wholesalePrice = 0;
      if (isRaw) {
        wholesalePrice = item.costPrice;
      } else if (req.query.margin) {
        wholesalePrice = (100 / (100 - margin)) * item.costPrice;
      } else if (req.query.MSRPDiscount) {
        wholesalePrice = Math.max(
          brand.itemsHaveCostPrice ? item.costPrice : null,
          (item.MSRP / 100) * (100 - MSRPDiscount),
          brand.minimumMargin && brand.itemsHaveCostPrice
            ? (100 / (100 - brand.minimumMargin)) * item.costPrice
            : null
        );
      } else if (brand.itemsHaveWholesalePrice) {
        wholesalePrice = item.wholesalePrice;
      } else if (brand.itemsHaveCostPrice && brand.minimumMargin) {
        wholesalePrice = (100 / (100 - brand.minimumMargin)) * item.costPrice;
      }
      if (!req.query.MSRPDiscount) {
        wholesalePrice = wholesalePrice + otherCostsOnItem;
      }
      getCell(WHOLESALE_ROW).value = wholesalePrice * rate;
      if (item.MSRP && brand.itemsHaveCostPrice) {
        getCell(DISCOUNT_ROW).value = !isNaN(MSRPDiscount)
          ? +MSRPDiscount / 100
          : (item.MSRP - wholesalePrice) / item.MSRP;
      }
      if (req.query.skipSalonPrice) {
        getCell(SALON_ROW).value = "N/A";
      }
      // if (isRaw) {
      //   worksheet.getCell(`${DISCOUNT_ROW}${row}`).value = "";
      //   worksheet.getCell(`${MSRP_ROW}${row}`).value = "";
      //   worksheet.getCell(`${SALON_ROW}${row}`).value = "";
      // }
    },
    100
  );

  const shouldReplaceImage = !brand.image && !!brand.brand?.image;
  if (shouldReplaceImage) {
    const [file, tmpFile] = await Promise.all([
      gridFs.gfs.files.findOne({ filename: brand.brand.image }),
      tmp.file(),
    ]);
    if (file) {
      await pipeline(
        gridFs.gridfsBucket.openDownloadStream(file._id),
        fs.createWriteStream(tmpFile.path)
      );
      const { width, height } = await getImageDimensions(tmpFile.path);
      const imageId = workbook.addImage({
        filename: tmpFile.path,
        extension: path.extname(brand.brand.image).slice(1),
      });
      worksheet.addImage(imageId, {
        tl: { col: 1, row: 1 },
        ext: { width, height },
      });
    }
  }
  const buffer = await workbook.xlsx.writeBuffer();
  callback(buffer, brand, workbook);
}
