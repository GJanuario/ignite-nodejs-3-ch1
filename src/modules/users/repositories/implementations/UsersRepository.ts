import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return this.repository.findOneOrFail(user_id, {
      relations: ['games']
    })
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      'SELECT * FROM users ORDER BY first_name ASC'
    );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(
      `SELECT * FROM users WHERE 
      lower(first_name) = '${first_name.toLowerCase()}' AND 
      lower(last_name) = '${last_name.toLowerCase()}'`
    );
    return user
  }
}
