import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../repository/user.repository';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../auth/interfaces/auth.interface';
import { IUserRepository } from '../repository/user.repository.interface';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userRepository = inject<IUserRepository>(UserRepository);

  getUsers(): Observable<User[]> {
    return this.userRepository.getUsers();
  }

  getUser(id: number): Observable<User> {
    return this.userRepository.getUser(id);
  }

  createUser(user: User): Observable<User> {
    return this.userRepository.createUser(user);
  }

  updateUser(user: User): Observable<User> {
    return this.userRepository.updateUser(user);
  }

  deleteUser(id: number): Observable<void> {
    return this.userRepository.deleteUser(id);
  }

  checkEmailExists(name: string): Observable<boolean> {
    return this.userRepository.checkEmailExists(name).pipe(
      catchError((error) => {
        console.error('Error checking role name:', error);
        return throwError(() => new Error('Failed to check role name'));
      })
    );
  }
}
