import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreDataProvider } from './context/StoreDataContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreDataProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </StoreDataProvider>
    </BrowserRouter>
  );
};

export default App;
