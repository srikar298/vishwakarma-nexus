"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxW?: string;
  className?: string;
  showCloseButton?: boolean;
}

export const BaseModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  maxW = "max-w-md",
  className = "",
  showCloseButton = true
}: BaseModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock scroll & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      
      // Auto-focus first focusable element or modal itself
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }

      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Focus Trap Logic
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onKeyDown={handleTabKey}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-md cursor-pointer"
          />
          
          {/* Modal Content Wrapper - This catches clicks that are inside the scroll area but outside the modal */}
          <div 
            className="relative min-h-full w-full flex items-center justify-center pointer-events-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div 
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className={`relative bg-white w-full ${maxW} rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100 z-10 pointer-events-auto ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Rendered AFTER children to ensure top-level stacking if z-index is equal */}
              {children}

              {showCloseButton && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-100 active:scale-90 transition-all z-[60] bg-stone-50 rounded-full border border-stone-100 shadow-sm cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Close"
                >
                  <X size={20} className="pointer-events-none" />
                </button>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
