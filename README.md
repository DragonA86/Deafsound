# DeafSound (ສຽງເຕືອນ) - Assistive Environmental Sound Detection for Laos

**DeafSound** is an assistive web application engineered for deaf and hard-of-hearing individuals across Laos. It provides real-time environmental sound detection, multi-modal tactile vibration alerting, and intelligent AI-powered situational narration in Lao (ພາສາລາວ) and English.

---

## 🌟 Key Features

### 1. ຟັງສຽງ (Listen Live Detection)
- **Real-Time Sound Meter & Decibel Visualizer**:
  - Live acoustic monitoring using the Web Audio API (`navigator.mediaDevices.getUserMedia` + `AnalyserNode`) to measure real-world decibels (dB).
  - Ambient fluctuation simulation fallback when microphone access is unavailable.
  - Visual status indications: **ສະພາບປົກກະຕິ (Normal)**, **ມີສຽງດັງ (Loud)**, and **ອັນຕະລາຍ (Danger)**.
- **Interactive Sound Simulator**:
  - Quick test buttons for immediate sound and vibration triggers:
    - 📢 **ແກລົດດັງ** (Vehicle Horn - Danger takeover)
    - 🏍️ **ລົດຈັກ** (Motorbike acceleration - Danger)
    - 🚪 **ເຄາະປະຕູ** (Door knock - Caution)
    - 🚑 **ໄຊເຣນ** (Emergency Siren - Critical alert)
    - 🛺 **ລົດຕຸກຕຸກ** (Lao Tuk-Tuk - Danger)
    - 🔔 **ກະດິ່ງ** (Doorbell - Info)
- **Vibration & Haptic Guidance**:
  - Direct integration with `navigator.vibrate` for tactile feedback.
  - Visual color indicators for alert severity (Red: Danger, Amber: Caution, Cyan: Normal).
- **Recent Sound Detections Stream**:
  - Live feed with confidence scores (e.g., 88%, 92%), elapsed time (e.g., "4 ວິ ກ່ອນ"), and sound category classification.

### 2. Critical Alert Takeover (ແຈ້ງເຕືອນສຸກເສີນ)
- **Full-Screen Emergency Takeover**:
  - High-urgency visual takeover styled with a dark crimson background (`#93000a`), glowing borders, and pulsating warning rings.
  - Clear multi-script typography: Lao bold warning (**ສຽງແກລົດດັງແຮງ!**) and English subtitle (**Loud Vehicle Horn Nearby**).
  - Continuous emergency vibration pattern (`[300, 100, 300, 100, 500]`).
  - Screen Strobe Flash: Red visual flashing to notify deaf users in loud or dim settings.
- **Action Controls**:
  - **✓ ຮັບຊາບແລ້ວ · Got it**: Acknowledges and clears the emergency alert.
  - **✕ ບໍ່ແມ່ນ · Wrong**: Submits a false alarm report.

### 3. ສຽງຂອງຂ້ອຍ (My Sounds Library)
- **Friendly Sound Recorder**:
  - 3-step intuitive recording guide: 
    1. ກົດປຸ່ມອັດ (Press Record)
    2. ສ້າງສຽງ 3 ຄັ້ງ (Make Sound 3 Times)
    3. ພ້ອມເຕືອນ (Ready to Alert)
  - Custom sound recorder modal with custom naming, 3-sample audio capture progression, and customizable vibration patterns (Staccato 2x, Long 1x, Triple Burst 3x).
  - Slot counter: Shows remaining recording storage (e.g., 8 of 10 available slots).
- **My Saved Custom Sounds**:
  - Manage and toggle custom user sounds (e.g., "ກະດິ່ງປະຕູບ້ານ", "ສຽງເອີ້ນຊື່ 'ສົມສັກ'").
  - "ທົດສອບສຽງ" (Test Sound) button to audition the acoustic synthesis and vibration.
- **Lao Starter Pack (ຊຸດສຽງທ້ອງຖິ່ນລາວ)**:
  - Pre-calibrated local sounds specific to Lao urban and rural life:
    - 🛺 **ສຽງລົດຕຸກຕຸກ** (Two-stroke Tuk-Tuk engine)
    - 🚌 **ສຽງລົດສອງແຖວ** (Songthaew passenger truck acceleration)
    - 🔔 **ສຽງກອງວັດ / ລະຄັງ** (Temple drum & gong chime)
    - 🐕 **ສຽງໝາເຫົ່າໃກ້ໆ** (Dog barking)
    - 🔥 **ສຽງນ້ຳຕົ້ມຟົດ** (Boiling water / kettle steam)

