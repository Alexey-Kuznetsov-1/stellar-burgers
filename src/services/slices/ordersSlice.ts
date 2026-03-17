import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

const initialState: OrdersState = {
  orders: [],
  loading: true,
  error: null,
  isConnected: false
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    wsConnect: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.isConnected = false;
    },
    wsOpen: (state) => {
      state.isConnected = true;
      state.loading = false;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isConnected = false;
    },
    wsMessage: (state, action) => {
      state.orders = action.payload.orders;
      state.loading = false;
    }
  }
});

export const { wsConnect, wsDisconnect, wsOpen, wsClose, wsError, wsMessage } =
  ordersSlice.actions;

export default ordersSlice.reducer;
