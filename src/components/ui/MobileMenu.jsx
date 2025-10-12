"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileMenu({ trigger, children, widthClass = "w-80" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const pathname = usePathname();

  // Mount portal safely on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock + inert handling
  useEffect(() => {
    const body = document.body;
    const appRoot = document.getElementById("__next");

    if (open) {
      body.style.overflow = "hidden";
      appRoot?.setAttribute("inert", "true");
    } else {
      body.style.overflow = "";
      appRoot?.removeAttribute("inert");
    }

    return () => {
      body.style.overflow = "";
      appRoot?.removeAttribute("inert");
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;

    const panel = panelRef.current;
    const focusable =
      panel.querySelectorAll <
      HTMLElement >
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    if (focusable.length > 0) {
      lastFocusedRef.current = document.activeElement;
      focusable[0].focus();
    }

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const items =
        panel.querySelectorAll <
        HTMLElement >
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      lastFocusedRef.current?.focus();
    };
  }, [open]);

  // Close when any <a> or [data-sheet-close] inside panel is clicked
  useEffect(() => {
    if (!panelRef.current) return;
    const panel = panelRef.current;

    const onClick = (e) => {
      const target = e.target;
      if (!target) return;
      if (target.closest("a") || target.closest("[data-sheet-close]")) {
        setOpen(false);
      }
    };

    panel.addEventListener("click", onClick);
    return () => panel.removeEventListener("click", onClick);
  }, [panelRef.current]);

  const renderTrigger = (node) => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        ref: (instance) => {
          triggerRef.current = instance || null;
        },
        onClick: (e) => {
          setOpen(true);
          node.props.onClick?.(e);
        },
        "aria-expanded": open,
        "aria-controls": "site-sheet",
      });
    }

    return (
      <button
        ref={(r) => (triggerRef.current = r)}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-sheet"
        className="inline-flex items-center justify-center"
      >
        {node}
      </button>
    );
  };

  const sheet = (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[1000] bg-black/30 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <div
        id="site-sheet"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 z-[1001] h-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          widthClass,
          open ? "translate-x-0" : "translate-x-[110%]",
        )}
      >
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-gray-600 hover:text-gray-900"
          >
            <X />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-3rem)]">
          {children}
        </div>
      </div>
    </>
  );

  return (
    <>
      {renderTrigger(trigger)}
      {mounted && createPortal(sheet, document.body)}
    </>
  );
}
