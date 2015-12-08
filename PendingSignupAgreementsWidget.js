/*globals $ jQuery registerWidgetObject login atmometadata convertValuesToDefaultValues FDN getDisplayValue updateView*/
/**
 *  SOA Software, Inc. Copyright (C) 2000-2011, All rights reserved
 *
 *  This  software is the confidential and proprietary information of SOA Software, Inc.
 *  and is subject to copyright protection under laws of the United States of America and
 *  other countries. The  use of this software should be in accordance with the license
 *  agreement terms you entered into with SOA Software, Inc.
 */
var pendingSignupAgreementsWidget = {};
pendingSignupAgreementsWidget.name = 'widget.pending.signup.agreements';
registerWidgetObject(pendingSignupAgreementsWidget);

pendingSignupAgreementsWidget.createWidgetInstance = function (instanceName) {
	
	var	psaTemplate = $.template(null, $("#" + instanceName + "Template"));
	
	return {
		options : {
			
		},
		draw:function(viewObj, childWidgetInstances, layoutWidgetInstanceDOMObj){
			var thisWidget = this;
			thisWidget.options.element = layoutWidgetInstanceDOMObj;
			thisWidget.options.element.empty();
			thisWidget.options.viewObj = viewObj;
			
			if(viewObj.objectId==="thirdparty"){
				$.ajax({
					url : atmoconsolehomemetadata.getUsersAPIEndpoint() + "/verifySignup",
					async : false,
					type : "POST",
					data : {
						signupCode : ""
					},
					success : function(data) {
						if(data){
							login.pendingAgreements= {};
							login.pendingAgreements.authData = data;
							//Check with ramesh, whether he can send the userID in userFDN;
							login.pendingAgreements.authData.userFDN = data.userID; 
							login.pendingAgreements.authSuccessCallback =  function(){
								login.reconnect();
							};
							login.pendingAgreements.authErrorCallback =  function(){};
							
							$.tmpl(psaTemplate).appendTo("#" + instanceName);
							thisWidget.agreementId = data.pendingAgreements[0];
							thisWidget.fetchAgreement();
							thisWidget.doBindings();	
						}else{
							soaAlert("No Data Found. Please check with administrator")
						}	
					},
					error: function(data){
						soaAlert("Error occured while fetching pending agreements. Please check with administrator.")
					}
				});
			}else{
				$("#loginformdropdown").resetForm();
				$("#signindropdown").hide();  
				
				if(!login.pendingAgreements){
					updateView("home",null,"landing");	
				}
				$.tmpl(psaTemplate).appendTo("#" + instanceName);
				thisWidget.agreementId = viewObj.viewExt;
				thisWidget.fetchAgreement();
				thisWidget.doBindings();	
			}
		},
		fetchAgreement:function(){
			var thisWidget = this;
			$.ajax({
			url : atmometadata.getLegalsAPIEndpoint(new FDN(thisWidget.agreementId))+"/"+thisWidget.agreementId,
			async : true,
			type : "GET",
			data : {},
			dataType : "json",
			success : function(data) {
				if (data.ContentPath)
					$(thisWidget.options.element).find(".titleCntr").html(data.Description);
					$.ajax({
						url : atmometadata.getContentAPIEndpoint()+data.ContentPath,
						async : true,
						type : "GET",
						data : {},
						dataType : "html",
						success : function(data) {
							$(thisWidget.options.element).find("#PendingSignupAgreementHolder").html(data);
						}			
					});
				}
			});
		},
		doBindings:function(){
			var thisWidget = this;
			$(thisWidget.options.element).find(".declineButton").click(function(){
				login.pendingAgreements = null;
				updateView("home",null,"landing");
			});
			$(thisWidget.options.element).find(".acceptButton").click(function(){
				var jsonObj = {};
				jsonObj.DocumentID = thisWidget.agreementId;
				jsonObj.UserID = login.pendingAgreements.authData.userFDN;
				$.ajax({
					type: "POST",
					url: atmoconsolehomemetadata.getLegalsAPIEndpoint() + "/agreements",
					dataType: "text",
					async: true,
					contentType: 'application/json',
					data: JSON.stringify(jsonObj),
					success: function (response, textStatus, jqXHR) {
						login.addTokenAndFetchRoles(login.pendingAgreements.authData,login.pendingAgreements.authSuccessCallback, login.pendingAgreements.authErrorCallback);
						atmoCookie.renewIntervalTime = atmoCookie.actualRenewalScheduleTime;
						atmoCookie.initialize();
					},
					error: function (eResponse, textStatus, errorThrown) {
						login.pendingAgreements = null;
						thisWidget.AgreementDocumentID = '';
						soaAlert('error posting acceptance agreement. '+errorThrown);
					}
				});
			});
		},
		finalize:function () {
			
		},
		hide:function () {
			
		}
	}
};
		