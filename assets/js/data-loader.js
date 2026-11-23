/*
  Loads editable content from JSON files, then starts the page-specific renderer.
  GitHub Pages supports fetch() for these files. For local testing, use VS Code
  Live Server rather than opening the HTML file directly.
*/
(async function loadSiteData() {
  const page = location.pathname.split("/").pop() || "index.html";
  const pageScripts = {
    "index.html": "home.js",
    "journal.html": "journal.js",
    "article.html": "article.js",
    "learning-log.html": "learning-log.js",
    "gallery.html": "gallery.js"
  };

  try {
    const [posts, learning, albums] = await Promise.all([
      fetch("data/posts.json").then(checkJSON),
      fetch("data/learning.json").then(checkJSON),
      fetch("data/albums.json").then(checkJSON)
    ]);

    window.JOURNAL_POSTS = posts;
    window.LEARNING_TOPICS = learning;
    window.GALLERY_ALBUMS = albums;

    const scriptName = pageScripts[page];
    if (scriptName) {
      const script = document.createElement("script");
      script.src = `assets/js/${scriptName}?v=6`;
      script.onerror = () => showLoadError("The page content script could not be loaded.");
      document.body.appendChild(script);
    }
  } catch (error) {
    console.error("Unable to load website JSON data:", error);
    showLoadError("Website content could not be loaded. Please check that the JSON files are present and that you are viewing the site through a web server.");
  }

  async function checkJSON(response) {
    if (!response.ok) throw new Error(`Could not load ${response.url} (${response.status})`);
    return response.json();
  }

  function showLoadError(message) {
    const targets = ["latest-posts", "journal-list", "article-content", "ll-grid", "gallery-albums"];
    targets.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<div class="empty-state"><h2>Content unavailable</h2><p>${message}</p></div>`;
    });
  }
})();
