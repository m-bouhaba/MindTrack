"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const completed = useSelector((state) => state.onboarding.completed);

  useEffect(() => {
    if (!completed) {
      router.replace("/signup");
    }
  }, [completed, router]);

  if (!completed) return null;

  return <>{children}</>;
}
