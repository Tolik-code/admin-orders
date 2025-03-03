import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, fetchOrder, updateOrderStatus, fetchProducts } from '../api';
import { Order, OrderStatus, OrderWithProducts } from '../types';

export const useOrders = (status?: OrderStatus) => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    select: (data) => {
      if (status) {
        return data.filter(order => order.status === status);
      }
      return data;
    }
  });
};

export const useOrder = (id: string) => {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
  });

  const productsQuery = useQuery({
    queryKey: ['orderProducts', id],
    queryFn: async () => {
      if (!orderQuery.data) return [];
      const productIds = orderQuery.data.products.map(item => item.productId);
      return fetchProducts(productIds);
    },
    enabled: !!orderQuery.data,
  });

  const orderWithProducts: OrderWithProducts | undefined = orderQuery.data
    ? {
        ...orderQuery.data,
        productDetails: productsQuery.data,
      }
    : undefined;

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: OrderStatus }) => 
      updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(['order', id], updatedOrder);
      
      // Update the order in the orders list
      queryClient.setQueryData<Order[]>(['orders'], (oldOrders) => {
        if (!oldOrders) return [];
        return oldOrders.map(order => 
          order.id === Number(id) ? { ...order, status: updatedOrder.status } : order
        );
      });
    },
  });

  return {
    order: orderWithProducts,
    isLoading: orderQuery.isLoading || productsQuery.isLoading,
    isError: orderQuery.isError || productsQuery.isError,
    error: orderQuery.error || productsQuery.error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};