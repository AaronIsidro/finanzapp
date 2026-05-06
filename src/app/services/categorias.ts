import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection,
  addDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id?: string;
  nombre: string;
  icono: string;
}

const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
const db = getFirestore(app);

@Injectable({ providedIn: 'root' })
export class CategoriasService {

  getAll(): Observable<Categoria[]> {
    return new Observable(observer => {
      const col = collection(db, 'categorias');
      onSnapshot(col, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Categoria));
        observer.next(data);
      });
    });
  }

  add(c: Categoria): Promise<any> {
    return addDoc(collection(db, 'categorias'), c);
  }

  delete(id: string): Promise<any> {
    return deleteDoc(doc(db, 'categorias', id));
  }
}