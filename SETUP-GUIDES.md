# Setup Guides - Timer & Klocka

Steg-för-steg guider för att maximera SEO och spårning.

---

## 1. Google Search Console Setup

### Steg 1: Skapa konto och verifiera
1. Gå till: https://search.google.com/search-console/
2. Klicka "Start now" eller "Lägg till property"
3. Välj "URL prefix"
4. Ange: `https://mackan.eu/timer/`
5. Klicka "Continue"

### Steg 2: Verifiera ägandeskap
Välj **HTML tag** metoden:

1. Kopiera meta-taggen som Google ger dig
2. Lägg till i `<head>` i `index.html`:
```html
<meta name="google-site-verification" content="DIN_VERIFIKATIONSKOD" />
```
3. Deploy till server
4. Klicka "Verify" i Google Search Console

**Alternativ metod (lättare):** HTML file upload
1. Ladda ner filen från Google
2. Ladda upp via SCP till `~/public_html/timer/`
3. Klicka "Verify"

### Steg 3: Submit sitemap
1. Vänta tills verifikationen är klar
2. Gå till "Sitemaps" i vänstermenyn
3. Lägg till sitemap URL: `https://mackan.eu/timer/sitemap.xml`
4. Klicka "Submit"

### Steg 4: Övervaka indexering
Efter 24-48 timmar, kolla:
- **Coverage**: Hur många sidor som indexerats
- **Performance**: Klick, visningar, CTR, position
- **Enhancements**: Rich results och fel

### Steg 5: Begär indexering (optional)
1. Gå till "URL Inspection"
2. Ange: `https://mackan.eu/timer/`
3. Klicka "Request indexing"

---

## 2. Privacy-First Analytics Setup

### Option A: Plausible Analytics (Rekommenderad)

**Varför Plausible?**
- ✅ Privacy-first (ingen cookies, GDPR-compliant)
- ✅ Lightweight (<1KB script)
- ✅ Ingen påverkan på page speed
- ✅ Simpel, tydlig dashboard

**Setup:**
1. Skapa konto på: https://plausible.io/
2. Lägg till site: `mackan.eu/timer`
3. Kopiera tracking script
4. Lägg till före `</head>` i `index.html`:
```html
<script defer data-domain="mackan.eu/timer" src="https://plausible.io/js/script.js"></script>
```

**Kostnad:** $9/månad (eller self-hosted gratis)

### Option B: Google Analytics 4 (GA4)

**OBS:** Kräver cookie consent banner enligt GDPR.

**Setup:**
1. Gå till: https://analytics.google.com/
2. Skapa property för `mackan.eu/timer`
3. Kopiera Measurement ID (G-XXXXXXXXXX)
4. Lägg till i `<head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

5. Implementera cookie consent banner (GDPR)

### Option C: Self-hosted (Umami - Gratis & Open Source)

**Bästa för privacy och kostnadsfrihet:**

1. Installera Umami på egen server:
```bash
# Via Docker
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/umami-software/umami:postgresql-latest
```

2. Konfigurera site
3. Lägg till tracking script:
```html
<script defer src="https://your-umami-instance.com/script.js" data-website-id="xxx"></script>
```

**Rekommendation:** Använd Plausible för enkelhet eller Umami för full kontroll.

---

## 3. Rich Snippets Validation

### Testa strukturerad data:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Ange: `https://mackan.eu/timer/`
   - Kolla efter fel i JSON-LD

2. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Klistra in URL eller HTML
   - Verifiera WebApplication och FAQPage schemas

3. **Fixa eventuella fel**
   - Följ Googles rekommendationer
   - Uppdatera JSON-LD i index.html

---

## 4. Social Media Preview Testing

### Facebook/LinkedIn
1. Gå till: https://developers.facebook.com/tools/debug/
2. Ange URL: `https://mackan.eu/timer/`
3. Klicka "Debug"
4. Kolla preview
5. Om bild saknas: Ladda upp og-image.png först
6. Klicka "Scrape Again" för att uppdatera cache

### Twitter/X
1. Gå till: https://cards-dev.twitter.com/validator
2. Ange URL: `https://mackan.eu/timer/`
3. Klicka "Preview card"
4. Verifiera bild och text

### LinkedIn
1. Posta URL i LinkedIn post editor
2. Vänta på preview
3. Om fel: Använd LinkedIn Post Inspector

**Tips:** Skapa og-image.png och twitter-image.png först!

---

## 5. PWA Testing & Optimization

### Test PWA med Lighthouse
1. Öppna Chrome DevTools (F12)
2. Gå till "Lighthouse" tab
3. Välj "Progressive Web App"
4. Klicka "Analyze page load"
5. Mål: 90+ score

