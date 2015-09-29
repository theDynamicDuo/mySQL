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

// var UserTaskCollection = Backbone.Collection.extend({
// 	model: TaskModel,
// 	url : "/userTasks",
// 	initialize: function() {
// 		this.fetch({ success: function(collection, response, options) {
// 			console.log("task response is: ", response);
// 		},
// 								error: function(collection, response, options) {console.log("there was an error: ", response);}
// 		});
// 		// console.log("you made a new model");
// 	}
// });
//
// var UnassignedTaskCollection = Backbone.Collection.extend({
// 	model: TaskModel,
// 	url : "/unassignedTasks",
// 	initialize: function() {
// 		this.fetch({ success: function(collection, response, options) {
// 			console.log("task response is: ", response);
// 		},
// 								error: function(collection, response, options) {console.log("there was an error: ", response);}
// 		});
// 		// console.log("you made a new model");
// 	}
// });
var allModels = {};

var SharedTaskModel = function(attrs) {
	if (('id' in attrs) && allModels[attrs.id]) {
		//already got one, reuse it:
		return allModels[attrs.id];
	} else {// don't have one, make it:
		var model = new TaskModel(attrs);
		if ('id' in attrs) {
			allModels[attrs.id] = model;
	}
	return model;
	}
};

var TaskCollection = Backbone.Collection.extend({
	model: SharedTaskModel,
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
