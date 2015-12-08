//= require uiframework.js
/*globals $ atmometadata atmoconsolehomemetadata login atmoCookie currentView FDN updateView updatePageLayout getViewMetadata*/
/**
 *  SOA Software, Inc. Copyright (C) 2000-2011, All rights reserved
 *
 *  This  software is the confidential and proprietary information of SOA Software, Inc.
 *  and is subject to copyright protection under laws of the United States of America and
 *  other countries. The  use of this software should be in accordance with the license
 *  agreement terms you entered into with SOA Software, Inc.
 */
var expired_popup = false;
var tokenRenewalCounter = 0;
function LoginObject() {
	this.loggedInFederationMembers = [];
	this.authTokens = {};
	this.currentUserFDN = null;
	this.userHomeSiteFederationMemberID = null;
	this.currentUserName = null;
	this.receivedViewObj = null;
	this.additionalLoginWithFedMemberIdDuringReconnect = null;
	this.federationLoginSetup = 'INCOMPLETE';
	this.noOfTries = 0;
	this.siteAdmin = false;
	this.relyingPartyUserID = null;
}

LoginObject.prototype.isUserLoggedIn = 
	function () {
		return (this.currentUserFDN != null);
	};
LoginObject.prototype.isSiteAdmin = 
	function () {
		return this.siteAdmin;
	};

LoginObject.prototype.userFDN =
	function () {
		return this.currentUserFDN;
	};
LoginObject.prototype.homeFederationMemberId =
	function () {
		return this.userHomeSiteFederationMemberID;
	};
LoginObject.prototype.userName =
	function () {
		return this.currentUserName;
	};
LoginObject.prototype.avatarURL =
	function () {
		return this.currentAvatarURL;
	};
		
LoginObject.prototype.fetchUserRoles =
	function (runAsync, successcallback, errorcallback) {
		$.ajax({
			type : "GET",
			url :  atmometadata.getUsersAPIEndpoint(tenantId) + "/" + login.userFDN() + "/roles",
			data : {
				"ResourceID" : login.userFDN()
			},
			async : runAsync,
			context: {"successcallback" : successcallback, "errorcallback" : errorcallback, "login" : this},
			success : function (data) {
				var siteAdminRoleAssigned = false;
				if (data.RoleName && data.RoleName.length > 0) {
					for ( var i = 0; i < data.RoleName.length; i++) {
						if (data.RoleName[i] == 'SiteAdmin') {
							siteAdminRoleAssigned = true;
						}
					}
				}
				if (siteAdminRoleAssigned) {
					this.login.siteAdmin = true;
				} else {
					this.login.siteAdmin = false;
				}

				if (this.successcallback != null) {
					this.successcallback();
				}
				expired_popup = false;
				return true;
			},
			error : function (data, textStatus, errorThrown) {
				logger.error('Error retrieving user roles: ' + data.responseText);
				
				if (this.errorcallback != null) {
					this.errorcallback(data, textStatus, errorThrown);
				}
				return false;
			}
		});
	};
	

LoginObject.prototype.authenticate =
	function (emailAddress, password, successcallback, errorcallback) {
	emailAddress = $.trim(emailAddress);
		// STEP 1: invoke the authenticate API and retrieve the authToken
		var jsonObj = {};
		jsonObj.email = emailAddress;
		jsonObj.password = password;
		$.ajax({
			type : "POST",	
			async: true,
			url : atmoconsolehomemetadata.getLoginAPIEndpoint(),
			context: {"successcallback" : successcallback, "errorcallback" : errorcallback, "login" : this},
			data : JSON.stringify(jsonObj),
			contentType : 'application/json',
			dataType : 'json',
			success : function (data) {
				// STEP 2: add token to state				
				if (data.userFDN != null) {
					login.currentUserFDN = data.userFDN;
				}
				this.login.addTokenToState(data, false);
				this.login.fetchUserRoles(true, this.successcallback, this.errorcallback);
			},
			error : function (data, textStatus, errorThrown) {
				
				if (this.errorcallback != null) {
					this.errorcallback(data, textStatus, errorThrown);
				}
				return false;
			}			
		});
	};

