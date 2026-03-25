# Escenarios E2E — NexoPay E-commerce

Documento de referencia para identificar y priorizar pruebas E2E que validen el correcto funcionamiento de la aplicación.

---

## Leyenda de estado

| Estado | Significado |
|--------|-------------|
| ✅ | Prueba implementada |
| 📋 | Escenario definido, pendiente implementación |
| ⏸️ | Prioridad baja / pospuesto |

---

## 1. Autenticación (`auth/`)

### 1.1 Login
| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 1.1.1 | Mostrar página de login | ✅ | Verificar que se muestren título, campos de teléfono y contraseña |
| 1.1.2 | Login exitoso con credenciales válidas | ✅ | Ingresar datos correctos y verificar redirección a Home |
| 1.1.3 | Error con teléfono vacío | ✅ | Validación de campo requerido |
| 1.1.4 | Error con contraseña vacía | ✅ | Validación de campo requerido |
| 1.1.5 | Error con credenciales incorrectas | ✅ | Mensaje de error al fallar autenticación |
| 1.1.6 | Error con teléfono inválido (menos de 10 dígitos) | ✅ | Validación de formato |
| 1.1.7 | Redirección a Home si ya está autenticado | ✅ | Usuario logueado no debe ver login |
| 1.1.8 | Link "Regístrate aquí" navega a registro | ✅ | Navegación correcta |

### 1.2 Registro
| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 1.2.1 | Mostrar página de registro | ✅ | Formulario visible con todos los campos |
| 1.2.2 | Validaciones de campos requeridos | ✅ | Teléfono, nombre, apellidos, contraseña |
| 1.2.3 | Registro exitoso redirige a validar OTP | ✅ | Flujo completo de registro |
| 1.2.4 | Link "Inicia sesión" navega a login | ✅ | Navegación correcta |

### 1.3 Validación OTP (post-registro)
| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 1.3.1 | Mostrar página de validación OTP | ✅ | Campos visibles |
| 1.3.2 | OTP válido completa registro | ✅ | Redirección o siguiente paso |
| 1.3.3 | OTP inválido muestra error | ✅ | Mensaje de error |

### 1.4 Verificación de correo
| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 1.4.1 | Solicitar código de verificación | ✅ | Botón envía código al email |
| 1.4.2 | Ingresar código correcto | ✅ | Verificación exitosa |
| 1.4.3 | Código incorrecto muestra error | ✅ | Mensaje de error |
| 1.4.4 | Reenviar código (después del cooldown) | ✅ | Nuevo código enviado |

### 1.5 Logout
| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 1.5.1 | Cerrar sesión redirige a login | ✅ | Token y sesión limpiados |
| 1.5.2 | Rutas protegidas redirigen a login tras logout | ✅ | Protección correcta |

---

## 2. Home / Navegación

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 2.1 | Home carga correctamente (usuario autenticado) | 📋 | Sin login redirige a /iniciar-sesion |
| 2.2 | Navegación a productos desde Home | 📋 | Links de categorías funcionan |
| 2.3 | Barra de búsqueda visible y funcional | 📋 | Input de búsqueda en header |
| 2.4 | Icono de carrito abre sidebar | 📋 | CartSidebar se muestra |
| 2.5 | Menú de categorías desplegable | 📋 | Mega menu o navegación de categorías |

---

## 3. Productos (`products/`)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 3.1 | Listado de productos carga | 📋 | Grid de productos visible |
| 3.2 | Búsqueda por nombre filtra resultados | 📋 | Query param `q` aplicado |
| 3.3 | Filtro por categoría | 📋 | Productos filtrados correctamente |
| 3.4 | Navegar a detalle de producto | 📋 | Click en producto abre detalle |
| 3.5 | Detalle de producto muestra info completa | 📋 | Imagen, precio, descripción, opciones |
| 3.6 | Seleccionar variante (talla/color) | 📋 | Si aplica, cambiar variante actualiza precio |
| 3.7 | Botón "Agregar al carrito" en ProductCard | 📋 | Agrega producto y abre sidebar (o feedback) |
| 3.8 | Botón "Agregar al carrito" en ProductDetail | 📋 | Agrega con cantidad seleccionada |
| 3.9 | Botón "Comprar ahora" navega a carrito | 📋 | Agrega y redirige a /comprar/carrito |

---

