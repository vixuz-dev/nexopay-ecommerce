import { z } from 'zod';
import { ESTADOS_MEXICO, CIUDADES_MEXICO } from '../../constants/app';

export const personalAddressSchema = z.object({
  calle: z
    .string()
    .min(3, 'Ingresa un nombre de calle válido')
    .max(100, 'Ingresa un nombre de calle válido')
    .regex(/^[a-zA-Z0-9\s.#\-áéíóúÁÉÍÓÚñÑüÜ]+$/, 'Ingresa un nombre de calle válido')
    .refine((val) => val.trim().length >= 3, {
      message: 'Ingresa un nombre de calle válido'
    }),

  numeroExterior: z
    .string()
    .min(1, 'Ingresa un número exterior válido')
    .max(20, 'Ingresa un número exterior válido')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/, 'Solo letras y números, sin espacios ni símbolos')
    .refine((val) => /\d/.test(val), {
      message: 'El número exterior debe incluir al menos un dígito'
    }),

  numeroInterior: z
    .string()
    .max(20, 'Ingresa un número interior válido')
    .regex(/^[a-zA-Z0-9\s\-/]*$/, 'Ingresa un número interior válido')
    .optional()
    .nullable()
    .transform((val) => val === '' || val === null ? undefined : val),

  colonia: z
    .string()
    .min(3, 'Ingresa un nombre de colonia válido')
    .max(100, 'Ingresa un nombre de colonia válido')
    .regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/, 'Ingresa un nombre de colonia válido')
    .refine((val) => val.trim().length >= 3, {
      message: 'Ingresa un nombre de colonia válido'
    }),

  ciudad: z
    .string()
    .min(1, 'Selecciona una ciudad')
    .refine((val) => CIUDADES_MEXICO.includes(val), {
      message: 'Selecciona una ciudad válida'
    }),

  estado: z
    .string()
    .min(1, 'Selecciona un estado')
    .refine((val) => ESTADOS_MEXICO.includes(val), {
      message: 'Selecciona un estado válido'
    }),

  codigoPostal: z
    .string()
    .min(1, 'Ingresa un código postal válido')
    .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos numéricos'),

  referencias: z
    .string()
    .min(10, 'Ingresa referencias válidas (mínimo 10 caracteres)')
    .max(250, 'Las referencias son demasiado largas (máximo 250 caracteres)')
    .refine((val) => val.trim().length >= 10, {
      message: 'Ingresa referencias válidas (mínimo 10 caracteres)'
    })
});

