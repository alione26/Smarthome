// let layListData = <%-JSON.stringify(userListData) %>;
let layListData = JSON.parse(document.body.dataset.layuserdata);
let mangListData = [];
let i = 0;
for(let key in layListData)
{
    mangListData[i] = layListData[key];
    i++;
}
console.log(mangListData);
//Hàm loadBody sẽ khởi chạy đầu tiên khi mở web
function loadBody()
{
    createTb();
    doiSize();
    
}
// Hàm đọc data và tạo bảng
function createTb() 
{
let elemenTableBody = document.getElementsByTagName("tbody");
    mangListData.forEach(function(item,index) {
    let createRow = document.createElement('tr');
    createRow.innerHTML = "<td>"+ item.user_id + "</td>"+
    "<td>"+ item.name + "</td>"+ 
    "<td>"+ item.email + "</td>" +
    "<td>"+ item.smarthome_id + "</td>" +
    "<td>"+ item.smarthome_name + "</td>" +
    "<td>"+ item.active + "</td>" +
    "<td>" + 
    '<button id="btnEdit" onclick="chag(' + index +')">Edit</butotn>' + 
        // onclick="chag(' + index +')"
    "</td>";;
    elemenTableBody[0].append(createRow);
});
}

// Tìm kiếm 
// ******************
function search() 
{
    let nameSearch = document.getElementById("id-search");
    let elemenTableBody = document.getElementsByTagName("tbody");
    
    console.log(nameSearch.children[0].value);
    // console.log(tab_1[0].children[0]);
    for (let key of elemenTableBody[0].children) {
        let noiString = "";
        console.log(key.children.length -1);
        console.log(key);
        for(let i =0; i < (key.children.length -1) ; i++)
        {
            noiString += key.children[i].innerHTML + " ";
            // console.log(key.children[i].innerHTML);
        }
        console.log(noiString);
        // nameSearch.children[0].value == key.children[0].innerHTML
        let kytuRegExp = new RegExp(nameSearch.children[0].value , 'i');
        // new RegExp cho phép ta dùng Regular Expression như 1 biến
        if(kytuRegExp.test(noiString))
        {
            key.style.display = "";
        }
        else if(nameSearch.children[0].value == '')
        {
            key.style.display = "";
        }
        else
        {
            key.style.display = "none";
        }
    }
}
//// Hàm hiện lên cửa sổ

function chag(index)
{

    // let par = document.getElementById("info-user");
    // console.log(index);
    let ktraActive = document.getElementById("actived");
    let elementInforUser = document.getElementById("info-user");
    console.log("đánh dâu");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        console.log(tagP[(tagP.length - 1)].outerHTML);
        tagP[(tagP.length - 1)].remove();
    }
    
    // console.log(tagP[i].innerHTML);

    ktraActive.checked = mangListData[index].active
    for(key in mangListData[index])
    {
        let showName = ["name","email","user_id","smarthome_name","smarthome_id",];
        let showName_1 = ["Name","Email","User Id","Smart Home Name","Smart Home Id",];
        // console.log(key.length);   
        for(let i = 0; i < showName.length; i ++)
        {
            if(showName[i] == key)
            {
                let createEleP = document.createElement("p");
                createEleP.innerHTML = "<strong>" + showName_1[i] + "</strong>" + " : " + mangListData[index][key];
                elementInforUser.prepend(createEleP);
            }
            
        }
    }
    // par.children[0].innerHTML = "Tên User : " + "<strong>" 
    //                             + mangDoiTuog[index].name + "</strong>";
    // /***************************************** */
    // par.children[1].innerHTML = "Số điện thoại : " + mangDoiTuog[index].sdt;
    // /****************************************** */
    // if((par.children[0].lastChild.innerHTML) ==  mangDoiTuog[index].name)
    // {
    //     let x = document.getElementById("luaChon");
    //     let y = document.getElementById("actived");
    //     y.checked = mangDoiTuog[index].active;
    //     for (let key of x.children) {
    //        console.log(key.innerHTML);
    //        if(key.innerHTML == mangDoiTuog[index].home)
    //        key.selected = "true";
    //     }
    // }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block").style.display = "block";
}
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
function accept_and_cls()
{
    let x = document.getElementById("luaChon");
    let par = document.getElementById("info-user");
    let y = document.getElementById("check-active");
    /*********************************** */
    document.getElementById("fix-block").style.display = "none";
    document.body.style.overflow = "";
    console.log("OK đã xác nhận");
    //************************* */
}
// Hàm thay đổi kích thước cửa sổ hiện lên theo kích thước window
function doiSize() {
    if(window.innerWidth <= 768)
    {
       document.getElementById("fix-block").style.width = (window.innerWidth) +'px';
       document.getElementById("wrapper").style.marginTop = "110px";
    //    document.getElementById("wrapper").style.marginLeft = "";
       document.getElementById("wrapper").style.height =  (window.innerHeight - 110) +"px";
    //    document.getElementById("wrapper").style.width =  (window.innerWidth) +"px";
    }
    else
    {
    document.getElementById("fix-block").style.width = (window.innerWidth - 225) +'px';
    document.getElementById("wrapper").style.marginTop = "60px";
    // document.getElementById("wrapper").style.marginLeft = "225px";
    document.getElementById("wrapper").style.height =  (window.innerHeight - 60) + "px";
    // document.getElementById("wrapper").style.width =  (window.innerWidth - 225) + "px";
    }
       

       //*****
       console.log(window.innerHeight);
}
function esc_close(eve, accept_and_cls)
{
    if(eve.keyCode == 27 || eve.which == 27)
    {
        document.getElementById("fix-block").style.display = "none";
        document.body.style.overflow = "";
    }
    else if(eve.keyCode == 13 || eve.which == 13)
    {
        accept_and_cls();
    }
    
}