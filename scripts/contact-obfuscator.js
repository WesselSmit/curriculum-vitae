/*
 * This script obfuscates contact information until after user interaction
 * to prevent bot scraping as much as possible whilst still keeping
 * the content accessible to users.
 *
 * There are 3 scenarios/states:
 * 1. JS is disabled -- the contact information in the HTML is formatted
 * in a way that is human readable, but might throw off bots.
 * 2. JS is enabled, before interaction -- contact information is replaced
 * with "*" asterisks and a hint to let users know to click for reveal.
 * 3. JS is enabled, after interaction -- contact information is revealed.
*/

const EMAIL_BASE64 = "d3JzbWl0MDBAZ21haWwuY29t";
const PHONE_BASE64 = "KzMxIDY4MTcxNzU4Mg==";

const contactsToObfuscate = document.querySelectorAll("[data-obfuscated]");

contactsToObfuscate.forEach(element => {
  const type = element.getAttribute("data-obfuscated");
  const button = createButton(type);
  element.replaceWith(button);
});

function createButton(type) {
  const button = document.createElement("button");
  let obfuscatedContent;

  if (type === "email") {
    obfuscatedContent = obfuscateEmail(atob(EMAIL_BASE64));
  } else if (type === "phone") {
    obfuscatedContent = obfuscatePhone(atob(PHONE_BASE64));
  }

  button.type = "button";
  button.textContent = `${obfuscatedContent ?? element.textContent} (reveal)`;
  button.classList.add("obfuscated-contact");
  button.setAttribute("data-obfuscated", type);
  button.setAttribute("aria-label", `click to reveal ${type}`);

  button.addEventListener("click", (event) => {
    reveal(event.target);
  });

  return button;
}

function obfuscateEmail(email) {
  return email.replace(/[^@]/g, '*');
}

function obfuscatePhone(phone) {
  return phone.replace(/^(.{4})(.*)$/, (_, first, rest) =>
    first + '*'.repeat(rest.length)
  );
}

function reveal(element) {
  const type = element.getAttribute("data-obfuscated");
  const link = createLink(type);

  element.replaceWith(link);

  // set focus and ensure screen readers announce the newly revealed link
  link.focus();
}

function createLink(type) {
  const link = document.createElement("a");
  let content, href;

  if (type === "email") {
    content = atob(EMAIL_BASE64);
    href = `mailto:${content}`
  } else if (type === "phone") {
    content = atob(PHONE_BASE64);
    href = `tel:${content.replaceAll(" ", "")}`
  }

  link.href = href;
  link.textContent = content;
  link.classList.add("obfuscated-contact", "revealed");
  link.setAttribute("data-obfuscated", type);

  return link;
}
