# Mejoras Recomendadas para el Servicio de KYC

## 📋 Resumen Ejecutivo

Este documento detalla mejoras propuestas para el servicio de KYC en términos de **funcionalidad**, **buenas prácticas** y **seguridad**, basadas en el análisis del código actual.

---

## 🔒 SEGURIDAD (Prioridad Alta)

### 1. **Validación de Entrada Mejorada**
**Problema actual:** No se valida el formato ni tamaño del base64 antes de enviarlo.

**Mejora:**
```javascript
// En kycService.js
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  // Validar que base64ImageFile sea string
  if (typeof base64ImageFile !== 'string' || base64ImageFile.trim() === '') {
    throw new Error('La imagen debe ser un string base64 válido');
  }

  // Validar formato base64
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(base64ImageFile)) {
    throw new Error('Formato de imagen inválido');
  }

  // Estimar tamaño aproximado (base64 es ~33% más grande que binario)
  const estimatedSizeMB = (base64ImageFile.length * 3) / 4 / 1024 / 1024;
  const MAX_SIZE_MB = 10; // Límite de seguridad
  
  if (estimatedSizeMB > MAX_SIZE_MB) {
    throw new Error(`La imagen es demasiado grande (máximo ${MAX_SIZE_MB}MB)`);
  }

  // ... resto del código
}
```

### 2. **Sanitización de Logs**
**Problema actual:** Los errores pueden exponer información sensible en `console.error`.

**Mejora:**
```javascript
// Crear utilidad para sanitizar logs
const sanitizeForLogging = (data) => {
  if (typeof data === 'string' && data.length > 100) {
    return `${data.substring(0, 100)}... [truncated]`;
  }
  // No loggear base64 completo
  if (typeof data === 'string' && data.length > 500) {
    return '[Large base64 string omitted]';
  }
  return data;
};

// En catch blocks:
catch (error) {
  // Solo loggear en desarrollo
  if (import.meta.env.DEV) {
    console.error('KYC Error:', {
      message: error.message,
      status: error.status,
      // NO incluir base64ImageFile en logs
    });
  }
  throw error;
}
```

### 3. **Rate Limiting del Cliente**
**Problema actual:** No hay protección contra spam de requests.

**Mejora:**
```javascript
class KYCService {
  constructor() {
    this.requestQueue = [];
    this.lastRequestTime = 0;
    this.MIN_REQUEST_INTERVAL = 2000; // 2 segundos entre requests
  }

  async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    
    // ... resto del código
  }
}
```

### 4. **Timeout con Límites de Seguridad**
**Problema actual:** Timeout configurable sin límites máximos/mínimos.

**Mejora:**
```javascript
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  // Límites de seguridad
  const MIN_TIMEOUT = 30000;  // 30 segundos mínimo
  const MAX_TIMEOUT = 300000; // 5 minutos máximo
  
  const safeTimeout = Math.max(
    MIN_TIMEOUT,
    Math.min(MAX_TIMEOUT, timeoutMs)
  );
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), safeTimeout);
  // ...
}
```

---

## ⚙️ FUNCIONALIDAD (Prioridad Media)

### 5. **Validación de Formato de Imagen**
**Problema actual:** No se valida el tipo MIME antes de enviar.

**Mejora:**
```javascript
// En imageUtils.js
export const validateImageFormat = (base64String) => {
  // Detectar tipo MIME desde base64
  const mimeTypes = {
    '/9j/': 'image/jpeg',
    'iVBORw0KGgo': 'image/png',
    'R0lGODlh': 'image/gif',
    'UklGR': 'image/webp',
  };
  
  for (const [signature, mimeType] of Object.entries(mimeTypes)) {
    if (base64String.startsWith(signature)) {
      return { valid: true, mimeType };
    }
  }
  
  return { valid: false, mimeType: null };
};

// En kycService.js
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  const formatValidation = validateImageFormat(base64ImageFile);
  if (!formatValidation.valid) {
    throw new Error('Formato de imagen no soportado. Usa JPEG, PNG, GIF o WebP');
  }
  // ...
}
```

### 6. **Retry con Exponential Backoff**
**Problema actual:** El componente maneja retries, pero el servicio no tiene lógica de retry inteligente.

