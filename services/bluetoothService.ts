
import { NearbyDevice } from '../types';

export const scanForRealDevices = async (): Promise<NearbyDevice | null> => {
  const nav = navigator as any;
  if (!nav.bluetooth) {
    console.error("Web Bluetooth API no disponible.");
    alert("Para usar el escaneo real necesitas: \n1. Estar en un navegador moderno (Chrome/Edge).\n2. Tener conexión segura HTTPS.\n3. Activar Bluetooth en tu sistema.");
    return null;
  }

  try {
    // Buscamos dispositivos cercanos que estén anunciándose (advertising)
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'heart_rate']
    });

    return {
      id: device.id,
      username: device.name || 'Dispositivo BLE',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${device.id}`,
      distance: 20,
      angle: Math.random() * 360
    };
  } catch (error) {
    console.log('Búsqueda cancelada o fallida.');
    return null;
  }
};
