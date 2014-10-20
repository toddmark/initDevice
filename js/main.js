var URL = window.location.href;
var ajaxURL = './conf.json?' + Math.random();
$(function() {
	if (g_index) {
		index();
	}
	if (URL.indexOf('detectInterface') > 0) {
		detectInterface();
	}
	if (URL.indexOf('pppoe') > 0) {
		pppoe();
	}
	if (URL.indexOf('staticIp') > 0) {
		staticIp();
	}
	if (URL.indexOf('3gNet') > 0) {
		thirdG();
	}
	if (URL.indexOf('unreported') > 0) {
		unreported();
	}
	if (URL.indexOf('reported') > 0) {
		reported();
	}
})

function reported() {
	var btnLink = $('#netConfig');
	btnLink.click(function() {
		if (btnNetConfig.attr('class').indexOf('disabled') > 0) {
			return;
		}
	})
	var btnNetConfig = $('#netConfig').find('button');
	btnNetConfig.addClass('disabled');
	$.ajax({
		url: ajaxURL,
		type: "POST"
	})
		.done(function(data) {
			data = handleServerData(data);
			if (!data.netLine) {
				btnLink.attr('href', './3gNet.html' + '?netLine=' + data.netLine + '&thirdG=' + data.thirdG);
			} else {
				btnLink.attr('href', './pppoe.html' + '?netLine=' + data.netLine + '&thirdG=' + data.thirdG);
			}
			btnNetConfig.removeClass('disabled');
		})
}

function unreported() {
	var eleVar = $('var');
	var btnA = $('#needReport');
	var index = 5;
	var timer = setInterval(function() {
		index--;
		eleVar.text(index);
		if (index == 0) {
			clearInterval(timer);
			window.location.href = btnA.attr('href');
		}
	}, 1000)
}

function thirdG() {
	change_navBar_when_first_load();
	check_usim_card();
	thirdG_refresh();
}

function thirdG_refresh() {
	var btnRefresh = $('#thirdG_refresh');
	btnRefresh.click(function() {
		if ($(this).attr('class').indexOf('disabled') > 0) {
			return false;
		};
		$(this).addClass('disabled');
		check_usim_card()
	});
}

function check_usim_card() {
	var usim = $('.threeGNet li:eq(2)');
	var usim_check = $('.threeGNet li:eq(3)');
	$.ajax({
		url: './CheckUsim.json',
		type: "POST"
	})
		.done(function(data) {
			data = handleServerData(data);
			console.log(data);
			$('#thirdG_refresh').removeClass('disabled');
			usim.removeClass('hide');
			usim_check.removeClass('hide');
			if (data.usim && data.usim_check) {
				window.location.href = './unreported.html';
			}
			if (!data.usim) {
				usim.addClass('danger');
			} else {
				usim.removeClass('danger');
			}
			if (!data.usim_check) {
				usim_check.addClass('danger');
			} else {
				usim_check.removeClass('danger');
			}
		})
		.fail(function() {
			console.log('error');
		})
}

function validate_IP_format() {

}

function staticIp() {
	change_navBar_when_first_load();
	check_staticIp_status();
	var btnStartLink = $('#startLink');
	var form = $('#staticIp_form');
	var wait = $('.wait');
	btnStartLink.on('click', function() {
		validate_IP_format();
		handle_style_betewwn_PC_and_mobile(btnStartLink, form, '正在连接');
		$.ajax({
			url: ajaxURL,
			type: 'POST'
		})
			.done(function(data) {
				data = handleServerData(data);
				if (data.IP_result) {
					window.location.href = './unreported.html';
				} else {
					handle_style_betewwn_PC_and_mobile(btnStartLink, form, '开始连接');
					$('.danger').removeClass('hide');
				}
			})
			.fail(function() {
				console.log('error');
			})
	})
}


function pppoe() {
	change_navBar_when_first_load();
	check_pppoe_status();
	var btnStartLink = $('#startLink');
	var form = $('#pppoeForm');
	var wait = $('.wait');
	btnStartLink.on('click', function() {
		var account = $('#account').val();
		var password = $('#password').val();
		handle_style_betewwn_PC_and_mobile(btnStartLink, form, '正在连接');
		$.ajax({
			url: '/initDevice/PPPOEConnStatus',
			type: 'POST',
			data: "name=" + account + "&password=" + password
		})
			.done(function(data) {
				data = handleServerData(data);
				if (data.pppoe_account_result) {
					window.location.href = './unreported.html';
				} else {
					handle_style_betewwn_PC_and_mobile(btnStartLink, form, '开始连接');
					$('.danger').removeClass('hide');
				}
			})
			.fail(function() {
				console.log("error");
			})
	})
}

