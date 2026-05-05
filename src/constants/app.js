/**
 * Application constants
 */

export const ASSETS = {
  FEATURED_IMAGES_BASE: 'https://nexopay-assets.s3.us-west-2.amazonaws.com/images',
};

export const APP_CONFIG = {
  NAME: 'NexoPay',
  VERSION: '1.0.0',
  DESCRIPTION: 'Modern payment solution for businesses',
  AUTHOR: 'Nexo Technologies',
  SUPPORT_EMAIL: 'contacto@nexopay.mx',
  SUPPORT_PHONE: '+52 351 145 7093',
  SUPPORT_PHONE_RAW: '+523511457093',
  WEBSITE: 'https://nexopay.mx',
};

/** URL pública de términos y condiciones (sitio NexoPay). */
export const TERMS_AND_CONDITIONS_URL = `${APP_CONFIG.WEBSITE}/terminos-condiciones`;

/** Query `payment_method_ids` para GET get-payment-methods-mp (incluye OXXO; la UI de tarjeta solo usa débito). */
export const MERCADO_PAGO_PAYMENT_METHOD_IDS = ['debvisa', 'debmaster', 'oxxo'];

/** Métodos de tarjeta mostrados en checkout y modal de abonos (id y payment_type_id vienen del API). */
export const MERCADO_PAGO_CHECKOUT_DEBIT_CARD_IDS = ['debvisa', 'debmaster'];

/** Valores de `typeVerification` para POST /otp/insert (API). */
export const OTP_TYPE_VERIFICATION = {
  PHONE_NUMBER: 'phone_number',
  RESET_PASSWORD: 'reset_password',
};

export const ESTADOS_MEXICO = [
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

export const CIUDADES_MEXICO = [
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

/** Valor interno de la opción “Otro motivo” en baja de cuenta (no se envía al API). */
export const DELETE_ACCOUNT_REASON_OTHER = '__other__';

/**
 * Catálogo de motivos de baja; `value` es el texto enviado en `reasonDelete` (salvo “Otro”).
 * @type {{ value: string, label: string }[]}
 */
export const DELETE_ACCOUNT_REASON_OPTIONS = [
  { value: 'Las comisiones o el costo no me convencen', label: 'Las comisiones o el costo no me convencen' },
  { value: 'Ya no uso el servicio', label: 'Ya no uso el servicio' },
  { value: 'Tuve problemas técnicos o errores en la app', label: 'Tuve problemas técnicos o errores en la app' },
  { value: 'Preocupaciones de privacidad o datos', label: 'Preocupaciones de privacidad o datos' },
  { value: 'Encontré otra alternativa', label: 'Encontré otra alternativa' },
  { value: DELETE_ACCOUNT_REASON_OTHER, label: 'Otro motivo' },
];
