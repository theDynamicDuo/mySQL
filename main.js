var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection();


	app.userTasks = new UserTaskCollection();
	app.unassignedTasks = new UnassignedTasks();

	app.gui = new GUI(app.users, app.userTasks, app.unassignedTasks, '#app');// selector of main div
});
