var debug = 1;
function _log(s){
	if (debug){
		console.log(s);
	}
	return false;
}

//check the support of local storage
local_storage = 0;
if(typeof(Storage) !== "undefined") {
    local_storage = 1;
}else{
	alert("Your browser doesn't support localStorage, please update your window to the internet");
}

var curr_page = 1;
function renderProjects(_data){
	_log('Render page: '+curr_page);
	if (_data.projects.length > 0 ){
        for (var i in _data.projects) {
        	p = _data.projects[i];
            var owners = new Array();
            html_template = $(tpl).eq(0).clone();
            if (curr_page > 1){
            	$(html_template).hide();
        	}else{
        		$(html_template).show();
        	}

            var params = {id:p.id , name:p.name };
            var url = 'project.html?'+$.param(params);

            $("a.project_link", html_template).attr("href", url);

            var _cover = 0;
            for (var size in p.covers){
            	if ( size > _cover ){_cover = size;}
            }
            //cover
            $("img.cover", html_template).attr("src", p.covers[_cover] );
            //name
            $(".name", html_template).html(p.name);
            //owners
            for (var o in p.owners){
                owners[o] = "<a href='"+p.owners[o].url+"' class='accent-txt'>" + p.owners[o].display_name +"</a>";
            }
            $(".owners", html_template).html(owners.join(', '));
            //tags - fields
            $(".fields", html_template).html(p.fields.join(', '));

            $(".projects").append(html_template);

            $(html_template).attr('page', 'page_'+curr_page);
            //stats
            // for (var o in p.stats){
            //     var stat = "<span class='"+o+"'><i class='accent-txt'></i>" + p.stats[o] + "&nbsp;" + o +"</span>";
            //     $(".stats", html_template).prepend(stat);
            // }
        }
        var elems_faded_in = 0;

        if (curr_page === 1){
        	$("#loader").fadeOut();
        	_log('fade in complete page: '+curr_page);
	        $(tpl).eq(0).remove();
	        curr_page ++;
	        is_loading_projects = false;
        }else{
        	setTimeout(function(){
	        	$("#loader").fadeOut();
	        	$('[page=page_'+curr_page+']')
		        .fadeIn('slow', function(){
		        	elems_faded_in ++;
		        	if( elems_faded_in == _data.projects.length ){
		        		_log('fade in complete page: '+curr_page);
				        curr_page ++;
				        is_loading_projects = false;
		        	}
		        });
	        }, 300);
        }
    }else{
    	$("#loader").fadeOut();
    }
}

var render,_data, html_template,tpl,b_data;


$(function() {
	if ( $('body[id!=""]').length == 1 ){
		render = $('body').attr('id');
	}else{
		render = location.pathname.match(/(\w+\.\w+)/g);
	}
	_log(render);

	if (render.match(/(index)/g)){
		_data, html_template;
		tpl = '.project';

			if ( $(tpl).length == 0 ){
				//verify template
				alert("Our awesome proyect template doesn't exists, please add a '"+tpl+"' template");
				return false;
			}
			if ( !user_id  ){
				alert("Plase setup your 'user_id' in be-settings.js");
				return false;
			}
			if ( !behance_api_key  ){
				alert("The 'behance_api_key' is not present, please review be-settings.js");
				return false;
			}
			$('#loader, .project').hide();
			//where the magic happens
			fetchUserProjects(curr_page);
	}
	if (render.match(/(project)/g)){
		tpl = '.project_c';
		var p_id = getUrlVar('id');

		if ( $(tpl).length == 0 ){
			//verify template
			alert("Our awesome proyect template doesn't exists, please add a '"+tpl+"' template");
		}else{
			be.project(p_id, function(d){
			    b_data = d;
			    if (b_data.project){

		            var owners = new Array();
		            p = b_data.project;
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
		            //behance link
		            $('a.gotobehance').attr('href', p.url);

		            //comments
		            be.project.comments(p_id, {},  function(d){
		            	if( d.comments.length > 0 ){
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
			            }else{
			            	$('.comments-box').hide();
			            }
			        });

			    }
			});
		}
	}
});



