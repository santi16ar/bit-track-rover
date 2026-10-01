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