const portfolioContact = {
    name: "Anand R",
    email: "anandr3880@gmail.com",
    phone: "+91 8105559024",
    location: "Chennai, India"
};

// Set this to the deployed Google Apps Script web app URL. See SHEETS_SETUP.md.
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzGG4_IjL8aKg63sV0145O3PbL-FhD8KBGFsFrHAsQe08vEgCbn69wzYdkqZ06wd76Bzw/exec";

document.querySelectorAll("[data-contact]").forEach((element) => {
    const value = portfolioContact[element.dataset.contact];
    if (value) element.textContent = value;
});

document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const status = form.querySelector(".form-note");
        const submitButton = form.querySelector('button[type="submit"]');

        if (!GOOGLE_APPS_SCRIPT_URL) {
            status.textContent = "The form is not connected yet. Follow the setup steps in SHEETS_SETUP.md.";
            return;
        }

        const formData = new FormData(form);
        const name = formData.get("name").trim();
        const senderEmail = formData.get("email").trim();
        const phone = formData.get("phone").trim() || "Not provided";
        const message = formData.get("message").trim();

        if (!name || !senderEmail || !message) {
            status.textContent = "Please fill in your name, a valid email address, and a message.";
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Submitting your message…";

        try {
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ name, email: senderEmail, phone, message })
            });

            status.textContent = "Request sent. Check the Submissions sheet before closing; this page can't verify Google's response. If no row appears, check the public web app deployment settings in SHEETS_SETUP.md.";
        } catch (error) {
            status.textContent = "We couldn't submit your message. Please try again later.";
        } finally {
            submitButton.disabled = false;
        }
    });
});
