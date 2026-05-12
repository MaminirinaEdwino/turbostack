import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    actualWindow: 'Dashboard', // La fenêtre par défaut au démarrage de l'application
    actualProject: ""
  },
  reducers: {
    setActualWindow: (state, action) => {
      state.actualWindow = action.payload;
    },
    setActualProject: (state, action) => {
      state.actualProject = action.payload;
    },
  },
});

export const { setActualWindow, setActualProject } = appSlice.actions;
export default appSlice.reducer;