LoginObject.prototype.setupAndRenewAuthToken =
	function (asyncProp, firstCall, callback) {
		$.ajax({
			type : "POST",			
			async : asyncProp,
			url : atmoconsolehomemetadata.getLoginAPIEndpoint() + "/renewToken",
			contentType : 'application/x-www-form-urlencoded',
			dataType : 'json',
			success : function (data, textStatus, jqXHR) {
				// STEP 2: add token to state
				if (data != null && jqXHR.status != 204) {
					var token = JSON.stringify(data);		
					login.addTokenToState(data, false);
					
					login.fetchUserRoles(false);	// TODO: Need to change async ajax call

					//now renew remote federation tokens
					login.renewRemoteFederationsAuthToken(true);
				} else {//No Content
					login.userHomeSiteFederationMemberID = atmoconsolehomemetadata.getFederationMemberId();
					login.currentUserFDN = null;
					login.siteAdmin = false;
					if (!firstCall) {
						login.logoutFromAllFederationMembers();
					}
					if (currentView && !firstCall && expired_popup == false) {
						expired_popup = true;
						alert('Your session has expired.');
						//updatePageLayout(currentView);
						login.initiateLogin(currentView);
					}
				}
				if (!firstCall && atmoCookie.renewIntervalTime != atmoCookie.actualRenewalScheduleTime) {
					clearInterval(atmoCookie.cookieCheckInterval);				
					atmoCookie.renewIntervalTime = atmoCookie.actualRenewalScheduleTime;
					atmoCookie.initialize();
				}
				//re-initalizing the counter
				tokenRenewalCounter = 0;
			},
			error : function (data, textStatus, errorThrown) {
				if(tokenRenewalCounter >= atmoCookie.maximumTriesAtFailure){
					if(atmoCookie.cookieCheckInterval!=null){
						//if the call is faling continously for 20 times, we will stop calling renewToken api
						clearInterval(atmoCookie.cookieCheckInterval);
						
						login.userHomeSiteFederationMemberID = atmoconsolehomemetadata.getFederationMemberId();
						login.currentUserFDN = null;
						login.siteAdmin = false;
						if (!firstCall) {
							login.logoutFromAllFederationMembers();
						}
						return;
					}
				}

				//try renew every 30 seconds till succeeds
				if (!firstCall && atmoCookie.renewIntervalTime != 30000) {
					clearInterval(atmoCookie.cookieCheckInterval);				
					atmoCookie.renewIntervalTime = 30000;
					atmoCookie.initialize();
					//console.log('interval time on error='+atmoCookie.renewIntervalTime);
				}
				tokenRenewalCounter++;
			},
			complete: callback || function() {
				
			}
		});
	};

LoginObject.prototype.renewRemoteFederationsAuthToken =
	function (asyncProp) {
		var fedmembers = atmometadata.getAllFederationMemberIds();
		for (var fedmemberId in fedmembers) {
			if (this.userHomeSiteFederationMemberID && atmoconsolehomemetadata.getFederationMemberId() != fedmembers[fedmemberId]) {
				this.setupFederationLogin(fedmembers[fedmemberId], true);
			}
		}
	};

LoginObject.prototype.addTokenToState =
	function (loginResponse, saveCookie) {
		// parse token and add the information to LoginObject state
		var tokenFederationMemberId;
		var token = loginResponse.authToken;
		if (loginResponse.userFDN != null) {
			this.currentUserFDN = loginResponse.userFDN;
			var fdn = new FDN(this.currentUserFDN);
			var rdn = fdn.getRDN();
			tokenFederationMemberId = fdn.getFederationMemberId();
			this.userHomeSiteFederationMemberID = fdn.getFederationMemberId();
		}
		if (loginResponse.userName != null) {
			this.currentUserName = loginResponse.userName;
		}
		if (loginResponse.avatarURL != null) {
			this.currentAvatarURL = loginResponse.avatarURL;
		}
		if (tokenFederationMemberId != null) {
			this.authTokens[tokenFederationMemberId] = token;
			//this.loggedInFederationMembers.push(tokenFederationMemberId);
			this.loggedInFederationMembers[tokenFederationMemberId] = 'LOGGEDIN';
		}
    };

LoginObject.prototype.initiateLogin = 
	function (viewAfterSuccessfulLogin, additionalLoginFedMemberId) {
		this.additionalLoginWithFedMemberIdDuringReconnect = additionalLoginFedMemberId;
		this.receivedViewObj = viewAfterSuccessfulLogin;
		if (!login.isUserLoggedIn()) {
			updateView('home', null, 'login');
		} else {
			this.reconnect();
		}
	};

LoginObject.prototype.reconnect = 
	function () {
		var setupFedLogins = true;
		// login with remote federation if required
		if (this.additionalLoginWithFedMemberIdDuringReconnect != null && this.additionalLoginWithFedMemberIdDuringReconnect != undefined && this.additionalLoginWithFedMemberIdDuringReconnect != atmoconsolehomemetadata.getFederationMemberId()) {
			var jsonObj = {};
			jsonObj.fedMemberId = this.additionalLoginWithFedMemberIdDuringReconnect;
			$.ajax({
				type : "POST",	
				async: true,
				url : atmoconsolehomemetadata.getLoginAPIEndpoint(),
				data : JSON.stringify(jsonObj),
				contentType : 'application/json',
				dataType : 'json',
				success : function (data) {
					this.loggedInFederationMembers[login.additionalLoginWithFedMemberIdDuringReconnect] = 'LOGGEDIN';				
				},
				error : function (data, textStatus, errorThrown) {
					setupFedLogins = false;
					alert('Could not setup remote login');
				}			
			});
		}
		if (setupFedLogins == true) {			
			login.setupFederationLoginForAllFedmembers();
		}
		this.viewAfterLogin(this.receivedViewObj);		
		this.receivedViewObj = null;
		this.additionalLoginWithFedMemberIdDuringReconnect = null;
	};


