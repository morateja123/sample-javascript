/*globals $ ObInject ajax textify formValidationEngine*/
/////////////////////OBINJECT ///////////////////
var isBrowserIE = '\v' == 'v';
var xMenuPos;
var yMenuPos;
var xMenuWidth;
var yMenuHeight;
var menus = [];
var isHidingMenu = false;
var const_image_root = const_image_root || "/resources/style/obinject";
var felms = [];
var felm_intervals = [];
var errelms = [];
var lists = [];
var list_intervals = [];
var list_handlers = [];
var list_scrollIndex = [];
var menu_handlers = [];
var handlers = [];
var released_elements = [];
var st3h = 0;
var st3elmid = null;

var slideid = 0;
var lindex = 0;
var sindex = 0;
var doing_hide_menu = false;
var divBounds = null;
var active_menu = null;
var dont_hide_menu = false;
var menu_activated = false;
setTimeout(function () {
	menu_activated = true;
}, 100);
var taHeight = 0;
var taIndex = 1;
var taMenuID = null;
var enIndex = 10;
var elms = [];
var drawing_menu = false;
var bypass_menu = false;
var menuParams = [];
var exArray = [];
var tabIndecies = 0;
var dd_menus = [];
var ajaxid = 0;
var ajaxelm = [];
var xml_http = null;
var ajax_active = [];
/* transitions */
var TRANSITION_INTERVAL = 15;
/* menu */
var doBounds = false;
var element_queue = [];
var TRANSITION_LEFT = 0;
var TRANSITION_RIGHT = 1;
var TRANSITION_TOP = 2;
var TRANSITION_BOTTOM = 3;
var TRANSITION_FADEIN = 4;
var TRANSITION_FADEOUT = 5;
var popup_showing = false;
var dont_hide = true;
var ogWidth;
var ogHeight;
var ogOffsetWidth;
var ogOffsetHeight;
var popupInterval = null;
var popupLoaded = false;
var active_popup_elm = null;
var elmParents = [];
var menuPos, menuParent, menuParentPos;
var obInjects = [];

function _appendEvent(elmid, eventName, hindex) {

	var elm = null;
	if (typeof elmid == "string") {
		if (elmid == 'dbody') {
			try {
				elm = document.body;
			} catch (e) {
				elm = document.createElement("body");
			}
		} else {
			elm = document.getElementById(elmid);
		}
	} else {
		elm = elmid;
	}
	var handlerName = handlers[hindex];

	if (elm == null) {
		return;
	}
	if (elm.addEventListener) {
		elm.addEventListener(eventName.replace(/on/gi, ''), handlerName, false);
	} else if (elm.attachEvent) {
		elm.attachEvent(eventName, handlerName);
	} else {
		elm[eventName] = handlerName;
	}
	// elm.setAttribute(eventName, handlerName);
	menu_handlers[elmid] = handlerName;
	// alert(elm.getAttribute("onmouseover"))
}

function appendEvent(elmid, eventName, handlerName) {

	var hindex = handlers.length;
	handlers[hindex] = handlerName;
	// var str = "_appendEvent('"+elmid+"', '"+eventName+"', "+hindex+");";
	// alert(str);

	// setTimeout(str, 1);

	setTimeout(function () {
		_appendEvent(elmid, eventName, hindex);
	}, 1);

}
ObInject.prototype.appendEvent = function (eventType, handlerName) {
	appendEvent(this.elmid, eventType, handlerName);
	return this;
};

function FormElement() {
	this.datatype = null;
	this.length = null;
	this.required = false;
}

// ????setTimeout(function() {try{_pageload();} catch(e){};}, 300);

function __(elmid) {
	var obInject = null;
	if (obInjects[elmid] != null) {
		obInject = obInjects[elmid];
	} else {
		obInject = new ObInject(elmid);
		obInjects[elmid] = obInject;
	}
	return obInject;
}

function ObInject(elmid) {
	this.elmid = elmid;
}

/* ajax */
ObInject.prototype.ajax = function (url, append, postscript) {
	ajax(this.elmid, url, null, postscript, append);
	return this;
};


function DropDownMenuItem(title, url, isForm, icon) {
	var max_title_len = 30;
	if (title.length > max_title_len) {
		title = title.substr(0, max_title_len);
		title = title + '...';
	}
	title = textify(title);
	this.title = title.toUpperCase();
	this.url = url;
	this.isForm = isForm; 
	this.icon = icon;
}

function handleMenuSelection(e, elm_id) {
	alert(e.keyCode);
}

function findTop(obj, doall) {
	var oObj = obj;
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			if (obj.id != 'Content-Wide' && obj.id != 'Content' && obj.id != 'Content-Widest' || doall) {
				//alert(obj.tagName + " - " + obj.offsetTop + " - " + obj.id);
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
		} while (obj = obj.offsetParent);
	}

	var contentPanel = document.getElementById("contentPanel");
	if (contentPanel != null && isBrowserIE) {
		// curtop = curtop - contentPanel.offsetTop;
	}
  
	if (contentPanel != null && contentPanel.scrollTop != 0) {
		curtop -= contentPanel.scrollTop;
	}
	return curtop;
}

