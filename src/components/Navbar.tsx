import React from 'react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unacknowledgedAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  unacknowledgedAlertsCount = 0,
}) => {
  const tabs = [
    {
      id: 'listen',
      labelLao: 'ຟັງສຽງ',
      icon: 'graphic_eq',
    },
    {
      id: 'alerts',
      labelLao: 'ແຈ້ງເຕືອນ',
      icon: 'emergency_home',
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : null,
    },
    {
      id: 'library',
      labelLao: 'ສຽງຂອງຂ້ອຍ',
      icon: 'library_music',
    },
    {
      id: 'settings',
      labelLao: 'ຕັ້ງຄ່າ',
      icon: 'tune',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#080e1a]/95 backdrop-blur-xl border-t border-[#3d494c]/30 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="h-20 px-2 flex items-center justify-around max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[70px] h-14 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#4cd7f6] scale-105'
                  : 'text-[#bcc9cd] hover:text-[#dde2f3] active:scale-95'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>

                {/* Badge indicator if any */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffb4ab] text-[#690005] font-bold text-[10px] animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="font-mono-cyber text-[0.75rem] tracking-wide mt-1 font-medium">
                {tab.labelLao}
              </span>

              {/* Active glow pip */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-6 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