**Mejora:**
```javascript
async evaluateDocument(base64ImageFile, timeoutMs = 120000, retryOptions = {}) {
  const {
    maxRetries = 0,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = retryOptions;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await this._performRequest(base64ImageFile, timeoutMs);
    } catch (error) {
      lastError = error;
      
      // No reintentar en ciertos errores
      if (error.status === 400 || error.status === 413) {
        throw error; // Bad request o payload too large
      }
      
      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
```

### 7. **Métricas y Telemetría**
**Problema actual:** No hay tracking de performance ni errores.

**Mejora:**
```javascript
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  const startTime = performance.now();
  let success = false;
  
  try {
    const result = await this._performRequest(base64ImageFile, timeoutMs);
    success = true;
    return result;
  } finally {
    const duration = performance.now() - startTime;
    
    // Enviar métricas (solo en producción, sin datos sensibles)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'kyc_request', {
        success,
        duration_ms: Math.round(duration),
        // NO incluir base64ImageFile
      });
    }
  }
}
```

### 8. **Validación de Respuesta del API**
**Problema actual:** No se valida la estructura de la respuesta antes de retornarla.

**Mejora:**
```javascript
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  // ... código de request ...
  
  const data = await response.json();
  
  // Validar estructura básica
  if (!data || typeof data !== 'object') {
    throw new Error('Respuesta del servidor inválida');
  }
  
  if (!data.documentType) {
    throw new Error('La respuesta no contiene el tipo de documento');
  }
  
  return data;
}
```

---

## 🏗️ BUENAS PRÁCTICAS (Prioridad Media-Baja)

### 9. **Cliente HTTP Centralizado**
**Problema actual:** Cada servicio usa `fetch` directamente, sin consistencia.

**Mejora:**
```javascript
// Crear src/api/client.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      // Manejo centralizado de errores
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  handleErrorResponse(response) {
    // Lógica centralizada
  }
  
  handleError(error) {
    // Lógica centralizada
  }
}

// En kycService.js
import { apiClient } from '../client';

async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    return await apiClient.request(ENDPOINTS.KYC.EVALUATE, {
      method: 'POST',
      body: JSON.stringify({ base64ImageFile }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### 10. **JSDoc Mejorado**
**Problema actual:** Documentación básica, falta información sobre tipos y errores.

**Mejora:**
```javascript
/**
 * Evaluate document using KYC service
 * 
 * @param {string} base64ImageFile - Base64 encoded image (without data URI prefix)
 *   Must be a valid base64 string representing an image (JPEG, PNG, GIF, or WebP)
 *   Maximum size: ~10MB (estimated)
 * @param {number} [timeoutMs=120000] - Request timeout in milliseconds
 *   Minimum: 30000 (30s), Maximum: 300000 (5min)
 * @returns {Promise<KycResponse>} - Extracted document data
 *   Structure depends on documentType:
 *   - 'ine' (front): { documentType, name, curp, electorKey, dateOfBirth, address, section, dateOfExpiry }
 *   - 'ine' (back): { documentType, ocr, cic, id_ciudadano, mrzLine1, mrzLine2, mrzLine3, mrzLine4 }
 *   - 'passport': { documentType, issuingCountry, documentNumber, lastName, firstName, nationality, dateOfBirth, sex, dateOfExpiry, mrzLine1, mrzLine2 }
 * @throws {Error} When:
 *   - Invalid base64 format or image type
 *   - Image too large (>10MB)
 *   - Network error (isNetworkError: true)
 *   - Timeout (isTimeout: true, status: 408)
 *   - API error (status: 4xx/5xx, includes status and statusMessage)
 * @example
 * ```javascript
 * try {
 *   const kycData = await kycService.evaluateDocument(base64Image);
 *   console.log('Document type:', kycData.documentType);
 * } catch (error) {
 *   if (error.isTimeout) {
 *     // Handle timeout
 *   } else if (error.isNetworkError) {
 *     // Handle network error
 *   }
 * }
 * ```
 */
