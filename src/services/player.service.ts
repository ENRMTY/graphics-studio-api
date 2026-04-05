import { playerRepository } from "../repositories/player.repository";

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
          name: p.name,
          number: p.number,
          position: p.position || "",
          lastUsed: now,
        });
      }
    }
  },
};
