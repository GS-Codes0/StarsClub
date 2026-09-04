/* ==========================================================================
   STARS CLUB — Apple/Monogrid Interactive Overhaul v7
   GSAP + ScrollTrigger powered. All original features preserved.
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;
  var gsapReady = typeof gsap !== "undefined";

  /* ================================================================
     Page curtain — cinematic load reveal
     ================================================================ */
  var curtain = document.querySelector(".page-curtain");
  if (curtain) {
    curtain.addEventListener("animationend", function () {
      curtain.remove();
    });
  }

  /* ================================================================
     Page transition system — clip-path wipe between pages
     ================================================================ */
  (function () {
    if (reducedMotion) return;
    var overlay = document.querySelector(".page-transition-overlay");
    if (!overlay) return;

    // Intercept internal link clicks
    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") || link.target === "_blank") return;

      e.preventDefault();
      overlay.classList.add("is-transitioning");

      setTimeout(function () {
        window.location.href = href;
      }, 480);
    });

    // Reveal on load
    overlay.classList.add("is-exiting");
    setTimeout(function () { overlay.classList.remove("is-exiting"); }, 600);

    // Fix back button issue (bfcache)
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        overlay.classList.remove("is-transitioning");
      }
    });
  })();

  /* ================================================================
     Nav toggle
     ================================================================ */
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () { body.classList.toggle("nav-open"); });
  }
  document.querySelectorAll(".nav-list a, .nav-overlay .nav-meta a").forEach(function (a) {
    a.addEventListener("click", function () { body.classList.remove("nav-open"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") body.classList.remove("nav-open");
  });

  /* ================================================================
     Header scroll-depth glass intensifier
     ================================================================ */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var depth = Math.min(y / 200, 1);
      header.style.setProperty("--header-depth", depth);
      // Hide header on scroll down, show on scroll up
      if (y > lastScroll && y > 120) {
        header.classList.add("is-hidden");
      } else {
        header.classList.remove("is-hidden");
      }
      lastScroll = y;
    }, { passive: true });
  }

  /* ================================================================
     Scroll progress bar
     ================================================================ */
  var progress = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ================================================================
     Back to top
     ================================================================ */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-shown", window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ================================================================
     HERO — Character-split text animation
     ================================================================ */
  (function () {
    if (reducedMotion) return;
    var lines = document.querySelectorAll(".hero h1 .line");
    lines.forEach(function (line) {
      var text = line.textContent;
      var isAccent = line.classList.contains("accent-text");
      line.textContent = "";
      line.style.opacity = "1";
      line.style.transform = "none";
      line.style.animation = "none";

      text.split("").forEach(function (char, i) {
        var span = document.createElement("span");
        span.className = "char-unit";
        span.textContent = char === " " ? "\u00a0" : char;
        span.style.setProperty("--ci", i);
        if (isAccent) span.style.color = "var(--accent)";
        line.appendChild(span);
      });
    });

    // Trigger char animations after curtain (1.2s delay)
    setTimeout(function () {
      document.querySelectorAll(".char-unit").forEach(function (c) {
        c.classList.add("is-visible");
      });
    }, 1000);
  })();

  /* ================================================================
     GSAP ScrollTrigger interactions
     ================================================================ */
  if (gsapReady && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // — Pinned hero depth parallax
    var heroSection = document.querySelector(".hero:not(.hero--inner)");
    if (heroSection) {
      var heroWm = heroSection.querySelector(".hero-watermark");
      var heroContent = heroSection.querySelector(".hero-content");
      var heroFoot = heroSection.querySelector(".hero-foot");

      if (heroWm) {
        gsap.to(heroWm, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: true }
        });
      }
      if (heroContent) {
        gsap.to(heroContent, {
          yPercent: 20,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: { trigger: heroSection, start: "40% top", end: "bottom top", scrub: true }
        });
      }
      if (heroFoot) {
        gsap.to(heroFoot, {
          yPercent: 25,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: heroSection, start: "30% top", end: "bottom top", scrub: true }
        });
      }
    }

    // — Section heading GSAP reveal (replaces CSS .reveal for h2/h3)
    document.querySelectorAll(".section-head h2, .section-head h3").forEach(function (el) {
      gsap.fromTo(el,
        { y: 60, opacity: 0, skewY: 3 },
        {
          y: 0, opacity: 1, skewY: 0, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
        }
      );
    });

    // — Stat strip counters with GSAP spring
    document.querySelectorAll(".hero-stat-strip .stat").forEach(function (stat, i) {
      gsap.fromTo(stat,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.6)",
          delay: i * 0.08,
          scrollTrigger: { trigger: stat.closest(".hero-stat-strip"), start: "top 90%", toggleActions: "play none none none" }
        }
      );
    });

    // — Quote block dramatic entrance
    document.querySelectorAll(".quote-block").forEach(function (el) {
      gsap.fromTo(el,
        { scale: 0.88, opacity: 0, y: 40 },
        {
          scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" }
        }
      );
      // Mark as handled so old observer skips it
      el.dataset.gsapDone = "1";
    });

    // — Animated divider lines
    document.querySelectorAll(".divider-anim").forEach(function (el) {
      gsap.fromTo(el,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
        }
      );
      el.dataset.gsapDone = "1";
    });

    // — Staggered card grids
    document.querySelectorAll(".grid, .reveal-stagger").forEach(function (grid) {
      var children = Array.from(grid.querySelectorAll(".card, .cd-box"));
      if (!children.length) return;
      gsap.fromTo(children,
        { y: 50, opacity: 0, scale: 0.94 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "expo.out",
          stagger: { amount: 0.5, from: "start" },
          scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    // — Media frame reveal with GSAP
    document.querySelectorAll(".media-reveal").forEach(function (el) {
      gsap.fromTo(el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
      el.dataset.gsapDone = "1";
    });

    // — Scrub section: CSS sticky + scroll-driven horizontal translation.
    // The section padding is zeroed in CSS so the sticky element's travel range
    // exactly equals (section height - viewport height) = moveAmount.
    var scrubSection = document.querySelector("#scrub-initiatives");
    var scrubTrack = document.querySelector("#scrub-track");
    var scrubFill = document.querySelector("#scrub-progress-fill");
    var isMobile = window.matchMedia("(max-width: 900px)").matches;

    if (scrubSection && scrubTrack && !isMobile) {
      var scrubCards = Array.from(scrubTrack.querySelectorAll(".showcase-card"));
      var moveAmount = 0;

      function calcScrub() {
        // Reset track position so scrollWidth reflects full content width
        gsap.set(scrubTrack, { x: 0, force3D: true });

        // scrollWidth = total width of all 14 cards + gaps + track padding
        var totalW = scrubTrack.scrollWidth;
        var viewW = window.innerWidth;

        // Travel distance: enough to bring all cards into view, no extra padding
        moveAmount = Math.max(0, totalW - viewW);

        // Section height: 1 viewport (the sticky frame) + moveAmount (scroll travel).
        scrubSection.style.height = (window.innerHeight + moveAmount) + "px";
      }

      function updateScrub() {
        if (moveAmount <= 0) return;
        var rect = scrubSection.getBoundingClientRect();
        var scrolledIn = -rect.top;  // 0 when section top hits viewport top, grows as we scroll down

        // progress 0→1 maps 1:1 to the track's full horizontal travel
        var progress = Math.max(0, Math.min(1, scrolledIn / moveAmount));

        gsap.set(scrubTrack, { x: -(progress * moveAmount), force3D: true });
        if (scrubFill) scrubFill.style.width = (progress * 100) + "%";

        // Focus/defocus cards based on proximity to viewport center
        var midX = window.innerWidth / 2;
        scrubCards.forEach(function (card) {
          var r = card.getBoundingClientRect();
          var cardMid = r.left + r.width / 2;
          var dist = Math.abs(cardMid - midX);
          card.classList.toggle("is-focused", dist < 220);
          card.classList.toggle("is-defocused", dist >= 220);
        });
      }

      // Init after window load so fonts/images are settled and scrollWidth is accurate
      function initScrub() {
        calcScrub();
        updateScrub();
        window.addEventListener("scroll", updateScrub, { passive: true });
        window.addEventListener("resize", function () {
          calcScrub();
          updateScrub();
        });
      }

      if (document.readyState === "complete") {
        requestAnimationFrame(function () { requestAnimationFrame(initScrub); });
      } else {
        window.addEventListener("load", function () {
          requestAnimationFrame(function () { requestAnimationFrame(initScrub); });
        });
      }

      // Card entrance stagger
      gsap.fromTo(scrubCards,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: scrubSection, start: "top 85%", toggleActions: "play none none none" }
        }
      );

      scrubSection.dataset.gsapDone = "1";
    }



    // — Scroll velocity skew effect
    (function () {
      var lastScrollY = window.scrollY;
      var velocity = 0;
      var skewEls = document.querySelectorAll(".marquee-track, .hero h1, .section-head h2");

      function updateVelocitySkew() {
        var currentY = window.scrollY;
        velocity = (currentY - lastScrollY) * 0.08;
        velocity = Math.max(-8, Math.min(8, velocity));
        lastScrollY = currentY;

        skewEls.forEach(function (el) {
          gsap.to(el, { skewY: velocity * 0.6, duration: 0.4, ease: "power1.out", overwrite: "auto" });
        });
      }

      window.addEventListener("scroll", updateVelocitySkew, { passive: true });
    })();

    // — Marquee 3D perspective enhanced
    var marquees = document.querySelectorAll(".marquee");
    marquees.forEach(function (m) {
      gsap.to(m, {
        ease: "none",
        scrollTrigger: {
          trigger: m,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: function (self) {
            var tilt = (self.progress - 0.5) * 6;
            m.style.transform = "perspective(900px) rotateX(" + tilt + "deg)";
          }
        }
      });
    });

    // — Footer stagger reveal
    gsap.fromTo(".footer-reveal",
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.85, ease: "expo.out",
        scrollTrigger: { trigger: "footer", start: "top 92%", toggleActions: "play none none none" }
      }
    );

  } // end gsapReady block

  /* ================================================================
     Fallback IntersectionObserver reveals (when GSAP not loaded or reduced motion)
     ================================================================ */
  document.querySelectorAll(".reveal-stagger").forEach(function (group) {
    Array.from(group.children).forEach(function (child, i) {
      child.style.setProperty("--i", i);
      if (!child.classList.contains("reveal")) child.classList.add("reveal");
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(function (el) {
      if (gsapReady && !reducedMotion) {
        // Still add is-visible so content is accessible; GSAP overrides transform
        setTimeout(function () { el.classList.add("is-visible"); }, 50);
      } else {
        io.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ================================================================
     Quote block fallback
     ================================================================ */
  if (!gsapReady || reducedMotion) {
    var quoteBlocks = document.querySelectorAll(".quote-block");
    if (quoteBlocks.length && "IntersectionObserver" in window && !reducedMotion) {
      var quoteIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-visible"); quoteIO.unobserve(entry.target); }
        });
      }, { threshold: 0.2 });
      quoteBlocks.forEach(function (q) { quoteIO.observe(q); });
    } else {
      document.querySelectorAll(".quote-block").forEach(function (q) { q.classList.add("is-visible"); });
    }
  }

  /* ================================================================
     Image clip-path reveal fallback
     ================================================================ */
  if (!gsapReady || reducedMotion) {
    var mediaReveals = document.querySelectorAll(".media-reveal");
    if (mediaReveals.length && "IntersectionObserver" in window && !reducedMotion) {
      var mediaIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); mediaIO.unobserve(entry.target); }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      mediaReveals.forEach(function (el) { mediaIO.observe(el); });
    } else {
      document.querySelectorAll(".media-reveal").forEach(function (el) { el.classList.add("is-revealed"); });
    }
  }

  /* ================================================================
     Animated divider lines fallback
     ================================================================ */
  if (!gsapReady || reducedMotion) {
    var dividerAnims = document.querySelectorAll(".divider-anim");
    if (dividerAnims.length && "IntersectionObserver" in window && !reducedMotion) {
      var dividerIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-visible"); dividerIO.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      dividerAnims.forEach(function (el) { dividerIO.observe(el); });
    } else {
      document.querySelectorAll(".divider-anim").forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ================================================================
     Text Scramble effect on eyebrow labels
     ================================================================ */
  (function () {
    if (reducedMotion) return;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦★";

    function scramble(el) {
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = "1";
      var original = el.textContent.replace(/^[\s\u2014—\-·]+/, "");
      // Don't scramble the line decoration (::before)
      var iterations = 0;
      var maxIter = original.length * 3;

      var interval = setInterval(function () {
        el.textContent = original.split("").map(function (char, i) {
          if (i < Math.floor(iterations / 3)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        iterations++;
        if (iterations >= maxIter) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 30);
    }

    if ("IntersectionObserver" in window) {
      var scrambleIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            scramble(entry.target);
            scrambleIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll(".eyebrow").forEach(function (el) {
        // Skip nav eyebrows
        if (el.closest("nav") || el.closest("header")) return;
        scrambleIO.observe(el);
      });
    }
  })();

  /* ================================================================
     Gallery items stagger entrance
     ================================================================ */
  var galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length && "IntersectionObserver" in window && !reducedMotion) {
    var galleryIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(galleryItems).indexOf(entry.target);
          var delay = (idx % 4) * 80 + Math.floor(idx / 4) * 60;
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("is-visible");
          galleryIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
    galleryItems.forEach(function (el) { galleryIO.observe(el); });
  } else {
    galleryItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ================================================================
     Side scroll-spy section nav
     ================================================================ */
  (function () {
    var sections = Array.from(document.querySelectorAll("main section[data-label]"));
    if (sections.length < 2) return;

    var nav = document.createElement("nav");
    nav.className = "section-nav";
    nav.setAttribute("aria-label", "Page sections");

    sections.forEach(function (sec, i) {
      if (!sec.id) sec.id = "sn-section-" + i;
      var item = document.createElement("button");
      item.className = "sn-item";
      item.type = "button";
      item.innerHTML = '<span class="sn-label">' + sec.dataset.label + '</span><span class="sn-dot"></span>';
      item.addEventListener("click", function () {
        sec.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      });
      nav.appendChild(item);
    });
    document.body.appendChild(nav);

    var items = Array.from(nav.querySelectorAll(".sn-item"));
    if ("IntersectionObserver" in window) {
      var snIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var i = sections.indexOf(entry.target);
          if (i === -1) return;
          if (entry.isIntersecting) {
            items.forEach(function (it) { it.classList.remove("is-active"); });
            items[i].classList.add("is-active");
          }
        });
      }, { threshold: 0, rootMargin: "-45% 0px -45% 0px" });
      sections.forEach(function (sec) { snIo.observe(sec); });
    }
  })();

  /* ================================================================
     Animated counters — spring-physics easing
     ================================================================ */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { counterIO.observe(c); });
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var duration = reducedMotion ? 0 : 1600;
    var start = null;

    if (duration === 0) { el.textContent = target + suffix; return; }

    // Spring-physics easing (overshoot then settle)
    function springEase(t) {
      var c4 = (2 * Math.PI) / 4;
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    function tick(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = springEase(t);
      var value = Math.round(target * Math.max(0, eased));
      el.textContent = value + suffix;

      // Gold glow pulse at peak
      if (t > 0.7 && t < 0.9) {
        el.style.textShadow = "0 0 30px rgba(231,183,64," + ((0.9 - t) * 5) + ")";
      } else {
        el.style.textShadow = "";
      }

      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ================================================================
     Funding bar
     ================================================================ */
  document.querySelectorAll(".bar-fill").forEach(function (bar) {
    var pct = bar.dataset.pct || "0";
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(function () { bar.style.width = pct + "%"; });
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    barIO.observe(bar);
  });

  /* ================================================================
     Cursor-reactive spotlight
     ================================================================ */
  var spotlightEl = document.documentElement;
  var rafPending = false, lastX = 50, lastY = 30;
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    window.addEventListener("mousemove", function (e) {
      lastX = (e.clientX / window.innerWidth) * 100;
      lastY = (e.clientY / window.innerHeight) * 100;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(function () {
          spotlightEl.style.setProperty("--mx", lastX + "%");
          spotlightEl.style.setProperty("--my", lastY + "%");
          rafPending = false;
        });
      }
    });
  }

  /* ================================================================
     Hero parallax — mouse-driven content drift
     ================================================================ */
  document.querySelectorAll(".hero").forEach(function (hero) {
    var watermark = hero.querySelector(".hero-watermark");
    var content = hero.querySelector(".hero-content");
    if (!watermark && !content) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || reducedMotion) return;
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      if (watermark) watermark.style.transform = "translate(" + (x * -28) + "px, calc(-50% + " + (y * -28) + "px))";
      if (content) content.style.transform = "translate(" + (x * 14) + "px, " + (y * 8) + "px)";
    });
    hero.addEventListener("mouseleave", function () {
      if (watermark) watermark.style.transform = "";
      if (content) content.style.transform = "";
    });
  });

  /* ================================================================
     Scroll-based parallax images
     ================================================================ */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !reducedMotion && !gsapReady) {
    // Only use manual parallax if GSAP isn't handling it
    var parallaxTicking = false;
    function updateParallax() {
      var winH = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - winH / 2) / winH;
        var speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = "translateY(" + (offset * speed * -100) + "px)";
      });
      parallaxTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!parallaxTicking) { requestAnimationFrame(updateParallax); parallaxTicking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ================================================================
     Floating orbs drift with scroll
     ================================================================ */
  var orbs = document.querySelectorAll(".orb");
  if (orbs.length && !reducedMotion) {
    var orbTicking = false;
    function updateOrbs() {
      var scrollY = window.scrollY;
      orbs.forEach(function (orb, i) {
        var speed = [0.03, -0.02, 0.015][i] || 0.02;
        var xDrift = Math.sin(scrollY * 0.001 + i * 2) * 40;
        orb.style.transform = "translate(" + xDrift + "px, " + (scrollY * speed) + "px) scale(" + (1 + Math.sin(scrollY * 0.0005 + i) * 0.08) + ")";
      });
      orbTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!orbTicking) { requestAnimationFrame(updateOrbs); orbTicking = true; }
    }, { passive: true });
    updateOrbs();
  }

  /* ================================================================
     True magnetic buttons — split-layer
     ================================================================ */
  var tiltEnabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;

  function bindMagneticBtn(btn) {
    var inner = btn.querySelector(".btn-inner") || btn;

    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      // Outer shell: gentle pull
      btn.style.transform = "translate(" + (x * 14) + "px, " + (y * 14) + "px)";
      // Inner text: slightly more pull (split-layer)
      if (inner !== btn) {
        inner.style.transform = "translate(" + (x * 6) + "px, " + (y * 6) + "px)";
      }
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
      if (inner !== btn) inner.style.transform = "";
    });
  }

  function bindTilt(el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = "perspective(700px) rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 8) + "deg) translateY(-4px) scale(1.01)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }

  function bindCardGlow(el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", (e.clientX - rect.left) + "px");
      el.style.setProperty("--glow-y", (e.clientY - rect.top) + "px");
    });
  }

  window.initTiltOn = function (els) {
    if (!tiltEnabled) return;
    els.forEach(bindTilt);
  };

  if (tiltEnabled) {
    document.querySelectorAll(".card, .tilt").forEach(bindTilt);
    document.querySelectorAll(".card").forEach(bindCardGlow);
    document.querySelectorAll(".btn").forEach(bindMagneticBtn);
  }

  /* ================================================================
     Custom cursor — lerped with scale on hover
     ================================================================ */
  var cursor = document.querySelector(".cursor-dot");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
    var cursorScale = 1, targetScale = 1;

    window.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.classList.add("is-active");
    });

    function lerpCursor() {
      cursorX += (targetX - cursorX) * 0.12;
      cursorY += (targetY - cursorY) * 0.12;
      cursorScale += (targetScale - cursorScale) * 0.12;
      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";
      requestAnimationFrame(lerpCursor);
    }
    if (!reducedMotion) {
      lerpCursor();
    } else {
      window.addEventListener("mousemove", function (e) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      });
    }

    document.querySelectorAll("a, button, .gallery-item, .showcase-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-big"); targetScale = 4; });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-big"); targetScale = 1; });
    });
  }

  /* ================================================================
     Sports background canvas — volleyball & shuttlecocks floating passively
     ================================================================ */
  (function () {
    if (reducedMotion) return;

    var canvas = document.createElement("canvas");
    canvas.id = "sports-bg-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = [
      "position:fixed", "inset:0", "width:100%", "height:100%",
      "z-index:0", "pointer-events:none", "opacity:1"
    ].join(";");
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext("2d");
    var W, H, objs = [], time = 0;
    var GOLD = "231,183,64", WHITE = "247,246,242";

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      spawnObjects();
    }

    // Create one flying object — spawned from a random screen edge
    // Create one flying object — spawned from a random screen edge
    function makeObj(startAnywhere) {
      var isVball = Math.random() > 0.45;
      
      // SLOWED DOWN: 1.2 to 3.0 px/frame for a graceful, drifting float
      var speed = 1.2 + Math.random() * 1.8; 
      var angle = (Math.random() * Math.PI * 0.6) - Math.PI * 0.3; 
      var goRight = Math.random() > 0.35; 
      var minSpeed = 0.8;
      
      var vx = goRight
        ? Math.max(minSpeed, speed * Math.cos(angle))
        : -Math.max(minSpeed, speed * Math.cos(angle));
      var vy = speed * Math.sin(angle) + (isVball ? 0 : -0.3); // Lessened the birdie lift
      
      var startX, startY;
      if (startAnywhere) {
        startX = Math.random() * (W + 200) - 100;
        startY = Math.random() * (H + 200) - 100;
      } else {
        if (goRight) { startX = -100; } else { startX = W + 100; }
        startY = H * 0.1 + Math.random() * H * 0.8;
      }
      
      return {
        type: isVball ? "vball" : "birdie",
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        wobble: (Math.random() - 0.5) * 1.2,  
        size: isVball ? (28 + Math.random() * 22) : (22 + Math.random() * 18), 
        rot: Math.random() * Math.PI * 2,
        // SLOWED DOWN: Less dizzying rotation
        rotV: (isVball ? 0.015 : 0.03) + Math.random() * 0.02, 
        rotDir: Math.random() > 0.5 ? 1 : -1,
        alpha: 0.22 + Math.random() * 0.16,  
        phase: Math.random() * Math.PI * 2,
        t: 0  
      };
    }

    function spawnObjects() {
      objs = [];
      // More objects for a richer effect, but cap at 18 for performance
      var count = Math.min(18, Math.max(8, Math.round(W * H / 55000)));
      for (var i = 0; i < count; i++) {
        objs.push(makeObj(true)); // scatter initial positions across screen
      }
    }

 // Load this once, outside drawVolleyball (e.g. at the top of your script)
