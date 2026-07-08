
# Bit-Track-Rover

Bit-Track-Rover es un carrito robotizado diseñado para transportar objetos entre puntos dentro de un centro de salud, El objetivo del proyecto es facilitar el flujo de materiales —medicamentos, muestras, insumos— reduciendo tiempos de desplazamiento y liberando al personal para tareas de mayor valor.

## Características principales
- Transporte autónomo de punto A a punto B.
- Navegación por seguimiento de línea (sensor óptico detecta una línea en el suelo).
- Control y activación del recorrido mediante una aplicación móvil (prototipo de app; conexión básica).
- Estructura compacta y modular para adaptar carga y componentes electrónicos.
- Interfaz simple para definir origen/destino y comenzar el trayecto.

## Caso de uso 
1. el Personal de un hospital coloca un paquete en el carrito en el punto A.
2. Desde la app, selecciona “Enviar a B” y activa el recorrido.
3. El carrito sigue la línea pintada en el suelo hasta llegar al punto B y detiene el motor.
4. Personal en B retira la carga y, si se desea, envía el carrito de vuelta.

## Estado del proyecto
- Navegación: En proceso.
- App: En proceso.
- Hardware: chasis, motor, controlador, sensores ópticos y batería integrados.
- Web: En proceso.
- Futuras mejoras previstas: rutas múltiples, mapeo y planificación de trayecto, mayor comunicación bidireccional con la app, sensores de seguridad (ultrasonidos/LiDAR), gestión de colisiones.

## Componentes (resumen)
- Microcontrolador (ej.: Arduino / ESP32)
- Drivers de motor
- Motores DC con ruedas
- Sensores de línea (arrays de IR)
- Batería recargable
- Chasis y plataforma para carga
- Módulo de comunicación (Bluetooth / Wi‑Fi) para la app
- App móvil (Android/iOS) — prototipo

## Cómo contribuir
- Mejoras al firmware (mejor control de motores, calibración de sensores).
- Desarrollo de la app (UI, conexión segura, estado en tiempo real).
- Integración de rutas múltiples y lógica de planificación.
- Añadir sensores de seguridad y manejo de errores.
- Diseños mejorados de chasis y gestión de batería.

## Licencia
Orvion Robotics 2026
