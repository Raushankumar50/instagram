// const http = require('http');

// const app = http.createServer((req, res) => {
//   console.log("Server created")
//   res.end("Hello World")
// });

// app.listen(5000, "localhost", () => {
//   console.log("Server is running on 5000")
// })

// raushankumar21032003_db_user
// a3KC1L60aCXRsvgu
// mongodb+srv://raushankumar21032003_db_user:a3KC1L60aCXRsvgu@cluster0.lo8cjfc.mongodb.net/

// mongodb+srv://raushankumar21032003_db_user:<db_password>@cluster0.lo8cjfc.mongodb.net/


const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const {mongoUrl} = require('./keys');

require('./models/model');
require('./models/post')
app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require('./routes/createPost'))
app.use(require("./routes/user"))
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo")
});

mongoose.connection.on('error', () => {
  console.log('not connected to mongodb')
});


app.get('/', (req, res) => {
  res.json(data)
});

app.get('/about', (req, res) => {
  res.json("About Page")
});

app.listen(PORT, () => {
  console.log("Server is running on "+ PORT)
});