### 4. ຕັ້ງຄ່າ (Settings & AI Narration)
- **AI Situational Narration**:
  - Integrates Gemini AI (`gemini-3.8-flash`) via the server-side `/api/narrate` route to translate detected environmental sounds into natural, empathetic Lao situational guidance.
  - Built-in on-device privacy guarantee ("ສຽງບໍ່ເຄີຍອອກຈາກເຄື່ອງ • ປະມວນຜົນພາຍໃນໂທລະສັບ 100%").
- **Sensitivity & Haptics Tuning**:
  - **ລະດັບການຮັບສຽງ (Sensitivity)**: Low (ຕໍ່າ), Medium (ປານກາງ), High (ສູງ).
  - **ຄວາມແຮງຂອງການສັ່ນເຕືອນ (Vibration Intensity)**: Light (ເບົາ), Medium (ປານກາງ), Strong (ແຮງ).
  - **Emergency Siren Priority Mode**: Always trigger strong vibration for emergency vehicles.
  - **Screen Strobe Flash**: Red screen flash toggle.
  - **Screen Wake Lock**: Keeps display awake while monitoring ambient sounds (`navigator.wakeLock`).
  - **Haptic Test Bench**: Test Staccato, Long hum, and Danger vibration patterns.
  - **Diagnostics JSON Export**: Copy diagnostic metrics and runtime parameters.

---

## 🏗️ Project Architecture & Directory Structure

```text
├── index.html                     # Main HTML entry with Noto Sans Lao & JetBrains Mono fonts
├── metadata.json                  # AI Studio applet metadata & permissions
├── package.json                   # Dependencies, scripts, and server configuration
├── tsconfig.json                  # TypeScript compiler settings
├── vite.config.ts                 # Vite bundler configuration
├── server.ts                      # Full-stack Express server with Gemini API endpoint & Vite middleware
└── src/
    ├── main.tsx                   # React application mount
    ├── App.tsx                    # Root component handling navigation, wake lock, and alert states
    ├── index.css                  # Tailwind CSS v4 styling, custom cyber theme variables, and keyframe animations
    ├── types.ts                   # TypeScript interfaces for sounds, detections, and app settings
    ├── utils/
    │   └── audio.ts               # Web Audio API synthesizers and navigator.vibrate haptic helpers
    └── components/
        ├── Logo.tsx               # Neon glowing cyan DeafSound ear logo SVG
        ├── Header.tsx             # Top navigation bar with status badges, wake lock, and profile
        ├── Navbar.tsx             # Bottom navigation dock with 4 tab targets
        ├── ListenLiveTab.tsx      # Tab 1: Live decibel meter, listening visualizer, and quick triggers
        ├── AlertsTab.tsx          # Tab 2: Full alert history log, search, category filter, and takeover tester
        ├── MySoundsTab.tsx        # Tab 3: Custom 3-step sound recorder and Lao starter pack sounds
        ├── SettingsTab.tsx        # Tab 4: AI narration settings, sensitivity sliders, and haptic test bench
        └── CriticalAlertModal.tsx # Full-screen emergency alert takeover modal
```

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend / API**: [Express](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx)
- **AI Engine**: Google Gen AI SDK (`@google/genai`) running `gemini-3.8-flash` on `server.ts`
- **Audio & Haptics**: Web Audio API (`AudioContext`, `AnalyserNode`, `OscillatorNode`), Web Vibration API (`navigator.vibrate`), and Screen Wake Lock API (`navigator.wakeLock`)

---

## 🚀 Running the Application

### Development Mode
To start the full-stack dev server with live Vite middleware:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build
To compile the TypeScript bundle and production assets:
```bash
npm run build
```

To run the production server:
```bash
npm start
```

---

## 🔒 Privacy & Offline Operation

- **100% Offline-Ready**: Sound waveform analysis, decibel metering, synthetic audio cues, and tactile vibration run entirely on the client device.
- **Privacy-First**: Audio captured by the microphone is processed within the browser's volatile memory via `AudioContext` and is never uploaded or saved to external servers.
