const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model("USER"); // Make sure model is registered
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {Jwt_secret} = require("../keys");
const requireLogin = require('../middlewares/requireLogin');


// Test Route
router.get('/', (req, res) => {
  res.send("Hello");
});


// Signup Route
router.post('/signup', (req, res) => {
  const { name, userName, email, password } = req.body;

  // Validation
  if (!name || !email || !userName || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  // Check if user exists
  USER.findOne({ $or: [{ email: email }, { userName: userName }] })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email or userName" });
      }

  bcrypt.hash(password, 12).then((hashedPassword) => {
    // Create new user
      const user = new USER({
        email,
        password: hashedPassword,// ⚠️ should be hashed
        userName,
        name
      });

      // Save user
      user
        .save()
        .then((user) => {
          res.json({ message: "Registered successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  })  
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(422).json({error: "Please add email and password"})
  }

  USER.findOne({ email: email}).then((savedUser) => {
    if( !savedUser) {
      return res.status(422).json({ error: "Invalid email"})
    }
    bcrypt.compare(password, savedUser.password)
      .then((match) => {
        if(match){
          // return res.status(200).json({message: "Signed in Successfully"})
          const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
          const { _id, name, email, userName } = savedUser
          res.json({ token, user: { _id, name, email, userName } })
          console.log({ token, user: { _id, name, email, userName } })
        } else {
          return res.status(422).json({error: "Invalid password"})
        }
      }).catch(err => console.log(err))
  })
})

module.exports = router;