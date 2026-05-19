import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  setSelectedOrder,
} = orderSlice.actions;

export default orderSlice.reducer;