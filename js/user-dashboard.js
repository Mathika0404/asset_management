
document.addEventListener("DOMContentLoaded", () => {
    "use strict";


/* =========================================
   USER ACCOUNT DETAILS
========================================= */

// Read the email saved by the login page.
const loginEmail =
    localStorage.getItem("loggedInEmail") ||
    sessionStorage.getItem("stacklyLoginEmail") ||
    localStorage.getItem("stacklyLoginEmail") ||
    "user@example.com";

function nameFromEmail(email) {
    const username = email.split("@")[0] || "User";

    return username
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

// Use the saved profile name if available.
// Otherwise, generate the name from the login email.
function getUserName() {
    return (
        localStorage.getItem("stacklyUserDisplayName") ||
        nameFromEmail(loginEmail)
    );
}

function getInitials(name) {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    return (words[0] || "U").slice(0, 1).toUpperCase();
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function populateUserDetails() {
    const userName = getUserName();
    const initial = getInitials(userName);

    // Sidebar
    setText("sidebarUserName", userName);
    setText("sidebarEmail", loginEmail);
    setText("sidebarAvatar", initial);

    // Navbar
    setText("topUserName", userName);
    setText("topAvatar", initial);

    // Welcome heading
    setText("welcomeHeading", `Welcome back, ${userName}!`);

    // Profile section
    setText("largeAvatar", initial);
    setText("profileDisplayName", userName);
    setText("profileEmail", loginEmail);

    const emailInput = document.getElementById("profileEmailInput");
    const nameInput = document.getElementById("profileNameInput");

    if (emailInput) {
        emailInput.value = loginEmail;
    }

    if (nameInput) {
        nameInput.value = userName;
    }
}

populateUserDetails();

    /* =========================================
       DATE AND FOOTER
    ========================================= */

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    setText("footerYear", new Date().getFullYear());

    /* =========================================
       SECTION NAVIGATION
    ========================================= */

    const menuLinks = [...document.querySelectorAll(".menu-link")];
    const sections = [...document.querySelectorAll(".page-section")];

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
        sidebar?.classList.remove("sidebar-open");
        sidebarOverlay?.classList.remove("show");
        document.body.classList.remove("sidebar-visible");
    }

    function openSidebar() {
        sidebar?.classList.add("sidebar-open");
        sidebarOverlay?.classList.add("show");
        document.body.classList.add("sidebar-visible");
    }

    function showSection(sectionId) {
        const targetSection = document.getElementById(sectionId);

        if (!targetSection || !targetSection.classList.contains("page-section")) {
            return;
        }

        sections.forEach(section => {
            section.classList.toggle("active", section.id === sectionId);
        });

        menuLinks.forEach(link => {
            const isActive = link.dataset.section === sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        closeSidebar();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            showSection(link.dataset.section);
        });
    });

    document.querySelectorAll("[data-open-section]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.openSection);
        });
    });

    /* Logo click: dashboard home, same page */

    const brandHome = document.getElementById("brandHome");

    brandHome?.addEventListener("click", event => {
        event.preventDefault();
        showSection("dashboardSection");
    });

    /* Mobile sidebar */

    menuToggle?.addEventListener("click", () => {
        if (sidebar?.classList.contains("sidebar-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeSidebar();
        }
    });

    /* =========================================
       TOAST NOTIFICATIONS
    ========================================= */

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    /* Notification button */

    const notificationBtn = document.getElementById("notificationBtn");

    notificationBtn?.addEventListener("click", () => {
        showToast("You're all caught up! No new notifications.");
    });

    /* Profile button opens profile section */

    document.getElementById("profileTrigger")?.addEventListener("click", () => {
        showSection("profileSection");
    });

    /* =========================================
       PROFILE DISPLAY NAME
    ========================================= */

    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const profileNameInput = document.getElementById("profileNameInput");

    saveProfileBtn?.addEventListener("click", () => {
        const newName = profileNameInput?.value.trim();

        if (!newName) {
            showToast("Please enter a display name.");
            profileNameInput?.focus();
            return;
        }

        if (newName.length > 60) {
            showToast("Display name must be 60 characters or fewer.");
            return;
        }

        localStorage.setItem("stacklyUserDisplayName", newName);

        populateUserDetails();
        showToast("Display name updated on this browser.");
    });

    /* =========================================
       LOGOUT
    ========================================= */

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", () => {
        const confirmed = window.confirm("Are you sure you want to log out?");

        if (!confirmed) return;

        /*
         * Clear the demo login session only.
         * Do not clear unrelated website storage.
         */

        localStorage.removeItem("stacklyLoginEmail");
        localStorage.removeItem("stacklyLoginRole");
        sessionStorage.removeItem("stacklyLoginEmail");
        sessionStorage.removeItem("stacklyLoginRole");

        window.location.href = "login.html";
    });

    /* =========================================
       ANIMATED COUNTERS
    ========================================= */

    const counters = document.querySelectorAll(".counter");

    function formatCounter(value, format) {
        if (format === "money") {
            return Math.round(value).toLocaleString("en-IN");
        }

        return Math.round(value).toLocaleString("en-IN");
    }

    function animateCounter(element) {
        if (element.dataset.animated === "true") return;

        element.dataset.animated = "true";

        const target = Number(element.dataset.value || 0);
        const format = element.dataset.format || "";
        const duration = 1300;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);

            // Ease-out effect
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = target * easedProgress;

            element.textContent = formatCounter(currentValue, format);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatCounter(target, format);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25
        });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* =========================================
       CHART RANGE SWITCH
    ========================================= */

    const chartRange = document.getElementById("chartRange");
    const chartMonths = document.getElementById("chartMonths");

    const monthSets = {
        "6": ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        "12": ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
               "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
    };

    chartRange?.addEventListener("change", () => {
        if (!chartMonths) return;

        const months = monthSets[chartRange.value] || monthSets["6"];

        chartMonths.replaceChildren();

        months.forEach(month => {
            const label = document.createElement("span");
            label.textContent = month;
            chartMonths.appendChild(label);
        });

        showToast(
            chartRange.value === "12"
                ? "12-month sample view selected."
                : "6-month sample view selected."
        );
    });

    /* =========================================
       INITIAL SECTION
    ========================================= */

    showSection("dashboardSection");
});
