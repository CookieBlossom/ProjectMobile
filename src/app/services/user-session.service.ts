import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from './users';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private userSession = new BehaviorSubject<Users | null>(null);

  constructor(private nativeStorage: NativeStorage) { }

  setUserSession(user: Users) {
    this.userSession.next(user);
    return this.nativeStorage.setItem('userSession', JSON.stringify(user))
      .then(() => {
        console.log('Sesión guardada en NativeStorage');
      })
      .catch(error => {
        console.error('Error al guardar la sesión en NativeStorage:', error);
        throw error;
      });
  }

  getUserSession() {
    return this.userSession.asObservable();
  }
  async updateUserSession(updatedUser: Users) {
    await this.nativeStorage.setItem('userSession', JSON.stringify(updatedUser))
      .then(() => {
        console.log('Sesión de usuario actualizada en NativeStorage:', updatedUser);
      })
      .catch(error => {
        console.error('Error al actualizar la sesión en NativeStorage:', error);
      });
  }
  deleteUserSession() {
    this.userSession.next(null);
    return this.nativeStorage.remove('userSession')
      .then(() => {
        console.log('Sesión eliminada de NativeStorage');
      })
      .catch(error => {
        console.error('Error al eliminar la sesión de NativeStorage:', error);
        throw error;
      });
    }
}
