"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ShareWalletLogo from "@/components/ui/ShareWalletLogo";

export default function SplashPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setShow(false), 2000);
    const navTimer = setTimeout(() => router.push("/home"), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(180deg, #f5d678 0%, #e8c547 35%, #c9a227 65%, #9a7b1a 100%)",
      }}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ShareWalletLogo size={160} showText={false} />
            <p
              className="text-4xl text-white drop-shadow-md"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}
            >
              Share Wallet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
