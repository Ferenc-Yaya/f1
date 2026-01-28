import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegistroService } from '../services/registro.service';

interface TipoTrabajoOption {
  value: string;
  label: string;
  descripcion: string;
}

interface TareaCriticaItem {
  nombre: string;
  seleccionada: boolean;
  riesgo: string;
}

@Component({
  selector: 'app-registro-form',
  imports: [FormsModule],
  templateUrl: './registro-form.html',
})
export class RegistroForm implements OnInit {
  descripcion = '';
  usuarioSolicitante = '';
  fechaSolicitud = '';
  administradorContrato = '';
  sede = '';
  tipoTrabajo = '';
  archivoTdr: File | null = null;
  archivoTdrNombre = '';

  tiposTrabajoOptions: TipoTrabajoOption[] = [
    {
      value: 'OYM',
      label: 'ACTIVIDADES Y SERVICIOS O&M',
      descripcion: 'Trabajos en areas operativas, campamento, almacenes, talleres, oficinas, etc. Cuando se realicen tareas diferentes a las tareas de rutina operativa.',
    },
    {
      value: 'MANTENIMIENTO',
      label: 'MANTENIMIENTO MAYORES',
      descripcion: 'Intervenciones programadas que requieren la detencion parcial o total de la operacion para ejecutar trabajos complejos de mantenimiento y/o reparacion. Incluyen una o mas tareas criticas y demandan una planificacion rigurosa bajo estandares EHS.',
    },
    {
      value: 'PROYECTOS',
      label: 'PROYECTOS INTERNOS y OBRAS CIVILES',
      descripcion: 'Servicios de gran envergadura que requieren organizacion propia del contratista, abarcan multiples procesos constructivos y operativos por mas de 3 semanas, con tareas criticas dinamicas que deben gestionarse bajo un sistema EHS especifico del proyecto.',
    },
    {
      value: 'ZONAS_REMOTAS',
      label: 'TRABAJOS EN ZONAS REMOTAS',
      descripcion: 'Actividades realizadas en entornos naturales, alejadas de las instalaciones principales de la compania, requieren desplazamiento a pie por caminos de herradura y demandan condiciones especiales de seguridad, comunicacion y logistica.',
    },
  ];

  tareasCriticas: TareaCriticaItem[] = [
    { nombre: 'TRABAJOS ELECTRICOS', seleccionada: false, riesgo: '' },
    { nombre: 'TRABAJO EN CUERPOS DE AGUA (CERCA, SOBRE, DENTRO)', seleccionada: false, riesgo: '' },
    { nombre: 'TRABAJO EN ALTURA', seleccionada: false, riesgo: '' },
    { nombre: 'CONDUCCION DE VEHICULOS', seleccionada: false, riesgo: '' },
    { nombre: 'ESPACIOS CONFINADOS', seleccionada: false, riesgo: '' },
    { nombre: 'TRABAJO EN CALIENTE', seleccionada: false, riesgo: '' },
    { nombre: 'CONTROL DE ENERGIA', seleccionada: false, riesgo: '' },
    { nombre: 'EXCAVACION', seleccionada: false, riesgo: '' },
    { nombre: 'IZAJES / LEVANTAMIENTO DE CARGAS', seleccionada: false, riesgo: '' },
    { nombre: 'TRABAJO CON QUIMICOS', seleccionada: false, riesgo: '' },
    { nombre: 'TRABAJOS EN ZONAS REMOTAS (SENDERISMO)', seleccionada: false, riesgo: '' },
  ];

  factoresAlertaAlto: { nombre: string; seleccionada: boolean }[] = [
    { nombre: 'Trabajos de construccion, demolicion de infraestructura o excavaciones a escala tal que involucre factores de lesion grave a una persona (uso de equipo pesado, pilas altas de material, etc)', seleccionada: false },
    { nombre: 'Instalacion, mantenimiento y reparacion de equipo a escala tan importante que involucre factores de lesion grave a una persona', seleccionada: false },
    { nombre: 'Manipulacion de elementos radioactivos, explosivos, aviacion y otros trabajos especiales de alto potencial', seleccionada: false },
  ];

  factoresAlertaMedio: { nombre: string; seleccionada: boolean }[] = [
    { nombre: 'Interaccion varios equipos de maquinaria pesada con las personas cuando estan realizando maniobras', seleccionada: false },
    { nombre: 'Trabajos de Mantenimiento de equipos industriales, mecanico o electricos a mediana escala. Ejemplo: compresor de aire, tornos, puente grua, equipamiento de subestaciones, rectificadores, etc', seleccionada: false },
    { nombre: 'Trabajos con presencia de agentes biologicos (desechos hospitalarios, presencia de animales)', seleccionada: false },
    { nombre: 'Trabajo Nocturno', seleccionada: false },
  ];

