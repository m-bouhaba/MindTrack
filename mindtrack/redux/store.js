import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./onboardingSlice";

const loadState = () => {
  if (typeof window === "undefined") return undefined;

  try {
    const serializedState = localStorage.getItem("onboarding");
    if (!serializedState) return undefined;
    return { onboarding: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
  preloadedState: loadState(),
});

// 🔐 Sauvegarde automatique
if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("onboarding", JSON.stringify(state.onboarding));
  });
}