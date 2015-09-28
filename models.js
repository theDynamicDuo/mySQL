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
		// console.log("initializing");
		this.fetch({ success: function(collection, response, options) {
			console.log("user response is: ", response);
		},
								error: function(collection, response, options) {console.log("there was an error: ", response);}
		});
		// console.log("you made a new model");
	}
});

var TaskCollection = Backbone.Collection.extend({
	model: TaskModel,
	url : "/tasks",
	initialize: function() {
		this.fetch({ success: function(collection, response, options) {
			console.log("task response is: ", response);
		},
								error: function(collection, response, options) {console.log("there was an error: ", response);}
		});
		// console.log("you made a new model");
	}
});
