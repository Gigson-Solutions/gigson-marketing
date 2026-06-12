'use client';

import NextLink from 'next/link';

const PrimarySvg = () => (
  <svg className="!block" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 9H12.001M12.001 1L17.7634 9L12.001 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OutlinedSvg = ({ color }: { color?: string }) => (
  <svg className="!block" width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="40" height="38" rx="19" stroke={color} strokeWidth="2" />
    <path d="M13 20L29 20M29 20L23 14M29 20L23 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getBoxClass = (outlined?: boolean) => (outlined ? '' : 'bg-purple-accents');

type LinkProps = { href: string; outlined?: boolean; outlinedColor?: string };
type ButtonProps = { onClick: () => void; outlined?: boolean; outlinedColor?: string };

export const ButtonIconLink = ({ href, outlined, outlinedColor }: LinkProps) => {
  const icon = outlined ? <OutlinedSvg color={outlinedColor} /> : <PrimarySvg />;
  return (
    <NextLink href={href} className={`${getBoxClass(outlined)} rounded-full p-3 hover:opacity-80`}>
      {icon}
    </NextLink>
  );
};

export const ButtonIcon = ({ onClick, outlined, outlinedColor }: ButtonProps) => {
  const icon = outlined ? <OutlinedSvg color={outlinedColor} /> : <PrimarySvg />;
  return (
    <span role="button" onClick={onClick} className={`${getBoxClass(outlined)} cursor-pointer rounded-full p-3 hover:opacity-80`}>
      {icon}
    </span>
  );
};
