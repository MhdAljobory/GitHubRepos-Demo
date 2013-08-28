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

///////////////////////////
// User in the main page
///////////////////////////
//$(document).on('pageshow', '#reposHome', function(event) {
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
            $("#allRepos").append("<li><a data-transition='slide' href='repo-detail.html?owner=" + repo.username + "&name=" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.username + "</p></a></li>");
        });
        $('#allRepos').listview('refresh');
    });
}