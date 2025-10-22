# NexoPay - Paleta de Colores

## 🎨 Colores Principales

### **Primary (Principal)**
- **Color**: `#208eaa`
- **Uso**: Botones principales, enlaces, elementos destacados
- **Clases**: `bg-primary-500`, `text-primary-500`, `border-primary-500`

### **Secondary (Secundario)**
- **Color**: `#5ec4e3`
- **Uso**: Botones secundarios, acentos, elementos de apoyo
- **Clases**: `bg-secondary-500`, `text-secondary-500`, `border-secondary-500`

### **Highlight (Destacados)**
- **Color**: `#c1d224`
- **Uso**: Elementos de llamada a la acción, highlights, alertas
- **Clases**: `bg-highlight-500`, `text-highlight-500`, `border-highlight-500`

### **Neutral (Neutro)**
- **Color**: `#f1f1f0`
- **Uso**: Fondos, textos secundarios, bordes
- **Clases**: `bg-neutral-500`, `text-neutral-500`, `border-neutral-500`

## 🎯 Clases de Componentes Personalizadas

### **Botones**
```css
.btn-primary      /* Botón principal (primary-500) */
.btn-secondary    /* Botón secundario (secondary-500) */
.btn-highlight    /* Botón de destacado (highlight-500) */
.btn-outline      /* Botón outline (primary-500) */
.btn-outline-secondary /* Botón outline secundario */
```

### **Navegación**
```css
.nav-link         /* Enlaces de navegación */
.nav-link-active  /* Enlace activo */
```

### **Textos**
```css
.text-primary     /* Texto principal */
.text-secondary   /* Texto secundario */
.text-highlight   /* Texto destacado */
.text-gradient    /* Gradiente primary-secondary */
.text-gradient-highlight /* Gradiente primary-highlight */
```

### **Efectos**
```css
.shadow-glow           /* Sombra con glow primary */
.shadow-glow-secondary /* Sombra con glow secondary */
.shadow-glow-highlight /* Sombra con glow highlight */
.bg-pattern           /* Patrón de fondo sutil */
```

## 📱 Ejemplos de Uso

### **Hero Section**
```jsx
<section className="hero-gradient text-white py-20">
  <h1 className="text-gradient">Título Principal</h1>
  <button className="btn-primary shadow-glow">Call to Action</button>
</section>
```

### **Cards**
```jsx
<div className="card hover:shadow-lg transition duration-300">
  <h3 className="text-primary">Título</h3>
  <p className="text-neutral-600">Descripción</p>
</div>
```

### **Navegación**
```jsx
<nav>
  <a className="nav-link">Home</a>
  <a className="nav-link nav-link-active">About</a>
</nav>
```

### **Formularios**
```jsx
<input className="input-field" placeholder="Email" />
<button className="btn-primary">Enviar</button>
```

## 🌈 Escalas de Colores

Cada color tiene una escala del 50 al 900:

- **50**: Más claro (fondos suaves)
- **100-200**: Muy claro
- **300-400**: Claro
- **500**: Color base
- **600-700**: Oscuro
- **800-900**: Muy oscuro (textos, bordes)

### **Ejemplos de Escalas**
```css
bg-primary-50    /* Fondo muy claro */
bg-primary-100   /* Fondo claro */
bg-primary-500   /* Color base */
bg-primary-600   /* Hover state */
bg-primary-900   /* Texto oscuro */
```

## 🎨 Gradientes Disponibles

```css
.hero-gradient           /* primary → secondary */
.text-gradient          /* primary → secondary */
.text-gradient-highlight /* primary → highlight */
```

## 💡 Mejores Prácticas

1. **Usar primary-500** para elementos principales
2. **Usar secondary-500** para elementos de apoyo
3. **Usar highlight-500** para llamadas a la acción
4. **Usar neutral-500** para textos y fondos
5. **Usar las clases personalizadas** para consistencia
6. **Combinar colores** para crear jerarquía visual

## 🔧 Personalización

Para modificar los colores, edita el archivo `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#208eaa', // Color principal
    // ... otras variaciones
  }
}
```

Los cambios se aplicarán automáticamente en toda la aplicación.
