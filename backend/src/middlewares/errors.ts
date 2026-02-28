import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";
import ENV from "../config/secrets.js";

export enum Errors {
    BAD_REQUEST,
    NOT_FOUND,
    INVALID_ENTITY,
    INTERNAL_ERROR,
}

const ErrorConfig = {
	[Errors.BAD_REQUEST]: { status: 400, message: "Bad request." },
	[Errors.NOT_FOUND]: { status: 404, message: "Not found." },
	[Errors.INVALID_ENTITY]: { status: 422, message: "Invalid data." },
	[Errors.INTERNAL_ERROR]: { status: 500, message: "Something broke." },
};

export class CustomError extends Error {
	public status: number;

	constructor(errType: Errors, customMsg?: string) {
		const { status, message } = ErrorConfig[errType];
		super(customMsg || message);
		this.status = status;
		
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}

export const errorsHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof CustomError) {

		logger.debug(`${error}`);

		return res.status(error.status).json({
			success: false,
			status: error.status,
			message: error.message
		})
	}

	logger.error(`Unhandeled error: ${error}`);

	return res.status(500).json({
		success: false,
		status: 500,
		message: ENV.NODE_ENV == "development" ? error.stack : "Something went wrong on our end."
	})
}