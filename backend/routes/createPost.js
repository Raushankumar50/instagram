const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
// const { route } = require("./auth") ;
const POST = mongoose.model("POST")


// Route
router.get("/allposts",requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name photo")
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

router.post("/createPost",requireLogin, (req, res) => {
  const {body, pic} = req.body;
  console.log(pic)
  if(!body || !pic){
    return res.status(422).json({error: "Please add all the field"})
  }
  console.log(req.user)
  const post = new POST({
    body,
    photo: pic,
    postedBy: req.user
  })
  post.save().then((result)=>{
    return res.json({ post: result})
  }).catch(err => console.log(err))
  
})

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        // .sort("-createdAt")
        .then(myposts => {
            res.json(myposts)
        })
})

// router.put("/like", requireLogin, (req, res) => {
//     POST.findByIdAndUpdate(req.body.postId, {
//         $push: { likes: req.user._id }
//     }, {
//         new: true
//     })
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(422).json({ error: err })
//             } else {
//                 res.json(result)
//             }
//         })
// })

router.put("/like", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.user._id } },
      { new: true }
    ).populate("postedBy", "_id name photo");

    res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate("postedBy", "_id name photo");

    res.json(result);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});


router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id
    };

    const result = await POST.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name photo");

    res.json(result);

  } catch (err) {
        return res.status(422).json({ error: err.message });
  }
});



// router.put("/unlike", requireLogin, (req, res) => {
//     POST.findByIdAndUpdate(req.body.postId, {
//         $pull: { likes: req.user._id }
//     }, {
//         new: true
//     })
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(422).json({ error: err })
//             } else {
//                 res.json(result)
//             }
//         })
// })


// Api to delete post
router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
  try {
    const post = await POST.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this post" });
    }

    // Delete the post
    await POST.deleteOne({ _id: req.params.postId });

    return res.json({ message: "Successfully deleted" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// To show following post
router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
      res.json(posts)
    })
    .catch(err => { console.log(err) 

    })
})

module.exports = router