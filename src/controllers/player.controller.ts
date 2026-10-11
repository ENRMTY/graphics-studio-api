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
      photoUrl: p.photoUrl,
      lastUsed: p.lastUsed,
    })),
  });
};

export const uploadPlayerPhoto = async (req: Request, res: Response) => {
  const uid = (req as any).user?.id ?? null;
  const number =
    req.body.number === undefined || req.body.number === ""
      ? null
      : Number(req.body.number);

  const player = await playerService.uploadPhoto(
    req.body.name,
    req.file,
    Number.isFinite(number) ? number : null,
    req.body.position,
    uid,
  );

  res.json({
    success: true,
    data: {
      name: player.name,
      number: player.number,
      position: player.position,
      photoUrl: player.photoUrl,
      lastUsed: player.lastUsed,
    },
  });
};

export const bulkUpsertPlayers = async (req: Request, res: Response) => {
  const uid = (req as any).user?.id ?? null;

  await playerService.bulkUpsertPlayers(req.body.players, uid);

  res.json({ success: true });
};
