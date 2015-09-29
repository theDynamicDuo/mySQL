var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection();


	// app.userTasks = new UserTaskCollection();
	// app.unassignedTasks = new UnassignedTaskCollection();
	app.userTasks = new TaskCollection();
	app.unassignedTasks = new TaskCollection();

	app.gui = new GUI(app.users, app.userTasks, app.unassignedTasks, '#app');// selector of main div
});
