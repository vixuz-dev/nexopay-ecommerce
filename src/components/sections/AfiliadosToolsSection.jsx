import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineComputerDesktop, 
  HiOutlineClipboardDocumentList, 
  HiOutlineChartBar, 
  HiOutlineBell
} from 'react-icons/hi2';

const AfiliadosToolsSection = () => {
  const tools = [
    {
      icon: HiOutlineComputerDesktop,
      title: "Panel web fácil de usar",
      description: "Gestiona tu negocio desde cualquier lugar con nuestra interfaz intuitiva."
    },
    {
      icon: HiOutlineClipboardDocumentList,
      title: "Control de inventarios y pedidos",
      description: "Mantén un registro completo de tus productos y ventas en tiempo real."
    },
    {
      icon: HiOutlineChartBar,
      title: "Reportes financieros automáticos",
      description: "Obtén insights valiosos sobre el rendimiento de tu negocio automáticamente."
    },
    {
      icon: HiOutlineBell,
      title: "Notificaciones en tiempo real",
      description: "Recibe alertas instantáneas sobre ventas, pagos y actualizaciones importantes."
    },
  ];

  return (
    <section className="relative w-full bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Título */}
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 mb-8 text-center"
          >
            Todo lo que necesitas para vender con confianza.
          </motion.h2>

          {/* Subtexto */}
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 text-center mb-16"
          >
            Nuestra plataforma fue creada para facilitarte la gestión de tu negocio y aumentar tus ingresos.
          </motion.p>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + (index * 0.2) }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center border border-gray-100"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary-600 mb-4">
                    {tool.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {tool.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfiliadosToolsSection;
