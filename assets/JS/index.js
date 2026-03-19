/* ============================================================
   KAAFALL ADMIN PANEL — script.js
   ============================================================ */

/**
 * Toggle the sidebar open/closed (mobile)
 */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

/**
 * Close the sidebar and hide overlay
 */
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/**
 * Switch active nav page
 * @param {string} name - Display name of the page
 */
function setPage(name) {
  // Update topbar title and breadcrumb
  document.getElementById('topbar-title').textContent = name;
  document.getElementById('crumb').textContent = name;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Auto-close sidebar on mobile after navigation
  if (window.innerWidth < 900) closeSidebar();
}
