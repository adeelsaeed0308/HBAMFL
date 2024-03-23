const BrandCategory = require("../models/BrandCategory");
const BrandRequest = require("../models/BrandRequest");
const Brand = require("../models/Brand");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const VendorContact = require("../models/VendorContact");
const VendorRequest = require("../models/VendorRequest");
const advancedQuery = require("../utils/advancedQuery");
const asyncHandler = require("../utils/async");
const { ErrorResponse } = require("../utils/errors");
const { getJSReport } = require("../utils/jsReport");
const { omit } = require("lodash");
const Email = require("../models/Email");
const removeSpaces = require("../utils/removeSpaces");
const { createUser } = require("./auth");
const sendEmail = require("../utils/sendEmail");
const VendorBrand = require("../models/VendorBrand");

exports.updateBrandRequestStatus = async (brandRequest, requestBody) => {
  const found = await VendorRequest.find({
    brandRequest,
  });
  let updatedStatus;
  const statuses =
    found.length === 0
      ? ["Unworked"]
      : [...new Set(found.map((f) => f.status))];

  if (found.length > 0) {
    if (found.every((e) => e.status === "FollowUp")) {
      updatedStatus = "FollowUp";
    } else if (found.some((e) => e.status === "AlreadyOnTheMarket")) {
      updatedStatus = "AlreadyOnTheMarket";
    } else if (found.some((e) => e.status === "Open")) {
      updatedStatus = "Open";
    } else if (found.some((e) => e.status === "InProcess")) {
      updatedStatus = "InProcess";
    } else if (found.some((e) => e.status === "NoneAvailability")) {
      updatedStatus = "NoneAvailability";
    } else if (found.every((e) => e.status === "Denied")) {
      updatedStatus = "Denied";
    } else {
      updatedStatus = "WorkedOn";
    }
  } else {
    updatedStatus = "Unworked";
  }

  let followUpDate = null;

  if (updatedStatus === "FollowUp" && requestBody?.followUpDate) {
    followUpDate = new Date(requestBody.followUpDate);
  }

  await BrandRequest.findByIdAndUpdate(
    brandRequest,
    {
      status: updatedStatus,
      statuses,
      followUpDate,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

exports.pushBrandRequestStatuses = asyncHandler(async (req, res, next) => {
  const brandRequests = await BrandRequest.find().populate("vendorRequests");
  for (const brandRequest of brandRequests) {
    const statuses = [
      ...new Set(brandRequest.vendorRequests.map((vr) => vr.status)),
    ];
    await BrandRequest.findByIdAndUpdate(
      brandRequest.id,
      {
        statuses: statuses.length === 0 ? ["Unworked"] : statuses,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  res.send("Successful");
});

exports.updateVendorRequest = asyncHandler(async (req, res, next) => {
  delete req.body.requestBy;
  const oldRequest = await VendorRequest.findById(req.params.id).populate([
    "brandRequest",
    "vendor",
  ]);

  console.log(req.user?.vendor);

  const previousStatus = oldRequest.status;
  const status = req.body.status || previousStatus;
  let followUpDate = null;
  if (status === "FollowUp") {
    followUpDate = req.body.followUpDate;
  }
  const statusChanges = [
    ...oldRequest.statusChanges,
    ...(previousStatus !== status
      ? [
          {
            timestamp: new Date(),
            previousStatus,
            status,
            user: req.user.name,
            vendorId: req.user?.vendor || null,
            isAdmin: req.user?.admin || false,
            isReviewed: false,
          },
        ]
      : []),
  ];

  const result = await VendorRequest.findByIdAndUpdate(
    req.params.id,
    { ...req.body, statusChanges, followUpDate },
    {
      new: true,
      runValidators: true,
    }
  );
  await this.updateBrandRequestStatus(result.brandRequest, req.body);

  const html = `Hi, Simon!
  <br/>
  <br/>
  <h2>This vendor user <b>${oldRequest?.vendor?.name}</b> change the status of <b>${oldRequest?.brandRequest?.brandName}</b> brand from <b>${previousStatus}</b> to <b>${status}</b>.</h2>`;

  // sendEmail({
  //   to: "simon@hbamfl.com",
  //   subject: "Vendor Change the status",
  //   html,
  // }),
  res.json(result);
});

exports.deleteVendorRequest = asyncHandler(async (req, res, next) => {
  const vr = await VendorRequest.findById(req.params.id);
  const { brandRequest } = vr;
  const result = await VendorRequest.deleteById(req.params.id);
  await this.updateBrandRequestStatus(brandRequest);
  res.json(result);
});

exports.createVendorRequest = asyncHandler(async (req, res, next) => {
  req.body.requestBy = req.user.id;
  //console.log(req.body)
  const result = await VendorRequest.create(
    omit(req.body, ["sendEmail", "contactIds", "title", "body"])
  );
  //console.log(result, "87326823642839452")
  if (req.body.sendEmail) {
    req.body.ids = [result.id];
    await sendVendorEmail(req);
  }
  await this.updateBrandRequestStatus(result.brandRequest);

  res.json(result);
});

exports.getVendorRequestsStatusChanges = asyncHandler(
  async (req, res, next) => {
    // const filters = JSON.parse(req.query.filters || "{}");

    let query = [
      {
        $unwind: {
          path: "$statusChanges",
        },
      },
      {
        $sort: {
          "statusChanges.timestamp": -1,
        },
      },
      {
        $match: {
          "statusChanges.isAdmin": false,
          "statusChanges.isReviewed": false,
        },
      },
    ];

    const count = await VendorRequest.aggregate(
      query.concat([
        {
          $count: "totalRecords",
        },
      ])
    );

    let finalQuery = query.concat([
      {
        $skip: Number(req?.query?.skip || 0),
      },
      {
        $limit: Number(req?.query?.limit || 20),
      },
      {
        $lookup: {
          from: "brandrequests",
          localField: "brandRequest",
          foreignField: "_id",
          as: "brandRequest",
        },
      },
      {
        $unwind: {
          path: "$brandRequest",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brandcategories",
          localField: "brandRequest.category",
          foreignField: "_id",
          as: "brandRequest.category",
        },
      },
      {
        $unwind: {
          path: "$brandRequest.category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "statusChanges.vendorId",
          foreignField: "_id",
          as: "statusChanges.vendor",
        },
      },
      {
        $unwind: {
          path: "$statusChanges.vendor",
        },
      },
      // { $sort: {} },
    ]);

    const statusChanges = await VendorRequest.aggregate(finalQuery);

    res.json({
      data: statusChanges,
      pagination: {
        total: count.length !== 0 ? count[0]?.totalRecords || 0 : 0,
        limit: req.query.limit || 20,
        skip: req.query.skip || 0,
      },
    });
  }
);

exports.updateVendorRequestsStatusChanges = asyncHandler(
  async (req, res, next) => {
    const { id, statusChangeId } = req.params;
    const { isReviewed } = req.body;

    const vendorRequest = await VendorRequest.findById(id);
    if (!vendorRequest) {
      next(new ErrorResponse("Vendor Request not found"));
    }

    const statusChanges = vendorRequest.statusChanges;

    let foundIndex = statusChanges.findIndex(
      (statusChange) => statusChange.id === statusChangeId
    );
    if (foundIndex !== -1) {
      statusChanges[foundIndex].isReviewed = isReviewed;
    }

    await VendorRequest.findByIdAndUpdate(id, {
      statusChanges,
    });

    res.json(await VendorRequest.findById(id));
  }
);

exports.getVendorRequestsStatusChangesNDaysNoChange = asyncHandler(
  async (req, res, next) => {
    // const filters = JSON.parse(req.query.filters || "{}");
    const { numberOfDays } = req.params;
    let response = await getVendorRequestsStatusChangesNDaysNoChange(
      numberOfDays,
      req?.query?.skip,
      req?.query?.limit
    );
    res.json(response);
  }
);

exports.sendVendorRequestsStatusChangesNDaysNoChangeReminder = asyncHandler(
  async (n) => {
    const records = await getVendorRequestsStatusChangesNDaysNoChange(
      30,
      0,
      1000000
    );

    const client = getJSReport();

    const list = records.data.map((d) => ({
      brandName: d?.brandRequest?.brandName,
      category: d?.brandRequest?.category?.name,
      status: d?.status,
      lastModified: d.statusChanges?.timestamp
        ? new Date(d.statusChanges?.timestamp).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })
        : null,
    }));

    const data = {
      template: {
        name: "VendorRequestStatusChangesNoChangeExport",
      },
      data: {
        items: list,
      },
    };
    const file = await client.render(data);
    const html = `Hi, Simon!
    <br/>
    <br/>
    <h2>Here is the last 30 days report for vendor request which status</h2>`;

    await sendEmail({
      to: "simon@hbamfl.com",
      subject: "Thirty Days No Change Vendor Requests Report",
      html,
      attachment: {
        filename: `ThirtyDaysNoChange_${new Date().toDateString()}.xlsx`,
        content: file,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  }
);

exports.updateBrandRequest = asyncHandler(async (req, res, next) => {
  delete req.body.status;
  if (req.body.category) {
    const found = await BrandCategory.findById(req.body.category);
    if (!found) {
      next(new ErrorResponse("Category not found"));
    }
  }
  if (req.body.brandName) {
    req.body.brandNameNoSpaces = removeSpaces(req.body.brandName);
  }

  const result = await BrandRequest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(result);
});

exports.createBrandRequest = asyncHandler(async (req, res, next) => {
  delete req.body.status;
  if (!req.body.requestBy || req.user.sourcingRole !== "Admin") {
    req.body.requestBy = req.user.id;
  }
  if (req.body.category) {
    const found = await BrandCategory.findById(req.body.category);
    if (!found) {
      next(new ErrorResponse("Category not found"));
    }
  }
  if (req.user.vendor) {
    req.body.isAccepted = false;
  } else {
    req.body.isAccepted = true;
  }
  if (req.body.category == "") {
    delete req.body.category;
  }

  const result = await BrandRequest.create({
    ...req.body,
    brandNameNoSpaces: removeSpaces(req.body.brandName),
  });
  res.json(result);
});

exports.addVendorUser = asyncHandler(async (req, res, next) => {
  req.body = { ...req.body, vendor: req.params.id };
  return createUser(req, res, next);
});

exports.exportReport = asyncHandler(async (req, res, next) => {
  const brandRequests = (
    await BrandRequest.find()
      .lean()
      .populate("category requestBy")
      .populate({ path: "vendorRequests", populate: "vendor" })
  ).filter((br) =>
    req.query.status
      ? req.query.status === "AllWorkedOn"
        ? [
            "Unworked",
            "WorkedOn",
            "InProcess",
            "Denied",
            "NoneAvailability",
          ].includes(br.status)
        : br.status === req.query.status
      : true
  );

  const list = [];
  for (const brandRequest of brandRequests) {
    list.push({
      brandName: brandRequest.brandName,
      brandEmail: brandRequest.brandEmail || "",
      notes: brandRequest.notes || "",
      order: brandRequest.order || "",
      requestedBy: brandRequest.requestBy?.name,
      requestedDate: brandRequest.createdAt.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      }),
      status:
        brandRequest.status === "InProcess"
          ? "In Process"
          : brandRequest.status === "WorkedOn"
          ? "Requested"
          : brandRequest.status,
      category: brandRequest.category?.name,
      requestedByCustomer: brandRequest.requestedByCustomer,
      //do not fix spelling
      venodrs: brandRequest.vendorRequests.map((e) => e.vendor?.name).join(),
    });
  }

  const client = getJSReport();
  const data = {
    template: {
      name: "BrandRequestV2",
    },
    data: {
      date: new Date().toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      }),
      items: list,
    },
  };
  client.render(data).then((response) => {
    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `inline; filename=brands.xlsx`,
    });
    response.pipe(res);
  });
});

exports.downloadSample = asyncHandler(async (req, res, next) => {
  const categories = await BrandCategory.find();
  const vendors = await Vendor.find();
  const users = await User.find();

  const client = getJSReport();
  const data = {
    template: {
      name: "BrandRequestImportTemplate",
    },
    data: {
      categories,
      vendors,
      users,
    },
  };

  client.render(data).then((response) => {
    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `inline; filename=import_template.xlsx`,
    });
    response.pipe(res);
  });
});

