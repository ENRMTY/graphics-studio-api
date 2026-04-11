import { Request, Response } from "express";
import { graphicsService } from "../services/graphics.service";

const userId = (req: Request): string | undefined => (req as any).user?.id;

export const getGraphics = async (req: Request, res: Response) => {
  const { type, status, limit, offset } = req.query as Record<
    string,
    string | undefined
  >;

  const { count, rows } = await graphicsService.getGraphics(
    { type, status, limit, offset },
    userId(req),
  );

  res.json({
    success: true,
    total: count,
    data: rows,
  });
};

export const getGraphic = async (req: Request, res: Response) => {
  const graphic = await graphicsService.getGraphicById(req.params.id);

  res.json({
    success: true,
    data: graphic,
  });
};

export const createGraphic = async (req: Request, res: Response) => {
  const graphic = await graphicsService.createGraphic(req.body, userId(req));

  res.status(201).json({
    success: true,
    data: graphic,
  });
};

export const updateGraphic = async (req: Request, res: Response) => {
  const graphic = await graphicsService.updateGraphic(req.params.id, req.body);

  res.json({
    success: true,
    data: graphic,
  });
};

export const updateBackground = async (req: Request, res: Response) => {
  const graphic = await graphicsService.updateBackground(
    req.params.id,
    req.file,
  );

  res.json({
    success: true,
    data: graphic,
  });
};

export const updatePlayerImage = async (req: Request, res: Response) => {
  const graphic = await graphicsService.updatePlayerImage(
    req.params.id,
    req.file,
  );

  res.json({
    success: true,
    data: graphic,
  });
};

export const clearBackground = async (req: Request, res: Response) => {
  const graphic = await graphicsService.clearBackground(req.params.id);
  res.json({ success: true, data: graphic });
};

export const clearPlayerImage = async (req: Request, res: Response) => {
  const graphic = await graphicsService.clearPlayerImage(req.params.id);
  res.json({ success: true, data: graphic });
};

export const deleteGraphic = async (req: Request, res: Response) => {
  await graphicsService.deleteGraphic(req.params.id);

  res.json({
    success: true,
    message: "Graphic deleted",
  });
};

export const getLatestDrafts = async (req: Request, res: Response) => {
  const drafts = await graphicsService.getLatestDrafts(userId(req));

  res.json({
    success: true,
    data: drafts,
  });
};
