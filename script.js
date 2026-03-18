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

function revealOnScroll() {
  const trigger = window.innerHeight * 0.88;
  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

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
  form.addEventListener("submit", (e) => {
    if (formError) formError.textContent = "";
    if (!validateForm()) {
      e.preventDefault();
      if (formError) formError.textContent = "Revisa los campos marcados e inténtalo de nuevo.";
      return;
    }
    if (submitBtn) {
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;
    }
  });
}