exports.bulkImport = asyncHandler(async (req, res, next) => {
  const xlsx = require("node-xlsx").default;

  const data = xlsx
    .parse(req.file.buffer)[0]
    .data.filter((line, idx) => !line.every((l) => !l) && idx > 0);

  if (data.some((line) => line.filter(Boolean).length < 6)) {
    return next(new ErrorResponse("Data missing. Please adjust file"));
  }
  const requestBy = req.user.id;
  const uniqueBrands = data.reduce((acc, line) => {
    const [br, , requestedByCustomer, , category, vendor] = line;
    const brandName = br.trim();
    const payload = {
      brandName,
      category,
      requestedByCustomer,
      requestBy,
      isAccepted: true,
    };
    const sameCaseBrand = brandName.toLowerCase();
    if (acc[sameCaseBrand]) {
      acc[sameCaseBrand].vendors.push(vendor);
    } else {
      acc[sameCaseBrand] = { payload, vendors: [vendor] };
    }
    return acc;
  }, {});
  for (const { payload, vendors } of Object.values(uniqueBrands)) {
    const { id: brandRequest } = await BrandRequest.create(payload);
    for (const vendor of [...new Set(vendors)]) {
      await VendorRequest.create({ brandRequest, vendor, requestBy });
    }
  }
  res.send("Successful");
});

