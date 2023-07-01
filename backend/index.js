// express web server //
const express = require("express");
const app = express();

// env variables //
require("dotenv").config();
const PORT = process.env.PORT;

// middlewares //
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet"); // allows app to use cookie-parser
const cookieParser = require("cookie-parser"); // allows app to use cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(helmet());
app.use(cookieParser());

// routes //
const userRoutes = require("./routes/userRoutes.js");
app.use("/api/v1/users", userRoutes);
const messageRoutes = require("./routes/messageRoutes.js");
app.use("/api/v1/messages", messageRoutes);

// error middlewares //
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
app.use(notFound);
app.use(errorHandler);

// start server //
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT} ...`);
});
