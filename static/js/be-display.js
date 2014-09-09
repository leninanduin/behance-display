if (render == 'projects_list'){
	var b_data, html_template;
	var tpl = '.project';

	$(function() {
		if ( $(tpl).length == 0 ){
			//verify template
			alert("Our awesome proyect template doesn't exists, please add a '"+tpl+"' template");
		}if ( !user_id  ){

		}else{
			be.user.projects(user_id, {}, function(d){
			    b_data = d;
			    if (b_data.projects.length > 0 ){
			        for (var i in b_data.projects) {
			            var owners = new Array();

			            p = b_data.projects[i];
			            html_template = $(tpl).eq(0).clone();

			            var params = {id:p.id , name:p.name };
			            var url = 'project.html?'+$.param(params);

			            $("a.project_link", html_template).attr("href", url);
			            //cover
			            $("img.cover", html_template).attr("src", p.covers[404]);
			            //name
			            $(".name", html_template).html(p.name);
			            //owners
			            for (var o in p.owners){
			                owners[o] = "<a href='"+p.owners[o].url+"' class='accent-txt'>" + p.owners[o].display_name +"</a>";
			            }
			            $(".owners", html_template).html(owners.join(', '));
			            //tags - fields
			            $(".fields", html_template).html(p.fields.join(', '));
			            //stats
			            $(".projects").append(html_template);
			            //stats
			            for (var o in p.stats){
			                var stat = "<span class='"+o+"'><i class='accent-txt'></i>" + p.stats[o] + "&nbsp;" + o +"</span>";
			                $(".stats", html_template).prepend(stat);
			            }
			        }
			        $(tpl).eq(0).remove();
			    }
			});
		}
	});
}

if (render == 'project'){
	var b_data, html_template;
	var tpl = '.project_c';
	var p_id = getUrlVar('id');

	$(function() {
		if ( $(tpl).length == 0 ){
			//verify template
			alert("Our awesome proyect template doesn't exists, please add a '"+tpl+"' template");
		}else{
			be.project(p_id, function(d){
			    b_data = d;
			    if (b_data.project){

		            var owners = new Array();

		            p = b_data.project;

		         //    if(b_data.project.styles.background){
		         //    	$('body').css('background', '#'+b_data.project.styles.background.color);
		        	// }

		            html_template = $(tpl);
		            //name
		            $(".name", html_template).html(p.name);
		            //desc
		            $(".description", html_template).html(p.description);
		            //owners
		            for (var o in p.owners){
		                owners[o] = "<a href='"+p.owners[o].url+"' class='accent-txt'>" + p.owners[o].display_name +"</a>";
		            }
		            $(".owners", html_template).html(owners.join(', '));

		            //fields
		            $(".fields", html_template).html(p.fields.join(', '));

		            //fields
		            $(".tags", html_template).html(p.tags.join(', '));

		            //stats
		            $(".projects").append(html_template);
		            //modules - images
		            if ( $(".modules", html_template) ){
			            for (var o in p.modules){
			            	var module_template = $(".modules li ", html_template).eq(0).clone();
			            	$("img", module_template ).attr('src', p.modules[o].src);
			                $(".modules", html_template).append(module_template);
			            }
			            $(".modules li ", html_template).eq(0).remove();
			        }
		            //stats
		            for (var o in p.stats){
		                var stat = "<span class='"+o+"'><i class='accent-txt'></i>" + p.stats[o] + "&nbsp;" + o + "</span>";
		                $(".stats", html_template).append(stat);
		            }
		            //comments
		            be.project.comments(p_id, {},  function(d){
		            	for (var i in d.comments ){
		            		var comment = d.comments[i];

		            		var comment_template = $('.comments_c li',html_template ).eq(0).clone();
		            		//user avatar
		            		$("img",comment_template).attr('src', comment.user.images[50] );
		            		//user name
		            		$('.user_name', comment_template).text( comment.user.display_name );
		            		//date on
		            		var date_on = new Date(comment.created_on*1000);
		            		var date_str = date_on.toUTCString('dddd MMM yyyy h:mm').substring(0, 22);
		            		console.log();
							$('.date_on', comment_template).text( date_str );

		            		//comment
		            		$('.comment', comment_template).text( comment.comment );

		            		$('.comments_c',html_template).append(comment_template);
		            	}
		            	$('.comments_c li',html_template ).eq(0).remove();
		            });

			    }
			});
		}
	});
}

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	return result && unescape(result[1]) || "";
}
