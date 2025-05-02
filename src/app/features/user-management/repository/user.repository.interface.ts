import { Observable } from 'rxjs';
import { User } from '../../auth/interfaces/auth.interface';

export interface IUserRepository {
  getUsers(): Observable<User[]>;
  getUser(id: number): Observable<User>;
  createUser(user: User): Observable<User>;
  updateUser(user: User): Observable<User>;
  deleteUser(id: number): Observable<void>;
  checkEmailExists(email: string): Observable<boolean>;
}
