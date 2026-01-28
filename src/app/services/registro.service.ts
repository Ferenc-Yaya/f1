import { Injectable } from '@angular/core';

export interface TareaCritica {
  tarea: string;
  riesgo: string;
}

export interface Registro {
  id: number;
  descripcion: string;
  usuarioSolicitante: string;
  fechaSolicitud: string;
  administradorContrato: string;
  sede: string;
  tipoTrabajo: string;
  tareasCriticas: TareaCritica[];
  factoresAlerta: { factor: string; nivel: string }[];
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private registros: Registro[] = [];
  private nextId = 1;

  getAll(): Registro[] {
    return this.registros;
  }

  add(reg: Omit<Registro, 'id'>): void {
    this.registros.push({ ...reg, id: this.nextId++ });
  }

  update(id: number, reg: Omit<Registro, 'id'>): void {
    const existing = this.registros.find((r) => r.id === id);
    if (existing) {
      existing.descripcion = reg.descripcion;
      existing.usuarioSolicitante = reg.usuarioSolicitante;
      existing.fechaSolicitud = reg.fechaSolicitud;
      existing.administradorContrato = reg.administradorContrato;
      existing.sede = reg.sede;
      existing.tipoTrabajo = reg.tipoTrabajo;
      existing.tareasCriticas = reg.tareasCriticas;
      existing.factoresAlerta = reg.factoresAlerta;
    }
  }

  getById(id: number): Registro | undefined {
    return this.registros.find((r) => r.id === id);
  }

  delete(id: number): void {
    this.registros = this.registros.filter((r) => r.id !== id);
  }
}
