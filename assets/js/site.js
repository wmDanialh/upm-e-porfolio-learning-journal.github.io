// Shared navigation and footer for every page.
const header = document.getElementById("site-header");
const footer = document.getElementById("site-footer");
const currentPage = location.pathname.split("/").pop() || "index.html";

if (header) {
  header.innerHTML = `
    <div class="topbar">
      <a class="brand" href="index.html">
        <img class="brand-mark" src="assets/images/profile/logo.png" alt="UPM Logo">
        <span class="brand-divider"></span>
        <span class="brand-name">E-Portfolio : Learning Journal</span>
      </a>
        <nav class="main-nav" aria-label="Main navigation">
        <a href="index.html" ${currentPage === "index.html" ? 'aria-current="page"' : ""}>Home</a>
        <a href="journal.html" ${["journal.html", "article.html"].includes(currentPage) ? 'aria-current="page"' : ""}>My Journal</a>
        <a href="learning-log.html" ${currentPage === "learning-log.html" ? 'aria-current="page"' : ""}>Learning Log</a>
        <a href="gallery.html" ${currentPage === "gallery.html" ? 'aria-current="page"' : ""}>Gallery</a>
        <a href="about.html" ${currentPage === "about.html" ? 'aria-current="page"' : ""}>About</a>
      </nav>
    </div>`;
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
