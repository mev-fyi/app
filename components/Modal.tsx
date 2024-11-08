// components/Modal.tsx
'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={modalRef}
        aria-modal="true"
        role="dialog"
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close Modal">×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
