const root = document.getElementById("article-content");
const id   = new URLSearchParams(location.search).get("id");
const post = (window.JOURNAL_POSTS || []).find(p => p.id === id);

// Convert the Markdown used in posts.json into HTML, while also allowing existing native HTML.
// Supports headings, bold, italic, inline code, links, and simple bullet/numbered lists.
function markdownToHTML(raw) {
  let text = String(raw ?? "");
  // If the entry already contains native HTML, preserve it for the sanitizer below.
  if (/<\/?[a-z][^>]*>/i.test(text)) return text;

  // Escape raw text first, but keep Markdown syntax available for conversion.
  text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Inline formatting.
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>");

  if (/^\s*[-*+]\s+/.test(text)) {
    return `<ul><li>${text.replace(/^\s*[-*+]\s+/, "")}</li></ul>`;
  }
  if (/^\s*\d+\.\s+/.test(text)) {
    return `<ol><li>${text.replace(/^\s*\d+\.\s+/, "")}</li></ol>`;
  }
  const heading = text.match(/^(#{1,4})\s+(.+)$/);
  if (heading) return `<h${heading[1].length}>${heading[2]}</h${heading[1].length}>`;
  return `<p>${text}</p>`;
}


// Render only a small allowlist of HTML tags from JSON content, and strip unsafe attributes/URLs.
function renderJournalHTML(raw) {
  const converted = markdownToHTML(raw);
  const allowed = new Set(["B","STRONG","I","EM","U","H2","H3","H4","UL","OL","LI","P","BLOCKQUOTE","BR","A","CODE"]);
  const template = document.createElement("template");
  template.innerHTML = converted;
  function sanitize(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType !== Node.ELEMENT_NODE) { if (child.nodeType !== Node.TEXT_NODE) child.remove(); return; }
      const tag = child.tagName;
      if (!allowed.has(tag)) { sanitize(child); child.replaceWith(...child.childNodes); return; }
      const originalHref = tag === "A" ? child.getAttribute("href") : null;
      [...child.attributes].forEach(a => child.removeAttribute(a.name));
      if (tag === "A" && originalHref) {
        try { const u = new URL(originalHref, location.href); if (["http:","https:"].includes(u.protocol)) { child.setAttribute("href", u.href); child.setAttribute("target", "_blank"); child.setAttribute("rel", "noopener noreferrer"); } else child.replaceWith(...child.childNodes); }
        catch { child.replaceWith(...child.childNodes); }
      }
      sanitize(child);
    });
  }
  sanitize(template.content);
  const safe = template.innerHTML;
  return /<(h[2-4]|ul|ol|blockquote|p)\b/i.test(safe) ? safe : `<p>${safe}</p>`;
}

if (!post) {
  root.innerHTML = `<div class="empty-state"><p class="eyebrow">JOURNAL ENTRY</p><h1>Entry not found</h1><p>This story may have moved or the link may be incorrect.</p><a class="button" href="journal.html">Back to journal</a></div>`;
} else {
  document.title = `${post.title} — My CCSE Journey`;

  /* ── Photos gallery (randomised order, varied layout) ── */
  function buildGallery(photos) {
    if (!photos || photos.length === 0) return "";
    /* shuffle a copy so the order feels organic on each load */
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    const count = shuffled.length;

    /* pick a layout class based on count */
    let layoutClass = "photo-gallery-single";
    if (count === 2) layoutClass = "photo-gallery-pair";
    else if (count >= 3) layoutClass = "photo-gallery-trio";

    const items = shuffled.map((ph, i) =>
      `<figure class="gallery-photo ${i === 0 && count >= 3 ? "gallery-photo--featured" : ""}">
        <img src="${ph.src}" alt="${escapeHTML(ph.alt)}"
             onerror="this.src='https://placehold.co/800x500/e8e8e4/606b78?text=Photo+unavailable'">
        ${ph.caption ? `<figcaption>${escapeHTML(ph.caption)}</figcaption>` : ""}
      </figure>`
    ).join("");

    return `
      <section class="article-photos">
        <h2 class="article-photos__heading">Photos</h2>
        <div class="article-photo-grid ${layoutClass}">${items}</div>
      </section>`;
  }

  /* ── Attachments section (before footer) ── */
  function buildAttachments(attachments) {
    if (!attachments || attachments.length === 0) return "";
    const items = attachments.map(a => `
      <a class="attachment-item" href="${escapeHTML(a.href)}" target="_blank" rel="noopener">
        <span class="attachment-icon" aria-hidden="true">${a.icon || "📎"}</span>
        <span class="attachment-info">
          <strong>${escapeHTML(a.name)}</strong>
          ${a.description ? `<span>${escapeHTML(a.description)}</span>` : ""}
        </span>
        <span class="attachment-dl" aria-hidden="true">↓</span>
      </a>`).join("");
    return `
      <section class="article-attachments">
        <h2 class="article-attachments__heading">Assignment Files</h2>
        <p class="article-attachments__sub">Documents and files related to this journal entry.</p>
        <div class="attachment-list">${items}</div>
      </section>`;
  }

  root.innerHTML = `
    <a class="back-link" href="journal.html">← Back to all entries</a>
    <article class="full-article">
      <header class="article-header">
        <p class="eyebrow">${escapeHTML(post.category)} · ${escapeHTML(post.week)}</p>
        <h1>${escapeHTML(post.title)}</h1>
        <p class="article-meta">${formatDate(post.date)} <span>·</span> ${escapeHTML(post.readTime)}</p>
        <p class="article-excerpt">${escapeHTML(post.excerpt)}</p>
      </header>
      <img class="article-cover" src="${post.cover}" alt="${escapeHTML(post.coverAlt)}"
           onerror="this.src='https://placehold.co/1200x700/e8e8e4/606b78?text=Add+your+photo'">
      <div class="prose">
        ${post.content.map(paragraph => renderJournalHTML(paragraph)).join("\n")}
        <!-- <p class="signature">One semester at a time.</p> -->
      </div>
      ${buildGallery(post.photos)}
      <div class="article-end"><a class="button" href="journal.html">More journal entries</a></div>
    </article>
    ${buildAttachments(post.attachments)}`;
}
