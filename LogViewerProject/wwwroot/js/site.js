// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var files;
var contentArr = [];
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
    //Reset page
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('navBar').innerHTML = '';
    document.getElementById('displayFileContent').innerHTML = '';
    $('#searchInputField').prop('disabled', false); //enable the search field
    $('#fileSelectPrompt').remove();

    files = evt.target.files; // FileList object


    // files is a FileList of File objects. List some properties.
    var output = [];

    for (var i = 0, f; f = files[i]; i++) {
        output.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
        );

        // files = evt.target.files;
        window.array = []
        if (files) {
            var r = new FileReader();
            r.onload = (function (f) {
                return function (e) {
                    var contents = e.target.result;
                    window.array.push(contents);
                    contentArr.push({ name: f.name, contents: contents }); // storing as object
                };
            })(f);
            r.readAsText(f);

        } else {
            alert("Failed to load files");
        }



        var chk = document.createElement('input');  // CREATE CHECK BOX.
        chk.setAttribute('type', 'checkbox');
        chk.setAttribute('id', i);
        chk.setAttribute('value', i);
        chk.setAttribute('name', 'products');

        var lbl = document.createElement('label');  // CREATE LABEL.
        lbl.setAttribute('for', i);
        lbl.setAttribute('id', 'lbl' + i);
        lbl.appendChild(document.createTextNode(files[i].name));

        fileList.appendChild(chk);
        fileList.appendChild(lbl);
        fileList.appendChild(document.createElement("br"));

        //Display the Versions file
        if (files[i].name == 'Versions.txt') {
            $("input[type='checkbox']").attr('checked', 'checked');
            $("input[type='checkbox']").trigger('change');
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
        $("input[type='checkbox']").removeAttr('checked');
        $('#bt' + this.id).remove();
        $('#displayFileContent').html('');

    }


});


/****
SEARCH BUTTON FUNCTIONALITY
****/



/** 
function searchFiles() {
    var input, i;
    input = document.getElementById('searchInputField');

    for (i = 0; i < contentArr.length; i++) {
        console.log('reached for loop');
        if (!contentArr[i].contents.toLowerCase().includes(input)) {
            $("input[type='checkbox']").removeAttr('checked');
            $('#' + this.id).remove();
            $('#bt' + this.id).remove();
            $('#lbl' + this.id).remove();
            $("input[type='checkbox']").trigger('change');
            console.log('does not include input');
        }
        else {
            console.log('includes input');
            $("input[type='checkbox']").attr('checked', 'checked');
            $("input[type='checkbox']").trigger('change');

            if (document.body.contains(document.getElementById('bt' + this.id))) {
                console.log('should be getting removed...');
                $('#bt' + this.id).remove();
            }



            contentArr[i].contents.replace(new RegExp(input, "gi"), (match) => '<mark>${match}</mark>');
            $("#" + this.id).attr('checked', 'checked');
            $("#" + this.id).trigger('change');
            $(input).css("background", "yellow");
            //const term; // search query we want to highlight in results 
            // const results = ''; // search results  *

        }
    }

} **/

var searchTextEntered = document.getElementById('searchInputField');

searchTextEntered.addEventListener("keyup", function () {
   
    $('#btClearSearch').attr('display', 'block');

    let input = searchTextEntered.value;
    input = input.toLowerCase();
    
    let x = document.getElementsByClassName('fileDivContent');

    for (i = 0; i < contentArr.length; i++) {
        console.log('reached for loop');
        if (!contentArr[i].contents.toLowerCase().includes(input)) {
            $("input[type='checkbox']").removeAttr('checked');
            $('#' + this.id).remove();
            $('#bt' + this.id).remove();
            $('#lbl' + this.id).remove();
            $("input[type='checkbox']").trigger('change');
            displayFileContent.innerHTML = 'Search results not found.';
        }
        else {

            if (document.body.contains(document.getElementById('bt' + this.id))) {
                console.log('should be getting removed...');
                $('#bt' + this.id).remove();
            } 
            (function () {
                
                $("input[type='checkbox']").attr('checked', 'checked');
                $("input[type='checkbox']").trigger('change');
            });
            

           

            
            /**
            contentArr[i].contents.replace(new RegExp(input, "gi"), (match) => '<mark>${match}</mark>');
            $("#" + this.id).attr('checked', 'checked');
            $("#" + this.id).trigger('change');
            $(input).css("background", "yellow");
            //const term; // search query we want to highlight in results 
            // const results = ''; // search results  **/

        }
    }
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

    /**if(files[this.id].type.match('image.*')) {
        reader.readAsDataURL(files[this.id]);
    } else {
        reader.readAsText(files[this.id]);
    }**/

    // tabContent.style.display = "block";

    displayFileContent.innerHTML = contentArr[btID].contents;
    evt.currentTarget.className += " active";
}