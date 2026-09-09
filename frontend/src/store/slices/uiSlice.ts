import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  sessionExpiredModalOpen: boolean;
  globalSearchOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  sessionExpiredModalOpen: false,
  globalSearchOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileDrawer: (state) => {
      state.mobileDrawerOpen = !state.mobileDrawerOpen;
    },
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileDrawerOpen = action.payload;
    },
    setSessionExpiredModalOpen: (state, action: PayloadAction<boolean>) => {
      state.sessionExpiredModalOpen = action.payload;
    },
    setGlobalSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.globalSearchOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileDrawer,
  setMobileDrawerOpen,
  setSessionExpiredModalOpen,
  setGlobalSearchOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
