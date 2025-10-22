# NexoPay - Tipografía Poppins

## 🔤 Configuración de Fuentes

### **Fuente Principal: Poppins**
- **Familia**: `Poppins`
- **Fallback**: `system-ui, sans-serif`
- **Pesos disponibles**: 100-900 (sin itálicas)

## 📝 Pesos de Fuente Disponibles

| Peso | Valor | Clase Tailwind | Uso Recomendado |
|------|-------|----------------|-----------------|
| Thin | 100 | `font-thin` | Textos muy ligeros, decorativos |
| ExtraLight | 200 | `font-extralight` | Subtítulos ligeros |
| Light | 300 | `font-light` | Textos secundarios |
| Regular | 400 | `font-normal` | Texto principal del cuerpo |
| Medium | 500 | `font-medium` | Textos destacados |
| SemiBold | 600 | `font-semibold` | Subtítulos, botones |
| Bold | 700 | `font-bold` | Títulos principales |
| ExtraBold | 800 | `font-extrabold` | Títulos grandes |
| Black | 900 | `font-black` | Títulos hero, muy destacados |

## 🎯 Clases de Utilidad

### **Configuración Global**
```css
/* Aplicado automáticamente a todo el sitio */
html, body {
  font-family: 'Poppins', system-ui, sans-serif;
}
```

### **Clases de Peso**
```jsx
<h1 className="font-black text-4xl">Título Hero</h1>
<h2 className="font-bold text-2xl">Título Principal</h2>
<h3 className="font-semibold text-xl">Subtítulo</h3>
<p className="font-normal text-base">Texto del cuerpo</p>
<span className="font-light text-sm">Texto secundario</span>
```

### **Combinaciones con Colores**
```jsx
<h1 className="font-black text-4xl text-gradient">
  Título con Gradiente
</h1>

<h2 className="font-bold text-2xl text-primary">
  Título Principal
</h2>

<p className="font-normal text-base text-neutral-600">
  Texto del cuerpo
</p>
```

## 📱 Ejemplos de Uso por Componente

### **Hero Section**
```jsx
<section className="hero-gradient text-white py-20">
  <h1 className="font-black text-5xl mb-6">
    Modern Payment Solutions
  </h1>
  <p className="font-light text-xl mb-8">
    Secure, fast, and reliable payment processing
  </p>
</section>
```

### **Navegación**
```jsx
<nav>
  <a className="font-medium text-base nav-link">Home</a>
  <a className="font-semibold text-base nav-link-active">About</a>
</nav>
```

### **Cards**
```jsx
<div className="card">
  <h3 className="font-semibold text-xl text-neutral-900 mb-2">
    Feature Title
  </h3>
  <p className="font-normal text-base text-neutral-600">
    Feature description
  </p>
</div>
```

### **Botones**
```jsx
<button className="btn-primary font-semibold">
  Get Started
</button>
<button className="btn-outline font-medium">
  Learn More
</button>
```

### **Formularios**
```jsx
<label className="font-medium text-sm text-neutral-700">
  Email Address
</label>
<input className="input-field font-normal" />
```

## 🎨 Jerarquía Tipográfica

### **Títulos**
```jsx
<h1 className="font-black text-5xl">Hero Title</h1>
<h2 className="font-bold text-4xl">Section Title</h2>
<h3 className="font-semibold text-2xl">Subsection Title</h3>
<h4 className="font-medium text-xl">Card Title</h4>
```

### **Textos**
```jsx
<p className="font-normal text-lg">Lead Text</p>
<p className="font-normal text-base">Body Text</p>
<p className="font-light text-sm">Small Text</p>
<p className="font-extralight text-xs">Caption</p>
```

## 🔧 Configuración Técnica

### **Font Face Declarations**
```css
@font-face {
  font-family: 'Poppins';
  src: url('../assets/fonts/poppins/Poppins-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### **Tailwind Config**
```javascript
fontFamily: {
  'sans': ['Poppins', 'system-ui', 'sans-serif'],
  'poppins': ['Poppins', 'system-ui', 'sans-serif'],
}
```

## 💡 Mejores Prácticas

1. **Usar `font-black`** solo para títulos hero muy grandes
2. **Usar `font-bold`** para títulos principales de sección
3. **Usar `font-semibold`** para subtítulos y elementos destacados
4. **Usar `font-normal`** para texto del cuerpo
5. **Usar `font-light`** para texto secundario
6. **Combinar con colores** para crear jerarquía visual
7. **Mantener consistencia** en toda la aplicación

## 🚀 Rendimiento

- **Font Display**: `swap` para mejor rendimiento
- **Preload**: Las fuentes se cargan localmente
- **Fallback**: `system-ui` como respaldo
- **Optimización**: Solo pesos normales (sin itálicas)

## 📐 Escalas Recomendadas

```jsx
// Títulos Hero
<h1 className="font-black text-5xl md:text-6xl">Hero</h1>

// Títulos de Sección
<h2 className="font-bold text-3xl md:text-4xl">Section</h2>

// Subtítulos
<h3 className="font-semibold text-xl md:text-2xl">Subsection</h3>

// Texto Principal
<p className="font-normal text-base md:text-lg">Body</p>

// Texto Secundario
<p className="font-light text-sm md:text-base">Secondary</p>
```

La tipografía Poppins está completamente configurada y lista para usar en todo el proyecto.
