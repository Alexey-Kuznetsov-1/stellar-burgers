import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer, {
  wsConnect as feedConnect,
  wsDisconnect as feedDisconnect,
  wsOpen as feedWsOpen,
  wsClose as feedWsClose,
  wsError as feedWsError,
  wsMessage as feedWsMessage
} from './slices/feedSlice';
import ordersReducer, {
  wsConnect as ordersConnect,
  wsDisconnect as ordersDisconnect,
  wsOpen as ordersWsOpen,
  wsClose as ordersWsClose,
  wsError as ordersWsError,
  wsMessage as ordersWsMessage
} from './slices/ordersSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

const feedActions = {
  connect: feedConnect.type,
  disconnect: feedDisconnect.type,
  onOpen: feedWsOpen.type,
  onClose: feedWsClose.type,
  onError: feedWsError.type,
  onMessage: feedWsMessage.type
};

const ordersActions = {
  connect: ordersConnect.type,
  disconnect: ordersDisconnect.type,
  onOpen: ordersWsOpen.type,
  onClose: ordersWsClose.type,
  onError: ordersWsError.type,
  onMessage: ordersWsMessage.type
};

const feedMiddleware = socketMiddleware(feedActions);
const ordersMiddleware = socketMiddleware(ordersActions);

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    user: userReducer,
    order: orderReducer,
    feed: feedReducer,
    orders: ordersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
