// Bring in Express - our backend web framework
const express = require("express");

// Bring in dotenv, so we can use environment varialbes AND we'll call the .config() function
const dotenv = require("dotenv").config();

const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

// Initialize express with a variables
const app = express();

// Middelware to access body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// To use the default express error handler using our middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port: ${port}`));
