/*globals $ log*/

/************************* signup developer agreement ********
loads the developer agreement into the specified container, disables the submit button, and adds in the "scroll to the bottomn" check to re-enable it.
usage:
$(container).devAgree(options);
obj container (REQUIRED: jquery selector referring to the element that will be a direct parent to the mechanism)
Once mechanism is in place, the container fires a "devAgreeSuccess" custom event; listeners can bind to this event.

options:
obj submitBtn (REQUIRED: jquery selector referring to the form's submit button)
str agreementUrl (optional: url where the agreement is kept)
fn callback (optional: code that executes after the ajax completes)
obj devTemplate (optional: jquery selector referring to the template used)
obj scrollBox (optional: jquery selector referring to the actual scrolling box)
obj scrollCheckElm (optional: jquery selector referring to the invisible marker placed in the scrolling box)
str submitDisabledClass (optional: css classes added to the submit button when disabled

***********/

$.fn.devAgree = function (options) {
	var opt = options || {}, $submitBtn, $devTemplate, $submitDisabledClass, $scrollBox, $scrollCheckElm, $container = $(this), callback;
	if (opt.submitBtn == null || opt.submitBtn == undefined) {
		logger.error("devAgree plugin error: Submit button selector required");
		return;
	}
	$submitBtn = opt.submitBtn;
	opt.agreementUrl = opt.agreementUrl || "/content/home/landing/developeragreement.html";
	opt.devTemplate = opt.devTemplate || $("#DevAgreementTemplate");
	$devTemplate = $(opt.devTemplate);
	$.ajax({
		url : opt.agreementUrl,
		async: true,
		success: function (data, textStatus, jqXHR) {
			if (jqXHR.status != 200) {
				logger.error("devAgree plugin error: legal agreement not loaded!");
				return;
			}
			$container.append($devTemplate.tmpl());
			opt.submitDisabledClass = opt.submitDisabledClass || "";
			opt.scrollBox = opt.scrollBox || $(".legal", $container);
			$scrollBox = $(opt.scrollBox);
			if ($scrollBox.length == 0) {
				$submitBtn.removeAttr('disabled');
				return;
			}
			opt.scrollCheckElm = opt.scrollCheckElm || $("#scrollcheck");
			$scrollCheckElm = opt.scrollCheckElm;
			callback = opt.callback || function () {};
			$submitBtn.attr({
				disabled: "disabled",
				"class": opt.submitDisabledClass
			});	
			$scrollBox.prepend(data).scroll(function () {
				var
					yPos = ($scrollCheckElm.offset()).top + ($scrollCheckElm.outerHeight()),
					boxTop = ($(this).offset()).top,
					boxBottom = boxTop + $(this).outerHeight()
				;
				if (yPos < boxBottom) {//about the height you need for the "scrollcheck" div to come into view
					$submitBtn.attr({
						"class": "action_call",
						disabled : false
					});
				}
			});
			$container.trigger("devAgreeSuccess");
			callback();
		},
		error: function () {
			logger.error("devAgree plugin error: legal agreement not loaded!");
		}
	});
};

