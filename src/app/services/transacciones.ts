import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection,
  addDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Transaccion {
  id?: string;
  concepto: string;
  importe: number;
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  fecha: string;
}

const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
const db = getFirestore(app);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class TransaccionesService {

  private getCol() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    return collection(db, `usuarios/${uid}/transacciones`);
  }

  getAll(): Observable<Transaccion[]> {
    return new Observable(observer => {
      const col = this.getCol();
      onSnapshot(col, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaccion));
        observer.next(data);
      });
    });
  }

  add(t: Transaccion): Promise<any> {
    return addDoc(this.getCol(), t);
  }

  delete(id: string): Promise<any> {
    const uid = auth.currentUser?.uid;
    return deleteDoc(doc(db, `usuarios/${uid}/transacciones`, id));
  }
}