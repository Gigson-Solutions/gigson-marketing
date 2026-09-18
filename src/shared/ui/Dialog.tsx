'use client';

import './Dialog.css';

import { useEffect } from 'react';

type Props = {
  isOpen: boolean | object;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = { sm: 'max-w-xl', md: 'max-w-4xl', lg: 'max-w-7xl' };

const Dialog = ({ isOpen, onClose, children, size = 'lg' }: Props) => {
  useEffect(() => {
    // gs-dialog-open hides the floating chat launcher (Dialog.css), which
    // otherwise sits on top of the modal's action buttons on phones.
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'gs-dialog-open');
    } else {
      document.body.classList.remove('overflow-hidden', 'gs-dialog-open');
    }
    return () => document.body.classList.remove('overflow-hidden', 'gs-dialog-open');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      {/* Clipping shell: rounds and bounds the panel, and its p-2 keeps the
          inner scrollbar off the rounded edge. The scroller carries the rest
          of the padding, so total content inset matches the previous p-4. */}
      <div
        className={`relative flex bg-white rounded-lg lg:rounded-4xl shadow-lg w-full ${sizeClass[size]} max-h-[90vh] md:max-h-[80vh] md:m-8 p-2 overflow-hidden`}
      >
        <div className="gs-dialog-scroll w-full min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain p-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
