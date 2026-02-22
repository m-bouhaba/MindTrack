import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./onboardingSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
});

// 🔐 Sauvegarde automatique
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("onboarding", JSON.stringify(state.onboarding));
});
