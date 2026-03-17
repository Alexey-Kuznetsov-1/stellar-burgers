import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { RootState } from '../../services/store';
import { wsConnect, wsDisconnect } from '../../services/slices/ordersSlice';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    const token = getCookie('accessToken')?.replace('Bearer ', '');
    if (token) {
      dispatch(
        wsConnect(`wss://norma.education-services.ru/orders?token=${token}`)
      );
    }

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
