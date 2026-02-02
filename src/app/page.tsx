"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/home"), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(180deg, #F7DC6F 0%, #E8C547 40%, #D4AF37 70%, #B8860B 100%)",
      }}
    >
      <Image
        src="/sharewallet.png"
        alt="Share Wallet"
        width={220}
        height={60}
        className="object-contain w-[220px] h-auto"
        priority
      />
    </div>
  );
}
