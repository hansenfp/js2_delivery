const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

const profiles = JSON.parse(localStorage.getItem('profiles')) || [];

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const profile = profiles.find(profile => profile.email === email && profile.password === password);

  if (profile) {
    message.textContent = 'Login successful!';
    message.style.color = 'green';

    displayProfileData(profile);
  } else {

    message.textContent = 'Invalid email or password.';
    message.style.color = 'red';
  }

  loginForm.reset();
});

function displayProfileData(profile) {
  window.location.href = 'feed.html';
}
