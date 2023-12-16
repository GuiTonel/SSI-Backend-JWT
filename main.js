if (!process.env.PRODUCTION) {
  require('dotenv').config();
}

const bodyParser = require("body-parser");
const express = require('express')
require("./database.js")

const app = express()
const port = 3333

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRouter = require("./users/routes.js")
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})