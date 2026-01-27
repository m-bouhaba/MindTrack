import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: null,
  lifestyle: null,
  suggestedHabits: [],
  mood: null,
  isCompleted: false, // 👈 clé importante
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
    setMood(state, action) {
      state.mood = action.payload;
    },
    completeOnboarding(state) {
      state.isCompleted = true;
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
  setMood,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
