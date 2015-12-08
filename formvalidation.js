/*globals $ getDisplayValue UIElement emailCheck __ login*/

var FormElementsArray = [];
var errorBG = "#ffffff";
var requiredBG = "#ffffff";
var normalRoundBorder = "#000";

function validateEmail (email) {
	//	var re =
	// /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
	return email.match(re) != null;
}

function validateUrl (url) {
	// source - http://mathiasbynens.be/demo/url-regex
	// did some modifications
	// test in fire bug console
	// // below regular expression doesnt allow only hostname and subdomain is
	// required
	// var regexp =
	// /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
	// // below regular expression allows only hostname and subdomain is not required
	// var regexp =
	// /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))?)(?::\d{2,5})?(?:\/[^\s]*)?$/i
	// console.log(1, true, regexp.test("http://something.com"));
	// console.log(2, true, regexp.test("http://something.com/abc"));
	// console.log(3, true, regexp.test("https://something.com:9900"));
	// console.log(4, true, regexp.test("https://something"));
	// console.log(5, true, regexp.test("http://something:9000"));
	// console.log(6, true, regexp.test("http://something:999/abc"));
	// console.log(7, true, regexp.test("http://something/abc"));
	// console.log(8, true, regexp.test("http://something.com:999/abc"));
	// console.log(9, true, regexp.test("http://storegexp.something.com/abc"));
	// console.log(10, false, regexp.test("http://something."));
	// console.log(11, false, regexp.test("https://something.com:"));
	// console.log(12, false, regexp.test("https://something:9:"));
	// console.log(13, false, regexp.test("http://something::"));
	// console.log(14, false, regexp.test("http://something:/abc"));
	// console.log(15, true, regexp.test("http://storegexp.apple.com:999/abc"));
	// console.log(16, false, regexp.test("store.something.com:999/abc"));
	// console.log(17, true, regexp.test("http://abc.com"));
	// console.log(18, true, regexp.test("http://abc.co.in"));
	// console.log(19, true, regexp.test("http://142.42.1.1/"));
	// console.log(20, false, regexp.test("142.42.1.1:9900"));
	// console.log(21, false, regexp.test("://127.0.0.1:9900"));
	// console.log(22, false, regexp.test("htt://127.0.0.1:9900"));
	// console.log(23, true, regexp.test("http://142.42.1.1:8080/"));
	// console.log(24, true, regexp.test("http://142.42.1.1"));
	// console.log(24, true, regexp.test("http://142.42.1.1:8080"));
	// subdomain required
	// var regexp =
	// /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i

	// subdomain not required
	var regexp = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))?)(?::\d{2,5})?(?:\/[^\s]*)?$/i
	return regexp.test($.trim(url));
}

