module.exports = (req, res, next) => {
  const admins = ["serviceinvestor.bajaj@gmail.com"];
  if (!admins.includes(req.user.email))
    return res.status(403).json({ message: "Admin access denied" });

  next();
};
