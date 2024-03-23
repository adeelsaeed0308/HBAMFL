const advancedQuery = require("./advancedQuery");
const asyncHandler = require("./async");
const removeSpaces = require("./removeSpaces");

const parseJson = (string = "") => {
  try {
    const parsed = JSON.parse(string);
    return parsed;
  } catch {
    return string;
  }
};
class CRUD {
  constructor(model, noSpaceFields = []) {
    this.model = model;
    this.noSpaceFields = noSpaceFields;
  }
  get = asyncHandler(async (req, res, next) => {
    const { query, countQuery } = advancedQuery({
      model: this.model,
      queries: req.query,
    });
    const [data, total] = await Promise.all([query, countQuery]);
    res.json({
      data,
      pagination: {
        total,
        limit: new Number(req.query.limit || 20),
        skip: new Number(req.query.skip || 0),
      },
    });
  });
  getDeleted = asyncHandler(async (req, res, next) => {
    const { query, countQuery } = advancedQuery(
      {
        model: this.model,
        queries: req.query,
      },
      true
    );
    const [data, total] = await Promise.all([query, countQuery]);
    res.json({
      data,
      pagination: {
        total,
        limit: new Number(req.query.limit || 20),
        skip: new Number(req.query.skip || 0),
      },
    });
  });
  getById = asyncHandler(async (req, res, next) => {
    let result = this.model.findById(req.params.id);
    const populate = req.query.populate
      ? parseJson(req.query.populate)
      : undefined;

    if (populate) {
      result = result.populate(populate);
    }

    result = await result.populate();
    res.json(result);
  });
  create = asyncHandler(async (req, res, next) => {
    const result = await this.model.create({
      ...req.body,
      ...this.noSpaceFields.reduce((acc, key) => {
        return {
          ...acc,
          [`${key}NoSpaces`]: req.body[key]?.replace(/ /g, "") || "",
        };
      }, {}),
    });
    res.json(result);
  });
  update = asyncHandler(async (req, res, next) => {
    for (const noSpaces of this.noSpaceFields) {
      if (req.body[noSpaces]) {
        req.body[`${noSpaces}NoSpaces`] = removeSpaces(req.body[noSpaces]);
      }
    }
    const result = await this.model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(result);
  });
  delete = asyncHandler(async (req, res, next) => {
    const result = await this.model.deleteById(req.params.id, req.user.id);
    res.json(result);
  });
}
module.exports = CRUD;