function findLeft(obj, doall) {
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			// alert(obj.tagName + " - " + obj.offsetTop + " - " + obj.id);
			if (obj.id != 'Header' && obj.id != 'Footer' && obj.id != 'Content-Wide' && obj.id != 'Content' && obj.id != 'Content-Widest' || doall) {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
		} while (obj = obj.offsetParent);
	}
	return curleft;
}

function _hide_menu(menu) {
	var the_menu = menu;
	$(the_menu).trigger('hidden').attr("aria-expanded", "false");
	if (the_menu != null) {
		isHidingMenu = true;
		$(the_menu).height(0).width(0);
		for (var e in elms) {
			var elm = elms[e];
			//elm.style.position = 'static';
			$(elm).css('position', 'static');
		}
		elms = [];
		for (var i in menus) {
			var m = menus[i];
			if ($(m).length > 0) {
				$(m).css('height', 0).css('width', 0);
	            //$(m).height(0).width(0);
	        }
	        if (the_menu != null && m.id == the_menu.id) {
				the_menu = null;
			}
		}
		if (the_menu != null) {
			menus[menus.length] = the_menu;
		}
		var elmId = ($(menu).attr("id")).replace(/_menu/gi, '');
		if ($('#' + elmId).length > 0) {
			if (document.getElementById(elmId).getAttribute("rounded")) {
				xMenuPos = xMenuPos - 3;
				var parent_div = $('#' + elmId).closest("[id^='rounded_container']");
				if ($(parent_div).hasClass('bluemenu')) {
					// don't reset color if it's a blue menu
				} else if (document.getElementById(elmId).getAttribute("rounded-color") != null) {
					$("." + elmId + "_border").css("border-color", document.getElementById(elmId).getAttribute("rounded-color"));
					$("." + elmId + "_border").css("border-bottom-width", "1");
					$("." + elmId + "_borderBackground").css("background-color", document.getElementById(elmId).getAttribute("rounded-color"));
				}
	
				if (document.getElementById("rounded_container_" + elmId + "").offsetWidth > xMenuWidth) {
					xMenuWidth = document.getElementById("rounded_container_" + elmId + "").offsetWidth;
				}
			}
		}

		isHidingMenu = false;
	}
	the_menu = null;
  
	var menu_parent = $(menu).closest('.menu_parent');
	if ($(menu_parent).length > 0) {
		$(menu_parent).removeClass('menu_parent_active');
	}
}

function hide_menu(menu, explicit, e) {
    if (doing_hide_menu) {
    	return;
    }
    doing_hide_menu = true;
	if (menu == null) {
		// return;
		menu = active_menu;
		if (menu == null) {
			// return;
		}
	} else {
		if (explicit) {
			_hide_menu(menu);
		}
	}
	if (menu == null) {
		doing_hide_menu = false;
		return;
	}
	if (e == null) {
		doing_hide_menu = false;
		return;
	}
	var xMousePos = e.clientX + document.body.scrollLeft;
	var yMousePos = e.clientY + document.body.scrollTop;
	var xMousePosMax = document.body.clientWidth + document.body.scrollLeft;
	var yMousePosMax = document.body.clientHeight + document.body.scrollTop;
	var contentPanel = document.getElementById("contentPanel");
	if (contentPanel != null && contentPanel.scrollTop != 0) {
		yMousePosMax -= contentPanel.scrollTop;
	}
	var boundTop = yMenuPos - 30;
	var boundBottom = yMenuPos + yMenuHeight + 5 + 30;
	var boundLeft = xMenuPos - 15;
	var boundRight = xMenuPos + xMenuWidth + 30;
	if (doBounds) {
		if (divBounds == null) {
			divBounds = document.createElement("div");
			divBounds.style.zIndex = '8888';
			document.body.appendChild(divBounds);
		}
		divBounds.style.border = '1px solid red';
		divBounds.style.position = 'absolute';
		divBounds.style.top = (yMenuPos - 30) + 'px';
		divBounds.style.left = boundLeft + 'px';
		divBounds.style.width = (xMenuWidth + 30) + 'px';
		divBounds.style.height =  (yMenuHeight + 30 + 5 + 30) + "px";
	}


	if (xMousePos > boundLeft && xMousePos < boundRight && yMousePos > boundTop && yMousePos < boundBottom) {
		if (doBounds) {
			divBounds.style.display = '';
		}
	} else {
		if (doBounds) {
			divBounds.style.display = 'none';
		}
		_hide_menu(menu);
	}
	active_menu = null;
	doing_hide_menu = false;

}


