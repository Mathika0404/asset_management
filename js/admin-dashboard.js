
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarBrand = document.getElementById("sidebarBrand");
    const logoutButton = document.getElementById("logoutButton");

    const menuLinks = document.querySelectorAll(".menu-link");
    const pageSections = document.querySelectorAll(".page-section");

    const welcomeName = document.getElementById("welcomeName");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserEmail = document.getElementById("sidebarUserEmail");
    const navbarUserEmail = document.getElementById("navbarUserEmail");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const settingsUserName = document.getElementById("settingsUserName");
    const settingsUserEmail = document.getElementById("settingsUserEmail");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimer;
    let countersStarted = false;

    /* =====================================
       LOGGED-IN USER DETAILS
    ===================================== */

const loginEmail =
    localStorage.getItem("loggedInEmail") ||
    sessionStorage.getItem("stacklyLoginEmail") ||
    localStorage.getItem("stacklyLoginEmail") ||
    localStorage.getItem("stacklyRememberedEmail") ||
    "admin@example.com";

const emailName = loginEmail.split("@")[0];

function formatName(value) {
    return value
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

const displayName = formatName(emailName) || "Admin";

if (welcomeName) welcomeName.textContent = displayName;
if (sidebarUserName) sidebarUserName.textContent = displayName;
if (sidebarUserEmail) sidebarUserEmail.textContent = loginEmail;
if (navbarUserEmail) navbarUserEmail.textContent = loginEmail;
if (sidebarAvatar) {
    sidebarAvatar.textContent = displayName.charAt(0).toUpperCase();
}

if (settingsUserName) settingsUserName.textContent = displayName;
if (settingsUserEmail) settingsUserEmail.textContent = loginEmail;


    /* =====================================
       CURRENT DATE
    ===================================== */

    const currentDate = document.getElementById("currentDate");

    currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date());

    document.getElementById("footerYear").textContent =
        new Date().getFullYear();

    /* =====================================
       TOAST NOTIFICATION
    ===================================== */

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    /* =====================================
       SIDEBAR MENU NAVIGATION
    ===================================== */

    function showSection(sectionName) {
        const targetSection = document.getElementById(
            `${sectionName}Section`
        );

        if (!targetSection) return;

        // Hide every other section.
        pageSections.forEach(section => {
            section.classList.remove("active");
        });

        // Show only the selected section.
        targetSection.classList.add("active");

        // Update selected sidebar menu.
        menuLinks.forEach(link => {
            const isActive = link.dataset.section === sectionName;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        // Update URL hash without reloading the page.
        history.replaceState(null, "", `#${sectionName}`);

        // Close mobile sidebar after selection.
        sidebar.classList.remove("open");

        // Start the dashboard counter animation when needed.
        if (sectionName === "dashboard") {
            startCounters();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            showSection(link.dataset.section);
        });
    });

    /* =====================================
       LOGO CLICK -> DASHBOARD HOME
    ===================================== */

    sidebarBrand.addEventListener("click", event => {
        event.preventDefault();
        showSection("dashboard");
    });

    /* =====================================
       QUICK ACTION NAVIGATION
    ===================================== */

    document.querySelectorAll("[data-go]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.go);
        });
    });

    document.getElementById("exploreAssetsButton")
        .addEventListener("click", () => {
            showSection("portfolio");
        });


/* =====================================
   MOBILE SIDEBAR
===================================== */

if (sidebar && menuToggle) {
    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        sidebar.classList.toggle("open");

        const isOpen = sidebar.classList.contains("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        const isMobile = window.innerWidth <= 1000;

        if (
            isMobile &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) {
            sidebar.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}


    /* =====================================
       ANIMATED NUMBER COUNTERS
    ===================================== */

    function animateCounter(element) {
        if (element.dataset.animated === "true") return;

        element.dataset.animated = "true";

        const target = Number(element.dataset.target);
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            // Smooth ease-out animation.
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easedProgress);

            element.textContent = currentValue.toLocaleString("en-IN");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString("en-IN");
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (countersStarted) return;

        countersStarted = true;

        document.querySelectorAll(".counter").forEach((counter, index) => {
            setTimeout(() => {
                animateCounter(counter);
            }, index * 120);
        });
    }

    /* =====================================
       NOTIFICATION BUTTON
    ===================================== */

    document.getElementById("notificationButton")
        .addEventListener("click", () => {
            showToast("You are all caught up with this demo workspace.");
        });

    /* =====================================
       LOGOUT
    ===================================== */

    logoutButton.addEventListener("click", () => {
        const confirmed = window.confirm("Are you sure you want to logout?");

        if (!confirmed) return;

        // Clear the current login session details.
        sessionStorage.removeItem("stacklyLoginEmail");
        sessionStorage.removeItem("stacklyLoginRole");

        localStorage.removeItem("stacklyLoginEmail");
        localStorage.removeItem("stacklyLoginRole");

        // Preserve the remembered email preference if your login
        // page uses it to prefill the email input.
        window.location.href = "login.html";
    });

    /* =====================================
       INITIAL PAGE
    ===================================== */

    const initialSection = window.location.hash.replace("#", "");

    const validSections = [
        "dashboard",
        "portfolio",
        "investments",
        "transactions",
        "reports",
        "settings"
    ];

    showSection(
        validSections.includes(initialSection)
            ? initialSection
            : "dashboard"
    );
});

const loginEmail = localStorage.getItem("loggedInEmail") || "";

if (sidebarUserEmail) {
    sidebarUserEmail.textContent = loginEmail;
}

if (navbarUserEmail) {
    navbarUserEmail.textContent = loginEmail;
}