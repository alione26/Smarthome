
// let laySmartHomeData = JSON.parse(document.body.dataset.laysmarthomedata);
let laySmartHomeData = {};
let mangSmartHomeData = [];
function loadData_smarthome()
{
    laySmartHomeData = JSON.parse(document.body.dataset.laysmarthomedata);
    // mangSmartHomeData = [];
    let j = 0;
    for(let key in laySmartHomeData)
    {
        mangSmartHomeData[j] = laySmartHomeData[key];
        j++;
    }
    console.log(mangSmartHomeData);
}

// let j = 0;
// for(let key in laySmartHomeData)
// {
//     mangSmartHomeData[j] = laySmartHomeData[key];
//     j++;
// }
//console.log(mangListData);
//Hàm loadBody sẽ khởi chạy đầu tiên khi mở web
function loadBody_smarthome()
{
    loadData_smarthome()
    createTb_smarthome();
    doiSize_smarthome();
    
}
// Hàm đọc data và tạo bảng
function createTb_smarthome() 
{
let elemenTableBody = document.getElementsByTagName("tbody");
    mangSmartHomeData.forEach(function(item,index) {
    let createRow = document.createElement('tr');
    createRow.innerHTML = 
    "<td>"+ item.name + "</td>"+
    "<td>"+ item.machine_type+ "</td>"+ 
    // "<td>"+ item.email + "</td>" +
    "<td>"+ item.smarthome_id + "</td>" +
    "<td>"+ item.series_number + "</td>" +
    "<td>"+ item.smarthome_user_id + "</td>" +
    "<td>"+ item.status + "</td>" +
    "<td>"+ item.updated_at + "</td>" +
    "<td>"+ item.created_at + "</td>" +
    "<td>" + 
    // // '<button id="btnEdit" onclick="chag_smarthome(' + index +')">More</button>' + 
    '<i class="fas fa-cog" id="icon-setting" onclick="chag_smarthome( '+ index +')"></i>'  +
    '<i class="far fa-edit" id="icon-edit"'  + '</i>' +
    '<i class="far fa-trash-alt" id="icon-trash">' + '</i>' +
        // onclick="chag_smarthome(' + index +')"
    "</td>";
    elemenTableBody[0].append(createRow);
});
}

