# QA Manager – Sistema de Gestión de Aseguramiento de Calidad

## Fase 4 – Prototipo Web TRL 5

**Estudiante:** Diego Andres Gomez Piamba

---

# Descripción del proyecto

En esta fase del proyecto desarrollé **QA Manager**, un prototipo web orientado a la gestión del aseguramiento de calidad de software. El propósito de esta aplicación es demostrar cómo se puede administrar el ciclo básico de pruebas de un proyecto mediante una interfaz web funcional, organizada y fácil de navegar.

Durante el desarrollo implementé un entorno que permite gestionar proyectos, requerimientos, casos de prueba, ejecuciones, defectos e indicadores básicos, simulando el funcionamiento de una herramienta utilizada en los procesos de Quality Assurance (QA).

El prototipo fue construido utilizando **HTML5, CSS3 y JavaScript**, incorporando datos simulados mediante una API local y almacenamiento con **localStorage**, lo que permite conservar la información generada durante la demostración sin necesidad de utilizar una base de datos o un servidor backend.

---

# Objetivo

Mi objetivo fue desarrollar un prototipo frontend funcional que cumpliera con los requerimientos establecidos para la **Fase 4**, demostrando un flujo completo de usuario desde la creación de un proyecto hasta el registro de defectos y la consulta de indicadores.

Con este prototipo busqué representar las principales actividades realizadas durante el proceso de aseguramiento de calidad de software, permitiendo administrar la información de manera organizada y visualizar el estado de las pruebas mediante reportes e indicadores.

---

# Funcionalidades implementadas

Para cumplir con el alcance solicitado en la guía desarrollé las siguientes funcionalidades:

* Inicio de sesión (prototipo).
* Dashboard con indicadores dinámicos.
* Administración de proyectos.
* Gestión de requerimientos.
* Administración de casos de prueba.
* Ejecución de pruebas.
* Registro y administración de defectos.
* Reportes básicos.
* Perfil del usuario.
* Configuración de la aplicación.
* Persistencia de datos mediante localStorage.
* API simulada para la gestión de datos.
* Diseño responsive para diferentes tamaños de pantalla.

---

# Flujo principal del prototipo

Durante la demostración del proyecto es posible recorrer un flujo completo de trabajo correspondiente al proceso de aseguramiento de calidad:

**Proyecto → Requerimiento → Caso de prueba → Ejecución → Resultado → Registro del defecto → Reportes**

Este flujo permite evidenciar la trazabilidad entre cada una de las actividades implementadas dentro del prototipo.

---

# Tecnologías utilizadas

Para el desarrollo del proyecto utilicé las siguientes tecnologías:

* HTML5
* CSS3
* JavaScript
* LocalStorage
* API simulada mediante JavaScript
* Git
* GitHub
* GitHub Pages

---

# Organización del repositorio

Con el propósito de mantener un repositorio organizado y de fácil comprensión, estructuré el proyecto de la siguiente manera:

```text
QA_Manager_Fase4_Diego_Andres_Gomez_Piamba/
│
├── README.md
├── LICENSE
├── .gitignore
├── index.html
│
├── src/
│   ├── index.html
│   ├── app.js
│   ├── mock-api.js
│   └── styles.css
│
├── docs/
│   ├── informe_final.pdf
│   ├── informe_final.docx
│   ├── arquitectura.md
│   └── despliegue_github_pages.md
│
├── data/
│   ├── qa_manager_seed.json
│   └── README.md
│
├── scripts/
│   └── README.md
│
├── dashboard/
│   └── README.md
│
├── evidencias/
│   └── README.md
│
└── .github/
    └── workflows/
        └── pages.yml
```

Esta organización facilita la ubicación de la documentación, el código fuente, los datos utilizados, las evidencias y los archivos necesarios para el despliegue del proyecto.

---

# Cumplimiento de los requerimientos de la guía

Para dar cumplimiento a los lineamientos establecidos en la guía de la actividad, preparé el repositorio incluyendo:

* Documentación completa del proyecto mediante este archivo README.
* Código fuente organizado por carpetas.
* Informe final en formato PDF y Word.
* Datos simulados utilizados por la aplicación.
* Carpeta destinada a las evidencias del funcionamiento del prototipo.
* Archivo `.gitignore`.
* Licencia MIT.
* Configuración para el despliegue mediante GitHub Pages.

Asimismo, el prototipo cumple con los criterios mínimos esperados para un **TRL 5**, ya que dispone de interfaces completas, navegación funcional, operaciones CRUD, validaciones básicas, conexión con datos simulados, diseño adaptable y preparación para su publicación en un entorno de pruebas.

---

# Instrucciones de uso

Para ejecutar el proyecto de manera local únicamente es necesario descargar o clonar el repositorio y abrir el archivo **index.html** desde un navegador web moderno.

Una vez iniciada la aplicación es posible navegar entre los diferentes módulos, crear proyectos, administrar requerimientos, registrar casos de prueba, ejecutar pruebas, gestionar defectos y consultar los indicadores generados por el sistema.

También es posible publicar el proyecto mediante **GitHub Pages**, utilizando el archivo `index.html` ubicado en la raíz del repositorio.

---

# Informe final

El informe correspondiente a esta fase se encuentra disponible en la carpeta **docs**, donde se incluyen los archivos:

* `informe_final.pdf`
* `informe_final.docx`

En este documento describo el análisis, diseño, metodología, implementación, resultados, validación del prototipo y conclusiones obtenidas durante el desarrollo del proyecto.

---

# Evidencias

La carpeta **evidencias** está destinada a almacenar las capturas de pantalla y los registros del funcionamiento del prototipo, además del enlace al video de sustentación cuando sea requerido.

---

# Licencia

Este proyecto incluye la licencia **MIT**, la cual permite el uso, modificación y distribución del código respetando las condiciones establecidas en el archivo **LICENSE**.

---

# Conclusión

El desarrollo de **QA Manager** me permitió aplicar los conocimientos adquiridos durante el curso mediante la construcción de un prototipo web funcional orientado al aseguramiento de calidad de software.

Con este proyecto logré integrar la gestión de proyectos, requerimientos, casos de prueba, ejecución de pruebas, registro de defectos y generación de indicadores dentro de una única aplicación, cumpliendo con los requerimientos definidos para la Fase 4 y dejando una base preparada para futuras mejoras e integración con servicios y bases de datos reales.