function _show_menu(menu, isstart, expl) {
	menu.inMenuTerritory = false; 
	menu.inTitleTerritory = false;
	taIndex = 1;
	$(menu).attr("aria-expanded", "true");
	if (bypass_menu) {
		return;
	}
    if (expl == null) {
        expl = false;
    }
    if (!expl && (active_menu == null || menu.id != active_menu.id)) {
        taHeight = 0;
        return;
    }
    if (isstart) {
    	$(menu).css("overflow-y", "visible");
        taHeight = $(menu).children(":first").outerHeight();
        if (exArray[active_menu.id] != null) {
            eval(exArray[active_menu.id]);
        }
        if (taHeight < 20) {
            try {
                if (menu.childNodes[0].offsetHeight != null) {
                	taHeight = menu.childNodes[1].offsetHeight > menu.childNodes[0].offsetHeight ? menu.childNodes[1].offsetHeight : menu.childNodes[0].offsetHeight;
                } else {
                	taHeight = menu.childNodes[1].offsetHeight;
                }
            } catch (e) {
                if (taHeight < 20) {
                    try {
                    	taHeight = menu.childNodes[1].offsetHeight;
                    } catch (e2) {
                        taHeight = menu.childNodes[0].offsetHeight;
                    }
                }
            }
        }
        if (taHeight == 0) { 
        	return;
        }
        menuPos = $(menu).offset();
		menuParent = $("#" + ($(menu).attr("id")).replace(/_menu/gi, ''));
		menuParentPos = menuParent.offset();
        xMenuPos = menuParentPos.left;
        yMenuPos = menuParentPos.top + menuParent.height();
		if ($.browser.msie) {
			yMenuPos -= 3;
		}
        xMenuWidth = $(menu).children(":first").outerWidth();
        yMenuHeight = taHeight;
        var elmId = ($(menu).attr("id")).replace(/_menu/gi, '');
        if ($("#" + elmId).attr("rounded")) {
            xMenuPos = xMenuPos - 3;
            if ($("#rounded_container_" + elmId).width() >= xMenuWidth) {
            	xMenuWidth = $("#rounded_container_" + elmId).width();
                $("#menu_top_border_right_" + elmId).css("display", "");
            } else {
                $("#menu_top_border_right_" + elmId).css("display", "");
            }
            if ($("#tdmenuborder_" + elmId).length > 0 && $("#tdmenuborder_" + elmId).css("borderColor") != null && $("#tdmenuborder_" + elmId).css("borderColor") != "") {
                $("#menu_top_border_left_" + elmId).width($("#rounded_container_" + elmId).width() - 2);
                $("#menu_menu_top_border_right_" + elmId).css("background", $("#tdmenuborder_" + elmId).css("border-color"));
            	$("#tdmenuborder_" + elmId).css("border-color", $("#tdmenuborder_" + elmId).css("border-color"));
            	/*
				 * $("." + elmId + "_border").css({ "border-color" :
				 * $("#tdmenuborder_"+elmId).css("border-color") ,
				 * "border-bottom": 0 });
				 */
            	$("." + elmId + "_borderBackground").css("background-color", $("#tdmenuborder_" + elmId).css("border-color"));
            }
        }
        if (menuParams[elmId] != null) {
        	if (menuParams[elmId].position == 'right') {
        		if ($('#rounded_container_' + elmId).length > 0) {
        			var parent_elm_id = 'rounded_container_' + elmId;
        			xMenuPos = $('#' + parent_elm_id).position().left;
        		}
        		else {
                    xMenuPos = xMenuPos - xMenuWidth + document.getElementById(elmId).offsetWidth;
                    if ($("#" + elmId).attr("rounded") == "true") {
                    	xMenuPos += (isBrowserIE?16:15);
                    }
                    xMenuPos += 3;
        		}
        	} else {
                xMenuPos = xMenuPos + menuParams[elmId].offset;
        	}
        } else {
        }
		if ($('#rounded_container_' + elmId).length > 0) {
			xMenuWidth = $('#rounded_container_' + elmId).outerWidth();
		}
		// i-anchor
		// check for positioned parent and modify positioning accordingly
	      positioned_parent = $(menu).offsetParent().get(0);
	      padded_parent_left = $('#rounded_container_' + elmId).css('padding-left').replace(/[^-\d\.]/g, '');
	      positioned_parent_left = findLeft(positioned_parent);
	      positioned_parent_top = findTop(positioned_parent); // Get parent left position
	      
	      xMenuPos = xMenuPos-positioned_parent_left-padded_parent_left;
	      yMenuPos = yMenuPos-positioned_parent_top-padded_parent_left;
	      // end i-anchor
        $(menu).width(xMenuWidth).height(0).css({
				left : xMenuPos + "px",
				overflowY : "hidden",
				visibility : "visible",
				top: yMenuPos + "px"
			});
		$("table:first", menu).mouseenter(function (e) {
				menu.inMenuTerritory = true;
			})
			.mouseleave(function (e) {
				menu.inMenuTerritory = false;
				setTimeout(function () { 
					if (!menu.inTitleTerritory) {
						hide_menu(menu, true, e);
					}
				}, 50);
			});
		($("#" + elmId).closest("[id^='rounded_container']"))
			.mouseleave(function (e) {
				menu.inTitleTerritory = false;
				setTimeout(function () { 
					if (!menu.inMenuTerritory) {
						hide_menu(menu, true, e);
					}
				}, 50);
			})
			.mouseenter(function (e) {
				menu.inTitleTerritory = true;
			});
        
        taMenuID = $(menu).attr("id");
    }
    if (taMenuID != $(menu).attr("id")) {
        return;
    }
    taIndex ++;

    var finalGrowHeight = taIndex + (taIndex * taIndex * taIndex);
    var finalHeight = (taHeight + enIndex);
    var maxMenuHeight = 260;
    if (finalGrowHeight >= maxMenuHeight) {
    	finalGrowHeight = maxMenuHeight;
    	$(menu).css("overflow-y", 'auto');
    }
    if (finalHeight >= maxMenuHeight) {
    	finalHeight = maxMenuHeight;
    	$(menu).css("overflow-y", 'auto');
    }
	
    $(menu).height(finalHeight -= 11);
    if (menu.offsetHeight >= finalHeight) {
        $(menu).height(finalHeight);
        var timeout = 0;
        for (var i = 0; i < enIndex; i++) {
            setTimeout(function () {
            	$(menu).height(finalHeight - i);
            }, 25 * i);
            timeout = i + 1;
        }
        if (menu.offsetHeight >= maxMenuHeight) {
        	setTimeout(function () {
            	$(menu).css("overflow-y", 'scroll').height(maxMenuHeight);
        	}, 25 * (timeout + 1));
        }
        taIndex = 1;

        return;
    }
    /*
	 * i-anchor !!!!! BIG CHANGE - REVERT IF DROPDOWN FAIL !!!!! setting menu
	 * height to auto so it adjusts itself
	 */
    var theight = $($(menu).find('TABLE')[0]).height();
    $(menu).css('height', 'auto');
    // get table height
    var maxtheight = 155;
    var tablewidth = $($(menu).find('TABLE')[0]).outerWidth();
    if (tablewidth < xMenuWidth) {
    	tablewidth = xMenuWidth;
    }
    $(menu).css('width', tablewidth + 'px');
    if (theight > 155) {
        $(menu).css('height', 155 + 'px');
        $(menu).css('overflow-y', 'auto');
        $(menu).css('overflow-x', 'hidden');
        $(menu).css('width', tablewidth + 15 + 'px');
    }
    // set background color to border color (IE has a gap on bottom left)
    $(menu).css('background', $("#tdmenuborder_" + elmId).css("border-left-color"));
}

