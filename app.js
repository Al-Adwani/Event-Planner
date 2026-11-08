const express = require("express");
const connectDb = require("./database");
const eventRoutes = require("./apis/events/router");


const app = express();
app.use(express.json());
app.use(eventRoutes)


//errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Path Not Found" });
});

app.use((err, req, res, next) => {
  // Bad input from the client (schema validation, duplicate unique key) is a 400.
  const isClientError =
    err.name === "ValidationError" || err.name === "CastError" || err.code === 11000;
  res
    .status(err.status || (isClientError ? 400 : 500))
    .json({ message: err.message || "Internal Server Error" });
});

connectDb();
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
