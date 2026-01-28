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
  peligros: { tipo: string; peligro: string }[];
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private registros: Registro[] = [
    { id: 1, descripcion: 'Mantenimiento de turbinas', usuarioSolicitante: 'alfredo', fechaSolicitud: '2025-01-15', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'ACTIVIDADES Y SERVICIOS O&M', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 2, descripcion: 'Instalación de tableros eléctricos', usuarioSolicitante: 'pedro', fechaSolicitud: '2025-01-18', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'MANTENIMIENTO MAYORES', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 3, descripcion: 'Reparación de válvulas de presión', usuarioSolicitante: 'alfredo', fechaSolicitud: '2025-01-20', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'PROYECTOS INTERNOS y OBRAS CIVILES', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 4, descripcion: 'Limpieza de tanques industriales', usuarioSolicitante: 'pedro', fechaSolicitud: '2025-01-22', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'TRABAJOS EN ZONAS REMOTAS', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 5, descripcion: 'Soldadura de estructuras metálicas', usuarioSolicitante: 'alfredo', fechaSolicitud: '2025-01-25', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'ACTIVIDADES Y SERVICIOS O&M', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 6, descripcion: 'Inspección de líneas de alta tensión', usuarioSolicitante: 'pedro', fechaSolicitud: '2025-01-27', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'MANTENIMIENTO MAYORES', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 7, descripcion: 'Montaje de andamios nivel 3', usuarioSolicitante: 'alfredo', fechaSolicitud: '2025-01-28', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'PROYECTOS INTERNOS y OBRAS CIVILES', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 8, descripcion: 'Mantenimiento de compresores', usuarioSolicitante: 'pedro', fechaSolicitud: '2025-02-01', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'TRABAJOS EN ZONAS REMOTAS', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 9, descripcion: 'Excavación para cimentación', usuarioSolicitante: 'alfredo', fechaSolicitud: '2025-02-03', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'ACTIVIDADES Y SERVICIOS O&M', tareasCriticas: [], factoresAlerta: [], peligros: [] },
    { id: 10, descripcion: 'Cambio de transformadores', usuarioSolicitante: 'pedro', fechaSolicitud: '2025-02-05', administradorContrato: 'alfredo', sede: 'Cerro del Aguila', tipoTrabajo: 'MANTENIMIENTO MAYORES', tareasCriticas: [], factoresAlerta: [], peligros: [] },
  ];
  private nextId = 11;

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
      existing.peligros = reg.peligros;
    }
  }

  getById(id: number): Registro | undefined {
    return this.registros.find((r) => r.id === id);
  }

  delete(id: number): void {
    this.registros = this.registros.filter((r) => r.id !== id);
  }
}
