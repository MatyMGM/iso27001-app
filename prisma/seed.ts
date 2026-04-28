import { PrismaClient, Criticality } from '@prisma/client';

const prisma = new PrismaClient();

type ControlSeed = {
  controlRef: string;
  controlName: string;
  domain: string;
  criticality: Criticality;
  questionText: string;
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

async function main() {
  if (controls.length !== 93) {
    throw new Error(
      `Se esperaban 93 controles del Anexo A de ISO 27001:2022, se encontraron ${controls.length}`,
    );
  }

  for (const c of controls) {
    await prisma.question.upsert({
      where: { controlRef: c.controlRef },
      update: {
        controlName: c.controlName,
        domain: c.domain,
        criticality: c.criticality,
        questionText: c.questionText,
      },
      create: c,
    });
  }

  console.log(`Seed completado: ${controls.length} controles cargados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
