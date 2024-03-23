const asyncHandler = require("../utils/async");
const { ErrorResponse } = require("../utils/errors");
const User = require("../models/User");
const Code = require("../models/VerificationCodes");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const axios = require("axios");
const { isKanda } = require("../utils/isKanda");
const { genVerificationCode } = require("../utils/genVerCode");
const { sign, verify } = require("jsonwebtoken");

let zohoAccessToken = "";
let zohoApiDomain = "";
async function getZohoAccessToken() {
  const data = await axios.post(
    `https://accounts.zoho.com/oauth/v2/token`,
    {},
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        grant_type: "refresh_token",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: "http://localhost", //blabla
        scope:
          "ZohoMail.organization.accounts.UPDATE,ZohoMail.organization.accounts.READ",
      },
    }
  );
  if (data.data.error) {
    throw {
      message: `Zoho refresh access token responded with "${data.error}"`,
    };
  }
  zohoAccessToken = data.data.access_token;
  zohoApiDomain = data.data.api_domain;
  setTimeout(() => {
    zohoAccessToken = "";
  }, data.data.expires_in - 60);
  return data.data;
}

//@desc           login user
//@route          POST /auth/login
//@permission     all
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, token } = req.body;
  if (process.env.CAPTCHA_SECRET_KEY) {
    if (!token) {
      return next(new ErrorResponse("Invalid Credentials1", 401));
    }
    const { data: captchaRes } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: token,
      })
    );
    if (captchaRes["error-codes"]?.length) {
      if (process.env.NODE_ENV != "production") {
        return next(
          new ErrorResponse(
            { captchaDevelopmentOnlyError: captchaRes["error-codes"] },
            401
          )
        );
      } else {
        return next(new ErrorResponse("Invalid Credentials2", 401));
      }
    }
    if (!captchaRes.success) {
      return next(new ErrorResponse("Invalid Credentials4", 401));
    }
    if (captchaRes.score < 0.7) {
      return next(new ErrorResponse("Invalid Credentials5", 401));
    }
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorResponse("Invalid Credentials", 401, true));

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return next(new ErrorResponse("Invalid Credentials3", 401));

  sendTokenResponse(user, res, true);
  const code = genVerificationCode();
  console.log("code", code);
  const html = `Hi, ${user.name}!
  <br/>
  <br/>
  <h2>Please, type this code on our website, so that you could log in: ${code}</h2>`;

  await Promise.all([
    Code.create({ code, user_id: user._id }),
    sendEmail({ to: user.email, subject: "Verification", html }),
  ]);
  res.status(200).json(user);
});

exports.requestReset = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { userId, userName } = res.locals;

  const token = sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const html = `Hi, ${userName}!
  <br/>
  <br/>
  <h2>Please, Click the link below in order to change your password</h2>
  <br/>
  <a href=${process.env.FRONTEND_URL}/reset?token=${token}>Reset password</a>
  `;
  await sendEmail({ to: email, subject: "Reset password", html });
  res.sendStatus(200);
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token) {
    return next(new ErrorResponse("Token is required", 400));
  }
  if (!newPassword) {
    return next(new ErrorResponse("New password is required", 400));
  }
  console.log("token", token);
  console.log("newPassword", newPassword);

  const { userId } = verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, { password: hashed });

  res.sendStatus(200);
});

//@desc           Get user
//@route          POST /auth/me
//@permission     all
exports.getUser = asyncHandler(async (req, res, next) => {
  if (req.user.isKanda && !isKanda()) {
    throw new Error("Cannot login on this site");
  }
  res.json(req.user);
});

//@permission     ADMIN
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.user_id);
  res.json(user);
});

//@permission     ADMIN
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

