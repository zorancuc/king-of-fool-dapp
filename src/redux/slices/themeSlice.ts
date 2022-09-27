import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ThemeState {
  isDark: boolean
}

const initialState = {
  isDark: false
} as ThemeState

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
    }
  }
})

export const { toggleTheme } = themeSlice.actions

export const selectIsDark = (state: RootState) => state.theme.isDark

export default themeSlice.reducer
