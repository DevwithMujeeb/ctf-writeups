// ============================================
// WEB APP LAB — JAVASCRIPT
//
// SECURITY NOTE: Everything in this file is
// visible to anyone who views page source or
// opens DevTools. Never put secrets, API keys,
// credentials, or sensitive logic in client-side
// JavaScript. The browser is not a trusted
// environment — assume everything here is public.
// ============================================

// --- DOM ready ---
document.addEventListener("DOMContentLoaded", () => {
  initCTAButton();
  initFetchButton();
  initContactForm();
  highlightActiveNav();
});

// --- CTA Button ---
// Simple interaction — clicking the button scrolls
// to the login section. Illustrates how JavaScript
// controls page behaviour without a page reload.
function initCTAButton() {
  const btn = document.getElementById("cta-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.getElementById("login").scrollIntoView({
      behavior: "smooth",
    });
  });
}

// --- Fetch Button ---
// Demonstrates how the frontend communicates with
// a backend API using the Fetch API.
//
// SECURITY NOTE: This request goes to /api/users —
// if that endpoint doesn't enforce authentication,
// any user (or attacker) can call it directly from
// the browser console or curl without even loading
// the page. The frontend is never the security boundary.
function initFetchButton() {
  const btn = document.getElementById("fetch-btn");
  const resultBox = document.getElementById("api-result");
  if (!btn || !resultBox) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Fetching...";
    resultBox.textContent = "";

    try {
      const response = await fetch("/api/users");

      // SECURITY NOTE: Always check the response
      // status before processing the body.
      // A 200 response doesn't mean the request
      // was authorized — some misconfigured APIs
      // return 200 with an error message in the body.
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      resultBox.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      // SECURITY NOTE: Never expose raw error messages
      // to the user in production — they can reveal
      // internal structure, file paths, or stack traces.
      // Log internally, show a generic message externally.
      resultBox.textContent = `Error: ${err.message}`;
      resultBox.style.color = "#f85149";
    } finally {
      btn.disabled = false;
      btn.textContent = "Fetch Users";
    }
  });
}

// --- Contact Form ---
// Demonstrates client-side validation before
// submission — but NEVER as a replacement for
// server-side validation.
//
// SECURITY NOTE: Client-side validation is UX,
// not security. An attacker can bypass it entirely
// by sending a raw HTTP request directly to the
// server using curl or Burp Suite — skipping the
// browser and your JavaScript completely.
// Every input must be validated and sanitized
// on the server too, independently of this.
function initContactForm() {
  const form = document.getElementById("contact-form");
  const responseBox = document.getElementById("form-response");
  if (!form || !responseBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Client-side validation — catches obvious errors
    // early for UX, but server must validate independently
    if (!name || !email || !message) {
      showResponse(responseBox, "All fields are required.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showResponse(responseBox, "Please enter a valid email address.", "error");
      return;
    }

    if (message.length > 1000) {
      showResponse(
        responseBox,
        "Message cannot exceed 1000 characters.",
        "error",
      );
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        showResponse(
          responseBox,
          data.message || "Message sent successfully.",
          "success",
        );
        form.reset();
      } else {
        showResponse(
          responseBox,
          data.message || "Something went wrong.",
          "error",
        );
      }
    } catch (err) {
      showResponse(
        responseBox,
        "Failed to send message. Please try again.",
        "error",
      );
    }
  });
}

// --- Nav highlight ---
// Highlights the active nav link based on scroll position.
// Purely cosmetic — illustrates DOM manipulation.
function highlightActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("header nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.color = "";
      if (link.getAttribute("href") === `#${current}`) {
        link.style.color = "#58a6ff";
      }
    });
  });
}

// --- Helpers ---
function isValidEmail(email) {
  // Basic email format check — server must validate too
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function showResponse(box, message, type) {
  box.textContent = message;
  box.className = type; // applies .success or .error CSS class
  box.style.display = "block";

  // Auto-hide after 5 seconds
  setTimeout(() => {
    box.style.display = "none";
    box.className = "";
  }, 5000);
}

// ============================================
// WHAT THIS FILE DEMONSTRATES:
//
// 1. DOM manipulation — selecting and updating
//    elements without page reloads
// 2. Event listeners — responding to user actions
// 3. Fetch API — async communication with backend
// 4. Client-side validation — UX layer only
// 5. Error handling — never expose raw errors
//
// WHAT IT DOES NOT DO (intentionally):
// - Store any secrets or credentials
// - Trust user input without server validation
// - Use innerHTML with user data (XSS vector)
// - Make security decisions client-side
// ============================================