### Test offline-funktionalitet
1. Öppna `https://mackan.eu/timer/`
2. Öppna DevTools → Application → Service Workers
3. Kryssa i "Offline"
4. Reload sidan
5. Verifiera att allt fungerar

### Test installability
1. Desktop Chrome: Kolla efter install-ikon i address bar
2. Mobile: "Add to Home Screen" i browser menu
3. Verifiera manifest i DevTools → Application → Manifest

---

## 6. Performance Optimization

### PageSpeed Insights
1. Gå till: https://pagespeed.web.dev/
2. Ange: `https://mackan.eu/timer/`
3. Kolla både Mobile och Desktop
4. Mål: 90+ för alla Core Web Vitals

### Core Web Vitals att optimera:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Om score är låg:
1. Minifiera CSS/JS
2. Optimera bilder (WebP format)
3. Lazy load bilder
4. Använd font-display: swap

---

## 7. Backlink Building

### Directories att submita till:

#### PWA Directories
1. **PWA Directory**
   - URL: https://pwa-directory.appspot.com/
   - Submit: Ange URL och detaljer
   - Tid: ~5 min

2. **Appscope**
   - URL: https://appsco.pe/
   - Submit: Kräver GitHub repo
   - Tid: ~10 min

#### Alternative Software
3. **AlternativeTo**
   - URL: https://alternativeto.net/
   - Lägg till som alternativ till "Online Timer"
   - Tid: ~15 min

#### Developer Communities
4. **Product Hunt**
   - URL: https://www.producthunt.com/
   - Launch som "Free Online Timer PWA"
   - Bästa dag: Tisdag-Torsdag
   - Tid: ~30 min prep

5. **Hacker News (Show HN)**
   - URL: https://news.ycombinator.com/
   - Post: "Show HN: Timer & Klocka - Free Online Timer PWA"
   - Tid: ~5 min

#### Social Media
6. **Reddit**
   - r/InternetIsBeautiful
   - r/webdev (Showcase Saturday)
   - r/productivity
   - Följ community rules!

7. **Twitter/X**
   - Tweet med screenshot
   - Använd hashtags: #PWA #WebDev #OpenSource

---

## 8. Content Marketing

### Bloggpost idéer:
1. "8 Best Free Online Timers in 2025"
2. "How to Build a PWA Timer from Scratch"
3. "10 Productivity Hacks with Online Timers"

### YouTube Video
- Demo av alla 8 teman
- Tutorial för övningsplanering
- Titel: "Ultimate Free Online Timer - 8 Themes, Offline Support, No Ads"

### GitHub
- Tagga repo med topics: `timer`, `pwa`, `countdown`, `clock`, `web-app`
- Uppdatera README med badges och screenshots
- Skapa GitHub releases

---

## 9. Monitoring & Maintenance

### Veckovis (5 min):
- Kolla Google Search Console för nya queries
- Kolla analytics för trafik
- Svara på GitHub issues

### Månadsvis (30 min):
- Analysera sökord-performance
- Optimera meta description baserat på CTR
- Lägg till fler FAQ baserat på queries
- Uppdatera content

### Kvartalsvis (2 timmar):
- Lighthouse audit
- Konkurrentanalys
- A/B-test olika titles/descriptions
- Backlink audit

---

## 10. Quick Checklist

### Innan launch:
- [ ] Google Search Console verifierad
- [ ] Sitemap submitted
- [ ] Rich snippets validerade
- [ ] OG-images skapade och testade
- [ ] PWA fungerar offline
- [ ] Lighthouse score 90+
- [ ] Analytics installerat

### Första veckan:
- [ ] Begär indexering i GSC
- [ ] Posta på Twitter/LinkedIn
- [ ] Submit till PWA Directory
- [ ] Submit till AlternativeTo
- [ ] Skapa Product Hunt draft

### Första månaden:
- [ ] Launch på Product Hunt
- [ ] Reddit posts (3+ communities)
- [ ] GitHub release med changelog
- [ ] Första bloggpost
- [ ] Monitor GSC för queries

---

## Resurser

### Verktyg:
- Google Search Console: https://search.google.com/search-console/
- PageSpeed Insights: https://pagespeed.web.dev/
- Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- FB Debugger: https://developers.facebook.com/tools/debug/
- Twitter Validator: https://cards-dev.twitter.com/validator

### Dokumentation:
- Google SEO Guide: https://developers.google.com/search/docs
- Schema.org: https://schema.org/
- PWA Best Practices: https://web.dev/pwa/
- Web.dev Lighthouse: https://web.dev/lighthouse-performance/

---

**Lycka till! 🚀**

Följ denna guide steg-för-steg för att maximera synlighet och trafik till Timer & Klocka.