LoginObject.prototype.setRelyingpartyUserID = 
	function(userID) {
		this.relyingPartyUserID = userID;
	};

LoginObject.prototype.viewAfterLogin =
	function (viewObj) {		 
		setTimeout(function () {
			login.checkFederationLoginForAllFedmembers();
			if (login.federationLoginSetup == 'COMPLETE') {
				if (viewObj != null) {
					// Check if user is authorized to the view
					if (login.isAuthorized(viewObj)) {
						updatePageLayout(viewObj);
					} else {
						alert("You are not authorized to view this page.");
						updateView('home', null, 'dashboard');
					}
				} else {
					updateView('home', null, 'dashboard');
				}
				login.noOfTries = 0;
			} else if (login.federationLoginSetup == 'AbortOnError' || login.noOfTries > 100) {
				login.federationLoginSetup = 'INCOMPLETE';
				updateView('home', null, 'signup');
			} else {
				login.noOfTries = login.noOfTries + 1;
				login.viewAfterLogin(viewObj);
			}
		}, 100);
	};

LoginObject.prototype.isAuthorized = 
	function (viewObj) {
		//console.log("Checking if user is authorized to view "+viewObj.viewName);
		var viewMetadata = getViewMetadata(viewObj.objectType, viewObj.viewName);
		var rolesAllowed =	viewMetadata.rolesAllowed;
 
		if (rolesAllowed == null || rolesAllowed.length == 0) {
			return true;
		}
		for (var i = 0; i < rolesAllowed.length; i++) {
			if (rolesAllowed[i] === 'User') {
				if (login.isUserLoggedIn()) {
					return true;
				}
			} else if (rolesAllowed[i] === 'Self') {
				if (login.isUserLoggedIn() && (!viewObj.objectId  || (login.userFDN() && (viewObj.objectId === login.userFDN())))) {
					return true;
				}
			} else if (rolesAllowed[i] == 'SiteAdmin') {
               if (login.isSiteAdmin()) {
                      return true;
               }
            }
		}
		if (viewObj.objectVersionId && login.isMember(viewObj.objectVersionId, rolesAllowed)) {
			return true;
		}
		if (viewObj.objectId && login.isMember(viewObj.objectId, rolesAllowed)) {
			//console.log("User is member of role "+rolesAllowed[i]+" for object "+viewObj.objectId);
			return true;
		}
		//console.log("User does not have a required view role for object "+viewObj.objectId);
		return false;
	};



LoginObject.prototype.setupFederationLoginForAllFedmembers =
	function () {
		login.loggedInFederationMembers[atmoconsolehomemetadata.getFederationMemberId()] = 'LOGGEDIN';
		var fedmembers = atmometadata.getAllFederationMemberIds();
		for (var fedmemberId in fedmembers) {
			if (this.userHomeSiteFederationMemberID && atmoconsolehomemetadata.getFederationMemberId() != fedmembers[fedmemberId] && this.loggedInFederationMembers[fedmembers[fedmemberId]] == null) {
				this.loggedInFederationMembers[fedmembers[fedmemberId]] = 'INPROGRESS';
				this.setupFederationLogin(fedmembers[fedmemberId], true);
			}
		}
		if (fedmembers.length == 1) {//only local fedmember is present
			this.federationLoginSetup = 'COMPLETE';
		}
	};

LoginObject.prototype.checkFederationLoginForAllFedmembers =
		function () {			
			if (login.federationLoginSetup == 'COMPLETE') {
				return true;
			} else if (login.federationLoginSetup == 'AbortOnError') {
				return false;
			}
			var fedmembers = atmometadata.getAllFederationMemberIds();
			var allLoggedIn = true;
			for (var fedmemberId in fedmembers) {
				if (!this.loggedInFederationMembers[fedmembers[fedmemberId]] || this.loggedInFederationMembers[fedmembers[fedmemberId]] != 'LOGGEDIN') {
					allLoggedIn = false;
				}
			}
			if (allLoggedIn == true) {
				login.federationLoginSetup = 'COMPLETE';
				return allLoggedIn;
			}
		};
		
