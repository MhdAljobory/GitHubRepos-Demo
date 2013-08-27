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


///////////////////////////
// User in the main page
///////////////////////////
$('#reposHome').bind('pageinit', function(event) {
	// load repos
	loadRepos();
});

// load repos from gihub
function loadRepos() {
	// Get repos data
    $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
        var i, repo;
		// foreach repo add li
        $.each(data.repositories, function (i, repo) {
            $("#allRepos").append("<li><a href='http://github.com/" + repo.username + "/" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.username + "</p></a></li>");
        });
        $('#allRepos').listview('refresh');
    });
}