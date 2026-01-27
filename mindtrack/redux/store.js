import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './onboardingSlice';

// Charger depuis localStorage
const loadState = () => {
  try {
    const serialized = localStorage.getItem('onboarding');
    return serialized ? { onboarding: JSON.parse(serialized) } : undefined;
  } catch {
    return undefined;
  }
};

// Sauvegarder dans localStorage
const saveState = (state) => {
  try {
    localStorage.setItem('onboarding', JSON.stringify(state.onboarding));
  } catch {}
};

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
  preloadedState: typeof window !== 'undefined' ? loadState() : undefined,
});

store.subscribe(() => {
  saveState(store.getState());
});
