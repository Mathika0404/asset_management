
document.addEventListener("DOMContentLoaded", () => {

    const errorPage = document.querySelector(".error-page");
    const goBackBtn = document.getElementById("goBackBtn");

    /* Page entrance animation */

    if (errorPage) {

        const revealItems = [
            ...errorPage.querySelectorAll(".error-reveal")
        ];

        errorPage.classList.add("error-ready");

        revealItems.forEach((item, index) => {
            item.style.setProperty(
                "--error-delay",
                `${index * 0.12}s`
            );
        });
    }

    /* Go Back */

    if (goBackBtn) {

        goBackBtn.addEventListener("click", () => {

            // Return to the previous page in browser history
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // No previous history: safely fall back to home
                window.location.href = "index.html";
            }

        });

    }

});
