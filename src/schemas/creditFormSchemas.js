import { z } from 'zod';

const estadosMexico = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
];

const ciudadesMexico = [
  'Ciudad de México',
  'Guadalajara',
  'Monterrey',
  'Puebla',
  'Tijuana',
  'León',
  'Juárez',
  'Torreón',
  'Querétaro',
  'San Luis Potosí',
  'Mérida',
  'Mexicali',
  'Aguascalientes',
  'Tampico',
  'Culiacán',
  'Zamora',
  'Morelia',
  'Chihuahua',
  'Saltillo',
  'Hermosillo',
  'Jacona'
];

export const personalAddressSchema = z.object({
  calle: z
    .string()
    .min(3, 'La calle debe tener al menos 3 caracteres')
    .max(100, 'La calle no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9\s.#\-áéíóúÁÉÍÓÚñÑüÜ]+$/, 'La calle contiene caracteres inválidos')
    .refine((val) => val.trim().length >= 3, {
      message: 'La calle no puede ser solo espacios'
    }),

  numeroExterior: z
    .string()
    .min(1, 'El número exterior es requerido')
    .max(20, 'El número exterior no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9\s\-/]+$/, 'El número exterior contiene caracteres inválidos'),

  numeroInterior: z
    .string()
    .max(20, 'El número interior no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9\s\-/]*$/, 'El número interior contiene caracteres inválidos')
    .optional()
    .nullable()
    .transform((val) => val === '' || val === null ? undefined : val),

  colonia: z
    .string()
    .min(3, 'La colonia debe tener al menos 3 caracteres')
    .max(100, 'La colonia no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/, 'La colonia contiene caracteres inválidos')
    .refine((val) => val.trim().length >= 3, {
      message: 'La colonia no puede ser solo espacios'
    }),

  ciudad: z
    .string()
    .min(1, 'Debes seleccionar una ciudad')
    .refine((val) => ciudadesMexico.includes(val), {
      message: 'Debes seleccionar una ciudad válida'
    }),

  estado: z
    .string()
    .min(1, 'Debes seleccionar un estado')
    .refine((val) => estadosMexico.includes(val), {
      message: 'Debes seleccionar un estado válido'
    }),

  codigoPostal: z
    .string()
    .length(5, 'El código postal debe tener exactamente 5 dígitos')
    .regex(/^\d{5}$/, 'El código postal debe contener solo números'),

  referencias: z
    .string()
    .min(10, 'Las referencias deben tener al menos 10 caracteres')
    .max(500, 'Las referencias no pueden tener más de 500 caracteres')
    .refine((val) => val.trim().length >= 10, {
      message: 'Las referencias no pueden ser solo espacios'
    })
});

const periodosAprobacion = ['ultimos_2_meses', '3_4_meses', '5_6_meses'];

export const eligibilitySchema = z.object({
  edad: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number({
          required_error: 'La edad es requerida',
          invalid_type_error: 'La edad debe ser un número'
        })
        .int('La edad debe ser un número entero')
        .min(18, 'Debes tener al menos 18 años')
        .max(100, 'La edad no puede ser mayor a 100 años')
    ),

  residencia_pais: z
    .boolean({
      required_error: 'Debes indicar si resides en México'
    }),

  ingreso_mensual: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number({
          required_error: 'El ingreso mensual es requerido',
          invalid_type_error: 'El ingreso mensual debe ser un número'
        })
        .int('El ingreso mensual debe ser un número entero')
        .min(0, 'El ingreso mensual no puede ser negativo')
        .positive('El ingreso mensual debe ser mayor a 0')
    ),

  antiguedad_laboral: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number({
          required_error: 'La antigüedad laboral es requerida',
          invalid_type_error: 'La antigüedad laboral debe ser un número'
        })
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

  total_compra: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .pipe(
      z
        .number({
          required_error: 'El total de la compra es requerido',
          invalid_type_error: 'El total de la compra debe ser un número'
        })
        .int('El total de la compra debe ser un número entero')
        .min(0, 'El total de la compra no puede ser negativo')
        .positive('El total de la compra debe ser mayor a 0')
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

// Schema para una referencia personal
export const referenceSchema = z.object({
  nombres: z
    .string({
      required_error: 'El nombre es requerido',
      invalid_type_error: 'El nombre debe ser un texto'
    })
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras')
    .refine((val) => val.trim().length >= 2, {
      message: 'El nombre no puede ser solo espacios'
    }),

  apellidoPaterno: z
    .string({
      required_error: 'El apellido paterno es requerido',
      invalid_type_error: 'El apellido paterno debe ser un texto'
    })
    .min(1, 'El apellido paterno es requerido')
    .min(2, 'El apellido paterno debe tener al menos 2 caracteres')
    .max(50, 'El apellido paterno no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido paterno solo puede contener letras')
    .refine((val) => val.trim().length >= 2, {
      message: 'El apellido paterno no puede ser solo espacios'
    }),

  apellidoMaterno: z
    .string({
      required_error: 'El apellido materno es requerido',
      invalid_type_error: 'El apellido materno debe ser un texto'
    })
    .min(1, 'El apellido materno es requerido')
    .min(2, 'El apellido materno debe tener al menos 2 caracteres')
    .max(50, 'El apellido materno no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido materno solo puede contener letras')
    .refine((val) => val.trim().length >= 2, {
      message: 'El apellido materno no puede ser solo espacios'
    }),

  telefono: z
    .string({
      required_error: 'El teléfono es requerido',
      invalid_type_error: 'El teléfono debe ser un texto'
    })
    .min(1, 'El teléfono es requerido')
    .length(10, 'El teléfono debe tener exactamente 10 dígitos')
    .regex(/^\d+$/, 'El teléfono solo puede contener números'),

  calle: z
    .string({
      required_error: 'La calle es requerida',
      invalid_type_error: 'La calle debe ser un texto'
    })
    .min(1, 'La calle es requerida')
    .min(3, 'La calle debe tener al menos 3 caracteres')
    .max(100, 'La calle no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9\s.#\-áéíóúÁÉÍÓÚñÑüÜ]+$/, 'La calle contiene caracteres inválidos')
    .refine((val) => val.trim().length >= 3, {
      message: 'La calle no puede ser solo espacios'
    }),

  numeroExterior: z
    .string({
      required_error: 'El número exterior es requerido',
      invalid_type_error: 'El número exterior debe ser un texto'
    })
    .min(1, 'El número exterior es requerido')
    .max(20, 'El número exterior no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9\s\-/]+$/, 'El número exterior contiene caracteres inválidos'),

  numeroInterior: z
    .string()
    .max(20, 'El número interior no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9\s\-/]*$/, 'El número interior contiene caracteres inválidos')
    .optional()
    .nullable()
    .transform((val) => val === '' || val === null ? undefined : val),

  colonia: z
    .string({
      required_error: 'La colonia es requerida',
      invalid_type_error: 'La colonia debe ser un texto'
    })
    .min(1, 'La colonia es requerida')
    .min(3, 'La colonia debe tener al menos 3 caracteres')
    .max(100, 'La colonia no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/, 'La colonia contiene caracteres inválidos')
    .refine((val) => val.trim().length >= 3, {
      message: 'La colonia no puede ser solo espacios'
    }),

  ciudad: z
    .string({
      required_error: 'Debes seleccionar una ciudad',
      invalid_type_error: 'La ciudad debe ser un texto'
    })
    .min(1, 'Debes seleccionar una ciudad')
    .refine((val) => ciudadesMexico.includes(val), {
      message: 'Debes seleccionar una ciudad válida'
    }),

  estado: z
    .string({
      required_error: 'Debes seleccionar un estado',
      invalid_type_error: 'El estado debe ser un texto'
    })
    .min(1, 'Debes seleccionar un estado')
    .refine((val) => estadosMexico.includes(val), {
      message: 'Debes seleccionar un estado válido'
    }),

  codigoPostal: z
    .string({
      required_error: 'El código postal es requerido',
      invalid_type_error: 'El código postal debe ser un texto'
    })
    .min(1, 'El código postal es requerido')
    .length(5, 'El código postal debe tener exactamente 5 dígitos')
    .regex(/^\d{5}$/, 'El código postal debe contener solo números'),

  referenciaUbicacion: z
    .string({
      required_error: 'Las referencias de ubicación son requeridas',
      invalid_type_error: 'Las referencias de ubicación deben ser un texto'
    })
    .min(1, 'Las referencias de ubicación son requeridas')
    .min(10, 'Las referencias de ubicación deben tener al menos 10 caracteres')
    .max(500, 'Las referencias de ubicación no pueden tener más de 500 caracteres')
    .refine((val) => val.trim().length >= 10, {
      message: 'Las referencias de ubicación no pueden ser solo espacios'
    })
});

export const personalReferencesSchema = z.object({
  reference1: referenceSchema,
  reference2: referenceSchema
});

export default {
  personalAddressSchema,
  eligibilitySchema,
  personalReferencesSchema
};

