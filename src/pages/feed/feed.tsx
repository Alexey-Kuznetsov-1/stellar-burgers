import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import { RootState } from '../../services/store';
import { wsConnect, wsDisconnect } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    dispatch(wsConnect('wss://norma.education-services.ru/orders/all'));

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    // Переподключаемся к WebSocket для обновления данных
    dispatch(wsDisconnect());
    setTimeout(() => {
      dispatch(wsConnect('wss://norma.education-services.ru/orders/all'));
    }, 100);
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
