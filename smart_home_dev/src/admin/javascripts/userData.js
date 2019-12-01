
let layListData = {};
let mangListData = [];
function loadData()
{
    layListData = JSON.parse(document.body.dataset.layuserdata);
    let i = 0;
    for(let key in layListData)
    {
        mangListData[i] = layListData[key];
        i++;
    }
    console.log(mangListData);
}
//Hàm loadBody sẽ khởi chạy đầu tiên khi mở web
function loadBody()
{
    loadData();
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
    '<i class="fas fa-cog" id="icon-setting" onclick="chag( '+ index +')"></i>'  +
    '<i class="far fa-edit" id="icon-edit"'  + '</i>' +
    '<i class="far fa-trash-alt" id="icon-trash">' + '</i>' +
    "</td>";
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
    for (let key of elemenTableBody[0].children) {
        let noiString = "";
        console.log(key.children.length -1);
        console.log(key);
        for(let i =0; i < (key.children.length -1) ; i++)
        {
            noiString += key.children[i].innerHTML + " ";
        }
        console.log(noiString);
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

async function chag(index)
{
    let smartHomeList = await axios.get('/smarthome/get_list');
    let smartHomeListData = smartHomeList.data.data;
    let mangsmartHomeListData = [];
    let i = 0;
    for(key in smartHomeListData)
    {
        mangsmartHomeListData[i] = smartHomeListData[key];
        i++;
    }
    //********************************************************* */
    let elementSelect = document.getElementById("luaChon");
    let tagOption = elementSelect.getElementsByTagName("option");
    for((tagOption.length - 1) ; (tagOption.length -1) >= 0; )
    {
    tagOption[(tagOption.length - 1)].remove();
    }
    
    for(let key of mangsmartHomeListData)
    {
        let elementSelect = document.getElementById("luaChon");
        let elementOption = document.createElement("option");
        if(mangListData[index].smarthome_name == key.name)
        {
            elementOption.innerHTML = "<option>" + key.name + "</option>";
            elementOption.selected = "true";
            elementOption.value = key.smarthome_id;
        }
        else
        {
            elementOption.innerHTML = "<option>" + key.name + "</option>";
            elementOption.value = key.smarthome_id;
        }
        elementSelect.append(elementOption);
    }
    let ktraActive = document.getElementById("actived");
    let elementInforUser = document.getElementById("info-user");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        tagP[(tagP.length - 1)].remove();
    }
    ktraActive.checked = mangListData[index].active
    {
        for(key in mangListData[index])
        {
            let showName = ["email","user_id","smarthome_name","smarthome_id",];
            let showName_1 = ["Email","User Id","Smart Home Name","Smart Home Id",];
            for(let i = 0; i < showName.length; i ++)
            {
                if(showName[i] == key)
                {
                    let createEleP = document.createElement("p");
                    createEleP.innerHTML = "<strong>" + showName_1[i] + " : " + "</strong>"  + mangListData[index][key];
                    elementInforUser.prepend(createEleP);
                }
            }
        }
        let createEleP = document.createElement("p");
        createEleP.innerHTML = "<strong>User Name : </strong>"  + mangListData[index].name;
        createEleP.style.textAlign = "center";
        createEleP.style.fontSize = "18px";
        elementInforUser.prepend(createEleP);
    }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block").style.display = "block";
}
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
function accept_and_cls()
{
    let par = document.getElementById("info-user");
    let traVeActive = document.getElementById("check-active");
    /*********************************** */
    let laySelect = document.getElementById("luaChon");
    let smartHomeIdData;
    for(let key in laySelect.children)
    {
        if(laySelect.children[key].selected == true)
        smarthomeIdData = laySelect.children[key].value;
    }
    let traVeUserData = [];
    for(let key=0 ; key < (par.children.length-3); key++)
    {
        traVeUserData[key] = par.children[key].lastChild.nodeValue;
    }
    let userIdData = traVeUserData[2];
    console.log('smarthomeID:', smarthomeIdData);
    console.log('userID:', userIdData);
    let activeStatus = traVeActive.children[0].checked;
    console.log('active:', activeStatus, typeof activeStatus);
    /************************************* */
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
       document.getElementById("fix-block").style.left = "0";
       document.getElementById("wrapper-0").style.marginTop = "110px";
       document.getElementById("wrapper-0").style.height =  (window.innerHeight - 110) +"px";
       document.getElementById("wrapper-0").style.width =  (window.innerWidth ) +"px";
       document.getElementById("wrapper-0").style.marginLeft = "";
    }
    else
    {
    document.getElementById("fix-block").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block").style.left = "223px";
    document.getElementById("wrapper-0").style.marginTop = "60px";
    document.getElementById("wrapper-0").style.marginLeft = "225px";
    document.getElementById("wrapper-0").style.height =  (window.innerHeight - 60) + "px";
    document.getElementById("wrapper-0").style.width =  (window.innerWidth - 225) + "px";
    }
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