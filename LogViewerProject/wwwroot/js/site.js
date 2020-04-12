// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var files;
var fileContents = document.getElementById("fileContents");
var fileList = document.getElementById("fileList");



/****

SELECT FILES BUTTON FUNCTIONALITY

****/

//Make content hidden until button is clicked



/****

FILE TREE FUNCTIONALITY

****/

$(document).ready(function () {
    $("#btOpenFile").on("change", fileInputControlChangeEventHandler);
});


/** OLD CODE
 
document.getElementById("filepicker").addEventListener("change", function (event) {
    let output = document.getElementById("listing");
    let files = event.target.files;
    let fileContents = event.target.result;
    let fileReader = new FileReader();

    for (let i = 0; i < files.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = files[i].webkitRelativePath;
        output.appendChild(item);
        $("#preview").text(fileContents); 
        fileReader.readAsText(files[i]);
    };
}, false);

function fileInputControlChangeEventHandler(event) {
    let fileReader = new FileReader();
    fileReader.onload = function (event) {
        $("#preview").text(fileContents); 
    }
    fileReader.readAsText(files[0]);
}
**/


//This function creates a check box for reach file and creates a label that's the filename

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}



function handleFileSelect(evt) {
    files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];

    for (var i = 0, f; f = files[i]; i++) {
        output.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
        );


        var chk = document.createElement('input');  // CREATE CHECK BOX.

        chk.setAttribute('type', 'checkbox');       // SPECIFY THE TYPE OF ELEMENT.
        chk.setAttribute('id', i);     // SET UNIQUE ID.
        chk.setAttribute('value', i);
        chk.setAttribute('name', 'products');

        var lbl = document.createElement('label');  // CREATE LABEL.
        lbl.setAttribute('for', i);
        lbl.setAttribute('id', 'lbl' + i);
        var lblID = 'lbl' + i;

        // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
        lbl.appendChild(document.createTextNode(files[i].name));

        fileList.appendChild(chk);
        fileList.appendChild(lbl);
        fileList.appendChild(document.createElement("br"));

        //Display the Versions file
        if (files[i].name == 'Versions.txt') {
            var reader = new FileReader();
            reader.onload = function (event) {
                var contents = event.target.result;
                document.getElementById("versions").innerHTML = contents;
            };

            reader.onerror = function (event) {
                console.error("File could not be read! Code " + event.target.error.code);
            };

            reader.readAsText(files[i]);
        } //end of display Versions file
    }

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


//This function reads a file and displays its contents when the corresponding check box is selected

$(document).on('change', '[type=checkbox]', function (event) {


    var fileType = $(":checkbox").val().split('.').pop();


    //read and display file if check box is selected

    if (event.target.checked) {
        var reader = new FileReader();
        reader.onload = function (event) {
            fileContents.style.visibility = 'visible';
            var contents = event.target.result;
            fileContents.innerHTML = contents;
        };

        reader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        if (files[this.id].type.match('image.*')) {
            reader.readAsDataURL(files[this.id]);
        } else {
            reader.readAsText(files[this.id]);
        }

        //Hide content when checkbox is cleared
    } else if (!event.target.checked) {

        fileContents.style.visibility = 'hidden';

    }


});


/****
 * DISPLAY FILE INFORMATION
 * code source: codexworld.com/how-to/get-file-info-name-type-javascript/
 * ***/

function fileInfo() {
    var fileName = document.getElementByID('filepicker').files[0].name;
    var fileSize = document.getElementByID('filepicker').files[0].size;
    var fileType = document.getElementByID('filepicker').files[0].type;
    var fileModifiedDate = document.getElementByID('filepicker').files[0].lastModifiedDate;
}

//var toggler = document.getElementsByClassName("caret");
//var i;

//for (i = 0; i < toggler.length; i++) {
//  toggler[i].addEventListener("click", function() {
//    this.parentElement.querySelector(".nested").classList.toggle("active");
//    this.classList.toggle("caret-down");

//  });
//}

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

