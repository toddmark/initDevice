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

	}
})

function ppoe() {
	var btnStartLink = $('#startLink');
	var form = $('#ppoeForm');
	var wait = $('.wait');
	var mobileWidth = 768;
	btnStartLink.on('click', function() {
		var screenWidth = $(window).width();
		var account = $('#account').val();
		var password = $('#password').val();
		if (screenWidth < mobileWidth) {

		} else {
			form.hide();
			wait.toggleClass('hide');
		}
		$.ajax({
			url: 'conf.json',
			type: 'POST',
			data: "name=" + account + "&password=" + password
		})
			.done(function(data) {
				data = handleServerData(data);
				if (data.valudate_result) {
					window.location.href = './unreported.html';
				} else {
					if (screenWidth < mobileWidth) {

					} else {
						form.show();
						wait.toggleClass('hide');
						$('.danger').removeClass('hide');
					}
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
	}
	if (!netLine && thirdG) {
		domInfo.eq(0).toggleClass('hide');
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
						window.location.href = './detectInterface.html?netLine=true&thirdG=true'
					}
					// 有网无3g
					if (data.netLine && !data.thirdG) {
						window.location.href = './detectInterface.html?netLine=true&thirdG=true'
					}
					// 无网有3g
					if (!data.netLine && data.thirdG) {
						window.location.href = './detectInterface.html?netLine=true&thirdG=true'
					}
					// 无网无3g
					if (!data.netLine && !data.thirdG) {
						window.location.href = './detectInterface.html?netLine=true&thirdG=true'
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

function handleServerData(data) {

	return data;
}

function getQueryParams(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}