function detectInterface() {
	var netLine = JSON.parse(getQueryParams('netLine'));
	var thirdG = JSON.parse(getQueryParams('thirdG'));
	var domInfo = $('.info[data-info=detectInterface] h1');
	var btnStep = $('#nextStep');
	if (netLine && thirdG) {
		domInfo.eq(2).toggleClass('hide');
		btnStep.attr('href', 'pppoe.html?netLine=' + netLine + '&thirdG=' + thirdG);
	}
	if (netLine && !thirdG) {
		domInfo.eq(1).toggleClass('hide');
		btnStep.attr('href', 'pppoe.html?netLine=' + netLine + '&thirdG=' + thirdG);
	}
	if (!netLine && thirdG) {
		domInfo.eq(0).toggleClass('hide');
		btnStep.attr('href', '3gNet.html?netLine=' + netLine + '&thirdG=' + thirdG);
	}
	if (!netLine && !thirdG) {
		window.location.href = './404.html';
	}
}

function index() {
	$.ajax({
		url: '/initDevice/CheckEnvironment',
		cache: false
	})
		.done(function(data) {
			data = handleServerData(data);
			if (parseInt(data.status) != 1000) {
				window.location.href = './404.html';
			} else {
				// 如果网络畅通并且是首页初始化时：
				if (g_index) {
					console.log('开始检测网络连接');
					// 有网有3g
					if (data.netLine && data.thirdG) {
						window.location.href = './detectInterface.html?netLine=' + data.netLine + '&thirdG=' + data.thirdG
					}
					// 有网无3g
					if (data.netLine && !data.thirdG) {
						window.location.href = './detectInterface.html?netLine=' + data.netLine + '&thirdG=' + data.thirdG
					}
					// 无网有3g
					if (!data.netLine && data.thirdG) {
						window.location.href = './detectInterface.html?netLine=' + data.netLine + '&thirdG=' + data.thirdG
					}
					// 无网无3g
					if (!data.netLine && !data.thirdG) {
						window.location.href = './detectInterface.html?netLine=' + data.netLine + '&thirdG=' + data.thirdG
					}
				} else {
					window.location.href = './404.html';
				}
			}
		})
		.fail(function(data) {
			console.log("error");
		})
}

function handle_style_betewwn_PC_and_mobile(btnStartLink, form, text) {
	var screenWidth = $(window).width();
	var mobileWidth = 768;
	var iconRefresh = $('.m-refresh');
	var wait = $('.wait');
	if (screenWidth < mobileWidth) {
		iconRefresh.toggleClass('hide');
		btnStartLink.children('button').text(text);
	} else {
		if (text === '正在连接') {
			form.hide();
		} else {
			form.show();
		}
		wait.toggleClass('hide');
	}
}

function check_pppoe_status() {
	$.ajax({
		url: '/initDevice/DoPPPoe',
		type: "POST"
	})
		.done(function(data) {
			data = handleServerData(data);
			if (data.account.online) {
				var name = $('#account');
				var password = $('#password');
				name.addClass('logged');
				password.addClass('logged');
				name.val(data.account.name);
				password.val(data.account.password);
			} else {
				console.log('不在线！');
			}
		})
}

function check_staticIp_status() {
	$.ajax({
		url: './initDevice/DoPPPoe',
		type: "POST"
	})
		.done(function(data) {
			data = handleServerData(data);
			if (data.account.online) {
				var name = $('#account');
				var password = $('#password');
				name.addClass('logged');
				password.addClass('logged');
				name.val(data.account.name);
				password.val(data.account.password);
			} else {
				console.log('不在线！');
			}
		})
}

function change_navBar_when_first_load() {
	var netLine = JSON.parse(getQueryParams('netLine'));
	var thirdG = JSON.parse(getQueryParams('thirdG'));
	var navList = $('.container .title li');
	var nav_tag_a = navList.children('a');
	if (netLine && thirdG) {
		nav_tag_a.each(function() {
			$(this).attr('href', $(this).attr('href') + '?netLine=' + netLine + '&thirdG=' + thirdG)
		})
	}
	if (!netLine) {
		nav_tag_a.eq(0).attr('href', 'unable-pppoe.html');
		nav_tag_a.eq(1).attr('href', 'unable-staticIp.html');
		nav_tag_a.eq(2).attr('href', '3gNet.html?netLine=' + netLine + '&thirdG=' + thirdG);
	}
	if (!thirdG) {
		nav_tag_a.eq(0).attr('href', 'pppoe.html?netLine=' + netLine + '&thirdG=' + thirdG);
		nav_tag_a.eq(1).attr('href', 'staticIp.html?netLine=' + netLine + '&thirdG=' + thirdG);
		navList.eq(2).hide();
	}
}

function handleServerData(data) {
	if (typeof(data) == 'string') {
		data = JSON.parse(data);
	}
	var result = {};
	result.status = data['status'];
	result.netLine = data['isWan'];
	result.thirdG = data['is3G'];
	result.account = data['account'];
	result.usim = data['usim'];
	result.usim_check = data['balance'];
	result.pppoe_account_result = data['status'];
	return result;
}

function getQueryParams(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

var originAjax = $.ajax;
$.ajax = function(option) {
	var delay = Math.random() * 1000 + 900;
	var _this = this;
	var deferred = $.Deferred();
	setTimeout(function() {
		originAjax.call(_this, option).done(function(data) {
			deferred.resolve(data)
		}).fail(function() {
			deferred.reject()
		});
	}, delay)
	return deferred.promise();
};