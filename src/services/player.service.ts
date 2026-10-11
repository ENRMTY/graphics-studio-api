import { playerRepository } from "../repositories/player.repository";
import { HttpError } from "../middleware/errorHandler";
import { deleteImage, uploadImage } from "../utils/cloudinary";

export const playerService = {
  async getPlayers(userId?: string | null) {
    return playerRepository.findAll(userId);
  },

  async bulkUpsertPlayers(
    players: { name: string; number: number | null; position: string }[],
    userId?: string | null,
  ) {
    if (!Array.isArray(players)) {
      throw new Error("players must be an array");
    }

    const now = new Date();

    for (const p of players) {
      if (!p.name?.trim()) continue;

      const existing = await playerRepository.findOneByName(p.name, userId);

      if (existing) {
        await existing.update({
          number: p.number ?? existing.number,
          position: p.position || existing.position,
          lastUsed: now,
        });
      } else {
        await playerRepository.create({
          userId: userId ?? null,
          name: p.name.trim(),
          number: p.number,
          position: p.position || "",
          lastUsed: now,
        });
      }
    }
  },

  async uploadPhoto(
    name: string | undefined,
    file: Express.Multer.File | undefined,
    number: number | null,
    position: string | undefined,
    userId?: string | null,
  ) {
    if (!name?.trim()) {
      throw new HttpError(400, "name is required");
    }
    if (!file) {
      throw new HttpError(400, "photo is required");
    }

    const existing = await playerRepository.findOneByName(name, userId);
    const result = await uploadImage(
      file.buffer,
      "eol-graphics-studio/players",
    );
    const oldPublicId = existing?.photoPublicId ?? null;

    let player;
    if (existing) {
      await existing.update({
        number: number ?? existing.number,
        position: position || existing.position,
        photoUrl: result.url,
        photoPublicId: result.publicId,
        lastUsed: new Date(),
      });
      player = existing;
    } else {
      player = await playerRepository.create({
        userId: userId ?? null,
        name: name.trim(),
        number,
        position: position || "",
        photoUrl: result.url,
        photoPublicId: result.publicId,
        lastUsed: new Date(),
      });
    }

    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }

    return player;
  },
};
