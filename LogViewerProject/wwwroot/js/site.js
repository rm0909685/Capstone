// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var files;
var fileContents = document.getElementById("fileContents");
var fileList = document.getElementById("fileList");
var displayFileContent = document.getElementById('displayFileContent');



/****

SELECT FILES BUTTON FUNCTIONALITY

****/

//Make content hidden until button is clicked



/****

FILE TREE FUNCTIONALITY

****/



// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
} else {
    alert('The File APIs are not fully supported in this browser.');
}



function handleFileSelect(evt) {
    files = evt.target.files; // FileList object

    //clear any previously selected files
    document.getElementById('fileList').innerHTML = '';
  //  document.getElementById('tabContainer').innerHTML = '';

    // files is a FileList of File objects. List some properties.
    var output = [];

    for (var i = 0, f; f = files[i]; i++) {
        output.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
        );

    

 

        var chk = document.createElement('input');  // CREATE CHECK BOX.

        chk.setAttribute('type', 'checkbox');     
        chk.setAttribute('id', i);     
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
            document.getElementById(this.id).checked = true;
        } 
    }

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


//This function reads a file and displays its contents when the corresponding check box is selected

$(document).on('change', '[type=checkbox]', function (event) {

    var fileType = $(':checkbox').val().split('.').pop();

    //read and display file if check box is selected

    if (event.target.checked) {
        var reader = new FileReader();
        
        var btTabName = document.createElement('input');

        btTabName.setAttribute('class', 'tablinks');
        btTabName.setAttribute('id', 'bt' + this.id);
        btTabName.setAttribute('onclick', 'openFile(event)');
        btTabName.setAttribute('type', 'button');
        btTabName.setAttribute('value', files[this.id].name);
        document.getElementById('navBar').append(btTabName);

        var tabClose = document.createElement('span');
        tabClose.innerHTML = ' X';
        tabClose.setAttribute('onclick', 'this.parentElement.style.display="none"');
     
        

        reader.onload = function (event) {
            
            var contents = event.target.result;
            displayFileContent.innerHTML = contents;
           
        };

        reader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsText(files[this.id]);
      //  document.getElementById('testDiv').appendChild(tabContent);
      

        /**if(files[this.id].type.match('image.*')) {
            reader.readAsDataURL(files[this.id]);
        } else {
            reader.readAsText(files[this.id]);
        }**/

        //Hide content when checkbox is cleared
    } else if (!event.target.checked) {

        //tabContent.style.visibility = 'hidden';

    }


});


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

function openFile(evt) {
    var i, tablinks;

    var btID = evt.currentTarget.id;
    btID = btID.slice(2);
    console.log(btID);
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }



    var reader = new FileReader();
    reader.onload = function (event) {
       // fileContents.style.visibility = 'visible';
        var contents = event.target.result;
        displayFileContent.innerHTML = contents;
    };

    reader.onerror = function (event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };

    /**if(files[this.id].type.match('image.*')) {
        reader.readAsDataURL(files[this.id]);
    } else {
        reader.readAsText(files[this.id]);
    }**/

    reader.readAsText(files[btID]);



    
   // tabContent.style.display = "block";
   // displayFileContent.innerHTML = files[btID];
    evt.currentTarget.className += " active"; 
}