async evaluateDocument(base64ImageFile, timeoutMs = 120000) {
  // ...
}
```

### 11. **Constantes Configurables**
**Problema actual:** Valores hardcodeados.

**Mejora:**
```javascript
// En kycService.js o constants/kyc.js
export const KYC_CONSTANTS = {
  MAX_IMAGE_SIZE_MB: 10,
  MIN_TIMEOUT_MS: 30000,
  MAX_TIMEOUT_MS: 300000,
  DEFAULT_TIMEOUT_MS: 120000,
  MIN_REQUEST_INTERVAL_MS: 2000,
  SUPPORTED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  RETRY: {
    MAX_RETRIES: 3,
    INITIAL_DELAY_MS: 1000,
    MAX_DELAY_MS: 10000,
    BACKOFF_MULTIPLIER: 2,
  },
};
```

### 12. **Manejo de Errores Consistente**
**Problema actual:** Errores personalizados pero sin estructura estándar.

**Mejora:**
```javascript
// Crear src/utils/errors.js
export class KYCError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'KYCError';
    this.status = options.status;
    this.statusCode = options.status;
    this.statusMessage = options.statusMessage;
    this.details = options.details;
    this.isTimeout = options.isTimeout || false;
    this.isNetworkError = options.isNetworkError || false;
    this.code = options.code || 'KYC_ERROR';
  }
}

// En kycService.js
import { KYCError } from '../../utils/errors';

if (error.name === 'AbortError') {
  throw new KYCError(
    'El procesamiento del documento está tomando más tiempo del esperado. Por favor, intenta nuevamente.',
    { status: 408, isTimeout: true, code: 'KYC_TIMEOUT' }
  );
}
```

### 13. **Cache de Respuestas (Opcional)**
**Problema actual:** Si el usuario sube la misma imagen dos veces, se procesa de nuevo.

**Mejora:**
```javascript
class KYCService {
  constructor() {
    this.responseCache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  }

  _getCacheKey(base64ImageFile) {
    // Hash del base64 (primeros y últimos caracteres + longitud)
    const hash = btoa(
      base64ImageFile.substring(0, 50) + 
      base64ImageFile.length + 
      base64ImageFile.substring(base64ImageFile.length - 50)
    ).substring(0, 32);
    return `kyc_${hash}`;
  }

  async evaluateDocument(base64ImageFile, timeoutMs = 120000, useCache = true) {
    if (useCache) {
      const cacheKey = this._getCacheKey(base64ImageFile);
      const cached = this.responseCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }
    }
    
    const result = await this._performRequest(base64ImageFile, timeoutMs);
    
    if (useCache) {
      const cacheKey = this._getCacheKey(base64ImageFile);
      this.responseCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });
    }
    
    return result;
  }
}
```

---

## 📊 Priorización de Implementación

### Fase 1 (Crítico - Implementar primero)
1. ✅ Validación de entrada (tamaño, formato base64)
2. ✅ Sanitización de logs
3. ✅ Timeout con límites de seguridad
4. ✅ Validación de formato de imagen

### Fase 2 (Importante - Implementar después)
5. ✅ Rate limiting del cliente
6. ✅ Validación de respuesta del API
7. ✅ Manejo de errores consistente (KYCError class)
8. ✅ Constantes configurables

### Fase 3 (Mejoras - Implementar cuando sea posible)
9. ✅ Retry con exponential backoff
10. ✅ Cliente HTTP centralizado
11. ✅ JSDoc mejorado
12. ✅ Métricas y telemetría
13. ✅ Cache de respuestas (opcional)

---

## 🔍 Consideraciones Adicionales

### Performance
- **Compresión de imágenes:** Considerar comprimir imágenes antes de enviar (reducir tamaño base64)
- **Lazy loading:** Solo procesar cuando el usuario confirma

### UX
- **Progreso de upload:** Mostrar progreso si el archivo es grande
- **Preview antes de enviar:** Permitir al usuario ver la imagen antes de procesar

### Testing
- **Unit tests:** Validar lógica de validación
- **Integration tests:** Probar flujo completo con mock del API
- **Error scenarios:** Probar todos los tipos de error

---

## 📝 Notas Finales

- Estas mejoras deben implementarse gradualmente
- Priorizar seguridad sobre funcionalidad
- Mantener compatibilidad con el código existente
- Documentar cambios en CHANGELOG
- Considerar impacto en performance antes de agregar validaciones pesadas
