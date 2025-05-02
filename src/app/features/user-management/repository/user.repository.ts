import { Injectable, inject } from '@angular/core';
import { IUserRepository } from './user.repository.interface';
import { map, Observable } from 'rxjs';
import { User } from '../../auth/interfaces/auth.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }
}
