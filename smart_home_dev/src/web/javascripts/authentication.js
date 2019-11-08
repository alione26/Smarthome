// var User = {name: "thanhdan0811", pass: 123456 };
var name1, pass1;
var loi = document.getElementById("loi");
function inp() {
    name1 = document.getElementById("userName").value;
    pass1 = document.getElementById("passWord").value;
}

// function go() {
//     if(name1 == User.name && pass1 == User.pass)
//     {
//         window.location.assign("/smart-homes");
//     }
//     else
//     {
//         loi.innerHTML = "ban da nhap sai tk hoac mat khau";
//     } 
// }     
async function go() {
    var response = await axios.post('/identify/login', {
        user: name1,
        password: pass1
    })
        .then(function (response) {
            console.log(response);
            if (!response.data.success) {
                loi.innerHTML = "Username & Password is Invalid";

            }
            //  document.cookie = "uuid=" + response.headers.uuid;
            document.cookie = "username=" + 'linh';
            window.location.assign("/smart-homes");




        })
        .catch(function (error) {

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
document.getElementById("butLogOut").addEventListener("click",logout);
async function  logout() {
    await axios.get('/userLogout')
        .then((response) => {
            console.log('user-logout'+ response.data.success);
            window.location.replace("/");
        })
}