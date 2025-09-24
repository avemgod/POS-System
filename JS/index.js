var database = firebase.database();
var txtuser = "";
var txtpass = "";

function SignIn() {
  // email pakai domain project kamu
  txtuser = document.getElementById('username').value + "@project-kulia.firebaseapp.com";
  txtpass = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(txtuser, txtpass).catch(function(error) {
    window.alert(error.message);
    location.href = "index.html";
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      // ganti UID sesuai yang ada di Authentication → Users
      if (firebaseUser.uid == "UID_ADMIN_BARU") {
        location.href = "admin.html";
      }
      else if (firebaseUser.uid == "UID_CASHIER_BARU") {
        location.href = "cashier.html";
      }
    }
  });
}

function SignOut() {
  firebase.auth().signOut().then(function() {
    location.href = "index.html";
  }).catch(function(error) {
    console.log(error.message);
  });
}
