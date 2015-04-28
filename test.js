(function () {
	// require jQuery, Urls, User

	// Apps
	var AppAjaxCache = AjaxCache.extend({
		key: 'xsm_apps_' + User.comId + '_' + User.type,
		expire: 60 * 60 * 1000, // 缓存过期时间为 1 小时
		ajaxParam: {
			url: Urls.getApp,
			data: {
				siteCode: User.comId,
				userType: User.type,
				app_status: 2,
				install_status: 1
			},
			dataType: "jsonp"
		}
	});

	// BrandCenter
	var BrandCenterAjax = AjaxCache.extend({
		key: 'xsm_brand_center_' + User.comId + '_' + User.type,
		expire: 60 * 60 * 1000,
		ajaxParam: {
			url: Urls.ac + 'store/appRestService.do?method=getAppByGroup&id=00002',
			data: {
				siteCode: User.comId,
				userType: User.type
			},
			dataType: 'jsonp'
		}
	});

	// MAIN
	new AppAjaxCache().done(function (data) {
		// render Apps
	}).getData().then(function () {
		new BrandCenterAjax().done(function (data) {
			//render BrandCenter
		}).getData();
	});
})();