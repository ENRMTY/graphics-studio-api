import { teamRepository } from "../repositories/team.repository";
import { HttpError } from "../middleware/errorHandler";
import { deleteImage, uploadImage } from "../utils/cloudinary";

export const teamService = {
  async getTeams() {
    return teamRepository.findAll();
  },

  async getTeamById(id: string) {
    const team = await teamRepository.findById(id);

    if (!team) {
      throw new HttpError(404, "Team not found");
    }

    return team;
  },

  async createTeam(name?: string, file?: Express.Multer.File) {
    if (!name?.trim()) {
      throw new HttpError(400, "name is required");
    }

    let logoUrl: string | null = null;
    let logoPublicId: string | null = null;

    if (file) {
      const result = await uploadImage(file.buffer, "lfc-studio/teams");
      logoUrl = result.url;
      logoPublicId = result.publicId;
    }

    return teamRepository.create({
      name: name.trim(),
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
      team.name = name.trim();
    }

    if (file) {
      if (team.logoPublicId) {
        await deleteImage(team.logoPublicId);
      }

      const result = await uploadImage(file.buffer, "lfc-studio/teams");

      const oldLogo = team.logoPublicId;

      team.logoUrl = result.url;
      team.logoPublicId = result.publicId;

      await teamRepository.save(team);

      if (oldLogo) {
        await deleteImage(oldLogo);
      }
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
