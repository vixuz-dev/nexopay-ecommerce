import colornames from 'colornames';

/**
 * Converts a color name to HEX value
 * Supports both English and Spanish color names
 * Falls back to a default gray if color not found
 * 
 * @param {string} colorName - Name of the color (e.g., "rojo", "red", "azul marino")
 * @returns {string} - HEX color value (e.g., "#FF0000")
 */
export const getColorHex = (colorName) => {
  if (!colorName || typeof colorName !== 'string') {
    return '#9CA3AF'; // Default gray
  }

  // Normalize the color name
  const normalized = colorName.toLowerCase().trim();

  // Spanish to English color name mapping
  const spanishToEnglish = {
    'negro': 'black',
    'blanco': 'white',
    'azul': 'blue',
    'rojo': 'red',
    'verde': 'green',
    'amarillo': 'yellow',
    'rosa': 'pink',
    'violeta': 'violet',
    'morado': 'purple',
    'gris': 'gray',
    'gris espacial': 'space gray',
    'plateado': 'silver',
    'dorado': 'gold',
    'naranja': 'orange',
    'turquesa': 'turquoise',
    'beige': 'beige',
    'marron': 'brown',
    'marrón': 'brown',
    'cafe': 'brown',
    'café': 'brown',
    'verde lima': 'lime',
    'verde menta': 'mint',
    'azul marino': 'navy',
    'azul cielo': 'sky blue',
    'rojo oscuro': 'dark red',
    'verde oscuro': 'dark green',
    'azul claro': 'light blue',
    'rosa claro': 'light pink',
  };

  // Try Spanish mapping first
  const englishName = spanishToEnglish[normalized] || normalized;

  // Try to get HEX from colornames library
  let hex = colornames(englishName);

  // If not found, try with common variations
  if (!hex) {
    // Try removing spaces and special characters
    const cleaned = englishName.replace(/[^a-z0-9]/g, '');
    hex = colornames(cleaned);
  }

  // If still not found, try some common patterns
  if (!hex) {
    const patterns = {
      'starlight': '#F5F5F7',
      'midnight': '#191970',
      'spacegray': '#1F2937',
      'space-gray': '#1F2937',
      'productred': '#DC2626',
      'product-red': '#DC2626',
    };
    hex = patterns[normalized] || patterns[normalized.replace(/\s+/g, '')];
  }

  // Fallback to default gray if still not found
  return hex || '#9CA3AF';
};

/**
 * Validates if a string is a valid HEX color
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid HEX color
 */
export const isValidHex = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Gets color value, handling both HEX strings and color names
 * @param {string} color - Color name or HEX value
 * @returns {string} - HEX color value
 */
export const getColorValue = (color) => {
  if (!color) return '#9CA3AF';
  
  // If it's already a valid HEX, return it
  if (isValidHex(color)) {
    return color;
  }
  
  // Otherwise, try to convert the name to HEX
  return getColorHex(color);
};

