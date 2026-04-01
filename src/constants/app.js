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

export const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '';

export const MERCADO_PAGO_PAYMENT_METHOD_IDS = [
  'visa',
  'master',
  'debvisa',
  'debmaster',
  'oxxo',
];

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
