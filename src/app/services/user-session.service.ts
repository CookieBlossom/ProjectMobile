import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private userSession = new BehaviorSubject<Users | null>(null);
  constructor() { }

  setUserSession(user: Users) {
    this.userSession.next(user);
  }

  getUserSession() {
    return this.userSession.asObservable();
  }
}
