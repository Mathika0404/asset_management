
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

        document.dispatchEvent(
            new Event("stackly:page-loaded")
        );
        return;
    }

    preloader.classList.add("hide");

    setTimeout(() => {
        preloader.remove();
        document.body.classList.add("page-loaded");

        document.dispatchEvent(
            new Event("stackly:page-loaded")
        );
    }, 800);
}


    if (document.readyState === "complete") {
        setTimeout(finishPreloader, PRELOADER_MIN_TIME);
    } else {
        window.addEventListener("load", () => {
            setTimeout(finishPreloader, PRELOADER_MIN_TIME);
        }, { once: true });
    }


/* =====================================
   SERVICES HERO ANIMATION
   START AFTER PRELOADER
===================================== */

const hero = document.querySelector(".services-hero");

if (hero) {
    const revealElements = hero.querySelectorAll(".service-reveal");

    function startServicesAnimation() {
        revealElements.forEach((element) => {
            element.classList.remove("service-animate");

            void element.offsetWidth;

            element.classList.add("service-animate");
        });
    }

    // Wait for preloader completion
    if (document.body.classList.contains("page-loaded")) {
        startServicesAnimation();
    } else {
        const pageObserver = new MutationObserver(() => {
            if (document.body.classList.contains("page-loaded")) {
                pageObserver.disconnect();
                startServicesAnimation();
            }
        });

        pageObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    // Explore Services smooth scrolling
    hero.querySelectorAll('a[href="#services-list"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.getElementById("services-list");

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
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


document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector(".services-hero");

    function startServiceAnimations() {
        if (!hero) return;

        hero.querySelectorAll(".service-reveal").forEach((element) => {
            // Restart CSS animation after preloader
            element.style.animation = "none";

            void element.offsetWidth;

            element.style.animation = "";
        });
    }

    document.addEventListener(
        "stackly:page-loaded",
        startServiceAnimations
    );

    // If the preloader has already finished
    if (document.body.classList.contains("page-loaded")) {
        startServiceAnimations();
    }

    document.querySelectorAll(
        '.services-hero a[href="#services-list"]'
    ).forEach((link) => {
        link.addEventListener("click", function (event) {
            const target = document.getElementById("services-list");

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
});

/* =========================================
   CORE SERVICES SCROLL ANIMATION
========================================= */

const coreServicesSection = document.querySelector(
    ".core-services-section"
);

if (coreServicesSection) {
    const coreServiceItems = coreServicesSection.querySelectorAll(
        ".service-reveal"
    );

    function revealCoreServices() {
        coreServiceItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.12}s`;
            item.classList.add("service-animate");
        });
    }

    if ("IntersectionObserver" in window) {
        const coreServicesObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        revealCoreServices();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        coreServicesObserver.observe(coreServicesSection);
    } else {
        revealCoreServices();
    }
}


/* =========================================
   APPROACH SECTION ANIMATIONS
========================================= */

const approachSection = document.querySelector(".approach-section");

if (approachSection) {
    const approachItems = approachSection.querySelectorAll(
        ".approach-reveal"
    );

    const approachTimeline = approachSection.querySelector(
        ".approach-timeline"
    );

    function animateApproachSection() {
        approachItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.16}s`;
            item.classList.add("approach-animate");
        });

        if (approachTimeline) {
            approachTimeline.classList.add("approach-active");
        }
    }

    if ("IntersectionObserver" in window) {
        const approachObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateApproachSection();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        approachObserver.observe(approachSection);
    } else {
        animateApproachSection();
    }
}


/* =========================================
   WHY STACKLY SCROLL ANIMATION
========================================= */

const whyStacklySection = document.querySelector(
    ".why-stackly-section"
);

if (whyStacklySection) {
    const whyRevealItems = whyStacklySection.querySelectorAll(
        ".why-reveal"
    );

    function animateWhyStackly() {
        whyRevealItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.14}s`;
            item.classList.add("why-animate");
        });
    }

    if ("IntersectionObserver" in window) {
        const whyStacklyObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateWhyStackly();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        whyStacklyObserver.observe(whyStacklySection);
    } else {
        animateWhyStackly();
    }
}
