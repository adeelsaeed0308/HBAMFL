const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/async");
const { ErrorResponse } = require("../utils/errors");
const User = require("../models/User");
const VendorRequest = require("../models/VendorRequest");

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

exports.protect = asyncHandler(async (req, res, next) => {
  const loginError = async (msg, logout = true) => {
    next(new ErrorResponse(msg, 401, logout));
    if (req.user && logout) {
      await User.findByIdAndUpdate(req.user.id, {
        lastLogOut: Date.now(),
      });
    }
  };

  //for excel viewer params
  const queryPayload = JSON.parse(req.query.payload || "{}");

  let token = req.query.token || queryPayload.token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (!token) return loginError("permissions denied1");

  try {
    try {
      req.user = await decodeFunction(token);
    } catch (error) {
      if (error === "permissions denied3") {
        return await loginError(error, true);
      } else {
        throw error;
      }
    }
    // there is a user_id in the url, make sure its the same as the token or the token user's role is admin
    if (
      req.params.user_id &&
      req.params.user_id !== req.user.id.toString() &&
      !req.user.admin
    ) {
      return await loginError("permissions denied2");
    }

    next();
  } catch (error) {
    console.log(error);
    return await loginError("permissions denied4");
  }
});

//grand access to specific roles
exports.authorize = (roles) => async (req, res, next) => {
  // sample of roles
  //[{'priceSheetsRole':['SalesRep','Admin']}]
  if (req.user.admin) {
    return next();
  }
  for (let [key, value] of Object.entries(roles)) {
    const isVendorRole = key === "vendorRole";
    if (isVendorRole) {
      if(roles[key].includes(req.user?.vendorRole)) return next()
      const userVendor = req.user.vendor?.valueOf();
      const reqVendor = value?.includes?.("VendorRequest")
        ? (await VendorRequest.findById(req.params.id)).vendor?.valueOf()
        : req.params.id;
      if (userVendor === reqVendor) return next();
    }
    if (!isVendorRole && req.user[key] && value.includes(req.user[key])) {
      return next();
    }
  }
  return next(new ErrorResponse(`Not allowed`, 403));
};

//grand access to admin only
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  return next(new ErrorResponse(`Not allowed`, 403));
};

async function decodeFunction(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.user_id);

  if (!user) {
    throw "permissions denied2.9";
  }

  // if iat was before last logout, permission denied
  if (
    user.lastLogOut &&
    decoded.iat < Math.floor(user.lastLogOut.getTime() / 1000)
  ) {
    throw "permissions denied3";
  }

  return user;
}

exports.checkIfUserExists = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse("Email is required!", 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new ErrorResponse("Invalid email!", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorResponse(`User with email ${email} does not exist!`, 404)
    );
  }
  res.locals.userId = user._id;
  res.locals.userName = user.name;
  next();
});

exports.decode = decodeFunction;
