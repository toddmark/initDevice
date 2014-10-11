var URL = window.location.href;

$(function() {
	if (g_index) {
		index();
	}
	if (URL.indexOf('detectInterface') > 0) {
		detectInterface();
	}
	if (URL.indexOf('ppoe') > 0) {
		ppoe();
	}
	if (URL.indexOf('unreported') > 0) {
		unreported();
	}
	if (URL.indexOf('staticIp') > 0) {
		staticIp();
	}
})

function staticIp() {
	var btnStartLink = $('#startLink');
	var form = $('#staticIp_form');
	var wait = $('.wait');
	btnStartLink.on('click', function() {
		handle_style_betewwn_PC_and_mobile(btnStartLink, form, '正在连接');
		$.ajax({
			url: 'conf.json',
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

function unreported() {
	var eleVar = $('var');
	var btnA = $('#needReport');
	var index = 5;
	setInterval(function() {
		index--;
		eleVar.text(index);
		if (index == 0) {
			window.location.href = btnA.attr('href');
		}
	}, 1000)
}

function ppoe() {
	var btnStartLink = $('#startLink');
	var form = $('#ppoeForm');
	var wait = $('.wait');
	btnStartLink.on('click', function() {
		var account = $('#account').val();
		var password = $('#password').val();
		handle_style_betewwn_PC_and_mobile(btnStartLink, form, '正在连接');
		$.ajax({
			url: 'conf.json',
			type: 'POST',
			data: "name=" + account + "&password=" + password
		})
			.done(function(data) {
				data = handleServerData(data);
				if (data.ppoe_account_result) {
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
		btnStep.attr('href', 'ppoe.html');
	}
	if (netLine && !thirdG) {
		domInfo.eq(1).toggleClass('hide');
		btnStep.attr('href', 'ppoe.html');
	}
	if (!netLine && thirdG) {
		domInfo.eq(0).toggleClass('hide');
		btnStep.attr('href', '3gNet.html');
	}
	if (!netLine && !thirdG) {
		window.location.href = './404.html';
	}
}

function index() {
	$.ajax({
		url: '/conf.json?' + Math.random(),
		dataType: 'json'
	})
		.done(function(data) {
			data = handleServerData(data);
			if (data.status != 1000) {
				window.location.href = './404.html';
			} else {
				// 如果网络畅通并且是首页初始化时：
				if (data.initDetect && g_index) {
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

function handleServerData(data) {

	return data;
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