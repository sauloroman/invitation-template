# 🧙‍♂️ CLI Wizard: Generador Interactivo de Invitaciones (`create-invitation`)

El asistente interactivo `create-invitation` es una herramienta CLI para generar rápidamente proyectos independientes de invitación para clientes, configurando sus tipografías, colores, variantes de menú, música y secciones sin tocar código.

Ruta de destino predeterminada: `C:\Users\roman\OneDrive\Escritorio\proyectos-desarrollo\invitaciones\Clientes`

---

## 🚀 Cómo Usarlo

Desde la terminal del proyecto raíz, ejecuta:

```bash
npm run create:invitation
```

---

## 📋 Pasos del Asistente

1. **Ruta y Nombre**: Te solicita el nombre de la carpeta cliente (ej: `boda-maria-y-carlos`) y confirma la carpeta destino predeterminada.
2. **Información del Evento**: Nombres principales, fecha/hora en formato ISO y mensaje de bienvenida.
3. **Packs Tipográficos**: Selección interactiva de los Packs 1 al 5.
4. **Paletas de Colores**: Selección interactiva de las Paletas 1 a la 10.
5. **Menú y Música**: Elección de variante (`bar`, `floating`, o Desactivado).
6. **Módulos y Secciones**: Preguntas (S/N) para incluir Cuenta Regresiva, Lugares, Itinerario, Código de Vestimenta, Galería, Regalos, Confirmación y Sistema de Tickets.

---

## ⚙️ ¿Qué hace internamente?

1. Duplica la estructura limpia de la plantilla base en `Clientes/<nombre-proyecto>`.
2. Genera el archivo manifiesto [invitation.config.json](file:///c:/Users/roman/OneDrive/Escritorio/proyectos-desarrollo/invitaciones/invitation-template/invitation.config.json) con todas las respuestas.
3. Ejecuta automáticamente `npm run theme:sync` en la carpeta destino para compilar el tema SCSS.
4. Te proporciona los comandos para entrar e iniciar la invitación (`cd "C:\Users\roman\OneDrive\Escritorio\proyectos-desarrollo\invitaciones\Clientes\<nombre-proyecto>" && npm run dev`).