// Tìm kiếm 
// ******************
function search_smarthome() 
{
    let nameSearch = document.getElementById("id-search-smarthome");
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

async function chag_smarthome(index)
{

    // let par = document.getElementById("info-user");
    
    let smartHomeList = await axios.get('/smarthome/get_list');
    let smartHomeListData = smartHomeList.data.data;
    let mangsmartHomeListData = [];
    let i = 0;
    for(key in smartHomeListData)
    {
        mangsmartHomeListData[i] = smartHomeListData[key];
        // console.log('smarthomeListData:', mangsmartHomeListData[i]);
        i++;
    }
    //********************************************************* */
    let elementSelect = document.getElementById("luaChon-smarthome");
    let tagOption = elementSelect.getElementsByTagName("option");
    for((tagOption.length - 1) ; (tagOption.length -1) >= 0; )
    {
    // console.log(tagOption[(tagOption.length - 1)].outerHTML);
    tagOption[(tagOption.length - 1)].remove();
    }
    
    for(let key of mangsmartHomeListData)
    {
        let elementSelect = document.getElementById("luaChon-smarthome");
        let elementOption = document.createElement("option");
        // console.log(key.name);
        // console.log("hien ra",mangListData[index].smarthome_name);
        if(mangSmartHomeData[index].smarthome_name == key.name)
        {
            // console.log("đã đúng ");
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
        // console.log('smarthomeListData:', key.name);
    }

    // console.log(document.getElementById("luaChon").children[3].value);
    
    









    let ktraActive = document.getElementById("actived-smarthome");
    let elementInforUser = document.getElementById("info-user-smarthome");
    //console.log("đánh dâu");
    let tagP = elementInforUser.getElementsByTagName("p");
    for((tagP.length - 1) ; (tagP.length -1) >= 0; )
    {
        // console.log(tagP[(tagP.length - 1)].outerHTML);
        tagP[(tagP.length - 1)].remove();
    }
    
    // console.log(tagP[i].innerHTML);

    ktraActive.checked = mangSmartHomeData[index].active
    {
        for(key in mangSmartHomeData[index])
        {
            let showName = ["email","user_id","smarthome_name","smarthome_id",];
            let showName_1 = ["Email","User Id","Smart Home Name","Smart Home Id",];
            // console.log(key.length);   
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
    // for(key in mangSmartHomeData[index])
    // {
    //     let showName = ["name","email","user_id","smarthome_name","smarthome_id",];
    //     let showName_1 = ["Name","Email","User Id","Smart Home Name","Smart Home Id",];
    //     // console.log(key.length);   
    //     for(let i = 0; i < showName.length; i ++)
    //     {
    //         if(showName[i] == key)
    //         {
    //             let createEleP = document.createElement("p");
    //             createEleP.innerHTML = "<strong>" + showName_1[i] + " : " + "</strong>"  + mangSmartHomeData[index][key];
    //             elementInforUser.prepend(createEleP);
    //         }
            
    //     }
    // }
    // par.children[0].innerHTML = "Tên User : " + "<strong>" 
    //                             + mangDoiTuog[index].name + "</strong>";
    // /***************************************** */
    // par.children[1].innerHTML = "Số điện thoại : " + mangDoiTuog[index].sdt;
    // /****************************************** */
    // if((par.children[0].lastChild.innerHTML) ==  mangDoiTuog[index].name)
    // {
        // let elementSelect = document.getElementById("luaChon");
        // let elementOption = createElement("option");
        // let y = document.getElementById("actived");
        // y.checked = mangDoiTuog[index].active;
        
    // }
    /******************************** */
    document.body.style.overflow = "hidden";
    document.getElementById("fix-block-smarthome").style.display = "block";
}
// Hàm nhận data sau khi ấn OK và đóng cửa sổ
function accept_and_cls_smarthome()
{
    
    // let x = document.getElementById("luaChon");
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
        // console.log(par.children[key].lastChild.nodeValue);
        traVeUserData[key] = par.children[key].lastChild.nodeValue;
    }
    //console.log(traVeUserData);
    let userIdData = traVeUserData[2];
    console.log('smarthomeID:', smarthomeIdData);
    console.log('userID:', userIdData);
    
    let activeStatus = traVeActive.children[0].checked;
    console.log('active:', activeStatus, typeof activeStatus);
    // console.log(document.getElementById("luaChon").children[index].value);
    /************************************* */
    document.getElementById("fix-block-smarthome").style.display = "none";
    document.body.style.overflow = "";
    console.log("OK đã xác nhận");
    //************************* */
    

}
// // Hàm thay đổi kích thước cửa sổ hiện lên theo kích thước window
function doiSize_smarthome() {
    if(window.innerWidth <= 768)
    {
       document.getElementById("fix-block-smarthome").style.width = (window.innerWidth) +'px';
       document.getElementById("fix-block-smarthome").style.left = "0";
       document.getElementById("wrapper").style.marginTop = "110px";
       document.getElementById("wrapper").style.height =  (window.innerHeight - 110) +"px";
       document.getElementById("wrapper").style.width =  (window.innerWidth ) +"px";
       document.getElementById("wrapper").style.marginLeft = "";
    }
    else
    {
    document.getElementById("fix-block-smarthome").style.width = (window.innerWidth - 223) +'px';
    document.getElementById("fix-block-smarthome").style.left = "223px";
    document.getElementById("wrapper").style.marginTop = "60px";
    document.getElementById("wrapper").style.marginLeft = "225px";
    document.getElementById("wrapper").style.height =  (window.innerHeight - 60) + "px";
    document.getElementById("wrapper").style.width =  (window.innerWidth - 225) + "px";
    }
       

       //*****
    //    console.log(window.innerHeight);
}
function esc_close_smarthome(eve, accept_and_cls)
{
    if(eve.keyCode == 27 || eve.which == 27)
    {
        document.getElementById("fix-block-smarthome").style.display = "none";
        document.body.style.overflow = "";
    }
    else if(eve.keyCode == 13 || eve.which == 13)
    {
        accept_and_cls();
    }
    
}