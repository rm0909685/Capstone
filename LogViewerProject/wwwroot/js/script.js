
/****

SELECT FILES BUTTON FUNCTIONALITY

****/

//Make content hidden until button is clicked



/****

FILE TREE FUNCTIONALITY

****/

document.getElementById("filepicker").addEventListener("change", function (event) {
    let output = document.getElementById("listing");
    let files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = files[i].webkitRelativePath;
        output.appendChild(item);
    };
}, false);

var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
	
  });
}

/****

SEARCH BUTTON FUNCTIONALITY

****/

var searchTextEntered = document.getElementById("searchInputField");
searchTextEntered.addEventListener("focus", function () {
  document.getElementById("btSearch").style.backgroundColor = "darkblue";  
});


/****

TABS THAT DISPLAY FILE CONTENT FUNCTIONALITY

****/

function openCity(cityName) {
  var i;
  var x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(cityName).style.display = "block";
}


/*
*
*
CODE TO MAKE DIV DRAGGABLE


// Make the DIV element draggable:
dragElement(document.getElementById("fileTreeView"));


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



*
*/
