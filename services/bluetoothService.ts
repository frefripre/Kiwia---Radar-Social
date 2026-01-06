
import { NearbyDevice } from '../types';

/**
 * Calcula una distancia relativa para el radar basada en el RSSI.
 * @param rssi Valor de potencia de señal (ej: -60)
 * @returns Valor entre 10 y 95 para la propiedad distance del radar.
 */
const calculateDistanceIndicator = (rssi: number): number => {
  // Modelo de pérdida en el camino: d = 10 ^ ((MeasuredPower - RSSI) / (10 * N))
  // MeasuredPower (RSSI a 1 metro) suele ser -59
  // N (factor ambiental) suele ser 2.0 para espacios abiertos
  const txPower = -59;
  const n = 2.0;
  
  try {
    const distanceMeters = Math.pow(10, (txPower - rssi) / (10 * n));
    // Mapeamos metros a escala radar 0-100
    // Asumimos que el radio del radar son 20 metros
    const radarScale = (distanceMeters / 20) * 100;
    return Math.min(95, Math.max(15, radarScale));
  } catch (e) {
    return 40 + Math.random() * 40;
  }
};

export const scanForRealDevices = async (): Promise<NearbyDevice | null> => {
  const nav = navigator as any;
  if (!nav.bluetooth) {
    console.warn("Web Bluetooth API no disponible en este navegador.");
    alert("Para usar el escaneo real necesitas: \n1. Estar en un navegador moderno (Chrome/Edge/Opera).\n2. Tener conexión segura HTTPS.\n3. Activar Bluetooth en tu sistema.");
    return null;
  }

  try {
    console.log("Solicitando dispositivo Bluetooth...");
    // Solicitamos el dispositivo al usuario
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information']
    });

    console.log("Dispositivo vinculado:", device.name, device.id);

    let finalDistance = 30 + Math.random() * 50; // Fallback inicial

    // Intentamos obtener RSSI real si el navegador lo soporta (Chrome/Edge con flags o versiones recientes)
    if (device.watchAdvertisements) {
      console.log("Intentando capturar RSSI...");
      try {
        await device.watchAdvertisements();
        
        // Creamos una promesa que se resuelve con el primer evento de anuncio recibido
        const rssiPromise = new Promise<number | null>((resolve) => {
          const onAdvertisement = (event: any) => {
            console.log(`RSSI capturado: ${event.rssi} dBm`);
            device.removeEventListener('advertisementreceived', onAdvertisement);
            resolve(event.rssi);
          };
          
          device.addEventListener('advertisementreceived', onAdvertisement);
          
          // Timeout de 2 segundos para no bloquear la UI si no hay anuncios inmediatos
          setTimeout(() => {
            device.removeEventListener('advertisementreceived', onAdvertisement);
            resolve(null);
          }, 2000);
        });

        const realRssi = await rssiPromise;
        if (realRssi !== null) {
          finalDistance = calculateDistanceIndicator(realRssi);
          console.log("Distancia radar calculada:", finalDistance);
        }
      } catch (advError) {
        console.warn("watchAdvertisements falló o no está permitido:", advError);
      }
    }

    return {
      id: device.id,
      username: device.name || `Pasajero_${device.id.slice(-4)}`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${device.id}`,
      distance: finalDistance,
      angle: Math.random() * 360
    };
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.log('Búsqueda cancelada por el usuario.');
    } else {
      console.error('Error de Bluetooth:', error);
      alert("Error al acceder a Bluetooth. Asegúrate de que esté encendido y tengas permisos.");
    }
    return null;
  }
};
