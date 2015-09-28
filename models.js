var UserModel = Backbone.Model.extend({
	defaults: {
		username: '',
		initialize: function() {
      // this.fetch();
			// this.on("change", this.save, this);
    }
	}
});

// UserModel.prototype.id = (function() {
// 	if(this.id !== undefined) {
// 		return this.id;
// 	} else {
// 		return app.users.models.length;
// 	}
// })();

var TaskModel = Backbone.Model.extend({
	defaults: {
		title: '',
		description: '',
		creator: '',
		assignee: '',
		status: '',
	},
	initialize: function() {
		// this.fetch();
		// this.on("change", this.save, this);
	}
	// Add methods if needed...
});

// TaskModel.prototype.id = (function() {
// 	if(this.id !== undefined) {
// 		return this.id;
// 	} else {
// 		return app.tasks.models.length;
// 	}
// })();

var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url : "/users",
	initialize: function() {
		this.fetch();
	}
});

var TaskCollection = Backbone.Collection.extend({
	model: TaskModel,
	url : "/tasks",
	initialize: function() {
		this.fetch();
	}
});
