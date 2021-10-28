const express = require("express");
const connectDb = require("./database");
const eventRoutes = require("./apis/events/router");
const { events } = require("./models/Events");


const app = express();
app.use(express.json());
app.use(eventRoutes)


//errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Path Not Found" });
  next();
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
  next();
});

connectDb();
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
