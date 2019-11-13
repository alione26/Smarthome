let tem =[0,0,0,0]
let temChek = ['che1','che2','che3','che4']
function chag(identy, lamp) {
	let identy1 = document.getElementById(identy);
	if(identy1.id == "che1")
	{
		console.log(identy1.dataset.dosag);
		identy1.style.background = "green";
		identy1.style.color = "white";
		document.getElementById(temChek[1]).style.background = "lightblue";
		document.getElementById(temChek[2]).style.background = "lightblue";
		document.getElementById(temChek[3]).style.background = "lightblue";
		document.getElementById(temChek[1]).style.color = "black";
		document.getElementById(temChek[2]).style.color = "black";
		document.getElementById(temChek[3]).style.color = "black";
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
	}
}