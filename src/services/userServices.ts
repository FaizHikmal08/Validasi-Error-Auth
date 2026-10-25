import {
  UserRepository,
  type CreateUserInput,
} from '../repositories/userRepository.ts';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(input: CreateUserInput) {
    return this.userRepository.create(input);
  }
}