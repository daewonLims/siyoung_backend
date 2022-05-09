import { User } from 'src/domain/user.schema';
import { EntityRepository, Repository } from 'typeorm';
/**
 * 저장소 선언
 */
@EntityRepository(User)
export class UserRepository extends Repository<User>{}