  otrosFactoresAlerta: { nombre: string; seleccionada: boolean }[] = [
    { nombre: 'Operacion estacionaria de equipo pesado en ubicaciones alejadas de las personas', seleccionada: false },
    { nombre: 'Trabajos de Mantenimiento de equipos industriales mecanicos - electricos a pequena escala. Ejemplo: equipos de operacion de campamentos, equipos de instrumentacion y control', seleccionada: false },
    { nombre: 'Trabajos en paralelo realizado por diferentes cuadrillas dentro de una misma area fisica', seleccionada: false },
    { nombre: 'Trabajo en zonas con ruido mayor a 85 dB, de manera frecuente (mayor a 75% de la jornada)', seleccionada: false },
    { nombre: 'Uso de herramientas punzocortantes', seleccionada: false },
    { nombre: 'Manipulacion manual de cargas con peso mayor a 25 Kg. (de manera frecuente, mayor al 50% de la jornada)', seleccionada: false },
    { nombre: 'Trabajos a la intemperie con exposicion a radiacion solar, mayor al 70% de la jornada', seleccionada: false },
    { nombre: 'Trabajos a la intemperie con posibilidad de exposicion a tormentas electricas', seleccionada: false },
    { nombre: 'Trabajos remotos o gabinetes, sin necesidad de ingresar a las distintas sedes para la ejecucion del servicio', seleccionada: false },
  ];

  editandoId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private registroService: RegistroService
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editandoId = Number(idParam);
      const reg = this.registroService.getById(this.editandoId);
      if (reg) {
        this.descripcion = reg.descripcion;
        this.usuarioSolicitante = reg.usuarioSolicitante;
        this.fechaSolicitud = reg.fechaSolicitud;
        this.administradorContrato = reg.administradorContrato;
        this.sede = reg.sede;
        this.tipoTrabajo = reg.tipoTrabajo;
        for (const tc of reg.tareasCriticas) {
          const item = this.tareasCriticas.find((t) => t.nombre === tc.tarea);
          if (item) {
            item.seleccionada = true;
            item.riesgo = tc.riesgo;
          }
        }
        for (const fa of reg.factoresAlerta) {
          const allFactores = [...this.factoresAlertaAlto, ...this.factoresAlertaMedio, ...this.otrosFactoresAlerta];
          const item = allFactores.find((f) => f.nombre === fa.factor);
          if (item) {
            item.seleccionada = true;
          }
        }
      }
    } else {
      this.administradorContrato = user.cargo === 'Administrador de Contrato' ? user.username : '';
      this.sede = user.sede;
    }
  }

  get tipoTrabajoDescripcion(): string {
    const found = this.tiposTrabajoOptions.find((t) => t.value === this.tipoTrabajo);
    return found ? found.descripcion : '';
  }

  onTareaChange(tarea: TareaCriticaItem) {
    if (!tarea.seleccionada) {
      tarea.riesgo = '';
    }
  }

  guardar() {
    if (!this.descripcion || !this.usuarioSolicitante || !this.fechaSolicitud) return;

    const tareasCriticas = this.tareasCriticas
      .filter((t) => t.seleccionada)
      .map((t) => ({ tarea: t.nombre, riesgo: t.riesgo }));

    const factoresAlerta = [
      ...this.factoresAlertaAlto.filter((f) => f.seleccionada).map((f) => ({ factor: f.nombre, nivel: 'ALTO' })),
      ...this.factoresAlertaMedio.filter((f) => f.seleccionada).map((f) => ({ factor: f.nombre, nivel: 'MEDIO' })),
      ...this.otrosFactoresAlerta.filter((f) => f.seleccionada).map((f) => ({ factor: f.nombre, nivel: 'OTRO' })),
    ];

    const data = {
      descripcion: this.descripcion,
      usuarioSolicitante: this.usuarioSolicitante,
      fechaSolicitud: this.fechaSolicitud,
      administradorContrato: this.administradorContrato,
      sede: this.sede,
      tipoTrabajo: this.tipoTrabajo,
      tareasCriticas,
      factoresAlerta,
    };

    if (this.editandoId !== null) {
      this.registroService.update(this.editandoId, data);
    } else {
      this.registroService.add(data);
    }

    this.router.navigate(['/home']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoTdr = input.files[0];
      this.archivoTdrNombre = this.archivoTdr.name;
    }
  }

  quitarArchivo() {
    this.archivoTdr = null;
    this.archivoTdrNombre = '';
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
