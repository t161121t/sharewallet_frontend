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
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* ロゴを白い円背景で囲んで金背景との視認性を確保 */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 260,
                height: 260,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              }}
            >
              <ShareWalletLogo size={220} showText={false} />
            </div>
            <p
              className="text-6xl text-white"
              style={{
                fontFamily: "var(--font-dancing-script), cursive",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.25)",
              }}
            >
              Share Wallet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
