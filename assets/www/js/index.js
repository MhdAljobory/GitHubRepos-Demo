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
});

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