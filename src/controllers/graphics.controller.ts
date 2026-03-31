import { Request, Response } from "express";
import { graphicsService } from "../services/graphics.service";

export const getGraphics = async (req: Request, res: Response) => {
  const { type, status, limit, offset } = req.query as {
    type?: string;
    status?: string;
    limit?: string;
    offset?: string;
  };

  const { count, rows } = await graphicsService.getGraphics({
    type,
    status,
    limit,
    offset,
  });

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
  const graphic = await graphicsService.createGraphic(req.body);

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

export const deleteGraphic = async (req: Request, res: Response) => {
  await graphicsService.deleteGraphic(req.params.id);

  res.json({
    success: true,
    message: "Graphic deleted",
  });
};

export const getLatestDrafts = async (_req: Request, res: Response) => {
  const drafts = await graphicsService.getLatestDrafts();

  res.json({
    success: true,
    data: drafts,
  });
};
