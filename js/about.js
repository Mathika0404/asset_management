
/* =========================================
   STACKLY ABOUT PAGE
   PRELOADER + NAVBAR + MOBILE TOGGLE + FOOTER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const preloader = document.getElementById("preloader");
    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");
    const currentYear = document.getElementById("currentYear");


    /* =========================================
       PRELOADER
    ========================================= */

    const PRELOADER_MIN_TIME = 1900;

    function finishPreloader() {

        if (!preloader) {
            document.body.classList.add("page-loaded");
            return;
        }

        preloader.classList.add("hide");

        setTimeout(() => {
            preloader.remove();
            document.body.classList.add("page-loaded");
        }, 800);
    }

    if (document.readyState === "complete") {
        setTimeout(finishPreloader, PRELOADER_MIN_TIME);
    } else {
        window.addEventListener("load", () => {
            setTimeout(finishPreloader, PRELOADER_MIN_TIME);
        }, { once: true });
    }


    /* =========================================
       NAVBAR SCROLL EFFECT
    ========================================= */

    function updateHeader() {
        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =========================================
       MOBILE NAVIGATION TOGGLE
    ========================================= */

    function closeMenu() {
        if (!menuToggle || !navigation) return;

        menuToggle.classList.remove("active");
        navigation.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
        );
    }

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

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

        // Close menu when a navigation link is clicked
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!navigation.classList.contains("open")) return;

            if (
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close menu using Escape key
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Close mobile menu when switching to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) {
                closeMenu();
            }
        });
    }


    /* =========================================
       FOOTER COPYRIGHT YEAR
    ========================================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});


document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(
        ".hero-label.reveal, .hero-title .title-line, " +
        ".hero-description.reveal, .hero-actions.reveal"
    );

    // If animation is disabled in system settings
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
});


/* ==========================================
   STORY SECTION SCROLL ANIMATIONS
========================================== */

const storyRevealElements = document.querySelectorAll(
    ".story-section .story-reveal"
);

const storySection = document.querySelector(".story-section");

if (storySection && storyRevealElements.length) {
    const reduceStoryMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reduceStoryMotion ||
        !("IntersectionObserver" in window)
    ) {
        storyRevealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        const storyObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -25px 0px"
            }
        );

        storyRevealElements.forEach((element) => {
            storyObserver.observe(element);
        });
    }
}


/* =====================================
   STACKLY STORY SECTION V2 ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".story-v2");

    if (!section) return;

    const elements = section.querySelectorAll(".story-v2-reveal");

    // JavaScript is ready; now enable the reveal animation.
    section.classList.add("js-ready");

    // Fallback: show everything if IntersectionObserver is unavailable.
    if (!("IntersectionObserver" in window)) {
        elements.forEach(function (element) {
            element.classList.add("story-v2-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("story-v2-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    elements.forEach(function (element, index) {
        element.style.transitionDelay = (index % 4) * 100 + "ms";
        observer.observe(element);
    });
});
