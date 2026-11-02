# Changelog

## [No publicado] - 2026-09-30

### Agregado
- Web: opción "Eliminar mi cuenta y mis datos" en `homedp.html` (Zona de peligro + modal con confirmación por contraseña).
- API: nuevo endpoint `DELETE api.php?resource=cuenta` que verifica la contraseña, libera el rover (`disponible = TRUE`) y borra el usuario de la base de datos.

### Cambiado
- App: iconos de la barra inferior en `BitTrackRover.jsx` (`BottomBar`). Se reemplazan los emojis 🏠/🤖/👤 por SVG propios (`IconHome`, `IconRover`, `IconUser`) sin fondo y con color según tema/activo.

## [No publicado] - 2026-10-01
### Seguridad
- API: credenciales MySQL movidas de `frontend/web/api.php` a `frontend/web/config.php` (ignorado por git). Se agrega `config.example.php`.
- Repo: se agrega `frontend/web/config.php` a `.gitignore` para no exponer user/pass.
- Gitlab: se añade enlace a gitlab

## [No publicado] - 2026-10-21

### Agregado
- Web: nueva página de `términos y condiciones` (`frontend/web/terms.html` + `frontend/web/stylesterms.css`) con 15 secciones, índice lateral fijo con resaltado de la sección activa y hoja de estilos de impresión.

### Cambiado
- Web: el enlace "términos y condiciones" del registro (`opc1.html`) ahora apunta a `terms.html` en lugar de al login.
- Web: se agrega el enlace "Términos y condiciones" al pie de `index.html`.

## [No publicado] - 2026-10-27

### Agregado
- Web: control por Bluetooth en `frontend/web/homemirover.html`. Se reemplaza la tarjeta de estado/batería por una tarjeta "Control Bluetooth" con botón "Prender / conectar" y mensaje de estado (`aria-live`), junto a estilos nuevos en `frontend/web/style_mirover.css`.
- Web: botón flotante de WhatsApp en `frontend/web/index.html` (enlace `wa.me` con mensaje predeterminado) y estilos `.whatsapp-float` en `frontend/web/styles.css`.
- Firmware: nuevas funciones `girarDerecha()` e `girarIzquierda()` en `firmware/PROGRAMA ARDUINO`, con una secuencia de prueba en `loop()` (avanzar, girar a la derecha, detener).

### Cambiado
- Web: corrección de ortografía y mayúsculas en `frontend/web/index.html` ("Características", "Funcionamiento", "Beneficios", "Acceder", "Solicitar una demo", "¿Olvidaste tu contraseña?", "¿No tenés una cuenta?").
- Firmware: simplificación del programa de pruebas en `firmware/PROGRAMA ARDUINO`: se elimina el control del servo de la tapa (`ESP32Servo.h`, `PIN_SERVO`, `gestionarApertura()`) y los comentarios innecesarios.

## [No publicado] - 2026-11-2

### Agregado
- se pasa el repositorio al gitlab 

### Cambiado
- se actualiza el changelog