function show_menu(menu, elm, cancelwidth) {
	var $menu = $(menu), $active_menu = $(active_menu);
	if (menu == null) {
		return;
	}
    if (cancelwidth == null) {
        cancelwidth = false;
    }
    st3h = 0;
    if (!menu_activated) {
        return;
    }
	if (active_menu == null || $active_menu.attr("id") != $menu.attr("id")) {
		/*
		 * $(".dd_menu:not(#"+ $menu.attr("id") +")").each(function(){
		 * hide_menu(this,true); });
		 */
		active_menu = menu;
		var xMousePosMax = document.body.clientWidth + document.body.scrollLeft;
		var yMousePosMax = document.body.clientHeight + document.body.scrollTop;
		if (elm != null && cancelwidth != true) {
			$(menu).width(elm.offsetWidth + 2);
		}
		slideid ++;
		if (menu.offsetLeft + menu.offsetWidth > (xMousePosMax - 20)) {
			$(menu).css("left", (xMousePosMax - (menu.offsetWidth + 30)) + 'px');
		}
		var contentPanel = document.getElementById("contentPanel");
		if (contentPanel != null && contentPanel.scrollTop != 0) {
			yMousePosMax -= contentPanel.scrollTop;
		}
		$(menu).css("top", yMousePosMax + 'px');
		$(menu).attr({
			"role": "listbox",
			"tabindex": "-1",
			"aria-expanded": "false"
		});
		_show_menu(menu, true);
	}
}


