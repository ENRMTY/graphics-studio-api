import { teamRepository } from "../repositories/team.repository";
import { HttpError } from "../middleware/errorHandler";
import { deleteImage, uploadImage } from "../utils/cloudinary";

export const teamService = {
  async getTeams(userId?: string) {
    return teamRepository.findAll(userId);
  },

  async getTeamById(id: string) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new HttpError(404, "Team not found");
    }
    return team;
  },

  async createTeam(name?: string, file?: Express.Multer.File, userId?: string) {
    if (!name?.trim()) {
      throw new HttpError(400, "name is required");
    }

    /*const existingTeam = await teamRepository.findByName(name.trim());
    if (existingTeam) {
      throw new HttpError(400, "A team with this name already exists");
    }*/

    let logoUrl: string | null = null;
    let logoPublicId: string | null = null;

    if (file) {
      const result = await uploadImage(
        file.buffer,
        "eol-graphics-studio/teams",
      );
      logoUrl = result.url;
      logoPublicId = result.publicId;
    }

    return teamRepository.create({
      name: name.trim(),
      userId: userId ?? null,
      logoUrl,
      logoPublicId,
    });
  },

  async updateTeam(id: string, name?: string, file?: Express.Multer.File) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new HttpError(404, "Team not found");
    }

    if (name?.trim()) {
      /*const existingTeam = await teamRepository.findByName(name.trim());
      if (existingTeam && existingTeam.id !== team.id) {
        throw new HttpError(400, "A team with this name already exists");
      }*/
      team.name = name.trim();
    }

    if (file) {
      const oldPublicId = team.logoPublicId;
      const result = await uploadImage(
        file.buffer,
        "eol-graphics-studio/teams",
      );
      team.logoUrl = result.url;
      team.logoPublicId = result.publicId;

      await teamRepository.save(team);

      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    } else {
      await teamRepository.save(team);
    }

    return team;
  },

  async deleteTeam(id: string) {
    const team = await teamRepository.findById(id);
    if (!team) {
      throw new HttpError(404, "Team not found");
    }

    const logoPublicId = team.logoPublicId;
    await teamRepository.delete(team);

    if (logoPublicId) {
      await deleteImage(logoPublicId);
    }
  },
};