var logoImg = new Image();
logoImg.src = "starslogo.png"; // path to the Stars Club logo
var logoLoaded = false;
logoImg.onload = function() { logoLoaded = true; };

function drawVolleyball(x, y, r, rot, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + GOLD + ",1)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Molten-style sweeping curved panels (FLISTATEC propeller look)
      ctx.strokeStyle = "rgba(" + GOLD + ",0.75)";
      ctx.lineWidth = 0.9;

      for (var i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 3) * i);

        // Main sweeping curved bands that form the Molten swirl
        ctx.beginPath();
        ctx.moveTo(0, r * 0.15);
        ctx.bezierCurveTo(r * 0.5, r * 0.4, r * 0.8, 0, r, -r * 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -r * 0.15);
        ctx.bezierCurveTo(r * 0.4, -r * 0.2, r * 0.7, r * 0.3, r * 0.866, r * 0.5);
        ctx.stroke();

        // Cross seams (breaking the bands into rectangular block panels)
        ctx.beginPath();
        ctx.moveTo(r * 0.45, r * 0.2);
        ctx.lineTo(r * 0.35, -r * 0.15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(r * 0.75, r * 0.1);
        ctx.lineTo(r * 0.65, -r * 0.25);
        ctx.stroke();

        ctx.restore();
      }

      // --- Logo badge in the center ---
      if (logoLoaded) {
        ctx.save();
        ctx.rotate(-rot); // counter-rotate so the logo stays upright as the ball spins

        var logoR = r * 0.55; // tweak this to size the badge relative to the ball

        // Clip to a circle so the logo reads as a round badge
        ctx.beginPath();
        ctx.arc(0, 0, logoR, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(logoImg, -logoR, -logoR, logoR * 2, logoR * 2);

        ctx.restore();

        // Optional thin gold ring around the badge for separation
        ctx.beginPath();
        ctx.arc(0, 0, logoR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(" + GOLD + ",0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
}

    /* ---- Draw shuttlecock / birdie ---- */
    function drawBirdie(x, y, size, rot, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      var head = size * 0.22;   // cork/rubber head radius
      var coneH = size * 0.82;  // feather cone height
      var rimR = size * 0.42;   // top rim radius
      var numQ = 10;            // number of feather quills

      // Feather quills — lines from head to top rim
      ctx.strokeStyle = "rgba(" + GOLD + ",0.55)";
      ctx.lineWidth = 0.7;
      for (var i = 0; i < numQ; i++) {
        var angle = (i / numQ) * Math.PI * 2;
        var tx = Math.cos(angle) * rimR;
        var ty = -coneH + Math.sin(angle) * rimR * 0.25;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      // Top rim (ellipse, foreshortened)
      ctx.beginPath();
      ctx.ellipse(0, -coneH, rimR, rimR * 0.24, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + GOLD + ",0.9)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Feather webs between quills (very light arcs)
      ctx.strokeStyle = "rgba(" + WHITE + ",0.18)";
      ctx.lineWidth = 0.5;
      for (var j = 0; j < numQ; j++) {
        var a1 = (j / numQ) * Math.PI * 2;
        var a2 = ((j + 1) / numQ) * Math.PI * 2;
        var mx = (Math.cos(a1) + Math.cos(a2)) * 0.5 * rimR;
        var my = -coneH + (Math.sin(a1) + Math.sin(a2)) * 0.5 * rimR * 0.24;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a1) * rimR, -coneH + Math.sin(a1) * rimR * 0.24);
        ctx.quadraticCurveTo(mx * 1.15, my, Math.cos(a2) * rimR, -coneH + Math.sin(a2) * rimR * 0.24);
        ctx.stroke();
      }

      // Rubber head (cork base)
      ctx.beginPath();
      ctx.arc(0, 0, head, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + WHITE + ",0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(" + GOLD + ",0.9)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      time += 0.008;
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < objs.length; i++) {
        var o = objs[i];
        o.t++;

        // Slight arc wobble perpendicular to travel direction
        var wobbleX = Math.sin(time * 1.1 + o.phase) * o.wobble;
        var wobbleY = Math.cos(time * 0.8 + o.phase) * o.wobble * 0.5;
        o.x += o.vx + wobbleX;
        o.y += o.vy + wobbleY;
        o.rot += o.rotV * o.rotDir;

        // Respawn from opposite edge when fully off-screen
        var margin = 120;
        var offscreen = o.x < -margin || o.x > W + margin || o.y < -margin || o.y > H + margin;
        if (offscreen) {
          // Replace with a fresh object entering from an edge
          objs[i] = makeObj(false);
          continue;
        }

        if (o.type === "vball") {
          drawVolleyball(o.x, o.y, o.size, o.rot, o.alpha);
        } else {
          drawBirdie(o.x, o.y, o.size, o.rot, o.alpha);
        }
      }

      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
  })();

  /* ================================================================
     Constellation canvas — enhanced organic motion
     ================================================================ */
  document.querySelectorAll(".hero-canvas").forEach(function (canvas) {
    var density = parseFloat(canvas.dataset.density || "1");
    initConstellation(canvas, density);
  });


  function initConstellation(canvas, density) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, points;
    var mouse = { x: null, y: null };
    var time = 0;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(30, Math.round((w * h) / 14000 * density));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.5 + 0.6,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    var bursts = [];

    function step() {
      time += 0.008;
      ctx.clearRect(0, 0, w, h);
      var maxDist = Math.min(170, w / 4.5);

      points.forEach(function (p) {
        p.x += p.vx + Math.sin(time + p.phase) * 0.12;
        p.y += p.vy + Math.cos(time * 0.7 + p.phase) * 0.1;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.vx *= 0.988; p.vy *= 0.988;
        if (Math.abs(p.vx) < 0.04) p.vx += (Math.random() - 0.5) * 0.015;
        if (Math.abs(p.vy) < 0.04) p.vy += (Math.random() - 0.5) * 0.015;
      });

      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var a = points[i], b = points[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = "rgba(231,183,64," + alpha + ")";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.x !== null) {
          var mdx = points[i].x - mouse.x, mdy = points[i].y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 220) {
            var malpha = (1 - mdist / 220) * 0.7;
            ctx.strokeStyle = "rgba(247,246,242," + malpha + ")";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      points.forEach(function (p) {
        var pulse = 1 + Math.sin(time * 2 + p.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(247,246,242," + (0.6 + Math.sin(time + p.phase) * 0.2) + ")";
        ctx.fill();
      });

      for (var bi = bursts.length - 1; bi >= 0; bi--) {
        var burst = bursts[bi];
        burst.t += 1;
        var life = burst.t / burst.maxT;
        if (life >= 1) { bursts.splice(bi, 1); continue; }
        var radius = burst.maxR * life;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(231,183,64," + (1 - life) * 0.8 + ")";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        var radius2 = burst.maxR * life * 0.6;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(247,246,242," + (1 - life) * 0.4 + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      if (!reducedMotion) requestAnimationFrame(step);
    }

    canvas.addEventListener("click", function (e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      bursts.push({ x: cx, y: cy, t: 0, maxT: 42, maxR: 150 });
      points.forEach(function (p) {
        var dx = p.x - cx, dy = p.y - cy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 180) {
          var force = (1 - dist / 180) * 2.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
      if (reducedMotion) step();
    });

    canvas.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", function () { mouse.x = null; mouse.y = null; });

    window.addEventListener("resize", resize);
    resize();
    step();
    if (reducedMotion) step();
  }

  /* ================================================================
     Click ripple
     ================================================================ */
  if (!reducedMotion) {
    document.querySelectorAll(".btn, .choice-pill, .filter-btn, .accordion-trigger").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var rect = el.getBoundingClientRect();
        var ripple = document.createElement("span");
        var size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
        el.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  /* ================================================================
     Donation impact calculator
     ================================================================ */
  (function () {
    var slider = document.querySelector("#impactSlider");
    var amountEl = document.querySelector("#impactAmount");
    var textEl = document.querySelector("#impactText");
    var barFill = document.querySelector("#impactBarFill");
    if (!slider) return;

    var tiers = [
      { max: 25, text: "funds a set of nylon birdies to keep badminton drop-in running." },
      { max: 60, text: "funds a volleyball and net hardware for an outdoor summer session." },
      { max: 120, text: "covers a month of gym rental for weekly badminton & volleyball drop-in." },
      { max: 300, text: "funds new nets, poles, and balls for a full season of play." },
      { max: 600, text: "supports a senior's-program session plus equipment for the season." },
      { max: 1000, text: "funds a full season of equipment and facility access for one program." }
    ];

    function update() {
      var val = parseInt(slider.value, 10);
      if (amountEl) {
        amountEl.textContent = "$" + val.toLocaleString();
        amountEl.classList.add("is-bumped");
        setTimeout(function () { amountEl.classList.remove("is-bumped"); }, 150);
      }
      var tier = tiers.find(function (t) { return val <= t.max; }) || tiers[tiers.length - 1];
      if (textEl) textEl.textContent = tier.text;
      if (barFill) {
        var pct = ((val - slider.min) / (slider.max - slider.min)) * 100;
        barFill.style.width = pct + "%";
      }
    }
    slider.addEventListener("input", update);
    update();
  })();

  /* ================================================================
     Scroll-scrubbed horizontal section — fallback (no GSAP)
     ================================================================ */
  (function () {
    var section = document.querySelector("#scrub-initiatives");
    var track = document.querySelector("#scrub-track");
    var fill = document.querySelector("#scrub-progress-fill");
    if (!section || !track) return;
    if (section.dataset.gsapDone) return; // GSAP handled it

    var isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (reducedMotion || isMobile) {
      section.classList.add("is-fallback");
      return;
    }

    var cards = Array.from(track.querySelectorAll(".showcase-card"));

    function update() {
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var progressVal = (-rect.top) / total;
      progressVal = Math.max(0, Math.min(1, progressVal));
      var maxX = Math.max(0, track.scrollWidth - track.parentElement.clientWidth + 80);
      track.style.transform = "translateX(-" + (progressVal * maxX) + "px)";
      if (fill) fill.style.width = (progressVal * 100) + "%";

      var viewCenter = track.parentElement.clientWidth / 2;
      cards.forEach(function (card) {
        var cardRect = card.getBoundingClientRect();
        var trackRect = track.parentElement.getBoundingClientRect();
        var cardCenter = cardRect.left - trackRect.left + cardRect.width / 2;
        var dist = Math.abs(cardCenter - viewCenter);
        if (dist < 200) {
          card.classList.add("is-focused");
          card.classList.remove("is-defocused");
        } else {
          card.classList.remove("is-focused");
          card.classList.add("is-defocused");
        }
      });
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    });
    window.addEventListener("resize", update);
    update();
  })();

  /* ================================================================
     Drag-to-scroll showcase rail
     ================================================================ */
  document.querySelectorAll(".showcase-rail").forEach(function (rail) {
    var isDown = false, startX = 0, scrollStart = 0;
    rail.addEventListener("mousedown", function (e) {
      isDown = true;
      rail.classList.add("is-dragging");
      startX = e.pageX;
      scrollStart = rail.scrollLeft;
    });
    window.addEventListener("mouseup", function () { isDown = false; rail.classList.remove("is-dragging"); });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      rail.scrollLeft = scrollStart - (e.pageX - startX);
    });
  });

  /* ================================================================
     Marquee duplication
     ================================================================ */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ================================================================
     Gallery filters
     ================================================================ */
  var filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.dataset.filter;
        document.querySelectorAll(".gallery-item").forEach(function (item) {
          var matches = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !matches);
        });
      });
    });
  }

  /* ================================================================
     Gallery lightbox
     ================================================================ */
  var lightbox = document.querySelector(".lightbox");
  var galleryGrid = document.querySelector(".gallery-grid");
  if (lightbox && galleryGrid) {
    var lbImg = lightbox.querySelector("img");
    var idx = 0;
    function visibleItems() { return Array.from(document.querySelectorAll(".gallery-item img")); }
    function openLb(items, i) { idx = i; lbImg.src = items[idx].src; lbImg.alt = items[idx].alt || ""; lightbox.classList.add("is-open"); }
    function closeLb() { lightbox.classList.remove("is-open"); }
    function next(dir) { var items = visibleItems(); idx = (idx + dir + items.length) % items.length; lbImg.src = items[idx].src; lbImg.alt = items[idx].alt || ""; }

    galleryGrid.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery-item");
      if (!item) return;
      var img = item.querySelector("img");
      var items = visibleItems();
      openLb(items, items.indexOf(img));
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", function () { next(-1); });
    lightbox.querySelector(".lightbox-nav.next").addEventListener("click", function () { next(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") next(1);
      if (e.key === "ArrowLeft") next(-1);
    });
  }

  /* ================================================================
     Gallery from Google Sheet
     ================================================================ */
  (function () {
    var grid = document.querySelector("#gallery-grid");
    var galleryStatus = document.querySelector("#gallery-status");
    var sheetUrl = window.STARS_GALLERY_SHEET_URL;
    if (!grid || !sheetUrl) return;

    // Force the browser to pull a fresh copy by adding a random timestamp to the end of the URL
    var freshUrl = sheetUrl + "&nocache=" + new Date().getTime();

    fetch(freshUrl, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Sheet request failed");
        return res.text();
      })
      .then(function (text) {
        // Strip invisible BOM characters that Google Sheets sometimes injects
        text = text.replace(/^\uFEFF/, '');
        var rows = parseCSV(text);
        if (!rows.length) throw new Error("Empty sheet");

        // Aggressively clean headers: lowercase, trim, and remove all spaces
        var header = rows[0].map(function (h) { return h.trim().toLowerCase().replace(/\s+/g, ''); });

        var idxMap = { url: header.indexOf("imageurl"), caption: header.indexOf("caption"), cat: header.indexOf("category") };
        var dataRows = rows.slice(1).filter(function (r) { return r.some(function (cell) { return cell && cell.trim() !== ""; }); });

        if (!dataRows.length || idxMap.url === -1) {
          if (galleryStatus) galleryStatus.textContent = "No photos listed in the sheet yet — showing the default gallery.";
          console.warn("Gallery sync failed: Could not find 'ImageUrl' column. Headers found:", header);
          return;
        }

        // ── Security: trusted image host allow-list ───────────────
        var ALLOWED_IMG_HOSTS = [
          'static.wixstatic.com',
          'lh3.googleusercontent.com',
          'lh4.googleusercontent.com',
          'lh5.googleusercontent.com',
          'lh6.googleusercontent.com',
          'drive.google.com'
        ];
        function isSafeImageUrl(rawUrl) {
          try {
            var u = new URL(rawUrl.trim());
            if (u.protocol !== 'https:') return false;
            return ALLOWED_IMG_HOSTS.some(function (h) {
              return u.hostname === h || u.hostname.endsWith('.' + h);
            });
          } catch (e) { return false; }
        }
        // ─────────────────────────────────────────────────────────

        grid.innerHTML = "";
        dataRows.forEach(function (r, i) {
          var url = (r[idxMap.url] || "").trim();
          // Reject any URL that isn't from a trusted HTTPS host
          if (!url || !isSafeImageUrl(url)) return;
          var caption = idxMap.caption > -1 ? r[idxMap.caption] : "";
          var cat = idxMap.cat > -1 ? (r[idxMap.cat] || "community").trim().toLowerCase() : "community";

          var el  = document.createElement("div");
          el.className = "gallery-item tilt is-visible";
          el.style.transitionDelay = ((i % 4) * 80) + "ms";
          el.dataset.category = cat;

          // Build img via DOM API — no innerHTML with external data
          var img = document.createElement("img");
          img.setAttribute("src", url);                          // already validated above
          img.setAttribute("alt", caption || "STARS Club photo");
          img.setAttribute("loading", "lazy");
          el.appendChild(img);

          if (caption) {
            var cap = document.createElement("span");
            cap.className = "gi-caption";
            cap.textContent = caption;                          // textContent — XSS-safe
            el.appendChild(cap);
          }

          grid.appendChild(el);
        });
        window.initTiltOn(grid.querySelectorAll(".tilt"));
      })
      .catch(function (err) {
        console.error("Gallery fetch error:", err);
        if (galleryStatus) galleryStatus.textContent = "Couldn't load the live gallery right now — showing the default photos instead.";
      });
  })();

  /* ================================================================
     Donate selector + PayPal checkout
     ================================================================ */
  var freqPills = document.querySelectorAll("[data-freq]");
  var amountPills = document.querySelectorAll("[data-amount]");
  var donateSummary = document.querySelector(".donate-summary");
  var donateBtn = document.querySelector("#donate-cta");
  var donateStatus = document.querySelector("#donate-status");
  var customAmountInput = document.querySelector("#donorCustomAmount");
  var donorNameInput = document.querySelector("#donorName");
  var donorEmailInput = document.querySelector("#donorEmail");

  if (freqPills.length && amountPills.length) {
    var state = { freq: "One time", amount: "50" };

    function renderDonate() {
      if (donateSummary) {
        donateSummary.innerHTML = 'You\'re giving <span class="accent-text">$' + state.amount + "</span> " + (state.freq === "One time" ? "once" : state.freq.toLowerCase());
      }
      if (donateBtn) {
        var dtext = donateBtn.querySelector(".dtext");
        var label = "Donate $" + state.amount + (state.freq === "One time" ? " securely" : " / " + state.freq.toLowerCase().replace("ly", ""));
        if (dtext) dtext.textContent = label; else donateBtn.textContent = label;
      }
    }
    freqPills.forEach(function (p) {
      p.addEventListener("click", function () {
        freqPills.forEach(function (o) { o.classList.remove("active"); });
        p.classList.add("active"); state.freq = p.dataset.freq; renderDonate();
      });
    });
    amountPills.forEach(function (p) {
      p.addEventListener("click", function () {
        amountPills.forEach(function (o) { o.classList.remove("active"); });
        p.classList.add("active"); state.amount = p.dataset.amount;
        if (customAmountInput) customAmountInput.value = "";
        renderDonate();
      });
    });
    if (customAmountInput) {
      customAmountInput.addEventListener("input", function () {
        if (customAmountInput.value && parseFloat(customAmountInput.value) > 0) {
          amountPills.forEach(function (o) { o.classList.remove("active"); });
          state.amount = parseFloat(customAmountInput.value).toString();
          renderDonate();
        }
      });
    }
    renderDonate();

    function showDonateStatus(msg) {
      if (!donateStatus) return;
      donateStatus.textContent = msg;
      donateStatus.classList.add("is-shown");
    }

    // PayPal integration removed — donations handled via external link only.

    if (donateBtn) {
      donateBtn.addEventListener("click", function () {
        if (donateStatus) { donateStatus.textContent = ""; donateStatus.classList.remove("is-shown"); }
        var name = donorNameInput ? donorNameInput.value.trim() : "";
        var email = donorEmailInput ? donorEmailInput.value.trim() : "";
        if (!name || !email) { showDonateStatus("Please add your name and email so we can send a receipt."); return; }
        var amount = parseFloat(state.amount);
        if (!amount || amount <= 0) { showDonateStatus("Please choose or enter a valid amount."); return; }
        var cfg = window.STARS_DONATE_CONFIG || {};
        if (state.freq === "One time") {
          if (!cfg.paypalBusinessEmail || cfg.paypalBusinessEmail.indexOf("PASTE_") === 0) {
            showDonateStatus("Online payments aren't fully set up yet — please email info@starsclub.ca and we'll arrange your donation directly.");
            return;
          }
          submitPaypalForm({ cmd: "_donations", business: cfg.paypalBusinessEmail, item_name: "Donation to STARS Club", currency_code: cfg.currency || "CAD", amount: amount.toFixed(2), custom: name + " <" + email + ">", no_shipping: "1" });
        } else {
          var buttonId = state.freq === "Monthly" ? cfg.monthlyHostedButtonId : cfg.yearlyHostedButtonId;
          if (!buttonId || buttonId.indexOf("PASTE_") === 0) {
            showDonateStatus("Recurring giving isn't live on the site yet — choose \"One time\" for now, or email info@starsclub.ca to set up " + state.freq.toLowerCase() + " giving directly.");
            return;
          }
          showDonateStatus("Note: recurring gifts use the amount set up in our PayPal subscription, not the amount selected above.");
          submitPaypalForm({ cmd: "_s-xclick", hosted_button_id: buttonId });
        }
      });
    }
  }

  /* ================================================================
     Accordion
     ================================================================ */
  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      item.closest(".accordion").querySelectorAll(".accordion-item").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".accordion-panel").style.maxHeight = null;
      });
      if (!isOpen) { item.classList.add("is-open"); panel.style.maxHeight = panel.scrollHeight + "px"; }
    });
  });

  /* ================================================================
     Contact form (AJAX submit)
     ================================================================ */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var data = new FormData(form);
      fetch(form.getAttribute("action"), {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree rejected the request");
          status.textContent = "Message sent — thank you. We'll be in touch soon.";
          status.classList.add("is-shown");
          form.reset();
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email info@starsclub.ca directly.";
          status.classList.add("is-shown");
        });
    });
  }

  /* ================================================================
     Events from Google Sheet
     ================================================================ */
  var eventsList = document.querySelector("#events-list");
  var eventsStatus = document.querySelector("#events-status");
  var homeNextEvent = document.querySelector("#home-next-event");
  var sheetUrl = window.STARS_EVENTS_SHEET_URL;

  function parseCSV(text) {
    var rows = [], row = [], field = "", inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i], next = text[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') { field += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { field += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ",") { row.push(field); field = ""; }
        else if (ch === "\n" || ch === "\r") {
          if (ch === "\r" && next === "\n") i++;
          row.push(field); field = "";
          if (row.length > 1 || row[0] !== "") rows.push(row);
          row = [];
        } else { field += ch; }
      }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function eventRowHtml(idx, r) {
    var big = idx.big > -1 ? r[idx.big] : "";
    var small = idx.small > -1 ? r[idx.small] : "";
    var title = idx.title > -1 ? r[idx.title] : "Untitled event";
    var desc = idx.desc > -1 ? r[idx.desc] : "";
    var cat = idx.cat > -1 ? r[idx.cat] : "Event";
    return '<div class="event-date"><span class="day">' + escapeHtml(big) + '</span>' + escapeHtml(small) + '</div>' +
      '<div><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(desc) + '</p></div>' +
      '<span class="event-tag">' + escapeHtml(cat) + '</span>';
  }

  function renderEvents(rows) {
    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    var idx = { big: header.indexOf("datebig"), small: header.indexOf("datesmall"), title: header.indexOf("title"), desc: header.indexOf("description"), cat: header.indexOf("category") };
    var dataRows = rows.slice(1).filter(function (r) { return r.some(function (cell) { return cell && cell.trim() !== ""; }); });
    if (!dataRows.length) {
      if (eventsStatus) { eventsStatus.textContent = "No events listed in the sheet right now — check back soon."; eventsStatus.classList.add("is-shown"); }
      return;
    }
    if (homeNextEvent) homeNextEvent.innerHTML = '<div class="event-row">' + eventRowHtml(idx, dataRows[0]) + '</div>';
    if (eventsList) {
      eventsList.innerHTML = "";
      dataRows.forEach(function (r, i) {
        var el = document.createElement("div");
        el.className = "event-row reveal";
        el.style.setProperty("--i", i);
        el.innerHTML = eventRowHtml(idx, r);
        eventsList.appendChild(el);
      });
      if ("IntersectionObserver" in window && !reducedMotion) {
        var freshIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { entry.target.classList.add("is-visible"); freshIo.unobserve(entry.target); }
          });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
        eventsList.querySelectorAll(".reveal").forEach(function (el) { freshIo.observe(el); });
      } else {
        eventsList.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
      }
    }
  }

  if ((eventsList || homeNextEvent) && sheetUrl && sheetUrl.indexOf("https://docs.google.com/spreadsheets/d/e/2PACX-1vRD6IHZuVW32BEPvmVeiiAiiT_C4dd2FZeHmA84CY2SnIEic9h3m-kxCXSmpAA7PbKLIpkY-MUGQtNp/pub?gid=478040429&single=true&output=csv") === -1) {
    fetch(sheetUrl)
      .then(function (res) { if (!res.ok) throw new Error("Sheet request failed"); return res.text(); })
      .then(function (text) { var rows = parseCSV(text); if (!rows.length) throw new Error("Empty sheet"); renderEvents(rows); })
      .catch(function () {
        if (eventsStatus) { eventsStatus.textContent = "Couldn't load the live schedule right now — showing default info. Check the full PDF schedule above."; eventsStatus.classList.add("is-shown"); }
      });
  }

  /* ================================================================
     Active nav link
     ================================================================ */
  var current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) a.classList.add("active");
  });

})();
