import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => useAppSelector(state => state.auth);
export const useCart = () => useAppSelector(state => state.cart);
export const useProducts = () => useAppSelector(state => state.products);
export const useOrders = () => useAppSelector(state => state.orders);