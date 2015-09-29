var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection();


	// app.userTasks = new UserTaskCollection();
	// app.unassignedTasks = new UnassignedTaskCollection();
	app.unassignedTasks = new UnassignedTaskCollection();

	app.gui = new GUI(app.users, app.unassignedTasks, '#app');// selector of main div
});
