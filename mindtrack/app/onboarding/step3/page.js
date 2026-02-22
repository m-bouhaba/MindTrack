"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setSuggestedHabits } from "@/redux/onboardingSlice";
import { Plus, X } from "lucide-react";

export default function OnboardingHabits() {
  const router = useRouter();
  const dispatch = useDispatch();

  const goals = useSelector((state) => state.onboarding.goals);
  const lifestyle = useSelector((state) => state.onboarding.lifestyle);
  const habitsFromRedux = useSelector(
    (state) => state.onboarding.suggestedHabits,
  );

  const generateSuggestedHabits = () => {
    const suggestions = [];

    if (
      goals.improveSleep ||
      lifestyle.sleepHours === "Less than 5" ||
      lifestyle.sleepHours === "5-6 hours"
    ) {
      suggestions.push({
        id: "1",
        name: "Sleep 7-8 hours",
        description: "Get quality rest for better health",
        frequency: "Daily",
        icon: "💤",
        enabled: true,
      });
    }

    if (
      goals.improveHealth ||
      lifestyle.exercise === "Never" ||
      lifestyle.exercise === "Sometimes"
    ) {
      suggestions.push({
        id: "2",
        name: "Exercise 30 minutes",
        description: "Move your body and stay active",
        frequency: "Daily",
        icon: "🏃‍♀️",
        enabled: true,
      });
    }

    if (
      goals.reduceStress ||
      lifestyle.stress === "Often" ||
      lifestyle.stress === "Very often"
    ) {
      suggestions.push({
        id: "3",
        name: "Morning meditation",
        description: "Start your day with mindfulness",
        frequency: "Daily",
        icon: "🧘",
        enabled: true,
      });
    }

    if (lifestyle.water === "No" || lifestyle.water === "Sometimes") {
      suggestions.push({
        id: "4",
        name: "Drink 8 glasses of water",
        description: "Stay hydrated throughout the day",
        frequency: "Daily",
        icon: "💧",
        enabled: true,
      });
    }

    if (goals.beProductive) {
      suggestions.push({
        id: "5",
        name: "Plan tomorrow today",
        description: "Review goals and prepare for success",
        frequency: "Daily",
        icon: "📝",
        enabled: true,
      });
    }

    suggestions.push({
      id: "6",
      name: "Read 15 minutes",
      description: "Expand your knowledge and relax",
      frequency: "Daily",
      icon: "📚",
      enabled: true,
    });

    return suggestions.slice(0, 5);
  };

  const [habits, setLocalHabits] = useState(
    habitsFromRedux && habitsFromRedux.length > 0
      ? habitsFromRedux
      : generateSuggestedHabits(),
  );

  const [customHabit, setCustomHabit] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = (id) => {
    setLocalHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)),
    );
  };

  const handleRemove = (id) => {
    setLocalHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleAddCustom = () => {
    if (customHabit.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: customHabit,
        description: "Custom habit",
        frequency: "Daily",
        icon: "✨",
        enabled: true,
      };
      setLocalHabits((prev) => [...prev, newHabit]);
      setCustomHabit("");
      setShowAddForm(false);
    }
  };

  // 🚀 Ici, on va vers le Step 4 Mood au lieu du dashboard
  const handleNext = () => {
    const enabledHabits = habits.filter((h) => h.enabled);
    dispatch(setSuggestedHabits(enabledHabits));
    router.push("/onboarding/step4"); // <-- nouvelle étape Mood
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl"
      >
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <h2 className="text-center mb-2">Suggested habits for you</h2>
          <p className="text-center text-gray-600">
            Toggle on/off or add your own
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                habit.enabled
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggle(habit.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    habit.enabled
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {habit.enabled && <div className="text-white text-xs">✓</div>}
                </button>
                <span className="text-2xl">{habit.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-gray-600">
                    {habit.description}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(habit.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <Plus className="w-5 h-5" />
            Add custom habit
          </button>
        ) : (
          <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50">
            <input
              type="text"
              value={customHabit}
              onChange={(e) => setCustomHabit(e.target.value)}
              placeholder="Enter habit name..."
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustom}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/onboarding/step2")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
