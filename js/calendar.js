/* ==========================================================================
   STARS CLUB — Full-Year Calendar (Sep 2026 → Jun 2027)
   Schedule data sourced from the official "STARS Club Game calendar 2026-27" PDF.
   ========================================================================== */

(function () {
  'use strict';

  /* ── Month definitions ────────────────────────────────────── */
  const MONTHS = [
    { year: 2026, month: 8,  label: 'Sep' },   // JS months are 0-indexed
    { year: 2026, month: 9,  label: 'Oct' },
    { year: 2026, month: 10, label: 'Nov' },
    { year: 2026, month: 11, label: 'Dec' },
    { year: 2027, month: 0,  label: 'Jan' },
    { year: 2027, month: 1,  label: 'Feb' },
    { year: 2027, month: 2,  label: 'Mar' },
    { year: 2027, month: 3,  label: 'Apr' },
    { year: 2027, month: 4,  label: 'May' },
    { year: 2027, month: 5,  label: 'Jun' },
  ];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /* ── Schedule data from PDF ───────────────────────────────── *
   *  Key format:  "YYYY-MM-DD"
   *  Each entry: { venue, events: [{ sport, time }] }
   */
  const SCHEDULE = {};

  function addEvent(year, month, day, venue, events) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    SCHEDULE[key] = { venue, events };
  }

  // Helper shortcuts
  const MM = 'Muriel Martin School';
  const BH = 'Bellerose High School';
  const mmEvts = [
    { sport: 'Badminton', time: '6:00 PM – 7:30 PM' },
    { sport: 'Volleyball', time: '7:30 PM – 9:00 PM' },
  ];
  const bhEvtsEvening = [
    { sport: 'Badminton', time: '7:00 PM – 8:30 PM' },
    { sport: 'Volleyball', time: '8:30 PM – 10:00 PM' },
  ];
  const bhEvtsAfternoon = [
    { sport: 'Badminton', time: '1:00 PM – 3:00 PM' },
    { sport: 'Volleyball', time: '3:00 PM – 5:00 PM' },
  ];

  // ── SEPTEMBER 2026 ──
  addEvent(2026, 8, 15, MM, mmEvts);
  addEvent(2026, 8, 16, MM, mmEvts);
  addEvent(2026, 8, 18, BH, bhEvtsEvening);
  addEvent(2026, 8, 19, BH, bhEvtsAfternoon);
  addEvent(2026, 8, 22, MM, mmEvts);
  addEvent(2026, 8, 23, MM, mmEvts);
  addEvent(2026, 8, 25, BH, bhEvtsEvening);
  addEvent(2026, 8, 26, BH, bhEvtsAfternoon);
  addEvent(2026, 8, 29, MM, mmEvts);

  // ── OCTOBER 2026 ──
  addEvent(2026, 9, 2,  BH, bhEvtsEvening);
  addEvent(2026, 9, 3,  BH, bhEvtsAfternoon);
  addEvent(2026, 9, 6,  MM, mmEvts);
  addEvent(2026, 9, 7,  MM, mmEvts);
  addEvent(2026, 9, 9,  BH, bhEvtsEvening);
  addEvent(2026, 9, 10, BH, bhEvtsAfternoon);
  addEvent(2026, 9, 13, MM, mmEvts);
  addEvent(2026, 9, 14, MM, mmEvts);
  addEvent(2026, 9, 16, BH, bhEvtsEvening);
  addEvent(2026, 9, 17, BH, bhEvtsAfternoon);
  addEvent(2026, 9, 20, MM, mmEvts);
  addEvent(2026, 9, 21, MM, mmEvts);
  addEvent(2026, 9, 23, BH, bhEvtsEvening);
  addEvent(2026, 9, 24, BH, bhEvtsAfternoon);
  addEvent(2026, 9, 27, MM, mmEvts);
  addEvent(2026, 9, 30, BH, bhEvtsEvening);
  addEvent(2026, 9, 31, BH, bhEvtsAfternoon);

  // ── NOVEMBER 2026 ──
  addEvent(2026, 10, 3,  MM, mmEvts);
  addEvent(2026, 10, 4,  MM, mmEvts);
  addEvent(2026, 10, 6,  BH, bhEvtsEvening);
  addEvent(2026, 10, 7,  BH, bhEvtsAfternoon);
  addEvent(2026, 10, 13, BH, bhEvtsEvening);
  addEvent(2026, 10, 14, BH, bhEvtsAfternoon);
  addEvent(2026, 10, 17, MM, mmEvts);
  addEvent(2026, 10, 18, MM, mmEvts);
  addEvent(2026, 10, 20, BH, bhEvtsEvening);
  addEvent(2026, 10, 21, BH, bhEvtsAfternoon);
  addEvent(2026, 10, 28, BH, bhEvtsAfternoon);

  // ── DECEMBER 2026 ──
  addEvent(2026, 11, 1,  MM, mmEvts);
  addEvent(2026, 11, 2,  MM, mmEvts);
  addEvent(2026, 11, 4,  BH, bhEvtsEvening);
  addEvent(2026, 11, 5,  BH, bhEvtsAfternoon);
  addEvent(2026, 11, 8,  MM, mmEvts);
  addEvent(2026, 11, 9,  MM, mmEvts);
  addEvent(2026, 11, 11, BH, bhEvtsEvening);
  addEvent(2026, 11, 12, BH, bhEvtsAfternoon);

  // ── JANUARY 2027 ──
  addEvent(2027, 0, 5,  MM, mmEvts);
  addEvent(2027, 0, 6,  MM, mmEvts);
  addEvent(2027, 0, 8,  BH, bhEvtsEvening);
  addEvent(2027, 0, 9,  BH, bhEvtsAfternoon);
  addEvent(2027, 0, 12, MM, mmEvts);
  addEvent(2027, 0, 13, MM, mmEvts);
  addEvent(2027, 0, 15, BH, bhEvtsEvening);
  addEvent(2027, 0, 16, BH, bhEvtsAfternoon);
  addEvent(2027, 0, 19, MM, mmEvts);
  addEvent(2027, 0, 20, MM, mmEvts);
  addEvent(2027, 0, 22, BH, bhEvtsEvening);
  addEvent(2027, 0, 23, BH, bhEvtsAfternoon);
  addEvent(2027, 0, 26, MM, mmEvts);
  addEvent(2027, 0, 27, MM, mmEvts);
  addEvent(2027, 0, 30, BH, bhEvtsAfternoon);

  // ── FEBRUARY 2027 ──
  addEvent(2027, 1, 2,  MM, mmEvts);
  addEvent(2027, 1, 3,  MM, mmEvts);
  addEvent(2027, 1, 9,  MM, mmEvts);
  addEvent(2027, 1, 10, MM, mmEvts);
  addEvent(2027, 1, 12, BH, bhEvtsEvening);
  addEvent(2027, 1, 13, BH, bhEvtsAfternoon);
  addEvent(2027, 1, 16, MM, mmEvts);
  addEvent(2027, 1, 17, MM, mmEvts);
  addEvent(2027, 1, 19, BH, bhEvtsEvening);
  addEvent(2027, 1, 20, BH, bhEvtsAfternoon);
  addEvent(2027, 1, 23, MM, mmEvts);
  addEvent(2027, 1, 24, MM, mmEvts);
  addEvent(2027, 1, 26, BH, bhEvtsEvening);
  addEvent(2027, 1, 27, BH, bhEvtsAfternoon);

  // ── MARCH 2027 ──
  addEvent(2027, 2, 2,  MM, mmEvts);
  addEvent(2027, 2, 3,  MM, mmEvts);
  addEvent(2027, 2, 6,  BH, bhEvtsAfternoon);
  addEvent(2027, 2, 9,  MM, mmEvts);
  addEvent(2027, 2, 10, MM, mmEvts);
  addEvent(2027, 2, 12, BH, bhEvtsEvening);
  addEvent(2027, 2, 13, BH, bhEvtsAfternoon);
  addEvent(2027, 2, 16, MM, mmEvts);
  addEvent(2027, 2, 17, MM, mmEvts);
  addEvent(2027, 2, 19, BH, bhEvtsEvening);
  addEvent(2027, 2, 20, BH, bhEvtsAfternoon);

  // ── APRIL 2027 ──
  addEvent(2027, 3, 9,  BH, bhEvtsEvening);
  addEvent(2027, 3, 10, BH, bhEvtsAfternoon);
  addEvent(2027, 3, 16, BH, bhEvtsEvening);
  addEvent(2027, 3, 17, BH, bhEvtsAfternoon);
  addEvent(2027, 3, 24, BH, bhEvtsAfternoon);
  addEvent(2027, 3, 27, MM, mmEvts);
  addEvent(2027, 3, 28, MM, mmEvts);
  addEvent(2027, 3, 30, BH, bhEvtsEvening);

  // ── MAY 2027 ──
  addEvent(2027, 4, 1,  BH, bhEvtsAfternoon);
  addEvent(2027, 4, 4,  MM, mmEvts);
  addEvent(2027, 4, 5,  MM, mmEvts);
  addEvent(2027, 4, 7,  BH, bhEvtsEvening);
  addEvent(2027, 4, 8,  BH, bhEvtsAfternoon);
  addEvent(2027, 4, 11, MM, mmEvts);
  addEvent(2027, 4, 12, MM, mmEvts);
  addEvent(2027, 4, 14, BH, bhEvtsEvening);
  addEvent(2027, 4, 15, BH, bhEvtsAfternoon);
  addEvent(2027, 4, 18, MM, mmEvts);
  addEvent(2027, 4, 19, MM, mmEvts);
  addEvent(2027, 4, 21, BH, bhEvtsEvening);
  addEvent(2027, 4, 22, BH, bhEvtsAfternoon);
  addEvent(2027, 4, 25, MM, mmEvts);
  addEvent(2027, 4, 26, MM, mmEvts);
  addEvent(2027, 4, 28, BH, bhEvtsEvening);
  addEvent(2027, 4, 29, BH, bhEvtsAfternoon);

  // ── JUNE 2027 ──
  addEvent(2027, 5, 1, MM, mmEvts);
  addEvent(2027, 5, 2, MM, mmEvts);


  /* ── DOM references ───────────────────────────────────────── */
  const grid      = document.getElementById('cal-grid');
  const title     = document.getElementById('cal-month-title');
  const pillsWrap = document.getElementById('cal-pills');
  const detail    = document.getElementById('cal-detail');
  const detailDate = document.getElementById('cal-detail-date');
  const detailEvts = document.getElementById('cal-detail-events');
  const prevBtn   = document.querySelector('.cal-prev');
  const nextBtn   = document.querySelector('.cal-next');
  const closeBtn  = document.querySelector('.cal-detail-close');

  if (!grid) return;  // Not on the events page

  let currentIdx = 0;
  let selectedDay = null;

  /* ── Build month pills ────────────────────────────────────── */
  MONTHS.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'cal-pill' + (i === 0 ? ' is-active' : '');
    btn.textContent = m.label;
    btn.setAttribute('data-idx', i);
    btn.addEventListener('click', () => goToMonth(i));
    pillsWrap.appendChild(btn);
  });

  /* ── Render a month ───────────────────────────────────────── */
  function renderMonth(idx) {
    const m = MONTHS[idx];
    const firstDay = new Date(m.year, m.month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
    const today = new Date();

    // Update title
    title.textContent = `${MONTH_NAMES[m.month]} ${m.year}`;

    // Update pills
    pillsWrap.querySelectorAll('.cal-pill').forEach((p, i) => {
      p.classList.toggle('is-active', i === idx);
    });

    // Update nav buttons
    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === MONTHS.length - 1);

    // Close detail panel
    closeDetail();

    // Clear grid
    grid.innerHTML = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day is-empty';
      grid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasEvt = SCHEDULE[key];
      const isToday = today.getFullYear() === m.year && today.getMonth() === m.month && today.getDate() === d;

      const cell = document.createElement('div');
      cell.className = 'cal-day cal-animate';
      cell.style.animationDelay = `${(firstDay + d - 1) * 18}ms`;

      if (isToday) cell.classList.add('is-today');
      if (hasEvt) cell.classList.add('has-events');

      // Day number
      const num = document.createElement('span');
      num.className = 'cal-day-num';
      num.textContent = d;
      cell.appendChild(num);

      if (hasEvt) {
        // Dots
        const dots = document.createElement('div');
        dots.className = 'cal-day-dots';
        hasEvt.events.forEach(e => {
          const dot = document.createElement('span');
          dot.className = `cal-dot cal-dot--${e.sport.toLowerCase()}`;
          dots.appendChild(dot);
        });
        cell.appendChild(dots);

        // Venue bar
        const bar = document.createElement('div');
        const venueClass = hasEvt.venue === MM ? 'muriel' : 'bellerose';
        bar.className = `cal-venue-bar cal-venue-bar--${venueClass}`;
        cell.appendChild(bar);

        // Click handler
        cell.addEventListener('click', () => openDetail(d, m, key));
      }

      grid.appendChild(cell);
    }
  }

  /* ── Detail panel ─────────────────────────────────────────── */
  function openDetail(day, m, key) {
    const data = SCHEDULE[key];
    if (!data) return;

    // Deselect previous
    grid.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));

    // Select current
    const cells = grid.querySelectorAll('.cal-day.has-events');
    cells.forEach(c => {
      if (c.querySelector('.cal-day-num').textContent == day) {
        c.classList.add('is-selected');
      }
    });

    // Day name
    const dateObj = new Date(m.year, m.month, day);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    detailDate.textContent = `${dayNames[dateObj.getDay()]}, ${MONTH_NAMES[m.month]} ${day}, ${m.year}`;

    // Build event cards
    detailEvts.innerHTML = '';

    // Venue header
    const venueClass = data.venue === MM ? 'muriel' : 'bellerose';

    data.events.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'cal-event-card';

      const sportLC = evt.sport.toLowerCase();
      const icon = sportLC === 'badminton' ? '🏸' : '🏐';

      card.innerHTML = `
        <div class="cal-event-icon cal-event-icon--${sportLC}">${icon}</div>
        <div class="cal-event-info">
          <h5>${evt.sport}</h5>
          <p>${evt.time}</p>
          <span class="cal-venue-tag cal-venue-tag--${venueClass}">${data.venue}</span>
        </div>
      `;
      detailEvts.appendChild(card);
    });

    detail.classList.add('is-open');
    selectedDay = day;

    // Smooth scroll to detail if it's off screen
    setTimeout(() => {
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  function closeDetail() {
    detail.classList.remove('is-open');
    grid.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
    selectedDay = null;
  }

  /* ── Navigation ───────────────────────────────────────────── */
  function goToMonth(idx) {
    if (idx < 0 || idx >= MONTHS.length) return;
    currentIdx = idx;
    renderMonth(idx);
  }

  prevBtn.addEventListener('click', () => goToMonth(currentIdx - 1));
  nextBtn.addEventListener('click', () => goToMonth(currentIdx + 1));
  closeBtn.addEventListener('click', closeDetail);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('full-calendar')) return;
    if (e.key === 'ArrowLeft') goToMonth(currentIdx - 1);
    if (e.key === 'ArrowRight') goToMonth(currentIdx + 1);
    if (e.key === 'Escape') closeDetail();
  });

  /* ── Initial render ───────────────────────────────────────── */
  renderMonth(0);

})();
