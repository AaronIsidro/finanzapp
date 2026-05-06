import { Injectable } from '@angular/core';
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged, User
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class AuthService {

  getUsuarioActual(): Observable<User | null> {
    return new Observable(observer => {
      onAuthStateChanged(auth, user => observer.next(user));
    });
  }

  registro(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout(): Promise<any> {
    return signOut(auth);
  }
}