import React, { useState } from 'react';
import { playSyntheticSound, triggerVibration } from '../utils/audio.ts';
import { SoundLibraryItem } from '../types.ts';

interface MySoundsTabProps {
  customSounds: SoundLibraryItem[];
  laoSounds: SoundLibraryItem[];
  onToggleSound: (id: string) => void;
  onAddCustomSound: (sound: SoundLibraryItem) => void;
  onDeleteCustomSound: (id: string) => void;
}

export const MySoundsTab: React.FC<MySoundsTabProps> = ({
  customSounds,
  laoSounds,
  onToggleSound,
  onAddCustomSound,
  onDeleteCustomSound,
}) => {
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [recordStep, setRecordStep] = useState<number>(1);
  const [customName, setCustomName] = useState('');
  const [customVibePattern, setCustomVibePattern] = useState<'staccato' | 'long' | 'triple'>('staccato');
  const [recordedCount, setRecordedCount] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [recordingSuccess, setRecordingSuccess] = useState<boolean>(false);

  // Remaining slots calculation
  const totalSlots = 10;
  const usedSlots = customSounds.length;
  const remainingSlots = Math.max(0, totalSlots - usedSlots);

  // Quick 1-tap recording simulator flow
  const handleStartCapture = () => {
    setIsCapturing(true);
    triggerVibration([100, 50, 100]);

    setTimeout(() => {
      setRecordedCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setIsCapturing(false);
          setRecordStep(3); // proceed to final review step
        } else {
          setIsCapturing(false);
        }
        return next;
      });
    }, 1400);
  };

  const handleSaveSound = () => {
    if (!customName.trim()) return;

    const patternTexts = {
      staccato: 'ແຈ້ງເຕືອນ: ສັ່ນສັ້ນ 2 ຄັ້ງ (Staccato)',
      long: 'ແຈ້ງເຕືອນ: ສັ່ນຍາວ 1 ຄັ້ງ',
      triple: 'ແຈ້ງເຕືອນ: ສັ່ນໄວ 3 ຄັ້ງ (Burst)',
    };

    const newSound: SoundLibraryItem = {
      id: 'custom-' + Date.now(),
      titleLao: customName.trim(),
      titleEn: 'Custom Sound',
      descriptionLao: patternTexts[customVibePattern],
      category: 'caution',
      icon: 'record_voice_over',
      soundKey: 'knock',
      active: true,
      isCustom: true,
      vibrationPatternText: patternTexts[customVibePattern],
    };

    onAddCustomSound(newSound);
    setRecordingSuccess(true);
    triggerVibration([100, 80, 200]);

    setTimeout(() => {
      setRecordingSuccess(false);
      setIsRecordingModalOpen(false);
      setRecordStep(1);
      setRecordedCount(0);
      setCustomName('');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-6 space-y-6 max-w-lg mx-auto">
      {/* Friendly Record New Sound Card */}
      <section className="relative overflow-hidden rounded-xl bg-[#242a36] p-5 shadow-xl border border-[#3d494c]/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.25)]">
              <span className="material-symbols-outlined text-[26px]">mic</span>
            </div>
            <div>
              <h2 className="font-bold text-[1.125rem] text-[#dde2f3]">ບັນທຶກສຽງໃໝ່</h2>
              <p className="font-mono-cyber text-[0.75rem] text-[#bcc9cd]">
                ສ້າງສຽງເຕືອນສະເພາະຕົວຂອງທ່ານ
              </p>
            </div>
          </div>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#080e1a] text-[#4cd7f6] font-mono-cyber text-[0.75rem] font-bold border border-[#3d494c]/30">
            <span className="h-2 w-2 rounded-full bg-[#4cd7f6] animate-pulse" />
            <span>ອັດງ່າຍ 3 ຂັ້ນຕອນ</span>
          </span>
        </div>

        {/* 3-Step Friendly Guide */}
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-[#161c28] border border-[#3d494c]/20">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-bold text-[0.75rem] font-mono-cyber mb-1">
              1
            </span>
            <span className="font-mono-cyber text-[0.75rem] text-[#dde2f3] font-bold">
              ກົດປຸ່ມອັດ
            </span>
            <span className="font-mono-cyber text-[#869397] text-[11px]">ກົດເລີ່ມຕົ້ນ</span>
          </div>

          <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-[#161c28] border border-[#3d494c]/20">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-bold text-[0.75rem] font-mono-cyber mb-1">
              2
            </span>
            <span className="font-mono-cyber text-[0.75rem] text-[#dde2f3] font-bold">
              ສ້າງສຽງ 3 ຄັ້ງ
            </span>
            <span className="font-mono-cyber text-[#869397] text-[11px]">ເຄາະ ຫຼື ເອີ້ນຊື່</span>
          </div>

          <div className="flex flex-col items-center text-center p-2.5 rounded-lg bg-[#161c28] border border-[#3d494c]/20">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] font-bold text-[0.75rem] font-mono-cyber mb-1">
              3
            </span>
            <span className="font-mono-cyber text-[0.75rem] text-[#dde2f3] font-bold">
              ພ້ອມເຕືອນ
            </span>
            <span className="font-mono-cyber text-[#869397] text-[11px]">ສັ່ນ ແລະ ແຈ້ງເຕືອນ</span>
          </div>
        </div>

        {/* 1-Tap Record CTA Button */}
        <button
          id="btn-record-action"
          type="button"
          onClick={() => {
            setIsRecordingModalOpen(true);
            setRecordStep(1);
            setRecordedCount(0);
            setCustomName('');
          }}
          className="mt-2 w-full flex items-center justify-center space-x-2 rounded-xl bg-[#4cd7f6] px-4 py-3.5 text-[#003640] font-bold text-[1.125rem] active:scale-[0.98] transition-all shadow-lg shadow-[#4cd7f6]/25 hover:bg-[#06b6d4] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">fiber_manual_record</span>
          <span>+ ອັດສຽງໃໝ່ (ບັນທຶກສຽງ)</span>
        </button>

        {/* Slot counter */}
        <div className="flex items-center justify-between pt-2.5 px-1">
          <span className="font-mono-cyber text-[0.75rem] text-[#bcc9cd]">
            ບ່ອນບັນທຶກທີ່ຍັງເຫຼືອ: {remainingSlots} ຈາກ {totalSlots}
          </span>
          <div className="flex space-x-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-4 rounded-full ${
                  i < customSounds.length
                    ? 'bg-[#4cd7f6]'
                    : 'bg-[#3d494c]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: MY SAVED SOUNDS */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              record_voice_over
            </span>
            <h3 className="font-bold text-[1.125rem] text-[#dde2f3]">
              ສຽງທີ່ຂ້ອຍບັນທຶກໄວ້
            </h3>
          </div>
          <span className="font-mono-cyber text-[0.75rem] text-[#4cd7f6] px-2.5 py-0.5 rounded-full bg-[#242a36] border border-[#3d494c]/30 font-semibold">
            {customSounds.length} ສຽງ
          </span>
        </div>

        {customSounds.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#242a36] p-4 shadow-md space-y-3 border border-[#3d494c]/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#080e1a] text-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.2)]">
                  <span className="material-symbols-outlined text-[26px]">
                    {item.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[1rem] text-[#dde2f3] truncate">
                    {item.titleLao}
                  </h4>
                  <p className="font-mono-cyber text-[0.75rem] text-[#bcc9cd] truncate">
                    {item.descriptionLao}
                  </p>
                </div>
              </div>

              {/* Simple Friendly Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() => onToggleSound(item.id)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-[#080e1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#869397] after:peer-checked:bg-[#003640] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4cd7f6]" />
              </label>
            </div>

            {/* Friendly Control Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#3d494c]/20">
              <div
                className={`flex items-center space-x-1.5 font-mono-cyber text-[0.75rem] ${
                  item.active ? 'text-[#4cd7f6]' : 'text-[#869397]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {item.active ? 'check_circle' : 'pause_circle'}
                </span>
                <span>{item.active ? 'ພ້ອມກວດຈັບສຽງ' : 'ປິດການໃຊ້ງານ'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSyntheticSound(item.soundKey);
                    triggerVibration([120, 80, 120]);
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#161c28] text-[#7bd0ff] hover:text-[#4cd7f6] transition-colors text-xs font-mono-cyber cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>ທົດສອບສຽງ</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCustomSound(item.id)}
                  title="ລຶບສຽງນີ້"
                  className="p-1.5 rounded-lg bg-[#161c28] text-[#869397] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 2: LAO STARTER PACK SOUNDS */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              local_library
            </span>
            <h3 className="font-bold text-[1.125rem] text-[#dde2f3]">
              ຊຸດສຽງທ້ອງຖິ່ນລາວ
            </h3>
          </div>
          <span className="font-mono-cyber text-[0.75rem] text-[#869397] px-2 py-0.5 rounded-full bg-[#242a36] border border-[#3d494c]/20">
            ຕິດຕັ້ງແລ້ວ
          </span>
        </div>

        {/* Lao Grid Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {laoSounds.map((sound) => {
            const isDanger = sound.category === 'danger';
            return (
              <div
                key={sound.id}
                className="rounded-xl bg-[#242a36] p-3.5 flex items-center justify-between shadow-md border border-[#3d494c]/20"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#080e1a] ${
                      isDanger ? 'text-[#ffb4ab]' : 'text-[#7bd0ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {sound.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-[0.95rem] text-[#dde2f3] truncate">
                        {sound.titleLao}
                      </h4>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono-cyber text-[10px] font-bold ${
                          isDanger
                            ? 'bg-[#93000a] text-[#ffdad6]'
                            : 'bg-[#161c28] text-[#7bd0ff]'
                        }`}
                      >
                        {isDanger ? 'ອັນຕະລາຍ' : 'ສຽງທົ່ວໄປ'}
                      </span>
                    </div>
                    <p className="font-mono-cyber text-[0.75rem] text-[#bcc9cd] truncate">
                      {sound.descriptionLao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playSyntheticSound(sound.soundKey);
                    }}
                    title="ທົດສອບສຽງ"
                    className="h-9 w-9 rounded-lg bg-[#161c28] flex items-center justify-center text-[#7bd0ff] hover:text-[#4cd7f6] active:scale-90 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      play_arrow
                    </span>
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sound.active}
                      onChange={() => onToggleSound(sound.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#080e1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#869397] after:peer-checked:bg-[#003640] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4cd7f6]" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple Status Footer */}
      <div className="flex justify-center pb-2">
        <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#242a36] shadow-md border border-[#3d494c]/20">
          <span className="h-2 w-2 rounded-full bg-[#4cd7f6] animate-pulse" />
          <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">
            offline_pin
          </span>
          <span className="font-mono-cyber text-[0.75rem] text-[#bcc9cd]">
            ເຮັດວຽກແບບອອບລາຍ 100% ບໍ່ຕ້ອງຕໍ່ອິນເຕີເນັດ
          </span>
        </div>
      </div>

      {/* Custom Recording Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1a202c] border border-[#3d494c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3d494c]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6]">mic</span>
                <h3 className="font-bold text-lg text-[#dde2f3]">
                  ອັດບັນທຶກສຽງໃໝ່ (Custom Sound)
                </h3>
              </div>
              <button
                onClick={() => setIsRecordingModalOpen(false)}
                className="text-[#869397] hover:text-[#dde2f3] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {recordingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center mx-auto animate-bounce">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h4 className="font-bold text-xl text-[#dde2f3]">ບັນທຶກສຳເລັດ!</h4>
                <p className="text-sm text-[#bcc9cd]">
                  ສຽງ "{customName}" ຖືກເພີ່ມເຂົ້າໃນຫ້ອງສະໝຸດສຽງແລ້ວ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recordStep === 1 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#dde2f3]">
                      ຕັ້ງຊື່ສຽງທີ່ຕ້ອງການບັນທຶກ:
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="ຕົວຢ່າງ: ກະດິ່ງປະຕູບ້ານ, ສຽງນ້ຳລົ້ນ, ສຽງຮ້ອງເດັກນ້ອຍ"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1a] border border-[#3d494c] text-sm text-[#dde2f3] focus:outline-none focus:border-[#4cd7f6]"
                    />

                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-mono-cyber text-[#bcc9cd]">
                        ເລືອກຮູບແບບການສັ່ນເຕືອນໄພ:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomVibePattern('staccato');
                            triggerVibration([100, 50, 100]);
                          }}
                          className={`p-2.5 rounded-lg text-xs font-mono-cyber text-center transition-all ${
                            customVibePattern === 'staccato'
                              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-md'
                              : 'bg-[#161c28] text-[#bcc9cd] border border-[#3d494c]/30'
                          }`}
                        >
                          ສັ່ນສັ້ນ 2 ຄັ້ງ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomVibePattern('long');
                            triggerVibration([400]);
                          }}
                          className={`p-2.5 rounded-lg text-xs font-mono-cyber text-center transition-all ${
                            customVibePattern === 'long'
                              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-md'
                              : 'bg-[#161c28] text-[#bcc9cd] border border-[#3d494c]/30'
                          }`}
                        >
                          ສັ່ນຍາວ 1 ຄັ້ງ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomVibePattern('triple');
                            triggerVibration([80, 50, 80, 50, 80]);
                          }}
                          className={`p-2.5 rounded-lg text-xs font-mono-cyber text-center transition-all ${
                            customVibePattern === 'triple'
                              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-md'
                              : 'bg-[#161c28] text-[#bcc9cd] border border-[#3d494c]/30'
                          }`}
                        >
                          ສັ່ນໄວ 3 ຄັ້ງ
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!customName.trim()}
                      onClick={() => setRecordStep(2)}
                      className="w-full py-3 mt-4 rounded-xl bg-[#4cd7f6] text-[#003640] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#06b6d4] transition-colors"
                    >
                      ຕໍ່ໄປ: ເລີ່ມອັດສຽງຕົວຢ່າງ (3 ຄັ້ງ)
                    </button>
                  </div>
                )}

                {recordStep === 2 && (
                  <div className="py-4 flex flex-col items-center space-y-4 text-center">
                    <p className="text-sm text-[#bcc9cd]">
                      ສ້າງສຽງ "{customName}" ໃຫ້ໂທລະສັບຟັງ 3 ຄັ້ງ
                    </p>

                    {/* Circular Capture Visualizer */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 rounded-full transition-all ${
                          isCapturing ? 'bg-[#ffb4ab]/30 animate-ping' : 'bg-[#4cd7f6]/10'
                        }`}
                      />
                      <div className="w-24 h-24 rounded-full bg-[#161c28] border-2 border-[#4cd7f6] flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-[32px] text-[#4cd7f6]">
                          {isCapturing ? 'graphic_eq' : 'mic'}
                        </span>
                        <span className="font-mono-cyber text-xs font-bold text-[#dde2f3] mt-1">
                          {recordedCount}/3 ຄັ້ງ
                        </span>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex gap-2">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className={`w-3 h-3 rounded-full ${
                            num <= recordedCount ? 'bg-[#4cd7f6]' : 'bg-[#3d494c]'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={isCapturing}
                      onClick={handleStartCapture}
                      className="w-full py-3.5 rounded-xl bg-[#4cd7f6] text-[#003640] font-bold shadow-lg hover:bg-[#06b6d4] active:scale-95 transition-all cursor-pointer"
                    >
                      {isCapturing
                        ? `ກຳລັງອັດສຽງຄັ້ງທີ ${recordedCount + 1}...`
                        : `ກົດອັດສຽງຄັ້ງທີ ${recordedCount + 1}`}
                    </button>
                  </div>
                )}

                {recordStep === 3 && (
                  <div className="space-y-4 py-2 text-center">
                    <div className="p-4 rounded-xl bg-[#161c28] border border-[#3d494c]/40 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#869397]">ຊື່ສຽງ:</span>
                        <span className="text-sm font-bold text-[#4cd7f6]">{customName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#869397]">ຕົວຢ່າງສຽງ:</span>
                        <span className="text-xs font-mono-cyber text-[#dde2f3]">3 ຕົວຢ່າງຄົບຖ້ວນ</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#869397]">ການສັ່ນ:</span>
                        <span className="text-xs font-mono-cyber text-[#7bd0ff]">
                          {customVibePattern === 'staccato'
                            ? 'ສັ່ນສັ້ນ 2 ຄັ້ງ'
                            : customVibePattern === 'long'
                            ? 'ສັ່ນຍາວ 1 ຄັ້ງ'
                            : 'ສັ່ນໄວ 3 ຄັ້ງ'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRecordStep(2);
                          setRecordedCount(0);
                        }}
                        className="flex-1 py-3 rounded-xl bg-[#242a36] text-[#bcc9cd] font-semibold text-sm hover:text-[#dde2f3]"
                      >
                        ອັດໃໝ່
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSound}
                        className="flex-1 py-3 rounded-xl bg-[#4cd7f6] text-[#003640] font-bold text-sm shadow-lg hover:bg-[#06b6d4]"
                      >
                        ບັນທຶກສຽງ (Save)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
