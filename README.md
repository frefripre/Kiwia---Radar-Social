🥝 Kiwia — Local Radar & AI Moments
"No solo esperes. Conecta."
Kiwia es una aplicación web experimental y de vanguardia diseñada para transformar la experiencia de esperar el transporte público. Utilizando tecnologías de proximidad (Bluetooth) e Inteligencia Artificial Generativa (Google Veo), Kiwia permite a los usuarios descubrir y chatear con otras personas en su mismo paradero, convirtiendo tiempos muertos en momentos de conexión social y creatividad.
✨ Características Principales
📡 Radar de Proximidad (Web Bluetooth)
Detecta dispositivos cercanos en tiempo real utilizando la Web Bluetooth API. La interfaz visual simula un radar cinemático que calcula la distancia relativa de otros usuarios basándose en la potencia de la señal (RSSI), permitiendo ver quién está a pocos metros de ti.
💬 Chat Local Efímero
Integrado con Firebase Firestore, ofrece un sistema de mensajería instantánea en tiempo real. Los canales de chat se generan dinámicamente entre usuarios cercanos, fomentando conversaciones breves y seguras que duran lo que dura la espera del bus.
🎬 Kiwia Moments (AI Generativa)
Impulsado por Google Gemini & Veo 3.1, los usuarios pueden generar "promos" cinematográficas personalizadas. Mediante presets o descripciones propias, la IA crea videos de alta calidad (9:16) con estética Cyberpunk y Neon-Lime para compartir en redes sociales.
🎨 Interfaz Ultra-Moderna
Diseño orientado a dispositivos móviles con una estética Dark Premium:
Paleta: Negro profundo con acentos en Lime Green (#84cc16).
Tipografía: Plus Jakarta Sans para un look tecnológico y legible.
Animaciones: Transiciones suaves, efectos de pulso de radar y estelas de escaneo desarrolladas con Tailwind CSS.
🛠️ Stack Tecnológico
Frontend: React 18 (Arquitectura ESM nativa) y Tailwind CSS.
Backend/DB: Firebase (App Core & Firestore para tiempo real).
IA: Google GenAI SDK (Modelos gemini-3-flash y veo-3.1-fast).
Hardware Interfacing: Web Bluetooth API para escaneo de dispositivos.
Transpiler: Babel Standalone (para ejecución directa en navegadores sin necesidad de bundlers pesados).
🚀 Instalación y Configuración
El proyecto está diseñado para ser ligero y funcionar directamente desde un servidor web (como cPanel o Firebase Hosting).
Firebase: Configura un proyecto en la consola de Firebase, habilita Firestore y reemplaza las credenciales en services/firebase.ts.
Gemini API: Requiere una API_KEY de Google AI Studio configurada en el entorno o mediante el selector integrado en la app para funciones de video.
Despliegue: Sube los archivos a tu servidor. Asegúrate de que el servidor soporte acceso por HTTPS (obligatorio para usar la API de Bluetooth).
📱 Flujo de Usuario
Splash & Hero: Introducción a la propuesta de valor de Kiwia.
Perfil: Configuración rápida de identidad con avatares dinámicos (DiceBear API) o fotos personalizadas.
Radar: Escaneo automático de personas en el entorno cercano.
Interacción: Selección de usuario e inicio de conversación encriptada por sesión.
Moments: Creación de contenido audiovisual con IA para potenciar la marca personal del usuario.
🔒 Privacidad y Seguridad
Kiwia prioriza la seguridad del usuario:
Datos Locales: El perfil se almacena exclusivamente en el localStorage del navegador.
Bluetooth: El acceso a dispositivos requiere permiso explícito del usuario en cada sesión.
Sin Rastreo: No se almacenan coordenadas GPS exactas, solo proximidad relativa entre dispositivos.
Desarrollado con ❤️ para mejorar la movilidad urbana y la conectividad humana.
