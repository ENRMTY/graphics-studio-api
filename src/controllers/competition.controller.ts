import { Request, Response } from "express";
import { competitionService } from "../services/competition.service";

const userId = (req: Request): string | undefined => (req as any).user?.id;

export const getCompetitions = async (req: Request, res: Response) => {
  const competitions = await competitionService.getCompetitions(userId(req));
  res.json({
    success: true,
    data: competitions,
  });
};

export const createCompetition = async (req: Request, res: Response) => {
  const { name, color } = req.body as { name?: string; color?: string };

  const competition = await competitionService.createCompetition({
    name,
    color,
    file: req.file,
    userId: userId(req),
  });

  res.status(201).json({
    success: true,
    data: competition,
  });
};

export const updateCompetition = async (req: Request, res: Response) => {
  const { name, color } = req.body as { name?: string; color?: string };

  const competition = await competitionService.updateCompetition({
    id: req.params.id,
    name,
    color,
    file: req.file,
  });

  res.json({
    success: true,
    data: competition,
  });
};

export const deleteCompetition = async (req: Request, res: Response) => {
  await competitionService.deleteCompetition(req.params.id);
  res.json({
    success: true,
    message: "Competition deleted",
  });
};
