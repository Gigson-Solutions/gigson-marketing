'use client';

import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

const getBoxClass = (outlined?: boolean) =>
  outlined
    ? 'text-purple-accents border border-purple-accents transition duration-200 ease-linear hover:bg-[#e3e1ee] hover:text-purple-accents'
    : 'text-white bg-purple-accents';

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  text: string;
  link: string;
  outlined?: boolean;
};

const ButtonLink = ({ text, link, outlined, className, ...rest }: ButtonLinkProps) => {
  const boxClass = getBoxClass(outlined);
  return (
    <NextLink
      href={link}
      className={`${boxClass} text-center text-button rounded-full py-3 px-6 hover:opacity-80 ${className ?? ''}`}
      {...rest}
    >
      {text}
    </NextLink>
  );
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  name?: string;
  outlined?: boolean;
  classStyle?: string;
};

const Button = ({ text, name, onClick, outlined, className, classStyle, ...rest }: ButtonProps) => {
  const label = text ?? name ?? '';
  const boxClass = getBoxClass(outlined);
  return (
    <button
      onClick={onClick}
      className={`${boxClass} text-center cursor-pointer text-button rounded-full py-3 px-6 hover:opacity-80 ${className ?? ''} ${classStyle ?? ''}`}
      {...rest}
    >
      {label}
    </button>
  );
};

export { Button, ButtonLink };
export default Button;
