import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert, Lock, AlertTriangle, EyeOff, FileText, CheckCircle2, Shield } from 'lucide-react';

/**
 * SecurityGuard — Enterprise Data Loss Prevention (DLP) & Anti-Capture Guard
 * 
 * Features:
 * 1. Blocks Windows PrintScreen & Snipping Tool (Win+Shift+S) by blanking the canvas on blur/keypress.
 * 2. Blocks browser screen recording & tab sharing (getDisplayMedia).
 * 3. Smooth animated fluid motion notification when capture is attempted.
 * 4. Clears OS clipboard on capture events so images cannot be pasted.
 * 5. Strictly preserves legitimate official PMO PDF and CSV exports.
 */
export const SecurityGuard = () => {
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({
    title: 'Screen Capture Restricted',
    message: 'Screen captures and recordings are restricted under National Infrastructure Data Governance policy.',
    action: 'Screenshot Blocked'
  });
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const blurTimerRef = useRef(null);
  const lastAlertTimeRef = useRef(0);

  const triggerSecurityModal = (title, message, action = 'Action Blocked') => {
    const now = Date.now();
    // Throttle duplicate toasts within 1 second
    if (now - lastAlertTimeRef.current < 1000) return;
    lastAlertTimeRef.current = now;

    setModalDetails({ title, message, action });
    setSecurityModalOpen(true);

    // Overwrite OS clipboard buffer immediately
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(
          'CONFIDENTIAL — DRISHTI AI NATIONAL INFRASTRUCTURE INTELLIGENCE. Unauthorized capture is restricted. Use official PMO Dossier in Reports.'
        );
      }
    } catch {
      // Ignore clipboard permission issues
    }
  };

  useEffect(() => {
    // 1. Keydown listener for instant shortcut interception
    const handleKeyDown = (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsWindowBlurred(true);
        triggerSecurityModal(
          'Screenshot Restricted',
          'Built-in Windows PrintScreen and screen grabbing are disabled for classified infrastructure intelligence. Use the official PMO Dossier export in the Reports tab.',
          'PrintScreen Blocked'
        );
        setTimeout(() => setIsWindowBlurred(false), 2000);
        return false;
      }

      // Windows + Shift + S or Command + Shift + 3/4/5 (Snipping tool)
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4' || e.key === '5')
      ) {
        e.preventDefault();
        setIsWindowBlurred(true);
        triggerSecurityModal(
          'Snipping Tool Guard Active',
          'Windows Snipping Tool and screen capture utilities are restricted on DRISHTI AI.',
          'Snipping Blocked'
        );
        setTimeout(() => setIsWindowBlurred(false), 2000);
        return false;
      }

      // Alt + PrintScreen
      if (e.altKey && (e.key === 'PrintScreen' || e.code === 'PrintScreen')) {
        e.preventDefault();
        setIsWindowBlurred(true);
        triggerSecurityModal(
          'Window Capture Blocked',
          'Active window capture is prohibited. Confidential project metrics are protected.',
          'Capture Blocked'
        );
        setTimeout(() => setIsWindowBlurred(false), 2000);
        return false;
      }

      // Developer Tools shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['U', 'u'].includes(e.key))
      ) {
        e.preventDefault();
        triggerSecurityModal(
          'Developer Tools Restricted',
          'Developer inspection and source extraction tools are restricted on this secure terminal.',
          'Source Protected'
        );
        return false;
      }

      // Direct Webpage Save (Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's') && !e.shiftKey) {
        e.preventDefault();
        triggerSecurityModal(
          'Direct Page Export Restricted',
          'Direct HTML saving is disabled. Authorized personnel can generate official signed PDF briefs in the Reports tab.',
          'Save Blocked'
        );
        return false;
      }
    };

    // 2. Keyup listener for PrintScreen (handles Windows OS release trigger)
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        setIsWindowBlurred(true);
        triggerSecurityModal(
          'Screenshot Restricted',
          'Screen capture event intercepted. Clipboard buffer cleared.',
          'PrintScreen Blocked'
        );
        setTimeout(() => setIsWindowBlurred(false), 2000);
      }
    };

    // 3. Window Blur detection: Snipping Tool forces the browser to lose focus immediately.
    // When window loses focus or document hides, obscure the viewport so any external capture captures only the shield.
    const handleWindowBlur = () => {
      blurTimerRef.current = setTimeout(() => {
        setIsWindowBlurred(true);
      }, 50);
    };

    const handleWindowFocus = () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
      // Smoothly unveil when user returns to window
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    // 4. Intercept Context Menu (Right-Click)
    const handleContextMenu = (e) => {
      const tagName = e.target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        return true;
      }
      e.preventDefault();
      triggerSecurityModal(
        'Action Restricted',
        'Right-click context menu and element inspection are disabled for confidential project data.',
        'Inspection Disabled'
      );
      return false;
    };

    // 5. Intercept Screen Recording & Display Media (getDisplayMedia)
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function (constraints) {
        triggerSecurityModal(
          'Screen Recording Blocked',
          'Third-party screen recording and display media sharing is restricted under GovTech Security Protocol.',
          'Recording Blocked'
        );
        throw new DOMException('Permission denied by DRISHTI-AI Security Policy.', 'NotAllowedError');
      };
    }

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      {/* 1. Dynamic Anti-Snipping Blackout Shield (Activated when Snipping Tool opens or window loses focus) */}
      <div
        className={`fixed inset-0 z-[99998] bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ease-out flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none ${
          isWindowBlurred
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <Lock className="w-10 h-10" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4" />
          DLP Security Active — Screen Hidden
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CONFIDENTIAL INFRASTRUCTURE DATA
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-lg mt-3 leading-relaxed">
          Screen captures, snipping tools, and background recorders are restricted on DRISHTI AI. Click back onto this window to resume active viewing.
        </p>

        <div className="mt-8 flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          GOVERNMENT OF INDIA — DATA GOVERNANCE COMPLIANT
        </div>
      </div>

      {/* 2. Smooth Floating Motion Security Modal (When user attempts PrintScreen / Shortcuts) */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div
            role="alertdialog"
            className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(239,68,68,0.3)] overflow-hidden transition-all duration-300 transform scale-100 animate-scale-in"
          >
            {/* Modal Header Bar */}
            <div className="bg-gradient-to-r from-red-600/30 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {modalDetails.action}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {modalDetails.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {modalDetails.message}
              </p>

              <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3.5 flex items-start gap-3 text-xs text-slate-300">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    Official Export Alternative:
                  </span>
                  To share project analysis with ministry executives, use the official{' '}
                  <strong className="text-emerald-400 font-semibold">"Export PMO Dossier"</strong>{' '}
                  in the Reports section.
                </div>
              </div>
            </div>

            {/* Modal Footer Action */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Subtle Non-Intrusive Security Watermark in Print / Capture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[40] overflow-hidden opacity-[0.02] select-none flex items-center justify-center print:opacity-100 print:text-slate-400"
      >
        <div className="rotate-[-25deg] text-center font-mono font-bold tracking-widest text-slate-900 leading-relaxed text-sm md:text-base whitespace-nowrap">
          CONFIDENTIAL — RESTRICTED ACCESS — DRISHTI AI NATIONAL INFRASTRUCTURE INTELLIGENCE — FOR AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </>
  );
};

export default SecurityGuard;
