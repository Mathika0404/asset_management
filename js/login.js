
/* =========================================
   STACKLY LOGIN — JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const selectedRole = document.getElementById("selectedRole");
    const formMessage = document.getElementById("formMessage");
    const loginButton = document.getElementById("loginButton");
    const togglePassword = document.getElementById("togglePassword");

    const forgotModal = document.getElementById("forgotModal");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
    const closeForgot = document.getElementById("closeForgot");
    const backToLogin = document.getElementById("backToLogin");
    const forgotForm = document.getElementById("forgotForm");
    const resetEmail = document.getElementById("resetEmail");
    const resetMessage = document.getElementById("resetMessage");
    const toast = document.getElementById("toast");

    let toastTimer;

    /* =====================================
       1. GOLD PARTICLE BACKGROUND
    ===================================== */

    const particleContainer = document.getElementById("goldParticles");

    if (particleContainer) {
        const particleCount = window.innerWidth < 600 ? 18 : 35;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("span");

            particle.className = "particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            particle.style.setProperty(
                "--duration",
                `${6 + Math.random() * 8}s`
            );

            particle.style.setProperty(
                "--delay",
                `${-Math.random() * 12}s`
            );

            const size = 2 + Math.random() * 2;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            fragment.appendChild(particle);
        }

        particleContainer.appendChild(fragment);
    }

    /* =====================================
       2. ADMIN / USER ROLE SELECTION
    ===================================== */

    const roleOptions = document.querySelectorAll(".role-option");

    roleOptions.forEach((option) => {
        option.addEventListener("click", () => {

            roleOptions.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            option.classList.add("active");
            option.setAttribute("aria-pressed", "true");

            selectedRole.value = option.dataset.role;

            clearMessage(formMessage);
        });
    });

    /* =====================================
       3. SHOW / HIDE PASSWORD
    ===================================== */

    if (togglePassword) {
        togglePassword.addEventListener("click", () => {

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            togglePassword.innerHTML = isPassword
                ? '<i class="ri-eye-off-line"></i>'
                : '<i class="ri-eye-line"></i>';

            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );
        });
    }

    /* =====================================
       4. REMEMBER EMAIL
    ===================================== */

    const savedEmail = localStorage.getItem("stacklyRememberedEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }

    /* =====================================
       5. MESSAGE HELPERS
    ===================================== */

    function showMessage(element, message, type = "") {
        if (!element) return;

        element.textContent = message;
        element.className = `form-message ${type}`.trim();
    }

    function clearMessage(element) {
        if (!element) return;

        element.textContent = "";
        element.className = "form-message";
    }

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* =====================================
       6. LOGIN FORM
    ===================================== */

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            clearMessage(formMessage);

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const role = selectedRole.value;

            if (!email || !password) {
                showMessage(
                    formMessage,
                    "Please enter your email address and password.",
                    "error"
                );
                return;
            }

            if (!isValidEmail(email)) {
                showMessage(
                    formMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            if (password.length < 6) {
                showMessage(
                    formMessage,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                passwordInput.focus();
                return;
            }

            /*
             * SAVE THE EMAIL USED FOR LOGIN
             * Dashboard can read this email.
             */

            localStorage.setItem("loggedInEmail", email);

            /*
             * Remember only the email address.
             * Never save the password in localStorage.
             */

            if (rememberMe.checked) {
                localStorage.setItem("stacklyRememberedEmail", email);
            } else {
                localStorage.removeItem("stacklyRememberedEmail");
            }

            /*
             * DEMO-ONLY ROLE ROUTING
             *
             * This front-end demo does not verify credentials.
             * Connect real authentication before production use.
             */

            const dashboardURL = role === "admin"
                ? "admin-dashboard.html"
                : "user-dashboard.html";

            loginButton.disabled = true;

            const buttonText = loginButton.querySelector(".button-text");
            const buttonArrow = loginButton.querySelector(".button-arrow");

            if (buttonText) {
                buttonText.textContent = "Signing you in...";
            }

            if (buttonArrow) {
                buttonArrow.className = "ri-loader-4-line button-arrow";
                buttonArrow.style.animation =
                    "rotateOrbit 1s linear infinite";
            }

            showToast(
                role === "admin"
                    ? "Admin selected. Opening dashboard..."
                    : "User selected. Opening dashboard..."
            );

            setTimeout(() => {
                window.location.href = dashboardURL;
            }, 700);
        });
    }

    /* =====================================
       7. FORGOT PASSWORD MODAL
    ===================================== */

    function openForgotModal() {
        if (!forgotModal) return;

        forgotModal.classList.add("open");
        forgotModal.setAttribute("aria-hidden", "false");

        clearMessage(resetMessage);

        if (resetEmail) {
            resetEmail.value = emailInput.value.trim();
        }

        document.body.style.overflow = "hidden";

        setTimeout(() => {
            if (resetEmail) resetEmail.focus();
        }, 150);
    }

    function closeForgotModal() {
        if (!forgotModal) return;

        forgotModal.classList.remove("open");
        forgotModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (forgotPasswordBtn) forgotPasswordBtn.focus();
    }

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener("click", openForgotModal);
    }

    if (closeForgot) {
        closeForgot.addEventListener("click", closeForgotModal);
    }

    if (backToLogin) {
        backToLogin.addEventListener("click", closeForgotModal);
    }

    if (forgotModal) {
        forgotModal.addEventListener("click", (event) => {
            if (event.target === forgotModal) {
                closeForgotModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            forgotModal &&
            forgotModal.classList.contains("open")
        ) {
            closeForgotModal();
        }
    });

    /* =====================================
       8. PASSWORD RESET REQUEST — DEMO
    ===================================== */

    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {

            event.preventDefault();

            clearMessage(resetMessage);

            const email = resetEmail.value.trim();

            if (!isValidEmail(email)) {
                showMessage(
                    resetMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                resetEmail.focus();
                return;
            }

            /*
             * UI DEMO ONLY:
             * No email is sent from this static website.
             */

            showMessage(
                resetMessage,
                "Demo only: connect a backend service to send a password reset link.",
                "success"
            );
        });
    }

    /* =====================================
       9. INPUT INTERACTIONS
    ===================================== */

    [emailInput, passwordInput].forEach((input) => {
        if (!input) return;

        input.addEventListener("input", () => {
            clearMessage(formMessage);
        });
    });

    if (resetEmail) {
        resetEmail.addEventListener("input", () => {
            clearMessage(resetMessage);
        });
    }

});
