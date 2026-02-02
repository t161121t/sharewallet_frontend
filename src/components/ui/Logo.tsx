import Image from "next/image";

type LogoProps = {
  iconSize?: number;
  showTextLogo?: boolean;
};

const DEFAULT_ICON_SIZE = 180;
const TEXT_LOGO_WIDTH = 260;
const TEXT_LOGO_HEIGHT = 80;

export default function Logo({
  iconSize = DEFAULT_ICON_SIZE,
  showTextLogo = true,
}: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-4 border-0 outline-none">
      <Image
        src="/sharewallet-logo.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="object-contain border-0 outline-none ring-0 shadow-none"
        priority
      />
      {showTextLogo && (
        <Image
          src="/sharewallet.png"
          alt="Share Wallet"
          width={TEXT_LOGO_WIDTH}
          height={TEXT_LOGO_HEIGHT}
          className="object-contain border-0 outline-none ring-0 shadow-none"
          priority
        />
      )}
    </div>
  );
}
