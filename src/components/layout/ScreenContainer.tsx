import type { ReactNode } from "react";

export default function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <main className="w-full flex justify-center">
      <div className="w-[360px] min-h-[640px] bg-white rounded-2xl shadow-md px-6 py-10 flex flex-col">
        {children}
      </div>
    </main>
  );
}
