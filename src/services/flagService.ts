import {
  FlagRepository,
  type UpdateFlagStatusInput,
} from '../repositories/flagRepository.ts';

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(
    flagRepository: FlagRepository = new FlagRepository(),
  ) {
    this.flagRepository = flagRepository;
  }

  async getAllFlags() {
    return this.flagRepository.findAll();
  }

  async updateFlagStatus(
    id: number,
    input: UpdateFlagStatusInput,
  ) {
    const flag = await this.flagRepository.updateStatus(id, input);

    if (!flag) {
      throw new Error('FLAG_NOT_FOUND');
    }

    return flag;
  }
}