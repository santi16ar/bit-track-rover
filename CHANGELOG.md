# Changelog

## [No publicado] - 2026-09-30

### Agregado
- Web: opción "Eliminar mi cuenta y mis datos" en `homedp.html` (Zona de peligro + modal con confirmación por contraseña).
- API: nuevo endpoint `DELETE api.php?resource=cuenta` que verifica la contraseña, libera el rover (`disponible = TRUE`) y borra el usuario de la base de datos.

### Cambiado
- App: iconos de la barra inferior en `BitTrackRover.jsx` (`BottomBar`). Se reemplazan los emojis 🏠/🤖/👤 por SVG propios (`IconHome`, `IconRover`, `IconUser`) sin fondo y con color según tema/activo.
