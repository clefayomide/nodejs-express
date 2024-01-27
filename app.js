import createError from "http-errors";
import express, { json, urlencoded, static as expressStatic } from "express";
import { join, dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { createStream } from "rotating-file-stream";

// controllers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const app = express();

const __currentModulePath = fileURLToPath(import.meta.url);

const rotateLogStream = createStream("request.log", {
	size: "10M",
	interval: "1d",
	compress: "gzip",
	path: join(dirname(__currentModulePath), "log"),
});

// view engine setup
app.set("views", join(dirname(__currentModulePath), "views"));
app.set("view engine", "jade");

app.use(logger("combined", { stream: rotateLogStream }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressStatic(join(dirname(__currentModulePath), "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, _) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.listen(() => {
	console.log(`Server is running on port 8000`);
});

export default app;
