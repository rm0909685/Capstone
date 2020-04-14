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


/** OLD CODE
$(document).ready(function () {
    $("#btOpenFile").on("change", fileInputControlChangeEventHandler);
});



 
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

    var fileType = $(':checkbox').val().split('.').pop();
    var tabContent = document.createElement('div');

    //read and display file if check box is selected

    if (event.target.checked) {
        var reader = new FileReader();


        //1. create li and append to ul id = nav nav-pills
        var tabName = document.createElement('li');
        document.querySelector('ul').appendChild(tabName);

        //a. id = "li" + files[(this.id)];
        tabName.setAttribute('id', 'li' + files[this.id]);

        //2. creat a inside of li element and append to li id
        var tabLink = document.createElement('a');
        tabName.appendChild(tabLink);

        //a. innerHTML = this.name
        tabLink.innerHTML = files[this.id].name;

        //b. class = "active"
        tabName.setAttribute('class', 'active');

        //c. href= "div" + files[(this.id)];	
        tabLink.setAttribute('href', '#div' + files[this.id]);

        //d. data-toggle="pill"
        tabLink.setAttribute('data-toggle', 'pill');

        var tabClose = document.createElement('span');
        tabClose.innerHTML = ' X';
        tabClose.setAttribute('onclick', 'this.parentElement.style.display="none"');
        tabLink.insertAdjacentHTML('afterend', tabClose);

        //3. create a div and append to div id="tabContainer"
        document.getElementById('displayContent').appendChild(tabContent);

        //a. id="div" + files[(this.id)]
        tabContent.setAttribute('div', 'li' + files[this.id]);

        //b. class="tab-pane fade in active"
        tabContent.setAttribute('class', 'tab-pane fade in active');

        //c. innerHTML = file contents

        reader.onload = function (event) {
            tabContent.style.visibility = 'visible';
            var contents = event.target.result;
            tabContent.innerHTML = contents;
        };

        reader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsDataURL(files[this.id]);

        /**if(files[this.id].type.match('image.*')) {
            reader.readAsDataURL(files[this.id]);
        } else {
            reader.readAsText(files[this.id]);
        }**/

        //Hide content when checkbox is cleared
    } else if (!event.target.checked) {

        tabContent.style.visibility = 'hidden';

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

