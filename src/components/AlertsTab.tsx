import React, { useState } from 'react';
import { playSyntheticSound, triggerVibration } from '../utils/audio.ts';
import { SoundDetection } from '../types.ts';

interface AlertsTabProps {
  detections: SoundDetection[];
  onOpenTakeover: (detection: SoundDetection) => void;
  onClearHistory: () => void;
  onTriggerAlert: (soundKey: string) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  detections,
  onOpenTakeover,
  onClearHistory,
  onTriggerAlert,
}) => {
  const [filter, setFilter] = useState<'all' | 'danger' | 'caution' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDetections = detections.filter((item) => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.titleLao.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.vibrationType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 pb-6 space-y-4 max-w-lg mx-auto">
      {/* Emergency Simulation Card Banner */}
      <div className="rounded-xl bg-[#93000a]/30 border border-[#ff817a]/40 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ffb4ab]">
            <span
              className="material-symbols-outlined text-[24px] animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="font-bold text-base text-[#dde2f3]">
              ທົດສອບໜ້າຈໍເຕືອນໄພສຸກເສີນ
            </span>
          </div>
          <span className="text-[0.75rem] font-mono-cyber px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold">
            FULL SCREEN
          </span>
        </div>
        <p className="text-xs text-[#bcc9cd]">
          ເປີດໜ້າຈໍເຕືອນໄພສຸກເສີນແບບເຕັມຈໍ (Critical Alert Takeover) ເພື່ອທົດສອບການສັ່ນເຕືອນໄພແຮງ ແລະ ແສງກະພິບ
        </p>
        <button
          onClick={() => {
            const emergencySample: SoundDetection = {
              id: 'emergency-manual-' + Date.now(),
              titleLao: 'ສຽງແກລົດດັງແຮງ!',
              titleEn: 'Loud Vehicle Horn Nearby',
              category: 'danger',
              decibel: 88,
              confidence: 96,
              timeAgo: 'ດຽວນີ້',
              timestamp: Date.now(),
              icon: 'campaign',
              soundKey: 'horn',
              vibrationType: 'ສັ່ນແຮງຫຼາຍຄັ້ງ',
            };
            playSyntheticSound('horn');
            triggerVibration([300, 100, 300, 100, 500]);
            onOpenTakeover(emergencySample);
          }}
          className="w-full py-3 rounded-xl bg-[#ef4444] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#dc2626] active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(239,68,68,0.4)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
          <span>ເປີດໜ້າຈໍເຕືອນໄພສຸກເສີນ (Takeover)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#161c28] border border-[#3d494c]/20 text-xs font-mono-cyber">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#dde2f3]'
          }`}
        >
          ທັງໝົດ
        </button>
        <button
          onClick={() => setFilter('danger')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'danger'
              ? 'bg-[#ef4444] text-white font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#ffb4ab]'
          }`}
        >
          ອັນຕະລາຍ
        </button>
        <button
          onClick={() => setFilter('caution')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'caution'
              ? 'bg-[#ff817a] text-[#7e000f] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#ffb3ad]'
          }`}
        >
          ລະວັງ
        </button>
        <button
          onClick={() => setFilter('info')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            filter === 'info'
              ? 'bg-[#7bd0ff] text-[#00354a] font-bold shadow-sm'
              : 'text-[#bcc9cd] hover:text-[#7bd0ff]'
          }`}
        >
          ປົກກະຕິ
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#869397] text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ຄົ້ນຫາປະຫວັດສຽງເຕືອນ..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161c28] border border-[#3d494c]/30 text-sm text-[#dde2f3] placeholder-[#869397] focus:outline-none focus:border-[#4cd7f6]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-[#869397] hover:text-[#dde2f3]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-3">
        {filteredDetections.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#161c28] border border-[#3d494c]/20 space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#869397]">
              notifications_off
            </span>
            <p className="text-sm text-[#bcc9cd]">ບໍ່ມີປະຫວັດການແຈ້ງເຕືອນໃນໝວດນີ້</p>
          </div>
        ) : (
          filteredDetections.map((item) => {
            const isDanger = item.category === 'danger';
            const isCaution = item.category === 'caution';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl bg-[#242a36] border-l-4 shadow-md space-y-3 transition-all ${
                  isDanger
                    ? 'border-[#ffb4ab]'
                    : isCaution
                    ? 'border-[#ffb3ad]'
                    : 'border-[#7bd0ff]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isDanger
                          ? 'bg-[#93000a] text-[#ffdad6]'
                          : isCaution
                          ? 'bg-[#2f3542] text-[#ffb3ad]'
                          : 'bg-[#1a202c] text-[#7bd0ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {item.icon}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#dde2f3] truncate">
                          {item.titleLao}
                        </h4>
                        <span
                          className={`text-[10px] font-mono-cyber px-1.5 py-0.5 rounded font-bold ${
                            isDanger
                              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                              : isCaution
                              ? 'bg-[#ff817a]/20 text-[#ffb3ad]'
                              : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                          }`}
                        >
                          {isDanger ? 'ອັນຕະລາຍ' : isCaution ? 'ລະວັງ' : 'ປົກກະຕິ'}
                        </span>
                      </div>
                      <p className="text-xs text-[#869397] truncate">{item.titleEn}</p>
                      <p className="text-xs text-[#bcc9cd] mt-0.5">
                        ຄວາມຖືກຕ້ອງ {item.confidence}% · {item.decibel} dB · {item.vibrationType}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono-cyber text-[#869397] shrink-0">
                    {item.timeAgo}
                  </span>
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#3d494c]/30 text-xs">
                  <button
                    onClick={() => {
                      playSyntheticSound(item.soundKey);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161c28] text-[#7bd0ff] hover:text-[#4cd7f6] active:scale-95 transition-all cursor-pointer font-mono-cyber"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>ທົດສອບສຽງ</span>
                  </button>

                  {isDanger ? (
                    <button
                      onClick={() => onOpenTakeover(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#93000a]/40 text-[#ffdad6] hover:bg-[#93000a] active:scale-95 transition-all cursor-pointer font-mono-cyber font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                      <span>ເປີດເຕືອນໄພ</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[#4cd7f6] text-[11px] font-mono-cyber">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>ສັ່ນເຕືອນແລ້ວ</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear Logs Button */}
      {detections.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono-cyber text-[#869397] hover:text-[#ffb4ab] hover:bg-[#161c28] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>ລຶບປະຫວັດການແຈ້ງເຕືອນທັງໝົດ</span>
          </button>
        </div>
      )}
    </div>
  );
};
