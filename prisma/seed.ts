import { PrismaClient, Criticality } from '@prisma/client';

const prisma = new PrismaClient();

type ControlSeed = {
  controlRef: string;
  controlName: string;
  domain: string;
  criticality: Criticality;
  questionText: string;
  framework?: string;
};

const ORGANIZATIONAL = 'Controles organizacionales';
const PEOPLE = 'Controles de personas';
const PHYSICAL = 'Controles físicos';
const TECHNOLOGICAL = 'Controles tecnológicos';

const controls: ControlSeed[] = [
  // A.5 — Controles organizacionales (37)
  {
    controlRef: 'A.5.1',
    controlName: 'Políticas de seguridad de la información',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La organización cuenta con una política de seguridad de la información aprobada por la dirección, comunicada a los colaboradores y revisada periódicamente?',
  },
  {
    controlRef: 'A.5.2',
    controlName: 'Roles y responsabilidades de seguridad de la información',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se han definido y asignado formalmente los roles y responsabilidades de seguridad de la información dentro de la organización?',
  },
  {
    controlRef: 'A.5.3',
    controlName: 'Segregación de funciones',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se aplican mecanismos de segregación de funciones para evitar conflictos de interés y reducir el riesgo de fraude o errores?',
  },
  {
    controlRef: 'A.5.4',
    controlName: 'Responsabilidades de la dirección',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿La dirección exige a todo el personal aplicar las políticas y procedimientos de seguridad de la información establecidos?',
  },
  {
    controlRef: 'A.5.5',
    controlName: 'Contacto con autoridades',
    domain: ORGANIZATIONAL,
    criticality: 'baja',
    questionText:
      '¿La organización mantiene contactos apropiados con autoridades relevantes (por ejemplo, autoridades regulatorias o de aplicación de la ley)?',
  },
  {
    controlRef: 'A.5.6',
    controlName: 'Contacto con grupos de interés especial',
    domain: ORGANIZATIONAL,
    criticality: 'baja',
    questionText:
      '¿Se mantienen contactos con grupos de interés, foros o asociaciones profesionales especializadas en seguridad de la información?',
  },
  {
    controlRef: 'A.5.7',
    controlName: 'Inteligencia de amenazas',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se recopila y analiza información sobre amenazas a la seguridad de la información para producir inteligencia accionable?',
  },
  {
    controlRef: 'A.5.8',
    controlName: 'Seguridad de la información en la gestión de proyectos',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿La seguridad de la información se integra en la gestión de proyectos, considerándose en todas sus fases?',
  },
  {
    controlRef: 'A.5.9',
    controlName: 'Inventario de información y activos asociados',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se mantiene un inventario actualizado de la información y otros activos asociados, con sus respectivos propietarios?',
  },
  {
    controlRef: 'A.5.10',
    controlName: 'Uso aceptable de la información y activos asociados',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se han definido, documentado e implementado reglas para el uso aceptable de la información y los activos asociados?',
  },
  {
    controlRef: 'A.5.11',
    controlName: 'Devolución de activos',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿El personal y partes externas devuelven todos los activos de la organización al finalizar su contrato, acuerdo o vínculo?',
  },
  {
    controlRef: 'A.5.12',
    controlName: 'Clasificación de la información',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La información se clasifica según su valor, sensibilidad, criticidad y requisitos legales?',
  },
  {
    controlRef: 'A.5.13',
    controlName: 'Etiquetado de la información',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se aplica un esquema de etiquetado de la información acorde al esquema de clasificación adoptado por la organización?',
  },
  {
    controlRef: 'A.5.14',
    controlName: 'Transferencia de información',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Existen reglas, procedimientos y acuerdos para la transferencia segura de información dentro y fuera de la organización?',
  },
  {
    controlRef: 'A.5.15',
    controlName: 'Control de acceso',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se han establecido e implementado reglas de control de acceso a la información y activos asociados con base en requisitos de negocio y de seguridad?',
  },
  {
    controlRef: 'A.5.16',
    controlName: 'Gestión de identidad',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se gestiona el ciclo de vida completo de las identidades digitales (alta, modificación, baja) de usuarios y entidades?',
  },
  {
    controlRef: 'A.5.17',
    controlName: 'Información de autenticación',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La asignación y gestión de la información de autenticación (contraseñas, tokens, claves) se realiza mediante un proceso controlado?',
  },
  {
    controlRef: 'A.5.18',
    controlName: 'Derechos de acceso',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Los derechos de acceso se otorgan, revisan, modifican y revocan según la política de control de acceso?',
  },
  {
    controlRef: 'A.5.19',
    controlName: 'Seguridad de la información en relaciones con proveedores',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se gestionan los riesgos de seguridad de la información asociados al uso de productos o servicios de proveedores?',
  },
  {
    controlRef: 'A.5.20',
    controlName: 'Seguridad en acuerdos con proveedores',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se establecen y acuerdan requisitos de seguridad de la información con cada proveedor según el tipo de relación?',
  },
  {
    controlRef: 'A.5.21',
    controlName: 'Gestión de la seguridad en la cadena de suministro de TIC',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se gestionan los riesgos de seguridad asociados a la cadena de suministro de productos y servicios de TIC?',
  },
  {
    controlRef: 'A.5.22',
    controlName: 'Monitoreo, revisión y gestión de cambios en servicios de proveedores',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se monitorean y revisan periódicamente los servicios prestados por proveedores y se gestionan los cambios sobre los mismos?',
  },
  {
    controlRef: 'A.5.23',
    controlName: 'Seguridad de la información para uso de servicios en la nube',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La adquisición, uso, gestión y salida de servicios en la nube se realizan conforme a los requisitos de seguridad de la organización?',
  },
  {
    controlRef: 'A.5.24',
    controlName: 'Planificación y preparación de la gestión de incidentes',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La organización planifica y se prepara para gestionar incidentes de seguridad de la información, definiendo roles, procesos y procedimientos?',
  },
  {
    controlRef: 'A.5.25',
    controlName: 'Evaluación y decisión sobre eventos de seguridad',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Los eventos de seguridad de la información se evalúan y se decide si deben categorizarse como incidentes?',
  },
  {
    controlRef: 'A.5.26',
    controlName: 'Respuesta a incidentes de seguridad de la información',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Existe un procedimiento documentado de respuesta a incidentes y se aplica conforme a los planes establecidos?',
  },
  {
    controlRef: 'A.5.27',
    controlName: 'Aprendizaje a partir de incidentes',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿El conocimiento obtenido de incidentes se utiliza para fortalecer y mejorar los controles de seguridad de la información?',
  },
  {
    controlRef: 'A.5.28',
    controlName: 'Recolección de evidencia',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se cuenta con procedimientos para identificar, recolectar, adquirir y preservar evidencia relacionada con eventos de seguridad?',
  },
  {
    controlRef: 'A.5.29',
    controlName: 'Seguridad de la información durante disrupciones',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se planifica el mantenimiento de la seguridad de la información en niveles adecuados durante disrupciones del negocio?',
  },
  {
    controlRef: 'A.5.30',
    controlName: 'Preparación de TIC para la continuidad del negocio',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La preparación de las TIC para la continuidad del negocio se planifica, implementa, mantiene y prueba con base en objetivos de continuidad?',
  },
  {
    controlRef: 'A.5.31',
    controlName: 'Requisitos legales, estatutarios, regulatorios y contractuales',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿Se identifican, documentan y mantienen actualizados los requisitos legales, regulatorios y contractuales aplicables a la seguridad de la información?',
  },
  {
    controlRef: 'A.5.32',
    controlName: 'Derechos de propiedad intelectual',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se implementan procedimientos para proteger los derechos de propiedad intelectual propios y de terceros?',
  },
  {
    controlRef: 'A.5.33',
    controlName: 'Protección de registros',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Los registros se protegen contra pérdida, destrucción, falsificación, acceso no autorizado y divulgación indebida?',
  },
  {
    controlRef: 'A.5.34',
    controlName: 'Privacidad y protección de datos personales (PII)',
    domain: ORGANIZATIONAL,
    criticality: 'alta',
    questionText:
      '¿La organización identifica y cumple los requisitos de privacidad y protección de datos personales (PII) aplicables?',
  },
  {
    controlRef: 'A.5.35',
    controlName: 'Revisión independiente de la seguridad de la información',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se realiza una revisión independiente de la gestión de seguridad de la información a intervalos planificados o tras cambios significativos?',
  },
  {
    controlRef: 'A.5.36',
    controlName: 'Cumplimiento de políticas y normas de seguridad',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Se revisa de forma periódica el cumplimiento de las políticas, reglas y normas de seguridad de la información?',
  },
  {
    controlRef: 'A.5.37',
    controlName: 'Procedimientos operativos documentados',
    domain: ORGANIZATIONAL,
    criticality: 'media',
    questionText:
      '¿Los procedimientos operativos de las instalaciones de procesamiento de información se documentan y se ponen a disposición del personal que los necesita?',
  },

  // A.6 — Controles de personas (8)
  {
    controlRef: 'A.6.1',
    controlName: 'Verificación de antecedentes',
    domain: PEOPLE,
    criticality: 'media',
    questionText:
      '¿Se verifican los antecedentes de los candidatos a contratación de manera proporcional al rol, los riesgos y los requisitos legales?',
  },
  {
    controlRef: 'A.6.2',
    controlName: 'Términos y condiciones de empleo',
    domain: PEOPLE,
    criticality: 'media',
    questionText:
      '¿Los acuerdos contractuales con el personal incluyen sus responsabilidades en materia de seguridad de la información?',
  },
  {
    controlRef: 'A.6.3',
    controlName: 'Concientización, educación y capacitación',
    domain: PEOPLE,
    criticality: 'alta',
    questionText:
      '¿El personal y las partes interesadas reciben capacitación y concientización adecuada en seguridad de la información?',
  },
  {
    controlRef: 'A.6.4',
    controlName: 'Proceso disciplinario',
    domain: PEOPLE,
    criticality: 'media',
    questionText:
      '¿Existe un proceso disciplinario formal y comunicado para tomar acciones contra el personal que incumpla la política de seguridad?',
  },
  {
    controlRef: 'A.6.5',
    controlName: 'Responsabilidades tras el cese o cambio de empleo',
    domain: PEOPLE,
    criticality: 'media',
    questionText:
      '¿Las responsabilidades de seguridad de la información que permanecen vigentes tras el cese o cambio de empleo se definen, comunican y aplican?',
  },
  {
    controlRef: 'A.6.6',
    controlName: 'Acuerdos de confidencialidad o no divulgación',
    domain: PEOPLE,
    criticality: 'alta',
    questionText:
      '¿El personal y partes externas firman acuerdos de confidencialidad o no divulgación que reflejan las necesidades de protección de la información?',
  },
  {
    controlRef: 'A.6.7',
    controlName: 'Trabajo remoto',
    domain: PEOPLE,
    criticality: 'alta',
    questionText:
      '¿Se han implementado medidas de seguridad para proteger la información cuando el personal trabaja de forma remota?',
  },
  {
    controlRef: 'A.6.8',
    controlName: 'Reporte de eventos de seguridad de la información',
    domain: PEOPLE,
    criticality: 'alta',
    questionText:
      '¿Existe un mecanismo claro y oportuno para que el personal reporte eventos de seguridad de la información observados o sospechados?',
  },

  // A.7 — Controles físicos (14)
  {
    controlRef: 'A.7.1',
    controlName: 'Perímetros de seguridad física',
    domain: PHYSICAL,
    criticality: 'alta',
    questionText:
      '¿Se han definido y utilizan perímetros de seguridad física para proteger las áreas que contienen información y activos asociados?',
  },
  {
    controlRef: 'A.7.2',
    controlName: 'Ingreso físico',
    domain: PHYSICAL,
    criticality: 'alta',
    questionText:
      '¿Las áreas seguras están protegidas mediante controles de ingreso adecuados que aseguran el acceso únicamente al personal autorizado?',
  },
  {
    controlRef: 'A.7.3',
    controlName: 'Seguridad de oficinas, salas e instalaciones',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Se diseña y aplica seguridad física para oficinas, salas e instalaciones que contienen información sensible?',
  },
  {
    controlRef: 'A.7.4',
    controlName: 'Monitoreo de seguridad física',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Las instalaciones se monitorean continuamente para detectar accesos físicos no autorizados?',
  },
  {
    controlRef: 'A.7.5',
    controlName: 'Protección contra amenazas físicas y ambientales',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Se ha diseñado e implementado protección contra amenazas físicas y ambientales (incendios, inundaciones, sismos, etc.)?',
  },
  {
    controlRef: 'A.7.6',
    controlName: 'Trabajo en áreas seguras',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Se han definido y aplican medidas de seguridad para el trabajo dentro de áreas seguras?',
  },
  {
    controlRef: 'A.7.7',
    controlName: 'Escritorio limpio y pantalla limpia',
    domain: PHYSICAL,
    criticality: 'baja',
    questionText:
      '¿Se aplican reglas de escritorio limpio y pantalla limpia para proteger información sensible expuesta?',
  },
  {
    controlRef: 'A.7.8',
    controlName: 'Ubicación y protección de equipos',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Los equipos están ubicados y protegidos de forma segura considerando riesgos físicos y ambientales?',
  },
  {
    controlRef: 'A.7.9',
    controlName: 'Seguridad de activos fuera de las instalaciones',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Se protegen los activos que se utilizan fuera de las instalaciones de la organización?',
  },
  {
    controlRef: 'A.7.10',
    controlName: 'Medios de almacenamiento',
    domain: PHYSICAL,
    criticality: 'alta',
    questionText:
      '¿Los medios de almacenamiento se gestionan a lo largo de su ciclo de vida (adquisición, uso, transporte y disposición) según el esquema de clasificación?',
  },
  {
    controlRef: 'A.7.11',
    controlName: 'Servicios de soporte (utilities)',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Las instalaciones de procesamiento se protegen ante fallas en los servicios de soporte (energía, telecomunicaciones, refrigeración, etc.)?',
  },
  {
    controlRef: 'A.7.12',
    controlName: 'Seguridad del cableado',
    domain: PHYSICAL,
    criticality: 'baja',
    questionText:
      '¿El cableado eléctrico y de telecomunicaciones se protege contra interferencias, intercepciones y daños?',
  },
  {
    controlRef: 'A.7.13',
    controlName: 'Mantenimiento de equipos',
    domain: PHYSICAL,
    criticality: 'media',
    questionText:
      '¿Los equipos reciben mantenimiento adecuado para asegurar su disponibilidad, integridad y confidencialidad de la información que procesan?',
  },
  {
    controlRef: 'A.7.14',
    controlName: 'Disposición o reutilización segura de equipos',
    domain: PHYSICAL,
    criticality: 'alta',
    questionText:
      '¿Los equipos que contienen medios de almacenamiento se verifican para asegurar que la información sensible se elimine antes de su disposición o reutilización?',
  },

  // A.8 — Controles tecnológicos (34)
  {
    controlRef: 'A.8.1',
    controlName: 'Dispositivos de usuario final',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿La información almacenada, procesada o accesible desde dispositivos de usuario final se protege adecuadamente?',
  },
  {
    controlRef: 'A.8.2',
    controlName: 'Derechos de acceso privilegiado',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿La asignación y uso de derechos de acceso privilegiado se restringen y gestionan estrictamente?',
  },
  {
    controlRef: 'A.8.3',
    controlName: 'Restricción de acceso a la información',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿El acceso a la información y a otros activos asociados se restringe conforme a la política de control de acceso establecida?',
  },
  {
    controlRef: 'A.8.4',
    controlName: 'Acceso al código fuente',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se controla y restringe adecuadamente el acceso al código fuente, herramientas de desarrollo y librerías?',
  },
  {
    controlRef: 'A.8.5',
    controlName: 'Autenticación segura',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se implementan mecanismos de autenticación segura conforme a la sensibilidad de los sistemas y de la información a la que se accede?',
  },
  {
    controlRef: 'A.8.6',
    controlName: 'Gestión de capacidad',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se monitorea y ajusta la capacidad de los recursos para satisfacer los requisitos actuales y proyectados?',
  },
  {
    controlRef: 'A.8.7',
    controlName: 'Protección contra malware',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se han implementado y mantienen actualizadas medidas de protección contra malware, complementadas con concientización al personal?',
  },
  {
    controlRef: 'A.8.8',
    controlName: 'Gestión de vulnerabilidades técnicas',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se obtiene información sobre vulnerabilidades técnicas, se evalúa la exposición y se toman medidas adecuadas?',
  },
  {
    controlRef: 'A.8.9',
    controlName: 'Gestión de configuración',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Las configuraciones de hardware, software, servicios y redes se establecen, documentan, monitorean y revisan?',
  },
  {
    controlRef: 'A.8.10',
    controlName: 'Eliminación de información',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿La información almacenada en sistemas, dispositivos o medios se elimina de forma segura cuando ya no se necesita?',
  },
  {
    controlRef: 'A.8.11',
    controlName: 'Enmascaramiento de datos',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se utiliza enmascaramiento de datos conforme a la política de control de acceso, los requisitos de negocio y la legislación aplicable?',
  },
  {
    controlRef: 'A.8.12',
    controlName: 'Prevención de fuga de datos (DLP)',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se aplican medidas de prevención de fuga de datos a sistemas, redes y dispositivos que procesan información sensible?',
  },
  {
    controlRef: 'A.8.13',
    controlName: 'Respaldos de información',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se realizan, mantienen y prueban respaldos de información, software y sistemas conforme a la política de respaldo definida?',
  },
  {
    controlRef: 'A.8.14',
    controlName: 'Redundancia de instalaciones de procesamiento',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Las instalaciones de procesamiento de información se implementan con redundancia suficiente para cumplir requisitos de disponibilidad?',
  },
  {
    controlRef: 'A.8.15',
    controlName: 'Registro de eventos (logging)',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se generan, almacenan, protegen y analizan registros (logs) de actividades, excepciones, fallas y otros eventos relevantes?',
  },
  {
    controlRef: 'A.8.16',
    controlName: 'Actividades de monitoreo',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se monitorean redes, sistemas y aplicaciones para detectar comportamientos anómalos y posibles incidentes de seguridad?',
  },
  {
    controlRef: 'A.8.17',
    controlName: 'Sincronización de relojes',
    domain: TECHNOLOGICAL,
    criticality: 'baja',
    questionText:
      '¿Los relojes de los sistemas de información se sincronizan con una fuente de tiempo confiable y aprobada?',
  },
  {
    controlRef: 'A.8.18',
    controlName: 'Uso de programas utilitarios privilegiados',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿El uso de programas utilitarios capaces de superar controles del sistema o aplicaciones está restringido y se controla estrictamente?',
  },
  {
    controlRef: 'A.8.19',
    controlName: 'Instalación de software en sistemas operativos',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se aplican procedimientos y medidas para gestionar de forma segura la instalación de software en sistemas operativos?',
  },
  {
    controlRef: 'A.8.20',
    controlName: 'Seguridad de redes',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Las redes y dispositivos de red se aseguran, gestionan y controlan para proteger la información en sistemas y aplicaciones?',
  },
  {
    controlRef: 'A.8.21',
    controlName: 'Seguridad de servicios de red',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se identifican, implementan y monitorean los mecanismos de seguridad y los niveles de servicio de los servicios de red?',
  },
  {
    controlRef: 'A.8.22',
    controlName: 'Segregación de redes',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Las redes están segmentadas y los grupos de servicios, usuarios y sistemas se encuentran separados según riesgos?',
  },
  {
    controlRef: 'A.8.23',
    controlName: 'Filtrado web',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se gestiona el acceso a sitios web externos para reducir la exposición a contenido malicioso?',
  },
  {
    controlRef: 'A.8.24',
    controlName: 'Uso de criptografía',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se han definido e implementado reglas para el uso eficaz de la criptografía, incluida la gestión de claves?',
  },
  {
    controlRef: 'A.8.25',
    controlName: 'Ciclo de vida de desarrollo seguro',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se han establecido y aplican reglas para el desarrollo seguro de software y sistemas?',
  },
  {
    controlRef: 'A.8.26',
    controlName: 'Requisitos de seguridad de aplicaciones',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Los requisitos de seguridad de la información se identifican, especifican y aprueban al desarrollar o adquirir aplicaciones?',
  },
  {
    controlRef: 'A.8.27',
    controlName: 'Principios de arquitectura e ingeniería seguras',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Se aplican principios de arquitectura e ingeniería de sistemas seguros al diseño, desarrollo y mantenimiento de los sistemas?',
  },
  {
    controlRef: 'A.8.28',
    controlName: 'Codificación segura',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se aplican principios de codificación segura en el desarrollo de software?',
  },
  {
    controlRef: 'A.8.29',
    controlName: 'Pruebas de seguridad en desarrollo y aceptación',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Se definen e implementan procesos de pruebas de seguridad durante el ciclo de vida del desarrollo?',
  },
  {
    controlRef: 'A.8.30',
    controlName: 'Desarrollo tercerizado',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿La organización dirige, monitorea y revisa las actividades del desarrollo de sistemas que se realizan de forma tercerizada?',
  },
  {
    controlRef: 'A.8.31',
    controlName: 'Separación de ambientes de desarrollo, prueba y producción',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Los ambientes de desarrollo, prueba y producción se encuentran separados y protegidos?',
  },
  {
    controlRef: 'A.8.32',
    controlName: 'Gestión de cambios',
    domain: TECHNOLOGICAL,
    criticality: 'alta',
    questionText:
      '¿Los cambios en instalaciones de procesamiento y sistemas de información se gestionan mediante procedimientos formales de gestión de cambios?',
  },
  {
    controlRef: 'A.8.33',
    controlName: 'Información de prueba',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿La información utilizada para pruebas se selecciona, protege y gestiona adecuadamente?',
  },
  {
    controlRef: 'A.8.34',
    controlName: 'Protección de sistemas durante auditorías',
    domain: TECHNOLOGICAL,
    criticality: 'media',
    questionText:
      '¿Las pruebas de auditoría sobre sistemas operativos se planifican y acuerdan para minimizar disrupciones en los procesos de negocio?',
  },
];

