# SEO-analys: Timer & Klocka

**Datum:** 2025-10-21
**URL:** https://mackan.eu/timer/

---

## Nuvarande SEO-status

### ✅ Vad som redan fungerar bra:

1. **HTML-struktur**
   - ✅ Semantisk HTML (`<header>`, `<h1>`, etc.)
   - ✅ Korrekt `lang="sv"` attribut
   - ✅ Viewport meta-tag för mobil
   - ✅ UTF-8 charset

2. **PWA**
   - ✅ PWA manifest
   - ✅ Theme color
   - ✅ Service Worker

3. **Grundläggande meta**
   - ✅ Basic description
   - ✅ Title tag

### ❌ Vad som saknas:

1. **Meta-taggar**
   - ❌ Keywords (meta keywords)
   - ❌ Author
   - ❌ Canonical URL
   - ❌ Open Graph tags (Facebook/LinkedIn)
   - ❌ Twitter Cards
   - ❌ Språkalternativ (hreflang)

2. **Strukturerad data**
   - ❌ JSON-LD Schema.org markup
   - ❌ WebApplication schema
   - ❌ Breadcrumbs

3. **SEO-filer**
   - ❌ robots.txt
   - ❌ sitemap.xml
   - ❌ humans.txt

4. **Innehåll**
   - ❌ Bättre title (för kort och generisk)
   - ❌ Längre description med keywords
   - ❌ H2-H6 headings med keywords
   - ❌ Alt-text på bilder/ikoner
   - ❌ Intern länkstruktur

5. **Tekniskt**
   - ❌ HTTPS (bör verifieras)
   - ❌ Page speed optimization
   - ❌ Image optimization
   - ❌ Lazy loading

---

## Målsökord (Keywords)

### Primära sökord (svenska):
- timer online
- nedräkningstimer
- klocka online
- fullskärms timer
- övningstimer
- stabsövning timer
- presentation timer
- digital klocka

### Sekundära sökord (svenska):
- timer med ljud
- timer för övningar
- stoppur online
- nedräkning fullskärm
- taktisk timer
- militär timer
- övningsklocka

### Engelska sökord (för internationell räckvidd):
- online timer
- countdown timer
- fullscreen timer
- exercise timer
- presentation timer
- military timer
- tactical clock

### Long-tail keywords:
- "timer för stabsövningar"
- "fullskärm nedräkningstimer med ljud"
- "online timer med olika teman"
- "timer som håller skärmen påslagen"
- "offline timer PWA"

---

## Konkurrentanalys

### Liknande tjänster:
1. **online-timer.net**
   - Stor spelare
   - Mycket enkel
   - Dålig mobilupplevelse

2. **timer.net**
   - Professionell
   - Många annonser
   - Ingen offline-funktion

3. **vclock.com**
   - Fokus på klockor
   - Minimalistisk
   - Inga avancerade funktioner

### Vår konkurrensfördel:
- ✨ PWA med offline-funktion
- ✨ 8 olika teman (inklusive taktiskt)
- ✨ Övningsspecifika funktioner
- ✨ Tillgänglighet (a11y)
- ✨ Touch-gester
- ✨ Ingen reklam
- ✨ Open source
- ✨ Svenska + Engelska

---

## Rekommenderade SEO-åtgärder

### Prioritet 1 (Kritiskt):

1. **Förbättra Title-tag**
   ```html
   <title>Timer & Klocka Online - Professionell Nedräkningstimer med Fullskärm | Gratis</title>
   ```

2. **Utökad description**
   ```html
   <meta name="description" content="Professionell online timer och klocka med 8 teman, fullskärmsläge, ljud och offline-stöd. Perfekt för övningar, presentationer och stabsövningar. Fungerar utan internet. 100% gratis.">
   ```

3. **Keywords meta**
   ```html
   <meta name="keywords" content="timer online, nedräkningstimer, klocka online, fullskärm timer, övningstimer, stabsövning, presentation timer, offline timer, PWA timer">
   ```

4. **Canonical URL**
   ```html
   <link rel="canonical" href="https://mackan.eu/timer/">
   ```

5. **Open Graph tags**
   ```html
   <meta property="og:type" content="website">
   <meta property="og:title" content="Timer & Klocka Online - Professionell Nedräkningstimer">
   <meta property="og:description" content="Professionell timer med 8 teman, fullskärm och offline-stöd. Perfekt för övningar och presentationer.">
   <meta property="og:url" content="https://mackan.eu/timer/">
   <meta property="og:image" content="https://mackan.eu/timer/og-image.png">
   ```

6. **Strukturerad data (JSON-LD)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "Timer & Klocka",
     "description": "Professionell online timer och klocka",
     "applicationCategory": "UtilitiesApplication",
     "operatingSystem": "Any",
     "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "SEK"
     }
   }
   ```

### Prioritet 2 (Viktigt):

7. **robots.txt**
   ```
   User-agent: *
   Allow: /
   Sitemap: https://mackan.eu/timer/sitemap.xml
   ```

8. **sitemap.xml**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://mackan.eu/timer/</loc>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
   </urlset>
   ```

