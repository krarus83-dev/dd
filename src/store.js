import { configureStore, createSlice } from '@reduxjs/toolkit';

// Read the previous React demo's saved cart and language when available.
function readStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
const savedLanguage = readStored('react-market-lang', 'ru');
const savedCart = readStored('react-market-cart', {});
const localeSlice = createSlice({
  name: 'locale',
  initialState: { language: ['ru', 'uz', 'en'].includes(savedLanguage) ? savedLanguage : 'ru' },
  reducers: { setLanguage(state, action) { if (['ru', 'uz', 'en'].includes(action.payload)) state.language = action.payload; } },
});
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: savedCart && typeof savedCart === 'object' && !Array.isArray(savedCart) ? savedCart : {} },
  reducers: {
    changeQuantity(state, action) {
      const { id, delta } = action.payload;
      const quantity = (state.items[id] || 0) + delta;
      if (quantity <= 0) delete state.items[id]; else state.items[id] = quantity;
    },
    removeItem(state, action) { delete state.items[action.payload]; },
  },
});
export const { setLanguage } = localeSlice.actions;
export const { changeQuantity, removeItem } = cartSlice.actions;
export const store = configureStore({ reducer: { locale: localeSlice.reducer, cart: cartSlice.reducer } });
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('react-market-lang', JSON.stringify(state.locale.language));
    localStorage.setItem('react-market-cart', JSON.stringify(state.cart.items));
  } catch { /* The store remains usable if browser storage is unavailable. */ }
});
