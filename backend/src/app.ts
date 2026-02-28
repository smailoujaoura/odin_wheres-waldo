import express from "express";
import ENV from "./config/secrets.js";
import logger from "./config/logger.js";
import router from "./routes.js";
import { errorsHandler } from "./middlewares/errors.js";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
	origin: ENV.ORIGIN || "http://localhost:5173",
	methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.static('public'));

app.use(router);
app.use(errorsHandler);

app.listen(ENV.PORT, (err) => {
	if (err) {
		logger.error(err);
		throw err;
	}
	logger.info(`Listening on port ${ENV.PORT}`);
})