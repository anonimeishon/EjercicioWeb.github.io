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

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('submitting');
  const coords = await getCurrentPosition();

  const signupEmail = document.querySelector('#signup-email').value;

  const signupPassword = document.querySelector('#signup-password').value;

  fstore
    .collection('Fechas')
    .doc(signupEmail)
    .set({
      User: signupEmail,
      Location: coords,
      Date: new Date(Date.now()),
      Times: 1
    })
    .then(function () {
      console.log('Document successfully written!');
    })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });

  auth
    .createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then((userCredential) => {
      //clear
      signupForm.reset();
      $('#SUModal').modal('hide');

      console.log('sign up');
      console.log(coords);
    });
});

//Sign In part
const signInForm = document.querySelector('#login-form');

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const coords = await getCurrentPosition();
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  fstore
    .collection('Fechas')
    .where('User', '==', email)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const data = doc.data();
        fstore
          .collection('Fechas')
          .doc(data.User)
          .set({
            User: data.User,
            Location: coords,
            Date: new Date(Date.now()),
            Times: data.Times + 1
          });
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    //clear
    signupForm.reset();
    $('#SIModal').modal('hide');

    console.log('sign in');
  });
});

//logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('sign out');
  });
});

//edit password
const editForm = document.querySelector('#edit-form');

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const EdPassword = document.querySelector('#edit-password').value;
  const user = auth.currentUser;
  user.updatePassword(EdPassword);

  editForm.reset();
  $('#EPModal').modal('hide');
});

//fechas, datos a mostrar

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

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve([position.coords.latitude, position.coords.longitude]);
    });
  });
};

// const loadLocation = async () => {
//   try {
//     const position = await getCurrentPosition();
//     return position;
//   } catch (e) {
//     console.log(e);
//   }
// };

// console.log(loadLocation());

// const getLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       console.log(position.coords);
//     });
//   } else {
//     return 'Location not Found!';
//   }
// };
// console.log(getLocation());
