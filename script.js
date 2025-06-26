// Handle side menu toggle
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenu');
const overlay = document.getElementById('overlay');

function openMenu() {
  sideMenu.classList.add('active');
  overlay.classList.add('active');
}
function closeMenuFn() {
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
}
menuToggle?.addEventListener('click', openMenu);
closeMenu?.addEventListener('click', closeMenuFn);
overlay?.addEventListener('click', closeMenuFn);
// Close menu when clicking a link
sideMenu?.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('click', closeMenuFn);
});
