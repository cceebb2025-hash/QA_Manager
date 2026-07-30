# Arquitectura del prototipo

## Capas

```text
Interfaz
  └── src/index.html
      └── src/styles.css

Lógica de presentación
  └── src/app.js

Capa de datos simulada
  └── src/mock-api.js
      └── localStorage del navegador
```

## Flujo de datos

1. El usuario interactúa con la interfaz.
2. `app.js` valida los datos básicos y solicita operaciones a `QAApi`.
3. `mock-api.js` crea, consulta, actualiza o elimina registros.
4. Los registros se almacenan en `localStorage`.
5. La interfaz se vuelve a renderizar y los KPI se calculan con los datos actuales.

## Alcance TRL 5

El prototipo cubre el flujo de extremo a extremo requerido para la demostración:

**Proyecto → Requerimiento → Caso → Ejecución → Failed → Bug → Reporte.**

La conexión con datos es simulada mediante una API local y `localStorage`; no se utiliza una API externa ni una base de datos real.

Desarrollado por: Diego Andres Gomez Piamba
