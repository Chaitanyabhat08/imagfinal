const asyncError = require("../middleware/asyncError");
const User = require("../models/user");
const sendToken = require('../utils/jwttoken');
const ErrorHandler = require('../utils/errorhandler.js');
const sendEmail = require('../utils/sendEmail');

module.exports.loginUser = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if password and email is present
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Password or Email", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password or Email", 401));
  }
  let token = user.tokens[user.tokens.length - 1].token;
  token = `Bearer ${token}`;
  let url = `/posts/allposts?token=${encodeURIComponent(token)}`;
  res.redirect(url);
});

module.exports.forgotPassword = asyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("You are not Registered With us, Please Register", 404));
  }

  let html = [`<h5>Hello ${user.name}</h5>`];
  const resetToken = await user.ResetPasswordToken();
  console.log(user);
  await user.save({ validateBeforeSave: false });
  console.log("afterrr" ,user)

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}users/resetPassword/${resetToken}`;
  const resetPasswordUrl = `${process.env.FRONTEND_URL}users/resetPassword/${user.resetPasswordToken}`;
  const message = `Please click on this button to redirect to set up new password \n`;
  html.push(`<button style="background-color:white"><a href=${resetPasswordUrl}>Reset Password Link</a></button>`)
  html.push(`<p>${message}</p>`);
  html.push(`<p>Thanks and Regards</p>`);
  html.push(`<p>Saints&Sinners</p>`);
  html.push(`<tr><img src="./man.png" alt="s&s"></tr>`)

  html = html.join('');
  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery Email for your S&S account`,
      html,
    });
    res.status(200).json({
      success: true,
      message: `Password Recover Eamil sent to ${user.email} successfully`,
    });

  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports.logoutUser = asyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.redirect("/users/loginUser");
});