function bindFormSubmitForValidation (frm) {
	frm.submit(function () {
		var errors = false;
		var emailRequired = false;
		var urlRequired = false;
		var elmConfirmValue = null;
		var elmConfirm = null;
		var sweepingError = false;
		if (FormElementsArray[this.id] != null) {
			var formElements = FormElementsArray[this.id];
			for (var i = 0; i < formElements.length; i++) {
				sweepingError = false;
				emailRequired = false;
				urlRequired = false;
				var confirmError = false;
				if (formElements[i].tagName == "SELECT") {
					if (formElements[i].value.replace(/This field is required\.\.\./gi, "").replace(/ /gi, "") == "") {
						try {
							$("." + formElements[i].id + "_span_round_bg").css("background-color", "#fff");
							$("." + formElements[i].id + "_span_border").css("border-color", "#000");
							$("." + formElements[i].id + "_span_borderBackground").css("background-color", "#000");
							$("." + formElements[i].id + "_span_round_bg").css("background-color", "#fff");
							$("#" + formElements[i].id + "_span").css("color", "#e07d7d");
							$("#" + formElements[i].id + "_span").css("font-style", "italic");
							$("." + formElements[i].id + "_errorMessage").css("visibility", "visible");
							if (document.getElementById(formElements[i].id + "_errorMessage") != null) {
								__(formElements[i].id + "_errorMessage").sweepLeft();
								sweepingError = true;
							}
						} catch (e) {
						}

						formElements[i].style.backgroundColor = errorBG;
						errors = true;
					}
				} else {
					if (formElements[i].className.indexOf("email") > -1) {
						if (!validateEmail(formElements[i].value)) {
							$("." + formElements[i].id + "Error").show();
							$("." + formElements[i].id + "Accept").hide();
							errors = true;
							if (document.getElementById(formElements[i].id + "_errorMessage") != null) {
								__(formElements[i].id + "_errorMessage").sweepLeft();
								sweepingError = true;
							}
							$("#" + formElements[i].id + "_errorMessage").show();
						} else {
							if ($("#" + formElements[i].id + "_errorMessage").is(":visible")) {
								$("#" + formElements[i].id + "_errorMessage").hide();
							}
						}
					}
					if (formElements[i].className.indexOf("url") > -1) {
						if (!validateUrl(formElements[i].value)) {
							$("." + formElements[i].id + "Error").show();
							$("." + formElements[i].id + "Accept").hide();
							errors = true;
							if (document.getElementById(formElements[i].id + "_errorMessage") != null) {
								__(formElements[i].id + "_errorMessage").sweepLeft();
								sweepingError = true;
							}
							$("#" + formElements[i].id + "_errorMessage").show();
						} else {
							if ($("#" + formElements[i].id + "_errorMessage").is(":visible"))
								$("#" + formElements[i].id + "_errorMessage").hide();
						}
					}
					if ($(formElements[i]).attr('type') == 'checkbox') {
						if ($(formElements[i]).is(':checked')) {
							confirmError = false;
						} else {
							confirmError = true;
						}
					} else if (formElements[i].value != "" && formElements[i].className.indexOf("confirm") > -1) {
						elmConfirmValue = formElements[i].className.split("confirm:")[1].split(" ")[0].split("]")[0];
						elmConfirm = document.getElementById(elmConfirmValue);
						if (elmConfirm == null) {
							alert('Cannot find confirmation field element [' + elmConfirmValue + ']');
							return false;
						}

						if (elmConfirm.value != formElements[i].value) {
							confirmError = true;
							errors = true;
							if (document.getElementById(formElements[i].id + "_errorMessage") != null) {
								__(formElements[i].id + "_errorMessage").sweepLeft();
								sweepingError = true;
							}
						} else {
							if (document.getElementById(formElements[i].id + "_errorMessage") != null) {
								$('#' + formElements[i].id + "_errorMessage").hide();
								removeInputError($(formElements[i]));
							}
						}
					}
					if ($(formElements[i]).attr('emptyval') == $(formElements[i]).val()) {
						formElements[i].value = "This field is required...";
					}
					if (formElements[i].value.replace(/This field is required\.\.\./gi, "").replace(/ /gi, "") == "" || confirmError) {
						errors = true;
						if (formElements[i].type == 'password') {//special error handling because error
							// messages don't appear in password field
							var passwordErrorMsg = getDisplayValue('com.soa.atmosphere.passwordrequired.error');
							//set default message
							if (confirmError) {
								passwordErrorMsg = getDisplayValue('com.soa.atmosphere.passwordretype.error');
								//if pw has been entered, change the message
							}
							$("#passwordConfirm_errorMessage").html(passwordErrorMsg);
							//set error message in div
						} else if (formElements[i].value.replace(/This field is required\.\.\./gi, "").replace(/ /gi, "") == "") {
							formElements[i].value = "This field is required...";
						}
						formElements[i].style.fontStyle = "italic";
						formElements[i].style.color = "#e07d7d";
						$("." + formElements[i].id + "Error").show();
						$("." + formElements[i].id + "Accept").hide();
						$("." + formElements[i].id + "Box_round_bg").css("background-color", errorBG);
						$("." + formElements[i].id + "Box_round_bg").css("background-position", "right");
						$("." + formElements[i].id + "Box_round_bg").css("background-repeat", "no-repeat");
						$("." + formElements[i].id + "Box_border").css("border-color", "#000");
						$("." + formElements[i].id + "Box_borderBackground").css("background-color", "#fff");
						addInputError($(formElements[i]));
						__(formElements[i].id).sweepLeft();
						if (document.getElementById(formElements[i].id + "_errorMessage") != null && !sweepingError) {
							__(formElements[i].id + "_errorMessage").sweepLeft();
						}
					}
				}
			}
		}
		if (errors) {
			frm.attr("cancel", "true");
		} else {
			frm.attr("cancel", "false");
		}
		return false;
	});
	formDeclarations(frm);
}

var formDeclaration = '';
function formDeclarations (form) {
	if (formDeclaration == '') {
		$.ajax({
			async : false,
			type : "GET",
			url : atmoconsolehomemetadata.getAtmosphereContextRoot() + '/global/formdeclaration.json',
			dataType : 'json',
			success : function (data) {
				formDeclaration = data;
				processFormDeclarations(formDeclaration);
			}
		});
	} else {
		processFormDeclarations(formDeclaration);
	}
}

