
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



/* =========================================
   STACKLY BLOGS HERO ANIMATION
   START AFTER PRELOADER
========================================= */

const blogsHero = document.querySelector(".blogs-hero");

if (blogsHero) {

    let blogsAnimationStarted = false;

    function startBlogsAnimation() {
        if (blogsAnimationStarted) return;

        blogsAnimationStarted = true;

        blogsHero.classList.add("blogs-loaded");
    }

    // Preloader already finished
    if (document.body.classList.contains("page-loaded")) {
        startBlogsAnimation();
    } else {

        // Wait for existing STACKLY preloader event
        document.addEventListener(
            "stackly:page-loaded",
            startBlogsAnimation,
            { once: true }
        );

        // Fallback: detect the existing page-loaded class
        const blogsPageObserver = new MutationObserver(() => {
            if (document.body.classList.contains("page-loaded")) {
                blogsPageObserver.disconnect();

                startBlogsAnimation();
            }
        });

        blogsPageObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
}


/* =========================================
   LATEST BLOGS SECTION ANIMATION
   WAIT FOR PRELOADER
========================================= */

const latestBlogsSection = document.querySelector(
    ".latest-blogs-section"
);

if (latestBlogsSection) {

    let latestBlogsStarted = false;
    let latestBlogsObserver = null;

    const latestBlogItems = latestBlogsSection.querySelectorAll(
        ".blog-list-reveal"
    );

    function revealLatestBlogs() {
        if (latestBlogsStarted) return;

        latestBlogsStarted = true;

        latestBlogItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.12}s`;
            item.classList.add("blog-list-animate");
        });

        if (latestBlogsObserver) {
            latestBlogsObserver.disconnect();
        }
    }

    function observeLatestBlogs() {
        if (latestBlogsStarted) return;

        if (!("IntersectionObserver" in window)) {
            revealLatestBlogs();
            return;
        }

        latestBlogsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        revealLatestBlogs();
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        latestBlogsObserver.observe(latestBlogsSection);
    }

    function enableLatestBlogsAnimation() {
        if (document.body.classList.contains("page-loaded")) {
            observeLatestBlogs();
        }
    }

    if (document.body.classList.contains("page-loaded")) {
        observeLatestBlogs();
    } else {
        document.addEventListener(
            "stackly:page-loaded",
            enableLatestBlogsAnimation,
            { once: true }
        );
    }
}


/* =========================================
   EDITORIAL SECTION ANIMATION
   AFTER PRELOADER + ON SCROLL
========================================= */

const editorialSection = document.querySelector(".editorial-section");

if (editorialSection) {

    let editorialStarted = false;
    let editorialObserver = null;

    const editorialItems = editorialSection.querySelectorAll(
        ".editorial-reveal"
    );

    function startEditorialAnimation() {
        if (editorialStarted) return;

        editorialStarted = true;

        editorialItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.16}s`;
            item.classList.add("editorial-animate");
        });

        if (editorialObserver) {
            editorialObserver.disconnect();
        }
    }

    function observeEditorialSection() {
        if (editorialStarted) return;

        if (!("IntersectionObserver" in window)) {
            startEditorialAnimation();
            return;
        }

        editorialObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startEditorialAnimation();
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        editorialObserver.observe(editorialSection);
    }

    function enableEditorialAnimation() {
        if (document.body.classList.contains("page-loaded")) {
            observeEditorialSection();
        }
    }

    if (document.body.classList.contains("page-loaded")) {
        observeEditorialSection();
    } else {
        document.addEventListener(
            "stackly:page-loaded",
            enableEditorialAnimation,
            { once: true }
        );
    }
}


/* =========================================
   MARKET PERSPECTIVES ANIMATION
   AFTER PRELOADER
========================================= */

const marketPerspectives = document.querySelector(
    ".market-perspectives"
);

if (marketPerspectives) {

    let perspectiveStarted = false;
    let perspectiveObserver = null;

    const perspectiveItems =
        marketPerspectives.querySelectorAll(".perspective-reveal");

    function startPerspectiveAnimation() {
        if (perspectiveStarted) return;

        perspectiveStarted = true;

        perspectiveItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.13}s`;
            item.classList.add("perspective-animate");
        });

        if (perspectiveObserver) {
            perspectiveObserver.disconnect();
        }
    }

    function observePerspectives() {
        if (perspectiveStarted) return;

        if (!("IntersectionObserver" in window)) {
            startPerspectiveAnimation();
            return;
        }

        perspectiveObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startPerspectiveAnimation();
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        perspectiveObserver.observe(marketPerspectives);
    }

    function enablePerspectiveAnimation() {
        if (document.body.classList.contains("page-loaded")) {
            observePerspectives();
        }
    }

    if (document.body.classList.contains("page-loaded")) {
        observePerspectives();
    } else {
        document.addEventListener(
            "stackly:page-loaded",
            enablePerspectiveAnimation,
            { once: true }
        );
    }
}
