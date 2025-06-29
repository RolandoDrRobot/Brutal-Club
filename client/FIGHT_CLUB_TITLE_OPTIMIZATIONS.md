# Fight Club Title Optimizations

## Resumen
Se han implementado optimizaciones CSS para asegurar que todos los títulos "FIGHT CLUB" se mantengan en una sola línea en todas las pantallas y dispositivos, incluyendo dispositivos móviles muy pequeños.

## Cambios Implementados

### 1. Modificación de la clase `.fight-title`
**Archivo:** `client/src/styles/fightAnimations.css`

- **`white-space: nowrap`**: Fuerza el texto a permanecer en una línea
- **`overflow: visible`**: Permite que el texto se extienda fuera del contenedor si es necesario
- **`text-overflow: clip`**: Evita puntos suspensivos innecesarios
- **`width: fit-content`**: Ajusta el ancho al contenido
- **`margin: 0 auto`**: Centra el título horizontalmente

### 2. Media Queries Responsivas
Se agregaron media queries específicas para diferentes tamaños de pantalla:

#### Dispositivos pequeños (≤480px)
- Tamaño de fuente: `clamp(24px, 6vw, 40px)`
- Espaciado de letras: `clamp(2px, 1.5vw, 6px)`
- Ancho máximo: `90vw`

#### Dispositivos extra pequeños (≤360px)
- Tamaño de fuente: `clamp(20px, 7vw, 32px)`
- Espaciado de letras: `clamp(1px, 2vw, 4px)`
- Ancho máximo: `95vw`

#### Dispositivos micro (≤320px)
- Tamaño de fuente: `clamp(18px, 8vw, 28px)`
- Espaciado de letras: `clamp(0.5px, 2.5vw, 3px)`
- Ancho máximo: `98vw`

### 3. Nueva clase `.fight-button-text`
Para botones que contienen texto "FIGHT CLUB":

- **`white-space: nowrap`**: Mantiene el texto en una línea
- **`overflow: hidden`**: Oculta el desbordamiento
- **`text-overflow: ellipsis`**: Agrega puntos suspensivos si es necesario
- **Media queries responsivas** para diferentes tamaños de pantalla

### 4. Modificación del botón "ENTER FIGHT CLUB"
**Archivo:** `client/src/components/Interface.jsx`

- Se envolvió el texto del botón en un `<span>` con la clase `fight-button-text`
- Esto asegura que "ENTER FIGHT CLUB" siempre se mantenga en una línea

## Componentes Afectados

### Títulos principales (usando `.fight-title`):
1. **MainMenu.jsx** - Título principal del menú
2. **LoadingScreen.jsx** - Título en pantalla de carga
3. **CharacterSelect.jsx** - Título en selección de personajes
4. **OpponentSelect.jsx** - Título en selección de oponentes
5. **Shop.jsx** - Título en la tienda
6. **Interface.jsx** - Títulos en diferentes pantallas
7. **HealthBars.jsx** - Título en la pantalla de pelea

### Botones (usando `.fight-button-text`):
1. **Interface.jsx** - Botón "ENTER FIGHT CLUB"

## Beneficios

1. **Consistencia visual**: Todos los títulos "FIGHT CLUB" mantienen el mismo comportamiento
2. **Responsividad mejorada**: Se adapta automáticamente a diferentes tamaños de pantalla
3. **Legibilidad preservada**: El texto permanece legible en dispositivos pequeños
4. **Experiencia de usuario mejorada**: No hay cortes de línea inesperados en el título

## Pruebas Recomendadas

1. **Dispositivos móviles**: iPhone SE (375px), Samsung Galaxy S8 (360px)
2. **Pantallas pequeñas**: 320px de ancho
3. **Tablets**: iPad (768px), iPad Pro (1024px)
4. **Desktop**: Resoluciones estándar (1920x1080, 1366x768)

## Uso de las Clases

### Para títulos principales:
```jsx
<div className="fight-title">
  FIGHT CLUB
</div>
```

### Para texto de botones:
```jsx
<Button>
  <span className="fight-button-text">
    ENTER FIGHT CLUB
  </span>
</Button>
```

## Notas Técnicas

- Los valores `clamp()` proporcionan escalado fluido entre tamaños mínimos y máximos
- Las unidades `vw` (viewport width) aseguran que el texto se escale con el ancho de la pantalla
- El uso de `white-space: nowrap` es crítico para mantener el texto en una línea
- Los media queries están ordenados de mayor a menor para cascada CSS correcta 