function processFormDeclarations (form_dec) {
	$(form_dec).each(function () {
		if (this.identifier) {
			$('#' + this.instance).find(this.identifier).attr('maxlength', this.len);
		}
	});
}

function formValidationEngine (frmselector, doAcceptHighlight) {
	FormElementsArray[frmselector] = null;

	var elms = $("#" + frmselector + " [class*='validate']").each(function (idx, item) {
		if ($(item).attr("appliedValidation") == "true") {
			return;
		}
		$(item).attr("appliedValidation", "true");
		var required = false;
		if (item.className.indexOf("required") > -1) {
			required = true;
		}
		var emailRequired = false;
		var urlRequired = false;
		if (item.className.indexOf("email") > -1) {
			emailRequired = true;
		}
		if (item.className.indexOf("url") > -1) {
			urlRequired = true;
		}
		var confirmValue = false;
		if (item.className.indexOf("confirm") > -1) {
			confirmValue = true;
		}
		var formElements;
		var frm = $(item).closest('form');
		if (FormElementsArray[frm.attr("id")] == null) {
			formElements = [];
		} else {
			formElements = FormElementsArray[frm.attr("id")];
		}
		if (required) {
			formElements[formElements.length] = item;
		}
		if (frm.attr("appliedValidation") != "true") {
			frm.attr("appliedValidation", "true");
			bindFormSubmitForValidation(frm);
		}
		FormElementsArray[frm.attr("id")] = formElements;
		if (!required) {
			$.tmpl($.template(null, $("#ValidateTemplate")), item).appendTo(item.parentNode ? item.parentNode : item.parentElement);
			$("#" + item.id + "Container").append(item);
			$("#" + item.id + "Box").height($(item).height());
			item.className = item.className + " validateField";
			var elem = new UIElement (document.getElementById(item.id + "Box")).round(normalRoundBorder, "#fff");
		} else {
			if (item.tagName == "SELECT") {
				try {
					$("." + item.id + "_span_round_bg").css("background-position", "right");
					$("." + item.id + "_span_round_bg").css("background-repeat", "no-repeat");
				} catch (e) {
				}
				$(item).css("background-color", requiredBG);
				$(item).bind("blur", function () {
					if (this.value.replace(/ /gi, "") == "") {
						this.style.backgroundColor = errorBG;
					}
				});
				$(item).bind("change", function () {
					if (this.value.replace(/ /gi, "") == "") {
						this.style.backgroundColor = errorBG;
					} else {
						this.style.backgroundColor = "";
					}
				});
			} else {
				$.tmpl($.template(null, $("#ValidateTemplate")), item).appendTo(item.parentNode ? item.parentNode : item.parentElement);
				$("#" + item.id + "Container").append(item);
				if ($(item).height() > 0) {
					$("#" + item.id + "Box").height($(item).height());
				}
				item.className = item.className + " validateField";
				var elem2 = new UIElement (document.getElementById(item.id + "Box")).round(normalRoundBorder, requiredBG);
				$("." + item.id + "Box_round_bg").css("background-position", "right");
				$("." + item.id + "Box_round_bg").css("background-repeat", "no-repeat");
				$(item).bind("blur", function () {
				});
				$(item).bind("focus", function () {
					if (this.value == "This field is required...") {
						this.value = "";
						removeInputError(this);
					}
				});
				$(item).bind("keyup, click", function () {
					if (this.value == '') {
						return;
					}
					var error = false;
					var elmConfirmValue = null;
					var elmConfirm = null;
					if (confirmValue && this.value != "") {
						elmConfirmValue = this.className.split("confirm:")[1].split(" ")[0].split("]")[0];
						elmConfirm = document.getElementById(elmConfirmValue);
						if (elmConfirm.value != "") {
							error = elmConfirm.value != this.value;
						}
					}
					if (emailRequired && this.value != "") {
						error = !validateEmail(this.value);
					}
					if (urlRequired && this.value != "") {
						error = !validateUrl(this.value);
					}
					if (this.value.replace(/ /gi, "") == "" || error) {
					} else {
						this.style.fontStyle = "";
						this.style.color = "";
						$("." + item.id + "Error").hide();
						$("." + item.id + "Accept").show();
						if (doAcceptHighlight) {
							$("." + item.id + "Box_round_bg").css("background-color", "#e6ffe6");
							$("." + item.id + "Box_border").css("border-color", "#b4d9b4");
							$("." + item.id + "Box_borderBackground").css("background-color", "#b4d9b4");
						} else {
							$("." + item.id + "Box_round_bg").css("background-color", "");
							$("." + item.id + "Box_border").css("border-color", normalRoundBorder);
							$("." + item.id + "Box_borderBackground").css("background-color", normalRoundBorder);
						}
						$("." + item.id + "Box_round_bg").css("background-image", "");
						$("." + item.id + "Box_round_bg").css("background-position", "right");
						$("." + item.id + "Box_round_bg").css("background-repeat", "no-repeat");
						if (elmConfirm != null && elmConfirm.value != '') {
							$("." + elmConfirm.id + "Error").hide();
							$("." + elmConfirm.id + "Accept").show();
							$("." + elmConfirm.id + "Box_round_bg").css("background-color", "");
							$("." + elmConfirm.id + "Box_round_bg").css("background-image", "");
							$("." + elmConfirm.id + "Box_round_bg").css("background-position", "right");
							$("." + elmConfirm.id + "Box_round_bg").css("background-repeat", "no-repeat");
							if (doAcceptHighlight) {
								$("." + elmConfirm.id + "Box_round_bg").css("background-color", "#e6ffe6");
								$("." + elmConfirm.id + "Box_border").css("border-color", "#b4d9b4");
								$("." + elmConfirm.id + "Box_borderBackground").css("background-color", "#b4d9b4");
							} else {
								$("." + elmConfirm.id + "Box_round_bg").css("background-color", "");
								$("." + elmConfirm.id + "Box_border").css("border-color", normalRoundBorder);
								$("." + elmConfirm.id + "Box_borderBackground").css("background-color", normalRoundBorder);
							}
						}
					}
				});
			}
		}
	});
}

