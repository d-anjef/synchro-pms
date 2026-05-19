import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Convert to plain object and remove password
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: userObj,
    });
};

export default generateToken;