## 4. Carrito (`cart/`)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 4.1 | Sidebar muestra items del carrito | 📋 | Items agregados visibles |
| 4.2 | Aumentar cantidad en sidebar | 📋 | Cantidad actualizada |
| 4.3 | Disminuir cantidad (hasta remover) | 📋 | Item removido si cantidad 0 |
| 4.4 | Botón "Remover" elimina item | 📋 | Item desaparece del carrito |
| 4.5 | Botón "Vaciar carrito" | 📋 | Carrito vacío |
| 4.6 | Ir a carrito desde sidebar | 📋 | Navega a /comprar/carrito |
| 4.7 | Página Carrito muestra resumen completo | 📋 | Items, subtotal, envío, total |
| 4.8 | Cambiar cantidad en página Carrito | 📋 | +/- funcional |
| 4.9 | Carrito vacío muestra mensaje | 📋 | CTA para seguir comprando |

---

## 5. Checkout (`checkout/`)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 5.1 | Checkout requiere dirección de envío | 📋 | Seleccionar o agregar dirección |
| 5.2 | Agregar nueva dirección desde checkout | 📋 | Modal o formulario de dirección |
| 5.3 | Resumen de orden correcto | 📋 | Items, totales, dirección |
| 5.4 | Seleccionar método de pago | 📋 | Tarjeta, etc. |
| 5.5 | Pago exitoso redirige a confirmación | 📋 | OrderConfirmation visible |
| 5.6 | Carrito vacío tras compra exitosa | 📋 | No queda items |
| 5.7 | Error de pago muestra mensaje | 📋 | Modal o toast de error |

---

## 6. Mi cuenta (`account/`)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 6.1 | Mi cuenta carga dashboard | 📋 | Pedidos, crédito, stats |
| 6.2 | Mi perfil muestra datos del usuario | 📋 | Formulario con datos actuales |
| 6.3 | Editar perfil y guardar | 📋 | Cambios persistidos |
| 6.4 | Mis pedidos lista órdenes | 📋 | Tabla o lista de pedidos |
| 6.5 | Ver detalle de pedido | 📋 | Navegación a OrderDetail |
| 6.6 | Movimientos de crédito | 📋 | Historial visible |
| 6.7 | Pagos pendientes | 📋 | Lista o resumen |
| 6.8 | Mis facturas | 📋 | Lista de facturas |

---

## 7. Crédito (`credit/`)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 7.1 | Solicitar crédito muestra wizard | 📋 | Flujo multi-paso |
| 7.2 | Mi crédito muestra estado | 📋 | Línea aprobada o pendiente |
| 7.3 | Pagar crédito (abonos) | 📋 | Flujo de pago para abonos |

---

## 8. Rutas y protección

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 8.1 | Ruta protegida sin auth redirige a login | 📋 | /, /mi-cuenta, /comprar/carrito, etc. |
| 8.2 | Ruta pública con auth redirige a Home | 📋 | /iniciar-sesion, /registro |
| 8.3 | 404 para ruta inexistente | 📋 | Página NotFound |

---

## 9. Legal

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 9.1 | Términos y condiciones accesible | 📋 | /terminos |
| 9.2 | Aviso de privacidad accesible | 📋 | /privacidad |

---

## 10. Flujos completos (happy path)

| # | Escenario | Estado | Descripción |
|---|-----------|--------|-------------|
| 10.1 | Login → Home → Productos → Detalle → Agregar al carrito → Carrito → Checkout | 📋 | Flujo de compra completo |
| 10.2 | Registro → OTP → Login → Verificación email | 📋 | Onboarding completo |
| 10.3 | Búsqueda → Filtro por categoría → Agregar múltiples productos → Carrito | 📋 | Descubrimiento y compra |

---

## Priorización sugerida

1. **P0 (crítico):** Login, Carrito (agregar/remover), Checkout básico
2. **P1 (alto):** Productos, Detalle, Home, Mi cuenta
3. **P2 (medio):** Registro, OTP, Verificación email, Crédito
4. **P3 (bajo):** Legal, 404, edge cases

---

## Cómo usar este documento

1. Al implementar una prueba, cambiar el estado de 📋 a ✅
2. Añadir nuevos escenarios según surjan
3. Marcar con ⏸️ los que se posponen
4. Ejecutar `npm run cy:run` para validar el conjunto de pruebas