function isEmailValid (str) {
	emailCheck = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
	return emailCheck.test(str);
}

/*
 function isNumeric(str) {
 return /^\d$/.match(str);
 }

 function isNumeric(n) {
 var v = 1.0 * n ;
 if ( isNaN(v) ) {
 return false ;
 } else {
 return true ;
 }
 }
 */
function isDate (dateStr) {
	try {
		var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
		var datePat2 = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{2})$/;

		var matchArray = dateStr.match(datePat);
		// is the format ok?
		var matchArray2 = dateStr.match(datePat2);
		// is the format ok?

		if (matchArray == null && matchArray2 == null) {
			return false;
		}

		if (matchArray == null) {
			datePat = datePat2;
		}
		var month = matchArray[1];
		// parse date into variables
		var day = matchArray[3];
		var year = matchArray[5];

		if (month < 1 || month > 12) {// check month range
			//	        alert("Month must be between 1 and 12.");
			return false;
		}

		if (day < 1 || day > 31) {
			//	        alert("Day must be between 1 and 31.");
			return false;
		}

		if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
			//	        alert("Month "+month+" doesn't have 31 days!")
			return false;
		}

		if (month == 2) {// check for february 29th
			var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
			if (day > 29 || (day == 29 && !isleap)) {
				//alert("February " + year + " doesn't have " + day + " days!");
				return false;
			}
		}
	} catch (e) {
		return false;
	}
	return true;
	// date is valid
}

function isValidTime (value) {
	var hasMeridian = false;
	var re = /^\d{1,2}[:]\d{2}([:]\d{2})?( [aApP][mM]?)?$/;
	if (!re.test(value)) {
		return false;
	}
	if (value.toLowerCase().indexOf("p") != -1) {
		hasMeridian = true;
	}
	if (value.toLowerCase().indexOf("a") != -1) {
		hasMeridian = true;
	}
	var values = value.split(":");
	if ((parseFloat(values[0]) < 0) || (parseFloat(values[0]) > 23)) {
		return false;
	}
	if (hasMeridian) {
		if ((parseFloat(values[0]) < 1) || (parseFloat(values[0]) > 12)) {
			return false;
		}
	}
	if ((parseFloat(values[1]) < 0) || (parseFloat(values[1]) > 59)) {
		return false;
	}
	if (values.length > 2) {
		if ((parseFloat(values[2]) < 0) || (parseFloat(values[2]) > 59)) {
			return false;
		}
	}
	return true;
}

