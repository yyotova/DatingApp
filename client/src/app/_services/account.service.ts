import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  private currentUserStore = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserStore.asObservable();

  constructor(private http: HttpClient) { }

  // pipe is before the component gets subscription
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserStore.next(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserStore.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserStore.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserStore.next(null);
  }
}