function DropDownMenu(elm_id) {
	this.menus = [];
	this.elm_id = elm_id;
	this.elm = document.getElementById(elm_id);
	if (this.elm == null) {
		return;
	}
	this.menu_elm = document.createElement("DIV");
	this.menu_elm.id = elm_id + "_menu";
	this.menu_elm.className = "dd_menu";
	this.elm.appendChild(this.menu_elm);
	var ex = "document.getElementById('" + elm_id + "_menu').style.left=findLeft(document.getElementById('" + elm_id + "')) + 'px';";
	ex += "document.getElementById('" + elm_id + "_menu').style.top=findTop(document.getElementById('" + elm_id + "'))+(document.getElementById('" + elm_id + "').offsetHeight-1) + 'px';";
    exArray[elm_id + "_menu"] = ex;
    // i-anchor
    // check for positioned parent and modify positioning accordingly
    positioned_parent = $(this.elm).offsetParent().get(0);
    positioned_parent_left = findLeft(positioned_parent);
    positioned_parent_top = findTop(positioned_parent);
    this.menu_elm.style.left = findLeft(this.elm)-positioned_parent_left + 'px';
    this.menu_elm.style.top = (findTop(this.elm)-positioned_parent_top + (this.elm.offsetHeight)) + 'px';
    // end i-anchor
    this.menu_elm.style.zIndex = "99999";
    this.menu_elm.style.position = 'absolute';
    
    var tblA = document.createElement("table");
    this.menu_elm.appendChild(tblA);
    tblA.className = 'dd_menu_tbl';
    var tbl = document.createElement("tbody");
    tblA.appendChild(tbl);
    tblA.width = "100%";
    tblA.border = 0;
    tblA.cellspacing = "0";
    tblA.cellpadding = "0";
    tblA.style.borderCollapse = "collapse";
    tblA.style.borderSpacing = "0";
	var row = document.createElement("TR");    
	tbl.appendChild(row);
	row.className = "dd_menu_bg menurow_" + elm_id;
	var td = document.createElement("TD");
	row.appendChild(td);
	td.className = "dd_menu_item_list menuborder_" + elm_id;
	td.id = "tdmenuborder_" + elm_id;
	td.vAlign = "top";
    this.tbl_itemsA = document.createElement("table");
    this.tbl_items = document.createElement("tbody");
    this.tbl_itemsA.appendChild(this.tbl_items);
    this.tbl_itemsA.style.borderCollapse = "collapse";
    this.tbl_itemsA.style.borderSpacing = "0";
    this.tbl_items.style.borderCollapse = "collapse";
    this.tbl_items.style.borderSpacing = "0";
    // this.tbl_itemsA.style.margin = "-1px";
    this.tbl_itemsA.style.height = "100%";
    this.tbl_itemsA.style.width = "100%";
	this.tbl_itemsA.cellSpacing = "0";
	this.tbl_itemsA.cellPadding = "0";
	td.appendChild(this.tbl_itemsA);
	row = document.createElement("TR");
	this.tbl_items.appendChild(row);
	td = document.createElement("td");
	row.appendChild(td);
	td.style.padding = 0;
	$(td).html("<table width=100% cellspacing=0 cellpadding=0 class=zero><tr><td class=zero><img id='menu_top_border_left_" + elm_id + "' src=/resources/static/images/spacer.gif width=1 height=1></td><td class=zero width='100%' style=';display:none;' id='menu_top_border_right_" + elm_id + "'><img src='/resources/static/images/spacer.gif' height=1></td></tr></table>");
	row = document.createElement("TR");
	this.tbl_items.appendChild(row);
	row.id = elm_id + "_menuw";
	td = document.createElement("TD");
	row.appendChild(td);
	td.height = "1";
	$(td).html("&nbsp;");
	td.className = 'zero';
	td.style.fontSize = '0';
	td.style.padding = '0';
	td.style.lineHeight = '5px';
	row = document.createElement("TR");
	tbl.appendChild(row);
    td = document.createElement("TD");
    row.appendChild(td);
    td.style.padding = "0";
    td.className = 'zero dd_menu_bottom menuborder_' + elm_id;
    td.height = "1";
    
	// i-anchor
	var toggle_elm = $("#" + elm_id);
	var elm_closest_td = $(toggle_elm).closest('TD');
	if ($(elm_closest_td).next(".round_text").length > 0) {
		toggle_elm = $(toggle_elm).closest("[id^='rounded_container']");
	}
	$(toggle_elm).addClass('menu_parent');
	$(toggle_elm).mouseover(function () {
		$(this).addClass('menu_parent_active');
		show_menu($("#" + elm_id + "_menu"), $("#" + elm_id + "_menuw"));
	});
	// end i-anchor
	
	$("#" + elm_id).attr({
		tabindex: 0,
		"aria-haspopup": "true",
		"aria-readonly": "true",
		"aria-owns": elm_id + '_menu',
		role: "combobox"
	});
	
	// i-anchor
	// atmo-1695
	var dropdowndiv = $('#' + elm_id).find('.dropdown');
	var dropdowndiv_width = dropdowndiv.outerWidth();
	if (dropdowndiv_width > 0) {
		dropdowndiv.css('width', dropdowndiv_width + 'px');
		dropdowndiv.css('overflow', 'hidden');
	}
	// end i-anchor
}

