import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const orderNumber = number ? parseInt(number) : 0;

  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.orders.orders);
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );
  const ordersLoading = useSelector((state: RootState) => state.orders.loading);

  // Ищем заказ в существующих данных
  const order = useMemo(
    () =>
      [...feedOrders, ...profileOrders].find(
        (item) => item.number === orderNumber
      ),
    [feedOrders, profileOrders, orderNumber]
  );

  // Если заказ не найден, загружаем его по API
  useEffect(() => {
    if (!order && orderNumber > 0 && !ordersLoading) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [order, orderNumber, ordersLoading, dispatch]);

  const orderInfo = useMemo(() => {
    // Используем order или ищем в profileOrders после загрузки
    const targetOrder =
      order || profileOrders.find((item) => item.number === orderNumber);

    if (!targetOrder || !ingredients.length) return null;

    const date = new Date(targetOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = targetOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...targetOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [order, profileOrders, orderNumber, ingredients]);

  if (!orderInfo || ordersLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
