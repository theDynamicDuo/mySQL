var UserModel = Backbone.Model.extend({
	defaults: {
		username: '',
		initialize: function() {
      // this.fetch();
			// this.on("change", this.save, this);
    }
	}
});

var UserCollection = Backbone.Collection.extend({
	model: UserModel,
	url : "/users",
	initialize: function() {
		// console.log("initializing");
		this.fetch({ success: function(collection, response, options) {
			// console.log("user response is: ", response);
		},
								error: function(collection, response, options) {console.log("there was an error: ", response);}
		});
		// console.log("you made a new model");
	}
});


var TaskModel = Backbone.Model.extend({
	urlRoot: '/tasks',
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

// var TaskCollection = Backbone.Collection.extend({
// 	model: SharedTaskModel,
// 	url : "/tasks/:",
// 	initialize: function() {
// 		this.fetch({ success: function(collection, response, options) {
// 			console.log("task response is: ", response);
// 		},
// 								error: function(collection, response, options) {console.log("there was an error: ", response);}
// 		});
// 		// console.log("you made a new model");
// 	}
// });

var UserTaskCollection = Backbone.Collection.extend({
	model: SharedTaskModel,
	initialize: function(opts) {
		this.url = "/userTasks/" + opts.username;
		this.fetch({ success: function(collection, response, options) {
			// console.log("task response is: ", response);
		},
								error: function(collection, response, options) {console.log("there was an error: ", response);}
		});
		// console.log("you made a new model");
	}
});

var UnassignedTaskCollection = Backbone.Collection.extend({
	model: SharedTaskModel,
	url : "/unassignedTasks",
	initialize: function() {
		this.fetch({ success: function(collection, response, options) {
			// console.log("task response is: ", response);
		},
								error: function(collection, response, options) {console.log("there was an error: ", response);}
		});
		// console.log("you made a new model");
	}
});