DropDownMenu.prototype.addItem = function (ddmi) {

	this.menus[this.menus.length] = ddmi;
	var row, td, link;
	row = document.createElement("TR");
	if (this.tbl_items == null) {
		return;
	}
    this.tbl_items.appendChild(row);
    this.tbl_items.appendChild(document.getElementById(this.elm_id + "_menuw"));
    td = document.createElement("TD");
    row.appendChild(td);
    var icon;
    if (ddmi.isForm != true) {
    	if (ddmi.icon != null) {
    		icon = '<img align=absmiddle style="padding-right:2px;" src="' + ddmi.icon + '" height=14 />';
    	} else {
    		icon = '<img align=absmiddle style="padding-right:2px;" src="/resources/static/images/spacer.gif" height=6 />';
    		icon = '';
    	}
    } else {
  	  icon = "";
    }

	var tdid = this.elm_id + "_" + this.menus.length;
	td.id = tdid;
	link = document.createElement("a");
	link.href = ddmi.url;
	link.innerHTML = "" + ddmi.title + "";
	td.className = (ddmi.isForm ? "" : "dd_menu_item ") + "menu_item_" + this.elm_id;
	$(td).attr({
		"role": "option",
		"tabIndex": "-1"
	});
	$(td).html("<div>" + icon + ddmi.title + "</div>");

	td.noWrap = true;
    if (!ddmi.isForm) {
  	  td.height = "22";
  	  setTimeout(function () {
  		  appendEvent(td, "onclick", ddmi.url);
  	  }, 100);
  	  
  	  if (document.getElementById(tdid) != null) {
  		  setTimeout(function () {
  			  appendEvent(td, "onclick", function () {
  				  if (active_menu != null) {
  					  _hide_menu(active_menu, true);
  					  active_menu = null;
  				  }
  				  var tdd = document.getElementById(tdid); 
  				  $(tdd).removeClass("MENU_ITEM_HOVER");
  			  });
  		  }, 100);
  		  setTimeout(function () {
  			  appendEvent(td, "onmouseover", function () {
  				  var tdd = document.getElementById(tdid);
  				  $(tdd).addClass("MENU_ITEM_HOVER");
  			  });
  		  }, 100);
  		  setTimeout(function () {
  			  appendEvent(td, "onmouseout", function () {
  				  var tdd = document.getElementById(tdid);
  				  $(tdd).removeClass("MENU_ITEM_HOVER");
  			  });
  		  }, 100);
  		  setTimeout(function () {
  			  appendEvent(td, "onkeydown", function () {
  				  var tdd = document.getElementById(tdid);
  				  $(tdd).removeClass("MENU_ITEM_HOVER");
  			  });
  		  }, 100);
        }
    }
    $(".dd_menu_item div").each(function (index, elme) {
  	  if (index == 0) {
  		  $(elme).css("border-width", "0");
  	  } else {
  		  $(elme).css("border-width", "1px");
  	  }
    });
};

function _add_menu_item(elm_id, title, url, isForm, icon) {
	var elm = document.getElementById(elm_id);
	var ddm = dd_menus[elm_id];
	if (ddm == null) {
		ddm = new DropDownMenu(elm_id);
		dd_menus[elm_id] = ddm;
	}
	var ddmi = new DropDownMenuItem(title, url, isForm, icon);
	ddm.addItem(ddmi);
}

function add_menu_item(elm_id, title, url, isForm, icon) {
	setTimeout(function () {
		_add_menu_item(elm_id, title, url, isForm, icon);
	}, 100);
}

ObInject.prototype.addMenuItem = function (title, url, isForm, icon) {

	add_menu_item(this.elmid, title, url, isForm, icon);
	return this;
};



function handleMenuFocus(elm_id) {
	show_menu(document.getElementById(elm_id + "_menu"), document.getElementById(elm_id + '_menuw'));
}

function TransitionElement() {
    this.original_parent_elm = null;
    this.transition_parent_elm = null;
    this.elm = null;
    this.run_after = null;
    this.run_index = 0;
    this.settle_index = 0;
    this.transition_type = 0;
}

function initialize_element(elmid) {
    var se2 = released_elements[elmid];
    if (se2 != null) {
        try {
        	se2.original_parent_elm.insertBefore(se2.elm, se2.transition_parent_elm);
            se2.original_parent_elm.removeChild(se2.transition_parent_elm);
            delete se2.transition_parent_elm;
        } catch (e) {

        }
    }

    var elm = document.getElementById(elmid);
    var elm_parent = elm.parentNode;
    var transition_parent_elm = document.createElement("div");
    transition_parent_elm.style.position = 'relative';
    transition_parent_elm.style.display = 'block';
// transition_parent_elm.style.content = '.';
    transition_parent_elm.style.overflow = 'hidden';
// transition_parent_elm.style.backgroundColor = 'red';
    transition_parent_elm.style.zIndex = '8888';
    transition_parent_elm.style.clear = 'both';

    transition_parent_elm.style.width = elm.offsetWidth + 'px';
    transition_parent_elm.style.height = elm.offsetHeight + "px";

    elm_parent.insertBefore(transition_parent_elm, elm);
    transition_parent_elm.appendChild(elm);


    elm.style.position = 'relative';
    elm.style.zIndex = '-1';

    var se = new TransitionElement();
    se.original_parent_elm = elm_parent;
    se.transition_parent_elm = transition_parent_elm;
    se.elm = elm;

    return se;
}

function release_element(elmid) {

    var se = element_queue[elmid];
    se.elm.style.position = '';
    se.elm.style.left = '';
    se.elm.style.top = '';
    se.elm.style.zIndex = '';

    var se2 = new TransitionElement();
    se2.original_parent_elm = se.original_parent_elm;
    se2.transition_parent_elm = se.transition_parent_elm;
    se.transition_parent_elm.style.zIndex = "0";
    se2.elm = se.elm;
    released_elements[elmid] = se2;

    if (se.run_after != null) {
        setTimeout(se.run_after, 10);
    }
    element_queue[elmid] = null;
    if (!isBrowserIE || 1 == 1) {
	    se2 = released_elements[elmid];
	    if (se2 != null) {
	        try {
	        	se2.original_parent_elm.insertBefore(se2.elm, se2.transition_parent_elm);
	            se2.original_parent_elm.removeChild(se2.transition_parent_elm);
	            delete se2.transition_parent_elm;
	        } catch (e) {
	
	        }
	    }
	    released_elements[elmid] = null;
    }
}

