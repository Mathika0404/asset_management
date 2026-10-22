
/* =========================================
   STACKLY ASSET MANAGEMENT
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");
    const slides = [...document.querySelectorAll(".hero-slide")];
    const slideCurrent = document.getElementById("slideCurrent");
    const slideNext = document.getElementById("slideNext");
    const particleContainer = document.getElementById("heroParticles");
    const navLinks = [...document.querySelectorAll(".nav-link")];

    let pageLoaded = false;
    let currentSlide = 0;
    let slideTimer = null;
    let isFinishing = false;

    const PRELOADER_MIN_TIME = 1900;
    const SLIDE_INTERVAL = 6500;

    /* =========================================
       PRELOADER
       All entrance animations wait until this ends
    ========================================= */

    function finishPreloader() {
        if (isFinishing || pageLoaded) return;

        isFinishing = true;

        if (preloader) {
            preloader.classList.add("hide");

            // Wait until the preloader fade-out finishes.
            setTimeout(() => {
                preloader.remove();
                activatePage();
            }, 800);
        } else {
            activatePage();
        }
    }

    function activatePage() {
        if (pageLoaded) return;

        pageLoaded = true;

        // This class unlocks CSS entrance animations.
        document.body.classList.add("page-loaded");

        // Start all page effects only now.
        startSlideshow();
        createParticles();
        initializeRevealAnimations();
        updateActiveNavigation();
        updateHeader();
        initializeCardInteractions();

        document.dispatchEvent(
            new CustomEvent("stackly:page-loaded")
        );
    }

    function beginPreloaderTimer() {
        setTimeout(finishPreloader, PRELOADER_MIN_TIME);
    }

    if (document.readyState === "complete") {
        beginPreloaderTimer();
    } else {
        window.addEventListener("load", beginPreloaderTimer, {
            once: true
        });
    }

    /* =========================================
       HERO BACKGROUND SLIDESHOW
       Starts only after activatePage()
    ========================================= */

    function showSlide(index) {
        if (!pageLoaded || slides.length === 0) return;

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlide);
        });

        if (slideCurrent) {
            slideCurrent.textContent = String(currentSlide + 1).padStart(2, "0");
        }
    }

    function showNextSlide() {
        showSlide(currentSlide + 1);
    }

    function stopSlideshow() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    function startSlideshow() {
        if (!pageLoaded || slides.length <= 1) return;

        stopSlideshow();
        showSlide(currentSlide);

        slideTimer = setInterval(() => {
            if (!document.hidden) {
                showNextSlide();
            }
        }, SLIDE_INTERVAL);
    }

    if (slideNext) {
        slideNext.addEventListener("click", () => {
            if (!pageLoaded) return;

            showNextSlide();

            // Reset the interval after a manual slide change.
            startSlideshow();
        });
    }

    /* =========================================
       PARTICLE ANIMATION
    ========================================= */

    function createParticles() {
        if (!pageLoaded || !particleContainer) return;

        // Prevent duplicate particles.
        if (particleContainer.children.length > 0) return;

        const particleCount = window.innerWidth < 600 ? 14 : 28;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("span");

            particle.className = "hero-particle";

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${35 + Math.random() * 65}%`;

            particle.style.setProperty(
                "--duration",
                `${6 + Math.random() * 7}s`
            );

            particle.style.setProperty(
                "--delay",
                `${Math.random() * 7}s`
            );

            fragment.appendChild(particle);
        }

        particleContainer.appendChild(fragment);
    }

    /* =========================================
       SCROLL REVEAL
       Reveal sections only after preloader ends
    ========================================= */

    let revealObserver = null;

    function initializeRevealAnimations() {
        if (!pageLoaded) return;

        const revealElements = [
            ...document.querySelectorAll(".reveal")
        ];

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("visible");
            });
            return;
        }

        if (revealObserver) {
            revealObserver.disconnect();
        }

        revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        // Stagger cards for a more polished effect.
        const staggerGroups = [
            ".trust-item",
            ".service-card",
            ".insight-card"
        ];

        staggerGroups.forEach((selector) => {
            const items = document.querySelectorAll(selector);

            items.forEach((item, index) => {
                item.style.setProperty(
                    "--reveal-delay",
                    `${(index % 4) * 100}ms`
                );
            });
        });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    /* =========================================
       HEADER SCROLL EFFECT
    ========================================= */

    function updateHeader() {
        if (!pageLoaded || !siteHeader) return;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );
    }

    window.addEventListener("scroll", () => {
        if (!pageLoaded) return;

        updateHeader();
        updateActiveNavigation();
    }, { passive: true });

    /* =========================================
       ACTIVE NAVIGATION
    ========================================= */

    function updateActiveNavigation() {
        if (!pageLoaded) return;

        const sections = [
            ...document.querySelectorAll("main section[id]")
        ];

        let activeSection = "home";
        const scrollPosition = window.scrollY + 180;

        sections.forEach((section) => {
            if (scrollPosition >= section.offsetTop) {
                activeSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href");

            link.classList.toggle(
                "active",
                target === `#${activeSection}`
            );
        });
    }

    /* =========================================
       MOBILE NAVIGATION
    ========================================= */

    function closeMenu() {
        if (!menuToggle || !navigation) return;

        menuToggle.classList.remove("active");
        navigation.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        // Close the mobile menu after selecting a section.
        navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close when clicking outside the navigation.
        document.addEventListener("click", (event) => {
            if (!navigation.classList.contains("open")) return;

            const clickedInsideMenu = navigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // Close with the Escape key.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Reset mobile menu when returning to desktop layout.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) {
                closeMenu();
            }
        });
    }

    /* =========================================
       CARD POINTER INTERACTION
       Subtle tilt on desktop; CSS handles hover
    ========================================= */

    function initializeCardInteractions() {
        if (!pageLoaded) return;

        const cards = document.querySelectorAll(
            ".service-card, .hero-glass-card"
        );

        const supportsFinePointer = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

        if (!supportsFinePointer) return;

        cards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 3;
                const rotateX = ((centerY - y) / centerY) * 3;

                card.style.setProperty("--pointer-x", `${x}px`);
                card.style.setProperty("--pointer-y", `${y}px`);

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) ` +
                    `rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.removeProperty("transform");
            });
        });
    }

    /* =========================================
       FOOTER YEAR
    ========================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
