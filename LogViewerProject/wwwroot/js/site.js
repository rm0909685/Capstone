// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var files;
var contentArr = [];
var fileContents = document.getElementById("fileContents");
var fileList = document.getElementById("fileList");
var displayFileContent = document.getElementById('displayFileContent');
zip.workerScriptsPath = 'js/';



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



//EXTRACT FILES

(function (obj) {

    var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

    function onerror(message) {
        alert(message);
    }

    var model = (function () {
        var URL = obj.webkitURL || obj.mozURL || obj.URL;

        return {
            getEntries: function (file, onend) {
                zip.createReader(new zip.BlobReader(file), function (zipReader) {
                    zipReader.getEntries(onend);
                }, onerror);
            },
            getEntryFile: function (entry, creationMethod, onend, onprogress) {
                var writer, zipFileEntry;

                function getData() {
                    entry.getData(writer, function (blob) {
                        var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
                        onend(blobURL);
                    }, onprogress);
                }

                if (creationMethod == "Blob") {
                    writer = new zip.BlobWriter();
                    getData();
                } else {
                    createTempFile(function (fileEntry) {
                        zipFileEntry = fileEntry;
                        writer = new zip.FileWriter(zipFileEntry);
                        getData();
                    });
                }
            }
        };
    })();

    (function () {
        var fileInput = document.getElementById("files");
        var fileList = document.getElementById("fileList");

        fileInput.addEventListener('change', function () {
            fileInput.disabled = true;
            model.getEntries(fileInput.files[0], function (entries) {
                fileList.innerHTML = "";
                var entryCount = 0;
                entries.forEach(function (entry) {
                    

                    var chk = document.createElement('input');  // CREATE CHECK BOX
                    chk.setAttribute('type', 'checkbox');
                    chk.setAttribute('id', entryCount);
                    chk.setAttribute('value', entryCount);
                    chk.setAttribute('name', entryCount);

                    var lbl = document.createElement('label');  // CREATE LABEL.
                    lbl.setAttribute('for', entryCount);
                    lbl.setAttribute('id', 'lbl' + entryCount);

                    // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
                    lbl.appendChild(document.createTextNode(entry.filename));

                    fileList.appendChild(chk);
                    fileList.appendChild(lbl);
                    fileList.appendChild(document.createElement("br"));

                    //Display the Versions file
                    if (entry.filename == 'Versions.txt') {
                        $("input[type='checkbox']").attr('checked', 'checked');
                        $("input[type='checkbox']").trigger('change');
                    }
                    entryCount++;

                });
            });
        }, false);
    })();

})(this);



/**

function handleFileSelect(evt) {
    //clear any previously selected files
   // document.getElementById('fileList').innerHTML = '';
    document.getElementById('navBar').innerHTML = '';
    document.getElementById('displayFileContent').innerHTML = '';

    $('#searchInputField').prop('disabled', false); //enable the search field

    files = evt.target.files; // FileList object
  

    


    // files is a FileList of File objects. List some properties.
   // var output = [];

    for (var i = 0, f; f = files[i]; i++) {
      /**  output.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
        );

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



        var chk = document.createElement('input');  // CREATE CHECK BOX
        chk.setAttribute('type', 'checkbox');
        chk.setAttribute('id', i);
        chk.setAttribute('value', i);
        chk.setAttribute('name', 'products');

        var lbl = document.createElement('label');  // CREATE LABEL.
        lbl.setAttribute('for', i);
        lbl.setAttribute('id', 'lbl' + i);

        // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
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
**/

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
        btTabName.setAttribute('value', entry.filename);
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

var searchTextEntered = document.getElementById('searchInputField');

searchTextEntered.addEventListener("focus", function () {
   

    let input = document.getElementById('searchInputField').value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName('fileDivContent');

    for (i = 0; i < contentArr.length; i++) {
        if (!contentArr[i].contents.toLowerCase().includes(input)) {
            document.getElementById(i).checked = false;
        }
        else {
            contentArr[i].contents.replace(new RegExp(input, "gi"), (match) => '<mark>${match}</mark>');
            $("#" + this.id).attr('checked', 'checked');
            $("#" + this.id).trigger('change');
            $(input).css("background", "yellow");
            //const term; // search query we want to highlight in results 
           // const results = ''; // search results
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