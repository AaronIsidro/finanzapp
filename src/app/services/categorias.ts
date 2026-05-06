import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection,
  addDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id?: string;
  nombre: string;
  icono: string;
}

const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
const db = getFirestore(app);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class CategoriasService {

  private getCol() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(db, `usuarios/${uid}/categorias`);
  }

  getAll(): Observable<Categoria[]> {
    return new Observable(observer => {
      const col = this.getCol();
      onSnapshot(col, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Categoria));
        observer.next(data);
      });
    });
  }

  add(c: Categoria): Promise<any> {
    return addDoc(this.getCol(), c);
  }

  delete(id: string): Promise<any> {
    const uid = auth.currentUser?.uid;
    return deleteDoc(doc(db, `usuarios/${uid}/categorias`, id));
  }
}