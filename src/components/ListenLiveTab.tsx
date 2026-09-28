import React, { useEffect, useRef, useState } from 'react';
import { playSyntheticSound, triggerVibration } from '../utils/audio.ts';
import { SoundDetection } from '../types.ts';

interface ListenLiveTabProps {
  detections: SoundDetection[];
  onTriggerAlert: (soundKey: string) => void;
  onOpenTakeover: (detection: SoundDetection) => void;
  sensitivityLevel: number;
}

export const ListenLiveTab: React.FC<ListenLiveTabProps> = ({
  detections,
  onTriggerAlert,
  onOpenTakeover,
}) => {
  const [decibels, setDecibels] = useState(48);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [vibeFeedback, setVibeFeedback] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Fallback simulated ambient sound variation when mic is not engaged
  useEffect(() => {
    if (isMicActive) return;

    const interval = setInterval(() => {
      // Natural jitter between 43 dB and 53 dB
      const randomDb = Math.floor(45 + Math.random() * 8);
      setDecibels(randomDb);
    }, 1800);

    return () => clearInterval(interval);
  }, [isMicActive]);

  // Real microphone audio listening via Web Audio API
  const toggleMicrophone = async () => {
    if (isMicActive) {
      // Stop mic
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setIsMicActive(false);
      setMicError(null);
      return;
    }

    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Map audio frequency energy to decibels (approx 35dB baseline up to 95dB peak)
        const computedDb = Math.min(98, Math.max(38, Math.round(38 + (average / 255) * 60)));
        setDecibels(computedDb);

        // Auto detect very loud spikes (> 84 dB)
        if (computedDb >= 85) {
          triggerVibration([200, 80, 200]);
        }

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      setMicError('ບໍ່ສາມາດເຂົ້າເຖິງໄມໂຄຣໂຟນໄດ້ (ກະລຸນາອະນຸຍາດ ຫຼື ໃຊ້ໂໝດຈຳລອງ)');
      setIsMicActive(false);
    }
  };

  // Test vibration feedback
  const handleTestVibration = () => {
    triggerVibration([200, 100, 200, 100, 400]);
    setVibeFeedback(true);
    setTimeout(() => setVibeFeedback(false), 1500);
  };

  // Get status label based on decibel
  const getStatusText = (db: number) => {
    if (db >= 82) return { text: 'ສຽງດັງອັນຕະລາຍ!', color: 'text-[#ffb4ab]' };
    if (db >= 65) return { text: 'ມີສຽງດັງປານກາງ', color: 'text-[#ffb3ad]' };
    return { text: 'ສະພາບປົກກະຕິ', color: 'text-[#bcc9cd]' };
  };

  const status = getStatusText(decibels);

  return (
    <div className="flex flex-col w-full px-4 pb-6 space-y-4 max-w-lg mx-auto">
      {/* Status Bar Minimal */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4cd7f6]" />
          </span>
          <span className="font-bold text-[0.75rem] font-mono-cyber text-[#4cd7f6] tracking-wide">
            {isMicActive ? 'ກຳລັງຟັງໄມໂຄຣໂຟນສົດ' : 'ກຳລັງຟັງສຽງສົດ'}
          </span>
        </div>
        <span className="font-mono-cyber text-[0.75rem] px-2.5 py-1 rounded-full bg-[#242a36] text-[#bcc9cd] border border-[#3d494c]/20">
          ອອບລາຍ 100%
        </span>
      </div>

      {micError && (
        <div className="p-3 rounded-xl bg-[#2f3542] text-xs text-[#ffb3ad] flex items-center gap-2 border border-[#ff817a]/30">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{micError}</span>
        </div>
      )}

      {/* Center Listening Pulse Visualizer */}
      <div className="relative w-full rounded-2xl bg-[#161c28] p-6 flex flex-col items-center justify-center shadow-lg my-1 border border-[#3d494c]/25 overflow-hidden">
        {/* Radar Ring Visualizer */}
        <div className="relative w-48 h-48 flex items-center justify-center my-3">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              decibels > 75 ? 'bg-[#ffb4ab]/15' : 'bg-[#4cd7f6]/10'
            } animate-ping`}
            style={{ animationDuration: decibels > 75 ? '1.5s' : '3s' }}
          />
          <div
            className={`absolute inset-4 rounded-full transition-all duration-300 ${
              decibels > 75 ? 'bg-[#ffb4ab]/20' : 'bg-[#4cd7f6]/15'
            }`}
          />
          <div className="absolute inset-8 rounded-full bg-[#1a202c] border border-[#3d494c]/40 flex flex-col items-center justify-center shadow-inner text-center p-3 select-none">
            <span
              className={`material-symbols-outlined text-[32px] transition-colors ${
                decibels > 75 ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
              } ${isMicActive ? 'animate-pulse' : ''}`}
            >
              hearing
            </span>
            <span
              className={`font-mono-cyber text-[1.5rem] font-bold mt-1 transition-colors ${
                decibels > 75 ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
              }`}
            >
              {decibels} dB
            </span>
            <span className={`text-[0.75rem] font-mono-cyber font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>

        {/* Real Mic Toggle Button */}
        <button
          onClick={toggleMicrophone}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-cyber transition-all active:scale-95 cursor-pointer ${
            isMicActive
              ? 'bg-[#00424f] text-[#4cd7f6] border border-[#4cd7f6]/60 shadow-[0_0_12px_rgba(76,215,246,0.3)]'
              : 'bg-[#242a36] text-[#bcc9cd] hover:text-[#dde2f3] border border-[#3d494c]/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isMicActive ? 'mic' : 'mic_none'}
          </span>
          <span>{isMicActive ? 'ໄມໂຄຣໂຟນເປີດຢູ່ (ກົດປິດ)' : 'ເປີດໄມໂຄຣໂຟນຟັງສຽງແທ້'}</span>
        </button>

        {/* Subdued Status Line */}
        <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#1a202c] border border-[#3d494c]/20">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
            graphic_eq
          </span>
          <span className="font-bold text-[0.875rem] text-[#dde2f3]">
            ກວດຈັບສຽງອ້ອມຂ້າງອັດຕະໂນມັດ
          </span>
        </div>
      </div>

      {/* Quick Interactive Simulator Trigger Tray */}
      <div className="rounded-xl bg-[#161c28] p-3.5 border border-[#3d494c]/25 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-cyber text-[#869397] px-1">
          <span className="flex items-center gap-1.5 text-[#4cd7f6] font-semibold">
            <span className="material-symbols-outlined text-[16px]">touch_app</span>
            ທົດລອງຈຳລອງສຽງເຕືອນ (Test Sounds)
          </span>
          <span>ກົດເພື່ອຟັງ & ສັ່ນ</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onTriggerAlert('horn')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#93000a]/40 border border-[#ff817a]/40 text-[#ffdad6] hover:bg-[#93000a]/60 active:scale-95 transition-all cursor-pointer text-xs font-bold"
          >
            <span>📢</span>
            <span>ແກລົດດັງ</span>
          </button>
          <button
            onClick={() => onTriggerAlert('motorbike')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#242a36] border border-[#ff817a]/30 text-[#dde2f3] hover:bg-[#2f3542] active:scale-95 transition-all cursor-pointer text-xs font-medium"
          >
            <span>🏍️</span>
            <span>ລົດຈັກ</span>
          </button>
          <button
            onClick={() => onTriggerAlert('knock')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#242a36] border border-[#3d494c]/40 text-[#dde2f3] hover:bg-[#2f3542] active:scale-95 transition-all cursor-pointer text-xs font-medium"
          >
            <span>🚪</span>
            <span>ເຄາະປະຕູ</span>
          </button>
          <button
            onClick={() => onTriggerAlert('siren')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#93000a]/40 border border-[#ff817a]/40 text-[#ffdad6] hover:bg-[#93000a]/60 active:scale-95 transition-all cursor-pointer text-xs font-bold"
          >
            <span>🚑</span>
            <span>ໄຊເຣນ</span>
          </button>
          <button
            onClick={() => onTriggerAlert('tuktuk')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#242a36] border border-[#3d494c]/40 text-[#dde2f3] hover:bg-[#2f3542] active:scale-95 transition-all cursor-pointer text-xs font-medium"
          >
            <span>🛺</span>
            <span>ຕຸກຕຸກ</span>
          </button>
          <button
            onClick={() => onTriggerAlert('doorbell')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#242a36] border border-[#3d494c]/40 text-[#dde2f3] hover:bg-[#2f3542] active:scale-95 transition-all cursor-pointer text-xs font-medium"
          >
            <span>🔔</span>
            <span>ກະດິ່ງ</span>
          </button>
        </div>
      </div>

      {/* Vibration Indicator Guide (Minimal) */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#161c28] border border-[#3d494c]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a202c] border border-[#3d494c]/30 flex items-center justify-center text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[18px]">vibration</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[0.875rem] text-[#dde2f3]">
              ລະບົບສັ່ນເຕືອນໄພ
            </span>
            <span className="text-[0.75rem] text-[#bcc9cd]">
              ສັ່ນແຮງເມື່ອມີເຫດສຸກເສີນ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestVibration}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono-cyber transition-all active:scale-95 cursor-pointer ${
              vibeFeedback
                ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-[0_0_8px_rgba(76,215,246,0.5)]'
                : 'bg-[#242a36] text-[#7bd0ff] hover:text-[#4cd7f6]'
            }`}
          >
            {vibeFeedback ? 'ກຳລັງສັ່ນ...' : 'ທົດສອບສັ່ນ'}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" title="Danger" />
            <span className="w-2 h-2 rounded-full bg-[#ffb3ad]" title="Caution" />
            <span className="w-2 h-2 rounded-full bg-[#7bd0ff]" title="Normal" />
          </div>
        </div>
      </div>

      {/* Recent Sound Detections */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-[0.875rem] text-[#dde2f3] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
              history
            </span>
            ສຽງກວດພົບຫຼ້າສຸດ
          </span>
          <span className="text-[0.75rem] font-mono-cyber text-[#4cd7f6] font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
            ສົດ
          </span>
        </div>

        {/* Dynamic Sound Detection Cards */}
        {detections.slice(0, 4).map((item) => {
          const isDanger = item.category === 'danger';
          const isCaution = item.category === 'caution';

          return (
            <div
              key={item.id}
              onClick={() => {
                playSyntheticSound(item.soundKey);
                if (isDanger) {
                  onOpenTakeover(item);
                }
              }}
              className={`flex items-center justify-between p-3.5 rounded-xl bg-[#242a36] shadow-sm border-l-4 transition-all hover:bg-[#2f3542] cursor-pointer ${
                isDanger
                  ? 'border-[#ffb4ab]'
                  : isCaution
                  ? 'border-[#ffb3ad]'
                  : 'border-[#7bd0ff]'
              }`}
            >
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
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[0.875rem] text-[#dde2f3] truncate">
                    {item.titleLao}
                  </span>
                  <span className="text-[0.75rem] text-[#bcc9cd] truncate">
                    ກວດພົບຖືກຕ້ອງ {item.confidence}% · {item.vibrationType}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span
                  className={`text-[0.75rem] font-mono-cyber px-2 py-0.5 rounded-full font-bold ${
                    isDanger
                      ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                      : isCaution
                      ? 'bg-[#ff817a]/20 text-[#ffb3ad]'
                      : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                  }`}
                >
                  {isDanger ? 'ອັນຕະລາຍ' : isCaution ? 'ລະວັງ' : 'ປົກກະຕິ'}
                </span>
                <span className="text-[0.75rem] font-mono-cyber text-[#869397] mt-1">
                  {item.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
