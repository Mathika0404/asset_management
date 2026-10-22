
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

    const contactHero = document.getElementById("contactHero");

    if (!contactHero) return;

    const revealItems = [
        ...contactHero.querySelectorAll(".contact-reveal")
    ];

    let animationStarted = false;

    function startContactAnimations() {

        if (animationStarted) return;

        animationStarted = true;

        // Start all landing-page animations
        contactHero.classList.add("contact-ready");

        // Sequential entrance animation
        revealItems.forEach((item, index) => {
            item.style.setProperty(
                "--contact-delay",
                `${0.2 + index * 0.18}s`
            );
        });
    }

    // Start only after the existing preloader completes
    function checkPreloader() {
        if (document.body.classList.contains("page-loaded")) {
            startContactAnimations();
        }
    }

    // Listen for the event from the existing preloader
    document.addEventListener(
        "stackly:page-loaded",
        checkPreloader
    );

    // Handles cases where the preloader finished before this script ran
    checkPreloader();

});


/* =====================================
   CONTACT INFORMATION SCROLL ANIMATION
   Add inside your existing DOMContentLoaded
===================================== */

const infoSection = document.getElementById("contactInformation");

if (infoSection) {

    const infoItems = [
        ...infoSection.querySelectorAll(".contact-info-reveal")
    ];

    let infoAnimationStarted = false;
    let infoObserver = null;

    function startContactInfoAnimation() {

        if (infoAnimationStarted) return;

        if (!document.body.classList.contains("page-loaded")) {
            return;
        }

        infoAnimationStarted = true;

        infoSection.classList.add("contact-info-visible");

        infoItems.forEach((item, index) => {
            item.style.setProperty(
                "--contact-info-delay",
                `${index * 0.15}s`
            );
        });

        if (infoObserver) {
            infoObserver.disconnect();
        }
    }

    function observeContactInfo() {

        if (infoAnimationStarted) return;

        if (!("IntersectionObserver" in window)) {
            startContactInfoAnimation();
            return;
        }

        infoObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startContactInfoAnimation();
                    }
                });

            },
            {
                threshold: 0.15
            }
        );

        infoObserver.observe(infoSection);
    }

    function onContactPreloaderComplete() {
        if (document.body.classList.contains("page-loaded")) {
            observeContactInfo();
        }
    }

    // Preloader already completed
    if (document.body.classList.contains("page-loaded")) {
        observeContactInfo();
    } else {
        // Wait for your existing preloader event
        document.addEventListener(
            "stackly:page-loaded",
            onContactPreloaderComplete,
            { once: true }
        );
    }
}


/* =====================================
   CONTACT FORM + 404 REDIRECT
   Add inside your existing DOMContentLoaded
===================================== */

const contactForm = document.getElementById("stacklyContactForm");

if (contactForm) {

    /* Scroll reveal after preloader */

    const formSection = document.getElementById("contactFormSection");

    if (formSection) {

        const formRevealItems = [
            ...formSection.querySelectorAll(".contact-form-reveal")
        ];

        let formAnimationStarted = false;

        function startFormAnimation() {

            if (formAnimationStarted) return;

            if (!document.body.classList.contains("page-loaded")) {
                return;
            }

            formAnimationStarted = true;
            formSection.classList.add("contact-form-visible");

            formRevealItems.forEach((item, index) => {
                item.style.setProperty(
                    "--contact-form-delay",
                    `${index * 0.16}s`
                );
            });
        }

        function observeFormSection() {

            if (formAnimationStarted) return;

            if (!("IntersectionObserver" in window)) {
                startFormAnimation();
                return;
            }

            const formObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            startFormAnimation();
                            formObserver.disconnect();
                        }
                    });
                },
                { threshold: 0.12 }
            );

            formObserver.observe(formSection);
        }

        function onFormPreloaderComplete() {
            if (document.body.classList.contains("page-loaded")) {
                observeFormSection();
            }
        }

        if (document.body.classList.contains("page-loaded")) {
            observeFormSection();
        } else {
            document.addEventListener(
                "stackly:page-loaded",
                onFormPreloaderComplete,
                { once: true }
            );
        }
    }

    /* Validate form, then open 404 */

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        window.location.href = "404.html";

    });

}
