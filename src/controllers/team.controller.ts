import { Request, Response } from "express";
import { teamService } from "../services/team.service";

const userId = (req: Request): string | undefined => (req as any).user?.id;

export const getTeams = async (req: Request, res: Response) => {
  const teams = await teamService.getTeams(userId(req));

  res.json({
    success: true,
    data: teams,
  });
};

export const getTeam = async (req: Request, res: Response) => {
  const team = await teamService.getTeamById(req.params.id);

  res.json({
    success: true,
    data: team,
  });
};

export const createTeam = async (req: Request, res: Response) => {
  const team = await teamService.createTeam(
    req.body.name,
    req.file,
    userId(req),
  );

  res.status(201).json({
    success: true,
    data: team,
  });
};

export const updateTeam = async (req: Request, res: Response) => {
  const team = await teamService.updateTeam(
    req.params.id,
    req.body.name,
    req.file,
  );

  res.json({
    success: true,
    data: team,
  });
};

export const deleteTeam = async (req: Request, res: Response) => {
  await teamService.deleteTeam(req.params.id);

  res.json({
    success: true,
    message: "Team deleted",
  });
};
