import React from 'react';
import { formatPrice, formatDate } from '../../utils/creditUtils';
import {
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';

const OrderDetailView = ({ order }) => {
  const products = order?.products ?? [];
  const shipping = order?.shipping_info ?? {};

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Productos</h4>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.order_detail_id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.variant_image_url ? (
                  <img
                    src={product.variant_image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Imagen</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.product_name}</p>
                <p className="text-sm text-gray-600">
                  Cantidad: {product.product_quantity}
                  {product.product_condition && (
                    <> · {product.product_condition}</>
                  )}
                </p>
                {product.status && (
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {product.status}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatPrice(product.price)} × {product.product_quantity}
                </p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(product.total ?? product.price * product.product_quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {shipping.delivery_address && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineTruck className="w-4 h-4" />
            Información de envío
          </h4>
          <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
            {shipping.name_received && (
              <div className="flex items-start gap-3">
                <HiOutlineUser className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Recibe</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping.name_received}
                  </p>
                </div>
              </div>
            )}
            {shipping.phone_received && (
              <div className="flex items-start gap-3">
                <HiOutlinePhone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping.phone_received}
                  </p>
                </div>
              </div>
            )}
            {shipping.delivery_address && (
              <div className="flex items-start gap-3">
                <HiOutlineMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm font-medium text-gray-900">
                    {shipping.delivery_address}
                  </p>
                  {shipping.delivery_references && (
                    <p className="text-xs text-gray-600 mt-1">
                      Referencias: {shipping.delivery_references}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600">Total del pedido</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(order?.total ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
