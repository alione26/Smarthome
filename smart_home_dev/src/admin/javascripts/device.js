let layDeviceData = {};
let mangDeviceData = [];
function loadData_device()
{
    layDeviceData = JSON.parse(document.body.dataset.laydevicedata);
    let i = 0;
    for(let key in layDeviceData)
    {
        mangDeviceData[i] = layDeviceData[key];
        i++;
    }
    console.log(mangDeviceData);
}
//Hàm loadBody sẽ khởi chạy đầu tiên khi mở web
// ******************
function loadBody_device()
{
    loadData_device();
    createTb_device();
    doiSize_device();
    
}
// Hàm đọc data và tạo bảng
// ******************
function createTb_device() 
{
let elemenTableBody = document.getElementsByTagName("tbody");
    mangDeviceData.forEach(function(item,index) {
    let createRow = document.createElement('tr');
    createRow.innerHTML = 
    "<td>"+ item.name + "</td>"+
    "<td>"+ item.machine_type + "</td>"+ 
    "<td>"+ item.series_number + "</td>" +
    "<td>"+ item.smarthomeDevice_id + "</td>" +
    "<td>"+ item.smarthome_id + "</td>" +
    "<td>"+ item.smarthome_name + "</td>" +
    "<td>"+ item.status + "</td>" +
    "<td>"+ item.updated_at + "</td>" +
    "<td>"+ item.created_at + "</td>" +
    "<td>" + 
    '<i class="fas fa-cog" id="icon-setting" onclick="chag_device( '+ index +')"></i>'  +
    '<i class="far fa-edit" id="icon-edit" onclick="editDevice( '+ index +')"></i>'  +
    '<i class="far fa-trash-alt" id="icon-trash" onclick="deleteDevice( '+ index +')"></i>' +
    "</td>";
    elemenTableBody[0].append(createRow);
});
}
// Xóa Device
// ******************
function deleteDevice(index) 
{
    let txt = "";
    if (confirm("Bạn có chắc muốn xóa Device : " +  mangDeviceData[index].name)) 
      {
        txt = "OK bạn đã xóa Device : " + mangDeviceData[index].smarthomeDevice_id;
      } else 
      {
        txt = "Thoát ra";
      }
      console.log(txt);
}
// Tìm kiếm 
// ******************
function search_device() 
{
    let nameSearch = document.getElementById("id-search-device");
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
//// Hàm hiện lên cửa sổ
// ******************
async function chag_device(index)
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
    let elementSelect = document.getElementById("luaChon-device");
    let tagOption = elementSelect.getElementsByTagName("option");
    for((tagOption.length - 1) ; (tagOption.length -1) >= 0; )
    {
    tagOption[(tagOption.length - 1)].remove();
    }
    for(let key of mangsmartHomeListData)
    {
        let elementSelect = document.getElementById("luaChon-device");
        let elementOption = document.createElement("option");
        if(mangDeviceData[index].smarthome_name == key.name)
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
    // let ktraActive = document.getElementById("actived-device");
    let elementInforUser = document.getElementById("info-user-device");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        tagP[(tagP.length - 1)].remove();
    }
    // ktraActive.checked = mangDeviceData[index].active
    {
        for(key in mangDeviceData[index])
        {
            let showName = ["machine_type","series_number","smarthomeDevice_id","smarthome_id","smarthome_name","status","updated_at","created_at",];
            let showName_1 = ["Machine Type","Series Number","SmartHome Device Id","SmartHome Id","SmartHome Name","Status","Update at","Create at",]; 
            for(let i = 0; i < showName.length; i ++)
            {
                if(showName[i] == key )
                {
                    let createEleP = document.createElement("p");
                    createEleP.innerHTML = "<strong>" + showName_1[i] + " : " + "</strong>"  + mangDeviceData[index][key];
                    elementInforUser.prepend(createEleP);
                }
            }
        }
        let createEleP = document.createElement("p");
        createEleP.innerHTML = "<strong>Device Name : </strong>"  + mangDeviceData[index].name;
        createEleP.style.textAlign = "center";
        createEleP.style.fontSize = "18px";
        elementInforUser.prepend(createEleP);
    }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-device").style.display = "block";
}
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
// ******************
function accept_and_cls_device()
{
    let par = document.getElementById("info-user-device");
    // let traVeActive = document.getElementById("check-active-device");
    /*********************************** */
    let laySelect = document.getElementById("luaChon-device");
    let smartHomeIdData;
    for(let key in laySelect.children)
    {
        if(laySelect.children[key].selected == true)
        smartHomeIdData = laySelect.children[key].value;
    }
    let traVeUserData = [];
    for(let key=0 ; key < (par.children.length-3); key++)
    {
        traVeUserData[key] = par.children[key].lastChild.nodeValue;
    }
    let smartHomeIdDataOld = traVeUserData[4];
    let smartHomeDeviceId = traVeUserData[5];
    console.log("OK xác nhận thông tin cho device");
    console.log('smarthomeID mới chọn:', smartHomeIdData);
    console.log('Smart Home Id cũ:', smartHomeIdDataOld);
    console.log("Smart Home Device Id", smartHomeDeviceId);
    // let activeStatus = traVeActive.children[0].checked;
    // console.log('active:', activeStatus, typeof activeStatus);
    /************************************* */
    document.getElementById("fix-block-device").style.display = "none";
    document.body.style.overflow = "";
    //************************* */
}
// Hàm thay đổi kích thước cửa sổ hiện lên theo kích thước window
// ******************
function doiSize_device() {
    if(window.innerWidth <= 768)
    {
       document.getElementById("fix-block-device").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-device").style.left = "0";
       document.getElementById("fix-block-create-newdevice").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-create-newdevice").style.left = "0";
       document.getElementById("fix-block-edit-device").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-edit-device").style.left = "0";
       document.getElementById("wrapper").style.marginTop = "160px";
       document.getElementById("wrapper").style.height =  (window.innerHeight - 110) +"px";
       document.getElementById("wrapper").style.width =  (window.innerWidth ) +"px";
       document.getElementById("wrapper").style.marginLeft = "";
    }
    else
    {
    document.getElementById("fix-block-device").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-device").style.left = "223px";
    document.getElementById("fix-block-create-newdevice").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-create-newdevice").style.left = "223px";
    document.getElementById("fix-block-edit-device").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-edit-device").style.left = "223px";
    document.getElementById("wrapper").style.marginTop = "60px";
    document.getElementById("wrapper").style.marginLeft = "225px";
    document.getElementById("wrapper").style.height =  (window.innerHeight - 60) + "px";
    document.getElementById("wrapper").style.width =  (window.innerWidth - 225) + "px";
    }
}
function key_close_device(eve, accept_and_cls_device)
{
    if(eve.keyCode == 27 || eve.which == 27)
    {
        document.getElementById("fix-block-device").style.display = "none";
        document.getElementById("fix-block-create-newdevice").style.display = "none";
        document.getElementById("fix-block-edit-device").style.display = "none";
        document.body.style.overflow = "";
    }
    else if(eve.keyCode == 13 || eve.which == 13)
    {
        if(document.getElementById("fix-block-device").style.display == "block")
        accept_and_cls_device();
        if(document.getElementById("fix-block-create-newdevice").style.display == "block")
        accept_and_cls_newDevice();
        if(document.getElementById("fix-block-edit-device").style.display == "block")
        accept_and_cls_editDevice();
    }
}
// Hàm Create New Device
// ******************
function newDevice()
{
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-create-newdevice").style.display = "block";
}
function accept_and_cls_newDevice()
{
    console.log("OK đã tạo Device mới");
    console.log("Device Name:",document.getElementById("name-newdevice").value);
    console.log("Device Machine Type:",document.getElementById("machine-type-newdevice").value);
    console.log("Device Series Number:",document.getElementById("series-number-newdevice").value);
    document.getElementById("fix-block-create-newdevice").style.display = "none";
    document.body.style.overflow = "";
}
// Hàm Edit User
// ******************
function editDevice(index) 
{
    document.getElementById("edit-name-device").value = mangDeviceData[index].name;
    document.getElementById("edit-machine-type-device").value = mangDeviceData[index].machine_type;
    document.getElementById("edit-series-number-device").value = mangDeviceData[index].series_number;
    // ****************************************
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-edit-device").style.display = "block";
}
function accept_and_cls_editDevice()
{
    console.log("OK đã chỉnh sửa Device");
    console.log("Device Name:",document.getElementById("edit-name-device").value);
    console.log("Device Machine Type:",document.getElementById("edit-machine-type-device").value);
    console.log("Device Series Number:",document.getElementById("edit-series-number-device").value);
    document.getElementById("fix-block-edit-device").style.display = "none";
    // let x = document.getElementById("info-edit-user");
    document.body.style.overflow = "";
    // console.log(x.children[0].value);
}
// ************************************************
// Hàm Tắt cửa sổ cho Thiết bị di động
// ************************************************
function cancel_block()
{
    document.getElementById("fix-block-device").style.display = "none";
    document.getElementById("fix-block-create-newdevice").style.display = "none";
    document.getElementById("fix-block-edit-device").style.display = "none";
    document.body.style.overflow = "";
}