import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, EyeOff } from 'lucide-react';

/**
 * SecurityGuard — Enterprise Data Loss Prevention (DLP) & Anti-Capture Guard
 * Restricts unauthorized screen captures, snipping tools, browser recordings,
 * key combination exfiltration, and devtools inspection across DRISHTI-AI.
 * 
 * NOTE: Preserves legitimate official PDF reports and CSV exports.
 */
export const SecurityGuard = () => {
  const [securityAlert, setSecurityAlert] = useState(null);
  const [isScreenProtected, setIsScreenProtected] = useState(false);

  const triggerSecurityWarning = (message, title = 'Data Exfiltration Restricted') => {
    setSecurityAlert({ title, message });
    // Flash protective blur overlay momentarily
    setIsScreenProtected(true);
    setTimeout(() => {
      setIsScreenProtected(false);
    }, 1800);

    // Auto-dismiss alert toast after 4 seconds
    setTimeout(() => {
      setSecurityAlert(null);
    }, 4500);

    // Overwrite clipboard to protect against copied screen data
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('CONFIDENTIAL — DRISHTI AI NATIONAL INFRASTRUCTURE INTELLIGENCE. Unauthorized capture is restricted.');
      }
    } catch {
      // Ignore clipboard permission issues
    }
  };

  useEffect(() => {
    // 1. Intercept Key Combinations (PrintScreen, Win+Shift+S, Snipping tools, DevTools, Ctrl+P outside official reports)
    const handleKeyDown = (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        triggerSecurityWarning(
          'Screen captures are restricted under National Infrastructure Data Governance policy. Please use official PMO Dossier exports in the Reports section.',
          'Screenshot Restricted'
        );
        return false;
      }

      // Windows + Shift + S or Command + Shift + 3/4/5 (Snipping Tool / Mac Screenshot)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
        triggerSecurityWarning(
          'Snipping tool and screenshot shortcuts are disabled for classified infrastructure intelligence.',
          'Anti-Snipping Guard Active'
        );
        return false;
      }

      // Developer Tools shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        ((e.ctrlKey || e.metaKey) && ['U', 'u'].includes(e.key))
      ) {
        e.preventDefault();
        triggerSecurityWarning(
          'Developer inspection and source extraction tools are restricted on DRISHTI AI.',
          'Source Code Protected'
        );
        return false;
      }

      // Intercept general Ctrl+S (Page saving)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's') && !e.shiftKey) {
        e.preventDefault();
        triggerSecurityWarning(
          'Direct webpage saving is restricted. Use the Reports tab to generate authorized PDF briefs.',
          'Page Export Restricted'
        );
        return false;
      }
    };

    // 2. Intercept Context Menu (Right-Click) to prevent "Save image as", "Inspect", "Take Screenshot"
    const handleContextMenu = (e) => {
      // Allow context menu only if user is selecting inside a standard text input/textarea for editing
      const tagName = e.target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        return true;
      }
      e.preventDefault();
      triggerSecurityWarning(
        'Context menu actions (right-click & element inspection) are disabled for confidential project data.',
        'Action Restricted'
      );
      return false;
    };

    // 3. Intercept Copy / Drag of sensitive media elements
    const handleDragStart = (e) => {
      if (e.target?.tagName?.toLowerCase() === 'img' || e.target?.tagName?.toLowerCase() === 'canvas') {
        e.preventDefault();
        return false;
      }
    };

    // 4. Intercept DisplayMedia / Screen Sharing requests if attempted via extensions
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function (constraints) {
        triggerSecurityWarning(
          'Third-party screen recording and display media sharing is restricted under GovTech Security Protocol.',
          'Screen Recording Blocked'
        );
        throw new DOMException('Permission denied by DRISHTI-AI Security Policy.', 'NotAllowedError');
      };
    }

    // 5. Detect window blur when screenshot utilities take focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Obscure title or state if necessary
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        triggerSecurityWarning(
          'Screen captures are restricted under National Infrastructure Data Governance policy.',
          'Screenshot Restricted'
        );
      }
    });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* 1. Transient Protective Blackout/Blur Overlay on Attempted Capture */}
      {isScreenProtected && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none transition-all duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            RESTRICTED INFRASTRUCTURE DATA
          </h2>
          <p className="text-sm text-slate-400 max-w-md mt-2">
            Screen captures and unauthorized recordings are blocked under National Data Governance norms.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            GOVERNMENT OF INDIA — DRISHTI AI DLP
          </div>
        </div>
      )}

      {/* 2. Executive Security Toast Alert */}
      {securityAlert && (
        <div className="fixed bottom-6 right-6 z-[99998] max-w-md animate-fade-in shadow-2xl rounded-xl border border-red-500/30 bg-slate-900/95 backdrop-blur-md p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                  {securityAlert.title}
                </h4>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  DLP Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {securityAlert.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Subtle Non-Intrusive Security Watermark in Print / Capture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[50] overflow-hidden opacity-[0.025] select-none flex items-center justify-center print:opacity-100 print:text-slate-400"
      >
        <div className="rotate-[-25deg] text-center font-mono font-bold tracking-widest text-slate-900 leading-relaxed text-sm md:text-base whitespace-nowrap">
          CONFIDENTIAL — RESTRICTED ACCESS — DRISHTI AI NATIONAL INFRASTRUCTURE INTELLIGENCE — FOR AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </>
  );
};

export default SecurityGuard;
