"use client";

import dynamic from "next/dynamic";

const AccessibilityWidget = dynamic(
  () => import("./AccessibilityWidget"),
  { ssr: false }
);

export default function AccessibilityMount() {
  return <AccessibilityWidget />;
}
