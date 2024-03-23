const { ErrorResponse } = require("./errors");

module.exports = advancedQuery = (obj, deleted = false) => {
  let {
    queries,
    model,
    query,
    search = {},
    disallowedSelection = [],
    disallowedPopulation = [],
  } = obj;

  // internal error reporting - make sure I pass in at least one of the 2
  //model would a mongoose model,
  ///query  would be an existing mongoose qeury
  // e.g. advancedQuery({query: Model.find({user:'some user'})}) - basically passing in an existing query
  if (!model && !query)
    throw new ErrorResponse("you didnt pass in correct args");

  //queries is usually what user passes in as url query params. e.g. /brands?filters={"name":"Hello Brand","createdAt":{$gt:"2022-05-22T17:17:11.917Z"}},skip=5,limit=1
  //but you can restrict what user can pass in as filters by overriding, req.query.filters, and remove/add queries (lets say only allow brands that belong to this user: as this example)
  // req.query.filters = JSON.parse(req.query.filters)
  //req.query.filters.user=req.user.id
  //
  if (!queries.filters) queries.filters = {};
  else if (!(queries.filters instanceof Object))
    queries.filters = JSON.parse(queries.filters);

  if (query) {
    query = deleted
      ? query.findDeleted(queries.filters)
      : query.find(queries.filters);
  } else {
    query = deleted
      ? model.findDeleted(queries.filters)
      : model.find(queries.filters);
  }
  //sort
  if (queries.sort) {
    query = query.sort(queries.sort);
  } else {
    // query = query.sort("-createdAt");
  }

  //pagination
  const skip = parseInt(queries.skip || "0");
  const limit = parseInt(queries.limit || "20");
  if (skip < 0 || limit < 1 || isNaN(skip) || isNaN(limit)) {
    throw new ErrorResponse("Skip and limit have to be valid numbers");
  }
  const countQuery = query.clone().countDocuments();
  query = query.skip(skip).limit(limit);

  if (typeof queries.select === "string") {
    queries.select = queries.select
      .split(" ")
      .filter((e) => !disallowedSelection.includes(e))
      .join(" ");
    query = query.select(queries.select);
  }

  //populate
  //populate can be one of the following
  // /brands?populate=categories,user,creator
  // /brands?populate={"path:"creator", "select":"name,age,brother"} = basically a regulare mongoose popualte object
  // brands?populate=[{"path:"creator", "select":"name,age,brother"},"user",{}]
  if (queries.populate) {
    if (disallowedSelection.length) {
      if (queries.populate instanceof Object) {
        queries.populate = JSON.stringify(queries.populate);
      }
      queries.populate = queries.populate.replace(
        new RegExp(disallowedSelection.join("|", "gi"), "")
      );
      queries.populate = JSON.parse(queries.populate);
    } else if (
      !(queries.populate instanceof Object) &&
      (queries.populate.startsWith("[") || queries.populate.startsWith("{"))
    ) {
      queries.populate = JSON.parse(queries.populate);
    }
    if (Array.isArray(queries.populate)) {
      for (let populate of queries.populate) {
        if (populate instanceof Object) {
          if (populate.match) {
            populate.match = {
              ...populate.match,
              deleted: false,
            };
          } else {
            populate.match = {
              deleted: false,
            };
          }
        }
        query = query.populate(populate);
      }
    } else if (queries.populate instanceof Object) {
      if (queries.populate.match) {
        queries.populate.match = {
          ...queries.populate.match,
          deleted: false,
        };
      } else {
        queries.populate.match = {
          deleted: false,
        };
      }
      query = query.populate(queries.populate);
    } else {
      queries.populate = queries.populate
        .split(" ")
        .filter((e) => !disallowedPopulation.includes(e));
      for (let populate of queries.populate) {
        query = query.populate({ path: populate, match: { deleted: false } });
      }
    }
  }
  query.allowDiskUse(true);
  countQuery.allowDiskUse(true);
  return { query, countQuery };
};
