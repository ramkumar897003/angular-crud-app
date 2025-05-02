import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { catchError, Observable } from 'rxjs';
import { User } from '../../auth/interfaces/auth.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { handleError } from '../../../shared/utils';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userRepository = inject<IUserRepository>(UserRepository);

  getUsers(): Observable<User[]> {
    return this.userRepository
      .getUsers()
      .pipe(catchError(handleError('Failed to fetch users')));
  }

  getUser(id: number): Observable<User> {
    return this.userRepository
      .getUser(id)
      .pipe(catchError(handleError('Failed to fetch a user')));
  }

  createUser(user: User): Observable<User> {
    return this.userRepository
      .createUser(user)
      .pipe(catchError(handleError('Failed to create a user')));
  }

  updateUser(user: User): Observable<User> {
    return this.userRepository
      .updateUser(user)
      .pipe(catchError(handleError('Failed to update a user')));
  }

  deleteUser(id: number): Observable<void> {
    return this.userRepository
      .deleteUser(id)
      .pipe(catchError(handleError('Faild to delete a user')));
  }

  checkEmailExists(name: string): Observable<boolean> {
    return this.userRepository
      .checkEmailExists(name)
      .pipe(catchError(handleError('Failed to check role name')));
  }
}
