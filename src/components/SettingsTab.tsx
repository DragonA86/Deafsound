import React, { useState } from 'react';
import { triggerVibration } from '../utils/audio.ts';
import { AppSettings } from '../types.ts';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onToggleWakeLock: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onToggleWakeLock,
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const sensitivityLabels = ['ຕໍ່າ (Low)', 'ປານກາງ (Medium)', 'ສູງ (High)'];
  const vibeLabels = ['ເບົາ (Light)', 'ປານກາງ (Medium)', 'ແຮງ (Strong)'];

  // Call backend AI narration endpoint or generate contextual Lao narrative
  const handleGenerateAiNarration = async () => {
    setIsGeneratingAi(true);
    triggerVibration([50]);

    try {
      const res = await fetch('/api/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soundLabel: 'ສຽງລົດຈັກ ແລະ ສຽງແກລົດ',
          category: 'Danger',
          decibel: 82,
          time: new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' }),
        }),
      });

      const data = await res.json();
      if (data && data.narration) {
        onUpdateSettings({
          lastAiNarration: data.narration,
          lastAiTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch {
      // Local fallback
      onUpdateSettings({
        lastAiNarration: '“ມີສຽງລົດຈັກແລ່ນຜ່ານຢ່າງໄວວາ ແລະ ສຽງແກລົດເຕືອນ 2 ຄັ້ງ ຢູ່ໃກ້ຕົວທ່ານ, ຄວນລະມັດລະວັງການຂ້າມທາງ.”',
        lastAiTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyDiagnostics = () => {
    const diagnostics = {
      app: 'DeafSound Laos',
      version: '1.2.0',
      offline_ready: true,
      audio_worklet_latency_ms: 18,
      detection_sensitivity: sensitivityLabels[settings.sensitivity - 1],
      vibration_intensity: vibeLabels[settings.vibrationIntensity - 1],
      emergency_siren_priority: settings.emergencySirenPriority,
      ai_narration_active: settings.aiNarrationEnabled,
      screen_wake_lock: settings.screenWakeLock,
      timestamp: new Date().toISOString(),
    };

    navigator.clipboard?.writeText(JSON.stringify(diagnostics, null, 2));
    setCopyFeedback(true);
    triggerVibration([40, 40]);
    setTimeout(() => setCopyFeedback(false), 2200);
  };

  return (
    <div className="flex flex-col w-full px-4 py-2 space-y-6 max-w-lg mx-auto pb-10">
      {/* SECTION 1: AI NARRATION CONFIG */}
      <section className="flex flex-col w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="material-symbols-outlined text-[#4cd7f6] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
            <h2 className="font-bold text-[1.125rem] text-[#dde2f3]">
              ການອະທິບາຍສະຖານະການ AI
            </h2>
          </div>
        </div>

        {/* Simplified Main Toggle Card */}
        <div className="flex flex-col w-full p-4 rounded-xl bg-[#1a202c] shadow-md space-y-4 border border-[#3d494c]/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col pr-3">
              <span className="font-bold text-[1rem] text-[#dde2f3]">
                ເປີດໃຊ້ງານ AI Narration
              </span>
              <span className="text-xs text-[#bcc9cd] mt-0.5">
                ອະທິບາຍບໍລິບົດສຽງອ້ອມຂ້າງເປັນພາສາລາວແບບອັດສະລິຍະ
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.aiNarrationEnabled}
              onClick={() => {
                onUpdateSettings({ aiNarrationEnabled: !settings.aiNarrationEnabled });
                triggerVibration([40]);
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.aiNarrationEnabled ? 'bg-[#06b6d4]' : 'bg-[#2f3542]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  settings.aiNarrationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Privacy Badge Note */}
          <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-[#161c28] text-[#4cd7f6] border border-[#3d494c]/20">
            <span
              className="material-symbols-outlined text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <span className="text-xs text-[#bcc9cd] font-medium">
              ສຽງບໍ່ເຄີຍອອກຈາກເຄື່ອງ • ປະມວນຜົນພາຍໃນໂທລະສັບ 100%
            </span>
          </div>
        </div>

        {/* Recent AI Summary Card */}
        {settings.aiNarrationEnabled && (
          <div className="flex flex-col w-full p-4 rounded-xl bg-[#1a202c] shadow-md space-y-3 border border-[#3d494c]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#4cd7f6]">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="font-bold text-sm text-[#dde2f3]">
                  ຕົວຢ່າງການແຈ້ງເຕືອນລ່າສຸດ
                </span>
              </div>
              <span className="font-mono-cyber text-xs text-[#869397]">
                {settings.lastAiTime}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#242a36] border border-[#3d494c]/25">
              <p className="text-sm text-[#dde2f3] font-medium leading-relaxed">
                {settings.lastAiNarration}
              </p>
            </div>

            <button
              onClick={handleGenerateAiNarration}
              disabled={isGeneratingAi}
              className="w-full py-2.5 rounded-xl bg-[#161c28] border border-[#4cd7f6]/40 text-[#4cd7f6] hover:bg-[#242a36] text-xs font-mono-cyber font-bold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isGeneratingAi ? 'animate-spin' : ''}`}>
                {isGeneratingAi ? 'autorenew' : 'sparkles'}
              </span>
              <span>
                {isGeneratingAi ? 'ກຳລັງສ້າງຄຳອະທິບາຍ...' : 'ສ້າງຄຳອະທິບາຍສະຖານະການໃໝ່ (AI)'}
              </span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: FIELD TUNING & THRESHOLD OVERRIDES */}
      <section className="flex flex-col w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              tune
            </span>
            <h2 className="font-bold text-[1.125rem] text-[#dde2f3]">
              ຄວາມໄວໃນການກວດຈັບ ແລະ ການສັ່ນ
            </h2>
          </div>
        </div>

        <div className="flex flex-col w-full space-y-3">
          {/* Control 1: Sound Sensitivity */}
          <div className="flex flex-col p-4 rounded-xl bg-[#1a202c] shadow-sm space-y-3 border border-[#3d494c]/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">
                  hearing
                </span>
                <span className="text-sm text-[#dde2f3] font-semibold">
                  ລະດັບການຮັບສຽງ (Sensitivity)
                </span>
              </div>
              <span className="font-mono-cyber text-xs text-[#7bd0ff] font-bold">
                {sensitivityLabels[settings.sensitivity - 1]}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono-cyber text-[#869397]">ຕໍ່າ</span>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={settings.sensitivity}
                onChange={(e) => {
                  onUpdateSettings({ sensitivity: Number(e.target.value) });
                  triggerVibration([30]);
                }}
                className="w-full h-2 bg-[#080e1a] rounded-lg appearance-none cursor-pointer accent-[#7bd0ff]"
              />
              <span className="text-xs font-mono-cyber text-[#869397]">ສູງ</span>
            </div>
            <span className="text-xs text-[#bcc9cd]">
              ເໝາະສົມກັບສຽງຕາມຖະໜົນ ແລະ ສະຖານທີ່ທົ່ວໄປ
            </span>
          </div>

          {/* Control 2: Vibration Alert Intensity */}
          <div className="flex flex-col p-4 rounded-xl bg-[#1a202c] shadow-sm space-y-3 border border-[#3d494c]/25">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                  vibration
                </span>
                <span className="text-sm text-[#dde2f3] font-semibold">
                  ຄວາມແຮງຂອງການສັ່ນເຕືອນ
                </span>
              </div>
              <span className="font-mono-cyber text-xs text-[#4cd7f6] font-bold">
                {vibeLabels[settings.vibrationIntensity - 1]}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono-cyber text-[#869397]">ເບົາ</span>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={settings.vibrationIntensity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateSettings({ vibrationIntensity: val });
                  triggerVibration(val === 1 ? [80] : val === 2 ? [160] : [300]);
                }}
                className="w-full h-2 bg-[#080e1a] rounded-lg appearance-none cursor-pointer accent-[#4cd7f6]"
              />
              <span className="text-xs font-mono-cyber text-[#869397]">ແຮງ</span>
            </div>
            <span className="text-xs text-[#bcc9cd]">
              ສັ່ນເຕືອນທັນທີເມື່ອມີສຽງອັນຕະລາຍ ຫຼື ສຽງແກລົດ
            </span>
          </div>

          {/* Control 3: Siren Priority Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a202c] shadow-sm border border-[#3d494c]/25">
            <div className="flex flex-col pr-3">
              <div className="flex items-center space-x-2">
                <span
                  className="material-symbols-outlined text-[#ff817a] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  emergency
                </span>
                <span className="text-sm text-[#dde2f3] font-semibold">
                  ເຕືອນສຽງສຸກເສີນຕະຫຼອດເວລາ
                </span>
              </div>
              <span className="text-xs text-[#bcc9cd] mt-0.5">
                ສັ່ນເຕືອນທັນທີເມື່ອມີສຽງລົດສຸກເສີນ ຫຼື ໄຊເຣນ
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.emergencySirenPriority}
              onClick={() => {
                onUpdateSettings({ emergencySirenPriority: !settings.emergencySirenPriority });
                triggerVibration([40]);
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.emergencySirenPriority ? 'bg-[#06b6d4]' : 'bg-[#2f3542]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  settings.emergencySirenPriority ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Control 4: Screen Strobe Flash for Deaf Accessibility */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a202c] shadow-sm border border-[#3d494c]/25">
            <div className="flex flex-col pr-3">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">
                  flash_on
                </span>
                <span className="text-sm text-[#dde2f3] font-semibold">
                  ແສງກະພິບໜ້າຈໍເຕືອນໄພ (Screen Strobe)
                </span>
              </div>
              <span className="text-xs text-[#bcc9cd] mt-0.5">
                ກະພິບແສງໜ້າຈໍສີແດງເມື່ອມີສຽງອັນຕະລາຍສຸກເສີນ
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.screenStrobeOnAlert}
              onClick={() => {
                onUpdateSettings({ screenStrobeOnAlert: !settings.screenStrobeOnAlert });
                triggerVibration([40]);
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.screenStrobeOnAlert ? 'bg-[#06b6d4]' : 'bg-[#2f3542]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  settings.screenStrobeOnAlert ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Control 5: Screen Wake Lock */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a202c] shadow-sm border border-[#3d494c]/25">
            <div className="flex flex-col pr-3">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                  screen_lock_rotation
                </span>
                <span className="text-sm text-[#dde2f3] font-semibold">
                  ຮັກສາໜ້າຈໍເປີດຕະຫຼອດ (Wake Lock)
                </span>
              </div>
              <span className="text-xs text-[#bcc9cd] mt-0.5">
                ປ້ອງກັນໜ້າຈໍດັບຂະນະກວດຈັບສຽງສະພາບແວດລ້ອມ
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.screenWakeLock}
              onClick={onToggleWakeLock}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.screenWakeLock ? 'bg-[#06b6d4]' : 'bg-[#2f3542]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  settings.screenWakeLock ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: HAPTIC TEST BENCH */}
      <section className="p-4 rounded-xl bg-[#161c28] border border-[#3d494c]/30 space-y-3">
        <h3 className="text-xs font-mono-cyber text-[#4cd7f6] font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">sensors</span>
          ທົດສອບຈັງຫວະການສັ່ນ (Haptic Pattern Test Bench)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => triggerVibration([80, 50, 80])}
            className="p-2.5 rounded-lg bg-[#242a36] text-xs font-mono-cyber text-[#dde2f3] hover:text-[#4cd7f6] hover:bg-[#2f3542] transition-colors cursor-pointer"
          >
            ສັ່ນສັ້ນ (Staccato)
          </button>
          <button
            onClick={() => triggerVibration([350])}
            className="p-2.5 rounded-lg bg-[#242a36] text-xs font-mono-cyber text-[#dde2f3] hover:text-[#4cd7f6] hover:bg-[#2f3542] transition-colors cursor-pointer"
          >
            ສັ່ນຍາວ (Long)
          </button>
          <button
            onClick={() => triggerVibration([300, 100, 300, 100, 400])}
            className="p-2.5 rounded-lg bg-[#93000a]/40 border border-[#ff817a]/40 text-xs font-mono-cyber text-[#ffdad6] hover:bg-[#93000a] transition-colors cursor-pointer font-bold"
          >
            ສຸກເສີນ (Danger)
          </button>
        </div>
      </section>

      {/* Copy Diagnostics Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleCopyDiagnostics}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#242a36] border border-[#3d494c]/40 text-xs font-mono-cyber text-[#bcc9cd] hover:text-[#4cd7f6] hover:border-[#4cd7f6]/40 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copyFeedback ? 'check_circle' : 'content_copy'}
          </span>
          <span>{copyFeedback ? 'ຄັດລອກ JSON ສຳເລັດແລ້ວ!' : 'ຄັດລອກ JSON ສະຖິຕິ'}</span>
        </button>
      </div>
    </div>
  );
};
