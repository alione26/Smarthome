let laySmartHomeData = {};
let mangSmartHomeData = [];
function loadData_smarthome()
{
    laySmartHomeData = JSON.parse(document.body.dataset.laysmarthomedata);
    let j = 0;
    for(let key in laySmartHomeData)
    {
        mangSmartHomeData[j] = laySmartHomeData[key];
        j++;
    }
    console.log(mangSmartHomeData);
}
// ************************************************
//Hàm loadBody sẽ khởi chạy đầu tiên khi mở web
// ************************************************
function loadBody_smarthome()
{
    loadData_smarthome()
    createTb_smarthome();
    doiSize_smarthome();
}
// ************************************************
// Hàm đọc data và tạo bảng
// ************************************************
function createTb_smarthome() 
{
let elemenTableBody = document.getElementsByTagName("tbody");
    mangSmartHomeData.forEach(function(item,index) {
    let createRow = document.createElement('tr');
    createRow.innerHTML = 
    "<td>"+ item.name + "</td>"+
    "<td>"+ item.machine_type+ "</td>"+ 
    "<td>"+ item.smarthome_id + "</td>" +
    "<td>"+ item.series_number + "</td>" +
    "<td>"+ item.smarthome_user_id + "</td>" +
    "<td>"+ item.status + "</td>" +
    "<td>"+ item.updated_at + "</td>" +
    "<td>"+ item.created_at + "</td>" +
    "<td>" + 
    '<i class="fas fa-cog" id="icon-setting" onclick="chag_smarthome( '+ index +')"></i>'  +
    '<i class="far fa-edit" id="icon-edit" onclick="editSmartHome( '+ index +')"></i>'  +
    '<i class="far fa-trash-alt" id="icon-trash" onclick="deleteSmartHome( '+ index +')"></i>' +
    "</td>";
    elemenTableBody[0].append(createRow);
});
}
// ************************************************
// Xóa Smart HOme Id
// ************************************************
function deleteSmartHome(index) 
{
    let txt = "";
    if (confirm("Bạn có chắc muốn xóa SmartHome : " +  mangSmartHomeData[index].name)) 
      {
        txt = "OK bạn đã xóa SmartHome : " + mangSmartHomeData[index].smarthome_id;

      } else 
      {
        txt = "Thoát ra";
      }
      console.log(txt);
}
// ************************************************
// Tìm kiếm 
// ************************************************
function search_smarthome() 
{
    let nameSearch = document.getElementById("id-search-smarthome");
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
// ************************************************
// Hàm hiện lên cửa sổ
// ************************************************
async function chag_smarthome(index)
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
    let elementSelect = document.getElementById("luaChon-smarthome");
    let tagOption = elementSelect.getElementsByTagName("option");
    for((tagOption.length - 1) ; (tagOption.length -1) >= 0; )
    {
    tagOption[(tagOption.length - 1)].remove();
    }
    
    for(let key of mangsmartHomeListData)
    {
        let elementSelect = document.getElementById("luaChon-smarthome");
        let elementOption = document.createElement("option");
        if(mangSmartHomeData[index].smarthome_name == key.name)
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
    let ktraActive = document.getElementById("actived-smarthome");
    let elementInforUser = document.getElementById("info-user-smarthome");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        tagP[(tagP.length - 1)].remove();
    }
    ktraActive.checked = mangSmartHomeData[index].active
    {
        for(key in mangSmartHomeData[index])
        {
            let showName = ["email","user_id","smarthome_name","smarthome_id",];
            let showName_1 = ["Email","User Id","Smart Home Name","Smart Home Id",];
            for(let i = 0; i < showName.length; i ++)
            {
                if(showName[i] == key)
                {
                    let createEleP = document.createElement("p");
                    createEleP.innerHTML = "<strong>" + showName_1[i] + " : " + "</strong>"  + mangSmartHomeData[index][key];
                    elementInforUser.prepend(createEleP);
                }
            }
        }
        let createEleP = document.createElement("p");
        createEleP.innerHTML = "<strong>SmartHome Name : </strong>"  + mangSmartHomeData[index].name;
        createEleP.style.textAlign = "center";
        createEleP.style.fontSize = "18px";
        elementInforUser.prepend(createEleP);
    }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-smarthome").style.display = "block";
}
// ************************************************
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
// ************************************************
function accept_and_cls_smarthome()
{
    let par = document.getElementById("info-user-smarthome");
    let traVeActive = document.getElementById("check-active-smarthome");
    /*********************************** */
    let laySelect = document.getElementById("luaChon-smarthome");
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
    // console.log('smarthomeID:', smarthomeIdData);
    // console.log('userID:', userIdData);
    let activeStatus = traVeActive.children[0].checked;
    // console.log('active:', activeStatus, typeof activeStatus);
    /************************************* */
    document.getElementById("fix-block-smarthome").style.display = "none";
    document.body.style.overflow = "";
    console.log("OK xác nhận thông tin cho smarthome");
    //************************* */
}
// ************************************************
// // Hàm thay đổi kích thước cửa sổ hiện lên theo kích thước window
// ************************************************
function doiSize_smarthome() {
    if(window.innerWidth <= 768)
    {
       document.getElementById("fix-block-smarthome").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-smarthome").style.left = "0";
       document.getElementById("fix-block-create-newsmarthome").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-create-newsmarthome").style.left = "0";
       document.getElementById("fix-block-edit-smarthome").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-edit-smarthome").style.left = "0";
       document.getElementById("wrapper").style.marginTop = "160px";
       document.getElementById("wrapper").style.height =  (window.innerHeight - 110) +"px";
       document.getElementById("wrapper").style.width =  (window.innerWidth ) +"px";
       document.getElementById("wrapper").style.marginLeft = "";
    }
    else
    {
    document.getElementById("fix-block-smarthome").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-smarthome").style.left = "223px";
    document.getElementById("fix-block-create-newsmarthome").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-create-newsmarthome").style.left = "223px";
    document.getElementById("fix-block-edit-smarthome").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-edit-smarthome").style.left = "223px";
    document.getElementById("wrapper").style.marginTop = "60px";
    document.getElementById("wrapper").style.marginLeft = "225px";
    document.getElementById("wrapper").style.height =  (window.innerHeight - 60) + "px";
    document.getElementById("wrapper").style.width =  (window.innerWidth - 225) + "px";
    }
}
function key_close_smarthome(eve, accept_and_cls_smarthome,accept_and_cls_newSmartHome,accept_and_cls_editSmartHome)
{
    if(eve.keyCode == 27 || eve.which == 27)
    {
        document.getElementById("fix-block-smarthome").style.display = "none";
        document.getElementById("fix-block-create-newsmarthome").style.display = "none";
        document.getElementById("fix-block-edit-smarthome").style.display = "none";
        document.body.style.overflow = "";
    }
    else if(eve.keyCode == 13 || eve.which == 13)
    {
        if(document.getElementById("fix-block-smarthome").style.display == "block")
        accept_and_cls_smarthome();
        if(document.getElementById("fix-block-create-newsmarthome").style.display == "block")
        accept_and_cls_newSmartHome();
        if(document.getElementById("fix-block-edit-smarthome").style.display == "block")
        accept_and_cls_editSmartHome();
    }
}
// ************************************************
// Hàm Create New SmartHome
// ************************************************
function newSmartHome()
{
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-create-newsmarthome").style.display = "block";
}
function accept_and_cls_newSmartHome()
{
    document.getElementById("fix-block-create-newsmarthome").style.display = "none";
    let x = document.getElementById("name-newsmarthome");
    document.body.style.overflow = "";
    console.log(x.value);
    console.log("OK đã tạo User mới");
}
// ************************************************
// Hàm Edit User
// ************************************************
function editSmartHome(index) 
{
    document.getElementById("edit-name-smarthome").value = mangSmartHomeData[index].name;
    document.getElementById("edit-machine-type-smarthome").value = mangSmartHomeData[index].machine_type;
    document.getElementById("edit-series-number-smarthome").value = mangSmartHomeData[index].series_number;
    // ****************************************
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-edit-smarthome").style.display = "block";
}
function accept_and_cls_editSmartHome()
{
    document.getElementById("fix-block-edit-smarthome").style.display = "none";
    // let x = document.getElementById("info-edit-user");
    document.body.style.overflow = "";
    // console.log(x.children[0].value);
    console.log("OK đã chỉnh sửa smarthome");
}
// ************************************************
// Hàm Tắt cửa sổ cho Thiết bị di động
// ************************************************
function cancel_block()
{
    document.getElementById("fix-block-smarthome").style.display = "none";
    document.getElementById("fix-block-create-newsmarthome").style.display = "none";
    document.getElementById("fix-block-edit-smarthome").style.display = "none";
    document.body.style.overflow = "";
}