function run_fadeout(elmid) {

    var se = element_queue[elmid];
    se.run_index ++;
    var elmfade = se.run_index;

    var newfade = elmfade + (25) + ((se.run_index / 2) * (se.run_index * 2));
    newfade = newfade > 99?99:newfade;

    if (isBrowserIE) {
    	try {
    		se.transition_parent_elm.style.filter = 'alpha(opacity=' + (newfade) + ');';
    	} catch (e) {}
    } else {
    	try {
    		se.transition_parent_elm.style.opacity = '.' + newfade;
    	} catch (e2) {}
    }

    if (newfade >= 99) {
        // alert('test');
        release_element(elmid);
        if (se.transition_type == TRANSITION_FADEOUT) {
            se.elm.className = se.elm.className + ' fadecontainer';
            se.elm.style.visibility = 'hidden';
        }

    } else {
        setTimeout("run_fadeout('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function run_fadein(elmid) {

    var se = element_queue[elmid];
    se.settle_index --;
    se.run_index ++;
    var elmfade = se.settle_index;

    var newfade = elmfade - ((25) + ((se.run_index / 2) * (se.run_index * 2)));
    newfade = newfade < 1?1:newfade;

    if (isBrowserIE) {
    	try {
    		se.transition_parent_elm.style.filter = 'alpha(opacity=' + (newfade) + ');';
    	} catch (e) {}
    } else {
    	try {
    		se.transition_parent_elm.style.opacity = '.' + newfade;
    	} catch (ex) {}
    }

    if (newfade <= 1) {
        release_element(elmid);
        if (se.transition_type == TRANSITION_FADEOUT) {
            se.elm.style.visibility = 'hidden';
        }
    } else {
        setTimeout("run_fadein('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function fadeout(elmid, runafter, bycolor) {

    if (element_queue[elmid] != null) {
        return;
    }
    var se = initialize_element(elmid);
    se.run_after = runafter;
    se.transition_type = TRANSITION_FADEOUT;
    element_queue[elmid] = se;


    if (bycolor != null) {
        se.elm.style.position = '';
        se.elm.style.left = '';
        se.elm.style.top = '';
        se.elm.style.zIndex = '';
        se.original_parent_elm.insertBefore(se.elm, se.transition_parent_elm);
        se.original_parent_elm.insertBefore(se.transition_parent_elm, se.elm);
        se.transition_parent_elm.style.position = 'absolute';
        se.transition_parent_elm.style.backgroundColor = bycolor;
        run_fadeout(elmid);
    } else {
        se.settle_index = 100;
        run_fadein(elmid);
    }

}



function fadein(elmid, runafter, bycolor) {

    if (element_queue[elmid] != null) {
        return;
    }
    var se = initialize_element(elmid);
    if (isBrowserIE) {
    	try {
    		se.transition_parent_elm.style.filter = 'alpha(opacity=0);';
    	} catch (e) {}
    } else {
    	try {
    		se.transition_parent_elm.style.opacity = '.0';
    	} catch (ex) {}
    }
    se.elm.style.visibility = 'visible';

    se.elm.className = se.elm.className.replace(/fadecontainer/gi, '');
// se.elm.className = se.elm.className.toLowerCase().replace(/fadecontainer/gi,
// '');

    se.run_after = runafter;
    se.transition_type = TRANSITION_FADEIN;
    element_queue[elmid] = se;
    se.transition_parent_elm.className = 'fadecontainer';
    if (bycolor != null) {
        se.elm.style.position = '';
        se.elm.style.left = '';
        se.elm.style.top = '';
        se.elm.style.zIndex = '';
        se.original_parent_elm.insertBefore(se.elm, se.transition_parent_elm);
        se.original_parent_elm.insertBefore(se.transition_parent_elm, se.elm);
        se.transition_parent_elm.style.position = 'absolute';
        se.transition_parent_elm.style.backgroundColor = bycolor;
        se.settle_index = 100;
        if (isBrowserIE) {
        	try {
        		se.transition_parent_elm.style.filter = 'alpha(opacity=99);';
        	} catch (e1) {}
        } else {
        	try {
        		se.transition_parent_elm.style.opacity = '.99';
        	} catch (e2) {}
        }

        run_fadein(elmid);
    } else {
    	run_fadeout(elmid);
    }


}

function settle(elmid) {
    var se = element_queue[elmid];
    var elmleft = findLeft(se.transition_parent_elm);
    var settler = [];
    var i;
    switch (se.transition_type) {
    case TRANSITION_LEFT :
        settler[0] = 3;
        settler[1] = 2;
        settler[2] = 1;
        settler[3] = 1;
        settler[4] = -1;
        settler[5] = 1;
        settler[6] = 0;
        for (i = 0; i < settler.length; i++) {
            setTimeout("set_left('" + elmid + "', " + settler[i] + ")", i * TRANSITION_INTERVAL);
            se.settle_index = i;
        }
        break;
    case TRANSITION_RIGHT :
        settler[0] = -3;
        settler[1] = -2;
        settler[2] = -1;
        settler[3] = -1;
        settler[4] = 1;
        settler[5] = -1;
        settler[6] = 0;
        for (i = 0; i < settler.length; i++) {
            setTimeout("set_left('" + elmid + "', " + settler[i] + ")", i * TRANSITION_INTERVAL);
            se.settle_index = i;
        }

        break;
    case TRANSITION_TOP :
        settler[0] = 3;
        settler[1] = 2;
        settler[2] = 1;
        settler[3] = 1;
        settler[4] = -1;
        settler[5] = 1;
        settler[6] = 0;
        for (i = 0; i < settler.length; i++) {
            setTimeout("set_top('" + elmid + "', " + settler[i] + ")", i * TRANSITION_INTERVAL);
            se.settle_index = i;
        }
        break;
    case TRANSITION_BOTTOM :
        settler[0] = -3;
        settler[1] = -2;
        settler[2] = -1;
        settler[3] = -1;
        settler[4] = 1;
        settler[5] = -1;
        settler[6] = 0;
        for (i = 0; i < settler.length; i++) {
            setTimeout("set_top('" + elmid + "', " + settler[i] + ")", i * TRANSITION_INTERVAL);
            se.settle_index = i;
        }
        break;
    }

    setTimeout("release_element('" + elmid + "');", (se.settle_index + 1) * TRANSITION_INTERVAL);

}

function run_left(elmid) {
    var se = element_queue[elmid];
    se.run_index ++;
    var elmleft = se.elm.offsetLeft;

    var newleft = elmleft + ((se.run_index / 2) * (se.run_index));

    newleft = newleft > 0?0:newleft;
    se.elm.style.left = newleft + 'px';
    if (newleft >= 0) {
        settle(elmid);
    } else {
        setTimeout("run_left('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function run_right(elmid) {
    var se = element_queue[elmid];
    se.run_index ++;
    var elmleft = se.transition_parent_elm.offsetWidth;

    var newleft = elmleft - ((se.run_index / 2) * (se.run_index));

    newleft = newleft < 0?0:newleft * 1;
    se.elm.style.left = newleft + 'px';
    if (newleft <= 0) {
        settle(elmid);
    } else {
        setTimeout("run_right('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function run_top(elmid) {
    var se = element_queue[elmid];
    se.run_index ++;
    var elmtop = se.elm.offsetTop * 1;
    var newtop = elmtop + ((se.run_index / 2) * (se.run_index));

    newtop = newtop > 0?0:newtop;
    se.elm.style.top = newtop + 'px';
    if (newtop >= 0) {
        settle(elmid);
    } else {
        setTimeout("run_top('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function run_bottom(elmid) {
    var se = element_queue[elmid];
    se.run_index ++;
    var elmtop = se.elm.offsetTop * 1;
    var newtop = elmtop - ((se.run_index / 2) * (se.run_index));

    newtop = newtop < 0?0:newtop;
    se.elm.style.top = newtop + 'px';
    if (newtop <= 0) {
        settle(elmid);
    } else {
        setTimeout("run_bottom('" + elmid + "')", TRANSITION_INTERVAL);
    }
}

function sweep(elmid, transition_type, runafter) {
    if (element_queue[elmid] != null) {
        return;
    }

    var se = initialize_element(elmid);
    se.transition_type = transition_type;
    se.run_after = runafter;
    element_queue[elmid] = se;
    se.elm.style.visibility = 'visible';
// se.elm.className = se.elm.className.toLowerCase().replace(/fadecontainer/gi,
// '');
    se.elm.className = se.elm.className.replace(/fadecontainer/gi, '');


    switch (se.transition_type) {
	case TRANSITION_LEFT :
		se.elm.style.left = -se.elm.offsetWidth + 'px';
		run_left(elmid);
		break;
	case TRANSITION_RIGHT :
		se.elm.style.left = se.elm.offsetWidth + 'px';
		run_right(elmid);
		break;
	case TRANSITION_TOP :
		se.elm.style.top = -se.elm.offsetHeight + 'px';
		run_top(elmid);
		break;
	case TRANSITION_BOTTOM :
		se.elm.style.top = se.elm.offsetHeight + 'px';
		run_bottom(elmid);
        break;
    }
}




ObInject.prototype.fadeIn = function (runfter, bycolor) {

	fadein(this.elmid, null, null);
	return this;
};

ObInject.prototype.fadeOut = function (runfter, bycolor) {
	fadeout(this.elmid, null, null);
	return this;
};

ObInject.prototype.sweepLeft = function (runafter) {
	sweep(this.elmid, TRANSITION_LEFT, runafter);
	return this;
};

ObInject.prototype.sweepRight = function (runafter) {
	sweep(this.elmid, TRANSITION_RIGHT, runafter);
	return this;
};

ObInject.prototype.sweepUp = function (runafter) {
	sweep(this.elmid, TRANSITION_TOP, runafter);
	return this;
};

ObInject.prototype.sweepDown = function (runafter) {
	sweep(this.elmid, TRANSITION_BOTTOM, runafter);
	return this;
};

function set_left(elmid, left) {
    var se = element_queue[elmid];
    se.elm.style.left = left + 'px';
}
function set_top(elmid, top) {
    var se = element_queue[elmid];
    se.elm.style.top = top + 'px';
}



