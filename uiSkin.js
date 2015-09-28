/*var NavView = Backbone.View.extend({
  tagName:"nav",
  className: "navbar navbar-inverse",
  id: "navbar",
  render: function() {
    //Create DOM elements
    var $container = $('<div class="container-fluid">');
    var $navbarHeader = $('<div class="navbar-header">');
    var $logo = $("<a>").attr({
      href: "#",
      class:"navbar-brand"
    }).text("toDo ||");;

    //Attach DOM elements to their respective parent elements
    $container.append($logo);
    $navbarHeader.append($navbarHeader);
    this.$el.append($container);
    $('body').prepend(this.$el);

    return this
  },
  initialize: function(opts){
    this.render();
  }
});
*/

$(document).ready(function(){

$("#app").addClass("container");

  //$(".jumbotron").css("margin-top","120px");
  //$("#login").css("margin-top","20px");
  //$("#login").css("margin-bottom","120px");

  //$("#login_view").addClass("jumbotron");

  //var nav = new NavView();


var $footer = $('<footer>' , {
  'class' : 'container'
});

var $gif_01 = $('<img>' , {
  "src" : "http://i.giphy.com/z0w3I99Fk9icU.gif"
});

var $gif_02 = $('<img>' , {
  "src" : "http://i.giphy.com/NfeV16w5ZvaaQ.gif"
});

var $gif_03 = $('<img>' , {
  "src" : "http://i.giphy.com/yZ3EUPGxRL5C0.gif"
});

$footer.append($gif_01).append($gif_02).append($gif_03);
$('body').append($footer);





});
