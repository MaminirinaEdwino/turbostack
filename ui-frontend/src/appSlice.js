import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    actualWindow: 'Dashboard', // La fenêtre par défaut au démarrage de l'application
  },
  reducers: {
    setActualWindow: (state, action) => {
      state.actualWindow = action.payload;
    },
  },
});

export const { setActualWindow } = appSlice.actions;
export default appSlice.reducer;