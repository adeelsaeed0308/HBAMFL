const Email = require("../models/Email");
const asyncHandler = require("../utils/async");

exports.getPreviouslyUsedEmailsForUser = asyncHandler(
  async (req, res, next) => {
    const emails = await Email.find({ sentBy: req.user.id }).select(
      "to cc bcc"
    );
    const list = emails.reduce(
      (acc, e) => [
        ...acc,
        ...["to", "cc", "bcc"].reduce(
          (acc2, key) => [
            ...acc2,
            ...(Array.isArray(e[key]) ? e[key] : e[key]?.split(",") || []),
          ],
          []
        ),
      ],
      []
    );
    res.json(
      [...new Set(list)]
        .filter(Boolean)
        .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
    );
  }
);
