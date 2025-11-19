const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

router.get("/user/:id", async (req, res) => {
  try {
    const user = await USER.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await POST.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name");

    return res.status(200).json({ user, posts });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// to follow user
router.put("/follow", requireLogin, async (req, res) => {
  try {
    const updatedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );

    await USER.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );

    return res.json(updatedUser);

  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

// to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const updatedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    await USER.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followId } },
      { new: true }
    );

    return res.json(updatedUser);

  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
 

module.exports = router;