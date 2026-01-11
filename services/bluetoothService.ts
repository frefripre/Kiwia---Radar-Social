
import { NearbyDevice } from '../types';

/**
 * Calcula una distancia relativa para el radar basada en el RSSI.
 * @param rssi Valor de potencia de señal (ej: -60)
 * @returns Valor entre 10 y 95 para la propiedad distance del radar.
 */
const calculateDistanceIndicator = (rssi: number): number => {
  // Modelo de pérdida en el camino: d = 10 ^ ((MeasuredPower - RSSI) / (10 * N))
  const txPower = -59;
  const n = 2.0;
  
  try {
    const distanceMeters = Math.pow(10, (txPower - rssi) / (10 * n));
    // Mapeamos metros a escala radar 0-100
    const radarScale = (distanceMeters / 20) * 100;
    return Math.min(95, Math.max(15, radarScale));
  } catch (e) {
    return 40 + Math.random() * 40;
  }
};

// Icono de persona genérico en formato SVG Data URI
const GENERIC_PERSON_ICON = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23444444'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>`;

export const scanForRealDevices = async (): Promise<NearbyDevice | null> => {
  const nav = navigator as any;
  if (!nav.bluetooth) {
    console.warn("Web Bluetooth API no disponible en este navegador.");
    alert("Para usar el escaneo real necesitas: \n1. Estar en un navegador moderno (Chrome/Edge/Opera).\n2. Tener conexión segura HTTPS.\n3. Activar Bluetooth en tu sistema.");
    return null;
  }

  try {
    console.log("Solicitando dispositivo Bluetooth...");
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information']
    });

    console.log("Dispositivo vinculado:", device.name, device.id);

    let finalDistance = 30 + Math.random() * 50; 

    if (device.watchAdvertisements) {
      try {
        await device.watchAdvertisements();
        
        const rssiPromise = new Promise<number | null>((resolve) => {
          const onAdvertisement = (event: any) => {
            device.removeEventListener('advertisementreceived', onAdvertisement);
            resolve(event.rssi);
          };
          
          device.addEventListener('advertisementreceived', onAdvertisement);
          
          setTimeout(() => {
            device.removeEventListener('advertisementreceived', onAdvertisement);
            resolve(null);
          }, 2000);
        });

        const realRssi = await rssiPromise;
        if (realRssi !== null) {
          finalDistance = calculateDistanceIndicator(realRssi);
        }
      } catch (advError) {
        console.warn("watchAdvertisements falló:", advError);
      }
    }

    return {
      id: device.id,
      username: device.name || `Pasajero_${device.id.slice(-4)}`,
      avatar: GENERIC_PERSON_ICON,
      distance: finalDistance,
      angle: Math.random() * 360
    };
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.log('Búsqueda cancelada por el usuario.');
    } else {
      console.error('Error de Bluetooth:', error);
      alert("Error al acceder a Bluetooth.");
    }
    return null;
  }
};
