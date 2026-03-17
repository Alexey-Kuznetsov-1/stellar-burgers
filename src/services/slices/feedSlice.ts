import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: true,
  error: null,
  isConnected: false
};

const feedSlice = createSlice({
  name: 'feed',
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
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false;
    }
  }
});

export const { wsConnect, wsDisconnect, wsOpen, wsClose, wsError, wsMessage } =
  feedSlice.actions;

export default feedSlice.reducer;