9. **Lägg till innehåll**
   - Sektion med "Vad är detta?" (H2)
   - "Funktioner" lista (H2)
   - "Hur använder jag timern?" (H2)
   - FAQ-sektion

10. **Alt-text**
    - Lägg till aria-labels och alt-text

### Prioritet 3 (Förbättring):

11. **hreflang för engelska**
    ```html
    <link rel="alternate" hreflang="sv" href="https://mackan.eu/timer/">
    <link rel="alternate" hreflang="en" href="https://mackan.eu/timer/?lang=en">
    ```

12. **Breadcrumbs schema**

13. **FAQ schema**

14. **Review/Rating schema** (om tillämpligt)

---

## Innehållsstrategi

### Landing page content (lägg till efter settings):

```html
<section class="seo-content">
  <h2>Professionell Online Timer och Klocka</h2>
  <p>Timer & Klocka är en kraftfull, gratis online-timer med fullskärmsläge,
  perfekt för övningar, presentationer, stabsövningar och träning.
  Med 8 unika teman, offline-stöd och visuella signaler är detta den mest
  avancerade timern för professionellt bruk.</p>

  <h2>Funktioner</h2>
  <ul>
    <li>✅ 8 professionella teman (Digital, Analog, Taktisk, LED, etc.)</li>
    <li>✅ Fullskärmsläge för presentationer</li>
    <li>✅ Offline-stöd - fungerar utan internet</li>
    <li>✅ Ljud och visuella varningar</li>
    <li>✅ Touch-gester för mobil</li>
    <li>✅ Tillgänglig (WCAG 2.1)</li>
  </ul>

  <h2>Perfekt för:</h2>
  <ul>
    <li>🎯 Stabsövningar och militära övningar</li>
    <li>🎯 Presentationer och föreläsningar</li>
    <li>🎯 Träning och workout</li>
    <li>🎯 Möten och workshops</li>
  </ul>
</section>
```

---

## Tekniska SEO-åtgärder

### Performance:
- [ ] Minifiera CSS/JS
- [ ] Lazy load bilder
- [ ] Optimera fonter (font-display: swap)
- [ ] Service Worker caching (redan ✅)
- [ ] Compress assets (gzip/brotli)

### Mobile:
- [ ] Mobile-first design (redan ✅)
- [ ] Touch targets >44px (redan ✅)
- [ ] Fast tap (already ✅)

### Accessibility = SEO:
- [ ] ARIA labels (redan ✅)
- [ ] Semantic HTML (redan ✅)
- [ ] Keyboard navigation (redan ✅)
- [ ] Color contrast (fixat ✅)

---

## Mätning och uppföljning

### Verktyg att använda:

1. **Google Search Console**
   - Verifiera ägandeskap
   - Submit sitemap
   - Övervaka indexering
   - Kolla sökfrågor

2. **Google Analytics**
   - Spåra besökare
   - Konvertering (PWA-installation)
   - Användarbeteende

3. **Lighthouse (Chrome DevTools)**
   - SEO score
   - Performance
   - Accessibility
   - Best practices

4. **PageSpeed Insights**
   - Core Web Vitals
   - Mobile/Desktop performance

5. **Schema Markup Validator**
   - Validera JSON-LD

### KPIs (Key Performance Indicators):

- Organisk trafik/månad
- Genomsnittlig position för målsökord
- Click-through rate (CTR)
- Bounce rate
- PWA-installationer
- Återkommande besökare

---

## Registrering i kataloger

### Rekommenderade kataloger:

1. **PWA Directory**
   - https://pwa-directory.appspot.com/

2. **Product Hunt**
   - Lansera som "Free online timer PWA"

3. **AlternativeTo**
   - Som alternativ till online-timer.net

4. **GitHub Topics**
   - Tagga repo: timer, pwa, countdown, clock

5. **Subreddits**
   - r/webdev
   - r/programming
   - r/productivity

---

## Budget och ROI

### Kostnad: 0 kr
- Allt är gratis och open source
- Ingen reklam
- Ingen tracking utöver analytics

### Förväntad ROI:
- **Månad 1:** 10-50 besökare/dag
- **Månad 3:** 50-200 besökare/dag
- **Månad 6:** 200-500 besökare/dag
- **År 1:** 500-1000+ besökare/dag

### Tidsåtgång:
- Initial SEO-setup: 2-3 timmar
- Content creation: 1-2 timmar
- Uppföljning: 30 min/vecka

---

## Slutsats

Med rätt SEO-optimering kan Timer & Klocka:
- Ranka för "timer online" i Sverige
- Bli go-to timer för övningar
- Nå internationell publik
- Bygga brand awareness
- Generera organisk trafik

**Nästa steg:** Implementera Prioritet 1-åtgärderna direkt!
