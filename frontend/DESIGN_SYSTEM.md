# Sistema de Diseño — Lead Finder

Documento de referencia para el equipo frontend. La idea es que todos usemos los mismos valores para que la app quede consistente sin importar quién codee cada pantalla.

Cualquier duda o cambio que quieran proponer, lo discutimos en la próxima reunión de equipo.

---

## Colores

La paleta está basada en azul marino oscuro como base y verde como color de acción. El fondo es más oscuro que el sidebar para generar jerarquía visual.

| Variable | Hex | Dónde se usa |
|---|---|---|
| `--color-bg` | `#0b1929` | Fondo principal de todas las pantallas |
| `--color-surface` | `#111f30` | Sidebar y top bar |
| `--color-card` | `#172840` | Cards, tablas, modales |
| `--color-green` | `#1aaa6e` | Botones primarios, ítem activo del sidebar, badges de Cliente |
| `--color-green-light` | `#2ecc8f` | Hover de botones verdes, acentos |
| `--color-text` | `#f0f4f8` | Texto principal |
| `--color-text-sec` | `#7a9bbf` | Texto secundario, labels |
| `--color-text-muted` | `#3d5a73` | Texto muy apagado, placeholders, headers de tabla |
| `--color-border` | `rgba(255,255,255,0.07)` | Bordes de cards y separadores |

Para usar estos valores en el código de React, los declaramos en el archivo `style.css` global y los llamamos con `var(--color-bg)` etc. Esto ya está configurado.

---

## Estados del lead

Cada estado tiene su propio color. Estos colores se usan siempre igual en toda la app: en los badges, en los marcadores del mapa y en los botones del cambio de estado.

| Estado | Color del punto | Color del texto | Background del badge |
|---|---|---|---|
| Lead | `#e05252` | `#ff7b7b` | `rgba(224, 82, 82, 0.13)` |
| Contacto | `#e09a30` | `#ffba55` | `rgba(224, 154, 48, 0.13)` |
| Prospecto | `#3d8fe0` | `#74b4ff` | `rgba(61, 143, 224, 0.13)` |
| Cliente | `#1aaa6e` | `#2ecc8f` | `rgba(26, 170, 110, 0.13)` |

El badge siempre tiene un puntito del color del estado a la izquierda del texto. El border-radius es 20px para que quede como píldora.

---

## Tipografía

Fuente: **Inter** (importada de Google Fonts). Si no está disponible, fallback a `system-ui`.

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

| Elemento | Tamaño | Peso | Color |
|---|---|---|---|
| Título de página (h1) | 18px | 600 | `--color-text` |
| Título de card (h2) | 14px | 600 | `--color-text` |
| Texto de tabla / body | 12–13px | 400 | `--color-text` |
| Labels de inputs | 11px | 500 | `#a8bdd4` |
| Headers de tabla | 10px | 600, uppercase | `--color-text-muted` |
| Texto secundario / muted | 11px | 400 | `--color-text-sec` |

---

## Componentes base

### Botón primario

Fondo verde, texto blanco. Al hacer hover cambia a `--color-green-light`.

```css
background: #1aaa6e;
color: #ffffff;
border: none;
border-radius: 9px;
padding: 10px 16px;
font-size: 13px;
font-weight: 600;
cursor: pointer;
```

### Botón secundario

Fondo verde transparente con borde verde. Se usa para acciones como "+ Nuevo Lead".

```css
background: rgba(26, 170, 110, 0.15);
border: 1px solid rgba(26, 170, 110, 0.4);
color: #1aaa6e;
border-radius: 8px;
padding: 6px 14px;
font-size: 12px;
font-weight: 500;
```

### Input de texto

```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.07);
border-radius: 9px;
color: #f0f4f8;
padding: 10px 13px;
font-size: 13px;
outline: none;
```

Al hacer focus, el borde cambia a `#1aaa6e` y el fondo a `rgba(26, 170, 110, 0.06)`.

### Card

```css
background: #172840;
border: 1px solid rgba(255, 255, 255, 0.07);
border-radius: 12px;
padding: 18px 20px;
```

### Badge de estado

```css
display: inline-flex;
align-items: center;
gap: 5px;
padding: 2px 8px;
border-radius: 20px;
font-size: 11px;
font-weight: 500;
```

Los colores de fondo y texto se toman de la tabla de estados de arriba según el estado del lead.

---

## Layout general

Todas las pantallas (excepto el login) tienen la misma estructura:

```
┌─────────────┬────────────────────────────────────┐
│             │ Top bar (56px)                     │
│  Sidebar    ├────────────────────────────────────┤
│  (200px)    │                                    │
│             │  Contenido principal               │
│             │                                    │
└─────────────┴────────────────────────────────────┘
```

- **Sidebar**: 200px de ancho fijo, `background: #111f30`
- **Top bar**: 56px de alto, `background: #111f30`, borde inferior
- **Contenido**: el resto del espacio, `background: #0b1929`, padding de 22–24px

---

## Notas generales

- Siempre usar `box-sizing: border-box` en todos los elementos
- Los bordes son siempre de 1px (no 2px ni 0.5px)
- Border-radius de cards: 10–12px. De botones: 8–9px. De badges: 20px
- No usar sombras (`box-shadow`) excepto para rings de focus en inputs
- Todos los íconos son de Tabler Icons (ya está importado en el proyecto)

---

*Última actualización: Mayo 2026 — Valentin Carriaga*
