import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI if API key exists
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Narration endpoint for situational assistance in Lao
app.post('/api/narrate', async (req, res) => {
  try {
    const { soundLabel, category, decibel, time } = req.body;

    // Default fallback responses in case AI is offline or without key
    const fallbackResponses: Record<string, string> = {
      'ສຽງແກລົດດັງແຮງ': '“ມີສຽງແກລົດດັງເຕືອນແຮງຢູ່ໃກ້ຕົວທ່ານ, ອາດມີລົດກຳລັງແລ່ນເຂົ້າໃກ້ ຫຼື ສັນຍານເຕືອນໄພ ກະລຸນາຢຸດ ແລະ ຫຼຽວເບິ່ງຊ້າຍ-ຂວາທັນທີ.”',
      'ສຽງລົດຈັກໃກ້ໆ': '“ມີສຽງລົດຈັກແລ່ນຜ່ານຢ່າງໄວວາ ແລະ ສຽງແກລົດເຕືອນ 2 ຄັ້ງ ຢູ່ໃກ້ຕົວທ່ານ, ຄວນລະມັດລະວັງການຂ້າມທາງ.”',
      'ສຽງເຄາະປະຕູ': '“ມີສຽງເຄາະປະຕູຫ້ອງ 3 ຄັ້ງຕິດຕໍ່ກັນ, ອາດມີແຂກ ຫຼື ຜູ້ມາຕິດຕໍ່ລໍຖ້າຢູ່ໜ້າປະຕູ.”',
      'ສຽງໄຊເຣນລົດສຸກເສີນ': '“ມີສຽງໄຊເຣນລົດສຸກເສີນ ຫຼື ລົດດັບເພີງດັງຂຶ້ນໃນບໍລິເວນໃກ້ຄຽງ, ກະລຸນາກວດສອບເສັ້ນທາງ ແລະ ຫຼີກທາງໃຫ້ລົດສຸກເສີນ.”',
      'ສຽງລົດຕຸກຕຸກ': '“ມີສຽງເຄື່ອງຈັກລົດຕຸກຕຸກແລ່ນເຂົ້າມາໃກ້ບໍລິເວນທາງຍ່າງ, ລະວັງການຫຼົບຫຼີກ.”',
      'ສຽງລົດສອງແຖວ': '“ມີສຽງເລັ່ງເຄື່ອງລົດສອງແຖວກຽມອອກໂຕ ຫຼື ບີບແກຮັບຜູ້ໂດຍສານ.”',
      'ສຽງກອງວັດ / ລະຄັງ': '“ສຽງກອງເພນ ຫຼື ສຽງລະຄັງວັດດັງບອກເວລາ, ເປັນສັນຍານເວລາປົກກະຕິ.”',
      'ສຽງໝາເຫົ່າໃກ້ໆ': '“ມີສຽງໝາເຫົ່າເຕືອນຢູ່ໃກ້ຕົວ, ລະວັງສັດລ້ຽງ ຫຼື ສິ່ງຜິດປົກກະຕິອ້ອມຂ້າງ.”',
      'ສຽງນ້ຳຕົ້ມຟົດ': '“ສຽງນ້ຳຕົ້ມຟົດ ຫຼື ໄອນ້ຳດັງແຮງ, ກະລຸນາກວດເບິ່ງໝໍ້ຕົ້ມ ຫຼື ກະຕິກນ້ຳຮ້ອນ.”',
    };

    if (!ai) {
      const fallback = fallbackResponses[soundLabel] || `“ກວດພົບ ${soundLabel} ຄວາມດັງ ${decibel || 65} dB, ກະລຸນາກວດເບິ່ງສະພາບແວດລ້ອມອ້ອມຕົວທ່ານ.”`;
      return res.json({
        narration: fallback,
        source: 'on-device-offline',
      });
    }

    const prompt = `You are DeafSound AI, an assistive situational narration assistant for deaf and hard-of-hearing users in Laos.
A sound has just been detected by the phone:
- Detected Sound: ${soundLabel || 'ສຽງແກລົດດັງແຮງ'}
- Category: ${category || 'Danger / ອັນຕະລາຍ'}
- Decibel Level: ${decibel || 75} dB
- Time: ${time || new Date().toLocaleTimeString()}

Generate a 1-sentence or 2-sentence situational context explanation and safe practical advice written in natural, clear Lao language (ພາສາລາວ) with quotation marks.
It should be empathetic, direct, concise, and easy to read at a glance for someone who cannot hear.
Only output the Lao text in quotes (e.g. “...” ), nothing else.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const narration = response.text?.trim() || fallbackResponses[soundLabel] || `“ກວດພົບ ${soundLabel} ຢູ່ໃກ້ທ່ານ, ກະລຸນາສັງເກດສິ່ງອ້ອມຂ້າງ.”`;

    return res.json({
      narration,
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Narration error:', error);
    res.json({
      narration: '“ມີສຽງລົດຈັກແລ່ນຜ່ານຢ່າງໄວວາ ແລະ ສຽງແກລົດເຕືອນ 2 ຄັ້ງ ຢູ່ໃກ້ຕົວທ່ານ, ຄວນລະມັດລະວັງການຂ້າມທາງ.”',
      source: 'fallback',
    });
  }
});

// Production static file serving or Dev Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`DeafSound server listening on port ${port}`);
  });
}

startServer();
