import { Router } from "express";
import { Logic } from "./middlewares/logic.js";

const router = Router();

router.get("/api/maps", Logic.maps);
router.get("/api/maps/:id", Logic.map);

router.post("/api/game/start", Logic.startGame);
router.post("/api/game/validate", Logic.validate);

router.get("/api/scores", Logic.getScores);
router.post("/api/scores", Logic.postScore);

export default router;