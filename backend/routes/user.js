// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const POST = mongoose.model("POST");
// const USER = mongoose.model("USER");
// const requireLogin = require("../middlewares/requireLogin");

// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await USER.findById(req.params.id)
//       .select("-password");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const posts = await POST.find({ postedBy: req.params.id })
//       .populate("postedBy", "_id name");

//     return res.status(200).json({ user, posts });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// });

// // to follow user
// router.put("/follow", requireLogin, async (req, res) => {
//   try {
//     const updatedUser = await USER.findByIdAndUpdate(
//       req.body.followId,
//       { $push: { followers: req.user._id } },
//       { new: true }
//     );

//     await USER.findByIdAndUpdate(
//       req.user._id,
//       { $push: { following: req.body.followId } },
//       { new: true }
//     );

//     return res.json(updatedUser);

//   } catch (err) {
//     return res.status(422).json({ error: err.message });
//   }
// });

// // to unfollow user
// router.put("/unfollow", requireLogin, async (req, res) => {
//   try {
//     const updatedUser = await USER.findByIdAndUpdate(
//       req.body.followId,
//       { $pull: { followers: req.user._id } },
//       { new: true }
//     );

//     await USER.findByIdAndUpdate(
//       req.user._id,
//       { $pull: { following: req.body.followId } },
//       { new: true }
//     );

//     return res.json(updatedUser);

//   } catch (err) {
//     return res.status(422).json({ error: err.message });
//   }
// });

// router.put("/uploadProfilePic", requireLogin, async (req, res) => {
//     try {
//       const result = await USER.findByIdAndUpdate(
//         req.user._id,
//         { $set: { Photo: req.body.pic } },
//         { new: true }
//       );

//       if (!result) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       res.json(result);

//     } catch (err) {
//         return res.status(422).json({ error: err.message });
//     }
// });

 

// module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// IMPORTANT → Mongoose Models
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");

// IMPORTANT → Middleware to check login token
const requireLogin = require("../middlewares/requireLogin");


// ======================================================
// 🔹 GET USER PROFILE + USER POSTS
// Route: /user/:id
// ======================================================
router.get("/user/:id", async (req, res) => {
  try {
    // IMPORTANT → Fetch user except password
    const user = await USER.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // IMPORTANT → Fetch posts created by the user
    const posts = await POST.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name");

    return res.status(200).json({ user, posts });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});


// ======================================================
// 🔹 FOLLOW USER
// Route: /follow
// ======================================================
router.put("/follow", requireLogin, async (req, res) => {
  try {
    // IMPORTANT → Add logged-in user to "followers" of target user
    const updatedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );

    // IMPORTANT → Add target user to "following" of logged-in user
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


// ======================================================
// 🔹 UNFOLLOW USER
// Route: /unfollow
// ======================================================
router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    // IMPORTANT → Remove logged-in user from "followers" of target user
    const updatedUser = await USER.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    // IMPORTANT → Remove target user from logged-in user's "following"
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


// ======================================================
// 🔹 Upload / Update Profile Picture
// Route: /uploadProfilePic
// ======================================================
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
  try {
    // IMPORTANT → Replace user profile picture
    const result = await USER.findByIdAndUpdate(
      req.user._id,
      { $set: { Photo: req.body.pic } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result);

  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});


// EXPORT ROUTER
module.exports = router;