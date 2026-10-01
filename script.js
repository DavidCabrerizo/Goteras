const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];
const revealEls = document.querySelectorAll(".reveal");
const form = document.querySelector(".form");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");

function setBurgerExpanded(isExpanded) {
  if (!burger) return;
  burger.setAttribute("aria-expanded", String(isExpanded));
}

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isActive = mobileNav.classList.toggle("active");
    setBurgerExpanded(isActive);
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileNav) mobileNav.classList.remove("active");
    setBurgerExpanded(false);
  });
});

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("active"));
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileNav) { mobileNav.classList.remove("active"); setBurgerExpanded(false); }
});

function markInvalid(el) {
  el.classList.add("is-invalid");
  el.addEventListener("input", () => el.classList.remove("is-invalid"), { once: true });
}

function validateForm() {
  if (!form) return true;
  let ok = true;
  const required = form.querySelectorAll("[required]");
  required.forEach((field) => {
    const value = (field.value || "").trim();
    if (!value) {
      ok = false;
      markInvalid(field);
    }
    if (field.type === "email" && value) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailOk) {
        ok = false;
        markInvalid(field);
      }
    }
  });
  return ok;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    if (formError) formError.textContent = "";
    if (!validateForm()) {
      e.preventDefault();
      if (formError) formError.textContent = "Revisa los campos marcados e inténtalo de nuevo.";
      return;
    }
    e.preventDefault();
    if (submitBtn) { submitBtn.textContent = "Enviando..."; submitBtn.disabled = true; }
    try {
      const res = await fetch("https://formsubmit.co/ajax/goterasmadrid81@gmail.com", {
        method: "POST", headers: { Accept: "application/json" }, body: new FormData(form)
      });
      if (!res.ok) throw new Error("http " + res.status);
      window.location.href = "gracias.html";
    } catch (err) {
      if (formError) formError.textContent = "No se pudo enviar. Llámanos al 613 88 50 41 o escríbenos por WhatsApp.";
      if (submitBtn) { submitBtn.textContent = "Enviar solicitud"; submitBtn.disabled = false; }
    }
  });
}
