import '@babel/polyfill';
import { login, logout, signup, forgotPassword } from './login';
import { displayMap } from './mapbox';
import { updateData } from './updateData';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const resetPasswordForm = document.querySelector('.form-password-reset');
const signupForm = document.querySelector('.form-signup');
const logoutBtn2 = document.querySelector('.nav__el--logout2');

if (signupForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('hello there');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(name + email + password + passwordConfirm);
    signup(name, email, password, passwordConfirm);
  });
}

if (mapBox) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (logoutBtn2) {
  logoutBtn2.addEventListener('click', logout);
}

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // const photo = document.getElementById('photo').files[0];

    await updateData(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (resetPasswordForm) {
  document.querySelector('.form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    document.getElementById('hid').hidden = false;
    console.log(email, '1');
    await forgotPassword(email);
    console.log(email, '2');
  });
}
