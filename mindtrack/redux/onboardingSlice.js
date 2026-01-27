import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: [],
  lifestyle: {
    sleepHours: null,
    exercise: null,
    stress: null,
    water: null,
  },
  suggestedHabits: [],
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setGoals(state, action) {
      state.goals = action.payload;
    },
    setLifestyle(state, action) {
      state.lifestyle = action.payload;
    },
    setSuggestedHabits(state, action) {
      state.suggestedHabits = action.payload;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const {
  setGoals,
  setLifestyle,
  setSuggestedHabits,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