LoginObject.prototype.setupFederationLogin =
	function (fedmemberId, asyncProp, successcallback, errorcallback) {
		if (typeof(fedmemberId) == 'function') {
			return;//had to do this temporarily because of Array.prototype.delete function in global-all.js.  
		}
		var jsonObj = {};
		jsonObj.fedMemberId = fedmemberId;
		$.ajax({
			type : "POST",	
			async: asyncProp,
			url : atmoconsolehomemetadata.getLoginAPIEndpoint(),
			data : JSON.stringify(jsonObj),
			contentType : 'application/json',
			dataType : 'json',
			success : function (data) {
				login.loggedInFederationMembers[fedmemberId] = 'LOGGEDIN';
				//login.federationLoginSetup = 'COMPLETE';
			},
			error : function (data, textStatus, errorThrown) {
				login.currentUserFDN = null;
				login.siteAdmin = false;
				login.federationLoginSetup = 'AbortOnError';
				login.loggedInFederationMembers[fedmemberId] = null;
				login.logoutFromAllFederationMembers();
				alert('Login failed. Try later or contact system administrator.');
			}			
		});		
		
		setTimeout(function () {
			if (login.loggedInFederationMembers[fedmemberId] != 'LOGGEDIN') {
				login.loggedInFederationMembers[fedmemberId] = null;
			}
		}, 1000);

	};

LoginObject.prototype.logoutFromAllFederationMembers =
	function () {
		//call for home site for sure
		this.logoutFromFederationMember(atmoconsolehomemetadata.getFederationMemberId());
		this.authTokens = {};
		this.currentUserFDN = null;
		this.currentUserName = null;
		this.siteAdmin = false;
		for (var federationMemberId in this.loggedInFederationMembers) {
			if (typeof(federationMemberId) == 'function' || federationMemberId == 'clean') {
				continue;//had to do this temporarily because of Array.prototype.delete function in global-all.js.  
			}
			if (federationMemberId != atmoconsolehomemetadata.getFederationMemberId()) {
				this.logoutFromFederationMember(federationMemberId);
			}
		}
		//this.userHomeSiteFederationMemberID = null;
		this.loggedInFederationMembers = [];
	};

LoginObject.prototype.logoutFromFederationMember =
	function (federationMemberId) {
		$.ajax({
			type : "POST",
			url : atmoconsolehomemetadata.getLoginAPIEndpoint() + "/logout",
			data : {"fedmemberId": federationMemberId},
			contentType : 'application/x-www-form-urlencoded',
			dataType : 'json',
			async:false,
			success : function () {
				//remove fedmbr from array
				function existsInObject(obj,indx) {
					var iRegExp = new RegExp(indx), hasMatch = -1;
					for (var prop in obj) {
						if (prop.match(iRegExp)) hasMatch = 1;
					}
					return hasMatch;
				}
				var idx = existsInObject(login.loggedInFederationMembers,federationMemberId); // Find the index
				if (idx != -1) {
					login.loggedInFederationMembers.splice(idx, 1); // Remove it if really found!
				} else {
					delete login.loggedInFederationMembers[federationMemberId];
				}
			},
			error : function (data, textStatus, errorThrown) {
			}			
		});
	};

LoginObject.prototype.isMember = 
	function (resourceId, roleName) {
		return isMember(this.userFDN(), resourceId, roleName);
	};

LoginObject.prototype.initiateUnauthorizedPage =
	function () {	
		updateView('home', null, 'error');		
	};

function isMember(userFDN, resourceId, roleName) {
	var member = false,endPoint;
	if (login.isUserLoggedIn()) {//get roles if the user is logged in otherwise UserFDN will be null any ways.
		var endPoint = atmometadata.getUsersAPIEndpoint(new FDN(resourceId)); 
		if(!endPoint) {
			return false;
		}
		$.ajax({
			type: 'GET',
			url: endPoint + "/" + login.userFDN() + "/roles",
			data: {"ResourceID" : resourceId},
			dataType: 'json',
			async: false,
			success: function (data) {
				if (data != null && data.RoleName != null && typeof data.RoleName != "string") {
					for (var i = 0; i < data.RoleName.length; i++) {
						if (member) {
							break;
						}
						if (roleName.length) {
							for (var j = 0; j < roleName.length; j++) {
								if (data.RoleName[i] == roleName[j]) {
									member = true;
									break;
								}
							}
						} else {
							if (data.RoleName[i] == roleName) {
								member = true;
								break;
							}
						}
					}
				} else if (data != null && data.RoleName != null && typeof data.RoleName == 'string') {
					member = data.RoleName == roleName;
				} else {
					
				}
	//			alert(JSON.stringify(data));
			},
			error: function (data, textStatus, errorThrown) {
				alert(textStatus + " - error: " + errorThrown);
			}
		});
	}
	
	return member;

}

var login = new LoginObject();
