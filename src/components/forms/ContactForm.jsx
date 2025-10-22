import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      userType: '',
      message: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 mt-28 xl:mt-48 lg:mt-32">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          Escríbenos directamente
        </h2>
        <p className="text-lg md:text-xl text-white opacity-90 leading-relaxed">
          Completa el siguiente formulario y uno de nuestros asesores te responderá en menos de 24 horas hábiles.
        </p>
      </div>

      {/* Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre completo */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Tu nombre completo"
            />
          </div>
          
          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+52 55 1234 5678"
            />
          </div>
          
          {/* Soy: Usuario / Proveedor / Otro */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              Soy: *
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Selecciona una opción</option>
              <option value="usuario">Usuario</option>
              <option value="proveedor">Proveedor</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="input-field"
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
        </div>

        {/* Botón de envío */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Enviar mensaje
        </motion.button>

        {/* Microcopy */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Tu información será tratada de forma confidencial conforme a nuestro{' '}
          <a 
            href="/aviso-de-privacidad" 
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Aviso de Privacidad
          </a>
          .
        </p>
      </motion.form>
    </div>
  );
};

export { ContactForm };
