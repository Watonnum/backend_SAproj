const express = require("express");
const app = express();
const port = 3000;
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./Config/db.js");

connectDB();

//log information
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies

// Routes
readdirSync("./Routes").map((r) => app.use("/api", require("./Routes/" + r)));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
