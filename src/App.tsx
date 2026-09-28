import { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Navbar } from './components/Navbar.tsx';
import { ListenLiveTab } from './components/ListenLiveTab.tsx';
import { AlertsTab } from './components/AlertsTab.tsx';
import { MySoundsTab } from './components/MySoundsTab.tsx';
import { SettingsTab } from './components/SettingsTab.tsx';
import { CriticalAlertModal } from './components/CriticalAlertModal.tsx';
import { playSyntheticSound, triggerVibration } from './utils/audio.ts';
import { SoundDetection, SoundLibraryItem, AppSettings } from './types.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('listen');
  const [activeTakeoverAlert, setActiveTakeoverAlert] = useState<SoundDetection | null>(null);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(true);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    aiNarrationEnabled: true,
    sensitivity: 2, // 2: Medium
    vibrationIntensity: 3, // 3: Strong
    emergencySirenPriority: true,
    screenWakeLock: true,
    screenStrobeOnAlert: true,
    lastAiNarration: '“ມີສຽງລົດຈັກແລ່ນຜ່ານຢ່າງໄວວາ ແລະ ສຽງແກລົດເຕືອນ 2 ຄັ້ງ ຢູ່ໃກ້ຕົວທ່ານ, ຄວນລະມັດລະວັງການຂ້າມທາງ.”',
    lastAiTime: '18:42',
  });

  // Recent sound detections list
  const [detections, setDetections] = useState<SoundDetection[]>([
    {
      id: 'det-1',
      titleLao: 'ສຽງລົດຈັກໃກ້ໆ',
      titleEn: 'Motorbike Nearby',
      category: 'danger',
      decibel: 78,
      confidence: 88,
      timeAgo: '4 ວິ ກ່ອນ',
      timestamp: Date.now() - 4000,
      icon: 'two_wheeler',
      soundKey: 'motorbike',
      vibrationType: 'ສັ່ນເຕືອນແລ້ວ',
    },
    {
      id: 'det-2',
      titleLao: 'ສຽງເຄາະປະຕູ',
      titleEn: 'Door Knocking',
      category: 'caution',
      decibel: 58,
      confidence: 92,
      timeAgo: '22 ວິ ກ່ອນ',
      timestamp: Date.now() - 22000,
      icon: 'meeting_room',
      soundKey: 'knock',
      vibrationType: 'ສັ່ນ 3 ຄັ້ງ',
    },
    {
      id: 'det-3',
      titleLao: 'ສຽງແກລົດດັງແຮງ!',
      titleEn: 'Loud Vehicle Horn Nearby',
      category: 'danger',
      decibel: 89,
      confidence: 95,
      timeAgo: '1 ນາທີ ກ່ອນ',
      timestamp: Date.now() - 60000,
      icon: 'campaign',
      soundKey: 'horn',
      vibrationType: 'ສັ່ນແຮງຫຼາຍຄັ້ງ',
    },
    {
      id: 'det-4',
      titleLao: 'ສຽງກອງວັດ / ລະຄັງ',
      titleEn: 'Temple Drum Chime',
      category: 'info',
      decibel: 52,
      confidence: 85,
      timeAgo: '5 ນາທີ ກ່ອນ',
      timestamp: Date.now() - 300000,
      icon: 'notifications_active',
      soundKey: 'temple',
      vibrationType: 'ສັ່ນສັ້ນ 1 ຄັ້ງ',
    },
  ]);

  // My Custom Saved Sounds
  const [customSounds, setCustomSounds] = useState<SoundLibraryItem[]>([
    {
      id: 'custom-1',
      titleLao: 'ກະດິ່ງປະຕູບ້ານ',
      titleEn: 'Doorbell',
      descriptionLao: 'ແຈ້ງເຕືອນ: ສັ່ນສັ້ນ 2 ຄັ້ງ (Staccato)',
      category: 'info',
      icon: 'doorbell',
      soundKey: 'doorbell',
      active: true,
      isCustom: true,
      vibrationPatternText: 'ສັ່ນສັ້ນ 2 ຄັ້ງ',
    },
    {
      id: 'custom-2',
      titleLao: 'ສຽງເອີ້ນຊື່ "ສົມສັກ"',
      titleEn: 'Calling Name "Somsack"',
      descriptionLao: 'ແຈ້ງເຕືອນ: ສັ່ນຍາວ 1 ຄັ້ງ',
      category: 'caution',
      icon: 'person_alert',
      soundKey: 'knock',
      active: true,
      isCustom: true,
      vibrationPatternText: 'ສັ່ນຍາວ 1 ຄັ້ງ',
    },
  ]);

  // Lao Starter Pack Sounds
  const [laoSounds, setLaoSounds] = useState<SoundLibraryItem[]>([
    {
      id: 'lao-1',
      titleLao: 'ສຽງລົດຕຸກຕຸກ',
      titleEn: 'Tuk-Tuk Engine',
      descriptionLao: 'ສຽງເຄື່ອງຈັກສອງຈັງຫວະ',
      category: 'danger',
      icon: 'electric_rickshaw',
      soundKey: 'tuktuk',
      active: true,
      isCustom: false,
      vibrationPatternText: 'ສັ່ນແຮງ 3 ຈັງຫວະ',
    },
    {
      id: 'lao-2',
      titleLao: 'ສຽງລົດສອງແຖວ',
      titleEn: 'Songthaew Truck',
      descriptionLao: 'ສຽງເລັ່ງເຄື່ອງລົດເມນ້ອຍ',
      category: 'danger',
      icon: 'directions_bus',
      soundKey: 'motorbike',
      active: true,
      isCustom: false,
      vibrationPatternText: 'ສັ່ນຍາວ 2 ຄັ້ງ',
    },
    {
      id: 'lao-3',
      titleLao: 'ສຽງກອງວັດ / ລະຄັງ',
      titleEn: 'Temple Drum & Bell',
      descriptionLao: 'ສຽງກອງເພນ ແລະ ສຽງຄ້ອງ',
      category: 'info',
      icon: 'notifications_active',
      soundKey: 'temple',
      active: false,
      isCustom: false,
      vibrationPatternText: 'ສັ່ນກາງ 1 ຄັ້ງ',
    },
    {
      id: 'lao-4',
      titleLao: 'ສຽງໝາເຫົ່າໃກ້ໆ',
      titleEn: 'Dog Barking',
      descriptionLao: 'ສຽງໝາເຫົ່າເຕືອນໄພອ້ອມບ້ານ',
      category: 'caution',
      icon: 'pets',
      soundKey: 'dog',
      active: true,
      isCustom: false,
      vibrationPatternText: 'ສັ່ນກະຕຸກ 2 ຄັ້ງ',
    },
    {
      id: 'lao-5',
      titleLao: 'ສຽງນ້ຳຕົ້ມຟົດ',
      titleEn: 'Boiling Water',
      descriptionLao: 'ສຽງໄອນ້ຳ ແລະ ກະຕິກນ້ຳຮ້ອນ',
      category: 'caution',
      icon: 'local_fire_department',
      soundKey: 'knock',
      active: true,
      isCustom: false,
      vibrationPatternText: 'ສັ່ນຕໍ່ເນື່ອງ 2 ວິ',
    },
  ]);

  // Screen Wake Lock API management
  const toggleWakeLock = async () => {
    if (wakeLockActive && wakeLockSentinel) {
      try {
        await wakeLockSentinel.release();
        setWakeLockSentinel(null);
        setWakeLockActive(false);
      } catch (err) {
        console.warn('Wake lock release error:', err);
      }
    } else {
      if ('wakeLock' in navigator) {
        try {
          const sentinel = await navigator.wakeLock.request('screen');
          setWakeLockSentinel(sentinel);
          setWakeLockActive(true);
        } catch {
          // Graceful fallback: set UI active
          setWakeLockActive(true);
        }
      } else {
        setWakeLockActive(!wakeLockActive);
      }
    }
  };

  useEffect(() => {
    // Attempt wake lock initialization
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(
        (sentinel) => {
          setWakeLockSentinel(sentinel);
          setWakeLockActive(true);
        },
        () => {
          // Non-fatal if blocked
          setWakeLockActive(true);
        }
      );
    }
  }, []);

  // Triggering simulated or detected sound
  const handleTriggerSound = (soundKey: string) => {
    playSyntheticSound(soundKey);

    let newDetection: SoundDetection;

    switch (soundKey) {
      case 'horn':
        newDetection = {
          id: 'det-' + Date.now(),
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
        // Auto trigger critical takeover modal for loud vehicle horn!
        setActiveTakeoverAlert(newDetection);
        break;

      case 'siren':
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ສຽງໄຊເຣນລົດສຸກເສີນ!',
          titleEn: 'Emergency Siren Detected',
          category: 'danger',
          decibel: 92,
          confidence: 97,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'e911_emergency',
          soundKey: 'siren',
          vibrationType: 'ສັ່ນສຸກເສີນຕໍ່ເນື່ອງ',
        };
        setActiveTakeoverAlert(newDetection);
        break;

      case 'motorbike':
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ສຽງລົດຈັກໃກ້ໆ',
          titleEn: 'Motorbike Acceleration',
          category: 'danger',
          decibel: 81,
          confidence: 90,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'two_wheeler',
          soundKey: 'motorbike',
          vibrationType: 'ສັ່ນເຕືອນແລ້ວ',
        };
        break;

      case 'knock':
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ສຽງເຄາະປະຕູ',
          titleEn: 'Door Knock',
          category: 'caution',
          decibel: 62,
          confidence: 94,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'meeting_room',
          soundKey: 'knock',
          vibrationType: 'ສັ່ນ 3 ຄັ້ງ',
        };
        break;

      case 'tuktuk':
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ສຽງລົດຕຸກຕຸກ',
          titleEn: 'Tuk-Tuk Engine',
          category: 'danger',
          decibel: 79,
          confidence: 91,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'electric_rickshaw',
          soundKey: 'tuktuk',
          vibrationType: 'ສັ່ນ 3 ຈັງຫວະ',
        };
        break;

      case 'doorbell':
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ກະດິ່ງປະຕູບ້ານ',
          titleEn: 'Front Doorbell',
          category: 'info',
          decibel: 68,
          confidence: 96,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'doorbell',
          soundKey: 'doorbell',
          vibrationType: 'ສັ່ນສັ້ນ 2 ຄັ້ງ',
        };
        break;

      default:
        newDetection = {
          id: 'det-' + Date.now(),
          titleLao: 'ສຽງສະພາບແວດລ້ອມ',
          titleEn: 'Ambient Sound',
          category: 'info',
          decibel: 55,
          confidence: 80,
          timeAgo: 'ດຽວນີ້',
          timestamp: Date.now(),
          icon: 'graphic_eq',
          soundKey,
          vibrationType: 'ສັ່ນປົກກະຕິ',
        };
    }

    setDetections((prev) => [newDetection, ...prev.slice(0, 19)]);
  };

  // Toggle active status in custom sounds
  const handleToggleCustomSound = (id: string) => {
    setCustomSounds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
    triggerVibration([40]);
  };

  // Toggle active status in Lao sounds
  const handleToggleLaoSound = (id: string) => {
    setLaoSounds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
    triggerVibration([40]);
  };

  const handleAddCustomSound = (sound: SoundLibraryItem) => {
    setCustomSounds((prev) => [sound, ...prev]);
  };

  const handleDeleteCustomSound = (id: string) => {
    setCustomSounds((prev) => prev.filter((item) => item.id !== id));
    triggerVibration([40]);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const unacknowledgedCount = detections.filter((d) => d.category === 'danger' && !d.acknowledged).length;

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3] flex flex-col font-lao selection:bg-[#06b6d4] selection:text-[#00424f]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        wakeLockActive={wakeLockActive}
        onToggleWakeLock={toggleWakeLock}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#0e131f] pt-24 pb-28">
        {currentTab === 'listen' && (
          <ListenLiveTab
            detections={detections}
            onTriggerAlert={handleTriggerSound}
            onOpenTakeover={(detection) => setActiveTakeoverAlert(detection)}
            sensitivityLevel={settings.sensitivity}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsTab
            detections={detections}
            onOpenTakeover={(detection) => setActiveTakeoverAlert(detection)}
            onClearHistory={() => setDetections([])}
            onTriggerAlert={handleTriggerSound}
          />
        )}

        {currentTab === 'library' && (
          <MySoundsTab
            customSounds={customSounds}
            laoSounds={laoSounds}
            onToggleSound={(id) => {
              if (customSounds.some((s) => s.id === id)) {
                handleToggleCustomSound(id);
              } else {
                handleToggleLaoSound(id);
              }
            }}
            onAddCustomSound={handleAddCustomSound}
            onDeleteCustomSound={handleDeleteCustomSound}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onToggleWakeLock={toggleWakeLock}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        unacknowledgedAlertsCount={unacknowledgedCount}
      />

      {/* Emergency Full-Screen Takeover Modal */}
      {activeTakeoverAlert && (
        <CriticalAlertModal
          alert={activeTakeoverAlert}
          strobeEnabled={settings.screenStrobeOnAlert}
          onDismiss={(action) => {
            if (activeTakeoverAlert) {
              setDetections((prev) =>
                prev.map((d) =>
                  d.id === activeTakeoverAlert.id ? { ...d, acknowledged: true } : d
                )
              );
            }
            setActiveTakeoverAlert(null);
          }}
        />
      )}
    </div>
  );
}
