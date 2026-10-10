# Dennis Isabel Designer — Portafolio de moda
Sitio estático responsive listo para GitHub Pages.

## Personalizar
- Edita textos y títulos en `index.html`.
- La colección ILA está en `assets/colecciones/ILA/` y se presenta en `colecciones/ila.html`.
- Los bocetos y el PDF de Mater Dolorosa están en `assets/bocetos/` y se presentan en `bocetos.html`.
- Para añadir otra colección, crea una carpeta dentro de `assets/colecciones/` y una página con el nombre de la colección dentro de `colecciones/`.
- Actualiza el correo de contacto de Dennis Isabel en `index.html` cuando sea necesario.
- Modifica la paleta en `assets/css/style.css` (`:root`).

## Publicar
Sube el contenido del proyecto a un repositorio público. En Settings → Pages selecciona Deploy from a branch → main → /(root) → Save.

## SEO e indexación
- El dominio canónico es `https://dennisisabeldesigner.com/` y se conserva mediante `CNAME`.
- `robots.txt` permite el rastreo y declara `https://dennisisabeldesigner.com/sitemap.xml`.
- Después de publicar, verifica el dominio en Google Search Console y envía `sitemap.xml` desde el informe **Sitemaps**.
- Usa **Inspección de URLs** en Search Console para solicitar la indexación inicial de la portada y de las páginas de cada colección.
- Mantén las URLs canónicas y el sitemap sincronizados cuando agregues nuevas colecciones.
