import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { CustomError, Errors } from "./errors.js";

interface MapParams {
	id: string;
}

const maps = async (req: Request, res: Response) => {
	const allMaps = await prisma.map.findMany();
	res.json(allMaps);
}

const map = async (req: Request<MapParams>, res: Response) => {
	const { id } = req.params;

	const targetMap = await prisma.map.findUnique({
		where: { id },
		include: {
			characters: {
				select: {
					id: true,
					name: true,
					iconUrl: true
				}
			}
		}
	});

	if (!targetMap) {
		return res.status(404).json({ error: "Map not found" });
	}

	res.json(targetMap);
}

const startGame = async (req: Request, res: Response) => {
	const { mapId } = req.body;
	const game = await prisma.game.create({
		data: { mapId }
	});
	res.json({ gameId: game.id });
};

const validate = async (req: Request, res: Response) => {
	const {mapId, characterId, x, y} = req.body;

	const char = await prisma.character.findFirst({
		where: {id: characterId, mapId}
	});

	if (!char) {
		throw new CustomError(Errors.NOT_FOUND, "Character not found.");
	}

	const margin = 2.0;
	const isMatch = 
		Math.abs(char.xPct - x) <= margin &&
		Math.abs(char.yPct - y) <= margin;

	res.json({found: isMatch});
}

const getScores = async (req: Request, res: Response) => {
	const { mapId } = req.query;
	const topScores = await prisma.score.findMany({
		where: { mapId: mapId as string },
		orderBy: { time: 'asc' },
		take: 10
	});
	res.json(topScores);
};

const postScore = async (req: Request, res: Response) => {
	const { name, gameId } = req.body;

	const gameSession = await prisma.game.findUnique({
		where: { id: gameId }
	});

	if (!gameSession) {
		throw new CustomError(Errors.NOT_FOUND, "Game not found.");
	}

	const duration = Math.floor((Date.now() - gameSession.startTime.getTime()) / 1000);
	
	const newScore = await prisma.score.create({
		data: {
			name,
			time: duration < 1 ? 1 : duration,
			mapId: gameSession.mapId
		}
	});

	await prisma.game.delete({ where: { id: gameId } });
	res.json(newScore);
};

export const Logic = {
	maps,
	map,
	validate,
	startGame,
	getScores,
	postScore
}