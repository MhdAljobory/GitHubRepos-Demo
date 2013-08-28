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
	$("#savedItems").empty();

	if (res.rows.length) {
		var len = res.rows.length;
		var repo;
		for(var i=0; i<len; i++) {
			repo = res.rows.item(i);
			
			console.log(repo);
			
			$("#savedItems").append("<li><a data-transition='slide' href='repo-detail.html?owner=" +
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