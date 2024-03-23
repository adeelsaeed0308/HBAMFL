const {
  updateVendorRequest,
  updateBrandRequestStatus,
} = require("../controllers/sourcing");
const VendorRequest = require("../models/VendorRequest");

module.exports = async () => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recordsToUpdate = await VendorRequest.aggregate([
      {
        $match: {
          status: "WorkedOn",
        },
      },
      {
        $project: {
          id: 1,
          statusChanges: {
            $slice: ["$statusChanges", -1],
          },
        },
      },
      {
        $unwind: {
          path: "$statusChanges",
        },
      },
      {
        $match: {
          "statusChanges.timestamp": {
            $lte: fourteenDaysAgo,
          },
        },
      },
    ]);
    for (let i = 0; i < recordsToUpdate.length; i++) {
      const record = recordsToUpdate[i];
      const oldRequest = await VendorRequest.findById(record._id).populate([
        "brandRequest",
        "vendor",
      ]);
      const previousStatus = oldRequest.status;
      const status = "FollowUp";
      const statusChanges = [
        ...oldRequest.statusChanges,
        ...(previousStatus !== status
          ? [
              {
                timestamp: new Date(),
                previousStatus,
                status,
                user: "System",
              },
            ]
          : []),
      ];
      const result = await VendorRequest.findByIdAndUpdate(
        record._id,
        { statusChanges, status },
        {
          new: true,
          runValidators: true,
        }
      );
      await updateBrandRequestStatus(result.brandRequest);
    }
  } catch (e) {
    console.log("Cronjob error:", e?.message);
  }
};
