import { z } from 'zod';
import { ESTADOS_MEXICO } from '../../constants/app';

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
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/, 'Solo letras y números, sin espacios ni símbolos')
    .refine((val) => /\d/.test(val), {
      message: 'El número exterior debe incluir al menos un dígito'
    }),

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
      required_error: 'La ciudad es requerida',
      invalid_type_error: 'La ciudad debe ser un texto'
    })
    .min(1, 'Ingresa una ciudad válida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede tener más de 100 caracteres')
    .refine((val) => val.trim().length >= 2, {
      message: 'Ingresa una ciudad válida'
    }),

  estado: z
    .string({
      required_error: 'Debes seleccionar un estado',
      invalid_type_error: 'El estado debe ser un texto'
    })
    .min(1, 'Debes seleccionar un estado')
    .refine((val) => ESTADOS_MEXICO.includes(val), {
      message: 'Debes seleccionar un estado válido'
    }),

  codigoPostal: z
    .string({
      required_error: 'El código postal es requerido',
      invalid_type_error: 'El código postal debe ser un texto'
    })
    .min(1, 'El código postal es requerido')
    .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos numéricos'),

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


