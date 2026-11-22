const posts = window.JOURNAL_POSTS || [];
const latest = document.getElementById("latest-posts");
const categories = document.getElementById("category-links");

if (latest) {
  latest.innerHTML = [...posts].sort((a,b) => b.date.localeCompare(a.date)).slice(0,4).map(post => `
    <article class="post-card">
      <a href="article.html?id=${encodeURIComponent(post.id)}" class="post-image-link">
        <img src="${post.cover}" alt="${escapeHTML(post.coverAlt)}" onerror="this.src='https://placehold.co/900x600/e8e8e4/606b78?text=Add+your+photo'">
      </a>
      <div class="post-card-body">
        <p class="eyebrow">${escapeHTML(post.category)} · ${formatDate(post.date)}</p>
        <h3><a href="article.html?id=${encodeURIComponent(post.id)}">${escapeHTML(post.title)}</a></h3>
        <p>${escapeHTML(post.excerpt)}</p>
        <a class="text-link" href="article.html?id=${encodeURIComponent(post.id)}">Read story ↗</a>
      </div>
    </article>`).join("");
}
if (categories) {
  const unique = [...new Set(posts.map(p => p.category))];
  categories.innerHTML = unique.map(c => `<a href="journal.html?category=${encodeURIComponent(c)}">${escapeHTML(c)} <span>↗</span></a>`).join("");
}
