var loginError = document.getElementById("Error");
var adminEmail, adminPassword;
function adminInput() {
  adminEmail = document.getElementById("email").value;
  adminPassword = document.getElementById("password").value;
};

async function adminLogin() {

  var response = await axios.post('/admin/login', {
      email: adminEmail,
      password: adminPassword
    })
    .then(function(response) {
      console.log(response);
      if (!response.data.success) {
        loginError.innerHTML = "Username & Password is Invalid";

      }
      // document.cookie = "username=" + 'linh'; // test cookie
      window.location.assign('/admin/dashboard');

    })
    .catch(function(error) {

      loginError.innerHTML = "Username & Password is Invalid";
      console.log(error);
    });
};
// async function adminLogout() {
//   await axios.get('/admin/logout')
//     .then((response) => {
//       console.log('user-logout' + response.data.success);
//       window.location.replace('/admin/login');
//     })
// };
// document.getElementById("butLogOut").addEventListener("click", function(){
//   return adminLogout();
// }
// )