// ─── SOC 2 Trust Service Criteria ────────────────────────────────────────────

const CC = 'Criterios Comunes';
const AVAIL = 'Disponibilidad';
const CONF = 'Confidencialidad';
const PI = 'Integridad de Procesamiento';
const PRIV = 'Privacidad';

const soc2Controls: ControlSeed[] = [
  // CC1 - Control Environment
  { controlRef: 'CC1.1', controlName: 'Integridad y valores éticos', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización demuestra compromiso con la integridad y los valores éticos a través de sus estándares de conducta y el modelaje de comportamiento de la dirección?' },
  { controlRef: 'CC1.2', controlName: 'Supervisión del consejo directivo', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿El consejo directivo o equivalente ejerce supervisión independiente sobre el desarrollo y desempeño del control interno del sistema?' },
  { controlRef: 'CC1.3', controlName: 'Estructura organizacional y responsabilidades', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La dirección establece estructuras, líneas de reporte y niveles de autoridad apropiados para alcanzar los objetivos del sistema?' },
  { controlRef: 'CC1.4', controlName: 'Competencia y compromiso con el talento', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización demuestra compromiso para atraer, desarrollar y retener personas competentes alineadas con los objetivos del sistema?' },
  { controlRef: 'CC1.5', controlName: 'Rendición de cuentas por el control interno', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿Se establecen mecanismos de rendición de cuentas que responsabilizan a los individuos por sus obligaciones de control interno?' },
  // CC2 - Communication and Information
  { controlRef: 'CC2.1', controlName: 'Información de calidad para el control interno', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización obtiene o genera y utiliza información relevante y de calidad para apoyar el funcionamiento del control interno?' },
  { controlRef: 'CC2.2', controlName: 'Comunicación interna de información', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización comunica internamente información relevante, incluidos los objetivos y responsabilidades del control interno?' },
  { controlRef: 'CC2.3', controlName: 'Comunicación externa', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La organización se comunica con las partes externas sobre temas que afectan el funcionamiento del control interno del sistema?' },
  // CC3 - Risk Assessment
  { controlRef: 'CC3.1', controlName: 'Especificación de objetivos', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización especifica objetivos con suficiente claridad para permitir la identificación y evaluación de riesgos para su logro?' },
  { controlRef: 'CC3.2', controlName: 'Identificación y análisis de riesgos', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización identifica los riesgos para el logro de sus objetivos y los analiza como base para determinar cómo deben gestionarse?' },
  { controlRef: 'CC3.3', controlName: 'Evaluación del riesgo de fraude', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización considera la posibilidad de fraude en la evaluación de los riesgos para el logro de sus objetivos?' },
  { controlRef: 'CC3.4', controlName: 'Identificación de cambios significativos', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La organización identifica y evalúa los cambios que podrían impactar significativamente el sistema de control interno?' },
  // CC4 - Monitoring
  { controlRef: 'CC4.1', controlName: 'Evaluaciones continuas y separadas', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La organización selecciona, desarrolla y realiza evaluaciones continuas o separadas para determinar si los componentes del control interno están presentes y funcionando?' },
  { controlRef: 'CC4.2', controlName: 'Evaluación y comunicación de deficiencias', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La organización evalúa y comunica las deficiencias del control interno de manera oportuna a las partes responsables de tomar acciones correctivas?' },
  // CC5 - Control Activities
  { controlRef: 'CC5.1', controlName: 'Actividades de control para mitigar riesgos', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización selecciona y desarrolla actividades de control que contribuyen a la mitigación de riesgos para el logro de objetivos a niveles aceptables?' },
  { controlRef: 'CC5.2', controlName: 'Controles generales sobre tecnología', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización selecciona y desarrolla actividades de control generales sobre la tecnología para apoyar el logro de los objetivos del sistema?' },
  { controlRef: 'CC5.3', controlName: 'Políticas y procedimientos de control', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La organización implementa las actividades de control a través de políticas y procedimientos que establezcan lo que se espera y cómo ejecutarlo?' },
  // CC6 - Logical and Physical Access
  { controlRef: 'CC6.1', controlName: 'Controles de acceso lógico', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad implementa controles de acceso lógico para proteger los componentes del sistema contra amenazas de fuentes externas e internas?' },
  { controlRef: 'CC6.2', controlName: 'Registro y autorización de acceso', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿El acceso a los componentes del sistema se registra, autoriza, modifica o elimina de manera oportuna con base en la autorización?' },
  { controlRef: 'CC6.3', controlName: 'Eliminación de acceso al cambiar roles', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad elimina el acceso a los componentes del sistema cuando el personal cambia de roles o termina su relación con la organización?' },
  { controlRef: 'CC6.4', controlName: 'Control de acceso físico', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad restringe el acceso físico a las instalaciones y recursos del sistema de información a personas autorizadas?' },
  { controlRef: 'CC6.5', controlName: 'Protección contra amenazas externas', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad implementa controles para proteger el sistema contra amenazas ambientales externas (incendios, inundaciones, interferencias)?' },
  { controlRef: 'CC6.6', controlName: 'Autenticación antes del acceso', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad requiere autenticación antes de permitir el acceso a los componentes del sistema, incluyendo MFA donde sea apropiado?' },
  { controlRef: 'CC6.7', controlName: 'Transmisión y eliminación de datos', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad gestiona la transmisión, movimiento y eliminación de información para alcanzar los objetivos de seguridad del servicio?' },
  { controlRef: 'CC6.8', controlName: 'Detección de software malicioso', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad implementa controles para prevenir o detectar y actuar ante software no autorizado o malicioso?' },
  // CC7 - System Operations
  { controlRef: 'CC7.1', controlName: 'Detección de vulnerabilidades y amenazas', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad utiliza herramientas de detección para identificar configuraciones inseguras, vulnerabilidades y actividad maliciosa en tiempo oportuno?' },
  { controlRef: 'CC7.2', controlName: 'Monitoreo del sistema', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad monitorea los componentes del sistema y opera controles para detectar y actuar ante posibles o reales amenazas de seguridad?' },
  { controlRef: 'CC7.3', controlName: 'Evaluación de eventos de seguridad', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad evalúa los eventos de seguridad para determinar si constituyen incidentes de seguridad y los prioriza según su impacto?' },
  { controlRef: 'CC7.4', controlName: 'Respuesta a incidentes', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad responde a los incidentes de seguridad identificados según procedimientos de respuesta a incidentes documentados y probados?' },
  { controlRef: 'CC7.5', controlName: 'Recuperación de incidentes', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad identifica, desarrolla y ejecuta actividades de recuperación para restablecer el sistema ante incidentes de seguridad?' },
  // CC8 - Change Management
  { controlRef: 'CC8.1', controlName: 'Gestión de cambios en infraestructura y software', domain: CC, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad autoriza, diseña, desarrolla, configura, documenta, prueba, aprueba e implementa los cambios a la infraestructura, datos, software y procedimientos?' },
  // CC9 - Risk Mitigation
  { controlRef: 'CC9.1', controlName: 'Actividades de mitigación de riesgos', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad identifica, selecciona y desarrolla actividades de mitigación de riesgos derivadas de las evaluaciones de riesgo de negocio?' },
  { controlRef: 'CC9.2', controlName: 'Evaluación de proveedores y socios', domain: CC, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad evalúa y monitorea a los proveedores y socios de negocios que podrían afectar la capacidad de alcanzar los objetivos del sistema?' },
  // A1 - Availability
  { controlRef: 'A1.1', controlName: 'Capacidad y rendimiento del sistema', domain: AVAIL, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad mantiene, monitorea y evalúa la capacidad de procesamiento e infraestructura actuales y proyectados para alcanzar los objetivos de disponibilidad?' },
  { controlRef: 'A1.2', controlName: 'Monitoreo y alertas de disponibilidad', domain: AVAIL, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad autoriza, implementa y opera infraestructura de detección de amenazas, monitoreo y alertas para los objetivos de disponibilidad del sistema?' },
  { controlRef: 'A1.3', controlName: 'Recuperación y continuidad del negocio', domain: AVAIL, criticality: 'alta', framework: 'soc2',
    questionText: '¿La entidad cuenta con procedimientos de respaldo, recuperación y continuidad del negocio documentados y probados para garantizar la disponibilidad?' },
  // C1 - Confidentiality
  { controlRef: 'C1.1', controlName: 'Identificación de información confidencial', domain: CONF, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad identifica y mantiene la información designada como confidencial para alcanzar los objetivos de confidencialidad del sistema?' },
  { controlRef: 'C1.2', controlName: 'Eliminación de información confidencial', domain: CONF, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad elimina la información confidencial cuando ya no es necesaria para cumplir los objetivos del sistema?' },
  // PI1 - Processing Integrity
  { controlRef: 'PI1.1', controlName: 'Entradas completas y precisas', domain: PI, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad obtiene o genera y utiliza información relevante y de calidad para soportar el funcionamiento del control de integridad del procesamiento?' },
  { controlRef: 'PI1.2', controlName: 'Salidas completas y precisas', domain: PI, criticality: 'media', framework: 'soc2',
    questionText: '¿El sistema produce salidas completas, precisas y oportunas para alcanzar los objetivos de servicio?' },
  { controlRef: 'PI1.3', controlName: 'Controles de procesamiento del sistema', domain: PI, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad implementa controles sobre el procesamiento del sistema para alcanzar los objetivos de integridad del procesamiento?' },
  { controlRef: 'PI1.4', controlName: 'Almacenamiento y distribución de salidas', domain: PI, criticality: 'media', framework: 'soc2',
    questionText: '¿Las salidas se almacenan o distribuyen de manera completa, precisa y oportuna a los destinatores autorizados?' },
  { controlRef: 'PI1.5', controlName: 'Evaluación del procesamiento completo', domain: PI, criticality: 'media', framework: 'soc2',
    questionText: '¿La entidad realiza actividades para evaluar que el procesamiento del sistema sea completo, preciso y autorizado?' },
  // P1-P8 - Privacy
  { controlRef: 'P1.1', controlName: 'Aviso de prácticas de privacidad', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad proporciona aviso claro a los individuos sobre sus políticas de recopilación, uso, retención y divulgación de información personal?' },
  { controlRef: 'P2.1', controlName: 'Elección y consentimiento', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad comunica opciones de elección a los individuos respecto al uso de su información personal, incluyendo el consentimiento explícito donde aplique?' },
  { controlRef: 'P3.1', controlName: 'Recopilación compatible con el propósito', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad recopila información personal únicamente para los propósitos identificados en el aviso de privacidad o cuando está autorizado legalmente?' },
  { controlRef: 'P3.2', controlName: 'Información explícita del sujeto', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad obtiene confirmación explícita del individuo cuando recopila información personal adicional a la indicada en el aviso?' },
  { controlRef: 'P4.1', controlName: 'Límites de uso de información personal', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad limita el uso de la información personal a los propósitos identificados en el aviso de privacidad y los acordados con el individuo?' },
  { controlRef: 'P4.2', controlName: 'Retención de información personal', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad retiene la información personal de acuerdo con las políticas establecidas durante el período necesario para cumplir los propósitos identificados?' },
  { controlRef: 'P4.3', controlName: 'Eliminación de información personal', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad elimina la información personal de acuerdo con sus políticas cuando ya no es necesaria para los propósitos identificados?' },
  { controlRef: 'P5.1', controlName: 'Acceso de individuos a su información', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad proporciona a los individuos la capacidad de acceder a su información personal para revisión y actualización dentro de un plazo razonable?' },
  { controlRef: 'P6.1', controlName: 'Divulgación autorizada a terceros', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad divulga información personal a terceros únicamente para los propósitos identificados en el aviso de privacidad o cuando está autorizado?' },
  { controlRef: 'P6.2', controlName: 'Registros de divulgación a terceros', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad crea y mantiene registros de las divulgaciones de información personal a terceros, incluyendo el propósito, el destinatario y la fecha?' },
  { controlRef: 'P7.1', controlName: 'Exactitud e integridad de información personal', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad mantiene la exactitud, integridad y relevancia de la información personal para los propósitos identificados?' },
  { controlRef: 'P8.1', controlName: 'Monitoreo y cumplimiento de privacidad', domain: PRIV, criticality: 'baja', framework: 'soc2',
    questionText: '¿La entidad implementa un proceso para recibir, abordar y resolver quejas sobre sus prácticas de privacidad y notificar a los individuos sobre el resultado?' },
];

// ─── CIS Controls v8 ─────────────────────────────────────────────────────────

const IG1 = 'IG1';
const IG2 = 'IG2';
const IG3 = 'IG3';

const cisControls: ControlSeed[] = [
  // IG1 — Higiene básica (alta criticidad, aplica a toda organización)
  { controlRef: 'CIS-1.1', controlName: 'Inventario de activos de hardware', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un inventario actualizado de todos los activos tecnológicos de hardware (servidores, estaciones, dispositivos móviles, IoT)?' },
  { controlRef: 'CIS-1.2', controlName: 'Gestión de activos no autorizados', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Los activos no autorizados detectados en la red se aislan, rechazan o eliminan dentro de las 24-48 horas de su detección?' },
  { controlRef: 'CIS-2.1', controlName: 'Inventario de software autorizado', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un inventario actualizado de todo el software autorizado en los activos de la organización?' },
  { controlRef: 'CIS-2.2', controlName: 'Software con soporte activo del proveedor', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se garantiza que el software autorizado se encuentra en versiones actualmente soportadas por el proveedor (no end-of-life)?' },
  { controlRef: 'CIS-3.1', controlName: 'Proceso de gestión de datos', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un proceso documentado de gestión del ciclo de vida de los datos sensibles de la organización?' },
  { controlRef: 'CIS-3.3', controlName: 'Listas de control de acceso a datos', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se configuran y mantienen listas de control de acceso (ACL) para los activos que almacenan o procesan datos sensibles?' },
  { controlRef: 'CIS-4.1', controlName: 'Proceso de configuración segura', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un proceso documentado de configuración segura para todos los activos empresariales (servidores, estaciones, red, aplicaciones)?' },
  { controlRef: 'CIS-4.2', controlName: 'Configuración segura de sistemas operativos', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establecen y aplican configuraciones seguras (hardening) para los sistemas operativos de servidores y estaciones de trabajo?' },
  { controlRef: 'CIS-5.1', controlName: 'Inventario de cuentas de usuario', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un inventario de todas las cuentas de usuario, incluyendo cuentas de servicio, administrador y servicio de directorio?' },
  { controlRef: 'CIS-5.2', controlName: 'Contraseñas únicas y seguras', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Todos los usuarios del sistema utilizan contraseñas únicas de alta complejidad (mínimo 14 caracteres) y se prohíben las contraseñas predeterminadas?' },
  { controlRef: 'CIS-5.3', controlName: 'Deshabilitación de cuentas inactivas', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Las cuentas inactivas por más de 45 días se deshabilitan automáticamente y las cuentas de ex-empleados se eliminan en 24 horas?' },
  { controlRef: 'CIS-6.1', controlName: 'Proceso de otorgamiento de acceso', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y documenta un proceso formal para otorgar acceso a los activos empresariales, siguiendo el principio de menor privilegio?' },
  { controlRef: 'CIS-6.2', controlName: 'Proceso de revocación de acceso', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y ejecuta un proceso documentado para revocar el acceso cuando un empleado cambia de rol, es despedido o renuncia?' },
  { controlRef: 'CIS-7.1', controlName: 'Proceso de gestión de vulnerabilidades', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un proceso documentado de gestión de vulnerabilidades que incluya identificación, clasificación, remediación y verificación?' },
  { controlRef: 'CIS-8.1', controlName: 'Registros de auditoría (logging)', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establecen y mantienen registros de auditoría para todos los activos empresariales con funcionalidad de logging, cubriendo eventos de acceso, cambios y errores?' },
  { controlRef: 'CIS-9.1', controlName: 'Navegadores y clientes de correo seguros', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se garantiza que los navegadores y clientes de correo electrónico utilizados sean versiones totalmente soportadas y actualizadas, sin extensiones innecesarias?' },
  { controlRef: 'CIS-10.1', controlName: 'Software anti-malware en endpoints', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se implementa y mantiene software anti-malware actualizado en todos los dispositivos finales de la organización?' },
  { controlRef: 'CIS-11.1', controlName: 'Proceso de recuperación de datos', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un proceso documentado de recuperación de datos para los activos empresariales críticos, con copias de seguridad periódicas y probadas?' },
  { controlRef: 'CIS-12.1', controlName: 'Diagrama de arquitectura de red', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se mantiene y actualiza un diagrama de arquitectura de red documentado que muestre todos los componentes y sus conexiones?' },
  { controlRef: 'CIS-13.1', controlName: 'Filtrado de tráfico de red', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se aplica filtrado de tráfico de red (firewall, listas de bloqueo) para detectar y bloquear comunicaciones hacia/desde direcciones IP y dominios maliciosos conocidos?' },
  { controlRef: 'CIS-14.1', controlName: 'Programa de concientización en seguridad', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un programa de concientización en seguridad para todos los empleados, actualizado al menos anualmente?' },
  { controlRef: 'CIS-15.1', controlName: 'Inventario de proveedores de servicios', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un inventario de todos los proveedores de servicios de terceros que acceden a activos, redes o datos de la organización?' },
  { controlRef: 'CIS-16.1', controlName: 'Proceso de gestión segura de aplicaciones', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un proceso de gestión segura del ciclo de vida de las aplicaciones, incluyendo pruebas de seguridad antes del despliegue?' },
  { controlRef: 'CIS-17.1', controlName: 'Designación de responsable de incidentes', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se designa formalmente un responsable de gestión de incidentes y se establece un proceso documentado para reportar, priorizar y responder a incidentes?' },
  { controlRef: 'CIS-18.1', controlName: 'Programa de pruebas de penetración', domain: IG1, criticality: 'alta', framework: 'cis',
    questionText: '¿Se establece y mantiene un programa de pruebas de penetración para identificar vulnerabilidades en los activos empresariales?' },

  // IG2 — Controles intermedios (media criticidad)
  { controlRef: 'CIS-1.3', controlName: 'Descubrimiento activo de activos', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se utilizan herramientas de descubrimiento activo de activos en la red con ejecuciones al menos semanales para mantener actualizado el inventario?' },
  { controlRef: 'CIS-2.3', controlName: 'Lista de software permitido (allowlist)', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementa una lista de software permitido (allowlist) para controlar qué aplicaciones pueden ejecutarse en los activos empresariales?' },
  { controlRef: 'CIS-3.2', controlName: 'Inventario y clasificación de datos sensibles', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se establece y mantiene un inventario de datos sensibles con su clasificación correspondiente (público, interno, confidencial, secreto)?' },
  { controlRef: 'CIS-3.4', controlName: 'Cifrado de datos en reposo en endpoints', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se aplica cifrado de datos en reposo en los dispositivos de usuario final que almacenan datos sensibles de la organización?' },
  { controlRef: 'CIS-4.3', controlName: 'Gestión automatizada de configuración', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementan y utilizan herramientas automatizadas de gestión de configuración (IaC, Ansible, SCCM) para mantener las configuraciones seguras?' },
  { controlRef: 'CIS-4.5', controlName: 'Gestión de dispositivos móviles (MDM)', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se gestiona la configuración de seguridad de los dispositivos móviles corporativos a través de una solución MDM (Mobile Device Management)?' },
  { controlRef: 'CIS-5.4', controlName: 'Restricción de privilegios administrativos', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Los privilegios administrativos se restringen a cuentas dedicadas usadas exclusivamente para tareas administrativas, prohibiendo el uso de admin para actividad diaria?' },
  { controlRef: 'CIS-6.4', controlName: 'MFA para acceso administrativo y remoto', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se requiere autenticación multifactor (MFA) para todos los accesos administrativos y accesos remotos a los sistemas de la organización?' },
  { controlRef: 'CIS-7.2', controlName: 'Gestión de parches automatizada', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementa un proceso automatizado de gestión de parches para todos los activos, priorizando vulnerabilidades críticas (remediación en ≤30 días)?' },
  { controlRef: 'CIS-7.4', controlName: 'Análisis de vulnerabilidades autenticados', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se ejecutan análisis de vulnerabilidades autenticados al menos trimestralmente en todos los activos de la organización?' },
  { controlRef: 'CIS-8.2', controlName: 'Repositorio centralizado de logs (SIEM)', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se centraliza la recopilación de logs de auditoría en un repositorio o SIEM, con retención de al menos 90 días y alertas configuradas?' },
  { controlRef: 'CIS-9.2', controlName: 'Filtrado DNS para dominios maliciosos', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementan filtros DNS para bloquear automáticamente la resolución de dominios maliciosos conocidos?' },
  { controlRef: 'CIS-10.2', controlName: 'Detección basada en comportamiento', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementan soluciones EDR (Endpoint Detection and Response) con detección basada en comportamiento para identificar actividad maliciosa avanzada?' },
  { controlRef: 'CIS-11.2', controlName: 'Pruebas de recuperación de datos', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se realizan pruebas documentadas de recuperación de datos al menos trimestralmente para verificar la integridad y el proceso de restauración?' },
  { controlRef: 'CIS-12.2', controlName: 'Segmentación de red', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementa segmentación de red para separar los sistemas con diferentes niveles de sensibilidad (DMZ, servidores críticos, usuarios, IoT)?' },
  { controlRef: 'CIS-13.2', controlName: 'Monitoreo de tráfico de red (IDS/IPS)', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementan sistemas de detección/prevención de intrusiones (IDS/IPS) y monitoreo de tráfico de red para detectar comportamientos anómalos?' },
  { controlRef: 'CIS-14.2', controlName: 'Simulaciones de phishing periódicas', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se realizan simulaciones de phishing y pruebas de ingeniería social al menos trimestralmente para evaluar la concientización del personal?' },
  { controlRef: 'CIS-16.2', controlName: 'Revisiones de seguridad en desarrollo (SAST)', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se implementan revisiones de código de seguridad y análisis estático (SAST) como parte del proceso de desarrollo de aplicaciones?' },
  { controlRef: 'CIS-17.2', controlName: 'Playbooks de respuesta a incidentes', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se establecen y mantienen playbooks documentados de respuesta a incidentes para escenarios comunes (ransomware, phishing, fuga de datos, acceso no autorizado)?' },
  { controlRef: 'CIS-18.2', controlName: 'Pruebas de penetración externas anuales', domain: IG2, criticality: 'media', framework: 'cis',
    questionText: '¿Se realizan pruebas de penetración externas conducidas por especialistas independientes al menos una vez al año?' },

  // IG3 — Controles avanzados (baja criticidad)
  { controlRef: 'CIS-3.5', controlName: 'Gestión de derechos de información (IRM)', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementa gestión de derechos de información (IRM/DRM) para controlar el acceso y uso de información altamente sensible fuera de la organización?' },
  { controlRef: 'CIS-5.5', controlName: 'Gestión de acceso privilegiado (PAM)', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementa una solución de gestión de acceso privilegiado (PAM) con sesiones grabadas, acceso just-in-time y auditoría completa de actividades privilegiadas?' },
  { controlRef: 'CIS-6.5', controlName: 'Identidad federada y SSO seguro', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementa gestión de identidad federada y Single Sign-On (SSO) con proveedores de identidad seguros y MFA obligatorio?' },
  { controlRef: 'CIS-7.5', controlName: 'Gestión de vulnerabilidades de día cero', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se gestionan activamente los activos con vulnerabilidades de día cero mediante controles compensatorios y se priorizan dentro de las 24 horas de su divulgación pública?' },
  { controlRef: 'CIS-8.3', controlName: 'Análisis de comportamiento de usuario (UEBA)', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementan herramientas de análisis de comportamiento de usuario y entidades (UEBA) para detectar amenazas internas y actividad anómala?' },
  { controlRef: 'CIS-12.3', controlName: 'Arquitectura de red Zero Trust', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se avanza hacia una arquitectura de red de confianza cero (Zero Trust), verificando continuamente la identidad y el contexto de cada acceso?' },
  { controlRef: 'CIS-13.3', controlName: 'Segmentación dinámica basada en comportamiento', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementan controles de segmentación de red dinámica basados en análisis de comportamiento para aislar automáticamente dispositivos comprometidos?' },
  { controlRef: 'CIS-14.3', controlName: 'Métricas de eficacia del programa de seguridad', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se mide la eficacia del programa de concientización en seguridad mediante métricas de comportamiento y se ajusta el contenido según los resultados?' },
  { controlRef: 'CIS-16.3', controlName: 'Pruebas de seguridad de aplicaciones (DAST)', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se implementan pruebas dinámicas de seguridad de aplicaciones (DAST) y revisiones de composición de software (SCA) para componentes de terceros?' },
  { controlRef: 'CIS-17.3', controlName: 'Ejercicios de simulación (tabletop)', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se realizan ejercicios de simulación de respuesta a incidentes (tabletop exercises) al menos anualmente con la alta dirección y los equipos técnicos?' },
  { controlRef: 'CIS-18.3', controlName: 'Ejercicios de red team', domain: IG3, criticality: 'baja', framework: 'cis',
    questionText: '¿Se realizan ejercicios de red team para simular ataques sofisticados contra la organización y evaluar la capacidad de detección y respuesta?' },
];

async function main() {
  if (controls.length !== 93) {
    throw new Error(
      `Se esperaban 93 controles del Anexo A de ISO 27001:2022, se encontraron ${controls.length}`,
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  for (const c of controls) {
    await (prisma.question.upsert as any)({
      where: { controlRef: c.controlRef },
      update: {
        controlName: c.controlName,
        domain: c.domain,
        criticality: c.criticality,
        questionText: c.questionText,
        framework: 'iso27001',
      },
      create: { ...c, framework: 'iso27001' },
    });
  }

  for (const c of soc2Controls) {
    await (prisma.question.upsert as any)({
      where: { controlRef: c.controlRef },
      update: {
        controlName: c.controlName,
        domain: c.domain,
        criticality: c.criticality,
        questionText: c.questionText,
        framework: 'soc2',
      },
      create: c,
    });
  }

  for (const c of cisControls) {
    await (prisma.question.upsert as any)({
      where: { controlRef: c.controlRef },
      update: {
        controlName: c.controlName,
        domain: c.domain,
        criticality: c.criticality,
        questionText: c.questionText,
        framework: 'cis',
      },
      create: c,
    });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  console.log(
    `Seed completado: ${controls.length} ISO 27001 + ${soc2Controls.length} SOC 2 + ${cisControls.length} CIS Controls v8 preguntas cargadas.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
