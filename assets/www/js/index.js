// Get variables from URL
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var db;


///////////////////////
// DB function
///////////////////////
function createDb(tx) {
	// Drop Table if exists
	tx.executeSql("DROP TABLE IF EXISTS repos");
	// Create Table
	tx.executeSql("CREATE TABLE repos(user, name)");
}

// If Error occurs
function txError(error) { console.log(error); console.log("Database error: " + error); }

// If Success
function txSuccess() { console.log("Success"); }


// Save repo as favorite
function saveFave() {
    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    db.transaction(saveFaveDb, txError, txSuccessFave);
}

// Save repo
function saveFaveDb(tx) {
	urlVars = getUrlVars();
    var owner = urlVars.owner;
    var name = urlVars.name;
	// Insert new row in column
    tx.executeSql("INSERT INTO repos(user, name) VALUES (?, ?)",[owner,name]);
}

// Save Success
function txSuccessFave() { console.log("Save success"); disableSaveButton(); }

function disableSaveButton() {
    // change the button text and style
    var ctx = $("#saveBtn").closest(".ui-btn");
	// Change style
    $('span.ui-btn-text',ctx).text("Saved").closest(".ui-btn-inner").addClass("ui-btn-up-b");

	// Remove handle
    $("#saveBtn").unbind("click", saveFave);
}

///////////////////////////
// User in the main page
///////////////////////////
$('#reposHome').bind('pageinit', function(event) {
	// load repos
	loadRepos();
	// open Database
	db = window.openDatabase("repodb", "0.1","GitHub Repo Db", 1000);
	db.transaction(createDb, txError, txSuccess);
});


// load repos from gihub
function loadRepos() {
	// Get repos data
    $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
        var i, repo;
		// foreach repo add li
        $.each(data.repositories, function (i, repo) {
            $("#allRepos").append("<li><a href='repo-detail.html?owner=" + repo.username + "&name=" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.username + "</p></a></li>");
        });
        $('#allRepos').listview('refresh');
    });
}

/////////////////////////////////
// User in the repo details page
/////////////////////////////////
$(document).on('pageshow', '#reposDetail', function(event) {
	urlVars = getUrlVars();
    var owner = urlVars.owner;
    var name = urlVars.name;
    loadRepoDetail(owner,name);
	// handle click
	$("#saveBtn").bind("click", saveFave);
	// check if the repo is a favorite repo
	checkFave();
});

// Check if the repo is a favorite repo
function checkFave() {
	db.transaction(checkFaveDb, txError);
}

function checkFaveDb(tx) {
	urlVars = getUrlVars();
	
	owner = urlVars.owner;
	name = urlVars.name;
	
	// Get table entity
	tx.executeSql("SELECT * FROM repos WHERE user = ? AND name = ?", [owner, name], txSuccessCheckFave);
}

function txSuccessCheckFave(tx,results) {
    console.log("Read success");
    console.log(results);

    if (results.rows.length)
         disableSaveButton();
}

// load repo details
function loadRepoDetail(owner,name) {
	// Get Repo details
    $.ajax("https://api.github.com/repos/" + owner + "/" + name).done(function(data) {
		
        var repo = data;
		// Add repo name
        $('#repoName').html("<a href='" + repo.homepage + "'>" + repo.name + "</a>");
		// Add description
        $('#description').text(repo.description);
		// Add number of forks and watchers
        $('#forks').html("<strong>Forks:</strong> " + repo.forks + "<br><strong>Watchers:</strong> " + repo.watchers);
		
		// Owner details
		// Owner avatar
        $('#avatar').attr('src', repo.owner.avatar_url);
		// Owner name
        $('#ownerName').html("<strong>Owner:</strong> <a href='http://github.com/" + repo.owner.login + "'>" + repo.owner.login + "</a>");
	});
}


///////////////////////////////
// User in the favorite repos
///////////////////////////////
$(document).on("pageshow", "#favesHome", function(event) {
	db.transaction(loadFavesDb, txError, txSuccess);
});

function loadFavesDb(tx) {
	tx.executeSql("SELECT * FROM repos", [], txSuccessLoadFaves);
}

function txSuccessLoadFaves(tx, res) {
	console.log("Read success");
	
	if (res.rows.length) {
		var len = res.rows.length;
		var repo;
		for(var i=0; i<len; i++) {
			repo = res.rows.item(i);
			
			console.log(repo);
			
			$("#savedItems").append("<li><a href='repo-derail?owner=" +
									repo.user+"&name="+repo.name+"'><h4>" +
									repo.name+"</h4><p>"+repo.user+"</p></a></li>");
		}
		$('#savedItems').listview('refresh');
	}
	else {
		if (navigator.notification)
            navigator.notification.alert("You haven't saved any favorites yet.", function(){
				$.mobile.changePage("index.html");
			});
	}
}