function renderSocialLink(elem){
	if ( $('nav').length > 0 ){
		var new_link = $('<a href="" target="_blank" class="accent-txt"></a>');
		$(new_link).attr('href', elem.url).html(elem.service_name)
		if ( elem.url.match( /(mailto:)/g ) ){
			$(new_link).removeAttr('target');
		}
		$('nav').append($(new_link));
	}
	return false;
}

function renderUser(_user_data){
	if ( _user_data.http_code == 200 ){

		//avatar image
		if ( $('div.avatar').length > 0 ){
			$('div.avatar > img').attr('src', _user_data.user.images[115]);
		}
		//username
		if ( $('.username > a').length > 0  ){
			$('.username > a').html(_user_data.user.display_name);
		}
		$('title').text(_user_data.user.display_name);

		//userdescription
		if ( $('.userdescription').length > 0  ){
			$('.userdescription').html(_user_data.user.occupation);
		}
		//social links
		for( var i in _user_data.user.social_links ){
			renderSocialLink( _user_data.user.social_links[i] );
		}
		//extra links
		for ( var i in extra_links ){
			if ( !extra_links[i].url.match( /(\/\/)/g ) && ! extra_links[i].url.match( /(mailto:)/g ) ){
				extra_links[i].url = '//'+extra_links[i].url;
			}
			renderSocialLink(extra_links[i]);
		}
	}
	return false;
}

function fetchUserData(){
	be.user(user_id, function(d){
		localStorage.setItem("user_data", JSON.stringify(d) );
		localStorage.setItem("user_data_updated", Date.now() );
		renderUser(d);
	});
	return false;
}
var no_more_projects = false;

function fetchUserProjects(_curr_page){
	is_loading_projects = true;

	if(!no_more_projects){
		$("#loader").fadeIn();
	}

	var passed_hrs = Math.floor( (Date.now() - localStorage['user_projects_'+curr_page+'_updated']) / 1000 / 60 / 60);

	if ( local_storage && localStorage["user_projects_"+_curr_page] && passed_hrs < 3 ){
		b_data = JSON.parse( localStorage["user_projects_"+_curr_page] );
		renderProjects(b_data);
	}else{
		_log('loading page: '+_curr_page+'...');
		be.user.projects(user_id, {page:_curr_page}, function(d){
			_log('page loaded: '+_curr_page);
			if ( d.projects.length > 0 && !no_more_projects ){
		    	b_data = d;
		    	if ( local_storage ){
				    localStorage.setItem('user_projects_'+_curr_page, JSON.stringify(d) );
					localStorage.setItem('user_projects_'+_curr_page+'_updated', Date.now() );
				}
				renderProjects(b_data);
			}else{
				no_more_projects = true;
				$("#loader").fadeOut();
			}
		});
	}
	return false;
}

function renderUserCall(){
	if (user_id){
		if (local_storage){
			if ( !localStorage.user_data ){
				fetchUserData();
			}else{
				//caceh time 1hr
				passed_hrs = Math.floor( (Date.now() - localStorage.user_data_updated) / 1000 / 60 / 60);
				if ( passed_hrs > 1 ){
					//updating local data
					fetchUserData();
				}else{
					//using local data
					renderUser(JSON.parse( localStorage.user_data ));
				}
			}

		}else{
			be.user(user_id, function(d){
				renderUser(d);
			});
		}

	}
}


$(function(){
	renderUserCall();
});

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	return result && unescape(result[1]) || "";
}

//fixed nav
var is_loading_projects = false;
$(document).ready(function(){

  	$(window).scroll(function () {
	    if ($(window).scrollTop() > 350) {
	  		$('#sticky').addClass('is-on');
	  	}
	  	else {
	  		$('#sticky').removeClass('is-on');
	  	}
	  	if (render.match(/(index)/g)){
	 	 	//bottom scroll loads more items
	  		if( $(window).scrollTop() + $(window).height() >= ($(document).height() - 30)) {
	  			_log('is_loading_projects:' +is_loading_projects);
	  			if (!is_loading_projects){
	   				fetchUserProjects(curr_page);
	   			}
			}
		}
  	});
});