const generateVendorReport = async ({ vendor, ids, status }) => {
  const vendorName = vendor ? (await Vendor.findById(vendor))?.name : "";
  const brandRequests = await VendorRequest.find({
    ...(vendor ? { vendor } : {}),
    ...(status === "AllWorkedOn"
      ? {
          status: {
            $in: ["Unworked", "WorkedOn", "InProcess"],
          },
        }
      : status?.length
      ? {
          status: {
            $in: status,
          },
        }
      : {}),
    ...(ids ? { _id: { $in: Array.isArray(ids) ? ids : ids.split(",") } } : {}),
  })
    .populate({ path: "brandRequest", populate: "category" })
    .limit(2000);
  const items = brandRequests
    .filter((br) => !!br.brandRequest)
    .map((br) => ({
      brandName: br.brandRequest.brandName,
      category: br.brandRequest.category?.name,
      status: br.status,
      website: br.brandRequest.url
    }));

  const client = getJSReport();
  const data = {
    template: {
      name: "BrandRequestExport",
    },
    data: {
      date: new Date().toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      }),
      items,
      vendor: vendorName,
    },
  };
  return client.render(data);
};

exports.exportVendorReport = asyncHandler(async (req, res, next) => {
  const { statuses, ids } = req.query;
  const vendorName = (await Vendor.findById(req.params.id))?.name;
  let status = null;
  if (statuses && statuses?.length) {
    status = statuses;
  }
  generateVendorReport({
    vendor: req.params.id,
    ids,
    status,
  })
    .then((response) => {
      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `inline; filename="${vendorName}.xlsx"`,
      });
      response.pipe(res);
    })
    .catch((e) => next(new ErrorResponse(e.message)));
});

