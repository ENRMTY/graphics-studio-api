import { Request, Response } from "express";
import { playerService } from "../services/player.service";

export const getPlayers = async (req: Request, res: Response) => {
  const uid = (req as any).user?.id ?? null;

  const players = await playerService.getPlayers(uid);

  res.json({
    success: true,
    data: players.map((p) => ({
      name: p.name,
      number: p.number,
      position: p.position,
      lastUsed: p.lastUsed,
    })),
  });
};

export const bulkUpsertPlayers = async (req: Request, res: Response) => {
  const uid = (req as any).user?.id ?? null;

  await playerService.bulkUpsertPlayers(req.body.players, uid);

  res.json({ success: true });
};
