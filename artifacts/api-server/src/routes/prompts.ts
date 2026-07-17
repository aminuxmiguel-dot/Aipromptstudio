import { Router, type IRouter } from "express";
import { generatePrompt } from "../lib/prompt-engine/engine";
import { GeneratePromptBody } from "@workspace/api-zod";
import type { PromptMode } from "../lib/prompt-engine/types";

const router: IRouter = Router();

router.post("/prompts/generate", async (req, res): Promise<void> => {
  const parsed = GeneratePromptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { toolSlug, mode, options } = parsed.data;

  try {
    const result = generatePrompt(
      toolSlug,
      mode as PromptMode,
      options as Record<string, string>
    );
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    req.log.warn({ toolSlug, mode, err }, "Prompt generation error");
    res.status(400).json({ error: message });
  }
});

export default router;
