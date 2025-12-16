import { useState, useEffect } from 'react';

// Datos mock de productos - esto se reemplazará con una llamada a la API
const mockProducts = [
  {
    id: 1,
    name: 'Smartphone Samsung Galaxy A54',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    image: null,
    category: 'Electrónica',
    rating: 4.5,
    inStock: true,
    description: 'Smartphone Samsung Galaxy A54 con pantalla Super AMOLED de 6.4", procesador Exynos 1380, 128GB de almacenamiento y cámara triple de 50MP.',
    specifications: {
      pantalla: '6.4" Super AMOLED',
      procesador: 'Exynos 1380',
      almacenamiento: '128GB',
      ram: '6GB',
      camara: '50MP + 12MP + 5MP',
      bateria: '5000mAh'
    }
  },
  {
    id: 2,
    name: 'Laptop HP Pavilion 15',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    image: null,
    category: 'Computadoras',
    rating: 4.7,
    inStock: true,
    description: 'Laptop HP Pavilion 15 con procesador Intel Core i5, 8GB RAM, 512GB SSD y pantalla Full HD de 15.6".',
    specifications: {
      pantalla: '15.6" Full HD',
      procesador: 'Intel Core i5',
      almacenamiento: '512GB SSD',
      ram: '8GB',
      graficos: 'Intel UHD Graphics',
      sistema: 'Windows 11'
    }
  },
  {
    id: 3,
    name: 'Auriculares Sony WH-1000XM4',
    price: 5999,
    originalPrice: null,
    discount: null,
    image: null,
    category: 'Audio',
    rating: 4.8,
    inStock: true,
    description: 'Auriculares inalámbricos Sony WH-1000XM4 con cancelación de ruido activa, batería de 30 horas y sonido de alta calidad.',
    specifications: {
      tipo: 'Over-ear inalámbricos',
      cancelacion: 'Cancelación de ruido activa',
      bateria: '30 horas',
      conexion: 'Bluetooth 5.0',
      peso: '254g'
    }
  },
  {
    id: 4,
    name: 'Tablet iPad Air',
    price: 10999,
    originalPrice: 12999,
    discount: 15,
    image: null,
    category: 'Tablets',
    rating: 4.6,
    inStock: true,
    description: 'Tablet iPad Air con chip M1, pantalla Liquid Retina de 10.9", 64GB de almacenamiento y cámara frontal de 12MP.',
    specifications: {
      pantalla: '10.9" Liquid Retina',
      procesador: 'Chip M1',
      almacenamiento: '64GB',
      camara: '12MP frontal, 12MP trasera',
      bateria: 'Hasta 10 horas',
      sistema: 'iPadOS'
    }
  },
  {
    id: 5,
    name: 'Smart TV LG 55" 4K',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: null,
    category: 'Televisores',
    rating: 4.4,
    inStock: true,
    description: 'Smart TV LG 55" 4K UHD con webOS, HDR10, Dolby Vision y procesador α7 Gen5 AI.',
    specifications: {
      pantalla: '55" 4K UHD',
      resolucion: '3840 x 2160',
      hdr: 'HDR10, Dolby Vision',
      sistema: 'webOS',
      puertos: '4x HDMI, 2x USB',
      wifi: 'Wi-Fi 5'
    }
  },
  {
    id: 6,
    name: 'Cámara Canon EOS Rebel',
    price: 15999,
    originalPrice: null,
    discount: null,
    image: null,
    category: 'Fotografía',
    rating: 4.9,
    inStock: false,
    description: 'Cámara réflex digital Canon EOS Rebel con sensor APS-C de 24.1MP, grabación de video 4K y pantalla táctil articulada.',
    specifications: {
      sensor: '24.1MP APS-C',
      video: '4K UHD',
      pantalla: '3" táctil articulada',
      iso: '100-25600',
      conectividad: 'Wi-Fi, Bluetooth',
      lente: 'Kit 18-55mm'
    }
  },
  {
    id: 7,
    name: 'Smartwatch Apple Watch Series 9',
    price: 7999,
    originalPrice: 8999,
    discount: 11,
    image: null,
    category: 'Smartwatches',
    rating: 4.7,
    inStock: true,
    description: 'Apple Watch Series 9 con GPS, pantalla Always-On Retina, resistencia al agua y monitoreo de salud avanzado.',
    specifications: {
      pantalla: 'Always-On Retina',
      gps: 'Sí',
      resistencia: '50m agua',
      bateria: '18 horas',
      sistema: 'watchOS 10',
      sensores: 'ECG, oxígeno en sangre'
    }
  },
  {
    id: 8,
    name: 'Consola PlayStation 5',
    price: 11999,
    originalPrice: 12999,
    discount: 8,
    image: null,
    category: 'Gaming',
    rating: 4.9,
    inStock: true,
    description: 'Consola PlayStation 5 con SSD ultra rápido, ray tracing, salida 4K y control DualSense inalámbrico.',
    specifications: {
      almacenamiento: '825GB SSD',
      resolucion: '4K UHD',
      rayTracing: 'Sí',
      control: 'DualSense incluido',
      conectividad: 'Wi-Fi 6, Bluetooth 5.1'
    }
  },
  {
    id: 9,
    name: 'Mouse Logitech MX Master 3',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    image: null,
    category: 'Accesorios',
    rating: 4.6,
    inStock: true,
    description: 'Mouse inalámbrico Logitech MX Master 3 con sensor Darkfield de alta precisión, batería de 70 días y diseño ergonómico.',
    specifications: {
      tipo: 'Inalámbrico',
      sensor: 'Darkfield 4000 DPI',
      bateria: '70 días',
      conexion: 'Bluetooth, USB',
      botones: '7 botones programables'
    }
  },
  {
    id: 10,
    name: 'Teclado Mecánico Corsair K70',
    price: 3499,
    originalPrice: null,
    discount: null,
    image: null,
    category: 'Accesorios',
    rating: 4.8,
    inStock: true,
    description: 'Teclado mecánico gaming Corsair K70 RGB con switches Cherry MX, retroiluminación RGB y reposamuñecas magnético.',
    specifications: {
      tipo: 'Mecánico',
      switches: 'Cherry MX',
      iluminacion: 'RGB',
      conexion: 'USB',
      teclas: '104 teclas'
    }
  },
  {
    id: 11,
    name: 'Monitor ASUS ROG 27" 144Hz',
    price: 6999,
    originalPrice: 7999,
    discount: 13,
    image: null,
    category: 'Monitores',
    rating: 4.7,
    inStock: true,
    description: 'Monitor gaming ASUS ROG 27 pulgadas con resolución Full HD, frecuencia de 144Hz, tiempo de respuesta 1ms y FreeSync.',
    specifications: {
      pantalla: '27" Full HD',
      resolucion: '1920 x 1080',
      frecuencia: '144Hz',
      tiempoRespuesta: '1ms',
      tecnologia: 'FreeSync, HDR'
    }
  },
  {
    id: 12,
    name: 'Bocina JBL Charge 5',
    price: 3999,
    originalPrice: 4499,
    discount: 11,
    image: null,
    category: 'Audio',
    rating: 4.5,
    inStock: true,
    description: 'Bocina portátil JBL Charge 5 con sonido estéreo, batería de 20 horas, resistencia al agua IPX7 y función Powerbank.',
    specifications: {
      tipo: 'Portátil Bluetooth',
      bateria: '20 horas',
      resistencia: 'IPX7',
      potencia: '40W',
      funciones: 'Powerbank, PartyBoost'
    }
  }
];

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extraer valores individuales para usar como dependencias
  const search = filters.search || '';
  const categories = filters.categories || [];
  const category = filters.category || '';
  const sortBy = filters.sortBy || '';
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const inStock = filters.inStock;
  const onSale = filters.onSale || false;
  const minRating = filters.minRating;
  const minDiscount = filters.minDiscount;
  const maxDiscount = filters.maxDiscount;
  const showOnlyNew = filters.showOnlyNew || false;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProducts = [...mockProducts];

        // Aplicar filtros
        if (categories && categories.length > 0) {
          filteredProducts = filteredProducts.filter(
            p => categories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
          );
        } else if (category) {
          // Soporte para filtro de categoría única (backward compatibility)
          filteredProducts = filteredProducts.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            p => p.name.toLowerCase().includes(searchLower) ||
                 p.category.toLowerCase().includes(searchLower) ||
                 (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }

        if (minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
        }

        if (maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
        }

        if (inStock !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
        }

        if (onSale) {
          filteredProducts = filteredProducts.filter(p => p.discount && p.discount > 0);
        }

        if (minRating !== undefined) {
          filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= minRating);
        }

        if (minDiscount !== undefined || maxDiscount !== undefined) {
          filteredProducts = filteredProducts.filter(p => {
            if (!p.discount) return false;
            if (minDiscount !== undefined && p.discount < minDiscount) return false;
            if (maxDiscount !== undefined && p.discount > maxDiscount) return false;
            return true;
          });
        }

        if (showOnlyNew) {
          // Simular productos nuevos (por ahora, todos los productos con ID <= 3 son "nuevos")
          filteredProducts = filteredProducts.filter(p => p.id <= 3);
        }

        // Ordenar
        if (sortBy) {
          filteredProducts.sort((a, b) => {
            switch (sortBy) {
              case 'price-asc':
                return a.price - b.price;
              case 'price-desc':
                return b.price - a.price;
              case 'name-asc':
                return a.name.localeCompare(b.name);
              case 'name-desc':
                return b.name.localeCompare(a.name);
              case 'rating-desc':
                return (b.rating || 0) - (a.rating || 0);
              default:
                return 0;
            }
          });
        }

        setProducts(filteredProducts);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, categories.join(','), category, sortBy, minPrice, maxPrice, inStock, onSale, minRating, minDiscount, maxDiscount, showOnlyNew]);

  return { products, loading, error };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!productId) {
          setError('ID de producto no proporcionado');
          setLoading(false);
          return;
        }

        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const parsedId = parseInt(productId, 10);
        if (isNaN(parsedId)) {
          setError('ID de producto inválido');
          setLoading(false);
          return;
        }
        
        const foundProduct = mockProducts.find(p => p.id === parsedId);
        
        if (!foundProduct) {
          setError('Producto no encontrado');
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, loading, error };
};

export const getCategories = () => {
  const categories = [...new Set(mockProducts.map(p => p.category))];
  return categories.sort();
};

