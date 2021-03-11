const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const cors = require("cors");
// google authentication
const { OAuth2Client } = require("google-auth-library");
// const CLIENT_ID =
// 	"777910125108-78qd65oqedqcsh0r2j8rl4fld8li4b92.apps.googleusercontent.com";
// const client = new OAuth2Client(CLIENT_ID);
// Load env variables
dotenv.config();

// Connect to DB
require("./config/db");

// Initialize App
const app = express();
// cors
var corsOptions = {
	origin: "http://localhost:5000",
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.json({ message: "Welcome to volunteer yatra application." });
});

// Enabling parsing of request body
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if ((process.env.NODE_ENV = "development")) app.use(morgan("tiny"));

// Route files
var apiRouter = require("./routes/apis");
// Mounting routes
app.use("/vy/api/v1/", apiRouter);

// Custom Error Handling Middleware
app.use(errorHandler);

// Port for server
const PORT = process.env.PORT || 5000;

// Starting Server
const server = app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.cyan
			.underline
	)
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
	console.log(`Error: ${err.message}`.red.bold);
	// Close server
	server.close(() => process.exit(1));
});
