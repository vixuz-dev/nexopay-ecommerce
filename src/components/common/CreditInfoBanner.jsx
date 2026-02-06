import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineInformationCircle, HiOutlineArrowRight } from 'react-icons/hi2';
import { ROUTES } from '../../utils/routes';
import useCreditLineStatusStore from '../../stores/creditLineStatusStore';

const CreditInfoBanner = () => {
  const [loading, setLoading] = useState(true);
  const showButton = useCreditLineStatusStore((state) => state.showButton);
  const fetchCreditLineStatus = useCreditLineStatusStore((state) => state.fetchCreditLineStatus);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        await fetchCreditLineStatus();
      } catch {
        if (!cancelled) setLoading(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [fetchCreditLineStatus]);

  if (loading || showButton !== 1) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-primary-50 border-b border-primary-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex items-start gap-2 md:gap-3 flex-1">
            <HiOutlineInformationCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm lg:text-base text-gray-800 leading-relaxed">
              <span className="font-semibold">Solicita tu línea de crédito</span> para comenzar a comprar productos con pago a plazos
            </p>
          </div>
          <Link
            to={ROUTES.REQUEST_CREDIT}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 w-full md:w-auto"
          >
            Solicitar ahora
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreditInfoBanner;

