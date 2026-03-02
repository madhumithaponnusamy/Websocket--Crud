const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();
const SECRET = "JWT_SECRET";

/* SIGNUP */
router.post("/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({
    email: req.body.email,
    password: hashed
  });
  res.json({ message: "Signup success" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
