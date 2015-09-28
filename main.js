var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection();

	// app.users = new UserCollection([
	// 	{username:'Sparky'},
	// 	{username:'Skippy'},
	// 	{username:'Arturo'}
	// ]);

	app.tasks = new TaskCollection();

	// app.tasks = new TaskCollection([
	// 	{
	// 		title:'Steal Redvines',
	// 		description:'Run from coppers',
	// 		creator:'Skippy',
	// 		assignee:'',
	// 		status:'Unassigned'
	// 	},
	// 	{
	// 		title:"The big bug",
	// 		description:"don't break",
	// 		creator: "Sparky",
	// 		assignee:"",
	// 		status:"Unassigned"
	// 	},
	// 	{
	// 		title:'broken one',
	// 		description:'this one is broken',
	// 		creator:'Skippy',
	// 		assignee:'Skippy',
	// 		status:'Assigned'
	// 	},
	// 	{
	// 		title:'Something',
	// 		description:'Something else',
	// 		creator:'Anyone',
	// 		assignee:'Skippy',
	// 		status:'Assigned'
	// 	},
	// 	{
	// 		title:'Give Redvines',
	// 		description:'Hi five coppers',
	// 		creator:'Evil Abe',
	// 		assignee:'',
	// 		status:'Unassigned'
	// 	},
	// 	{
	// 		title:'Write a book',
	// 		description:'finish it before i die(GRRM)',
	// 		creator:'Kanye East',
	// 		assignee:'Arturo',
	// 		status:'Assigned'
	// 	}
	// ]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
});
