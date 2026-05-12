import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer, // Ajoutez votre reducer ici
    // Vous pouvez ajouter d'autres reducers ici si nécessaire
  },
});