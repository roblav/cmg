function accountMenuSmall(x) {
  // Check page for employment accordian
  // Add text to component

  let accountMenu = document.getElementById('secondary-nav');
  let accountMenuMain = accountMenu.getElementsByTagName('ul')[0];
  let accountMenuHome = document.querySelector('.account-menu__link--home');

  let accountMenuLink = document.createElement('a');
  accountMenuLink.setAttribute('id', 'accountMenuLink');
  accountMenuLink.setAttribute('href', '#');
  accountMenuLink.setAttribute('aria-hidden', 'false');
  accountMenuLink.setAttribute('aria-expanded', 'false');
  accountMenuLink.classList.add('account-menu__link', 'account-menu__link--menu', 'js-visible');
  accountMenuLink.innerHTML += 'Menu'
  accountMenuLink.addEventListener('click', event => {
    accountMenuMain.classList.toggle('js-hidden');
    accountMenuLink.toggleAttribute('aria-expanded');
  });
  // <a href="#" class="account-menu__link account-menu__link--menu js-visible" aria-hidden="false" aria-expanded="false">Menu</a>


  if (x.matches) { // If media query matches
    accountMenu.classList.add('is-smaller');
    accountMenuMain.classList.add('js-hidden');
    // Add menu link to account header
    accountMenuHome.after(accountMenuLink);
    var el = document.getElementById('accountMenuLink');
  } else {
    accountMenu.classList.remove('is-smaller');
    accountMenuMain.classList.remove('js-hidden');
    var el = document.getElementById('accountMenuLink');
    if (el) {
      el.remove();
    }
  }

}

function toggleMenu() {

}

// function initApp() {
//   accountMenuSmall();
// }

var x = window.matchMedia("(max-width: 840px)")
accountMenuSmall(x) // Call listener function at run time
x.addListener(accountMenuSmall) // Attach listener function on state


// Alternative to load event
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    // initApp();
  }
};