const sendVendorEmail = async (req) => {
  const { ids: requestIds, contactIds, title, body, fullContacts } = req.body;
  const contacts =
    fullContacts ||
    (await VendorContact.find({
      _id: { $in: contactIds },
    }).populate("vendor"));
  const vendorIds = [...new Set(contacts.map((c) => c.vendor?.id || c.vendor))];
  const vendors = await Vendor.find({ _id: { $in: vendorIds } });
  for (const vendor of vendors) {
    const vendorContacts = contacts.filter((c) => c.vendor.id === vendor.id);
    const report = await generateVendorReport({
      ids: requestIds,
      vendor: vendor.id,
    });
    const payload = {
      to: vendorContacts.map((c) => c.email),
      fromEmail: req.user.zohoEmailAlias || process.env.FROM_EMAIL,
      fromName: req.user.name,
      subject: title,
      html: body,
      sentBy: req.user._id,
      attachment: {
        filename: `${vendor.name}.xlsx`,
        content: report,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    };
    await require("../utils/sendEmail")(payload);
  }
  for (const id of requestIds) {
    const vendorRequest = await VendorRequest.findById(id);
    if (vendorRequest.status === "Unworked") {
      const result = await VendorRequest.findByIdAndUpdate(
        id,
        {
          status: "WorkedOn",
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await this.updateBrandRequestStatus(result.brandRequest);
    }

    await VendorRequest.findByIdAndUpdate(
      id,
      {
        $push: {
          sentEmails: {
            subject: title,
            body,
            contacts: contactIds,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

exports.emailVendors = asyncHandler(async (req, res, next) => {
  await sendVendorEmail(req);
  return res.send("Successful");
});

exports.searchBrandRequests = asyncHandler(async (req, res, next) => {
  const filters = JSON.parse(req.query.filters || "{}");
  console.log("\n\n", filters);
  if (filters.statuses === "VendorCreated") {
    delete filters.statuses;
    filters.isAccepted = false;
  } else if (filters.statuses) {
    filters.isAccepted = true;
  }
  let _id;
  if (filters.vendor) {
    const vendorRequests = await VendorRequest.find({
      vendor: filters.vendor,
    });
    _id = vendorRequests.map((vr) => vr.brandRequest);
  }
  delete filters.vendor;
  const { query, countQuery } = advancedQuery({
    model: BrandRequest,
    queries: {
      ...(req.query || {}),
      filters: { ...filters, ...(_id ? { _id } : {}) },
    },
  });
  let [data, total] = await Promise.all([query, countQuery]);

  res.json({
    data,
    pagination: {
      total,
      limit: req.query.limit || 20,
      skip: req.query.skip || 0,
    },
  });
});

exports.pinBrandRequest = asyncHandler(async (req, res, next) => {
  const branRequest = await BrandRequest.findById(req.params.id).select({
    isPinned: 1,
  });
  const { isPinned } = branRequest;
  const result = await BrandRequest.findByIdAndUpdate(
    req.params.id,
    { isPinned: !isPinned },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(result);
});

exports.bulkAddVendorRequests = asyncHandler(async (req, res, next) => {
  const {
    vendor: vendorIds,
    brandRequestIds,
    contactIds = [],
    sendEmail,
    title,
    body,
  } = req.body;
  const contacts = await VendorContact.find({
    _id: { $in: contactIds },
  }).populate("vendor");
  const existingRequests = await VendorRequest.find({
    vendor: { $in: vendorIds },
    brandRequest: { $in: brandRequestIds },
  });
  for (const vendor of vendorIds) {
    const ids = [];
    const vendorContacts = contacts.filter((c) => c.vendor.id === vendor);
    for (const brandRequest of brandRequestIds) {
      const doesExist = existingRequests.find(
        (er) =>
          er.vendor.toString() === vendor &&
          er.brandRequest.toString() === brandRequest
      );
      if (doesExist) {
        ids.push(doesExist.id);
      } else {
        const result = await VendorRequest.create({
          vendor,
          brandRequest,
          requestBy: req.user.id,
        });
        ids.push(result.id);
      }
    }
    for (const brandRequest of brandRequestIds) {
      await this.updateBrandRequestStatus(brandRequest);
    }
    if (sendEmail && ids.length > 0) {
      await sendVendorEmail({
        ...req,
        body: { ids, fullContacts: vendorContacts, title, body },
      });
    }
  }
  res.send("successful");
});

exports.exportVendorRequestsNewBrandReport = asyncHandler(
  async (req, res, next) => {
    const { vendorId, ids } = req.params;
    const idsArray = ids === "all" ? [] : ids.split(",");
    let findQuery = {
      vendor: vendorId,
    };
    if (idsArray.length !== 0) {
      findQuery["_id"] = { $in: idsArray };
    }
    const vendorRequests = await VendorRequest.find(findQuery).populate({
      path: "brandRequest",
      populate: [
        {
          path: "category",
        },
      ],
    });

    let items = [];
    for (const request of vendorRequests) {
      items.push({
        brandName: request?.brandRequest?.brandName || "",
        requestedDate: request.createdAt.toLocaleDateString("en-US", {
          timeZone: "America/New_York",
        }),
        status: request?.status || "",
        category: request?.brandRequest?.category?.name || "",
        lastModified: request.updatedAt.toLocaleDateString("en-US", {
          timeZone: "America/New_York",
        }),
      });
    }

    const vendor = await Vendor.findById(vendorId);
    const vendorName = vendor?.name || "vendorName";

    const client = getJSReport();
    const data = {
      template: {
        name: "VendorRequestNewBrandExport",
      },
      data: {
        items,
      },
    };
    client
      .render(data)
      .then((response) => {
        res.writeHead(200, {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `inline; filename="${vendorName}.xlsx"`,
        });
        response.pipe(res);
      })
      .catch((e) => next(new ErrorResponse(e.message)));
  }
);

exports.exportVendorRequestsOpenBrandReport = asyncHandler(
  async (req, res, next) => {
    const { vendorId, ids } = req.params;
    const idsArray = ids === "all" ? [] : ids.split(",");
    let findQuery = {
      vendor: vendorId,
    };
    if (idsArray.length !== 0) {
      findQuery["_id"] = { $in: idsArray };
    }
    const vendorRequests = await VendorRequest.find(findQuery).populate({
      path: "brandRequest",
      populate: [
        {
          path: "category",
        },
      ],
    });

    let items = [];
    for (const request of vendorRequests) {
      items.push({
        brandName: request?.brandRequest?.brandName || "",
        openedDate: new Date(
          request.statusChanges.find((sc) => sc.status === "Open")?.timestamp
        ).toLocaleString(),
        status: request?.status || "",
        category: request?.brandRequest?.category?.name || "",
        priceSheet: request.hasPricesheet ? "Yes" : "No",
      });
    }

    const vendor = await Vendor.findById(vendorId);
    const vendorName = vendor?.name || "vendorName";

    const client = getJSReport();
    const data = {
      template: {
        name: "VendorRequestOpenBrandExport",
      },
      data: {
        items,
      },
    };
    client
      .render(data)
      .then((response) => {
        res.writeHead(200, {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `inline; filename="${vendorName}.xlsx"`,
        });
        response.pipe(res);
      })
      .catch((e) => next(new ErrorResponse(e.message)));
  }
);

exports.changeBrandRequestStatus = asyncHandler(async (req, res, next) => {
  const {
    params: { id: brandRequest },
    body: { status },
  } = req;
  let followUpDate = null;
  if (status === "FollowUp") {
    followUpDate = req.body.followUpDate;
  }
  await VendorRequest.updateMany(
    { brandRequest },
    {
      $set: {
        status,
        followUpDate,
      },
    }
  );
  await this.updateBrandRequestStatus(brandRequest, req.body);
  res.send("Successful");
});

exports.deleteBrandRequest = asyncHandler(async (req, res, next) => {
  const {
    params: { id: brandRequest },
  } = req;
  await VendorRequest.delete({ brandRequest }, req.user.id);
  const result = await BrandRequest.deleteById(brandRequest, req.user.id);
  res.json(result);
});

exports.deleteVendor = asyncHandler(async (req, res, next) => {
  const {
    params: { id: vendor },
  } = req;
  const brandRequestIds = [
    ...new Set(
      (await VendorRequest.find({ vendor })).map((vr) =>
        vr.brandRequest.toString()
      )
    ),
  ];
  await VendorRequest.delete({ vendor }, req.user.id);
  await VendorContact.delete({ vendor }, req.user.id);
  await User.delete({ vendor });
  const result = await Vendor.deleteById(vendor, req.user.id);
  for (const id of brandRequestIds) {
    await this.updateBrandRequestStatus(id);
  }
  res.json(result);
});

exports.downloadEmailAttachment = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const email = await Email.findById(id);
  if (email.attachmentContent) {
    res.writeHead(200, {
      "Content-Type": email.attachment.contentType,
      "Content-Disposition": `inline; filename=${email.attachment.filename}`,
    });
    res.end(email.attachmentContent);
    return;
  }
  return next(new ErrorResponse("Attachment Not Found"));
});

exports.exportPricesheets = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find({ deleted: false, brand: null })
    .lean()
    .populate("category lastUploadedBy pricesheets")
    .sort({ createdAt: -1 });

  const list = [];
  for (const brand of brands) {
    list.push({
      name: brand.name,
      category: brand.category ? brand.category.name : "",
      minimumMargin: brand.minimumMargin,
      maximumMargin: brand.maximumMargin,
      suggestedMargin: brand.suggestedMargin,
      shippingCost: brand.shippingCost,
      otherCosts: brand.otherCosts,
      commissionCost: brand.commissionCost,
      minimumOrderItems: brand.minimumOrderItems,
      minimumOrderDollarAmount: brand.minimumOrderDollarAmount,
      createdAt: brand.createdAt
        ? brand.createdAt.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })
        : "",
      pricesheetCount: brand.pricesheets.length + 1,
      uploadedBy: brand.lastUploadedBy ? brand.lastUploadedBy.name : "",
      notes: brand?.notes || "",
      fobPoint: brand?.fobPoint || "",
      leadTime: brand?.leadTime || "",
      specialDiscountNotes:
        brand?.specialDiscountNotes || brand?.specialDiscountNoutes || "",
    });
  }

  const client = getJSReport();
  const data = {
    template: {
      name: "BrandPriceSheets",
    },
    data: {
      items: list,
    },
  };
  client.render(data).then((response) => {
    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `inline; filename=brands.xlsx`,
    });
    response.pipe(res);
  });
});

exports.updatePriceSheetDetails = asyncHandler(async (req, res, next) => {
  const {
    params: { id, brandId },
  } = req;
  const vendorBrand = await VendorBrand.findById(id);

  if (!vendorBrand) {
    res.send("Vendor Brand Not Found!");
  }

  const priceSheets = vendorBrand?.brandPriceSheets || [];

  let index = priceSheets.findIndex(
    (priceSheet) => priceSheet.brand === brandId
  );
  if (index !== -1) {
    priceSheets[index] = {
      ...priceSheets[index],
      brand: brandId,
      attachments: req.body?.attachments || priceSheets[index].attachments,
    };
  } else {
    priceSheets.push({
      brand: brandId,
      attachments: req.body?.attachments || [],
    });
  }

  await VendorBrand.findByIdAndUpdate(
    id,
    { brandPriceSheets: priceSheets },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(await VendorBrand.findById(id));
});

exports.isBrandNameUnique = asyncHandler(async (req, res, next) => {
  const {
    params: { id, name },
  } = req;

  if (id !== "new") {
    const existingBrand = await Brand.findById(id);
    if (
      existingBrand &&
      name.toLowerCase() === existingBrand.name?.toLowerCase()
    ) {
      res.json(true);
      return;
    }
  }

  const brand = await Brand.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (brand) {
    res.json(false);
    return;
  }
  res.json(true);
});

const getVendorRequestsStatusChangesNDaysNoChange = async (
  numberOfDays,
  skip,
  limit
) => {
  let date = new Date();
  date.setDate(date.getDate() - Number(numberOfDays));

  let query = [
    {
      $addFields: {
        statusChanges: {
          $sortArray: {
            input: "$statusChanges",
            sortBy: {
              timestamp: -1,
            },
          },
        },
      },
    },
    {
      $addFields: {
        statusChanges: {
          $slice: ["$statusChanges", 1],
        },
      },
    },
    {
      $unwind: {
        path: "$statusChanges",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        "statusChanges.timestamp": -1,
      },
    },
    {
      $match: {
        $expr: {
          $or: [
            {
              $lt: ["$statusChanges.timestamp", date],
            },
          ],
        },
      },
    },
    {
      $match: {
        status: {
          $in: [
            "FollowUp",
            "VendorCreated",
            "InActive",
            "InProcess",
            "Requested",
            "WorkedOn",
            "Unworked",
          ],
        },
      },
    },
  ];

  const count = await VendorRequest.aggregate(
    query.concat([
      {
        $count: "totalRecords",
      },
    ])
  );

  let finalQuery = query.concat([
    {
      $skip: Number(skip || 0),
    },
    {
      $limit: Number(limit || 20),
    },
    {
      $lookup: {
        from: "brandrequests",
        localField: "brandRequest",
        foreignField: "_id",
        as: "brandRequest",
      },
    },
    {
      $unwind: {
        path: "$brandRequest",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "brandcategories",
        localField: "brandRequest.category",
        foreignField: "_id",
        as: "brandRequest.category",
      },
    },
    {
      $unwind: {
        path: "$brandRequest.category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "vendors",
        localField: "statusChanges.vendorId",
        foreignField: "_id",
        as: "statusChanges.vendor",
      },
    },
    {
      $unwind: {
        path: "$statusChanges.vendor",
        preserveNullAndEmptyArrays: true,
      },
    },
    // { $sort: {} },
  ]);

  const records = await VendorRequest.aggregate(finalQuery);

  return {
    data: records,
    pagination: {
      total: count.length !== 0 ? count[0]?.totalRecords || 0 : 0,
      limit: limit || 20,
      skip: skip || 0,
    },
  };
};
