// Shared navigation and footer for every page.
const header = document.getElementById("site-header");
const footer = document.getElementById("site-footer");
const currentPage = location.pathname.split("/").pop() || "index.html";

if (header) {
  header.innerHTML = `
    <div class="topbar">
      <button class="mobile-nav-toggle" id="mobile-nav-toggle" type="button" aria-expanded="false" aria-controls="main-navigation">
        <span class="mobile-nav-toggle-icon" aria-hidden="true">☰</span>
        <span class="mobile-nav-toggle-label">Menu</span>
      </button>
      <a class="brand" href="index.html">
        <img class="brand-mark" src="assets/images/profile/logo.png" alt="UPM Logo">
        <span class="brand-divider"></span>
        <span class="brand-name">E-Portfolio : Learning Journal</span>
      </a>
      <nav class="main-nav" id="main-navigation" aria-label="Main navigation">
        <a href="index.html" ${currentPage === "index.html" ? 'aria-current="page"' : ""}>Home</a>
        <a href="journal.html" ${["journal.html", "article.html"].includes(currentPage) ? 'aria-current="page"' : ""}>My Journal</a>
        <a href="learning-log.html" ${currentPage === "learning-log.html" ? 'aria-current="page"' : ""}>Learning Log</a>
        <a href="gallery.html" ${currentPage === "gallery.html" ? 'aria-current="page"' : ""}>Gallery</a>
        <a href="about.html" ${currentPage === "about.html" ? 'aria-current="page"' : ""}>About</a>
      </nav>
    </div>`;

  const navToggle = document.getElementById("mobile-nav-toggle");
  const mainNavigation = document.getElementById("main-navigation");
  if (navToggle && mainNavigation) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNavigation.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.querySelector(".mobile-nav-toggle-icon").textContent = isOpen ? "✕" : "☰";
    });
    mainNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNavigation.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.querySelector(".mobile-nav-toggle-icon").textContent = "☰";
      });
    });
  }
}
if (footer) {
footer.innerHTML = `<footer class="site-footer"><a class="footer-brand" href="index.html">E-Portfolio : Learning Journal</a><br><p>A personal record of learning, challenges and growth at UPM.</p><br><small>© 2026–2027 · Made one entry at a time<br>Published by Wan Mohd Danial Hakim Wan Naenmuddin.</small></footer>`;}

function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}
