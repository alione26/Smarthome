let tem =[0,0,0,0]
let temChek = ['che1','che2','che3','che4']
function kiemTraChe()
{
	if ((document.getElementById("tragThaiCheck").checked))
	{
		document.getElementById(temChek[0]).style.background = "lightblue";
		document.getElementById(temChek[1]).style.background = "lightblue";
		document.getElementById(temChek[2]).style.background = "lightblue";
		document.getElementById(temChek[3]).style.background = "lightblue";

	}
}
function chag(identy) {
	let identy1 = document.getElementById(identy);
	if(identy1.id == "che1")
	{
		console.log(identy1.dataset.dosag);
		console.log('deviceid: '+ identy1.dataset.id);
		console.log('smarthomeid: '+ identy1.dataset.smarthomeid);
		identy1.style.background = "green";
		identy1.style.color = "white";
		document.getElementById(temChek[1]).style.background = "lightblue";
		document.getElementById(temChek[2]).style.background = "lightblue";
		document.getElementById(temChek[3]).style.background = "lightblue";
		document.getElementById(temChek[1]).style.color = "black";
		document.getElementById(temChek[2]).style.color = "black";
		document.getElementById(temChek[3]).style.color = "black";
		sendData(identy1.dataset.dosag, identy1.dataset.smarthomeid, identy1.dataset.id);
	}
	if(identy1.id == "che2")
	{
		console.log(identy1.dataset.dosag);
		identy1.style.background = "green";
		identy1.style.color = "white";
		document.getElementById(temChek[0]).style.background = "lightblue";
		document.getElementById(temChek[2]).style.background = "lightblue";
		document.getElementById(temChek[3]).style.background = "lightblue";
		document.getElementById(temChek[0]).style.color = "black";
		document.getElementById(temChek[2]).style.color = "black";
		document.getElementById(temChek[3]).style.color = "black";
		sendData(identy1.dataset.dosag, identy1.dataset.smarthomeid, identy1.dataset.id);
	}
	if(identy1.id == "che3")
	{
		console.log(identy1.dataset.dosag);
		identy1.style.background = "green";
		identy1.style.color = "white";
		document.getElementById(temChek[1]).style.background = "lightblue";
		document.getElementById(temChek[0]).style.background = "lightblue";
		document.getElementById(temChek[3]).style.background = "lightblue";
		document.getElementById(temChek[1]).style.color = "black";
		document.getElementById(temChek[0]).style.color = "black";
		document.getElementById(temChek[3]).style.color = "black";
		sendData(identy1.dataset.dosag, identy1.dataset.smarthomeid, identy1.dataset.id);
	}
	if(identy1.id == "che4")
	{
		console.log(identy1.dataset.dosag);
		identy1.style.background = "green";
		identy1.style.color = "white";
		document.getElementById(temChek[1]).style.background = "lightblue";
		document.getElementById(temChek[2]).style.background = "lightblue";
		document.getElementById(temChek[0]).style.background = "lightblue";
		document.getElementById(temChek[1]).style.color = "black";
		document.getElementById(temChek[2]).style.color = "black";
		document.getElementById(temChek[0]).style.color = "black";
		sendData(identy1.dataset.dosag, identy1.dataset.smarthomeid, identy1.dataset.id);
	}
}
function sendData(dosang, smarthome_id, smarthomeDevice_id){
	$.ajax({
			url: "/smart-homes/change-brightness",
			type: "post",
			// $.trim() remove WHITE SPACE before and after STRING
			data: { smarthomeDevice_id: $.trim(smarthomeDevice_id), smarthome_id: $.trim(smarthome_id), action: dosang },
			success: function (response) {
					console.log(response);
					//$.LoadingOverlay("hide");
			},
			error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);

					//$.LoadingOverlay("hide");
			}
	});
}
