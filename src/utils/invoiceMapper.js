/**
 * Maps API invoice response to the structure expected by InvoiceCard/InvoiceDetail
 */

const mapApiStatusToComponent = (apiInvoice) => {
  const apiStatus = String(apiInvoice.invoice_status || '').toLowerCase();
  if (apiStatus === 'cancelada') return 'canceled';
  const remaining = Number(apiInvoice.remaining_payment) || 0;
  const total = Number(apiInvoice.total) || 0;
  const totalPaid = total - remaining;
  if (remaining <= 0) return 'paid';
  if (totalPaid > 0) return 'partial';
  return 'pending';
};

/**
 * @param {object} apiInvoice - Raw invoice from API
 * @returns {object} - Invoice structure for UI components
 */
export const mapApiInvoiceToComponent = (apiInvoice) => {
  const total = Number(apiInvoice.total) || 0;
  const remainingPayment = Number(apiInvoice.remaining_payment) || 0;
  const totalPaid = total - remainingPayment;
  const amountPayment = Number(apiInvoice.amount_payment) || 0;
  const missingPayments = Number(apiInvoice.missing_payments) || 0;
  const createdAt = apiInvoice.created_at ? new Date(apiInvoice.created_at.replace(' ', 'T')) : new Date();

  const paidCount = amountPayment > 0 ? Math.floor(totalPaid / amountPayment) : 0;
  const totalPayments = Math.max(paidCount + missingPayments, 1);
  const pendingAmountPerPayment = missingPayments > 0 ? Math.round(remainingPayment / missingPayments) : 0;

  const monthlyPayments = [];
  for (let i = 1; i <= totalPayments; i++) {
    const isPaid = i <= paidCount;
    const dueDate = new Date(createdAt);
    dueDate.setDate(dueDate.getDate() + 30 * i);
    const amount = isPaid ? amountPayment : pendingAmountPerPayment || amountPayment;
    monthlyPayments.push({
      month: i,
      amount,
      dueDate,
      status: isPaid ? 'paid' : 'pending',
      paidDate: isPaid ? dueDate : null,
    });
  }

  const initialPayment = {
    amount: amountPayment,
    date: createdAt,
    status: paidCount > 0 ? 'paid' : 'pending',
    paidDate: paidCount > 0 ? createdAt : null,
  };

  const unitPrice = apiInvoice.product_quantity > 0
    ? Math.round(total / apiInvoice.product_quantity)
    : total;

  return {
    id: String(apiInvoice.invoice_id),
    invoiceNumber: apiInvoice.folio_invoice || `F${apiInvoice.invoice_id}`,
    orderId: String(apiInvoice.invoice_id),
    date: createdAt,
    total,
    status: mapApiStatusToComponent(apiInvoice),
    items: [
      {
        id: apiInvoice.invoice_id,
        name: apiInvoice.product_name || 'Producto',
        price: unitPrice,
        quantity: apiInvoice.product_quantity || 1,
        image: apiInvoice.variant_image_url || null,
      },
    ],
    paymentSchedule: {
      initialPayment,
      monthlyPayments,
    },
    totalPaid,
    totalPending: remainingPayment,
  };
};
