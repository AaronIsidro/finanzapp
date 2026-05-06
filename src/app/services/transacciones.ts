import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
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

@Injectable({ providedIn: 'root' })
export class TransaccionesService {

  getAll(): Observable<Transaccion[]> {
    return new Observable(observer => {
      const col = collection(db, 'transacciones');
      onSnapshot(col, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaccion));
        observer.next(data);
      });
    });
  }

  add(t: Transaccion): Promise<any> {
    return addDoc(collection(db, 'transacciones'), t);
  }

  delete(id: string): Promise<any> {
    return deleteDoc(doc(db, 'transacciones', id));
  }
}
