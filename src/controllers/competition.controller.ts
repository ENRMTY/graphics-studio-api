import { Request, Response } from "express";
import { competitionService } from "../services/competition.service";

export const getCompetitions = async (_req: Request, res: Response) => {
  const competitions = await competitionService.getCompetitions();

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
