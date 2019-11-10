var name1, pass1;
var signUpName, signUpPass, signUpRePass, signUpMail;

var loi = document.getElementById("loi");

function inp() {
  name1 = document.getElementById("userName").value;
  pass1 = document.getElementById("passWord").value;
};

function inp1() {
  //var signUpName, signUpPass, signUpRePass, signUpMail;
  // khong dat ten bien giong nhu ten ID
  // vi du : nameSignUp = document.getElementById("nameSignUp").value;
  signUpName = document.getElementById("nameSignUp").value;
  signUpPass = document.getElementById("passSignUp").value;
  signUpRePass = document.getElementById("rePassSignUp").value;
  signUpMail = document.getElementById("mailSignUp").value;

};
async function Register() {

  if (signUpPass != signUpRePass) {
    document.getElementById("errorSignUp").innerHTML = "Re-enter Password";
    document.getElementById("passSignUp").value = "";
    document.getElementById("rePassSignUp").value = "";
    return console.log("Re-enter passWord");
  }
  console.log("OK");
  var response = await axios.post('/identify/signUp', {
      name: signUpName,
      password: signUpPass,
      email: signUpMail
    })
    .then(function(response) {
      console.log(response);
      if (!response.data.success) {
        errorSignUp.innerHTML = "Fail to Sign Up !!!";

      }
      alert("Your request is sent. We will sent you an confirm email soon!");
      window.location.assign("/loginPage");
    })
    .catch(function(error) {

      errorSignUp.innerHTML = error.response.data.message;
      console.log(error.response.data.message);
    });
};

async function go() {

  var response = await axios.post('/identify/login', {
      user: name1,
      password: pass1
    })
    .then(function(response) {
      console.log(response);
      if (!response.data.success) {
        loi.innerHTML = "Username & Password is Invalid";

      }
      // document.cookie = "username=" + 'linh'; // test cookie
      window.location.assign("/smart-homes");

    })
    .catch(function(error) {

      loi.innerHTML = "Username & Password is Invalid";
      console.log(error);
    });
}
axios.get('/showAuthButton')
  .then((response) => {
    //console.log(response.data);
    if (!response.data.signed) {
      document.getElementById("butLogIn").style.display = "block";
      document.getElementById("butLogOut").style.display = "none";
    } else {
      document.getElementById("butLogIn").style.display = "none";
      document.getElementById("butLogOut").style.display = "block";
    }
  })
document.getElementById("butLogIn").addEventListener("click", changeLog);

function changeLog() {
  window.location.assign("/loginPage");
}
document.getElementById("butLogOut").addEventListener("click", logout);
async function logout() {
  await axios.get('/userLogout')
    .then((response) => {
      console.log('user-logout' + response.data.success);
      window.location.replace("/");
    })
}
