module.exports = (req, res, next) => {
  if (req.body.cheatingFlags?.includes('tabSwitch') || req.body.cheatingFlags?.includes('fullscreenExit')) {
    req.cheatingDetected = true;
  }
  next();
};