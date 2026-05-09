import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  setDoc, doc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';

export interface PuntoHistorico {
  fecha: string;
  tasa: number;
}

const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
const db = getFirestore(app);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class HistoricoService {

  private getColPath(origen: string, destino: string): string {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    return `usuarios/${uid}/historico_${origen}_${destino}`;
  }

  async guardar(origen: string, destino: string, tasa: number): Promise<void> {
    const hoy = new Date();
    const fecha = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
    const colPath = this.getColPath(origen, destino);
    
    await setDoc(doc(db, colPath, fecha.replace(/\//g, '-')), { fecha, tasa });
  }

  async getAll(origen: string, destino: string): Promise<PuntoHistorico[]> {
    const colPath = this.getColPath(origen, destino);
    const snapshot = await getDocs(collection(db, colPath));
    const datos = snapshot.docs.map(d => d.data() as PuntoHistorico);
    
    return datos.sort((a, b) => {
      const [da, ma, ya] = a.fecha.split('/').map(Number);
      const [db2, mb, yb] = b.fecha.split('/').map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db2).getTime();
    });
  }
}
