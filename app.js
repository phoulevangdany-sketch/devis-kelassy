/* Devis Kelassy Academy v2 — rendu, vocaux, visite guidée, parcours, options, décision, assistant. */
(() => {
  'use strict';
  const D = window.DEVIS;
  if (!D) return;
  document.documentElement.classList.add('js');

  // ---------------------------------------------------------------- utilitaires
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NN = ' ', NB = ' ';
  const num = (n) => {
    const r = Math.round(n * 100) / 100;
    const o = Number.isInteger(r) ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return r.toLocaleString('fr-FR', o).replace(/[   ]/g, NN);
  };
  const eur = (n) => num(n) + NB + '€';
  const r2 = (n) => Math.round(n * 100) / 100;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kelassy-v2:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('kelassy-v2:' + k, JSON.stringify(v)); } catch { /* indisponible */ } },
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mmMobile = window.matchMedia('(max-width: 640px)');
  const imgSrc = (base, kind) => `media/odoo/${base}-${kind}.webp`;
  let PATHS = [];

  // ---------------------------------------------------------------- vocaux : un seul lecteur pour toute la page
  const audio = new Audio();
  audio.preload = 'none';
  let current = null; // élément .vn en cours
  let MANIFEST = {};
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const PLAY = '<svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg><svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';
  function wave(id, n = 26, max = 22) {
    let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return Array.from({ length: n }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      const env = 0.55 + 0.45 * Math.sin((i / (n - 1)) * Math.PI);           // enveloppe douce, comme une voix
      const v = Math.max(0.2, Math.min(1, env * (0.45 + ((h >> 8) % 55) / 100)));
      return `<i style-h="${Math.round(v * max)}"></i>`;
    }).join('');
  }
  function voiceHTML(id, label = 'Écouter l’explication', compact = false) {
    return `<div class="vn${compact ? ' vn--compact' : ''}" data-vn="${esc(id)}">
      <button class="vn__btn" type="button" aria-label="${esc(label)}">${PLAY}</button>
      <span class="vn__label">${esc(label)}</span>
      <span class="vn__wave" aria-hidden="true">${wave(id, compact ? 14 : 26, compact ? 18 : 22)}</span>
      <span class="vn__time">${MANIFEST[id] ? fmt(MANIFEST[id].duree) : ''}</span>
    </div>`;
  }
  function paintWaves(root = document) {
    $$('.vn__wave i[style-h]', root).forEach((el) => { el.style.height = el.getAttribute('style-h') + 'px'; el.removeAttribute('style-h'); });
  }
  function mountVoices(root = document) {
    $$('[data-voice]', root).forEach((el) => {
      if (el.dataset.mounted) return;
      const compact = el.hasAttribute('data-compact');
      el.innerHTML = voiceHTML(el.dataset.voice, el.dataset.label || (compact ? 'Écouter' : 'Écouter l’explication'), compact);
      el.dataset.mounted = '1';
    });
    paintWaves(root);
  }
  function setPlaying(vn, on) {
    vn.classList.toggle('is-playing', on);
    $('.vn__btn', vn).setAttribute('aria-label', on ? 'Mettre en pause' : ($('.vn__label', vn).textContent || 'Écouter'));
  }
  function progress(vn, ratio) {
    const bars = $$('.vn__wave i', vn);
    const k = Math.round(bars.length * ratio);
    bars.forEach((b, i) => b.classList.toggle('on', i < k));
  }
  function toggleVoice(vn) {
    const id = vn.dataset.vn;
    if (current === vn && !audio.paused) { audio.pause(); return; }
    if (current !== vn) {
      if (current) setPlaying(current, false);
      current = vn;
      audio.src = `audio/${id}.mp3`;
      audio.dataset.id = id;
      audio.currentTime = 0;
    }
    $$('video:not([data-auto])').forEach((v) => v.pause());
    audio.play().catch(() => { setPlaying(vn, false); });
  }
  audio.addEventListener('play', () => current && setPlaying(current, true));
  audio.addEventListener('pause', () => current && setPlaying(current, false));
  audio.addEventListener('timeupdate', () => {
    if (!current || !audio.duration) return;
    progress(current, audio.currentTime / audio.duration);
    $('.vn__time', current).textContent = fmt(audio.duration - audio.currentTime);
  });
  audio.addEventListener('ended', () => {
    if (!current) return;
    setPlaying(current, false); progress(current, 0);
    const id = current.dataset.vn;
    $('.vn__time', current).textContent = MANIFEST[id] ? fmt(MANIFEST[id].duree) : '';
    current = null;
  });
  window.__voice = { audio, state: () => ({ id: current?.dataset.vn || null, paused: audio.paused, t: audio.currentTime }) };

  // ---------------------------------------------------------------- 1. besoins
  function renderNeeds() {
    $('#needs').innerHTML = D.besoins.map((b) => `
      <article class="need rise">
        <div class="need__who"><span class="need__av">${esc(b.initiales)}</span><div><strong>${esc(b.qui)}</strong><span>${esc(b.role)}</span></div></div>
        <ul>${b.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      </article>`).join('');
    $('#needs-note').textContent = D.besoinsNote;
  }

  // ---------------------------------------------------------------- 2. outil et parcours
  const APP_ICON = { Prospection: 'crm', Dossiers: 'dossiers', Formation: 'formation', Discussion: 'mail', Calendrier: 'calendar', Contacts: 'contacts' };
  function renderTool() {
    $('#outil-phrase').textContent = D.outil.phrase;
    $('#tool-apps').innerHTML = D.outil.apps.map(([n, t]) => `
      <div class="app rise"><img src="media/apps/${APP_ICON[n]}.png" alt="" width="40" height="40" loading="lazy"><div><strong>${esc(n)}</strong><span>${esc(t)}</span></div></div>`).join('');
  }
  function renderRoutes() {
    $('#routes').innerHTML = `
      <h3>Six parcours de financement, un seul type de dossier</h3>
      <p>Pas un logiciel par activité : chaque dossier suit le parcours de son financement, avec ses étapes, ses pièces et ses délais.</p>
      <div class="routes__grid">${PATHS.map((p) => `
        <div class="route rise"><strong><span class="route__dot" data-c="${esc(p.couleur)}"></span>${esc(p.nom)}</strong><p>${esc(p.une_phrase)}</p><small>Qui paie : ${esc(p.payeur)}</small></div>`).join('')}</div>`;
    $$('#routes [data-c]').forEach((el) => { el.style.background = el.dataset.c; });
  }

  // ---------------------------------------------------------------- 3. visite guidée
  let tourIdx = 0;
  function renderTour() {
    const nav = D.tour.map((s, i) => `<button type="button" role="tab" aria-selected="${i === tourIdx}" data-tour="${i}"><b>${i + 1}</b>${esc(s.nav)}</button>`).join('');
    $('#tour').innerHTML = `
      <div class="tour__nav" role="tablist" aria-label="Écrans d’Odoo">${nav}</div>
      <div class="tour__stage">
        <div class="tour__mobile-nav" role="tablist">${D.tour.map((s, i) => `<button type="button" role="tab" aria-selected="${i === tourIdx}" data-tour="${i}">${i + 1}. ${esc(s.nav)}</button>`).join('')}</div>
        <div id="tour-panel"></div>
      </div>`;
    showTour(tourIdx, false);
  }
  function showTour(i, scroll = true) {
    tourIdx = i;
    const s = D.tour[i];
    $$('[data-tour]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.tour === i)));
    $('#tour-panel').innerHTML = `
      <div class="tour__top">
        <div><h3>${esc(s.titre)}</h3><p>${esc(s.phrase)}</p></div>
        <div data-voice="${esc(s.audio)}" data-compact></div>
      </div>
      <div class="tour__frame">
        <button class="shot" type="button" data-zoom="${esc(s.img)}" aria-label="Agrandir : ${esc(s.titre)}">
          <picture><source media="(max-width: 640px)" srcset="${imgSrc(s.img, 'mobile')}"><img src="${imgSrc(s.img, 'desktop')}" alt="Odoo : ${esc(s.titre)}" loading="lazy"></picture>
        </button>
        ${s.points.map((p, k) => `<span class="spot" data-x="${p.x}" data-y="${p.y}" aria-hidden="true">${k + 1}</span>`).join('')}
      </div>
      <ol class="legend">${s.points.map((p, k) => `<li><b>${k + 1}</b><span>${esc(p.t)}</span></li>`).join('')}</ol>`;
    $$('#tour-panel .spot').forEach((el) => { el.style.left = el.dataset.x + '%'; el.style.top = el.dataset.y + '%'; });
    mountVoices($('#tour-panel'));
    const mob = $('.tour__mobile-nav [aria-selected="true"]');
    if (mob && scroll) mob.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }

  function renderFilms() {
    const films = D.films || [];
    if (!films.length) { $('#films').hidden = true; return; }
    $('#films').innerHTML = `
      <h3>En vidéo : trois gestes du quotidien</h3>
      <p>De vraies manipulations d’Odoo, commentées et sous-titrées. Une minute environ chacune.</p>
      <div class="films__grid">${films.map((f) => `
        <figure class="film rise">
          <video controls preload="none" playsinline poster="${esc(f.poster)}"><source src="${esc(f.src)}" type="video/mp4"></video>
          <div><strong>${esc(f.titre)}</strong><span>${esc(f.sous)}</span></div>
        </figure>`).join('')}</div>`;
    $$('#films video').forEach((v) => v.addEventListener('play', () => { audio.pause(); $$('#films video').forEach((o) => o !== v && o.pause()); }));
  }

  // ---------------------------------------------------------------- 4. parcours
  let pathCode = 'apprentissage';
  function renderPaths() {
    $('#paths').innerHTML = `
      <div class="chips" role="tablist" aria-label="Financements">${PATHS.map((p) => `<button type="button" role="tab" data-path="${esc(p.code)}" aria-selected="${p.code === pathCode}"><i data-c="${esc(p.couleur)}"></i>${esc(p.court)}</button>`).join('')}</div>
      <div id="path-panel"></div>`;
    $$('#paths .chips i').forEach((el) => { el.style.background = el.dataset.c; });
    showPath(pathCode);
  }
  function showPath(code) {
    pathCode = code;
    const p = PATHS.find((x) => x.code === code);
    $$('[data-path]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.path === code)));
    const voice = D.parcoursAudio[code];
    const img = D.parcoursImg[code];
    $('#path-panel').innerHTML = `
      <article class="path">
        <div>
          <h3>${esc(p.nom)}</h3>
          <p class="path__one">${esc(p.une_phrase)}</p>
          <div class="path__meta">
            <div><span>Qui paie Kelassy</span>${esc(p.payeur)}</div>
            <div><span>Pour quelles formations</span>${esc(p.certifications)}</div>
          </div>
          <p class="path__h4">Les étapes du dossier</p>
          <ol class="steps">${p.etapes.map(([n, t]) => `<li><strong>${esc(n)}</strong><span>${esc(t)}</span></li>`).join('')}</ol>
        </div>
        <div>
          <p class="path__h4">Ce que le logiciel fait pour vous</p>
          <ul class="does">${p.automatismes.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
          ${voice ? `<div data-voice="${esc(voice)}"></div>` : ''}
          <div class="rules">
            <h4>Les délais suivis, avec leur source</h4>
            <table>${p.delais.map(([r, s]) => `<tr><td>${esc(r)}</td><td>${esc(s)}</td></tr>`).join('')}</table>
          </div>
        </div>
        ${img ? `<figure class="path__shot"><button class="shot" type="button" data-zoom="${esc(img)}" aria-label="Agrandir l’écran ${esc(p.court)}"><picture><source media="(max-width: 640px)" srcset="${imgSrc(img, 'mobile')}"><img src="${imgSrc(img, 'desktop')}" alt="Odoo : dossiers ${esc(p.court)}" loading="lazy"></picture></button><figcaption>L’écran des dossiers « ${esc(p.court)} » dans Odoo (données fictives).</figcaption></figure>` : ''}
      </article>`;
    mountVoices($('#path-panel'));
  }

  // ---------------------------------------------------------------- 5. options
  const OPT = Object.fromEntries(D.options.map((o) => [o.id, o]));
  const sel = new Set((store.get('sel', []) || []).filter((id) => OPT[id]));
  if (sel.has('abo-technique') && sel.has('abo-accompagnement')) sel.delete('abo-technique');
  const priceLine = (o) => o.type === 'mensuel'
    ? (o.base === 'HT' ? `${eur(o.prixHT)} HT<small>par mois · ${eur(o.prix)} TTC</small>` : `${eur(o.prix)} TTC<small>par mois · ${eur(o.ht)} HT</small>`)
    : `${eur(o.prix)} TTC<small>${eur(o.ht)} HT</small>`;
  const sw = (o) => `<button class="switch" type="button" role="switch" aria-checked="${sel.has(o.id)}" data-toggle="${o.id}" aria-label="Ajouter : ${esc(o.court)}"><span class="sw__txt">${sel.has(o.id) ? 'Ajouté' : 'Ajouter'}</span><span class="switch__t"></span></button>`;
  function card(o, wide = false) {
    const media = o.media ? `<button class="ocard__media" type="button" data-film="media/agents/${esc(o.media)}" aria-label="Voir l’exemple en grand : ${esc(o.court)}"><video muted loop playsinline preload="none" data-auto poster="media/agents/${esc(o.media)}-carte.jpg"><source src="media/agents/${esc(o.media)}-carte.mp4" type="video/mp4"></video><span class="ocard__play">Voir en grand</span><span class="ocard__demo">Odoo · données fictives</span></button>` : '';
    return `
      <article class="ocard rise${wide ? ' ocard--wide' : ''}${sel.has(o.id) ? ' is-on' : ''}${o.media ? ' ocard--media' : ''}" data-opt="${o.id}">
        ${media}
        <div class="ocard__body">
          <div class="ocard__top"><div><h3>${esc(o.titre)}</h3>${o.pour ? `<p class="ocard__for">Pour ${esc(o.pour)}</p>` : ''}</div><div class="ocard__price">${priceLine(o)}</div></div>
          <p class="ocard__lead">${esc(o.accroche)}</p>
          ${o.jamais ? `<p class="ocard__never">Ne fait jamais : ${esc(o.jamais)}</p>` : ''}
          ${o.fait ? `<details class="ocard__more"><summary>Voir le détail</summary><ul>${o.fait.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>${o.origine ? `<p class="ocard__origin">${esc(o.origine)}</p>` : ''}</details>` : ''}
        </div>
        <div class="ocard__foot"><div data-voice="${esc(o.audio)}" data-compact></div>${sw(o)}</div>
      </article>`;
  }
  const RULE_ICONS = [
    '<svg viewBox="0 0 24 24"><path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16.5 9"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/></svg>',
  ];
  function renderOptions() {
    const agents = D.options.filter((o) => o.famille === 'agent');
    const subs = D.options.filter((o) => o.famille === 'abonnement');
    $('#opts').innerHTML = `
      <div class="ogrid ogrid--first">${card(OPT.matching)}${card(OPT.documents)}</div>
      <div class="rules">
        <h3 class="rules__t">Les agents IA</h3>
        <ul class="rules__list">${D.reglesCourtes.map(([t, d], i) => `<li class="rules__i rules__i--${i}"><span class="rules__ico" aria-hidden="true">${RULE_ICONS[i]}</span><span><strong>${esc(t)}</strong><span>${esc(d)}</span></span></li>`).join('')}</ul>
        <p class="rules__note">${esc(D.reglesNote)}</p>
      </div>
      <p class="swipe-hint" aria-hidden="true">Faites glisser pour voir les ${agents.length} agents</p>
      <div class="ogrid ogrid--swipe">${agents.map((o) => card(o)).join('')}</div>
      <p class="opt-intro"><strong>Les abonnements.</strong> Sans engagement, préavis de 30 jours. L’accompagnement comprend déjà le suivi technique. <span class="opt-intro__s">Sans abonnement : 100 € TTC de l’heure (83,33 € HT), au quart d’heure.</span></p>
      <p class="swipe-hint" aria-hidden="true">Faites glisser pour voir les ${subs.length} formules</p>
      <div class="subs">${subs.map((o) => card(o)).join('')}</div>`;
  }
  function totals() {
    const ch = D.options.filter((o) => sel.has(o.id));
    const uni = ch.filter((o) => o.type === 'unique');
    const men = ch.filter((o) => o.type === 'mensuel');
    const annexes = D.prix.annexes.reduce((a, x) => a + x.ttc, 0);
    const optionsTTC = uni.reduce((a, o) => a + o.prix, 0);
    const uniqueTTC = D.prix.ttc + annexes + optionsTTC;
    return {
      uni, men, annexes, optionsTTC, uniqueTTC,
      uniqueHT: r2(uniqueTTC / 1.2),
      mensuelTTC: r2(men.reduce((a, o) => a + o.prix, 0)),
      mensuelHT: r2(men.reduce((a, o) => a + (o.base === 'HT' ? o.prixHT : o.ht), 0)),
      signature: r2(D.echeancier[0].ttc + optionsTTC / 2),
    };
  }
  function toggle(id) {
    if (sel.has(id)) sel.delete(id);
    else { sel.add(id); if (id === 'abo-technique') sel.delete('abo-accompagnement'); if (id === 'abo-accompagnement') sel.delete('abo-technique'); }
    store.set('sel', [...sel]);
    update();
  }
  function update() {
    $$('[data-opt]').forEach((c) => {
      const on = sel.has(c.dataset.opt);
      c.classList.toggle('is-on', on);
      const s = $('.switch', c);
      if (s) { s.setAttribute('aria-checked', String(on)); $('.sw__txt', s).textContent = on ? 'Ajouté' : 'Ajouter'; }
    });
    const t = totals();
    $('#tray-total').textContent = eur(t.uniqueTTC) + ' TTC';
    $('#tray-month').textContent = t.mensuelTTC ? `+ ${eur(t.mensuelTTC)} / mois` : '';
    renderPrice();
    renderRecap();
  }

  // ---------------------------------------------------------------- 6. délai
  function renderDelai() {
    $('#delai-titre').textContent = D.delai.titre;
    $('#delai-sous').textContent = D.delai.sous;
    $('#phases').innerHTML = D.delai.phases.map(([q, t, d]) => `<li class="rise"><small>${esc(q)}</small><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('');
    $('#delai-condition').textContent = D.delai.condition;
  }

  // ---------------------------------------------------------------- 7. prix
  function renderPrice() {
    const t = totals();
    $('#price').innerHTML = `
      <div class="price__top">
        <p class="price__amount">${eur(D.prix.ttc)}<small>TTC · soit ${eur(D.prix.ht)} HT</small></p>
        <p class="price__summary">${esc(D.prix.resume)}<span>Un tout cohérent : pas de prix brique par brique.</span></p>
      </div>
      <div class="incl">${D.prix.compris.map(([a, b]) => `<div><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div>
      <div class="price__rows">
        <div>
          <h4>Votre total</h4>
          <ul class="rows">
            <li><span>Votre logiciel Odoo</span><span>${eur(D.prix.ttc)}</span></li>
            ${D.prix.annexes.map((a) => `<li><span>${esc(a.titre)}</span><span>${eur(a.ttc)}</span></li>`).join('')}
            ${t.uni.map((o) => `<li><span>${esc(o.titre)} <em class="muted">(option)</em></span><span>${eur(o.prix)}</span></li>`).join('')}
            <li class="total"><span>Total TTC</span><span>${eur(t.uniqueTTC)}</span></li>
          </ul>
          <p class="price__small">Soit ${eur(t.uniqueHT)} HT.${t.mensuelTTC ? ` Abonnements choisis : ${eur(t.mensuelTTC)} TTC par mois (${eur(t.mensuelHT)} HT).` : ''}</p>
          <p class="not-incl">Pas compris : ${D.prix.nonCompris.map(esc).join(' · ')}.</p>
        </div>
        <div>
          <h4>Comment vous payez le logiciel</h4>
          <ul class="rows">${D.echeancier.map((e) => `<li><span>${e.part} % ${esc(e.etape.charAt(0).toLowerCase() + e.etape.slice(1))}</span><span>${eur(e.ttc)}</span></li>`).join('')}</ul>
          <p class="price__small">${esc(D.paiementAnnexes)} ${esc(D.paiementOptions)}</p>
          <p class="price__small">À la signature : <strong>${eur(t.signature)} TTC</strong>${t.optionsTTC ? ' (30 % du logiciel et 50 % des options)' : ' (30 % du logiciel)'}.</p>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------- 8. décision
  const SITE = window.DEVIS_SITE || {}; // { static: true, form: 'https://formsubmit.co/ajax/…' } sur GitHub Pages
  const ACKS = [
    ['perimetre', 'J’ai pris connaissance de ce que comprend le logiciel et de ce qui n’y est pas compris.'],
    ['conditions', 'J’ai lu les conditions et l’échéancier (30 % du logiciel à la signature, 50 % des options à la commande).'],
    ['accord', 'J’accepte le devis n° 2026-003 pour le logiciel, le logo, le site, le domaine, les e-mails et les options sélectionnées.'],
  ];
  let mode = store.get('mode', 'valider') === 'demande' ? 'demande' : 'valider';
  const draft = store.get('draft', {}) || {};
  function field(id, label, o = {}) {
    return `<div class="field${o.full ? ' field--full' : ''}" data-field="${id}"><label for="f-${id}">${label}</label><input id="f-${id}" name="${id}" type="${o.type || 'text'}" autocomplete="${o.ac || 'off'}"${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.max ? ` maxlength="${o.max}"` : ''}${o.im ? ` inputmode="${o.im}"` : ''} value="${esc(draft[id] || '')}"><span class="field__err">${esc(o.err || 'À compléter')}</span></div>`;
  }
  function renderDecision() {
    $('#decide').innerHTML = `
      <div class="mode" role="radiogroup" aria-label="Votre réponse">
        <button type="button" role="radio" data-mode="valider" aria-checked="${mode === 'valider'}">Je valide le devis</button>
        <button type="button" role="radio" data-mode="demande" aria-checked="${mode === 'demande'}">J’ai une question avant</button>
      </div>
      <form id="decide-form" novalidate>
        <div class="dstep"><h3>Votre sélection</h3><ul class="recap" id="recap"></ul><div class="recap__tot" id="recap-tot"></div></div>
        <div class="dstep" data-only="valider"><h3>Vos validations</h3><div class="checks">${ACKS.map(([k, t]) => `<label class="check" data-ack="${k}"><input type="checkbox" name="ack-${k}"><span>${esc(t)}</span></label>`).join('')}</div></div>
        <div class="dstep"><h3>Vos coordonnées</h3><div class="fields">
          ${field('nom', 'Prénom et nom', { ac: 'name', max: 120 })}
          ${field('fonction', 'Fonction', { ac: 'organization-title', max: 120, ph: 'Par exemple : cofondateur' })}
          ${field('email', 'E-mail', { type: 'email', ac: 'email', max: 160, err: 'Adresse e-mail à vérifier' })}
          ${field('tel', 'Téléphone <span>(facultatif)</span>', { type: 'tel', ac: 'tel', max: 40, im: 'tel' })}
          <p class="fields__sep">Société, si vous l’avez sous la main (sinon plus tard)</p>
          ${field('raison', 'Raison sociale <span>(facultatif)</span>', { ac: 'organization', max: 160 })}
          ${field('siren', 'SIREN <span>(facultatif)</span>', { max: 11, im: 'numeric', ph: '9 chiffres', err: 'Le SIREN compte 9 chiffres' })}
          ${field('adresse', 'Adresse du siège <span>(facultatif)</span>', { full: true, ac: 'street-address', max: 300 })}
        </div></div>
        <div class="dstep"><h3 id="msg-title"></h3><div class="field field--full" data-field="commentaire"><label for="f-commentaire" id="msg-label"></label><textarea id="f-commentaire" name="commentaire" maxlength="4000">${esc(draft.commentaire || '')}</textarea><span class="field__err">Écrivez votre question ou votre demande</span></div></div>
        <div class="hp" aria-hidden="true"><label for="f-website">Ne pas remplir</label><input id="f-website" name="website" tabindex="-1" autocomplete="off"></div>
        <div class="dsubmit"><p class="form-error" id="form-error" role="alert" hidden></p><button class="btn" type="submit" id="submit"></button><p id="submit-note"></p></div>
      </form>`;
    applyMode();
    renderRecap();
  }
  function applyMode() {
    $$('[data-mode]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    $$('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== mode; });
    const v = mode === 'valider';
    $('#msg-title').textContent = v ? 'Un commentaire ?' : 'Votre question ou votre demande';
    $('#msg-label').innerHTML = v ? 'Commentaire <span>(facultatif)</span>' : 'Ce que vous souhaitez savoir ou modifier';
    $('#submit').textContent = v ? 'Valider le devis' : 'Envoyer ma demande';
    $('#submit-note').textContent = v ? 'Votre validation est transmise à Dany Phoulevang avec la date, l’heure et votre sélection. C’est un accord de principe : le bon pour accord vous sera ensuite transmis.' : 'Votre message est transmis à Dany Phoulevang, qui vous répond directement. Rien n’est validé à ce stade.';
    store.set('mode', mode);
  }
  function renderRecap() {
    const r = $('#recap');
    if (!r) return;
    const t = totals();
    r.innerHTML = `<li><span>Votre logiciel Odoo</span><span>${eur(D.prix.ttc)} TTC</span></li>` +
      D.prix.annexes.map((a) => `<li><span>${esc(a.titre)}</span><span>${eur(a.ttc)} TTC</span></li>`).join('') +
      t.uni.map((o) => `<li><span>${esc(o.titre)}</span><span>${eur(o.prix)} TTC</span></li>`).join('') +
      t.men.map((o) => `<li><span>${esc(o.titre)}</span><span>${o.base === 'HT' ? eur(o.prixHT) + ' HT' : eur(o.prix) + ' TTC'} / mois</span></li>`).join('');
    $('#recap-tot').innerHTML = `<div><span>Total</span><strong>${eur(t.uniqueTTC)} TTC</strong></div><div><span>Chaque mois</span><strong>${t.mensuelTTC ? eur(t.mensuelTTC) + ' TTC' : '—'}</strong></div><div><span>À la signature</span><strong>${eur(t.signature)} TTC</strong></div>`;
  }
  const val = (id) => ($('#f-' + id)?.value || '').trim();
  function validate() {
    const errs = [];
    const set = (id, bad) => { $(`[data-field="${id}"]`)?.classList.toggle('is-error', bad); if (bad) errs.push(id); };
    set('nom', val('nom').length < 2);
    set('fonction', val('fonction').length < 2);
    set('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')));
    const siren = val('siren').replace(/\s+/g, '');
    set('siren', siren !== '' && !/^\d{9}$/.test(siren));
    set('commentaire', mode === 'demande' && val('commentaire').length < 3);
    if (mode === 'valider') ACKS.forEach(([k]) => { const l = $(`[data-ack="${k}"]`); const bad = !$('input', l).checked; l.classList.toggle('is-error', bad); if (bad) errs.push('ack-' + k); });
    return errs;
  }
  async function submit(e) {
    e.preventDefault();
    const err = $('#form-error');
    err.hidden = true;
    const errs = validate();
    if (errs.length) {
      err.textContent = errs.some((x) => x.startsWith('ack-')) ? 'Cochez les trois cases et complétez les champs signalés.' : 'Complétez les champs signalés.';
      err.hidden = false;
      (errs[0].startsWith('ack-') ? $(`[data-ack="${errs[0].slice(4)}"] input`) : $('#f-' + errs[0]))?.focus();
      return;
    }
    const btn = $('#submit'); const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Envoi en cours…';
    const payload = { decision: mode, options: [...sel], acks: Object.fromEntries(ACKS.map(([k]) => [k, !!$(`[data-ack="${k}"] input`)?.checked])),
      nom: val('nom'), fonction: val('fonction'), email: val('email'), tel: val('tel'), raison: val('raison'), siren: val('siren'), adresse: val('adresse'), commentaire: val('commentaire'), website: val('website'), heureClient: new Date().toString() };
    try {
      const data = SITE.static ? await sendStatic(payload) : await sendServer(payload);
      done(payload, data);
    } catch (x) {
      err.textContent = x.message && !/fetch|network/i.test(x.message) ? x.message : 'Connexion impossible pour le moment. Réessayez dans un instant, ou écrivez à contact@otomeo.com.';
      err.hidden = false; btn.disabled = false; btn.textContent = label;
    }
  }
  async function sendServer(payload) {
    const res = await fetch('/api/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'L’envoi n’a pas abouti. Réessayez ou écrivez à contact@otomeo.com.');
    return data;
  }
  // Site statique (GitHub Pages) : pas de serveur, l'e-mail part par le formulaire FormSubmit vers direction@otomeo.com.
  async function sendStatic(p) {
    const t = totals();
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const ref = `KEL-${D.meta.numero}-${stamp}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
    const date = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'short' });
    const v = p.decision === 'valider';
    const opts = [...t.uni, ...t.men].map((o) => `${o.titre} : ${o.type === 'mensuel' ? `${eur(o.prix)} TTC par mois` : `${eur(o.prix)} TTC`}`);
    const body = {
      _subject: `[Devis ${D.meta.numero}] ${v ? 'Validé' : 'Demande avant validation'} par ${p.nom} (${p.raison || D.meta.client})`,
      _template: 'table', _captcha: 'false', _replyto: p.email, _honey: p.website,
      'Décision': v ? 'DEVIS VALIDÉ' : 'Demande avant validation',
      'Référence': ref, 'Date': date,
      'Nom': p.nom, 'Fonction': p.fonction, 'E-mail': p.email, 'Téléphone': p.tel || '(non renseigné)',
      'Raison sociale': p.raison || '(à transmettre)', 'Adresse du siège': p.adresse || '(à transmettre)', 'SIREN': p.siren || '(à transmettre)',
      'Sélection': [`Logiciel Odoo Kelassy : ${eur(D.prix.ttc)} TTC (${eur(D.prix.ht)} HT)`, ...D.prix.annexes.map((a) => `${a.titre} : ${eur(a.ttc)} TTC`), ...(opts.length ? opts : ['Aucune option'])].join(' · '),
      'Total': `${eur(t.uniqueTTC)} TTC (${eur(t.uniqueHT)} HT), dont options ${eur(t.optionsTTC)} TTC`,
      'Abonnements': `${eur(t.mensuelTTC)} TTC par mois (${eur(t.mensuelHT)} HT)`,
      'À la signature': `${eur(t.signature)} TTC (30 % du logiciel${t.optionsTTC ? ' + 50 % des options' : ''}) ; logo, site, domaine et e-mails à la mise en ligne du site`,
      'Cases cochées': ACKS.map(([k, txt]) => `${p.acks[k] ? '✔' : '✘'} ${txt}`).join(' · '),
      'Message du client': p.commentaire || '(aucun)',
      'Trace': `Devis n° ${D.meta.numero} du ${D.meta.emis} · ${p.heureClient} · ${navigator.userAgent}`,
      'Mention': 'Validation en ligne : accord de principe tracé, qui ne remplace pas la signature du bon pour accord.',
    };
    const res = await fetch(SITE.form, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error('L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez à contact@otomeo.com.');
    return { ok: true, ref, date };
  }
  function done(p, data) {
    const t = totals();
    const v = p.decision === 'valider';
    $('#decide').innerHTML = `
      <div class="done" tabindex="-1" id="done">
        <div class="done__ok" aria-hidden="true">✓</div>
        <h3>Merci, ${esc(p.nom.split(/\s+/)[0])}.</h3>
        <p>${v ? `Votre validation du devis n° 2026-003 est bien transmise à Otomeo, ${esc(data.date || '')}.` : `Votre message est bien transmis à Dany Phoulevang. Il vous répond à ${esc(p.email)}.`}</p>
        <p class="done__ref">Référence ${esc(data.ref)}</p>
        ${data.mode === 'dry-run' ? '<span class="done__test">Mode test : l’e-mail est enregistré mais pas envoyé</span>' : ''}
        ${v ? `<div class="done__next"><strong>Et maintenant ?</strong><ol>
          <li>Dany vous transmet le bon pour accord et la facture d’acompte : ${eur(t.signature)} TTC.</li>
          <li>Avant le 10 octobre, vous nous envoyez vos documents et vos choix sur les points à trancher.</li>
          <li>Le projet démarre : un mois à 45 jours jusqu’à la recette.</li></ol></div>` : ''}
        <a class="btn btn--ghost" href="#top">Revenir en haut</a>
      </div>`;
    $('#done').focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------- bas de page
  function renderFine() {
    $('#terms').innerHTML = D.conditions.map(([a, b]) => `<div class="term"><strong>${esc(a)}</strong>${esc(b)}</div>`).join('');
    $('#confirm').innerHTML = D.aConfirmer.map((x) => `<li>${esc(x)}</li>`).join('');
    $('#guar').innerHTML = D.garanties.map(([a, b]) => `<div><strong>${esc(a)}</strong><br>${esc(b)}</div>`).join('');
  }

  // ---------------------------------------------------------------- navigation, apparitions
  function initNav() {
    const secs = $$('[data-step]');
    const bar = $('#bar'), step = $('#bar-step'), prog = $('#bar-progress'), tray = $('#tray');
    const opts = $('#options'), dec = $('#decision');
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const y = window.scrollY, vh = window.innerHeight;
      bar.classList.toggle('is-scrolled', y > 6);
      let cur = null, idx = 0;
      secs.forEach((s, i) => { if (s.offsetTop <= y + vh * 0.35) { cur = s; idx = i + 1; } });
      step.textContent = cur ? `${String(idx).padStart(2, '0')} · ${cur.dataset.step}` : 'Votre projet';
      prog.style.width = `${(idx / secs.length) * 100}%`;
      const ro = opts.getBoundingClientRect();
      tray.classList.toggle('is-on', ro.top < vh * 0.5 && ro.bottom > vh * 0.6);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
  function autoClips() {
    const vids = $$('video[data-auto]');
    if (!vids.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((en) => en.forEach((x) => {
      const v = x.target;
      if (x.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    }), { threshold: 0.35 });
    vids.forEach((v) => io.observe(v));
  }
  function rise() {
    if (!('IntersectionObserver' in window)) { $$('.rise').forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.1 });
    $$('.rise:not(.in)').forEach((e) => io.observe(e));
  }

  // ---------------------------------------------------------------- visionneuse
  function openZoom(base) {
    const z = $('#zoom');
    $('#zoom-img').src = imgSrc(base, mmMobile.matches ? 'mobile' : 'desktop');
    $('#zoom-img').alt = 'Capture agrandie';
    z.hidden = false;
    $('#zoom-close').focus();
  }
  function openFilm(base) {
    const z = $('#zoom'), v = $('#zoom-vid');
    audio.pause();
    $('#zoom-img').hidden = true;
    v.hidden = false; v.poster = base + '.jpg'; v.src = base + '.mp4';
    z.setAttribute('aria-label', 'Vidéo agrandie');
    z.hidden = false;
    v.play().catch(() => {});
    $('#zoom-close').focus();
  }
  const closeZoom = () => {
    const v = $('#zoom-vid');
    v.pause(); v.removeAttribute('src'); v.load(); v.hidden = true;
    $('#zoom-img').hidden = false;
    $('#zoom').setAttribute('aria-label', 'Capture agrandie');
    $('#zoom').hidden = true;
  };

  // ---------------------------------------------------------------- assistant
  const chat = { history: [], busy: false, ok: null, greeted: false };
  const SUGG = ['Pourquoi un seul logiciel pour toutes nos activités ?', 'Qu’est-ce qui est compris dans les 6 000 € ?', 'Comment le logiciel gère le CPF ?', 'À quoi sert l’agent financements et délais ?', 'Le délai d’un mois à 45 jours est-il tenable ?'];
  function md(text) {
    const lines = esc(text).split('\n'); let out = '', list = false, para = [];
    const flush = () => { if (para.length) { out += '<p>' + para.join('<br>') + '</p>'; para = []; } };
    for (const raw of lines) {
      const l = raw.trim();
      if (/^[-•*]\s+/.test(l)) { flush(); if (!list) { out += '<ul>'; list = true; } out += '<li>' + l.replace(/^[-•*]\s+/, '') + '</li>'; continue; }
      if (list) { out += '</ul>'; list = false; }
      if (!l) { flush(); continue; }
      para.push(l.replace(/^#{1,6}\s+/, ''));
    }
    flush(); if (list) out += '</ul>';
    return out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  const add = (k, h) => { const el = document.createElement('div'); el.className = 'msg msg--' + k; el.innerHTML = h; $('#chat-log').appendChild(el); $('#chat-log').scrollTop = 1e9; return el; };
  function greet() {
    if (chat.greeted) return; chat.greeted = true;
    add('bot', md('Bonjour, je suis l’assistant IA de ce devis. Je réponds à partir du devis et de votre cahier des charges, simplement, et je vous dis quand un point reste à confirmer.'));
    const s = document.createElement('div'); s.className = 'sugg';
    s.innerHTML = SUGG.map((q) => `<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join('');
    $('#chat-log').appendChild(s);
    if (chat.ok === false) off();
  }
  function off() {
    if ($('.chat-off')) return;
    add('bot chat-off', '<p>L’assistant est momentanément indisponible. Écrivez à Dany : <a href="mailto:contact@otomeo.com">contact@otomeo.com</a>.</p>');
    $('#chat-input').disabled = true; $('.chat__send').disabled = true;
  }
  function openChat(q) { $('#chat').hidden = false; document.body.classList.add('chat-open'); $('#fab').setAttribute('aria-expanded', 'true'); greet(); if (q) send(q); else setTimeout(() => $('#chat-input').focus(), 50); }
  function closeChat() { $('#chat').hidden = true; document.body.classList.remove('chat-open'); $('#fab').setAttribute('aria-expanded', 'false'); $('#fab').focus(); }
  async function send(text) {
    text = String(text || '').trim().slice(0, 1500);
    if (!text || chat.busy) return;
    if (chat.ok === false) { off(); return; }
    chat.busy = true; $('.chat__send').disabled = true; $('.sugg')?.remove();
    add('me', esc(text)); chat.history.push({ role: 'user', content: text });
    const typing = add('bot msg--typing', '…');
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: chat.history.slice(-11) }) });
      if (!res.ok || !res.body) { chat.history.pop(); typing.remove(); if (res.status === 503) { chat.ok = false; off(); } else add('bot', md(res.status === 429 ? 'Beaucoup de questions en peu de temps : réessayez dans quelques minutes.' : 'Je n’ai pas pu répondre. Réessayez dans un instant.')); return; }
      const rd = res.body.getReader(), dec = new TextDecoder(); let acc = '', el = null;
      for (;;) { const { done: d, value } = await rd.read(); if (d) break; acc += dec.decode(value, { stream: true }); if (!el && acc.trim()) { typing.remove(); el = add('bot', ''); } if (el) { el.innerHTML = md(acc); $('#chat-log').scrollTop = 1e9; } }
      acc += dec.decode(); if (!el) { typing.remove(); el = add('bot', ''); }
      el.innerHTML = md(acc || 'Je n’ai pas de réponse sur ce point. Dany vous répondra : contact@otomeo.com.');
      chat.history.push({ role: 'assistant', content: acc || '…' });
    } catch { chat.history.pop(); typing.remove(); add('bot', md('La connexion a été interrompue. Réessayez.')); } finally { chat.busy = false; $('.chat__send').disabled = chat.ok === false; }
  }

  // ---------------------------------------------------------------- événements
  document.addEventListener('click', (e) => {
    const t = e.target;
    const vn = t.closest('.vn'); if (vn) { toggleVoice(vn); return; }
    const fm = t.closest('[data-film]'); if (fm) { openFilm(fm.dataset.film); return; }
    const z = t.closest('[data-zoom]'); if (z) { openZoom(z.dataset.zoom); return; }
    if (t.closest('#zoom') && !t.closest('#zoom-vid')) { closeZoom(); return; }
    const tb = t.closest('[data-tour]'); if (tb) { showTour(+tb.dataset.tour); return; }
    const pb = t.closest('[data-path]'); if (pb) { showPath(pb.dataset.path); return; }
    const tg = t.closest('[data-toggle]'); if (tg) { toggle(tg.dataset.toggle); return; }
    const m = t.closest('[data-mode]'); if (m) { mode = m.dataset.mode; applyMode(); return; }
    const q = t.closest('[data-q]'); if (q) { send(q.dataset.q); return; }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!$('#zoom').hidden) closeZoom(); else if (!$('#chat').hidden) closeChat(); } });
  document.addEventListener('submit', (e) => { if (e.target.id === 'decide-form') submit(e); });
  document.addEventListener('input', (e) => { const el = e.target; if (!el.closest('#decide-form') || el.type === 'checkbox' || el.name === 'website') return; draft[el.name] = el.value; store.set('draft', draft); el.closest('.field')?.classList.remove('is-error'); });
  document.addEventListener('change', (e) => { const l = e.target.closest('.check'); if (l && e.target.checked) l.classList.remove('is-error'); });

  // ---------------------------------------------------------------- démarrage
  async function start() {
    try { MANIFEST = await (await fetch('audio/durees.json', { cache: 'no-cache' })).json(); } catch { MANIFEST = {}; }
    try { PATHS = (await (await fetch('dispositifs.json', { cache: 'no-cache' })).json()).dispositifs; } catch { PATHS = []; }
    renderNeeds(); renderTool(); renderRoutes(); renderTour(); renderFilms(); renderPaths();
    renderOptions(); renderDelai(); renderPrice(); renderDecision(); renderFine();
    mountVoices(); update(); initNav(); rise(); autoClips();
    if (SITE.static) { chat.ok = false; $('#fab').hidden = true; } // pas d'assistant sans serveur
    else fetch('/api/health').then((r) => r.json()).then((h) => { chat.ok = !!h.chat; if (!h.chat && chat.greeted) off(); }).catch(() => { chat.ok = false; });
    $('#fab').addEventListener('click', () => openChat());
    $('#chat-close').addEventListener('click', closeChat);
    const input = $('#chat-input');
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('#chat-form').requestSubmit(); } });
    $('#chat-form').addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; send(v); });
    document.body.classList.add('ready');
  }
  start();
})();
