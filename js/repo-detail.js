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
    $('span.ui-btn-text',ctx).text("Unsaved").closest(".ui-btn-inner").addClass("ui-btn-up-b");

	// Remove handle
    $("#saveBtn").unbind("click", saveFave);
	// Remove handle
	$("#saveBtn").bind("click", unsaveFave);
}

// Unsave repo from favorite
function unsaveFave() {
	db.transaction(unsaveFaveDb, txError, txSuccessNotFave);
}

// delete saved repo from DB
function unsaveFaveDb(tx) {
	urlVars = getUrlVars();
    var owner = urlVars.owner;
    var name = urlVars.name;
	// Delete row
	tx.executeSql("DELETE FROM repos WHERE user = ? AND name = ?", [owner, name]);
}

// Unsaved success
function txSuccessNotFave() { 
	console.log("Unsave success");
	enableSaveButton(); 
}

// Change button style
function enableSaveButton() {
	// change the button text and style
	var ctx = $("#saveBtn").closest(".ui-btn");
	// Change style
	$('span.ui-btn-text',ctx).text("Favorite").closest(".ui-btn-inner").removeClass("ui-btn-up-b");

	// Remove handle
	$("#saveBtn").unbind("click", unsaveFave);
	// Remove handle
	$("#saveBtn").bind("click", saveFave);
}


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
	// Get Repo details$
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
