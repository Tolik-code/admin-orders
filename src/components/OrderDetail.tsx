import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { OrderStatus } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import Spinner from './Spinner';
import Skeleton from './Skeleton';

const schema = z.object({
  status: z.enum(['pending', 'paid', 'shipped'] as const),
});

type FormValues = z.infer<typeof schema>;

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isLoading, isError, error, updateStatus, isUpdating } = useOrder(id || '');

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: order?.status || 'pending',
    },
    values: {
      status: order?.status || 'pending',
    },
  });

  const onSubmit = (data: FormValues) => {
    updateStatus({ status: data.status });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{(error as Error).message || 'Failed to load order'}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        {isLoading ? (
          // Skeleton loading state for order details
          <div>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="bg-gray-50 p-4 rounded-md">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="bg-gray-50 p-4 rounded-md">
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="bg-gray-50 rounded-md p-4">
                <Skeleton className="h-10 w-full mb-4" />
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <Skeleton className="h-10 w-10 mr-3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : order ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Information</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">User ID:</span> {order.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total Items:</span> {order.products.length}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Update Status</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      {...register('status')}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {isUpdating ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Products</h2>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.products.map((item, index) => {
                      const product = order.productDetails?.find(p => p.id === item.productId);
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product ? (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="h-10 w-10 object-contain mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                  <Spinner size="sm" />
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {product ? product.title : (
                                  <Skeleton className="h-4 w-40" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product ? (
                              `$${product.price.toFixed(2)}`
                            ) : (
                              <Skeleton className="h-4 w-16" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product ? (
                              `$${(product.price * item.quantity).toFixed(2)}`
                            ) : (
                              <Skeleton className="h-4 w-16" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.productDetails ? (
                          `$${order.products.reduce((total, item) => {
                            const product = order.productDetails?.find(p => p.id === item.productId);
                            return total + (product ? product.price * item.quantity : 0);
                          }, 0).toFixed(2)}`
                        ) : (
                          <Skeleton className="h-4 w-20" />
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Order not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;