//@permission     ADMIN
exports.createUser = asyncHandler(async (req, res, next) => {
  if (!req.body.password) {
    req.body.password = req.body.vendor
      ? "vendoruser"
      : isKanda()
      ? "kanda"
      : "Work987"; //default
  }
  let user;
  //remove "", wich is not a valid vlaue
  if (!req.body.sourcingRole) {
    delete req.body.sourcingRole;
  }
  if (!req.body.priceSheetsRole) {
    delete req.body.priceSheetsRole;
  }
  if (!req.body.loansRole) {
    delete req.body.loansRole;
  }
  if (!req.body.brandListRole) {
    delete req.body.brandListRole;
  }
  if (!req.body.vendorRole) {
    delete req.body.vendorRole;
  }
  try {
    user = await User.create(req.body);
  } catch (error) {
    if (error.code != 11000) {
      throw error;
    }
    user = await User.findOneDeleted({ email: req.body.email });
    if (!user) {
      throw error;
    }
    await User.restore({ email: req.body.email });
  }
  res.json(user);
  let siteName = isKanda() ? "K and A Group System" : "Work Portal App";
  await sendEmail({
    to: req.body.email,
    subject: "Set your password for " + siteName,
    html: `
    Hi ${req.body.name ?? ""}
    <br>
    <br>
    Set your password for ${siteName}. <a href="${
      isKanda()? 'https://kandagroupinc.herokuapp.com': process.env.FRONTEND_URL
    }">Here is the link</a>.
    <br>
    Your username is: <strong>${req.body.email}</strong>
    <br>
    Your temporary password is <strong>${
      req.body.password
    }</strong>. You will be prompted to change to a stronger password once you login.
    <br>
    <br>
    Thanks!`,
  });
  //create ZOHO account alias to send email from that users email
  if (req.body.email.split("@")[1].toLowerCase() == "hbamfl.com") {
    await User.findByIdAndUpdate(user._id, {
      zohoEmailAlias: req.body.email,
    });
  }
});

//@permission     ADMIN
exports.updateUser = asyncHandler(async (req, res, next) => {
  //remove "", wich is not a valid vlaue
  if (req.body.sourcingRole == "") {
    delete req.body.sourcingRole;
  }
  if (req.body.priceSheetsRole == "") {
    delete req.body.priceSheetsRole;
  }
  if (req.body.brandListRole == "") {
    delete req.body.priceSheetsRole;
  }
  const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(user);
});
//@permission     ADMIN
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.user_id);
  if (!user) {
    return next(new ErrorResponse("User not found", 400));
  }
  await User.deleteById(req.params.user_id);
  res.json(user);
  if (user.zohoEmailAlias) {
    await User.findOneAndUpdateDeleted(
      { _id: user._id },
      { zohoEmailAlias: "" }
    );
  }
});

// PUT /auth/password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  user.password = req.body.password;
  await user.save();

  sendTokenResponse(user, res);
});

// POST /auth/forgotPassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 400));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const message = `
  Please follow the link below to reset your password.
  <br>
  <br>  
  <a href="${process.env.FRONTEND_URL}/authentication/password-reset?token=${resetToken}">Reset Your Password</a>`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Link",
      html: message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // Get hashed token
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.body.token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse("Invalid token", 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, res);
// });

//@desc     logout
//@route    POST /api/v1/auth/logout
//@access   Public
exports.logout = async (req, res, next) => {
  const options = {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.SECURE_COOKIE,
    domain: process.env.DOMAIN,
    path: "/",
    sameSite: process.env.SAME_SITE,
  };

  res.status(200).cookie("token", "", options).json();

  await User.findByIdAndUpdate(req.user.id, {
    lastLogOut: Date.now(),
  });
};

exports.getUserToken = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.send(user.getSignedJwtToken());
});

exports.verify = asyncHandler(async (req, res, next) => {
  const { userId, code } = req.body;
  const [codeRecords, user] = await Promise.all([
    Code.find({ user_id: userId }),
    User.findById(userId),
  ]);

  if (!user) {
    return next(new ErrorResponse("No such user", 400));
  }

  if (!codeRecords.length) {
    return next(new ErrorResponse("Invalid verification code", 400));
  }
  const isMatch = codeRecords.some((r) => r?.code?.toString() === code);

  if (!isMatch) {
    return next(new ErrorResponse("You passed a wrong verification code", 400));
  }

  await Code.deleteMany({ user_id: userId });
  sendTokenResponse(user, res);
});

//get token from model, create cookie and res
const sendTokenResponse = (user, res, notSaveTokenInCookie = false) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP_TIME * 86400000),
    httpOnly: true,
    secure: process.env.SECURE_COOKIE || true,
    domain: process.env.DOMAIN,
    path: "/",
    sameSite: process.env.SAME_SITE,
  };

  user.password = undefined;

  if (notSaveTokenInCookie) {
    res.status(200).json(user);
  } else {
    res.status(200).cookie("token", token, options).json(user);
  }
};
