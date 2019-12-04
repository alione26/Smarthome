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
   // console.log(response.data.signed);
    if (!response.data.signed) {
      $('#butLogIn').html(`<i class="glyphicon glyphicon-log-in"></i> Sign in`);
      document.getElementById("butLogIn").value = "Sign in";
      document.getElementById("change-pass").style.display = "none";
      document.getElementById("edit-file").style.display = "none";
    } else {
      $('#butLogIn').html(`Sign out <i class="glyphicon glyphicon-log-out"></i>`);
      document.getElementById("butLogIn").value = "Sign out";
      document.getElementById("change-pass").style.display = "block";
      document.getElementById("edit-file").style.display = "block";
    }
  })
document.getElementById("butLogIn").addEventListener("click", function(){
  if (document.getElementById("butLogIn").value == "Sign in") {
    return changeLog();
  }
  return logout();
});

function changeLog() {
  window.location.assign("/loginPage");
}
//document.getElementById("butLogIn").addEventListener("click", logout);
async function logout() {
  await axios.get('/userLogout')
    .then((response) => {
      console.log('user-logout' + response.data.success);
      window.location.replace("/");
    })
}
// *********************************************
// Hàm hiện menu Change Pass và SignIn, SignOUT
// *********************************************
let dem = 0;
function showPass() {
  if(dem == 0)
  {
    document.getElementById("show-content").style.display = "block";
    dem++;
  }
  else
  {
    document.getElementById("show-content").style.display = "none";
    dem = 0;
  }
}

function open_pass() 
{
  let passInput = document.getElementById("info-user").getElementsByTagName("input");
  for(let key = 0;key < 3; key++)
  {
    passInput[key].value = '';
  }
  document.getElementById("fix-block").style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("icon-ok").style.display = "none";
  document.getElementById("fix-block-ok").style.display = "block";
  document.getElementById("fix-block-cancel").style.display = "block";
}
function ok_save()
{
  let passInput = document.getElementById("info-user").getElementsByTagName("input");
  let thongBao = document.getElementById("thong-bao");
  let mangPassInput = [];
  for(let key = 0;key < 3; key++)
  {
    mangPassInput[key] = passInput[key].value;
  }
  console.log(mangPassInput);
  if(mangPassInput[0] == '' && mangPassInput[1] == '' && mangPassInput[2] == '' )
  {
    thongBao.innerHTML = "bạn đã nhập thiếu";
  }
  else if(mangPassInput[0] != '' || mangPassInput[1] != '' || mangPassInput[2] != '')
  {
    if(mangPassInput[0] == '' || mangPassInput[1] == '' || mangPassInput[2] == '')
    {
      thongBao.innerHTML = "bạn đã nhập thiếu";
    }
    else if(mangPassInput[0].length < 8)
    {
      thongBao.innerHTML = "mật khẩu mới cần có ít nhất 8 ký tự";
    }
    else if(mangPassInput[0] == mangPassInput[1])
    {
      thongBao.innerHTML = "mật khẩu bạn vừa nhập trùng với mật khẩu cũ";
    }
    else if(mangPassInput[1] != mangPassInput[2])
    {
      thongBao.innerHTML = "confirm của bạn khác với pass mới"
    }
    else if(mangPassInput[0] != '' && 
           mangPassInput[1] == mangPassInput[2] &&
           mangPassInput[1] != '' && 
           mangPassInput[2] != '')
    {
      console.log("đã cập nhật mật khẩu mới");
      document.getElementById("icon-ok").style.display = "block";
      document.getElementById("fix-block-ok").style.display = "none";
      document.getElementById("fix-block-cancel").style.display = "none";
      // document.getElementById("fix-block").style.display = "none";
      // document.body.style.overflow = "auto";
    }
  }
  // *******************************
  // Hiển thị cửa sổ Pass
  // *******************************
  // document.getElementById("fix-block").style.display = "none";
  // document.body.style.overflow = "auto";
  // *******************************
}
function cancel_pass() 
{
  document.getElementById("fix-block").style.display = "none";
  document.body.style.overflow = "auto";
}
// **************************************************
async function open_edit() 
{
  // Lấy Thông tin User đăng nhập
  // *******************************
  let getUserDeviceData = await axios.get('/user_device/get_by_token');
  let userDeviceData = getUserDeviceData.data.data;
  var userDeviceDataContent = userDeviceData[Object.keys(userDeviceData)[0]];
  var userId = userDeviceDataContent.user_id;
  let getUserData = await axios.get('/user/get_by_id/' + userId);
  var userData = getUserData.data.data;
  console.log("userData:", userData);
  // *******************************
  // Trả về thông tin User cho các Input
  // *******************************
  let traVeInput = document.getElementById("info-user-edit").getElementsByTagName("input");
  let mangUserData = ["name","email","phone","date_of_birth"];
  for(let key in userData)
  {
    for(let i = 0; i < mangUserData.length; i++)
    {
      if(key ==  mangUserData[i])
      traVeInput[i].value = userData[key];
    }
  }
  // *******************************
  // Hiển thị cửa sổ Edit
  // *******************************
  document.getElementById("fix-block-edit").style.display = "block";
  document.body.style.overflow = "hidden";
  // *******************************
}
function ok_edit_save()
{
  // Lấy Data User mới
  // *******************************
  let layVeInput = document.getElementById("info-user-edit").getElementsByTagName("input");
  for(let key of layVeInput)
  console.log(key.value);
  // *******************************
  // ĐÓng cửa sổ Edit
  // *******************************
  document.getElementById("fix-block-edit").style.display = "none";
  document.body.style.overflow = "auto";
  // *******************************
}
function cancel_edit() 
{
  document.getElementById("fix-block-edit").style.display = "none";
  document.body.style.overflow = "auto";
}