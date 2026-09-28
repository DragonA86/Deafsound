import React, { useState } from 'react';
import { DeafSoundLogo } from './Logo.tsx';

interface HeaderProps {
  currentTab: string;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  wakeLockActive,
  onToggleWakeLock,
}) => {
  const [showProfile, setShowProfile] = useState(false);

  const getSubTitle = () => {
    switch (currentTab) {
      case 'listen':
        return 'Listen Live Detection';
      case 'alerts':
        return 'Alerts & History';
      case 'library':
        return 'My Sounds Library';
      case 'settings':
        return 'Settings Ai Narration';
      default:
        return 'Listen Live Detection';
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 pt-safe bg-[#080e1a]/90 backdrop-blur-xl border-b border-[#3d494c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-20 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <DeafSoundLogo size={34} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[1.25rem] text-[#4cd7f6] tracking-tight truncate">
                  ສຽງເຕືອນ
                </span>
                <span className="text-[#3d494c] font-bold text-[0.75rem] font-mono-cyber">
                  /
                </span>
                <span className="text-[0.75rem] text-[#bcc9cd] font-mono-cyber tracking-wider uppercase truncate">
                  DeafSound
                </span>
              </div>
              <span className="text-[0.75rem] text-[#869397] font-mono-cyber truncate">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Offline 100% badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#161c28] border border-[#3d494c]/30">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6] animate-pulse">
                offline_bolt
              </span>
              <span className="text-[0.75rem] font-mono-cyber text-[#4cd7f6] font-medium">
                ອອບລາຍ 100%
              </span>
            </div>

            {/* Screen Wake Lock Button */}
            <button
              onClick={onToggleWakeLock}
              title={wakeLockActive ? 'Screen Wake Lock Active (ໜ້າຈໍບໍ່ດັບ)' : 'Enable Screen Wake Lock (ເປີດໃຊ້ງານ)'}
              aria-label="Toggle Wake Lock"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                wakeLockActive
                  ? 'bg-[#242a36] text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.35)] border border-[#4cd7f6]/40'
                  : 'bg-[#1a202c] text-[#869397] hover:text-[#dde2f3]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {wakeLockActive ? 'screen_lock_rotation' : 'screen_rotation'}
              </span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              aria-label="User Profile"
              className="w-8 h-8 rounded-full bg-[#4cd7f6] text-[#003640] flex items-center justify-center font-bold shrink-0 hover:brightness-110 active:scale-95 transition-transform cursor-pointer shadow-[0_0_8px_rgba(76,215,246,0.25)]"
            >
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile quick modal */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#1a202c] border border-[#3d494c] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#3d494c]/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#4cd7f6] text-[#003640] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[26px]">person</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#dde2f3] text-lg">ຜູ້ໃຊ້ງານ (User Profile)</h3>
                  <p className="text-xs text-[#4cd7f6] font-mono-cyber">DeafSound Assistive</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="text-[#869397] hover:text-[#dde2f3]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161c28]">
                <span className="text-[#bcc9cd]">ໂໝດຊ່ວຍເຫຼືອຄົນຫູໜວກ</span>
                <span className="text-[#4cd7f6] font-bold">ເປີດໃຊ້ງານ (ON)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161c28]">
                <span className="text-[#bcc9cd]">ພາສາສະແດງຜົນ</span>
                <span className="text-[#dde2f3]">ພາສາລາວ (Lao)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161c28]">
                <span className="text-[#bcc9cd]">ການສັ່ນເຕືອນໄພ (Haptics)</span>
                <span className="text-[#7bd0ff]">ສັ່ນແຮງ (Strong)</span>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full py-2.5 rounded-xl bg-[#4cd7f6] text-[#003640] font-bold hover:brightness-110"
            >
              ປິດໜ້າຕ່າງ (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
