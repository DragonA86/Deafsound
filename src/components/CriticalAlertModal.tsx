import React, { useEffect, useState } from 'react';
import { DeafSoundLogo } from './Logo.tsx';
import { triggerVibration, stopVibration } from '../utils/audio.ts';
import { SoundDetection } from '../types.ts';

interface CriticalAlertModalProps {
  alert: SoundDetection | null;
  onDismiss: (action: 'acknowledged' | 'false_alarm') => void;
  strobeEnabled?: boolean;
}

export const CriticalAlertModal: React.FC<CriticalAlertModalProps> = ({
  alert,
  onDismiss,
  strobeEnabled = true,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!alert) return;

    // Trigger persistent emergency vibration pattern for critical sound
    const pattern = [300, 100, 300, 100, 500];
    triggerVibration(pattern);

    const interval = setInterval(() => {
      triggerVibration(pattern);
    }, 2000);

    return () => {
      clearInterval(interval);
      stopVibration();
    };
  }, [alert]);

  if (!alert) return null;

  const handleAction = (type: 'acknowledged' | 'false_alarm') => {
    stopVibration();
    if (type === 'acknowledged') {
      triggerVibration([50, 40, 50]);
      setFeedback('ບັນທຶກສະຖານະແລ້ວ · Cleared');
    } else {
      triggerVibration([30]);
      setFeedback('ສົ່ງລາຍງານແລ້ວ · Logged');
    }

    setTimeout(() => {
      onDismiss(type);
      setFeedback(null);
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[#0e131f] select-none overflow-y-auto ${
        strobeEnabled ? 'animate-screen-strobe' : ''
      }`}
    >
      {/* Header bar matching Image 4 */}
      <header className="w-full pt-safe bg-[#080e1a]/95 backdrop-blur-xl border-b border-[#3d494c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-20 px-4 flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => handleAction('acknowledged')}
              aria-label="Go Back"
              className="w-11 h-11 rounded-xl bg-[#1a202c] flex items-center justify-center text-[#4cd7f6] hover:bg-[#242a36] transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <DeafSoundLogo size={32} />
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-[1.125rem] text-[#dde2f3] tracking-tight truncate">
                Critical Alert Takeover
              </h1>
              <span className="text-[0.75rem] font-mono-cyber text-[#869397] truncate">
                ສຽງເຕືອນ · DeafSound
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#4cd7f6] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#003640] text-[18px]">
              person
            </span>
          </div>
        </div>
      </header>

      {/* Main Alert Content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col justify-between items-center min-h-[calc(100vh-5rem)]">
        {/* Urgent Emergency Box */}
        <div className="w-full relative rounded-2xl bg-[#93000a]/90 text-[#ffdad6] p-6 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.45)] border border-[#ff817a]/40 overflow-hidden my-auto animate-haptic">
          {/* Danger Pill Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#690005]/60 border border-[#ffb4ab]/30 text-[#ffdad6] mb-6">
            <span
              className="material-symbols-outlined text-[20px] text-[#ffb4ab] animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="text-[0.75rem] font-mono-cyber uppercase tracking-wider font-bold">
              ອັນຕະລາຍ · DANGER
            </span>
          </div>

          {/* Pulsing Concentric Visualizer Halo */}
          <div className="relative w-36 h-36 my-2 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#ef4444]/30 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-[#ef4444]/40 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-2xl">
              <span
                className="material-symbols-outlined text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {alert.icon || 'campaign'}
              </span>
            </div>
          </div>

          {/* Alert Title & Subtitle */}
          <div className="mt-5 space-y-2 text-center">
            <h2 className="font-extrabold text-[2.25rem] leading-tight tracking-tight text-white drop-shadow-md">
              {alert.titleLao}
            </h2>
            <p className="text-[1.125rem] text-[#ffdad7] font-semibold tracking-wide">
              {alert.titleEn}
            </p>
            <div className="pt-1 flex items-center justify-center gap-2 text-xs font-mono-cyber text-[#ffb4ab]">
              <span>ຄວາມດັງ: {alert.decibel} dB</span>
              <span>•</span>
              <span>ຄວາມຖືກຕ້ອງ: {alert.confidence}%</span>
            </div>
          </div>

          {/* Vibrating Notification Pill */}
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#080e1a]/90 border border-[#4cd7f6]/40 text-[#4cd7f6] shadow-md">
            <span
              className="material-symbols-outlined text-[22px] animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              vibration
            </span>
            <span className="text-[0.75rem] font-mono-cyber font-bold tracking-wider">
              ກຳລັງສັ່ນເຕືອນ · VIBRATING
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col gap-3 mt-8 pb-6">
          {feedback ? (
            <div className="w-full p-4 rounded-2xl bg-[#242a36] border border-[#4cd7f6]/40 text-[#dde2f3] flex items-center justify-center gap-2 shadow-lg animate-pulse">
              <span
                className="material-symbols-outlined text-[#4cd7f6] text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
              <span className="font-mono-cyber text-base font-bold">
                {feedback}
              </span>
            </div>
          ) : (
            <>
              <button
                id="btn-ack"
                onClick={() => handleAction('acknowledged')}
                className="w-full h-16 rounded-2xl bg-[#4cd7f6] text-[#003640] font-bold text-[1.25rem] flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(76,215,246,0.35)] active:scale-[0.98] transition-all cursor-pointer hover:brightness-105"
              >
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span>ຮັບຊາບແລ້ວ · Got it</span>
              </button>

              <button
                id="btn-false"
                onClick={() => handleAction('false_alarm')}
                className="w-full h-14 rounded-2xl bg-[#2f3542] text-[#ffb3ad] font-semibold text-[1.125rem] flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-[#3d494c] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
                <span>ບໍ່ແມ່ນ · Wrong</span>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
