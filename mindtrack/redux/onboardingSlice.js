import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goals: {},
  lifestyle: {
    sleepHours: null,
    exercise: null,
    stress: null,
    water: null,
  },
  suggestedHabits: [],
  mood: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    hydrateOnboarding(_, action) {
      return action.payload;
    },

    setGoals(state, action) {
      state.goals = action.payload;
    },

    setLifestyle(state, action) {
      state.lifestyle = action.payload;
    },

    setSuggestedHabits(state, action) {
      state.suggestedHabits = action.payload;
    },

    setMood(state, action) {
      state.mood = action.payload;
    },

    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  hydrateOnboarding,
  setGoals,
  setLifestyle,
  setSuggestedHabits,
  setMood,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;