import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    actualWindow: 'Dashboard', // La fenêtre par défaut au démarrage de l'application
    actualProject: "",
    toggleMenuSide: false,
  },
  reducers: {
    setActualWindow: (state, action) => {
      state.actualWindow = action.payload;
    },
    setActualProject: (state, action) => {
      state.actualProject = action.payload;
    },
    setToggleMenuSide: (state) => {
      state.toggleMenuSide = !state.toggleMenuSide;
    },
  },
});

export const { setActualWindow, setActualProject, setToggleMenuSide } = appSlice.actions;
export default appSlice.reducer;