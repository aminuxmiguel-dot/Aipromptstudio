import { Router } from "express";
import toolsRouter from "./tools";
import promptsRouter from "./prompts";
import historyRouter from "./history";
import favoritesRouter from "./favorites";
import statsRouter from "./stats";
import analyticsRouter from "./analytics";
import healthRouter from "./health";

const router = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(promptsRouter);
router.use(historyRouter);
router.use(favoritesRouter);
router.use(statsRouter);
router.use(analyticsRouter);

export default router;
