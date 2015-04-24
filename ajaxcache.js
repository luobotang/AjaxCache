(function (factory) {

	if (window.jQuery) {
		window.AjaxCache = factory(window.jQuery);
	} else {
		if (console && console.log) {
			console.log('AjaxCache require jQuery.js');
		}
	}

})(function ($) {

	function AjaxCache(options) {
		this.deferred = new $.Deferred();
		this.deferred.promise(this);
	}

	AjaxCache.extend = function (options) {
		function Fn() {}
		Fn.prototype = AjaxCache.prototype;

		function constructor() {
			AjaxCache.apply(this, arguments);
		}
		constructor.prototype = $.extend(new Fn(), options);

		return constructor;
	};

	AjaxCache.prototype = {
		// 是否输出数据校验错误信息
		debug: false,
		// 缺省过期时间为一星期
		expire: 7 * 24 * 60 * 60 * 1000,
		// 提前判断当前环境能否使用本地缓存，IE8+ 支持
		canCache: !!(window.localStorage && window.JSON && window.JSON.parse),
		// ！必须覆盖为实际需要的本地缓存的标识名称，用于区分不同类型数据
		key: 'ajax_cache',
		// ajax 数据验证失败后，是否尝试使用之前验证失败的缓存数据
		// 由于过期导致的缓存失败，建议重用
		// 其他原因，如请求参数类型不同导致的缓存失效，不建议重用
		useDirtyCacheIfAjaxFail: true,
		getData: function () {
			var state = this.state();
			if (state !== 'resolved' && state !== 'rejected') {
				this.cacheData = this.getCache();
				if (this.cacheData) {
					if (this._validateCache(this.cacheData)) {
						this.deferred.resolve(this.cache2data(this.cacheData));
						return this;
					}
				}
				this.ajax();
			}
			return this;
		},
		ajax: function () {
			var self = this;
			$.ajax(self._ajaxParam()).done(function (data) {
				self.ajaxDone(data);
			}).always(function () {
				self.ajaxFail();
			});
		},
		_ajaxParam: function () {
			if (typeof this.ajaxParam === 'function') {
				return this.ajaxParam();
			} else {
				return this.ajaxParam || {};
			}
		},
		ajaxDone: function (data) {
			if (this._validateAjax(data)) {
				this.setCache(this.data2cache(data));
				this.deferred.resolve(data);
			}
		},
		ajaxFail: function () {
			if (this.canCache && this.useDirtyCacheIfAjaxFail) {
				this.deferred.resolve(this.cacheData);
			} else {
				this.deferred.reject();
			}
		},
		// 缺省在 cache 数据中加入时间信息，原始数据保存在 data 属性中
		data2cache: function (data) {
			return {
				time: +new Date(),
				data: data
			};
		},
		cache2data: function (cache) {
			return cache ? cache.data : null;
		},
		getCache: function () {
			if (this.canCache) {
				var cache = window.localStorage.getItem(this.key);
				if (cache) {
					return window.JSON.parse(cache);
				}
			}
			return null;
		},
		setCache: function (cacheData) {
			if (this.canCache) {
				window.localStorage.setItem(this.key, window.JSON.stringify(cacheData));
			}
		},
		_validateAjax: function (ajaxData) {
			return this._validate('Ajax', ajaxData);
		},
		_validateCache: function (cacheData) {
			return this._validate('Cache', cacheData);
		},
		_validate: function (type, data) {
			var validateMethod = 'validate' + type;
			if (this[validateMethod]) {
				var error = this[validateMethod](data);
				if (error) {
					this[validateMethod + 'Error'] = error;
					if (this.debug && window.console) {
						window.console.log('[' + this.key + '] validate ' + type + ' error: ' + error);
					}
					return false;
				}
			}
			return true;
		},
		// 缺省 Ajax 数据验证方法
		validateAjax: function (data) {
			if (!data) {
				return 'data is empty';
			}
		},
		// 缺省缓存验证方法
		validateCache: function (cacheData) {
			if (!cacheData) {
				return 'no cache data';
			}
			if (+new Date() - cacheData.time > this.expire) {
				return 'cache expire';
			}
		}
	};

	return AjaxCache;
});