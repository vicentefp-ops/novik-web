# Novik · rediseño local

Web bilingüe estática, sin dependencias de instalación. Montserrat alojada localmente, verde original #5a7032 y fotografías/logotipos recuperados de novik.ai. Inspiración de composición: periovox.ai/es/, conservando la identidad de Novik.

## Abrir

Vista previa: http://127.0.0.1:4173/es/ (español) y http://127.0.0.1:4173/ (inglés).

Si el servidor se ha cerrado, desde esta carpeta:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Editar `build.py` para contenido y plantillas; `dist/style.css` para diseño; `dist/main.js` para el menú móvil. Regenerar con `python3 build.py` y comprobar con `python3 verify.py`. El generador conserva CSS, JS y activos existentes.

## Arquitectura y conservación

20 documentos HTML completos, con títulos y descripciones específicos, canonical, hreflang recíproco ES/EN y x-default, Open Graph, WebPage JSON-LD y FAQPage en preguntas frecuentes. Sitemap XML y robots.txt. No requiere JavaScript para leer el contenido, seguir enlaces, cambiar de idioma o abrir preguntas frecuentes.

Rutas originales conservadas: /, /why-free, /partners, /api, /faqs, /contact, /legal-notice, /terms-of-use, /privacy-policy y /cookie-policy. Equivalentes españoles en /es/ y /es/<ruta>. El selector lleva a la misma página del otro idioma.

El servidor estático de Python normaliza las carpetas con barra final. Al desplegar, configurar el alojamiento para servir cada `<ruta>/index.html` en la URL canonical sin barra final, o cambiar conjuntamente canonicals, hreflang y sitemap si se prefiere normalizar con barra final. No sustituir rutas antiguas por una única landing. No reenviar rutas inexistentes a la portada: devolver 404. /dashboard pertenece a la aplicación original y no estaba en la navegación ni sitemap; cualquier tráfico de esa ruta debe revisarse antes de decidir una redirección.

Se conservan todos los temas y funcionalidades de la web informativa: apoyo clínico, complejidad del caso, interacciones, tres pasos, PubMed, DrugBank, metodología, alcance, referencias Vancouver, transparencia, 45 logotipos de sociedades, aviso de independencia, tres reconocimientos, gratuidad/beta, partners y sus categorías, API prevista y ejemplo, contacto, redes sociales y políticas. Los textos legales ES/EN de aviso, términos y privacidad se han extraído íntegros del código público. La política de cookies publicada solo contenía inglés; se ha traducido fielmente al español. El archivo original permanece en `source-original/`.

Se reformulan los titulares y el texto de presentación manteniendo su significado. Dos frases originales sin fuente —“más del 70%” y “miles de profesionales”— se conservan en el archivo original, pero no se reproducen como cifras verificadas en el rediseño. No se han añadido cifras, reseñas, testimonios ni credenciales. La FAQ de HIPAA aclara que está en exploración, en coherencia con las condiciones de uso; no afirma una certificación.

## Verificaciones realizadas

- 20 páginas: un H1, canonical, tres alternates, JSON-LD válido, imágenes con alt y referencias locales existentes.
- Sitemap XML válido; enlaces internos, activos y anclas sin referencias rotas.
- Navegador real a 390 × 844: las 20 páginas sin desbordamiento horizontal ni imágenes cargadas rotas.
- Escritorio a 1280 px: portada y composición completa revisadas; Montserrat confirmada.
- Menú móvil abre/cierra y gestiona Escape; selector ES/EN conserva la página; acordeones funcionan.
- Fotografías optimizadas a WebP, tamaño explícito, portada prioritaria y otras imágenes diferidas.
- Enlaces de entrada apuntan a app.novik.ai; contacto a info@novik.ai y WhatsApp original. No se han enviado formularios ni creado cuentas.

## Límites y publicación

Es una vista previa local, no una publicación en producción. No se ha modificado novik.ai, DNS ni el backend. No se ha realizado una auditoría formal WCAG ni medición de Core Web Vitals en producción. Los reconocimientos y las afirmaciones del servicio proceden de la web existente; no se verificaron de forma independiente. API no disponible: se mantiene “próximamente”.

No se carga analítica, publicidad ni almacenamiento del navegador en esta versión, por lo que no se requiere un banner de consentimiento para trackers inexistentes. La política legal original describe además la aplicación. Si se reincorpora Google Analytics, hacerlo solo tras consentimiento y añadir ajustes revocables. Mantener noindex por cabecera HTTP en cualquier futura vista previa pública; habilitar indexación en el dominio de producción únicamente tras publicación autorizada.

Para publicar, subir `dist/` a alojamiento estático, configurar URLs y 404, probar respuesta HTTP y caché, verificar canonicals en el dominio real y enviar sitemap a Search Console. El diseño facilita la extracción de contenido por buscadores y asistentes mediante HTML semántico y respuestas claras; no garantiza posiciones ni visibilidad en IA.
