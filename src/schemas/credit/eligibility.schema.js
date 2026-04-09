import { z } from 'zod';

const periodosAprobacion = ['ultimos_2_meses', '3_4_meses', '5_6_meses'];

const mensajesNumero = (campo) => ({
  required_error: `${campo} es requerido`,
  invalid_type_error: `Ingresa un número válido en ${campo.toLowerCase()}`
});

export const eligibilitySchema = z.object({
  edad: z
    .union([z.number(), z.string(), z.undefined()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number(mensajesNumero('La edad'))
        .int('La edad debe ser un número entero')
        .min(18, 'Debes tener al menos 18 años')
        .max(100, 'La edad no puede ser mayor a 100 años')
    ),

  residencia_pais: z
    .boolean({
      required_error: 'Debes indicar si resides en México'
    }),

  ingreso_mensual: z
    .union([z.number(), z.string(), z.undefined()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number(mensajesNumero('El ingreso mensual'))
        .int('El ingreso mensual debe ser un número entero')
        .min(0, 'El ingreso mensual no puede ser negativo')
        .positive('El ingreso mensual debe ser mayor a 0')
    ),

  antiguedad_laboral: z
    .union([z.number(), z.string(), z.undefined()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number(mensajesNumero('La antigüedad laboral'))
        .int('La antigüedad laboral debe ser un número entero')
        .min(0, 'La antigüedad laboral no puede ser negativa')
    ),

  uso_tarjeta_credito: z
    .boolean({
      required_error: 'Debes indicar si usas tarjeta de crédito'
    }),

  pago_servicios_debito_transferencia: z
    .boolean({
      required_error: 'Debes indicar si pagas servicios con débito o transferencia'
    }),

  solicitud_aprobada: z
    .boolean({
      required_error: 'Debes indicar si te han aprobado alguna solicitud'
    }),

  solicitud_aprobada_periodo: z
    .string()
    .optional(),

  solicitud_rechazada: z
    .boolean({
      required_error: 'Debes indicar si te han rechazado alguna solicitud'
    }),

  solicitud_rechazada_periodo: z
    .string()
    .optional(),

  total_compra: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'number' && Number.isFinite(val)) {
        return String(Math.trunc(Math.abs(val)));
      }
      return String(val);
    },
    z
      .string()
      .min(1, 'Ingresa el total de la compra que deseas realizar')
      .regex(/^\d+$/, 'Solo se permiten números (sin letras ni símbolos)')
      .transform((s) => parseInt(s, 10))
      .pipe(
        z
          .number()
          .int('El total debe ser un número entero (sin decimales)')
          .min(1, 'El total de la compra debe ser mayor a 0')
      )
  )
}).superRefine((data, ctx) => {
  // Validación condicional: si solicitud_aprobada es true, periodo debe estar presente y válido
  if (data.solicitud_aprobada === true) {
    if (!data.solicitud_aprobada_periodo || data.solicitud_aprobada_periodo === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes seleccionar el periodo de la aprobación más reciente',
        path: ['solicitud_aprobada_periodo']
      });
    } else if (!periodosAprobacion.includes(data.solicitud_aprobada_periodo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes seleccionar un periodo válido',
        path: ['solicitud_aprobada_periodo']
      });
    }
  }
  
  // Validación condicional: si solicitud_rechazada es true, periodo debe estar presente y válido
  if (data.solicitud_rechazada === true) {
    if (!data.solicitud_rechazada_periodo || data.solicitud_rechazada_periodo === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes seleccionar el periodo del rechazo más reciente',
        path: ['solicitud_rechazada_periodo']
      });
    } else if (!periodosAprobacion.includes(data.solicitud_rechazada_periodo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes seleccionar un periodo válido',
        path: ['solicitud_rechazada_periodo']
      });
    }
  }
});

