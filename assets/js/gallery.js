// Album content is maintained in data/albums.json and loaded by data-loader.js.
const ALBUMS = window.GALLERY_ALBUMS || [];

/* Album cards: a single cover represents each collection. */
const albumsEl = document.getElementById("gallery-albums");
albumsEl.innerHTML = ALBUMS.map((album, ai) => `
  <article class="gallery-album" data-open-album="${ai}" role="button" tabindex="0" aria-label="Open ${escapeHTML(album.title)} album">
    <img class="gallery-album-cover" src="${album.cover}" alt="${escapeHTML(album.title)} album cover" loading="lazy"
      onerror="this.src='https://placehold.co/800x500/e8e8e4/606b78?text=Photo+album'">
    <div class="gallery-album-header">
      <h2 class="gallery-album-title">${escapeHTML(album.title)}</h2>
      <p class="gallery-album-sub">${escapeHTML(album.subtitle)} · ${album.photos.length} photos</p>
      <span class="album-open-hint">Open album ↗</span>
    </div>
  </article>`).join("");

/* Album photo list overlay, created here to keep the HTML page simple. */
const albumView = document.createElement("section");
albumView.className = "album-view";
albumView.id = "album-view";
albumView.hidden = true;
albumView.setAttribute("aria-label", "Album contents");
albumView.setAttribute("tabindex", "-1");
albumView.innerHTML = `<div class="album-view-top"><button class="album-back" id="album-back">← All albums</button><span class="eyebrow">PHOTO COLLECTION</span></div><h2 id="album-view-title"></h2><p class="album-view-sub" id="album-view-sub"></p><div class="album-photo-grid" id="album-photo-grid"></div>`;
document.body.appendChild(albumView);
const albumTitle = document.getElementById("album-view-title");
const albumSub = document.getElementById("album-view-sub");
const albumPhotoGrid = document.getElementById("album-photo-grid");
let activeAlbum = 0;
let savedGalleryScrollY = 0;
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";


function lockPageScroll() {
  savedGalleryScrollY = window.scrollY || window.pageYOffset || 0;
  savedBodyOverflow = document.body.style.overflow;
  savedBodyPaddingRight = document.body.style.paddingRight;
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.body.style.overflow = "hidden";
  if (scrollbarWidth) document.body.style.paddingRight = `${scrollbarWidth}px`;
}
function unlockPageScroll() {
  document.body.style.overflow = savedBodyOverflow;
  document.body.style.paddingRight = savedBodyPaddingRight;
  window.scrollTo(0, savedGalleryScrollY);
}


function openAlbum(index) {
  activeAlbum = index;
  const album = ALBUMS[index];
  albumTitle.textContent = album.title;
  albumSub.textContent = `${album.subtitle} · ${album.photos.length} photos`;
  albumPhotoGrid.innerHTML = album.photos.map((photo, pi) => `
    <button class="album-photo" type="button" data-album-photo="${pi}" aria-label="View ${escapeHTML(photo.caption)}">
      <img src="${photo.src.replace('w=1200','w=600')}" alt="${escapeHTML(photo.caption)}" loading="lazy"
        onerror="this.src='https://placehold.co/600x400/e8e8e4/606b78?text=Photo'">
      <span>${escapeHTML(photo.caption)}</span>
    </button>`).join("");
  lockPageScroll();
  albumView.hidden = false;
  albumView.scrollTop = 0;
  albumView.focus({ preventScroll: true });
}
function closeAlbum() {
  if (albumView.hidden) return;
  // If the photo viewer is still open, close it before returning to All Albums.
  // This prevents the zoomed image overlay from remaining above the album list.
  if (typeof lb !== "undefined" && lb && !lb.hidden) closeLightbox();
  albumView.hidden = true;
  unlockPageScroll();
  const firstAlbum = albumsEl.querySelector("[data-open-album]");
  if (firstAlbum) firstAlbum.focus({ preventScroll: true });
}
albumsEl.addEventListener("click", e => {
  const card = e.target.closest("[data-open-album]");
  if (card) openAlbum(Number(card.dataset.openAlbum));
});
albumsEl.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest("[data-open-album]");
  if (card) { e.preventDefault(); openAlbum(Number(card.dataset.openAlbum)); }
});
document.getElementById("album-back").addEventListener("click", closeAlbum);
albumPhotoGrid.addEventListener("click", e => {
  const photo = e.target.closest("[data-album-photo]");
  if (photo) openLightbox(activeAlbum, Number(photo.dataset.albumPhoto));
});

/* Lightbox viewer */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
const lbCounter = document.getElementById("lb-counter");
const lbStrip = document.getElementById("lb-strip");
const lbClose = document.getElementById("lb-close");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");
let curAlbum = 0, curPhoto = 0;
function openLightbox(albumIdx, photoIdx) {
  curAlbum = albumIdx; curPhoto = photoIdx;
  renderLightbox();
  lb.hidden = false;
  lbClose.focus();
}
function closeLightbox() {
  lb.hidden = true;
  // Clear the displayed image so no stale zoomed photo remains when changing views.
  lbImg.removeAttribute("src");
  lbImg.alt = "";
  lbCaption.textContent = "";
  lbCounter.textContent = "";
  lbStrip.innerHTML = "";
  if (albumView.hidden) document.body.style.overflow = "";
}
function renderLightbox() {
  const album = ALBUMS[curAlbum];
  const photo = album.photos[curPhoto];
  lbImg.src = photo.src;
  lbImg.alt = photo.caption;
  lbCaption.textContent = photo.caption;
  lbCounter.textContent = `${curPhoto + 1} / ${album.photos.length}`;
  lbPrev.disabled = curPhoto === 0;
  lbNext.disabled = curPhoto === album.photos.length - 1;
  lbStrip.innerHTML = album.photos.map((ph, i) => `
    <img class="lb-strip-thumb${i === curPhoto ? " active" : ""}" src="${ph.src.replace('w=1200','w=180')}" alt="${escapeHTML(ph.caption)}" data-idx="${i}" tabindex="0" role="button" aria-label="Photo ${i + 1}">`).join("");
  lbStrip.querySelectorAll(".lb-strip-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => { curPhoto = Number(thumb.dataset.idx); renderLightbox(); });
    thumb.addEventListener("keydown", e => { if (e.key === "Enter") { curPhoto = Number(thumb.dataset.idx); renderLightbox(); } });
  });
  const activeThumb = lbStrip.querySelector(".active");
  if (activeThumb) activeThumb.scrollIntoView({ inline: "center", block: "nearest" });
}
lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => { if (curPhoto > 0) { curPhoto--; renderLightbox(); } });
lbNext.addEventListener("click", () => { if (curPhoto < ALBUMS[curAlbum].photos.length - 1) { curPhoto++; renderLightbox(); } });
document.addEventListener("keydown", e => {
  if (!lb.hidden) {
    if (e.key === "ArrowRight") lbNext.click();
    if (e.key === "ArrowLeft") lbPrev.click();
    if (e.key === "Escape") closeLightbox();
    return;
  }
  if (!albumView.hidden && e.key === "Escape") closeAlbum();
});
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
