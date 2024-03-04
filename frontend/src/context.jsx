import React from 'react';
import { createContext, useReducer, useContext } from 'react';

 
const initialState = {
  cart: [],
};
 
const cartActions = {
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
};
 
const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case cartActions.UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case cartActions.REMOVE_ITEM:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    case cartActions.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};
 
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
 
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

