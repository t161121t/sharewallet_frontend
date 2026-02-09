import ShareWalletLogo from "./ShareWalletLogo";

type LogoProps = {
  /** アイコン部分のサイズ (px) */
  size?: number;
  /** "ShareWallet" テキストを表示するか */
  showText?: boolean;
  /** スクリプト体の "Share Wallet" テキストを表示するか */
  showScriptText?: boolean;
};

export default function Logo({
  size = 120,
  showText = false,
  showScriptText = true,
}: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <ShareWalletLogo size={size} showText={showText} />
      {showScriptText && (
        <p
          className="text-5xl tracking-wide text-[#2d2a26] dark:text-[#eae7e1]"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}
        >
          Share Wallet
        </p>
      )}
    </div>
  );
}