// REMOVED - validation via API
//function isPasswordValid(str, fname, lname) {
//	var alphanumeric = 0;
//	if (/\d/.test(str)) {
//		alphanumeric = alphanumeric + 1;
//	}
//	if (/[a-z]/i.test(str)) {
//		alphanumeric = alphanumeric + 1;
//	}
//	if ((str.length < 8 || str.length > 20) || alphanumeric != 2) {
//			alert('Password must contain 8 to 20 characters, including one letter and
// number');
//		return false;
//	}
//	if (str.indexOf(' ') >= 0) {
//			alert('Password cannot have any spaces');
//		return false;
//	}
//
//	var username;
//	if (login.currentUserName) {
//		username = login.currentUserName.toLowerCase();
//	}
//	else {
//		username = fname + lname.charAt(0);
//		username = username.toLowerCase();
//	}
//	var strlower = str.toLowerCase();
//	if (strlower.indexOf(username) >= 0) {
//		alert('Your password cannot contain your first or last name');
//		return false;
//	}
//	return true;
//}

function addInputError (el) {
	$(el).addClass('inputerror');
	$(el).parents('td.round_text').addClass('inputerror');
	return el;
}

function removeInputError (el) {
	$(el).removeClass('inputerror');
	$(el).parents('td.round_text').removeClass('inputerror');
	return el;
}

function trimInput (inp) {
	return $(inp).val($.trim($(inp).val()));
}

/************** jquery.validate.js options *************/
function isOnFirstOptionValidation (value, element) {
	return element.selectedIndex != 0;
}

$.validator.addMethod("isOnFirstOption", isOnFirstOptionValidation, "Invalid Entry.");
function stillHasHelperTextValidation (value, element) {
	return (!$(element).hasClass("helperText") );
}

function stillHasHelperUrlValidation (value, element) {
	validationStatus = true;

	if (!$(element).hasClass("helperText")) {
		if (!validateUrl(value)) {
			validationStatus = false;
		}
	}

	return validationStatus;
}

$.validator.addMethod("stillHasHelperText", stillHasHelperTextValidation, "Invalid Entry.");
$.validator.addMethod("stillHasHelperTextComment", stillHasHelperTextValidation, "You must enter a comment to proceed.");
$.validator.addMethod("stillHasHelperUrl", stillHasHelperUrlValidation, "Invalid URL.");

function errorPlacement (error, element) {
	if (element.is("input[type=text]") || element.is("textarea")) {
		element.val(error.text()).focus(function () {
			if ($(this).hasClass("helperText")) {
				$(this).val("").attr("class", "");
			}
		}).blur(function () {
			var value = jQuery.trim($(this).val());
			if (value === "") {
				$(this).val(data("helperText")).addClass("helperText");
			}
		});
	} else {
		error.width(element.parent().width());
		// remove the following 2 lines when soaSelect is finally purged
		if (element.next("div").length)
			element.next("div").after(error);
		else
			//end the removal block
			element.after(error);
	}
}

$.extend($.validator.messages, {
	required : "Invalid Entry."
});

function initHelperTextBehavior (layoutWidgetInstanceDOMObj) {
	$("input, select, textarea", layoutWidgetInstanceDOMObj).each(function () {
		var self = this;
		if ($(self).data("helperText") && !$(self).hasClass("helperText"))
			$(self).addClass("helperText");
	});
	$('.helperText', layoutWidgetInstanceDOMObj).each(function () {
		var self = this, textVal = $(self).val();
		$(self).data("helperText", textVal);
		$(self).focus(function () {
			if ($(this).hasClass("helperText")) {
				$(this).val("").removeClass("helperText");
			}
			if ($(this).hasClass("error")) {
				$(this).removeClass("error");
			}
		}).blur(function () {
			var value = jQuery.trim($(this).val());
			if (value === "" || value === "Invalid Entry.") {
				$(this).val(textVal).addClass("helperText");
			}
		});
	});
}

$.validator.setDefaults({
	//errorPlacement: errorPlacement,
	focusInvalid : false,
	onfocusout : false
});
//Add the maxlength attribute to a textarea
$(document).ready(function () {

	$('textarea[maxlength]').keyup(function () {
		//get the limit from maxlength attribute
		var limit = parseInt($(this).attr('maxlength'), 10);
		//get the current text inside the textarea
		var text = $(this).val();
		//count the number of characters in the text
		var chars = text.length;

		//check if there are more characters then allowed
		if (chars > limit) {
			//and if there are use substr to get the text before the limit
			var new_text = text.substr(0, limit);

			//and change the current text with the new text
			$(this).val(new_text);
		}
	});

});
