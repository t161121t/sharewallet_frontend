import type { ReactNode } from "react";

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh w-full bg-[#faf8f5] dark:bg-[#111110] flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 py-8">
        {children}
      </div>
    </main>
  );
}
