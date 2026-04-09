/**
 * Reparte el total a diferir en cuotas enteras: los primeros (meses − 1) pagos iguales
 * y el último absorbe el residuo para que la suma coincida exactamente con el total.
 * @param {number} deferredAmount
 * @param {number} months
 * @returns {{
 *   baseInstallment: number,
 *   lastInstallment: number,
 *   equalInstallmentMonths: number,
 *   hasUnequalLastPayment: boolean,
 *   totalMonths: number,
 *   totalDeferred: number
 * }}
 */
export const splitDeferredIntoInstallments = (deferredAmount, months) => {
  const totalDeferred = Math.round(Number(deferredAmount)) || 0;
  const totalMonths = Math.max(0, Math.floor(Number(months)) || 0);

  if (totalMonths <= 0) {
    return {
      baseInstallment: 0,
      lastInstallment: 0,
      equalInstallmentMonths: 0,
      hasUnequalLastPayment: false,
      totalMonths: 0,
      totalDeferred,
    };
  }

  if (totalMonths === 1) {
    return {
      baseInstallment: totalDeferred,
      lastInstallment: totalDeferred,
      equalInstallmentMonths: 1,
      hasUnequalLastPayment: false,
      totalMonths: 1,
      totalDeferred,
    };
  }

  const baseInstallment = Math.floor(totalDeferred / totalMonths);
  const lastInstallment = totalDeferred - baseInstallment * (totalMonths - 1);
  const equalInstallmentMonths = totalMonths - 1;

  return {
    baseInstallment,
    lastInstallment,
    equalInstallmentMonths,
    hasUnequalLastPayment: lastInstallment !== baseInstallment,
    totalMonths,
    totalDeferred,
  };
};
