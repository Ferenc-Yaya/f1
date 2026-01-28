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

interface FactorAlerta {
  nombre: string;
  seleccionada: boolean;
}

interface TareaCriticaItem {
  nombre: string;
  seleccionada: boolean;
  riesgo: string;
  factoresAlto: FactorAlerta[];
  factoresMedio: FactorAlerta[];
  factoresBajo: FactorAlerta[];
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
  modalAbiertoIndex: number | null = null;

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
    {
      nombre: 'TRABAJOS ELECTRICOS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Trabajos cerca de circuitos electricos de media y alta tension energizados (tableros, lineas, conductores) dentro de un radio menor a 03 metros', seleccionada: false },
        { nombre: 'Trabajos Electricos por encima de 440 V', seleccionada: false },
        { nombre: 'Pruebas o actividades de desconexion y aterramiento sobre sistemas energizados', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Trabajos cerca de circuitos electricos energizados mas alla del 150% de la distancia de seguridad (distancia de arco o limite de aproximacion) o 4.5 metros', seleccionada: false },
        { nombre: 'Trabajos Electricos hasta 440 V', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Trabajos de medicion de parametros o termografia con sistemas cerrados o fuera de la distancia de seguridad', seleccionada: false },
      ],
    },
    {
      nombre: 'TRABAJO EN CUERPOS DE AGUA (CERCA, SOBRE, DENTRO)',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Actividades de navegacion o buceo en cuerpos de agua o reservorios con mayores a 2.5 metros de profundidad', seleccionada: false },
        { nombre: 'Actividades con exposicion a caidas desde plataformas o espacios colindantes con cuerpos de agua de mas de 2.5 metros de profundidad', seleccionada: false },
        { nombre: 'Actividades en cauces secos, liberados o a pie de presa con exposicion a caudales de agua o crecida de rios', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Actividades de navegacion o buceo en cuerpos de agua o reservorios entre 1.5 a 2.5 metros de profundidad', seleccionada: false },
        { nombre: 'Actividades con exposicion a caidas desde plataformas o espacios colindantes con cuerpos de agua entre 1.5 a 2.5 metros de profundidad', seleccionada: false },
        { nombre: 'Actividades cerca de cuerpos de agua con caudales entre 5 a 30 m3/s', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Actividades con exposicion a caidas desde barcasas, plataformas o espacios colindantes con cuerpos de agua menor a 1.5 metros y caudales menores a 5 m3/s', seleccionada: false },
        { nombre: 'Navegacion como pasajero en embarcaciones operadas por otro contratista calificado', seleccionada: false },
        { nombre: 'Actividades con exposicion a caidas desde plataformas o espacios colindantes en areas de trabajo provistas con barreras duras por otro contratista calificado', seleccionada: false },
      ],
    },
    {
      nombre: 'TRABAJO EN ALTURA',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Actividades con exposicion a caidas mayor a 4.5 m (escaleras telescopicas, plataformas, superficies elevadas, andamios)', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Actividades con exposicion a caidas entre 1.8 m y 4.5 m (escaleras telescopicas, plataformas, superficies elevadas, andamios)', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Actividades con exposicion a caidas menor a 1.8 m (escaleras, plataformas, superficies elevadas)', seleccionada: false },
        { nombre: 'Actividades a mayor altura como usuario en superficies o plataformas provistas con barreras duras por otro contratista calificado', seleccionada: false },
      ],
    },
    {
      nombre: 'CONDUCCION DE VEHICULOS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Conduccion de vehiculos como actividad integrante del servicio para transporte de personas a diferentes zonas de la sede que implica ir por trochas, zona de caida de piedras o presencia de precipicios en vehiculos/conductores propios', seleccionada: false },
        { nombre: 'Conduccion de vehiculos como parte del servicio en carreteras externas por periodos mayores a 2 horas/ 150 Km., servicios de transporte de personal. Conduccion de camionetas transporte de personas. En vehiculos/conductores propios', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Conduccion de vehiculos como parte del servicio que implique como maximo 10 horas acumuladas de viaje en el dia en vehiculos/conductores propios', seleccionada: false },
        { nombre: 'Conduccion de vehiculos en cortas distancias (menos de 150 Km), como actividad integrante del servicio y en vehiculos/conductores propios', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Conduccion de vehiculos para transporte de personas y materiales en campamentos, oficinas administrativas o areas urbanas', seleccionada: false },
        { nombre: 'Conduccion de vehiculos en vehiculo alquilados a empresas homologadas y con conductores con experiencia en la ruta, sea para ingreso a plantas desde la ciudad mas proxima indicada en el procedimiento o para traslado como parte integrante del servicio', seleccionada: false },
      ],
    },
    {
      nombre: 'ESPACIOS CONFINADOS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Ingreso a ambientes considerados espacios confinados o espacios restringidos donde se pueden contaminar y convertirse en espacios confinados y que requieren permisos de ingreso', seleccionada: false },
      ],
      factoresMedio: [],
      factoresBajo: [
        { nombre: 'Trabajos en espacios restringidos sin riesgo de contaminacion atmosferica (tuneles, galerias, buzones)', seleccionada: false },
      ],
    },
    {
      nombre: 'TRABAJO EN CALIENTE',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Trabajo con produccion de chispas u otras fuentes de ignicion dentro de 10 metros de areas de almacenamiento o uso de material inflamables o combustibles', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Trabajos con produccion de chispas u otras fuentes de ignicion en zonas fuera del predio o mas alla de 10 metros de areas de almacenamiento o uso de material inflamable', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Actividades cercanos de equipos o sistemas con calor o incandescentes (hornos, tuberias, equipos de soldadura)', seleccionada: false },
        { nombre: 'Actividades de retiro de material de aislamiento termico', seleccionada: false },
      ],
    },
    {
      nombre: 'CONTROL DE ENERGIA',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Actividad sobre equipos o sistemas que trabajan o almacenan cualquier tipo de energia', seleccionada: false },
        { nombre: 'Manejo de fluidos a presion mayor a 300 PSI', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Manejo de fluidos a presion menor a 300 PSI', seleccionada: false },
        { nombre: 'Uso de herramientas de poder (neumatica, electrica, de combustion)', seleccionada: false },
        { nombre: 'Sistemas con tipo de energia que requiera un sistema de bloqueo diferente al normalmente utilizado dentro de plantas', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Trabajos en sistemas o equipos con 0 energia entregados por la planta', seleccionada: false },
        { nombre: 'Operacion de equipos con partes moviles y/o rotativas', seleccionada: false },
      ],
    },
    {
      nombre: 'EXCAVACION',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Excavacion de zanjas o perforacion de terreno dentro de las sedes o cerca de cualquier infraestructura que pudiera tener instalaciones subterraneas de servicio (agua, gas, electricidad) o paredes colindantes', seleccionada: false },
        { nombre: 'Cualquier excavacion o zanja mayor a 4.5 metros', seleccionada: false },
        { nombre: 'Excavaciones mayores a 1.5 metros en terrenos de suelo diferentes al tipo A', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Excavacion de zanjas entre 1.2 a 1.5 metros en locaciones distantes de instalaciones o infraestructura', seleccionada: false },
        { nombre: 'Excavaciones cercanos o colindantes al transito de maquinarias o transporte pesado', seleccionada: false },
        { nombre: 'Perforacion de terreno de cualquier profundidad en locaciones distantes de instalaciones o infraestructura con uso de maquinaria pesada', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Excavacion de zanjas menores a 1.2 metros en locaciones distantes de instalaciones o infraestructura', seleccionada: false },
      ],
    },
    {
      nombre: 'IZAJES / LEVANTAMIENTO DE CARGAS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Izajes Complejos que requieren algunas de estas condiciones: Mas de un equipo de izaje, Subir carga a desniveles mayores de 10 m, Traslada la carga mas alla del alcance de la pluma, La carga viaja o esta cerca de equipos criticos o circuitos energizados (equipos y conductores), Excede 75% de capacidad nominal de la grua', seleccionada: false },
        { nombre: 'Movimiento de cargas mayores a 2 toneladas o con equipos moviles diferentes a un camion grua o grua puente', seleccionada: false },
        { nombre: 'Izaje de personal con canastillas u otros dispositivos', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Operacion de Gruas e Izaje de cargas diferentes a los detallados en los criterios de factor de alerta alto para izajes', seleccionada: false },
        { nombre: 'Uso de tecles y accesorios de izaje manual, con cargas mayores a 150 kg, hasta las 02 toneladas', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Uso de poleas y elementos de izaje para cargas menores a 150 kilos y como maximo a 0.5 metros sobre el suelo', seleccionada: false },
        { nombre: 'Izajes menores a 1.5 metros de altura', seleccionada: false },
      ],
    },
    {
      nombre: 'MANEJO DE PRODUCTOS QUIMICOS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Manipulacion de Quimicos con clasificacion de 4 en algun tipo de peligro en cantidades industriales (mayor a 55 galones o 50 kg de solidos)', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Trabajo con productos quimicos menores a nivel 4 y/o 55 galones', seleccionada: false },
        { nombre: 'Produccion de desechos con quimicos considerados como residuos peligrosos', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Manipulacion de Quimicos con clasificacion hasta nivel 2 en algun tipo de peligro', seleccionada: false },
        { nombre: 'Manejo de botellas de gases comprimidos', seleccionada: false },
      ],
    },
    {
      nombre: 'TRABAJOS EN ZONAS REMOTAS (SENDERISMO)',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Desplazamiento por camino de herraduras > 2 horas', seleccionada: false },
        { nombre: 'Riesgo de caida por talud > 4.5 metros', seleccionada: false },
        { nombre: 'Distancia zona remota a campamento > 2 horas', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Desplazamiento por camino de herraduras entre 1 y 2 horas', seleccionada: false },
        { nombre: 'Riesgo de caida por talud entre 1.8 y 4.5 metros', seleccionada: false },
        { nombre: 'Distancia zona remota a campamento entre 1 y 2 horas', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Desplazamiento por camino de herraduras < 1 hora', seleccionada: false },
        { nombre: 'Riesgo de caida por talud < 1.8 metros', seleccionada: false },
        { nombre: 'Distancia zona remota a campamento < 1 hora', seleccionada: false },
      ],
    },
    {
      nombre: 'OTRAS TAREAS',
      seleccionada: false,
      riesgo: '',
      factoresAlto: [
        { nombre: 'Trabajos de construccion, demolicion de infraestructura o excavaciones a escala tal que involucre factores de lesion grave a una persona (uso de equipo pesado, pilas altas de material, etc)', seleccionada: false },
        { nombre: 'Instalacion, mantenimiento y reparacion de equipo a escala tan importante que involucre factores de lesion grave a una persona', seleccionada: false },
        { nombre: 'Manipulacion de elementos radioactivos, explosivos, aviacion y otros trabajos especiales de alto potencial', seleccionada: false },
      ],
      factoresMedio: [
        { nombre: 'Interaccion varios equipos de maquinaria pesada con las personas cuando estan realizando maniobras', seleccionada: false },
        { nombre: 'Trabajos de Mantenimiento de equipos industriales, mecanico o electricos a mediana escala. Ejemplo: compresor de aire, tornos, puente grua, equipamiento de subestaciones, rectificadores, etc', seleccionada: false },
        { nombre: 'Trabajos con presencia de agentes biologicos (desechos hospitalarios, presencia de animales)', seleccionada: false },
        { nombre: 'Trabajo Nocturno', seleccionada: false },
      ],
      factoresBajo: [
        { nombre: 'Operacion estacionaria de equipo pesado en ubicaciones alejadas de las personas', seleccionada: false },
        { nombre: 'Trabajos de Mantenimiento de equipos industriales mecanicos - electricos a pequena escala. Ejemplo: equipos de operacion de campamentos, equipos de instrumentacion y control', seleccionada: false },
        { nombre: 'Trabajos en paralelo realizado por diferentes cuadrillas dentro de una misma area fisica', seleccionada: false },
        { nombre: 'Trabajo en zonas con ruido mayor a 85 dB, de manera frecuente (mayor a 75% de la jornada)', seleccionada: false },
        { nombre: 'Uso de herramientas punzocortantes', seleccionada: false },
        { nombre: 'Manipulacion manual de cargas con peso mayor a 25 Kg. (de manera frecuente, mayor al 50% de la jornada)', seleccionada: false },
        { nombre: 'Trabajos a la intemperie con exposicion a radiacion solar, mayor al 70% de la jornada', seleccionada: false },
        { nombre: 'Trabajos a la intemperie con posibilidad de exposicion a tormentas electricas', seleccionada: false },
        { nombre: 'Trabajos remotos o gabinetes, sin necesidad de ingresar a las distintas sedes para la ejecucion del servicio', seleccionada: false },
      ],
    },
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
          for (const tarea of this.tareasCriticas) {
            const allFactores = [...tarea.factoresAlto, ...tarea.factoresMedio, ...tarea.factoresBajo];
            const item = allFactores.find((f) => f.nombre === fa.factor);
            if (item) {
              item.seleccionada = true;
            }
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

  tieneFactores(tarea: TareaCriticaItem): boolean {
    return tarea.factoresAlto.length > 0 || tarea.factoresMedio.length > 0 || tarea.factoresBajo.length > 0;
  }

  abrirModal(index: number) {
    this.modalAbiertoIndex = index;
  }

  cerrarModal() {
    this.modalAbiertoIndex = null;
  }

  guardarModal(tarea: TareaCriticaItem) {
    this.actualizarRiesgo(tarea);
    this.cerrarModal();
  }

  actualizarRiesgo(tarea: TareaCriticaItem) {
    const altoCount = tarea.factoresAlto.filter((f) => f.seleccionada).length;
    const medioCount = tarea.factoresMedio.filter((f) => f.seleccionada).length;
    const bajoCount = tarea.factoresBajo.filter((f) => f.seleccionada).length;

    if (altoCount > 0) {
      tarea.riesgo = 'ALTO';
      tarea.seleccionada = true;
    } else if (medioCount > 0) {
      tarea.riesgo = 'MEDIO';
      tarea.seleccionada = true;
    } else if (bajoCount > 0) {
      tarea.riesgo = 'BAJO';
      tarea.seleccionada = true;
    } else {
      tarea.riesgo = '';
      tarea.seleccionada = false;
    }
  }

  getBadgeClass(tarea: TareaCriticaItem): string {
    switch (tarea.riesgo) {
      case 'ALTO': return 'risk-badge badge-high';
      case 'MEDIO': return 'risk-badge badge-medium';
      case 'BAJO': return 'risk-badge badge-low';
      default: return 'risk-badge badge-none';
    }
  }

  getBadgeText(tarea: TareaCriticaItem): string {
    const altoCount = tarea.factoresAlto.filter((f) => f.seleccionada).length;
    const medioCount = tarea.factoresMedio.filter((f) => f.seleccionada).length;
    const bajoCount = tarea.factoresBajo.filter((f) => f.seleccionada).length;

    if (altoCount > 0) return `Alto (${altoCount})`;
    if (medioCount > 0) return `Medio (${medioCount})`;
    if (bajoCount > 0) return `Bajo (${bajoCount})`;
    return 'Sin configurar';
  }

  contarFactores(tarea: TareaCriticaItem, nivel: string): number {
    if (nivel === 'ALTO') return tarea.factoresAlto.filter((f) => f.seleccionada).length;
    if (nivel === 'MEDIO') return tarea.factoresMedio.filter((f) => f.seleccionada).length;
    if (nivel === 'BAJO') return tarea.factoresBajo.filter((f) => f.seleccionada).length;
    return 0;
  }

  tareasSeleccionadas(): number {
    return this.tareasCriticas.filter((t) => t.seleccionada).length;
  }

  contarFactoresPorNivel(nivel: string): number {
    let count = 0;
    for (const t of this.tareasCriticas) {
      if (nivel === 'ALTO') count += t.factoresAlto.filter((f) => f.seleccionada).length;
      if (nivel === 'MEDIO') count += t.factoresMedio.filter((f) => f.seleccionada).length;
      if (nivel === 'BAJO') count += t.factoresBajo.filter((f) => f.seleccionada).length;
    }
    return count;
  }

  nivelGlobal(): string {
    const alto = this.contarFactoresPorNivel('ALTO');
    const medio = this.contarFactoresPorNivel('MEDIO');
    const bajo = this.contarFactoresPorNivel('BAJO');
    const combinado = medio + bajo;

    if (alto === 0 && medio === 0 && bajo === 0) return '';

    // ALTO: >=1 alto, >=4 medio, >=5 bajo, >=5 combinados medio+bajo
    if (alto >= 1) return 'ALTO';
    if (medio >= 4) return 'ALTO';
    if (bajo >= 5) return 'ALTO';
    if (combinado >= 5) return 'ALTO';

    // MEDIO: hasta 3 medio, 3-4 bajo, hasta 4 combinados medio+bajo
    if (medio >= 1) return 'MEDIO';
    if (bajo >= 3) return 'MEDIO';

    // BAJO: hasta 2 bajo
    if (bajo >= 1) return 'BAJO';

    return '';
  }

  onTareaChange(tarea: TareaCriticaItem) {
    if (!tarea.seleccionada) {
      tarea.riesgo = '';
      tarea.factoresAlto.forEach((f) => (f.seleccionada = false));
      tarea.factoresMedio.forEach((f) => (f.seleccionada = false));
      tarea.factoresBajo.forEach((f) => (f.seleccionada = false));
    }
  }

  guardar() {
    if (!this.descripcion || !this.usuarioSolicitante || !this.fechaSolicitud) return;

    const tareasCriticas = this.tareasCriticas
      .filter((t) => t.seleccionada)
      .map((t) => ({ tarea: t.nombre, riesgo: t.riesgo }));

    const factoresAlerta: { factor: string; nivel: string }[] = [];
    for (const t of this.tareasCriticas) {
      for (const f of t.factoresAlto.filter((f) => f.seleccionada)) {
        factoresAlerta.push({ factor: f.nombre, nivel: 'ALTO' });
      }
      for (const f of t.factoresMedio.filter((f) => f.seleccionada)) {
        factoresAlerta.push({ factor: f.nombre, nivel: 'MEDIO' });
      }
      for (const f of t.factoresBajo.filter((f) => f.seleccionada)) {
        factoresAlerta.push({ factor: f.nombre, nivel: 'BAJO' });
      }
    }

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
