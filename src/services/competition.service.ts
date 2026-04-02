import { competitionRepository } from "../repositories/competition.repository";
import { HttpError } from "../middleware/errorHandler";
import { uploadImage, deleteImage } from "../utils/cloudinary";

// types
type CreateCompetitionInput = {
  name?: string;
  color?: string;
  file?: Express.Multer.File;
};

type UpdateCompetitionInput = {
  id: string;
  name?: string;
  color?: string;
  file?: Express.Multer.File;
};

export const competitionService = {
  async getCompetitions() {
    return competitionRepository.findAll();
  },

  async createCompetition(input: CreateCompetitionInput) {
    const { name, color, file } = input;

    if (!name?.trim()) {
      throw new HttpError(400, "name is required");
    }

    const existingCompetition = await competitionRepository.findByName(
      name.trim(),
    );
    if (existingCompetition) {
      throw new HttpError(400, "A competition with this name already exists");
    }

    let iconUrl: string | null = null;
    let iconPublicId: string | null = null;

    if (file) {
      const result = await uploadImage(file.buffer, "eol-graphics-studio/competitions");
      iconUrl = result.url;
      iconPublicId = result.publicId;
    }

    return competitionRepository.create({
      name: name.trim(),
      color: color ?? "#C8102E",
      iconUrl,
      iconPublicId,
    });
  },

  async updateCompetition(input: UpdateCompetitionInput) {
    const { id, name, color, file } = input;

    const competition = await competitionRepository.findById(id);

    if (!competition) {
      throw new HttpError(404, "Competition not found");
    }

    if (name?.trim()) {
      competition.name = name.trim();
    }

    const existingCompetition = await competitionRepository.findByName(
      competition.name,
    );
    if (existingCompetition && existingCompetition.id !== competition.id) {
      throw new HttpError(400, "A competition with this name already exists");
    }

    if (color?.trim()) {
      competition.color = color.trim();
    }

    if (file) {
      if (competition.iconPublicId) {
        await deleteImage(competition.iconPublicId);
      }

      const result = await uploadImage(file.buffer, "eol-graphics-studio/competitions");

      competition.iconUrl = result.url;
      competition.iconPublicId = result.publicId;
    }

    return competitionRepository.save(competition);
  },

  async deleteCompetition(id: string) {
    const competition = await competitionRepository.findById(id);

    if (!competition) {
      throw new HttpError(404, "Competition not found");
    }

    if (competition.iconPublicId) {
      await deleteImage(competition.iconPublicId);
    }

    await competitionRepository.delete(competition);
  },
};
