import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../domain/user.entity';
/**
 * 저장소 선언
 */
@EntityRepository(User)
export class UserRepository extends Repository<User>{}