import { createSlice } from '@reduxjs/toolkit';

const lastProject = localStorage.getItem('turbostack_project') || "";
const lastWindow = localStorage.getItem('turbostack_window') || 'Dashboard';
const lastDarkMode = localStorage.getItem('turbostack_darkMode') === 'true';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    actualWindow: lastWindow,
    actualProject: lastProject,
    toggleMenuSide: false,
    darkMode: lastDarkMode,
  },
  reducers: {
    setActualWindow: (state, action) => {
      state.actualWindow = action.payload;
      localStorage.setItem('turbostack_window', action.payload);
    },
    setActualProject: (state, action) => {
      state.actualProject = action.payload;
      localStorage.setItem('turbostack_project', action.payload);
    },
    setToggleMenuSide: (state) => {
      state.toggleMenuSide = !state.toggleMenuSide;
    },
    setToggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('turbostack_darkMode', state.darkMode);
    }
  },
});

export const { setActualWindow, setActualProject, setToggleMenuSide, setToggleDarkMode } = appSlice.actions;
export default appSlice.reducer;