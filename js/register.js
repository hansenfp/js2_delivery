const registrationForm = document.querySelector('#registrationForm');
const message = document.querySelector('#message');

let profiles = JSON.parse(localStorage.getItem('profiles')) || [];

registrationForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const avatarFile = document.querySelector('#avatar').files[0];
  const bannerFile = document.querySelector('#banner').files[0];

  const emailRegex = /@noroff\.no$|@stud.noroff\.no$/;
  const textRegex = /^[a-zA-Z0-9_-]{2,16}$/;
  
  if (textRegex.test(username) && emailRegex.test(email) && textRegex.test(email.split('@')[0])) {
    if (isUsernameTaken(username)) {
      showMessage('Username is already taken.', 'red');
    } else if (isEmailRegistered(email)) {
      showMessage('Email is already registered.', 'red');
    } else {
      registerProfile(name, username, email, password, avatarFile, bannerFile);
      showMessage('Registration successful!', 'green');
      localStorage.setItem('currentUsername', username);
      localStorage.setItem('currentEmail', email); 
      window.location.href = 'feed.html';
    }
  } else {
    showMessage('Invalid input. Please check username and email.', 'red');
  }

  registrationForm.reset();
});

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

function isEmailRegistered(email) {
  return profiles.some(profile => profile.email === email);
}

function isUsernameTaken(username) {
  return profiles.some(profile => profile.username === username);
}

function registerProfile(name, username, email, password, avatarFile, bannerFile) {
  const avatarReader = new FileReader();
  const bannerReader = new FileReader();
  
  avatarReader.onload = function() {
    const avatarDataUrl = avatarReader.result;
    
    bannerReader.onload = function() {
      const bannerDataUrl = bannerReader.result;
      
      const profile = {
        name: name,
        username: username,
        email: email,
        password: password,
        avatar: avatarDataUrl,
        banner: bannerDataUrl
      };
      
      profiles.push(profile);
      localStorage.setItem('profiles', JSON.stringify(profiles));
      localStorage.setItem('currentEmail', email);

    };
    
    bannerReader.readAsDataURL(bannerFile);
  };
  
  avatarReader.readAsDataURL(avatarFile);
}
