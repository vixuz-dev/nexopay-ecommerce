import { z } from 'zod';
import { isValidEmail, isValidCURP } from '../../utils/validation';

export const emailCurpSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .min(1, 'El correo electrónico es requerido')
    .refine(isValidEmail, 'Ingresa un correo electrónico válido'),

  curp: z
    .string({ required_error: 'La CURP es requerida' })
    .min(1, 'La CURP es requerida')
    .length(18, 'La CURP debe tener exactamente 18 caracteres')
    .refine((val) => isValidCURP(val), 'Ingresa una CURP válida'),
});
