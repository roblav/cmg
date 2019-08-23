function accountMenuSmall(x) {
  // Check page for employment accordian
  // Add text to component

  let accountMenu = document.getElementById('secondary-nav');
  let accountMenuMain = accountMenu.getElementsByTagName('ul')[0];
  let accountMenuHome = document.querySelector('.account-menu__link--home');

  // Create menu button
  let accountMenuButton = document.createElement('button');
  accountMenuButton.setAttribute('id', 'accountMenuButton');
  accountMenuButton.setAttribute('aria-expanded', 'false');
  accountMenuButton.setAttribute('aria-controls', 'accountMenuMain');
  accountMenuButton.classList.add('account-menu__link', 'account-menu__link--menu', 'js-visible');
  accountMenuButton.innerHTML += 'Menu'

  // Add button event listener
  accountMenuButton.addEventListener('click', event => {
    if (accountMenuMain.classList.contains('js-hidden')) {
      accountMenuButton.setAttribute('aria-expanded', 'false');
      accountMenuMain.classList.remove('js-hidden');
    } else {
      accountMenuMain.classList.add('js-hidden'); 
      accountMenuButton.setAttribute('aria-expanded', 'true');
    }
  });


  if (x.matches) { 
    // If media query matches
    // Add menu button to account header and hide menu
    accountMenuHome.after(accountMenuButton);
    accountMenuMain.classList.add('js-hidden');
  } else {
    accountMenuMain.classList.remove('js-hidden');
    var el = document.getElementById('accountMenuButton');
    if (el) {
      el.remove();
    }
  }
}

var x = window.matchMedia("(max-width: 840px)")
accountMenuSmall(x) // Call listener function at run time
x.addListener(accountMenuSmall) // Attach listener function on state
