const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const authcheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = 'block'));
    loggedOutLinks.forEach((link) => (link.style.display = 'none'));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = 'none'));
    loggedOutLinks.forEach((link) => (link.style.display = 'block'));
  }
};

//Sign Up part
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('submitting');
  console.log(getLocation());
  //const fecha = new.Date(Date.now());
  const signupEmail = document.querySelector('#signup-email').value;

  const signupPassword = document.querySelector('#signup-password').value;

  auth
    .createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then((userCredential) => {
      //clear
      signupForm.reset();
      $('#SUModal').modal('hide');

      console.log('sign up');
    });
});

//Sign In part
const signInForm = document.querySelector('#login-form');

signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(getLocation());
  //const fecha = new.Date(Date.now());

  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    //clear
    signupForm.reset();
    $('#SIModal').modal('hide');

    console.log('sign in');
  });
});

const logout = document.querySelector('#logout');

logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('sign out');
  });
});

//edit profile
const editForm = document.querySelector('#edit-form');

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const EdPassword = document.querySelector('#edit-password').value;
  const user = auth.currentUser;
  user.updatePassword(EdPassword);

  editForm.reset();
  $('#EPModal').modal('hide');
});

//fechas

const fechas = document.querySelector('.fechas');
const configFechas = (data) => {
  if (data.length) {
    let html = '';
    data.forEach((doc) => {
      const fecha = doc.data();
      const myDate = new Date(fecha.Date.seconds * 1000);
      const li = `
            <li class="list-group-item list-group-item-action">
            <h5>User: ${fecha.User}</h5>
            <p>Last Signed In: ${myDate}</p>
            <p>From: ${fecha.Location}</p>
            <p>Times Logged In: ${fecha.Times}</p>

            </li>
            `;
      html += li;
    });
    fechas.innerHTML = html;
  } else {
    fechas.innerHTML = '<p class= "text-center">Log In to see the info</p>';
  }
};

//events
//is auth
auth.onAuthStateChanged((user) => {
  if (user) {
    fstore
      .collection('Fechas')
      .get()
      .then((snapshot) => {
        configFechas(snapshot.docs);
        authcheck(user);
      });
  } else {
    configFechas([]);
    authcheck(user);
  }
});

const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const response = getLocation().then((position) => {
  return position.coords;
});

console.log(response);

// const getLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       return position.coords.latitude;
//     });
//   } else {
//     return 'Location not Found!';
//   }
// };
// console.log(getLocation());
