/*! powerbi-client v2.3.1-master.17142.1 | (c) 2016 Microsoft Corporation MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["powerbi-client"] = factory();
	else
		root["powerbi-client"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var service = __webpack_require__(1);
	exports.service = service;
	var factories = __webpack_require__(10);
	exports.factories = factories;
	var models = __webpack_require__(5);
	exports.models = models;
	var report_1 = __webpack_require__(4);
	exports.Report = report_1.Report;
	var tile_1 = __webpack_require__(9);
	exports.Tile = tile_1.Tile;
	var embed_1 = __webpack_require__(2);
	exports.Embed = embed_1.Embed;
	var page_1 = __webpack_require__(6);
	exports.Page = page_1.Page;
	/**
	 * Makes Power BI available to the global object for use in applications that don't have module loading support.
	 *
	 * Note: create an instance of the class with the default configuration for normal usage, or save the class so that you can create an instance of the service.
	 */
	var powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
	window.powerbi = powerbi;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var embed = __webpack_require__(2);
	var report_1 = __webpack_require__(4);
	var create_1 = __webpack_require__(7);
	var dashboard_1 = __webpack_require__(8);
	var tile_1 = __webpack_require__(9);
	var page_1 = __webpack_require__(6);
	var utils = __webpack_require__(3);
	/**
	 * The Power BI Service embed component, which is the entry point to embed all other Power BI components into your application
	 *
	 * @export
	 * @class Service
	 * @implements {IService}
	 */
	var Service = (function () {
	    /**
	     * Creates an instance of a Power BI Service.
	     *
	     * @param {IHpmFactory} hpmFactory The http post message factory used in the postMessage communication layer
	     * @param {IWpmpFactory} wpmpFactory The window post message factory used in the postMessage communication layer
	     * @param {IRouterFactory} routerFactory The router factory used in the postMessage communication layer
	     * @param {IServiceConfiguration} [config={}]
	     */
	    function Service(hpmFactory, wpmpFactory, routerFactory, config) {
	        var _this = this;
	        if (config === void 0) { config = {}; }
	        this.wpmp = wpmpFactory(config.wpmpName, config.logMessages);
	        this.hpm = hpmFactory(this.wpmp, null, config.version, config.type);
	        this.router = routerFactory(this.wpmp);
	        /**
	         * Adds handler for report events.
	         */
	        this.router.post("/reports/:uniqueId/events/:eventName", function (req, res) {
	            var event = {
	                type: 'report',
	                id: req.params.uniqueId,
	                name: req.params.eventName,
	                value: req.body
	            };
	            _this.handleEvent(event);
	        });
	        this.router.post("/reports/:uniqueId/pages/:pageName/events/:eventName", function (req, res) {
	            var event = {
	                type: 'report',
	                id: req.params.uniqueId,
	                name: req.params.eventName,
	                value: req.body
	            };
	            _this.handleEvent(event);
	        });
	        this.router.post("/dashboards/:uniqueId/events/:eventName", function (req, res) {
	            var event = {
	                type: 'dashboard',
	                id: req.params.uniqueId,
	                name: req.params.eventName,
	                value: req.body
	            };
	            _this.handleEvent(event);
	        });
	        this.embeds = [];
	        // TODO: Change when Object.assign is available.
	        this.config = utils.assign({}, Service.defaultConfig, config);
	        if (this.config.autoEmbedOnContentLoaded) {
	            this.enableAutoEmbed();
	        }
	    }
	    /**
	     * Creates new report
	     * @param {HTMLElement} element
	     * @param {embed.IEmbedConfiguration} [config={}]
	     * @returns {embed.Embed}
	     */
	    Service.prototype.createReport = function (element, config) {
	        config.type = 'create';
	        var powerBiElement = element;
	        var component = new create_1.Create(this, powerBiElement, config);
	        powerBiElement.powerBiEmbed = component;
	        this.addOrOverwriteEmbed(component, element);
	        return component;
	    };
	    /**
	     * TODO: Add a description here
	     *
	     * @param {HTMLElement} [container]
	     * @param {embed.IEmbedConfiguration} [config=undefined]
	     * @returns {embed.Embed[]}
	     */
	    Service.prototype.init = function (container, config) {
	        var _this = this;
	        if (config === void 0) { config = undefined; }
	        container = (container && container instanceof HTMLElement) ? container : document.body;
	        var elements = Array.prototype.slice.call(container.querySelectorAll("[" + embed.Embed.embedUrlAttribute + "]"));
	        return elements.map(function (element) { return _this.embed(element, config); });
	    };
	    /**
	     * Given a configuration based on an HTML element,
	     * if the component has already been created and attached to the element, reuses the component instance and existing iframe,
	     * otherwise creates a new component instance.
	     *
	     * @param {HTMLElement} element
	     * @param {embed.IEmbedConfiguration} [config={}]
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embed = function (element, config) {
	        if (config === void 0) { config = {}; }
	        var component;
	        var powerBiElement = element;
	        if (powerBiElement.powerBiEmbed) {
	            component = this.embedExisting(powerBiElement, config);
	        }
	        else {
	            component = this.embedNew(powerBiElement, config);
	        }
	        return component;
	    };
	    /**
	     * Given a configuration based on a Power BI element, saves the component instance that reference the element for later lookup.
	     *
	     * @private
	     * @param {IPowerBiElement} element
	     * @param {embed.IEmbedConfiguration} config
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embedNew = function (element, config) {
	        var componentType = config.type || element.getAttribute(embed.Embed.typeAttribute);
	        if (!componentType) {
	            throw new Error("Attempted to embed using config " + JSON.stringify(config) + " on element " + element.outerHTML + ", but could not determine what type of component to embed. You must specify a type in the configuration or as an attribute such as '" + embed.Embed.typeAttribute + "=\"" + report_1.Report.type.toLowerCase() + "\"'.");
	        }
	        // Saves the type as part of the configuration so that it can be referenced later at a known location.
	        config.type = componentType;
	        var Component = utils.find(function (component) { return componentType === component.type.toLowerCase(); }, Service.components);
	        if (!Component) {
	            throw new Error("Attempted to embed component of type: " + componentType + " but did not find any matching component.  Please verify the type you specified is intended.");
	        }
	        var component = new Component(this, element, config);
	        element.powerBiEmbed = component;
	        this.addOrOverwriteEmbed(component, element);
	        return component;
	    };
	    /**
	     * Given an element that already contains an embed component, load with a new configuration.
	     *
	     * @private
	     * @param {IPowerBiElement} element
	     * @param {embed.IEmbedConfiguration} config
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embedExisting = function (element, config) {
	        var component = utils.find(function (x) { return x.element === element; }, this.embeds);
	        if (!component) {
	            throw new Error("Attempted to embed using config " + JSON.stringify(config) + " on element " + element.outerHTML + " which already has embedded comopnent associated, but could not find the existing comopnent in the list of active components. This could indicate the embeds list is out of sync with the DOM, or the component is referencing the incorrect HTML element.");
	        }
	        /**
	         * TODO: Dynamic embed type switching could be supported but there is work needed to prepare the service state and DOM cleanup.
	         * remove all event handlers from the DOM, then reset the element to initial state which removes iframe, and removes from list of embeds
	         * then we can call the embedNew function which would allow setting the proper embedUrl and construction of object based on the new type.
	         */
	        if (typeof config.type === "string" && config.type !== component.config.type) {
	            /**
	             * When loading report after create we want to use existing Iframe to optimize load period
	             */
	            if (config.type === "report" && component.config.type === "create") {
	                var report = new report_1.Report(this, element, config, element.powerBiEmbed.iframe);
	                report.load(config);
	                element.powerBiEmbed = report;
	                this.addOrOverwriteEmbed(component, element);
	                return report;
	            }
	            throw new Error("Embedding on an existing element with a different type than the previous embed object is not supported.  Attempted to embed using config " + JSON.stringify(config) + " on element " + element.outerHTML + ", but the existing element contains an embed of type: " + this.config.type + " which does not match the new type: " + config.type);
	        }
	        component.load(config);
	        return component;
	    };
	    /**
	     * Adds an event handler for DOMContentLoaded, which searches the DOM for elements that have the 'powerbi-embed-url' attribute,
	     * and automatically attempts to embed a powerbi component based on information from other powerbi-* attributes.
	     *
	     * Note: Only runs if `config.autoEmbedOnContentLoaded` is true when the service is created.
	     * This handler is typically useful only for applications that are rendered on the server so that all required data is available when the handler is called.
	     */
	    Service.prototype.enableAutoEmbed = function () {
	        var _this = this;
	        window.addEventListener('DOMContentLoaded', function (event) { return _this.init(document.body); }, false);
	    };
	    /**
	     * Returns an instance of the component associated with the element.
	     *
	     * @param {HTMLElement} element
	     * @returns {(Report | Tile)}
	     */
	    Service.prototype.get = function (element) {
	        var powerBiElement = element;
	        if (!powerBiElement.powerBiEmbed) {
	            throw new Error("You attempted to get an instance of powerbi component associated with element: " + element.outerHTML + " but there was no associated instance.");
	        }
	        return powerBiElement.powerBiEmbed;
	    };
	    /**
	     * Finds an embed instance by the name or unique ID that is provided.
	     *
	     * @param {string} uniqueId
	     * @returns {(Report | Tile)}
	     */
	    Service.prototype.find = function (uniqueId) {
	        return utils.find(function (x) { return x.config.uniqueId === uniqueId; }, this.embeds);
	    };
	    Service.prototype.addOrOverwriteEmbed = function (component, element) {
	        // remove embeds over the same div element.
	        this.embeds = this.embeds.filter(function (embed) {
	            return embed.element.id !== element.id;
	        });
	        this.embeds.push(component);
	    };
	    /**
	     * Given an HTML element that has a component embedded within it, removes the component from the list of embedded components, removes the association between the element and the component, and removes the iframe.
	     *
	     * @param {HTMLElement} element
	     * @returns {void}
	     */
	    Service.prototype.reset = function (element) {
	        var powerBiElement = element;
	        if (!powerBiElement.powerBiEmbed) {
	            return;
	        }
	        /** Removes the component from an internal list of components. */
	        utils.remove(function (x) { return x === powerBiElement.powerBiEmbed; }, this.embeds);
	        /** Deletes a property from the HTML element. */
	        delete powerBiElement.powerBiEmbed;
	        /** Removes the iframe from the element. */
	        var iframe = element.querySelector('iframe');
	        if (iframe) {
	            if (iframe.remove !== undefined) {
	                iframe.remove();
	            }
	            else {
	                /** Workaround for IE: unhandled rejection TypeError: object doesn't support propert or method 'remove' */
	                iframe.parentElement.removeChild(iframe);
	            }
	        }
	    };
	    /**
	     * Given an event object, finds the embed component with the matching type and ID, and invokes its handleEvent method with the event object.
	     *
	     * @private
	     * @param {IEvent<any>} event
	     */
	    Service.prototype.handleEvent = function (event) {
	        var embed = utils.find(function (embed) {
	            return (embed.config.uniqueId === event.id);
	        }, this.embeds);
	        if (embed) {
	            var value = event.value;
	            if (event.name === 'pageChanged') {
	                var pageKey = 'newPage';
	                var page = value[pageKey];
	                if (!page) {
	                    throw new Error("Page model not found at 'event.value." + pageKey + "'.");
	                }
	                value[pageKey] = new page_1.Page(embed, page.name, page.displayName);
	            }
	            utils.raiseCustomEvent(embed.element, event.name, value);
	        }
	    };
	    /**
	     * A list of components that this service can embed
	     */
	    Service.components = [
	        tile_1.Tile,
	        report_1.Report,
	        dashboard_1.Dashboard
	    ];
	    /**
	     * The default configuration for the service
	     */
	    Service.defaultConfig = {
	        autoEmbedOnContentLoaded: false,
	        onError: function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i - 0] = arguments[_i];
	            }
	            return console.log(args[0], args.slice(1));
	        }
	    };
	    return Service;
	}());
	exports.Service = Service;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(3);
	/**
	 * Base class for all Power BI embed components
	 *
	 * @export
	 * @abstract
	 * @class Embed
	 */
	var Embed = (function () {
	    /**
	     * Creates an instance of Embed.
	     *
	     * Note: there is circular reference between embeds and the service, because
	     * the service has a list of all embeds on the host page, and each embed has a reference to the service that created it.
	     *
	     * @param {service.Service} service
	     * @param {HTMLElement} element
	     * @param {IEmbedConfiguration} config
	     */
	    function Embed(service, element, config, iframe) {
	        this.allowedEvents = [];
	        Array.prototype.push.apply(this.allowedEvents, Embed.allowedEvents);
	        this.eventHandlers = [];
	        this.service = service;
	        this.element = element;
	        this.iframe = iframe;
	        this.embeType = config.type.toLowerCase();
	        this.populateConfig(config);
	        if (this.embeType === 'create') {
	            this.setIframe(false /*set EventListener to call create() on 'load' event*/);
	        }
	        else {
	            this.setIframe(true /*set EventListener to call load() on 'load' event*/);
	        }
	    }
	    /**
	     * Sends createReport configuration data.
	     *
	     * ```javascript
	     * createReport({
	     *   datasetId: '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
	     *   accessToken: 'eyJ0eXA ... TaE2rTSbmg',
	     * ```
	     *
	     * @param {models.IReportCreateConfiguration} config
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.createReport = function (config) {
	        var errors = this.validate(config);
	        if (errors) {
	            throw errors;
	        }
	        return this.service.hpm.post("/report/create", config, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Saves Report.
	     *
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.save = function () {
	        return this.service.hpm.post('/report/save', null, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * SaveAs Report.
	     *
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.saveAs = function (saveAsParameters) {
	        return this.service.hpm.post('/report/saveAs', saveAsParameters, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Sends load configuration data.
	     *
	     * ```javascript
	     * report.load({
	     *   type: 'report',
	     *   id: '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
	     *   accessToken: 'eyJ0eXA ... TaE2rTSbmg',
	     *   settings: {
	     *     navContentPaneEnabled: false
	     *   },
	     *   pageName: "DefaultPage",
	     *   filters: [
	     *     {
	     *        ...  DefaultReportFilter ...
	     *     }
	     *   ]
	     * })
	     *   .catch(error => { ... });
	     * ```
	     *
	     * @param {models.ILoadConfiguration} config
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.load = function (config) {
	        var _this = this;
	        var errors = this.validate(config);
	        if (errors) {
	            throw errors;
	        }
	        return this.service.hpm.post(this.loadPath, config, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            utils.assign(_this.config, config);
	            return response.body;
	        }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Removes one or more event handlers from the list of handlers.
	     * If a reference to the existing handle function is specified, remove the specific handler.
	     * If the handler is not specified, remove all handlers for the event name specified.
	     *
	     * ```javascript
	     * report.off('pageChanged')
	     *
	     * or
	     *
	     * const logHandler = function (event) {
	     *    console.log(event);
	     * };
	     *
	     * report.off('pageChanged', logHandler);
	     * ```
	     *
	     * @template T
	     * @param {string} eventName
	     * @param {service.IEventHandler<T>} [handler]
	     */
	    Embed.prototype.off = function (eventName, handler) {
	        var _this = this;
	        var fakeEvent = { name: eventName, type: null, id: null, value: null };
	        if (handler) {
	            utils.remove(function (eventHandler) { return eventHandler.test(fakeEvent) && (eventHandler.handle === handler); }, this.eventHandlers);
	            this.element.removeEventListener(eventName, handler);
	        }
	        else {
	            var eventHandlersToRemove = this.eventHandlers
	                .filter(function (eventHandler) { return eventHandler.test(fakeEvent); });
	            eventHandlersToRemove
	                .forEach(function (eventHandlerToRemove) {
	                utils.remove(function (eventHandler) { return eventHandler === eventHandlerToRemove; }, _this.eventHandlers);
	                _this.element.removeEventListener(eventName, eventHandlerToRemove.handle);
	            });
	        }
	    };
	    /**
	     * Adds an event handler for a specific event.
	     *
	     * ```javascript
	     * report.on('pageChanged', (event) => {
	     *   console.log('PageChanged: ', event.page.name);
	     * });
	     * ```
	     *
	     * @template T
	     * @param {string} eventName
	     * @param {service.IEventHandler<T>} handler
	     */
	    Embed.prototype.on = function (eventName, handler) {
	        if (this.allowedEvents.indexOf(eventName) === -1) {
	            throw new Error("eventName is must be one of " + this.allowedEvents + ". You passed: " + eventName);
	        }
	        this.eventHandlers.push({
	            test: function (event) { return event.name === eventName; },
	            handle: handler
	        });
	        this.element.addEventListener(eventName, handler);
	    };
	    /**
	     * Reloads embed using existing configuration.
	     * E.g. For reports this effectively clears all filters and makes the first page active which simulates resetting a report back to loaded state.
	     *
	     * ```javascript
	     * report.reload();
	     * ```
	     */
	    Embed.prototype.reload = function () {
	        return this.load(this.config);
	    };
	    /**
	     * Set accessToken.
	     *
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.setAccessToken = function (accessToken) {
	        return this.service.hpm.post('/report/token', accessToken, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Gets an access token from the first available location: config, attribute, global.
	     *
	     * @private
	     * @param {string} globalAccessToken
	     * @returns {string}
	     */
	    Embed.prototype.getAccessToken = function (globalAccessToken) {
	        var accessToken = this.config.accessToken || this.element.getAttribute(Embed.accessTokenAttribute) || globalAccessToken;
	        if (!accessToken) {
	            throw new Error("No access token was found for element. You must specify an access token directly on the element using attribute '" + Embed.accessTokenAttribute + "' or specify a global token at: powerbi.accessToken.");
	        }
	        return accessToken;
	    };
	    /**
	     * Populate config for create and load
	     *
	     * @private
	     * @param {IEmbedConfiguration}
	     * @returns {void}
	     */
	    Embed.prototype.populateConfig = function (config) {
	        // TODO: Change when Object.assign is available.
	        var settings = utils.assign({}, Embed.defaultSettings, config.settings);
	        this.config = utils.assign({ settings: settings }, config);
	        this.config.uniqueId = this.getUniqueId();
	        this.config.embedUrl = this.getEmbedUrl();
	        if (this.embeType === 'create') {
	            this.createConfig = {
	                datasetId: config.datasetId || this.getId(),
	                accessToken: this.getAccessToken(this.service.accessToken),
	                tokenType: config.tokenType,
	                settings: settings
	            };
	        }
	        else {
	            this.config.id = this.getId();
	            this.config.accessToken = this.getAccessToken(this.service.accessToken);
	        }
	    };
	    /**
	     * Gets an embed url from the first available location: options, attribute.
	     *
	     * @private
	     * @returns {string}
	     */
	    Embed.prototype.getEmbedUrl = function () {
	        var embedUrl = this.config.embedUrl || this.element.getAttribute(Embed.embedUrlAttribute);
	        if (typeof embedUrl !== 'string' || embedUrl.length === 0) {
	            throw new Error("Embed Url is required, but it was not found. You must provide an embed url either as part of embed configuration or as attribute '" + Embed.embedUrlAttribute + "'.");
	        }
	        return embedUrl;
	    };
	    /**
	     * Gets a unique ID from the first available location: options, attribute.
	     * If neither is provided generate a unique string.
	     *
	     * @private
	     * @returns {string}
	     */
	    Embed.prototype.getUniqueId = function () {
	        return this.config.uniqueId || this.element.getAttribute(Embed.nameAttribute) || utils.createRandomString();
	    };
	    /**
	     * Requests the browser to render the component's iframe in fullscreen mode.
	     */
	    Embed.prototype.fullscreen = function () {
	        var requestFullScreen = this.iframe.requestFullscreen || this.iframe.msRequestFullscreen || this.iframe.mozRequestFullScreen || this.iframe.webkitRequestFullscreen;
	        requestFullScreen.call(this.iframe);
	    };
	    /**
	     * Requests the browser to exit fullscreen mode.
	     */
	    Embed.prototype.exitFullscreen = function () {
	        if (!this.isFullscreen(this.iframe)) {
	            return;
	        }
	        var exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
	        exitFullscreen.call(document);
	    };
	    /**
	     * Returns true if the iframe is rendered in fullscreen mode,
	     * otherwise returns false.
	     *
	     * @private
	     * @param {HTMLIFrameElement} iframe
	     * @returns {boolean}
	     */
	    Embed.prototype.isFullscreen = function (iframe) {
	        var options = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullscreenScreenElement', 'msFullscreenElement'];
	        return options.some(function (option) { return document[option] === iframe; });
	    };
	    /**
	     * Sets Iframe for embed
	     */
	    Embed.prototype.setIframe = function (isLoad) {
	        var _this = this;
	        if (!this.iframe) {
	            var iframeContent = document.createElement("iframe");
	            var embedUrl = this.config.embedUrl;
	            iframeContent.setAttribute("style", "width:100%;height:100%;");
	            iframeContent.setAttribute("src", embedUrl);
	            iframeContent.setAttribute("scrolling", "no");
	            iframeContent.setAttribute("allowfullscreen", "true");
	            var node = this.element;
	            while (node.firstChild) {
	                node.removeChild(node.firstChild);
	            }
	            node.appendChild(iframeContent);
	            this.iframe = node.firstChild;
	        }
	        if (isLoad) {
	            this.iframe.addEventListener('load', function () { return _this.load(_this.config); }, false);
	        }
	        else {
	            this.iframe.addEventListener('load', function () { return _this.createReport(_this.createConfig); }, false);
	        }
	    };
	    Embed.allowedEvents = ["loaded", "saved", "rendered", "saveAsTriggered", "error", "dataSelected"];
	    Embed.accessTokenAttribute = 'powerbi-access-token';
	    Embed.embedUrlAttribute = 'powerbi-embed-url';
	    Embed.nameAttribute = 'powerbi-name';
	    Embed.typeAttribute = 'powerbi-type';
	    Embed.defaultSettings = {
	        filterPaneEnabled: true
	    };
	    return Embed;
	}());
	exports.Embed = Embed;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * Raises a custom event with event data on the specified HTML element.
	 *
	 * @export
	 * @param {HTMLElement} element
	 * @param {string} eventName
	 * @param {*} eventData
	 */
	function raiseCustomEvent(element, eventName, eventData) {
	    var customEvent;
	    if (typeof CustomEvent === 'function') {
	        customEvent = new CustomEvent(eventName, {
	            detail: eventData,
	            bubbles: true,
	            cancelable: true
	        });
	    }
	    else {
	        customEvent = document.createEvent('CustomEvent');
	        customEvent.initCustomEvent(eventName, true, true, eventData);
	    }
	    element.dispatchEvent(customEvent);
	}
	exports.raiseCustomEvent = raiseCustomEvent;
	/**
	 * Finds the index of the first value in an array that matches the specified predicate.
	 *
	 * @export
	 * @template T
	 * @param {(x: T) => boolean} predicate
	 * @param {T[]} xs
	 * @returns {number}
	 */
	function findIndex(predicate, xs) {
	    if (!Array.isArray(xs)) {
	        throw new Error("You attempted to call find with second parameter that was not an array. You passed: " + xs);
	    }
	    var index;
	    xs.some(function (x, i) {
	        if (predicate(x)) {
	            index = i;
	            return true;
	        }
	    });
	    return index;
	}
	exports.findIndex = findIndex;
	/**
	 * Finds the first value in an array that matches the specified predicate.
	 *
	 * @export
	 * @template T
	 * @param {(x: T) => boolean} predicate
	 * @param {T[]} xs
	 * @returns {T}
	 */
	function find(predicate, xs) {
	    var index = findIndex(predicate, xs);
	    return xs[index];
	}
	exports.find = find;
	function remove(predicate, xs) {
	    var index = findIndex(predicate, xs);
	    xs.splice(index, 1);
	}
	exports.remove = remove;
	// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	// TODO: replace in favor of using polyfill
	/**
	 * Copies the values of all enumerable properties from one or more source objects to a target object, and returns the target object.
	 *
	 * @export
	 * @param {any} args
	 * @returns
	 */
	function assign() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i - 0] = arguments[_i];
	    }
	    var target = args[0];
	    'use strict';
	    if (target === undefined || target === null) {
	        throw new TypeError('Cannot convert undefined or null to object');
	    }
	    var output = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	        var source = arguments[index];
	        if (source !== undefined && source !== null) {
	            for (var nextKey in source) {
	                if (source.hasOwnProperty(nextKey)) {
	                    output[nextKey] = source[nextKey];
	                }
	            }
	        }
	    }
	    return output;
	}
	exports.assign = assign;
	/**
	 * Generates a random 7 character string.
	 *
	 * @export
	 * @returns {string}
	 */
	function createRandomString() {
	    return (Math.random() + 1).toString(36).substring(7);
	}
	exports.createRandomString = createRandomString;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var embed = __webpack_require__(2);
	var models = __webpack_require__(5);
	var utils = __webpack_require__(3);
	var page_1 = __webpack_require__(6);
	/**
	 * The Power BI Report embed component
	 *
	 * @export
	 * @class Report
	 * @extends {embed.Embed}
	 * @implements {IReportNode}
	 * @implements {IFilterable}
	 */
	var Report = (function (_super) {
	    __extends(Report, _super);
	    /**
	     * Creates an instance of a Power BI Report.
	     *
	     * @param {service.Service} service
	     * @param {HTMLElement} element
	     * @param {embed.IEmbedConfiguration} config
	     */
	    function Report(service, element, config, iframe) {
	        var filterPaneEnabled = (config.settings && config.settings.filterPaneEnabled) || !(element.getAttribute(Report.filterPaneEnabledAttribute) === "false");
	        var navContentPaneEnabled = (config.settings && config.settings.navContentPaneEnabled) || !(element.getAttribute(Report.navContentPaneEnabledAttribute) === "false");
	        var settings = utils.assign({
	            filterPaneEnabled: filterPaneEnabled,
	            navContentPaneEnabled: navContentPaneEnabled
	        }, config.settings);
	        var configCopy = utils.assign({ settings: settings }, config);
	        _super.call(this, service, element, configCopy, iframe);
	        this.loadPath = "/report/load";
	        Array.prototype.push.apply(this.allowedEvents, Report.allowedEvents);
	    }
	    /**
	     * Adds backwards compatibility for the previous load configuration, which used the reportId query parameter to specify the report ID
	     * (e.g. http://embedded.powerbi.com/appTokenReportEmbed?reportId=854846ed-2106-4dc2-bc58-eb77533bf2f1).
	     *
	     * By extracting the ID we can ensure that the ID is always explicitly provided as part of the load configuration.
	     *
	     * @static
	     * @param {string} url
	     * @returns {string}
	     */
	    Report.findIdFromEmbedUrl = function (url) {
	        var reportIdRegEx = /reportId="?([^&]+)"?/;
	        var reportIdMatch = url.match(reportIdRegEx);
	        var reportId;
	        if (reportIdMatch) {
	            reportId = reportIdMatch[1];
	        }
	        return reportId;
	    };
	    /**
	     * Gets filters that are applied at the report level.
	     *
	     * ```javascript
	     * // Get filters applied at report level
	     * report.getFilters()
	     *   .then(filters => {
	     *     ...
	     *   });
	     * ```
	     *
	     * @returns {Promise<models.IFilter[]>}
	     */
	    Report.prototype.getFilters = function () {
	        return this.service.hpm.get("/report/filters", { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Gets the report ID from the first available location: options, attribute, embed url.
	     *
	     * @returns {string}
	     */
	    Report.prototype.getId = function () {
	        var reportId = this.config.id || this.element.getAttribute(Report.reportIdAttribute) || Report.findIdFromEmbedUrl(this.config.embedUrl);
	        if (typeof reportId !== 'string' || reportId.length === 0) {
	            throw new Error("Report id is required, but it was not found. You must provide an id either as part of embed configuration or as attribute '" + Report.reportIdAttribute + "'.");
	        }
	        return reportId;
	    };
	    /**
	     * Gets the list of pages within the report.
	     *
	     * ```javascript
	     * report.getPages()
	     *  .then(pages => {
	     *      ...
	     *  });
	     * ```
	     *
	     * @returns {Promise<Page[]>}
	     */
	    Report.prototype.getPages = function () {
	        var _this = this;
	        return this.service.hpm.get('/report/pages', { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body
	                .map(function (page) {
	                return new page_1.Page(_this, page.name, page.displayName);
	            });
	        }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Creates an instance of a Page.
	     *
	     * Normally you would get Page objects by calling `report.getPages()`, but in the case
	     * that the page name is known and you want to perform an action on a page without having to retrieve it
	     * you can create it directly.
	     *
	     * Note: Because you are creating the page manually there is no guarantee that the page actually exists in the report, and subsequent requests could fail.
	     *
	     * ```javascript
	     * const page = report.page('ReportSection1');
	     * page.setActive();
	     * ```
	     *
	     * @param {string} name
	     * @param {string} [displayName]
	     * @returns {Page}
	     */
	    Report.prototype.page = function (name, displayName) {
	        return new page_1.Page(this, name, displayName);
	    };
	    /**
	     * Prints the active page of the report by invoking `window.print()` on the embed iframe component.
	     */
	    Report.prototype.print = function () {
	        return this.service.hpm.post('/report/print', null, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Removes all filters at the report level.
	     *
	     * ```javascript
	     * report.removeFilters();
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    Report.prototype.removeFilters = function () {
	        return this.setFilters([]);
	    };
	    /**
	     * Sets the active page of the report.
	     *
	     * ```javascript
	     * report.setPage("page2")
	     *  .catch(error => { ... });
	     * ```
	     *
	     * @param {string} pageName
	     * @returns {Promise<void>}
	     */
	    Report.prototype.setPage = function (pageName) {
	        var page = {
	            name: pageName,
	            displayName: null
	        };
	        return this.service.hpm.put('/report/pages/active', page, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Sets filters at the report level.
	     *
	     * ```javascript
	     * const filters: [
	     *    ...
	     * ];
	     *
	     * report.setFilters(filters)
	     *  .catch(errors => {
	     *    ...
	     *  });
	     * ```
	     *
	     * @param {(models.IFilter[])} filters
	     * @returns {Promise<void>}
	     */
	    Report.prototype.setFilters = function (filters) {
	        return this.service.hpm.put("/report/filters", filters, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Updates visibility settings for the filter pane and the page navigation pane.
	     *
	     * ```javascript
	     * const newSettings = {
	     *   navContentPaneEnabled: true,
	     *   filterPaneEnabled: false
	     * };
	     *
	     * report.updateSettings(newSettings)
	     *   .catch(error => { ... });
	     * ```
	     *
	     * @param {models.ISettings} settings
	     * @returns {Promise<void>}
	     */
	    Report.prototype.updateSettings = function (settings) {
	        return this.service.hpm.patch('/report/settings', settings, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Validate load configuration.
	     */
	    Report.prototype.validate = function (config) {
	        return models.validateReportLoad(config);
	    };
	    /**
	     * Switch Report view mode.
	     *
	     * @returns {Promise<void>}
	     */
	    Report.prototype.switchMode = function (viewMode) {
	        var url = '/report/switchMode/' + viewMode;
	        return this.service.hpm.post(url, null, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	    * Refreshes data sources for the report.
	    *
	    * ```javascript
	    * report.refresh();
	    * ```
	    */
	    Report.prototype.refresh = function () {
	        return this.service.hpm.post('/report/refresh', null, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    Report.allowedEvents = ["filtersApplied", "pageChanged"];
	    Report.reportIdAttribute = 'powerbi-report-id';
	    Report.filterPaneEnabledAttribute = 'powerbi-settings-filter-pane-enabled';
	    Report.navContentPaneEnabledAttribute = 'powerbi-settings-nav-content-pane-enabled';
	    Report.typeAttribute = 'powerbi-type';
	    Report.type = "Report";
	    return Report;
	}(embed.Embed));
	exports.Report = Report;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*! powerbi-models v0.11.2 | (c) 2016 Microsoft Corporation MIT */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["powerbi-models"] = factory();
		else
			root["powerbi-models"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {
	
		var __extends = (this && this.__extends) || (function () {
		    var extendStatics = Object.setPrototypeOf ||
		        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
		        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
		    return function (d, b) {
		        extendStatics(d, b);
		        function __() { this.constructor = d; }
		        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		    };
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		/* tslint:disable:no-var-requires */
		exports.advancedFilterSchema = __webpack_require__(1);
		exports.filterSchema = __webpack_require__(2);
		exports.loadSchema = __webpack_require__(3);
		exports.dashboardLoadSchema = __webpack_require__(4);
		exports.pageSchema = __webpack_require__(5);
		exports.settingsSchema = __webpack_require__(6);
		exports.basicFilterSchema = __webpack_require__(7);
		exports.createReportSchema = __webpack_require__(8);
		exports.saveAsParametersSchema = __webpack_require__(9);
		/* tslint:enable:no-var-requires */
		var jsen = __webpack_require__(10);
		function normalizeError(error) {
		    var message = error.message;
		    if (!message) {
		        message = error.path + " is invalid. Not meeting " + error.keyword + " constraint";
		    }
		    return {
		        message: message
		    };
		}
		/**
		 * Takes in schema and returns function which can be used to validate the schema with better semantics around exposing errors
		 */
		function validate(schema, options) {
		    return function (x) {
		        var validate = jsen(schema, options);
		        var isValid = validate(x);
		        if (isValid) {
		            return undefined;
		        }
		        else {
		            return validate.errors
		                .map(normalizeError);
		        }
		    };
		}
		exports.validateSettings = validate(exports.settingsSchema, {
		    schemas: {
		        basicFilter: exports.basicFilterSchema,
		        advancedFilter: exports.advancedFilterSchema
		    }
		});
		exports.validateReportLoad = validate(exports.loadSchema, {
		    schemas: {
		        settings: exports.settingsSchema,
		        basicFilter: exports.basicFilterSchema,
		        advancedFilter: exports.advancedFilterSchema
		    }
		});
		exports.validateCreateReport = validate(exports.createReportSchema);
		exports.validateDashboardLoad = validate(exports.dashboardLoadSchema);
		exports.validatePage = validate(exports.pageSchema);
		exports.validateFilter = validate(exports.filterSchema, {
		    schemas: {
		        basicFilter: exports.basicFilterSchema,
		        advancedFilter: exports.advancedFilterSchema
		    }
		});
		var FilterType;
		(function (FilterType) {
		    FilterType[FilterType["Advanced"] = 0] = "Advanced";
		    FilterType[FilterType["Basic"] = 1] = "Basic";
		    FilterType[FilterType["Unknown"] = 2] = "Unknown";
		})(FilterType = exports.FilterType || (exports.FilterType = {}));
		function isFilterKeyColumnsTarget(target) {
		    return isColumn(target) && !!target.keys;
		}
		exports.isFilterKeyColumnsTarget = isFilterKeyColumnsTarget;
		function isBasicFilterWithKeys(filter) {
		    return getFilterType(filter) === FilterType.Basic && !!filter.keyValues;
		}
		exports.isBasicFilterWithKeys = isBasicFilterWithKeys;
		function getFilterType(filter) {
		    var basicFilter = filter;
		    var advancedFilter = filter;
		    if ((typeof basicFilter.operator === "string")
		        && (Array.isArray(basicFilter.values))) {
		        return FilterType.Basic;
		    }
		    else if ((typeof advancedFilter.logicalOperator === "string")
		        && (Array.isArray(advancedFilter.conditions))) {
		        return FilterType.Advanced;
		    }
		    else {
		        return FilterType.Unknown;
		    }
		}
		exports.getFilterType = getFilterType;
		function isMeasure(arg) {
		    return arg.table !== undefined && arg.measure !== undefined;
		}
		exports.isMeasure = isMeasure;
		function isColumn(arg) {
		    return arg.table !== undefined && arg.column !== undefined;
		}
		exports.isColumn = isColumn;
		function isHierarchy(arg) {
		    return arg.table !== undefined && arg.hierarchy !== undefined && arg.hierarchyLevel !== undefined;
		}
		exports.isHierarchy = isHierarchy;
		var Filter = (function () {
		    function Filter(target) {
		        this.target = target;
		    }
		    Filter.prototype.toJSON = function () {
		        return {
		            $schema: this.schemaUrl,
		            target: this.target
		        };
		    };
		    ;
		    return Filter;
		}());
		exports.Filter = Filter;
		var BasicFilter = (function (_super) {
		    __extends(BasicFilter, _super);
		    function BasicFilter(target, operator) {
		        var values = [];
		        for (var _i = 2; _i < arguments.length; _i++) {
		            values[_i - 2] = arguments[_i];
		        }
		        var _this = _super.call(this, target) || this;
		        _this.operator = operator;
		        _this.schemaUrl = BasicFilter.schemaUrl;
		        if (values.length === 0 && operator !== "All") {
		            throw new Error("values must be a non-empty array unless your operator is \"All\".");
		        }
		        /**
		         * Accept values as array instead of as individual arguments
		         * new BasicFilter('a', 'b', 1, 2);
		         * new BasicFilter('a', 'b', [1,2]);
		         */
		        if (Array.isArray(values[0])) {
		            _this.values = values[0];
		        }
		        else {
		            _this.values = values;
		        }
		        return _this;
		    }
		    BasicFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.operator = this.operator;
		        filter.values = this.values;
		        return filter;
		    };
		    return BasicFilter;
		}(Filter));
		BasicFilter.schemaUrl = "http://powerbi.com/product/schema#basic";
		exports.BasicFilter = BasicFilter;
		var BasicFilterWithKeys = (function (_super) {
		    __extends(BasicFilterWithKeys, _super);
		    function BasicFilterWithKeys(target, operator, values, keyValues) {
		        var _this = _super.call(this, target, operator, values) || this;
		        _this.keyValues = keyValues;
		        _this.target = target;
		        var numberOfKeys = target.keys ? target.keys.length : 0;
		        if (numberOfKeys > 0 && !keyValues) {
		            throw new Error("You shold pass the values to be filtered for each key. You passed: no values and " + numberOfKeys + " keys");
		        }
		        if (numberOfKeys === 0 && keyValues && keyValues.length > 0) {
		            throw new Error("You passed key values but your target object doesn't contain the keys to be filtered");
		        }
		        for (var i = 0; i < _this.keyValues.length; i++) {
		            if (_this.keyValues[i]) {
		                var lengthOfArray = _this.keyValues[i].length;
		                if (lengthOfArray !== numberOfKeys) {
		                    throw new Error("Each tuple of key values should contain a value for each of the keys. You passed: " + lengthOfArray + " values and " + numberOfKeys + " keys");
		                }
		            }
		        }
		        return _this;
		    }
		    BasicFilterWithKeys.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.keyValues = this.keyValues;
		        return filter;
		    };
		    return BasicFilterWithKeys;
		}(BasicFilter));
		exports.BasicFilterWithKeys = BasicFilterWithKeys;
		var AdvancedFilter = (function (_super) {
		    __extends(AdvancedFilter, _super);
		    function AdvancedFilter(target, logicalOperator) {
		        var conditions = [];
		        for (var _i = 2; _i < arguments.length; _i++) {
		            conditions[_i - 2] = arguments[_i];
		        }
		        var _this = _super.call(this, target) || this;
		        _this.schemaUrl = AdvancedFilter.schemaUrl;
		        // Guard statements
		        if (typeof logicalOperator !== "string" || logicalOperator.length === 0) {
		            // TODO: It would be nicer to list out the possible logical operators.
		            throw new Error("logicalOperator must be a valid operator, You passed: " + logicalOperator);
		        }
		        _this.logicalOperator = logicalOperator;
		        var extractedConditions;
		        /**
		         * Accept conditions as array instead of as individual arguments
		         * new AdvancedFilter('a', 'b', "And", { value: 1, operator: "Equals" }, { value: 2, operator: "IsGreaterThan" });
		         * new AdvancedFilter('a', 'b', "And", [{ value: 1, operator: "Equals" }, { value: 2, operator: "IsGreaterThan" }]);
		         */
		        if (Array.isArray(conditions[0])) {
		            extractedConditions = conditions[0];
		        }
		        else {
		            extractedConditions = conditions;
		        }
		        if (extractedConditions.length === 0) {
		            throw new Error("conditions must be a non-empty array. You passed: " + conditions);
		        }
		        if (extractedConditions.length > 2) {
		            throw new Error("AdvancedFilters may not have more than two conditions. You passed: " + conditions.length);
		        }
		        if (extractedConditions.length === 1 && logicalOperator !== "And") {
		            throw new Error("Logical Operator must be \"And\" when there is only one condition provided");
		        }
		        _this.conditions = extractedConditions;
		        return _this;
		    }
		    AdvancedFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.logicalOperator = this.logicalOperator;
		        filter.conditions = this.conditions;
		        return filter;
		    };
		    return AdvancedFilter;
		}(Filter));
		AdvancedFilter.schemaUrl = "http://powerbi.com/product/schema#advanced";
		exports.AdvancedFilter = AdvancedFilter;
		var Permissions;
		(function (Permissions) {
		    Permissions[Permissions["Read"] = 0] = "Read";
		    Permissions[Permissions["ReadWrite"] = 1] = "ReadWrite";
		    Permissions[Permissions["Copy"] = 2] = "Copy";
		    Permissions[Permissions["Create"] = 4] = "Create";
		    Permissions[Permissions["All"] = 7] = "All";
		})(Permissions = exports.Permissions || (exports.Permissions = {}));
		var ViewMode;
		(function (ViewMode) {
		    ViewMode[ViewMode["View"] = 0] = "View";
		    ViewMode[ViewMode["Edit"] = 1] = "Edit";
		})(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
		var TokenType;
		(function (TokenType) {
		    TokenType[TokenType["Aad"] = 0] = "Aad";
		    TokenType[TokenType["Embed"] = 1] = "Embed";
		})(TokenType = exports.TokenType || (exports.TokenType = {}));
		exports.validateSaveAsParameters = validate(exports.saveAsParametersSchema);
	
	
	/***/ }),
	/* 1 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"target": {
					"oneOf": [
						{
							"type": "object",
							"properties": {
								"table": {
									"type": "string"
								},
								"column": {
									"type": "string"
								}
							},
							"required": [
								"table",
								"column"
							]
						},
						{
							"type": "object",
							"properties": {
								"table": {
									"type": "string"
								},
								"hierarchy": {
									"type": "string"
								},
								"hierarchyLevel": {
									"type": "string"
								}
							},
							"required": [
								"table",
								"hierarchy",
								"hierarchyLevel"
							]
						},
						{
							"type": "object",
							"properties": {
								"table": {
									"type": "string"
								},
								"measure": {
									"type": "string"
								}
							},
							"required": [
								"table",
								"measure"
							]
						}
					]
				},
				"logicalOperator": {
					"type": "string"
				},
				"conditions": {
					"type": "array",
					"items": {
						"type": "object",
						"properties": {
							"value": {
								"type": [
									"string",
									"boolean",
									"number"
								]
							},
							"operator": {
								"type": "string"
							}
						},
						"required": [
							"value",
							"operator"
						]
					}
				}
			},
			"required": [
				"target",
				"logicalOperator",
				"conditions"
			]
		};
	
	/***/ }),
	/* 2 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"oneOf": [
				{
					"$ref": "#basicFilter"
				},
				{
					"$ref": "#advancedFilter"
				}
			],
			"invalidMessage": "filter is invalid"
		};
	
	/***/ }),
	/* 3 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"accessToken": {
					"type": "string",
					"messages": {
						"type": "accessToken must be a string",
						"required": "accessToken is required"
					}
				},
				"id": {
					"type": "string",
					"messages": {
						"type": "id must be a string",
						"required": "id is required"
					}
				},
				"settings": {
					"$ref": "#settings"
				},
				"pageName": {
					"type": "string",
					"messages": {
						"type": "pageName must be a string"
					}
				},
				"filters": {
					"type": "array",
					"items": {
						"type": "object",
						"oneOf": [
							{
								"$ref": "#basicFilter"
							},
							{
								"$ref": "#advancedFilter"
							}
						]
					},
					"invalidMessage": "filters property is invalid"
				},
				"permissions": {
					"type": "number",
					"enum": [
						0,
						1,
						2,
						4,
						7
					],
					"default": 0,
					"invalidMessage": "permissions property is invalid"
				},
				"viewMode": {
					"type": "number",
					"enum": [
						0,
						1
					],
					"default": 0,
					"invalidMessage": "viewMode property is invalid"
				},
				"tokenType": {
					"type": "number",
					"enum": [
						0,
						1
					],
					"default": 0,
					"invalidMessage": "tokenType property is invalid"
				}
			},
			"required": [
				"accessToken",
				"id"
			]
		};
	
	/***/ }),
	/* 4 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"accessToken": {
					"type": "string",
					"messages": {
						"type": "accessToken must be a string",
						"required": "accessToken is required"
					}
				},
				"id": {
					"type": "string",
					"messages": {
						"type": "id must be a string",
						"required": "id is required"
					}
				},
				"pageView": {
					"type": "string",
					"messages": {
						"type": "pageView must be a string with one of the following values: \"actualSize\", \"fitToWidth\", \"oneColumn\""
					}
				},
				"tokenType": {
					"type": "number",
					"enum": [
						0,
						1
					],
					"default": 0,
					"invalidMessage": "tokenType property is invalid"
				}
			},
			"required": [
				"accessToken",
				"id"
			]
		};
	
	/***/ }),
	/* 5 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"messages": {
						"type": "name must be a string",
						"required": "name is required"
					}
				}
			},
			"required": [
				"name"
			]
		};
	
	/***/ }),
	/* 6 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"filterPaneEnabled": {
					"type": "boolean",
					"messages": {
						"type": "filterPaneEnabled must be a boolean"
					}
				},
				"navContentPaneEnabled": {
					"type": "boolean",
					"messages": {
						"type": "navContentPaneEnabled must be a boolean"
					}
				},
				"useCustomSaveAsDialog": {
					"type": "boolean",
					"messages": {
						"type": "useCustomSaveAsDialog must be a boolean"
					}
				}
			}
		};
	
	/***/ }),
	/* 7 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"target": {
					"type": "object",
					"properties": {
						"table": {
							"type": "string"
						},
						"column": {
							"type": "string"
						},
						"hierarchy": {
							"type": "string"
						},
						"hierarchyLevel": {
							"type": "string"
						},
						"measure": {
							"type": "string"
						}
					},
					"required": [
						"table"
					]
				},
				"operator": {
					"type": "string"
				},
				"values": {
					"type": "array",
					"items": {
						"type": [
							"string",
							"boolean",
							"number"
						]
					}
				}
			},
			"required": [
				"target",
				"operator",
				"values"
			]
		};
	
	/***/ }),
	/* 8 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"accessToken": {
					"type": "string",
					"messages": {
						"type": "accessToken must be a string",
						"required": "accessToken is required"
					}
				},
				"datasetId": {
					"type": "string",
					"messages": {
						"type": "datasetId must be a string",
						"required": "datasetId is required"
					}
				},
				"tokenType": {
					"type": "number",
					"enum": [
						0,
						1
					],
					"default": 0,
					"invalidMessage": "tokenType property is invalid"
				}
			},
			"required": [
				"accessToken",
				"datasetId"
			]
		};
	
	/***/ }),
	/* 9 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"messages": {
						"type": "name must be a string",
						"required": "name is required"
					}
				}
			},
			"required": [
				"name"
			]
		};
	
	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __webpack_require__) {
	
		module.exports = __webpack_require__(11);
	
	/***/ }),
	/* 11 */
	/***/ (function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var REGEX_ESCAPE_EXPR = /[\/]/g,
		    STR_ESCAPE_EXPR = /(")/gim,
		    VALID_IDENTIFIER_EXPR = /^[a-z_$][0-9a-z]*$/gi,
		    INVALID_SCHEMA = 'jsen: invalid schema object',
		    browser = typeof window === 'object' && !!window.navigator,   // jshint ignore: line
		    regescape = new RegExp('/').source !== '/', // node v0.x does not properly escape '/'s in inline regex
		    func = __webpack_require__(12),
		    equal = __webpack_require__(13),
		    unique = __webpack_require__(14),
		    SchemaResolver = __webpack_require__(15),
		    formats = __webpack_require__(24),
		    ucs2length = __webpack_require__(25),
		    types = {},
		    keywords = {};
		
		function inlineRegex(regex) {
		    regex = regex instanceof RegExp ? regex : new RegExp(regex);
		
		    return regescape ?
		        regex.toString() :
		        '/' + regex.source.replace(REGEX_ESCAPE_EXPR, '\\$&') + '/';
		}
		
		function encodeStr(str) {
		    return '"' + str.replace(STR_ESCAPE_EXPR, '\\$1') + '"';
		}
		
		function appendToPath(path, key) {
		    VALID_IDENTIFIER_EXPR.lastIndex = 0;
		
		    return VALID_IDENTIFIER_EXPR.test(key) ?
		        path + '.' + key :
		        path + '[' + encodeStr(key) + ']';
		}
		
		function type(obj) {
		    if (obj === undefined) {
		        return 'undefined';
		    }
		
		    var str = Object.prototype.toString.call(obj);
		    return str.substr(8, str.length - 9).toLowerCase();
		}
		
		function isInteger(obj) {
		    return (obj | 0) === obj;   // jshint ignore: line
		}
		
		types['null'] = function (path) {
		    return path + ' === null';
		};
		
		types.boolean = function (path) {
		    return 'typeof ' + path + ' === "boolean"';
		};
		
		types.string = function (path) {
		    return 'typeof ' + path + ' === "string"';
		};
		
		types.number = function (path) {
		    return 'typeof ' + path + ' === "number"';
		};
		
		types.integer = function (path) {
		    return 'typeof ' + path + ' === "number" && !(' + path + ' % 1)';
		};
		
		types.array = function (path) {
		    return 'Array.isArray(' + path + ')';
		};
		
		types.object = function (path) {
		    return 'typeof ' + path + ' === "object" && ' + path + ' !== null && !Array.isArray(' + path + ')';
		};
		
		types.date = function (path) {
		    return path + ' instanceof Date';
		};
		
		keywords.enum = function (context) {
		    var arr = context.schema['enum'];
		
		    context.code('if (!equalAny(' + context.path + ', ' + JSON.stringify(arr) + ')) {');
		    context.error('enum');
		    context.code('}');
		};
		
		keywords.minimum = function (context) {
		    if (typeof context.schema.minimum === 'number') {
		        context.code('if (' + context.path + ' < ' + context.schema.minimum + ') {');
		        context.error('minimum');
		        context.code('}');
		    }
		};
		
		keywords.exclusiveMinimum = function (context) {
		    if (context.schema.exclusiveMinimum === true && typeof context.schema.minimum === 'number') {
		        context.code('if (' + context.path + ' === ' + context.schema.minimum + ') {');
		        context.error('exclusiveMinimum');
		        context.code('}');
		    }
		};
		
		keywords.maximum = function (context) {
		    if (typeof context.schema.maximum === 'number') {
		        context.code('if (' + context.path + ' > ' + context.schema.maximum + ') {');
		        context.error('maximum');
		        context.code('}');
		    }
		};
		
		keywords.exclusiveMaximum = function (context) {
		    if (context.schema.exclusiveMaximum === true && typeof context.schema.maximum === 'number') {
		        context.code('if (' + context.path + ' === ' + context.schema.maximum + ') {');
		        context.error('exclusiveMaximum');
		        context.code('}');
		    }
		};
		
		keywords.multipleOf = function (context) {
		    if (typeof context.schema.multipleOf === 'number') {
		        var mul = context.schema.multipleOf,
		            decimals = mul.toString().length - mul.toFixed(0).length - 1,
		            pow = decimals > 0 ? Math.pow(10, decimals) : 1,
		            path = context.path;
		
		        if (decimals > 0) {
		            context.code('if (+(Math.round((' + path + ' * ' + pow + ') + "e+" + ' + decimals + ') + "e-" + ' + decimals + ') % ' + (mul * pow) + ' !== 0) {');
		        } else {
		            context.code('if (((' + path + ' * ' + pow + ') % ' + (mul * pow) + ') !== 0) {');
		        }
		
		        context.error('multipleOf');
		        context.code('}');
		    }
		};
		
		keywords.minLength = function (context) {
		    if (isInteger(context.schema.minLength)) {
		        context.code('if (ucs2length(' + context.path + ') < ' + context.schema.minLength + ') {');
		        context.error('minLength');
		        context.code('}');
		    }
		};
		
		keywords.maxLength = function (context) {
		    if (isInteger(context.schema.maxLength)) {
		        context.code('if (ucs2length(' + context.path + ') > ' + context.schema.maxLength + ') {');
		        context.error('maxLength');
		        context.code('}');
		    }
		};
		
		keywords.pattern = function (context) {
		    var pattern = context.schema.pattern;
		
		    if (typeof pattern === 'string' || pattern instanceof RegExp) {
		        context.code('if (!(' + inlineRegex(pattern) + ').test(' + context.path + ')) {');
		        context.error('pattern');
		        context.code('}');
		    }
		};
		
		keywords.format = function (context) {
		    if (typeof context.schema.format !== 'string' || !formats[context.schema.format]) {
		        return;
		    }
		
		    context.code('if (!(' + formats[context.schema.format] + ').test(' + context.path + ')) {');
		    context.error('format');
		    context.code('}');
		};
		
		keywords.minItems = function (context) {
		    if (isInteger(context.schema.minItems)) {
		        context.code('if (' + context.path + '.length < ' + context.schema.minItems + ') {');
		        context.error('minItems');
		        context.code('}');
		    }
		};
		
		keywords.maxItems = function (context) {
		    if (isInteger(context.schema.maxItems)) {
		        context.code('if (' + context.path + '.length > ' + context.schema.maxItems + ') {');
		        context.error('maxItems');
		        context.code('}');
		    }
		};
		
		keywords.additionalItems = function (context) {
		    if (context.schema.additionalItems === false && Array.isArray(context.schema.items)) {
		        context.code('if (' + context.path + '.length > ' + context.schema.items.length + ') {');
		        context.error('additionalItems');
		        context.code('}');
		    }
		};
		
		keywords.uniqueItems = function (context) {
		    if (context.schema.uniqueItems) {
		        context.code('if (unique(' + context.path + ').length !== ' + context.path + '.length) {');
		        context.error('uniqueItems');
		        context.code('}');
		    }
		};
		
		keywords.items = function (context) {
		    var index = context.declare(0),
		        i = 0;
		
		    if (type(context.schema.items) === 'object') {
		        context.code('for (' + index + ' = 0; ' + index + ' < ' + context.path + '.length; ' + index + '++) {');
		
		        context.descend(context.path + '[' + index + ']', context.schema.items);
		
		        context.code('}');
		    }
		    else if (Array.isArray(context.schema.items)) {
		        for (; i < context.schema.items.length; i++) {
		            context.code('if (' + context.path + '.length - 1 >= ' + i + ') {');
		
		            context.descend(context.path + '[' + i + ']', context.schema.items[i]);
		
		            context.code('}');
		        }
		
		        if (type(context.schema.additionalItems) === 'object') {
		            context.code('for (' + index + ' = ' + i + '; ' + index + ' < ' + context.path + '.length; ' + index + '++) {');
		
		            context.descend(context.path + '[' + index + ']', context.schema.additionalItems);
		
		            context.code('}');
		        }
		    }
		};
		
		keywords.maxProperties = function (context) {
		    if (isInteger(context.schema.maxProperties)) {
		        context.code('if (Object.keys(' + context.path + ').length > ' + context.schema.maxProperties + ') {');
		        context.error('maxProperties');
		        context.code('}');
		    }
		};
		
		keywords.minProperties = function (context) {
		    if (isInteger(context.schema.minProperties)) {
		        context.code('if (Object.keys(' + context.path + ').length < ' + context.schema.minProperties + ') {');
		        context.error('minProperties');
		        context.code('}');
		    }
		};
		
		keywords.required = function (context) {
		    if (!Array.isArray(context.schema.required)) {
		        return;
		    }
		
		    for (var i = 0; i < context.schema.required.length; i++) {
		        context.code('if (' + appendToPath(context.path, context.schema.required[i]) + ' === undefined) {');
		        context.error('required', context.schema.required[i]);
		        context.code('}');
		    }
		};
		
		keywords.properties = function (context) {
		    var props = context.schema.properties,
		        propKeys = type(props) === 'object' ? Object.keys(props) : [],
		        required = Array.isArray(context.schema.required) ? context.schema.required : [],
		        prop, i, nestedPath;
		
		    if (!propKeys.length) {
		        return;
		    }
		
		    for (i = 0; i < propKeys.length; i++) {
		        prop = propKeys[i];
		        nestedPath = appendToPath(context.path, prop);
		
		        context.code('if (' + nestedPath + ' !== undefined) {');
		
		        context.descend(nestedPath, props[prop]);
		
		        context.code('}');
		
		        if (required.indexOf(prop) > -1) {
		            context.code('else {');
		            context.error('required', prop);
		            context.code('}');
		        }
		    }
		};
		
		keywords.patternProperties = keywords.additionalProperties = function (context) {
		    var propKeys = type(context.schema.properties) === 'object' ?
		            Object.keys(context.schema.properties) : [],
		        patProps = context.schema.patternProperties,
		        patterns = type(patProps) === 'object' ? Object.keys(patProps) : [],
		        addProps = context.schema.additionalProperties,
		        addPropsCheck = addProps === false || type(addProps) === 'object',
		        props, keys, key, n, found, pattern, i;
		
		    if (!patterns.length && !addPropsCheck) {
		        return;
		    }
		
		    keys = context.declare('[]');
		    key = context.declare('""');
		    n = context.declare(0);
		
		    if (addPropsCheck) {
		        found = context.declare(false);
		    }
		
		    context.code(keys + ' = Object.keys(' + context.path + ')');
		
		    context.code('for (' + n + ' = 0; ' + n + ' < ' + keys + '.length; ' + n + '++) {')
		        (key + ' = ' + keys + '[' + n + ']')
		
		        ('if (' + context.path + '[' + key + '] === undefined) {')
		            ('continue')
		        ('}');
		
		    if (addPropsCheck) {
		        context.code(found + ' = false');
		    }
		
		    // validate pattern properties
		    for (i = 0; i < patterns.length; i++) {
		        pattern = patterns[i];
		
		        context.code('if ((' + inlineRegex(pattern) + ').test(' + key + ')) {');
		
		        context.descend(context.path + '[' + key + ']', patProps[pattern]);
		
		        if (addPropsCheck) {
		            context.code(found + ' = true');
		        }
		
		        context.code('}');
		    }
		
		    // validate additional properties
		    if (addPropsCheck) {
		        if (propKeys.length) {
		            props = context.declare(JSON.stringify(propKeys));
		
		            // do not validate regular properties
		            context.code('if (' + props + '.indexOf(' + key + ') > -1) {')
		                ('continue')
		            ('}');
		        }
		
		        context.code('if (!' + found + ') {');
		
		        if (addProps === false) {
		            // do not allow additional properties
		            context.error('additionalProperties', undefined, key);
		        }
		        else {
		            // validate additional properties
		            context.descend(context.path + '[' + key + ']', addProps);
		        }
		
		        context.code('}');
		    }
		
		    context.code('}');
		};
		
		keywords.dependencies = function (context) {
		    if (type(context.schema.dependencies) !== 'object') {
		        return;
		    }
		
		    var depKeys = Object.keys(context.schema.dependencies),
		        len = depKeys.length,
		        key, dep, i = 0, k = 0;
		
		    for (; k < len; k++) {
		        key = depKeys[k];
		        dep = context.schema.dependencies[key];
		
		        context.code('if (' + appendToPath(context.path, key) + ' !== undefined) {');
		
		        if (type(dep) === 'object') {
		            //schema dependency
		            context.descend(context.path, dep);
		        }
		        else {
		            // property dependency
		            for (i; i < dep.length; i++) {
		                context.code('if (' + appendToPath(context.path, dep[i]) + ' === undefined) {');
		                context.error('dependencies', dep[i]);
		                context.code('}');
		            }
		        }
		
		        context.code('}');
		    }
		};
		
		keywords.allOf = function (context) {
		    if (!Array.isArray(context.schema.allOf)) {
		        return;
		    }
		
		    for (var i = 0; i < context.schema.allOf.length; i++) {
		        context.descend(context.path, context.schema.allOf[i]);
		    }
		};
		
		keywords.anyOf = function (context) {
		    if (!Array.isArray(context.schema.anyOf)) {
		        return;
		    }
		
		    var greedy = context.greedy,
		        errCount = context.declare(0),
		        initialCount = context.declare(0),
		        found = context.declare(false),
		        i = 0;
		
		    context.code(initialCount + ' = errors.length');
		
		    for (; i < context.schema.anyOf.length; i++) {
		        context.code('if (!' + found + ') {');
		
		        context.code(errCount + ' = errors.length');
		
		        context.greedy = true;
		
		        context.descend(context.path, context.schema.anyOf[i]);
		
		        context.code(found + ' = errors.length === ' + errCount)
		        ('}');
		    }
		
		    context.greedy = greedy;
		
		    context.code('if (!' + found + ') {');
		
		    context.error('anyOf');
		
		    context.code('} else {')
		        ('errors.length = ' + initialCount)
		    ('}');
		};
		
		keywords.oneOf = function (context) {
		    if (!Array.isArray(context.schema.oneOf)) {
		        return;
		    }
		
		    var greedy = context.greedy,
		        matching = context.declare(0),
		        initialCount = context.declare(0),
		        errCount = context.declare(0),
		        i = 0;
		
		    context.code(initialCount + ' = errors.length');
		    context.code(matching + ' = 0');
		
		    for (; i < context.schema.oneOf.length; i++) {
		        context.code(errCount + ' = errors.length');
		
		        context.greedy = true;
		
		        context.descend(context.path, context.schema.oneOf[i]);
		
		        context.code('if (errors.length === ' + errCount + ') {')
		            (matching + '++')
		        ('}');
		    }
		
		    context.greedy = greedy;
		
		    context.code('if (' + matching + ' !== 1) {');
		
		    context.error('oneOf');
		
		    context.code('} else {')
		        ('errors.length = ' + initialCount)
		    ('}');
		};
		
		keywords.not = function (context) {
		    if (type(context.schema.not) !== 'object') {
		        return;
		    }
		
		    var greedy = context.greedy,
		        errCount = context.declare(0);
		
		    context.code(errCount + ' = errors.length');
		
		    context.greedy = true;
		
		    context.descend(context.path, context.schema.not);
		
		    context.greedy = greedy;
		
		    context.code('if (errors.length === ' + errCount + ') {');
		
		    context.error('not');
		
		    context.code('} else {')
		        ('errors.length = ' + errCount)
		    ('}');
		};
		
		function decorateGenerator(type, keyword) {
		    keywords[keyword].type = type;
		    keywords[keyword].keyword = keyword;
		}
		
		['minimum', 'exclusiveMinimum', 'maximum', 'exclusiveMaximum', 'multipleOf']
		    .forEach(decorateGenerator.bind(null, 'number'));
		
		['minLength', 'maxLength', 'pattern', 'format']
		    .forEach(decorateGenerator.bind(null, 'string'));
		
		['minItems', 'maxItems', 'additionalItems', 'uniqueItems', 'items']
		    .forEach(decorateGenerator.bind(null, 'array'));
		
		['maxProperties', 'minProperties', 'required', 'properties', 'patternProperties', 'additionalProperties', 'dependencies']
		    .forEach(decorateGenerator.bind(null, 'object'));
		
		['enum', 'allOf', 'anyOf', 'oneOf', 'not']
		    .forEach(decorateGenerator.bind(null, null));
		
		function groupKeywords(schema) {
		    var keys = Object.keys(schema),
		        propIndex = keys.indexOf('properties'),
		        patIndex = keys.indexOf('patternProperties'),
		        ret = {
		            enum: Array.isArray(schema.enum) && schema.enum.length > 0,
		            type: null,
		            allType: [],
		            perType: {}
		        },
		        key, gen, i;
		
		    if (schema.type) {
		        if (typeof schema.type === 'string') {
		            ret.type = [schema.type];
		        }
		        else if (Array.isArray(schema.type) && schema.type.length) {
		            ret.type = schema.type.slice(0);
		        }
		    }
		
		    for (i = 0; i < keys.length; i++) {
		        key = keys[i];
		
		        if (key === 'enum' || key === 'type') {
		            continue;
		        }
		
		        gen = keywords[key];
		
		        if (!gen) {
		            continue;
		        }
		
		        if (gen.type) {
		            if (!ret.perType[gen.type]) {
		                ret.perType[gen.type] = [];
		            }
		
		            if (!(propIndex > -1 && key === 'required') &&
		                !(patIndex > -1 && key === 'additionalProperties')) {
		                ret.perType[gen.type].push(key);
		            }
		        }
		        else {
		            ret.allType.push(key);
		        }
		    }
		
		    return ret;
		}
		
		function getPathExpression(path, key) {
		    var path_ = path.substr(4),
		        len = path_.length,
		        tokens = [],
		        token = '',
		        isvar = false,
		        char, i;
		
		    for (i = 0; i < len; i++) {
		        char = path_[i];
		
		        switch (char) {
		            case '.':
		                if (token) {
		                    token += char;
		                }
		                break;
		            case '[':
		                if (isNaN(+path_[i + 1])) {
		                    isvar = true;
		
		                    if (token) {
		                        tokens.push('"' + token + '"');
		                        token = '';
		                    }
		                }
		                else {
		                    isvar = false;
		
		                    if (token) {
		                        token += '.';
		                    }
		                }
		                break;
		            case ']':
		                tokens.push(isvar ? token : '"' + token + '"');
		                token = '';
		                break;
		            default:
		                token += char;
		        }
		    }
		
		    if (token) {
		        tokens.push('"' + token + '"');
		    }
		
		    if (key) {
		        tokens.push('"' + key + '"');
		    }
		
		    if (tokens.length === 1 && isvar) {
		        return '"" + ' + tokens[0] + ' + ""';
		    }
		
		    return tokens.join(' + "." + ') || '""';
		}
		
		function clone(obj) {
		    var cloned = obj,
		        objType = type(obj),
		        keys, len, key, i;
		
		    if (objType === 'object') {
		        cloned = {};
		        keys = Object.keys(obj);
		
		        for (i = 0, len = keys.length; i < len; i++) {
		            key = keys[i];
		            cloned[key] = clone(obj[key]);
		        }
		    }
		    else if (objType === 'array') {
		        cloned = [];
		
		        for (i = 0, len = obj.length; i < len; i++) {
		            cloned[i] = clone(obj[i]);
		        }
		    }
		    else if (objType === 'regexp') {
		        return new RegExp(obj);
		    }
		    else if (objType === 'date') {
		        return new Date(obj.toJSON());
		    }
		
		    return cloned;
		}
		
		function equalAny(obj, options) {
		    for (var i = 0, len = options.length; i < len; i++) {
		        if (equal(obj, options[i])) {
		            return true;
		        }
		    }
		
		    return false;
		}
		
		function PropertyMarker() {
		    this.objects = [];
		    this.properties = [];
		}
		
		PropertyMarker.prototype.mark = function (obj, key) {
		    var index = this.objects.indexOf(obj),
		        prop;
		
		    if (index < 0) {
		        this.objects.push(obj);
		
		        prop = {};
		        prop[key] = 1;
		
		        this.properties.push(prop);
		
		        return;
		    }
		
		    prop = this.properties[index];
		
		    prop[key] = prop[key] ? prop[key] + 1 : 1;
		};
		
		PropertyMarker.prototype.deleteDuplicates = function () {
		    var props, keys, key, i, j;
		
		    for (i = 0; i < this.properties.length; i++) {
		        props = this.properties[i];
		        keys = Object.keys(props);
		
		        for (j = 0; j < keys.length; j++) {
		            key = keys[j];
		
		            if (props[key] > 1) {
		                delete this.objects[i][key];
		            }
		        }
		    }
		};
		
		PropertyMarker.prototype.dispose = function () {
		    this.objects.length = 0;
		    this.properties.length = 0;
		};
		
		function build(schema, def, additional, resolver, parentMarker) {
		    var defType, defValue, key, i, propertyMarker, props, defProps;
		
		    if (type(schema) !== 'object') {
		        return def;
		    }
		
		    schema = resolver.resolve(schema);
		
		    if (def === undefined && schema.hasOwnProperty('default')) {
		        def = clone(schema['default']);
		    }
		
		    defType = type(def);
		
		    if (defType === 'object' && type(schema.properties) === 'object') {
		        props = Object.keys(schema.properties);
		
		        for (i = 0; i < props.length; i++) {
		            key = props[i];
		            defValue = build(schema.properties[key], def[key], additional, resolver);
		
		            if (defValue !== undefined) {
		                def[key] = defValue;
		            }
		        }
		
		        if (additional !== 'always') {
		            defProps = Object.keys(def);
		
		            for (i = 0; i < defProps.length; i++) {
		                key = defProps[i];
		
		                if (props.indexOf(key) < 0 &&
		                    (schema.additionalProperties === false ||
		                    (additional === false && !schema.additionalProperties))) {
		
		                    if (parentMarker) {
		                        parentMarker.mark(def, key);
		                    }
		                    else {
		                        delete def[key];
		                    }
		                }
		            }
		        }
		    }
		    else if (defType === 'array' && schema.items) {
		        if (type(schema.items) === 'array') {
		            for (i = 0; i < schema.items.length; i++) {
		                defValue = build(schema.items[i], def[i], additional, resolver);
		
		                if (defValue !== undefined || i < def.length) {
		                    def[i] = defValue;
		                }
		            }
		        }
		        else if (def.length) {
		            for (i = 0; i < def.length; i++) {
		                def[i] = build(schema.items, def[i], additional, resolver);
		            }
		        }
		    }
		    else if (type(schema.allOf) === 'array' && schema.allOf.length) {
		        propertyMarker = new PropertyMarker();
		
		        for (i = 0; i < schema.allOf.length; i++) {
		            def = build(schema.allOf[i], def, additional, resolver, propertyMarker);
		        }
		
		        propertyMarker.deleteDuplicates();
		        propertyMarker.dispose();
		    }
		
		    return def;
		}
		
		function ValidationContext(options) {
		    this.path = 'data';
		    this.schema = options.schema;
		    this.formats = options.formats;
		    this.greedy = options.greedy;
		    this.resolver = options.resolver;
		    this.id = options.id;
		    this.funcache = options.funcache || {};
		    this.scope = options.scope || {
		        equalAny: equalAny,
		        unique: unique,
		        ucs2length: ucs2length,
		        refs: {}
		    };
		}
		
		ValidationContext.prototype.clone = function (schema) {
		    var ctx = new ValidationContext({
		        schema: schema,
		        formats: this.formats,
		        greedy: this.greedy,
		        resolver: this.resolver,
		        id: this.id,
		        funcache: this.funcache,
		        scope: this.scope
		    });
		
		    return ctx;
		};
		
		ValidationContext.prototype.declare = function (def) {
		    var variname = this.id();
		    this.code.def(variname, def);
		    return variname;
		};
		
		ValidationContext.prototype.cache = function (cacheKey, schema) {
		    var cached = this.funcache[cacheKey],
		        context;
		
		    if (!cached) {
		        cached = this.funcache[cacheKey] = {
		            key: this.id()
		        };
		
		        context = this.clone(schema);
		
		        cached.func = context.compile(cached.key);
		
		        this.scope.refs[cached.key] = cached.func;
		
		        context.dispose();
		    }
		
		    return 'refs.' + cached.key;
		};
		
		ValidationContext.prototype.error = function (keyword, key, additional) {
		    var schema = this.schema,
		        path = this.path,
		        errorPath = path !== 'data' || key ?
		            '(path ? path + "." : "") + ' + getPathExpression(path, key) + ',' :
		            'path,',
		        res = key && schema.properties && schema.properties[key] ?
		            this.resolver.resolve(schema.properties[key]) : null,
		        message = res ? res.requiredMessage : schema.invalidMessage;
		
		    if (!message) {
		        message = (res && res.messages && res.messages[keyword]) ||
		            (schema.messages && schema.messages[keyword]);
		    }
		
		    this.code('errors.push({');
		
		    if (message) {
		        this.code('message: ' + encodeStr(message) + ',');
		    }
		
		    if (additional) {
		        this.code('additionalProperties: ' + additional + ',');
		    }
		
		    this.code('path: ' + errorPath)
		        ('keyword: ' + encodeStr(keyword))
		    ('})');
		
		    if (!this.greedy) {
		        this.code('return');
		    }
		};
		
		ValidationContext.prototype.refactor = function (path, schema, cacheKey) {
		    var parentPathExp = path !== 'data' ?
		            '(path ? path + "." : "") + ' + getPathExpression(path) :
		            'path',
		        cachedRef = this.cache(cacheKey, schema),
		        refErrors = this.declare();
		
		    this.code(refErrors + ' = ' + cachedRef + '(' + path + ', ' + parentPathExp + ', errors)');
		
		    if (!this.greedy) {
		        this.code('if (errors.length) { return }');
		    }
		};
		
		ValidationContext.prototype.descend = function (path, schema) {
		    var origPath = this.path,
		        origSchema = this.schema;
		
		    this.path = path;
		    this.schema = schema;
		
		    this.generate();
		
		    this.path = origPath;
		    this.schema = origSchema;
		};
		
		ValidationContext.prototype.generate = function () {
		    var path = this.path,
		        schema = this.schema,
		        context = this,
		        scope = this.scope,
		        encodedFormat,
		        format,
		        schemaKeys,
		        typeKeys,
		        typeIndex,
		        validatedType,
		        i;
		
		    if (type(schema) !== 'object') {
		        return;
		    }
		
		    if (schema.$ref !== undefined) {
		        schema = this.resolver.resolve(schema);
		
		        if (this.resolver.hasRef(schema)) {
		            this.refactor(path, schema,
		                this.resolver.getNormalizedRef(this.schema) || this.schema.$ref);
		
		            return;
		        }
		        else {
		            // substitute $ref schema with the resolved instance
		            this.schema = schema;
		        }
		    }
		
		    schemaKeys = groupKeywords(schema);
		
		    if (schemaKeys.enum) {
		        keywords.enum(context);
		
		        return; // do not process the schema further
		    }
		
		    typeKeys = Object.keys(schemaKeys.perType);
		
		    function generateForKeyword(keyword) {
		        keywords[keyword](context);    // jshint ignore: line
		    }
		
		    for (i = 0; i < typeKeys.length; i++) {
		        validatedType = typeKeys[i];
		
		        this.code((i ? 'else ' : '') + 'if (' + types[validatedType](path) + ') {');
		
		        schemaKeys.perType[validatedType].forEach(generateForKeyword);
		
		        this.code('}');
		
		        if (schemaKeys.type) {
		            typeIndex = schemaKeys.type.indexOf(validatedType);
		
		            if (typeIndex > -1) {
		                schemaKeys.type.splice(typeIndex, 1);
		            }
		        }
		    }
		
		    if (schemaKeys.type) {              // we have types in the schema
		        if (schemaKeys.type.length) {   // case 1: we still have some left to check
		            this.code((typeKeys.length ? 'else ' : '') + 'if (!(' + schemaKeys.type.map(function (type) {
		                return types[type] ? types[type](path) : 'true';
		            }).join(' || ') + ')) {');
		            this.error('type');
		            this.code('}');
		        }
		        else {
		            this.code('else {');             // case 2: we don't have any left to check
		            this.error('type');
		            this.code('}');
		        }
		    }
		
		    schemaKeys.allType.forEach(function (keyword) {
		        keywords[keyword](context);
		    });
		
		    if (schema.format && this.formats) {
		        format = this.formats[schema.format];
		
		        if (format) {
		            if (typeof format === 'string' || format instanceof RegExp) {
		                this.code('if (!(' + inlineRegex(format) + ').test(' + path + ')) {');
		                this.error('format');
		                this.code('}');
		            }
		            else if (typeof format === 'function') {
		                (scope.formats || (scope.formats = {}))[schema.format] = format;
		                (scope.schemas || (scope.schemas = {}))[schema.format] = schema;
		
		                encodedFormat = encodeStr(schema.format);
		
		                this.code('if (!formats[' + encodedFormat + '](' + path + ', schemas[' + encodedFormat + '])) {');
		                this.error('format');
		                this.code('}');
		            }
		        }
		    }
		};
		
		ValidationContext.prototype.compile = function (id) {
		    this.code = func('jsen_compiled' + (id ? '_' + id : ''), 'data', 'path', 'errors');
		    this.generate();
		
		    return this.code.compile(this.scope);
		};
		
		ValidationContext.prototype.dispose = function () {
		    for (var key in this) {
		        this[key] = undefined;
		    }
		};
		
		function jsen(schema, options) {
		    if (type(schema) !== 'object') {
		        throw new Error(INVALID_SCHEMA);
		    }
		
		    options = options || {};
		
		    var counter = 0,
		        id = function () { return 'i' + (counter++); },
		        resolver = new SchemaResolver(schema, options.schemas, options.missing$Ref || false),
		        context = new ValidationContext({
		            schema: schema,
		            resolver: resolver,
		            id: id,
		            schemas: options.schemas,
		            formats: options.formats,
		            greedy: options.greedy || false
		        }),
		        compiled = func('validate', 'data')
		            ('validate.errors = []')
		            ('gen(data, "", validate.errors)')
		            ('return validate.errors.length === 0')
		            .compile({ gen: context.compile() });
		
		    context.dispose();
		    context = null;
		
		    compiled.errors = [];
		
		    compiled.build = function (initial, options) {
		        return build(
		            schema,
		            (options && options.copy === false ? initial : clone(initial)),
		            options && options.additionalProperties,
		            resolver);
		    };
		
		    return compiled;
		}
		
		jsen.browser = browser;
		jsen.clone = clone;
		jsen.equal = equal;
		jsen.unique = unique;
		jsen.ucs2length = ucs2length;
		jsen.SchemaResolver = SchemaResolver;
		jsen.resolve = SchemaResolver.resolvePointer;
		
		module.exports = jsen;
	
	
	/***/ }),
	/* 12 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		module.exports = function func() {
		    var args = Array.apply(null, arguments),
		        name = args.shift(),
		        tab = '  ',
		        lines = '',
		        vars = '',
		        ind = 1,    // indentation
		        bs = '{[',  // block start
		        be = '}]',  // block end
		        space = function () {
		            var sp = tab, i = 0;
		            while (i++ < ind - 1) { sp += tab; }
		            return sp;
		        },
		        add = function (line) {
		            lines += space() + line + '\n';
		        },
		        builder = function (line) {
		            var first = line[0],
		                last = line[line.length - 1];
		
		            if (be.indexOf(first) > -1 && bs.indexOf(last) > -1) {
		                ind--;
		                add(line);
		                ind++;
		            }
		            else if (bs.indexOf(last) > -1) {
		                add(line);
		                ind++;
		            }
		            else if (be.indexOf(first) > -1) {
		                ind--;
		                add(line);
		            }
		            else {
		                add(line);
		            }
		
		            return builder;
		        };
		
		    builder.def = function (id, def) {
		        vars += (vars ? ',\n' + tab + '    ' : '') + id + (def !== undefined ? ' = ' + def : '');
		        return builder;
		    };
		
		    builder.toSource = function () {
		        return 'function ' + name + '(' + args.join(', ') + ') {\n' +
		            tab + '"use strict"' + '\n' +
		            (vars ? tab + 'var ' + vars + ';\n' : '') +
		            lines + '}';
		    };
		
		    builder.compile = function (scope) {
		        var src = 'return (' + builder.toSource() + ')',
		            scp = scope || {},
		            keys = Object.keys(scp),
		            vals = keys.map(function (key) { return scp[key]; });
		
		        return Function.apply(null, keys.concat(src)).apply(null, vals);
		    };
		
		    return builder;
		};
	
	/***/ }),
	/* 13 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		function type(obj) {
		    var str = Object.prototype.toString.call(obj);
		    return str.substr(8, str.length - 9).toLowerCase();
		}
		
		function deepEqual(a, b) {
		    var keysA = Object.keys(a).sort(),
		        keysB = Object.keys(b).sort(),
		        i, key;
		
		    if (!equal(keysA, keysB)) {
		        return false;
		    }
		
		    for (i = 0; i < keysA.length; i++) {
		        key = keysA[i];
		
		        if (!equal(a[key], b[key])) {
		            return false;
		        }
		    }
		
		    return true;
		}
		
		function equal(a, b) {  // jshint ignore: line
		    var typeA = typeof a,
		        typeB = typeof b,
		        i;
		
		    // get detailed object type
		    if (typeA === 'object') {
		        typeA = type(a);
		    }
		
		    // get detailed object type
		    if (typeB === 'object') {
		        typeB = type(b);
		    }
		
		    if (typeA !== typeB) {
		        return false;
		    }
		
		    if (typeA === 'object') {
		        return deepEqual(a, b);
		    }
		
		    if (typeA === 'regexp') {
		        return a.toString() === b.toString();
		    }
		
		    if (typeA === 'array') {
		        if (a.length !== b.length) {
		            return false;
		        }
		
		        for (i = 0; i < a.length; i++) {
		            if (!equal(a[i], b[i])) {
		                return false;
		            }
		        }
		
		        return true;
		    }
		
		    return a === b;
		}
		
		module.exports = equal;
	
	/***/ }),
	/* 14 */
	/***/ (function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var equal = __webpack_require__(13);
		
		function findIndex(arr, value, comparator) {
		    for (var i = 0, len = arr.length; i < len; i++) {
		        if (comparator(arr[i], value)) {
		            return i;
		        }
		    }
		
		    return -1;
		}
		
		module.exports = function unique(arr) {
		    return arr.filter(function uniqueOnly(value, index, self) {
		        return findIndex(self, value, equal) === index;
		    });
		};
		
		module.exports.findIndex = findIndex;
	
	/***/ }),
	/* 15 */
	/***/ (function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var url = __webpack_require__(16),
		    metaschema = __webpack_require__(23),
		    INVALID_SCHEMA_REFERENCE = 'jsen: invalid schema reference',
		    DUPLICATE_SCHEMA_ID = 'jsen: duplicate schema id',
		    CIRCULAR_SCHEMA_REFERENCE = 'jsen: circular schema reference';
		
		function get(obj, path) {
		    if (!path.length) {
		        return obj;
		    }
		
		    var key = path.shift(),
		        val;
		
		    if (obj && typeof obj === 'object' && obj.hasOwnProperty(key)) {
		        val = obj[key];
		    }
		
		    if (path.length) {
		        if (val && typeof val === 'object') {
		            return get(val, path);
		        }
		
		        return undefined;
		    }
		
		    return val;
		}
		
		function refToObj(ref) {
		    var index = ref.indexOf('#'),
		        ret = {
		            base: ref.substr(0, index),
		            path: []
		        };
		
		    if (index < 0) {
		        ret.base = ref;
		        return ret;
		    }
		
		    ref = ref.substr(index + 1);
		
		    if (!ref) {
		        return ret;
		    }
		
		    ret.path = ref.split('/').map(function (segment) {
		        // Reference: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08#section-3
		        return decodeURIComponent(segment)
		            .replace(/~1/g, '/')
		            .replace(/~0/g, '~');
		    });
		
		    if (ref[0] === '/') {
		        ret.path.shift();
		    }
		
		    return ret;
		}
		
		// TODO: Can we prevent nested resolvers and combine schemas instead?
		function SchemaResolver(rootSchema, external, missing$Ref, baseId) {  // jshint ignore: line
		    this.rootSchema = rootSchema;
		    this.resolvers = null;
		    this.resolvedRootSchema = null;
		    this.cache = {};
		    this.idCache = {};
		    this.refCache = { refs: [], schemas: [] };
		    this.missing$Ref = missing$Ref;
		    this.refStack = [];
		
		    baseId = baseId || '';
		
		    this._buildIdCache(rootSchema, baseId);
		
		    // get updated base id after normalizing root schema id
		    baseId = this.refCache.refs[this.refCache.schemas.indexOf(this.rootSchema)] || baseId;
		
		    this._buildResolvers(external, baseId);
		}
		
		SchemaResolver.prototype._cacheId = function (id, schema, resolver) {
		    if (this.idCache[id]) {
		        throw new Error(DUPLICATE_SCHEMA_ID + ' ' + id);
		    }
		
		    this.idCache[id] = { resolver: resolver, schema: schema };
		};
		
		SchemaResolver.prototype._buildIdCache = function (schema, baseId) {
		    var id = baseId,
		        ref, keys, i;
		
		    if (!schema || typeof schema !== 'object') {
		        return;
		    }
		
		    if (typeof schema.id === 'string' && schema.id) {
		        id = url.resolve(baseId, schema.id);
		
		        this._cacheId(id, schema, this);
		    }
		    else if (schema === this.rootSchema && baseId) {
		        this._cacheId(baseId, schema, this);
		    }
		
		    if (schema.$ref && typeof schema.$ref === 'string') {
		        ref = url.resolve(id, schema.$ref);
		
		        this.refCache.schemas.push(schema);
		        this.refCache.refs.push(ref);
		    }
		
		    keys = Object.keys(schema);
		
		    for (i = 0; i < keys.length; i++) {
		        this._buildIdCache(schema[keys[i]], id);
		    }
		};
		
		SchemaResolver.prototype._buildResolvers = function (schemas, baseId) {
		    if (!schemas || typeof schemas !== 'object') {
		        return;
		    }
		
		    var that = this,
		        resolvers = {};
		
		    Object.keys(schemas).forEach(function (key) {
		        var id = url.resolve(baseId, key),
		            resolver = new SchemaResolver(schemas[key], null, that.missing$Ref, id);
		
		        that._cacheId(id, resolver.rootSchema, resolver);
		
		        Object.keys(resolver.idCache).forEach(function (idKey) {
		            that.idCache[idKey] = resolver.idCache[idKey];
		        });
		
		        resolvers[key] = resolver;
		    });
		
		    this.resolvers = resolvers;
		};
		
		SchemaResolver.prototype.getNormalizedRef = function (schema) {
		    var index = this.refCache.schemas.indexOf(schema);
		    return this.refCache.refs[index];
		};
		
		SchemaResolver.prototype._resolveRef = function (ref) {
		    var err = new Error(INVALID_SCHEMA_REFERENCE + ' ' + ref),
		        idCache = this.idCache,
		        externalResolver, cached, descriptor, path, dest;
		
		    if (!ref || typeof ref !== 'string') {
		        throw err;
		    }
		
		    if (ref === metaschema.id) {
		        dest = metaschema;
		    }
		
		    cached = idCache[ref];
		
		    if (cached) {
		        dest = cached.resolver.resolve(cached.schema);
		    }
		
		    if (dest === undefined) {
		        descriptor = refToObj(ref);
		        path = descriptor.path;
		
		        if (descriptor.base) {
		            cached = idCache[descriptor.base] || idCache[descriptor.base + '#'];
		
		            if (cached) {
		                dest = cached.resolver.resolve(get(cached.schema, path.slice(0)));
		            }
		            else {
		                path.unshift(descriptor.base);
		            }
		        }
		    }
		
		    if (dest === undefined && this.resolvedRootSchema) {
		        dest = get(this.resolvedRootSchema, path.slice(0));
		    }
		
		    if (dest === undefined) {
		        dest = get(this.rootSchema, path.slice(0));
		    }
		
		    if (dest === undefined && path.length && this.resolvers) {
		        externalResolver = get(this.resolvers, path);
		
		        if (externalResolver) {
		            dest = externalResolver.resolve(externalResolver.rootSchema);
		        }
		    }
		
		    if (dest === undefined || typeof dest !== 'object') {
		        if (this.missing$Ref) {
		            dest = {};
		        } else {
		            throw err;
		        }
		    }
		
		    if (this.cache[ref] === dest) {
		        return dest;
		    }
		
		    this.cache[ref] = dest;
		
		    if (dest.$ref !== undefined) {
		        dest = this.resolve(dest);
		    }
		
		    return dest;
		};
		
		SchemaResolver.prototype.resolve = function (schema) {
		    if (!schema || typeof schema !== 'object' || schema.$ref === undefined) {
		        return schema;
		    }
		
		    var ref = this.getNormalizedRef(schema) || schema.$ref,
		        resolved = this.cache[ref];
		
		    if (resolved !== undefined) {
		        return resolved;
		    }
		
		    if (this.refStack.indexOf(ref) > -1) {
		        throw new Error(CIRCULAR_SCHEMA_REFERENCE + ' ' + ref);
		    }
		
		    this.refStack.push(ref);
		
		    resolved = this._resolveRef(ref);
		
		    this.refStack.pop();
		
		    if (schema === this.rootSchema) {
		        // cache the resolved root schema
		        this.resolvedRootSchema = resolved;
		    }
		
		    return resolved;
		};
		
		SchemaResolver.prototype.hasRef = function (schema) {
		    var keys = Object.keys(schema),
		        len, key, i, hasChildRef;
		
		    if (keys.indexOf('$ref') > -1) {
		        return true;
		    }
		
		    for (i = 0, len = keys.length; i < len; i++) {
		        key = keys[i];
		
		        if (schema[key] && typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
		            hasChildRef = this.hasRef(schema[key]);
		
		            if (hasChildRef) {
		                return true;
		            }
		        }
		    }
		
		    return false;
		};
		
		SchemaResolver.resolvePointer = function (obj, pointer) {
		    var descriptor = refToObj(pointer),
		        path = descriptor.path;
		
		    if (descriptor.base) {
		        path = [descriptor.base].concat(path);
		    }
		
		    return get(obj, path);
		};
		
		module.exports = SchemaResolver;
	
	/***/ }),
	/* 16 */
	/***/ (function(module, exports, __webpack_require__) {
	
		// Copyright Joyent, Inc. and other Node contributors.
		//
		// Permission is hereby granted, free of charge, to any person obtaining a
		// copy of this software and associated documentation files (the
		// "Software"), to deal in the Software without restriction, including
		// without limitation the rights to use, copy, modify, merge, publish,
		// distribute, sublicense, and/or sell copies of the Software, and to permit
		// persons to whom the Software is furnished to do so, subject to the
		// following conditions:
		//
		// The above copyright notice and this permission notice shall be included
		// in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
		// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
		// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
		// USE OR OTHER DEALINGS IN THE SOFTWARE.
		
		'use strict';
		
		var punycode = __webpack_require__(17);
		var util = __webpack_require__(19);
		
		exports.parse = urlParse;
		exports.resolve = urlResolve;
		exports.resolveObject = urlResolveObject;
		exports.format = urlFormat;
		
		exports.Url = Url;
		
		function Url() {
		  this.protocol = null;
		  this.slashes = null;
		  this.auth = null;
		  this.host = null;
		  this.port = null;
		  this.hostname = null;
		  this.hash = null;
		  this.search = null;
		  this.query = null;
		  this.pathname = null;
		  this.path = null;
		  this.href = null;
		}
		
		// Reference: RFC 3986, RFC 1808, RFC 2396
		
		// define these here so at least they only have to be
		// compiled once on the first module load.
		var protocolPattern = /^([a-z0-9.+-]+:)/i,
		    portPattern = /:[0-9]*$/,
		
		    // Special case for a simple path URL
		    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
		
		    // RFC 2396: characters reserved for delimiting URLs.
		    // We actually just auto-escape these.
		    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
		
		    // RFC 2396: characters not allowed for various reasons.
		    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
		
		    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
		    autoEscape = ['\''].concat(unwise),
		    // Characters that are never ever allowed in a hostname.
		    // Note that any invalid chars are also handled, but these
		    // are the ones that are *expected* to be seen, so we fast-path
		    // them.
		    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
		    hostEndingChars = ['/', '?', '#'],
		    hostnameMaxLen = 255,
		    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
		    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
		    // protocols that can allow "unsafe" and "unwise" chars.
		    unsafeProtocol = {
		      'javascript': true,
		      'javascript:': true
		    },
		    // protocols that never have a hostname.
		    hostlessProtocol = {
		      'javascript': true,
		      'javascript:': true
		    },
		    // protocols that always contain a // bit.
		    slashedProtocol = {
		      'http': true,
		      'https': true,
		      'ftp': true,
		      'gopher': true,
		      'file': true,
		      'http:': true,
		      'https:': true,
		      'ftp:': true,
		      'gopher:': true,
		      'file:': true
		    },
		    querystring = __webpack_require__(20);
		
		function urlParse(url, parseQueryString, slashesDenoteHost) {
		  if (url && util.isObject(url) && url instanceof Url) return url;
		
		  var u = new Url;
		  u.parse(url, parseQueryString, slashesDenoteHost);
		  return u;
		}
		
		Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
		  if (!util.isString(url)) {
		    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
		  }
		
		  // Copy chrome, IE, opera backslash-handling behavior.
		  // Back slashes before the query string get converted to forward slashes
		  // See: https://code.google.com/p/chromium/issues/detail?id=25916
		  var queryIndex = url.indexOf('?'),
		      splitter =
		          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
		      uSplit = url.split(splitter),
		      slashRegex = /\\/g;
		  uSplit[0] = uSplit[0].replace(slashRegex, '/');
		  url = uSplit.join(splitter);
		
		  var rest = url;
		
		  // trim before proceeding.
		  // This is to support parse stuff like "  http://foo.com  \n"
		  rest = rest.trim();
		
		  if (!slashesDenoteHost && url.split('#').length === 1) {
		    // Try fast path regexp
		    var simplePath = simplePathPattern.exec(rest);
		    if (simplePath) {
		      this.path = rest;
		      this.href = rest;
		      this.pathname = simplePath[1];
		      if (simplePath[2]) {
		        this.search = simplePath[2];
		        if (parseQueryString) {
		          this.query = querystring.parse(this.search.substr(1));
		        } else {
		          this.query = this.search.substr(1);
		        }
		      } else if (parseQueryString) {
		        this.search = '';
		        this.query = {};
		      }
		      return this;
		    }
		  }
		
		  var proto = protocolPattern.exec(rest);
		  if (proto) {
		    proto = proto[0];
		    var lowerProto = proto.toLowerCase();
		    this.protocol = lowerProto;
		    rest = rest.substr(proto.length);
		  }
		
		  // figure out if it's got a host
		  // user@server is *always* interpreted as a hostname, and url
		  // resolution will treat //foo/bar as host=foo,path=bar because that's
		  // how the browser resolves relative URLs.
		  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
		    var slashes = rest.substr(0, 2) === '//';
		    if (slashes && !(proto && hostlessProtocol[proto])) {
		      rest = rest.substr(2);
		      this.slashes = true;
		    }
		  }
		
		  if (!hostlessProtocol[proto] &&
		      (slashes || (proto && !slashedProtocol[proto]))) {
		
		    // there's a hostname.
		    // the first instance of /, ?, ;, or # ends the host.
		    //
		    // If there is an @ in the hostname, then non-host chars *are* allowed
		    // to the left of the last @ sign, unless some host-ending character
		    // comes *before* the @-sign.
		    // URLs are obnoxious.
		    //
		    // ex:
		    // http://a@b@c/ => user:a@b host:c
		    // http://a@b?@c => user:a host:c path:/?@c
		
		    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
		    // Review our test case against browsers more comprehensively.
		
		    // find the first instance of any hostEndingChars
		    var hostEnd = -1;
		    for (var i = 0; i < hostEndingChars.length; i++) {
		      var hec = rest.indexOf(hostEndingChars[i]);
		      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
		        hostEnd = hec;
		    }
		
		    // at this point, either we have an explicit point where the
		    // auth portion cannot go past, or the last @ char is the decider.
		    var auth, atSign;
		    if (hostEnd === -1) {
		      // atSign can be anywhere.
		      atSign = rest.lastIndexOf('@');
		    } else {
		      // atSign must be in auth portion.
		      // http://a@b/c@d => host:b auth:a path:/c@d
		      atSign = rest.lastIndexOf('@', hostEnd);
		    }
		
		    // Now we have a portion which is definitely the auth.
		    // Pull that off.
		    if (atSign !== -1) {
		      auth = rest.slice(0, atSign);
		      rest = rest.slice(atSign + 1);
		      this.auth = decodeURIComponent(auth);
		    }
		
		    // the host is the remaining to the left of the first non-host char
		    hostEnd = -1;
		    for (var i = 0; i < nonHostChars.length; i++) {
		      var hec = rest.indexOf(nonHostChars[i]);
		      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
		        hostEnd = hec;
		    }
		    // if we still have not hit it, then the entire thing is a host.
		    if (hostEnd === -1)
		      hostEnd = rest.length;
		
		    this.host = rest.slice(0, hostEnd);
		    rest = rest.slice(hostEnd);
		
		    // pull out port.
		    this.parseHost();
		
		    // we've indicated that there is a hostname,
		    // so even if it's empty, it has to be present.
		    this.hostname = this.hostname || '';
		
		    // if hostname begins with [ and ends with ]
		    // assume that it's an IPv6 address.
		    var ipv6Hostname = this.hostname[0] === '[' &&
		        this.hostname[this.hostname.length - 1] === ']';
		
		    // validate a little.
		    if (!ipv6Hostname) {
		      var hostparts = this.hostname.split(/\./);
		      for (var i = 0, l = hostparts.length; i < l; i++) {
		        var part = hostparts[i];
		        if (!part) continue;
		        if (!part.match(hostnamePartPattern)) {
		          var newpart = '';
		          for (var j = 0, k = part.length; j < k; j++) {
		            if (part.charCodeAt(j) > 127) {
		              // we replace non-ASCII char with a temporary placeholder
		              // we need this to make sure size of hostname is not
		              // broken by replacing non-ASCII by nothing
		              newpart += 'x';
		            } else {
		              newpart += part[j];
		            }
		          }
		          // we test again with ASCII char only
		          if (!newpart.match(hostnamePartPattern)) {
		            var validParts = hostparts.slice(0, i);
		            var notHost = hostparts.slice(i + 1);
		            var bit = part.match(hostnamePartStart);
		            if (bit) {
		              validParts.push(bit[1]);
		              notHost.unshift(bit[2]);
		            }
		            if (notHost.length) {
		              rest = '/' + notHost.join('.') + rest;
		            }
		            this.hostname = validParts.join('.');
		            break;
		          }
		        }
		      }
		    }
		
		    if (this.hostname.length > hostnameMaxLen) {
		      this.hostname = '';
		    } else {
		      // hostnames are always lower case.
		      this.hostname = this.hostname.toLowerCase();
		    }
		
		    if (!ipv6Hostname) {
		      // IDNA Support: Returns a punycoded representation of "domain".
		      // It only converts parts of the domain name that
		      // have non-ASCII characters, i.e. it doesn't matter if
		      // you call it with a domain that already is ASCII-only.
		      this.hostname = punycode.toASCII(this.hostname);
		    }
		
		    var p = this.port ? ':' + this.port : '';
		    var h = this.hostname || '';
		    this.host = h + p;
		    this.href += this.host;
		
		    // strip [ and ] from the hostname
		    // the host field still retains them, though
		    if (ipv6Hostname) {
		      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
		      if (rest[0] !== '/') {
		        rest = '/' + rest;
		      }
		    }
		  }
		
		  // now rest is set to the post-host stuff.
		  // chop off any delim chars.
		  if (!unsafeProtocol[lowerProto]) {
		
		    // First, make 100% sure that any "autoEscape" chars get
		    // escaped, even if encodeURIComponent doesn't think they
		    // need to be.
		    for (var i = 0, l = autoEscape.length; i < l; i++) {
		      var ae = autoEscape[i];
		      if (rest.indexOf(ae) === -1)
		        continue;
		      var esc = encodeURIComponent(ae);
		      if (esc === ae) {
		        esc = escape(ae);
		      }
		      rest = rest.split(ae).join(esc);
		    }
		  }
		
		
		  // chop off from the tail first.
		  var hash = rest.indexOf('#');
		  if (hash !== -1) {
		    // got a fragment string.
		    this.hash = rest.substr(hash);
		    rest = rest.slice(0, hash);
		  }
		  var qm = rest.indexOf('?');
		  if (qm !== -1) {
		    this.search = rest.substr(qm);
		    this.query = rest.substr(qm + 1);
		    if (parseQueryString) {
		      this.query = querystring.parse(this.query);
		    }
		    rest = rest.slice(0, qm);
		  } else if (parseQueryString) {
		    // no query string, but parseQueryString still requested
		    this.search = '';
		    this.query = {};
		  }
		  if (rest) this.pathname = rest;
		  if (slashedProtocol[lowerProto] &&
		      this.hostname && !this.pathname) {
		    this.pathname = '/';
		  }
		
		  //to support http.request
		  if (this.pathname || this.search) {
		    var p = this.pathname || '';
		    var s = this.search || '';
		    this.path = p + s;
		  }
		
		  // finally, reconstruct the href based on what has been validated.
		  this.href = this.format();
		  return this;
		};
		
		// format a parsed object into a url string
		function urlFormat(obj) {
		  // ensure it's an object, and not a string url.
		  // If it's an obj, this is a no-op.
		  // this way, you can call url_format() on strings
		  // to clean up potentially wonky urls.
		  if (util.isString(obj)) obj = urlParse(obj);
		  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
		  return obj.format();
		}
		
		Url.prototype.format = function() {
		  var auth = this.auth || '';
		  if (auth) {
		    auth = encodeURIComponent(auth);
		    auth = auth.replace(/%3A/i, ':');
		    auth += '@';
		  }
		
		  var protocol = this.protocol || '',
		      pathname = this.pathname || '',
		      hash = this.hash || '',
		      host = false,
		      query = '';
		
		  if (this.host) {
		    host = auth + this.host;
		  } else if (this.hostname) {
		    host = auth + (this.hostname.indexOf(':') === -1 ?
		        this.hostname :
		        '[' + this.hostname + ']');
		    if (this.port) {
		      host += ':' + this.port;
		    }
		  }
		
		  if (this.query &&
		      util.isObject(this.query) &&
		      Object.keys(this.query).length) {
		    query = querystring.stringify(this.query);
		  }
		
		  var search = this.search || (query && ('?' + query)) || '';
		
		  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
		
		  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
		  // unless they had them to begin with.
		  if (this.slashes ||
		      (!protocol || slashedProtocol[protocol]) && host !== false) {
		    host = '//' + (host || '');
		    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
		  } else if (!host) {
		    host = '';
		  }
		
		  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
		  if (search && search.charAt(0) !== '?') search = '?' + search;
		
		  pathname = pathname.replace(/[?#]/g, function(match) {
		    return encodeURIComponent(match);
		  });
		  search = search.replace('#', '%23');
		
		  return protocol + host + pathname + search + hash;
		};
		
		function urlResolve(source, relative) {
		  return urlParse(source, false, true).resolve(relative);
		}
		
		Url.prototype.resolve = function(relative) {
		  return this.resolveObject(urlParse(relative, false, true)).format();
		};
		
		function urlResolveObject(source, relative) {
		  if (!source) return relative;
		  return urlParse(source, false, true).resolveObject(relative);
		}
		
		Url.prototype.resolveObject = function(relative) {
		  if (util.isString(relative)) {
		    var rel = new Url();
		    rel.parse(relative, false, true);
		    relative = rel;
		  }
		
		  var result = new Url();
		  var tkeys = Object.keys(this);
		  for (var tk = 0; tk < tkeys.length; tk++) {
		    var tkey = tkeys[tk];
		    result[tkey] = this[tkey];
		  }
		
		  // hash is always overridden, no matter what.
		  // even href="" will remove it.
		  result.hash = relative.hash;
		
		  // if the relative url is empty, then there's nothing left to do here.
		  if (relative.href === '') {
		    result.href = result.format();
		    return result;
		  }
		
		  // hrefs like //foo/bar always cut to the protocol.
		  if (relative.slashes && !relative.protocol) {
		    // take everything except the protocol from relative
		    var rkeys = Object.keys(relative);
		    for (var rk = 0; rk < rkeys.length; rk++) {
		      var rkey = rkeys[rk];
		      if (rkey !== 'protocol')
		        result[rkey] = relative[rkey];
		    }
		
		    //urlParse appends trailing / to urls like http://www.example.com
		    if (slashedProtocol[result.protocol] &&
		        result.hostname && !result.pathname) {
		      result.path = result.pathname = '/';
		    }
		
		    result.href = result.format();
		    return result;
		  }
		
		  if (relative.protocol && relative.protocol !== result.protocol) {
		    // if it's a known url protocol, then changing
		    // the protocol does weird things
		    // first, if it's not file:, then we MUST have a host,
		    // and if there was a path
		    // to begin with, then we MUST have a path.
		    // if it is file:, then the host is dropped,
		    // because that's known to be hostless.
		    // anything else is assumed to be absolute.
		    if (!slashedProtocol[relative.protocol]) {
		      var keys = Object.keys(relative);
		      for (var v = 0; v < keys.length; v++) {
		        var k = keys[v];
		        result[k] = relative[k];
		      }
		      result.href = result.format();
		      return result;
		    }
		
		    result.protocol = relative.protocol;
		    if (!relative.host && !hostlessProtocol[relative.protocol]) {
		      var relPath = (relative.pathname || '').split('/');
		      while (relPath.length && !(relative.host = relPath.shift()));
		      if (!relative.host) relative.host = '';
		      if (!relative.hostname) relative.hostname = '';
		      if (relPath[0] !== '') relPath.unshift('');
		      if (relPath.length < 2) relPath.unshift('');
		      result.pathname = relPath.join('/');
		    } else {
		      result.pathname = relative.pathname;
		    }
		    result.search = relative.search;
		    result.query = relative.query;
		    result.host = relative.host || '';
		    result.auth = relative.auth;
		    result.hostname = relative.hostname || relative.host;
		    result.port = relative.port;
		    // to support http.request
		    if (result.pathname || result.search) {
		      var p = result.pathname || '';
		      var s = result.search || '';
		      result.path = p + s;
		    }
		    result.slashes = result.slashes || relative.slashes;
		    result.href = result.format();
		    return result;
		  }
		
		  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
		      isRelAbs = (
		          relative.host ||
		          relative.pathname && relative.pathname.charAt(0) === '/'
		      ),
		      mustEndAbs = (isRelAbs || isSourceAbs ||
		                    (result.host && relative.pathname)),
		      removeAllDots = mustEndAbs,
		      srcPath = result.pathname && result.pathname.split('/') || [],
		      relPath = relative.pathname && relative.pathname.split('/') || [],
		      psychotic = result.protocol && !slashedProtocol[result.protocol];
		
		  // if the url is a non-slashed url, then relative
		  // links like ../.. should be able
		  // to crawl up to the hostname, as well.  This is strange.
		  // result.protocol has already been set by now.
		  // Later on, put the first path part into the host field.
		  if (psychotic) {
		    result.hostname = '';
		    result.port = null;
		    if (result.host) {
		      if (srcPath[0] === '') srcPath[0] = result.host;
		      else srcPath.unshift(result.host);
		    }
		    result.host = '';
		    if (relative.protocol) {
		      relative.hostname = null;
		      relative.port = null;
		      if (relative.host) {
		        if (relPath[0] === '') relPath[0] = relative.host;
		        else relPath.unshift(relative.host);
		      }
		      relative.host = null;
		    }
		    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
		  }
		
		  if (isRelAbs) {
		    // it's absolute.
		    result.host = (relative.host || relative.host === '') ?
		                  relative.host : result.host;
		    result.hostname = (relative.hostname || relative.hostname === '') ?
		                      relative.hostname : result.hostname;
		    result.search = relative.search;
		    result.query = relative.query;
		    srcPath = relPath;
		    // fall through to the dot-handling below.
		  } else if (relPath.length) {
		    // it's relative
		    // throw away the existing file, and take the new path instead.
		    if (!srcPath) srcPath = [];
		    srcPath.pop();
		    srcPath = srcPath.concat(relPath);
		    result.search = relative.search;
		    result.query = relative.query;
		  } else if (!util.isNullOrUndefined(relative.search)) {
		    // just pull out the search.
		    // like href='?foo'.
		    // Put this after the other two cases because it simplifies the booleans
		    if (psychotic) {
		      result.hostname = result.host = srcPath.shift();
		      //occationaly the auth can get stuck only in host
		      //this especially happens in cases like
		      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
		      var authInHost = result.host && result.host.indexOf('@') > 0 ?
		                       result.host.split('@') : false;
		      if (authInHost) {
		        result.auth = authInHost.shift();
		        result.host = result.hostname = authInHost.shift();
		      }
		    }
		    result.search = relative.search;
		    result.query = relative.query;
		    //to support http.request
		    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
		      result.path = (result.pathname ? result.pathname : '') +
		                    (result.search ? result.search : '');
		    }
		    result.href = result.format();
		    return result;
		  }
		
		  if (!srcPath.length) {
		    // no path at all.  easy.
		    // we've already handled the other stuff above.
		    result.pathname = null;
		    //to support http.request
		    if (result.search) {
		      result.path = '/' + result.search;
		    } else {
		      result.path = null;
		    }
		    result.href = result.format();
		    return result;
		  }
		
		  // if a url ENDs in . or .., then it must get a trailing slash.
		  // however, if it ends in anything else non-slashy,
		  // then it must NOT get a trailing slash.
		  var last = srcPath.slice(-1)[0];
		  var hasTrailingSlash = (
		      (result.host || relative.host || srcPath.length > 1) &&
		      (last === '.' || last === '..') || last === '');
		
		  // strip single dots, resolve double dots to parent dir
		  // if the path tries to go above the root, `up` ends up > 0
		  var up = 0;
		  for (var i = srcPath.length; i >= 0; i--) {
		    last = srcPath[i];
		    if (last === '.') {
		      srcPath.splice(i, 1);
		    } else if (last === '..') {
		      srcPath.splice(i, 1);
		      up++;
		    } else if (up) {
		      srcPath.splice(i, 1);
		      up--;
		    }
		  }
		
		  // if the path is allowed to go above the root, restore leading ..s
		  if (!mustEndAbs && !removeAllDots) {
		    for (; up--; up) {
		      srcPath.unshift('..');
		    }
		  }
		
		  if (mustEndAbs && srcPath[0] !== '' &&
		      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
		    srcPath.unshift('');
		  }
		
		  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
		    srcPath.push('');
		  }
		
		  var isAbsolute = srcPath[0] === '' ||
		      (srcPath[0] && srcPath[0].charAt(0) === '/');
		
		  // put the host back
		  if (psychotic) {
		    result.hostname = result.host = isAbsolute ? '' :
		                                    srcPath.length ? srcPath.shift() : '';
		    //occationaly the auth can get stuck only in host
		    //this especially happens in cases like
		    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
		    var authInHost = result.host && result.host.indexOf('@') > 0 ?
		                     result.host.split('@') : false;
		    if (authInHost) {
		      result.auth = authInHost.shift();
		      result.host = result.hostname = authInHost.shift();
		    }
		  }
		
		  mustEndAbs = mustEndAbs || (result.host && srcPath.length);
		
		  if (mustEndAbs && !isAbsolute) {
		    srcPath.unshift('');
		  }
		
		  if (!srcPath.length) {
		    result.pathname = null;
		    result.path = null;
		  } else {
		    result.pathname = srcPath.join('/');
		  }
		
		  //to support request.http
		  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
		    result.path = (result.pathname ? result.pathname : '') +
		                  (result.search ? result.search : '');
		  }
		  result.auth = relative.auth || result.auth;
		  result.slashes = result.slashes || relative.slashes;
		  result.href = result.format();
		  return result;
		};
		
		Url.prototype.parseHost = function() {
		  var host = this.host;
		  var port = portPattern.exec(host);
		  if (port) {
		    port = port[0];
		    if (port !== ':') {
		      this.port = port.substr(1);
		    }
		    host = host.substr(0, host.length - port.length);
		  }
		  if (host) this.hostname = host;
		};
	
	
	/***/ }),
	/* 17 */
	/***/ (function(module, exports, __webpack_require__) {
	
		var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
		;(function(root) {
		
			/** Detect free variables */
			var freeExports = typeof exports == 'object' && exports &&
				!exports.nodeType && exports;
			var freeModule = typeof module == 'object' && module &&
				!module.nodeType && module;
			var freeGlobal = typeof global == 'object' && global;
			if (
				freeGlobal.global === freeGlobal ||
				freeGlobal.window === freeGlobal ||
				freeGlobal.self === freeGlobal
			) {
				root = freeGlobal;
			}
		
			/**
			 * The `punycode` object.
			 * @name punycode
			 * @type Object
			 */
			var punycode,
		
			/** Highest positive signed 32-bit float value */
			maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
		
			/** Bootstring parameters */
			base = 36,
			tMin = 1,
			tMax = 26,
			skew = 38,
			damp = 700,
			initialBias = 72,
			initialN = 128, // 0x80
			delimiter = '-', // '\x2D'
		
			/** Regular expressions */
			regexPunycode = /^xn--/,
			regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
			regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
		
			/** Error messages */
			errors = {
				'overflow': 'Overflow: input needs wider integers to process',
				'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
				'invalid-input': 'Invalid input'
			},
		
			/** Convenience shortcuts */
			baseMinusTMin = base - tMin,
			floor = Math.floor,
			stringFromCharCode = String.fromCharCode,
		
			/** Temporary variable */
			key;
		
			/*--------------------------------------------------------------------------*/
		
			/**
			 * A generic error utility function.
			 * @private
			 * @param {String} type The error type.
			 * @returns {Error} Throws a `RangeError` with the applicable error message.
			 */
			function error(type) {
				throw RangeError(errors[type]);
			}
		
			/**
			 * A generic `Array#map` utility function.
			 * @private
			 * @param {Array} array The array to iterate over.
			 * @param {Function} callback The function that gets called for every array
			 * item.
			 * @returns {Array} A new array of values returned by the callback function.
			 */
			function map(array, fn) {
				var length = array.length;
				var result = [];
				while (length--) {
					result[length] = fn(array[length]);
				}
				return result;
			}
		
			/**
			 * A simple `Array#map`-like wrapper to work with domain name strings or email
			 * addresses.
			 * @private
			 * @param {String} domain The domain name or email address.
			 * @param {Function} callback The function that gets called for every
			 * character.
			 * @returns {Array} A new string of characters returned by the callback
			 * function.
			 */
			function mapDomain(string, fn) {
				var parts = string.split('@');
				var result = '';
				if (parts.length > 1) {
					// In email addresses, only the domain name should be punycoded. Leave
					// the local part (i.e. everything up to `@`) intact.
					result = parts[0] + '@';
					string = parts[1];
				}
				// Avoid `split(regex)` for IE8 compatibility. See #17.
				string = string.replace(regexSeparators, '\x2E');
				var labels = string.split('.');
				var encoded = map(labels, fn).join('.');
				return result + encoded;
			}
		
			/**
			 * Creates an array containing the numeric code points of each Unicode
			 * character in the string. While JavaScript uses UCS-2 internally,
			 * this function will convert a pair of surrogate halves (each of which
			 * UCS-2 exposes as separate characters) into a single code point,
			 * matching UTF-16.
			 * @see `punycode.ucs2.encode`
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode.ucs2
			 * @name decode
			 * @param {String} string The Unicode input string (UCS-2).
			 * @returns {Array} The new array of code points.
			 */
			function ucs2decode(string) {
				var output = [],
				    counter = 0,
				    length = string.length,
				    value,
				    extra;
				while (counter < length) {
					value = string.charCodeAt(counter++);
					if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
						// high surrogate, and there is a next character
						extra = string.charCodeAt(counter++);
						if ((extra & 0xFC00) == 0xDC00) { // low surrogate
							output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
						} else {
							// unmatched surrogate; only append this code unit, in case the next
							// code unit is the high surrogate of a surrogate pair
							output.push(value);
							counter--;
						}
					} else {
						output.push(value);
					}
				}
				return output;
			}
		
			/**
			 * Creates a string based on an array of numeric code points.
			 * @see `punycode.ucs2.decode`
			 * @memberOf punycode.ucs2
			 * @name encode
			 * @param {Array} codePoints The array of numeric code points.
			 * @returns {String} The new Unicode string (UCS-2).
			 */
			function ucs2encode(array) {
				return map(array, function(value) {
					var output = '';
					if (value > 0xFFFF) {
						value -= 0x10000;
						output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
						value = 0xDC00 | value & 0x3FF;
					}
					output += stringFromCharCode(value);
					return output;
				}).join('');
			}
		
			/**
			 * Converts a basic code point into a digit/integer.
			 * @see `digitToBasic()`
			 * @private
			 * @param {Number} codePoint The basic numeric code point value.
			 * @returns {Number} The numeric value of a basic code point (for use in
			 * representing integers) in the range `0` to `base - 1`, or `base` if
			 * the code point does not represent a value.
			 */
			function basicToDigit(codePoint) {
				if (codePoint - 48 < 10) {
					return codePoint - 22;
				}
				if (codePoint - 65 < 26) {
					return codePoint - 65;
				}
				if (codePoint - 97 < 26) {
					return codePoint - 97;
				}
				return base;
			}
		
			/**
			 * Converts a digit/integer into a basic code point.
			 * @see `basicToDigit()`
			 * @private
			 * @param {Number} digit The numeric value of a basic code point.
			 * @returns {Number} The basic code point whose value (when used for
			 * representing integers) is `digit`, which needs to be in the range
			 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
			 * used; else, the lowercase form is used. The behavior is undefined
			 * if `flag` is non-zero and `digit` has no uppercase form.
			 */
			function digitToBasic(digit, flag) {
				//  0..25 map to ASCII a..z or A..Z
				// 26..35 map to ASCII 0..9
				return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
			}
		
			/**
			 * Bias adaptation function as per section 3.4 of RFC 3492.
			 * http://tools.ietf.org/html/rfc3492#section-3.4
			 * @private
			 */
			function adapt(delta, numPoints, firstTime) {
				var k = 0;
				delta = firstTime ? floor(delta / damp) : delta >> 1;
				delta += floor(delta / numPoints);
				for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
					delta = floor(delta / baseMinusTMin);
				}
				return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
			}
		
			/**
			 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
			 * symbols.
			 * @memberOf punycode
			 * @param {String} input The Punycode string of ASCII-only symbols.
			 * @returns {String} The resulting string of Unicode symbols.
			 */
			function decode(input) {
				// Don't use UCS-2
				var output = [],
				    inputLength = input.length,
				    out,
				    i = 0,
				    n = initialN,
				    bias = initialBias,
				    basic,
				    j,
				    index,
				    oldi,
				    w,
				    k,
				    digit,
				    t,
				    /** Cached calculation results */
				    baseMinusT;
		
				// Handle the basic code points: let `basic` be the number of input code
				// points before the last delimiter, or `0` if there is none, then copy
				// the first basic code points to the output.
		
				basic = input.lastIndexOf(delimiter);
				if (basic < 0) {
					basic = 0;
				}
		
				for (j = 0; j < basic; ++j) {
					// if it's not a basic code point
					if (input.charCodeAt(j) >= 0x80) {
						error('not-basic');
					}
					output.push(input.charCodeAt(j));
				}
		
				// Main decoding loop: start just after the last delimiter if any basic code
				// points were copied; start at the beginning otherwise.
		
				for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
		
					// `index` is the index of the next character to be consumed.
					// Decode a generalized variable-length integer into `delta`,
					// which gets added to `i`. The overflow checking is easier
					// if we increase `i` as we go, then subtract off its starting
					// value at the end to obtain `delta`.
					for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
		
						if (index >= inputLength) {
							error('invalid-input');
						}
		
						digit = basicToDigit(input.charCodeAt(index++));
		
						if (digit >= base || digit > floor((maxInt - i) / w)) {
							error('overflow');
						}
		
						i += digit * w;
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
		
						if (digit < t) {
							break;
						}
		
						baseMinusT = base - t;
						if (w > floor(maxInt / baseMinusT)) {
							error('overflow');
						}
		
						w *= baseMinusT;
		
					}
		
					out = output.length + 1;
					bias = adapt(i - oldi, out, oldi == 0);
		
					// `i` was supposed to wrap around from `out` to `0`,
					// incrementing `n` each time, so we'll fix that now:
					if (floor(i / out) > maxInt - n) {
						error('overflow');
					}
		
					n += floor(i / out);
					i %= out;
		
					// Insert `n` at position `i` of the output
					output.splice(i++, 0, n);
		
				}
		
				return ucs2encode(output);
			}
		
			/**
			 * Converts a string of Unicode symbols (e.g. a domain name label) to a
			 * Punycode string of ASCII-only symbols.
			 * @memberOf punycode
			 * @param {String} input The string of Unicode symbols.
			 * @returns {String} The resulting Punycode string of ASCII-only symbols.
			 */
			function encode(input) {
				var n,
				    delta,
				    handledCPCount,
				    basicLength,
				    bias,
				    j,
				    m,
				    q,
				    k,
				    t,
				    currentValue,
				    output = [],
				    /** `inputLength` will hold the number of code points in `input`. */
				    inputLength,
				    /** Cached calculation results */
				    handledCPCountPlusOne,
				    baseMinusT,
				    qMinusT;
		
				// Convert the input in UCS-2 to Unicode
				input = ucs2decode(input);
		
				// Cache the length
				inputLength = input.length;
		
				// Initialize the state
				n = initialN;
				delta = 0;
				bias = initialBias;
		
				// Handle the basic code points
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue < 0x80) {
						output.push(stringFromCharCode(currentValue));
					}
				}
		
				handledCPCount = basicLength = output.length;
		
				// `handledCPCount` is the number of code points that have been handled;
				// `basicLength` is the number of basic code points.
		
				// Finish the basic string - if it is not empty - with a delimiter
				if (basicLength) {
					output.push(delimiter);
				}
		
				// Main encoding loop:
				while (handledCPCount < inputLength) {
		
					// All non-basic code points < n have been handled already. Find the next
					// larger one:
					for (m = maxInt, j = 0; j < inputLength; ++j) {
						currentValue = input[j];
						if (currentValue >= n && currentValue < m) {
							m = currentValue;
						}
					}
		
					// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
					// but guard against overflow
					handledCPCountPlusOne = handledCPCount + 1;
					if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
						error('overflow');
					}
		
					delta += (m - n) * handledCPCountPlusOne;
					n = m;
		
					for (j = 0; j < inputLength; ++j) {
						currentValue = input[j];
		
						if (currentValue < n && ++delta > maxInt) {
							error('overflow');
						}
		
						if (currentValue == n) {
							// Represent delta as a generalized variable-length integer
							for (q = delta, k = base; /* no condition */; k += base) {
								t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
								if (q < t) {
									break;
								}
								qMinusT = q - t;
								baseMinusT = base - t;
								output.push(
									stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
								);
								q = floor(qMinusT / baseMinusT);
							}
		
							output.push(stringFromCharCode(digitToBasic(q, 0)));
							bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
							delta = 0;
							++handledCPCount;
						}
					}
		
					++delta;
					++n;
		
				}
				return output.join('');
			}
		
			/**
			 * Converts a Punycode string representing a domain name or an email address
			 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
			 * it doesn't matter if you call it on a string that has already been
			 * converted to Unicode.
			 * @memberOf punycode
			 * @param {String} input The Punycoded domain name or email address to
			 * convert to Unicode.
			 * @returns {String} The Unicode representation of the given Punycode
			 * string.
			 */
			function toUnicode(input) {
				return mapDomain(input, function(string) {
					return regexPunycode.test(string)
						? decode(string.slice(4).toLowerCase())
						: string;
				});
			}
		
			/**
			 * Converts a Unicode string representing a domain name or an email address to
			 * Punycode. Only the non-ASCII parts of the domain name will be converted,
			 * i.e. it doesn't matter if you call it with a domain that's already in
			 * ASCII.
			 * @memberOf punycode
			 * @param {String} input The domain name or email address to convert, as a
			 * Unicode string.
			 * @returns {String} The Punycode representation of the given domain name or
			 * email address.
			 */
			function toASCII(input) {
				return mapDomain(input, function(string) {
					return regexNonASCII.test(string)
						? 'xn--' + encode(string)
						: string;
				});
			}
		
			/*--------------------------------------------------------------------------*/
		
			/** Define the public API */
			punycode = {
				/**
				 * A string representing the current Punycode.js version number.
				 * @memberOf punycode
				 * @type String
				 */
				'version': '1.3.2',
				/**
				 * An object of methods to convert from JavaScript's internal character
				 * representation (UCS-2) to Unicode code points, and back.
				 * @see <https://mathiasbynens.be/notes/javascript-encoding>
				 * @memberOf punycode
				 * @type Object
				 */
				'ucs2': {
					'decode': ucs2decode,
					'encode': ucs2encode
				},
				'decode': decode,
				'encode': encode,
				'toASCII': toASCII,
				'toUnicode': toUnicode
			};
		
			/** Expose `punycode` */
			// Some AMD build optimizers, like r.js, check for specific condition patterns
			// like the following:
			if (
				true
			) {
				!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
					return punycode;
				}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			} else if (freeExports && freeModule) {
				if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
					freeModule.exports = punycode;
				} else { // in Narwhal or RingoJS v0.7.0-
					for (key in punycode) {
						punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
					}
				}
			} else { // in Rhino or a web browser
				root.punycode = punycode;
			}
		
		}(this));
		
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module), (function() { return this; }())))
	
	/***/ }),
	/* 18 */
	/***/ (function(module, exports) {
	
		module.exports = function(module) {
			if(!module.webpackPolyfill) {
				module.deprecate = function() {};
				module.paths = [];
				// module.parent = undefined by default
				module.children = [];
				module.webpackPolyfill = 1;
			}
			return module;
		}
	
	
	/***/ }),
	/* 19 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		module.exports = {
		  isString: function(arg) {
		    return typeof(arg) === 'string';
		  },
		  isObject: function(arg) {
		    return typeof(arg) === 'object' && arg !== null;
		  },
		  isNull: function(arg) {
		    return arg === null;
		  },
		  isNullOrUndefined: function(arg) {
		    return arg == null;
		  }
		};
	
	
	/***/ }),
	/* 20 */
	/***/ (function(module, exports, __webpack_require__) {
	
		'use strict';
		
		exports.decode = exports.parse = __webpack_require__(21);
		exports.encode = exports.stringify = __webpack_require__(22);
	
	
	/***/ }),
	/* 21 */
	/***/ (function(module, exports) {
	
		// Copyright Joyent, Inc. and other Node contributors.
		//
		// Permission is hereby granted, free of charge, to any person obtaining a
		// copy of this software and associated documentation files (the
		// "Software"), to deal in the Software without restriction, including
		// without limitation the rights to use, copy, modify, merge, publish,
		// distribute, sublicense, and/or sell copies of the Software, and to permit
		// persons to whom the Software is furnished to do so, subject to the
		// following conditions:
		//
		// The above copyright notice and this permission notice shall be included
		// in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
		// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
		// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
		// USE OR OTHER DEALINGS IN THE SOFTWARE.
		
		'use strict';
		
		// If obj.hasOwnProperty has been overridden, then calling
		// obj.hasOwnProperty(prop) will break.
		// See: https://github.com/joyent/node/issues/1707
		function hasOwnProperty(obj, prop) {
		  return Object.prototype.hasOwnProperty.call(obj, prop);
		}
		
		module.exports = function(qs, sep, eq, options) {
		  sep = sep || '&';
		  eq = eq || '=';
		  var obj = {};
		
		  if (typeof qs !== 'string' || qs.length === 0) {
		    return obj;
		  }
		
		  var regexp = /\+/g;
		  qs = qs.split(sep);
		
		  var maxKeys = 1000;
		  if (options && typeof options.maxKeys === 'number') {
		    maxKeys = options.maxKeys;
		  }
		
		  var len = qs.length;
		  // maxKeys <= 0 means that we should not limit keys count
		  if (maxKeys > 0 && len > maxKeys) {
		    len = maxKeys;
		  }
		
		  for (var i = 0; i < len; ++i) {
		    var x = qs[i].replace(regexp, '%20'),
		        idx = x.indexOf(eq),
		        kstr, vstr, k, v;
		
		    if (idx >= 0) {
		      kstr = x.substr(0, idx);
		      vstr = x.substr(idx + 1);
		    } else {
		      kstr = x;
		      vstr = '';
		    }
		
		    k = decodeURIComponent(kstr);
		    v = decodeURIComponent(vstr);
		
		    if (!hasOwnProperty(obj, k)) {
		      obj[k] = v;
		    } else if (Array.isArray(obj[k])) {
		      obj[k].push(v);
		    } else {
		      obj[k] = [obj[k], v];
		    }
		  }
		
		  return obj;
		};
	
	
	/***/ }),
	/* 22 */
	/***/ (function(module, exports) {
	
		// Copyright Joyent, Inc. and other Node contributors.
		//
		// Permission is hereby granted, free of charge, to any person obtaining a
		// copy of this software and associated documentation files (the
		// "Software"), to deal in the Software without restriction, including
		// without limitation the rights to use, copy, modify, merge, publish,
		// distribute, sublicense, and/or sell copies of the Software, and to permit
		// persons to whom the Software is furnished to do so, subject to the
		// following conditions:
		//
		// The above copyright notice and this permission notice shall be included
		// in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
		// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
		// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
		// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
		// USE OR OTHER DEALINGS IN THE SOFTWARE.
		
		'use strict';
		
		var stringifyPrimitive = function(v) {
		  switch (typeof v) {
		    case 'string':
		      return v;
		
		    case 'boolean':
		      return v ? 'true' : 'false';
		
		    case 'number':
		      return isFinite(v) ? v : '';
		
		    default:
		      return '';
		  }
		};
		
		module.exports = function(obj, sep, eq, name) {
		  sep = sep || '&';
		  eq = eq || '=';
		  if (obj === null) {
		    obj = undefined;
		  }
		
		  if (typeof obj === 'object') {
		    return Object.keys(obj).map(function(k) {
		      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
		      if (Array.isArray(obj[k])) {
		        return obj[k].map(function(v) {
		          return ks + encodeURIComponent(stringifyPrimitive(v));
		        }).join(sep);
		      } else {
		        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
		      }
		    }).join(sep);
		
		  }
		
		  if (!name) return '';
		  return encodeURIComponent(stringifyPrimitive(name)) + eq +
		         encodeURIComponent(stringifyPrimitive(obj));
		};
	
	
	/***/ }),
	/* 23 */
	/***/ (function(module, exports) {
	
		module.exports = {
			"id": "http://json-schema.org/draft-04/schema#",
			"$schema": "http://json-schema.org/draft-04/schema#",
			"description": "Core schema meta-schema",
			"definitions": {
				"schemaArray": {
					"type": "array",
					"minItems": 1,
					"items": {
						"$ref": "#"
					}
				},
				"positiveInteger": {
					"type": "integer",
					"minimum": 0
				},
				"positiveIntegerDefault0": {
					"allOf": [
						{
							"$ref": "#/definitions/positiveInteger"
						},
						{
							"default": 0
						}
					]
				},
				"simpleTypes": {
					"enum": [
						"array",
						"boolean",
						"integer",
						"null",
						"number",
						"object",
						"string"
					]
				},
				"stringArray": {
					"type": "array",
					"items": {
						"type": "string"
					},
					"minItems": 1,
					"uniqueItems": true
				}
			},
			"type": "object",
			"properties": {
				"id": {
					"type": "string",
					"format": "uri"
				},
				"$schema": {
					"type": "string",
					"format": "uri"
				},
				"title": {
					"type": "string"
				},
				"description": {
					"type": "string"
				},
				"default": {},
				"multipleOf": {
					"type": "number",
					"minimum": 0,
					"exclusiveMinimum": true
				},
				"maximum": {
					"type": "number"
				},
				"exclusiveMaximum": {
					"type": "boolean",
					"default": false
				},
				"minimum": {
					"type": "number"
				},
				"exclusiveMinimum": {
					"type": "boolean",
					"default": false
				},
				"maxLength": {
					"$ref": "#/definitions/positiveInteger"
				},
				"minLength": {
					"$ref": "#/definitions/positiveIntegerDefault0"
				},
				"pattern": {
					"type": "string",
					"format": "regex"
				},
				"additionalItems": {
					"anyOf": [
						{
							"type": "boolean"
						},
						{
							"$ref": "#"
						}
					],
					"default": {}
				},
				"items": {
					"anyOf": [
						{
							"$ref": "#"
						},
						{
							"$ref": "#/definitions/schemaArray"
						}
					],
					"default": {}
				},
				"maxItems": {
					"$ref": "#/definitions/positiveInteger"
				},
				"minItems": {
					"$ref": "#/definitions/positiveIntegerDefault0"
				},
				"uniqueItems": {
					"type": "boolean",
					"default": false
				},
				"maxProperties": {
					"$ref": "#/definitions/positiveInteger"
				},
				"minProperties": {
					"$ref": "#/definitions/positiveIntegerDefault0"
				},
				"required": {
					"$ref": "#/definitions/stringArray"
				},
				"additionalProperties": {
					"anyOf": [
						{
							"type": "boolean"
						},
						{
							"$ref": "#"
						}
					],
					"default": {}
				},
				"definitions": {
					"type": "object",
					"additionalProperties": {
						"$ref": "#"
					},
					"default": {}
				},
				"properties": {
					"type": "object",
					"additionalProperties": {
						"$ref": "#"
					},
					"default": {}
				},
				"patternProperties": {
					"type": "object",
					"additionalProperties": {
						"$ref": "#"
					},
					"default": {}
				},
				"dependencies": {
					"type": "object",
					"additionalProperties": {
						"anyOf": [
							{
								"$ref": "#"
							},
							{
								"$ref": "#/definitions/stringArray"
							}
						]
					}
				},
				"enum": {
					"type": "array",
					"minItems": 1,
					"uniqueItems": true
				},
				"type": {
					"anyOf": [
						{
							"$ref": "#/definitions/simpleTypes"
						},
						{
							"type": "array",
							"items": {
								"$ref": "#/definitions/simpleTypes"
							},
							"minItems": 1,
							"uniqueItems": true
						}
					]
				},
				"allOf": {
					"$ref": "#/definitions/schemaArray"
				},
				"anyOf": {
					"$ref": "#/definitions/schemaArray"
				},
				"oneOf": {
					"$ref": "#/definitions/schemaArray"
				},
				"not": {
					"$ref": "#"
				}
			},
			"dependencies": {
				"exclusiveMaximum": [
					"maximum"
				],
				"exclusiveMinimum": [
					"minimum"
				]
			},
			"default": {}
		};
	
	/***/ }),
	/* 24 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		var formats = {};
		
		// reference: http://dansnetwork.com/javascript-iso8601rfc3339-date-parser/
		formats['date-time'] = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
		// reference: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js#L7
		formats.uri = /^([a-zA-Z][a-zA-Z0-9+-.]*:){0,1}\/\/[^\s]*$/;
		// reference: http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
		//            http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
		formats.email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		// reference: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
		formats.ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		// reference: http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
		formats.ipv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|[fF][eE]80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::([fF]{4}(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
		// reference: http://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address#answer-3824105
		formats.hostname = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$/;
		
		module.exports = formats;
	
	/***/ }),
	/* 25 */
	/***/ (function(module, exports) {
	
		'use strict';
		
		// Reference: https://github.com/bestiejs/punycode.js/blob/master/punycode.js#L101`
		// Info: https://mathiasbynens.be/notes/javascript-unicode
		function ucs2length(string) {
		    var ucs2len = 0,
		        counter = 0,
		        length = string.length,
		        value, extra;
		
		    while (counter < length) {
		        ucs2len++;
		        value = string.charCodeAt(counter++);
		
		        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
		            // It's a high surrogate, and there is a next character.
		            extra = string.charCodeAt(counter++);
		
		            if ((extra & 0xFC00) !== 0xDC00) { /* Low surrogate. */                 // jshint ignore: line
		                counter--;
		            }
		        }
		    }
		
		    return ucs2len;
		}
		
		module.exports = ucs2length;
	
	/***/ })
	/******/ ])
	});
	;
	//# sourceMappingURL=models.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * A Power BI report page
	 *
	 * @export
	 * @class Page
	 * @implements {IPageNode}
	 * @implements {IFilterable}
	 */
	var Page = (function () {
	    /**
	     * Creates an instance of a Power BI report page.
	     *
	     * @param {IReportNode} report
	     * @param {string} name
	     * @param {string} [displayName]
	     */
	    function Page(report, name, displayName) {
	        this.report = report;
	        this.name = name;
	        this.displayName = displayName;
	    }
	    /**
	     * Gets all page level filters within the report.
	     *
	     * ```javascript
	     * page.getFilters()
	     *  .then(pages => { ... });
	     * ```
	     *
	     * @returns {(Promise<models.IFilter[]>)}
	     */
	    Page.prototype.getFilters = function () {
	        return this.report.service.hpm.get("/report/pages/" + this.name + "/filters", { uid: this.report.config.uniqueId }, this.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Removes all filters from this page of the report.
	     *
	     * ```javascript
	     * page.removeFilters();
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    Page.prototype.removeFilters = function () {
	        return this.setFilters([]);
	    };
	    /**
	     * Makes the current page the active page of the report.
	     *
	     * ```javascripot
	     * page.setActive();
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    Page.prototype.setActive = function () {
	        var page = {
	            name: this.name,
	            displayName: null
	        };
	        return this.report.service.hpm.put('/report/pages/active', page, { uid: this.report.config.uniqueId }, this.report.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Sets all filters on the current page.
	     *
	     * ```javascript
	     * page.setFilters(filters);
	     *   .catch(errors => { ... });
	     * ```
	     *
	     * @param {(models.IFilter[])} filters
	     * @returns {Promise<void>}
	     */
	    Page.prototype.setFilters = function (filters) {
	        return this.report.service.hpm.put("/report/pages/" + this.name + "/filters", filters, { uid: this.report.config.uniqueId }, this.report.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    return Page;
	}());
	exports.Page = Page;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var models = __webpack_require__(5);
	var embed = __webpack_require__(2);
	var Create = (function (_super) {
	    __extends(Create, _super);
	    function Create(service, element, config) {
	        _super.call(this, service, element, config);
	    }
	    /**
	     * Gets the dataset ID from the first available location: createConfig or embed url.
	     *
	     * @returns {string}
	     */
	    Create.prototype.getId = function () {
	        var datasetId = (this.createConfig && this.createConfig.datasetId) ? this.createConfig.datasetId : Create.findIdFromEmbedUrl(this.config.embedUrl);
	        if (typeof datasetId !== 'string' || datasetId.length === 0) {
	            throw new Error('Dataset id is required, but it was not found. You must provide an id either as part of embed configuration.');
	        }
	        return datasetId;
	    };
	    /**
	     * Validate create report configuration.
	     */
	    Create.prototype.validate = function (config) {
	        return models.validateCreateReport(config);
	    };
	    /**
	     * Adds the ability to get datasetId from url.
	     * (e.g. http://embedded.powerbi.com/appTokenReportEmbed?datasetId=854846ed-2106-4dc2-bc58-eb77533bf2f1).
	     *
	     * By extracting the ID we can ensure that the ID is always explicitly provided as part of the create configuration.
	     *
	     * @static
	     * @param {string} url
	     * @returns {string}
	     */
	    Create.findIdFromEmbedUrl = function (url) {
	        var datasetIdRegEx = /datasetId="?([^&]+)"?/;
	        var datasetIdMatch = url.match(datasetIdRegEx);
	        var datasetId;
	        if (datasetIdMatch) {
	            datasetId = datasetIdMatch[1];
	        }
	        return datasetId;
	    };
	    return Create;
	}(embed.Embed));
	exports.Create = Create;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var embed = __webpack_require__(2);
	var models = __webpack_require__(5);
	/**
	 * A Power BI Dashboard embed component
	 *
	 * @export
	 * @class Dashboard
	 * @extends {embed.Embed}
	 * @implements {IDashboardNode}
	 * @implements {IFilterable}
	 */
	var Dashboard = (function (_super) {
	    __extends(Dashboard, _super);
	    /**
	     * Creates an instance of a Power BI Dashboard.
	     *
	     * @param {service.Service} service
	     * @param {HTMLElement} element
	     */
	    function Dashboard(service, element, config) {
	        _super.call(this, service, element, config);
	        this.loadPath = "/dashboard/load";
	        Array.prototype.push.apply(this.allowedEvents, Dashboard.allowedEvents);
	    }
	    /**
	     * This adds backwards compatibility for older config which used the dashboardId query param to specify dashboard id.
	     * E.g. https://powerbi-df.analysis-df.windows.net/dashboardEmbedHost?dashboardId=e9363c62-edb6-4eac-92d3-2199c5ca2a9e
	     *
	     * By extracting the id we can ensure id is always explicitly provided as part of the load configuration.
	     *
	     * @static
	     * @param {string} url
	     * @returns {string}
	     */
	    Dashboard.findIdFromEmbedUrl = function (url) {
	        var dashboardIdRegEx = /dashboardId="?([^&]+)"?/;
	        var dashboardIdMatch = url.match(dashboardIdRegEx);
	        var dashboardId;
	        if (dashboardIdMatch) {
	            dashboardId = dashboardIdMatch[1];
	        }
	        return dashboardId;
	    };
	    /**
	     * Get dashboard id from first available location: options, attribute, embed url.
	     *
	     * @returns {string}
	     */
	    Dashboard.prototype.getId = function () {
	        var dashboardId = this.config.id || this.element.getAttribute(Dashboard.dashboardIdAttribute) || Dashboard.findIdFromEmbedUrl(this.config.embedUrl);
	        if (typeof dashboardId !== 'string' || dashboardId.length === 0) {
	            throw new Error("Dashboard id is required, but it was not found. You must provide an id either as part of embed configuration or as attribute '" + Dashboard.dashboardIdAttribute + "'.");
	        }
	        return dashboardId;
	    };
	    /**
	     * Validate load configuration.
	     */
	    Dashboard.prototype.validate = function (config) {
	        var error = models.validateDashboardLoad(config);
	        return error ? error : this.ValidatePageView(config.pageView);
	    };
	    /**
	     * Validate that pageView has a legal value: if page view is defined it must have one of the values defined in models.PageView
	     */
	    Dashboard.prototype.ValidatePageView = function (pageView) {
	        if (pageView && pageView !== "fitToWidth" && pageView !== "oneColumn" && pageView !== "actualSize") {
	            return [{ message: "pageView must be one of the followings: fitToWidth, oneColumn, actualSize" }];
	        }
	    };
	    Dashboard.allowedEvents = ["tileClicked", "error"];
	    Dashboard.dashboardIdAttribute = 'powerbi-dashboard-id';
	    Dashboard.typeAttribute = 'powerbi-type';
	    Dashboard.type = "Dashboard";
	    return Dashboard;
	}(embed.Embed));
	exports.Dashboard = Dashboard;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var embed_1 = __webpack_require__(2);
	/**
	 * The Power BI tile embed component
	 *
	 * @export
	 * @class Tile
	 * @extends {Embed}
	 */
	var Tile = (function (_super) {
	    __extends(Tile, _super);
	    function Tile() {
	        _super.apply(this, arguments);
	    }
	    /**
	     * The ID of the tile
	     *
	     * @returns {string}
	     */
	    Tile.prototype.getId = function () {
	        throw new Error('Not implemented. Embedding tiles is not supported yet.');
	    };
	    /**
	     * Validate load configuration.
	     */
	    Tile.prototype.validate = function (config) {
	        throw new Error('Not implemented. Embedding tiles is not supported yet.');
	    };
	    Tile.type = "Tile";
	    return Tile;
	}(embed_1.Embed));
	exports.Tile = Tile;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var config_1 = __webpack_require__(11);
	var wpmp = __webpack_require__(12);
	var hpm = __webpack_require__(13);
	var router = __webpack_require__(14);
	exports.hpmFactory = function (wpmp, defaultTargetWindow, sdkVersion, sdkType) {
	    if (sdkVersion === void 0) { sdkVersion = config_1.default.version; }
	    if (sdkType === void 0) { sdkType = config_1.default.type; }
	    return new hpm.HttpPostMessage(wpmp, {
	        'x-sdk-type': sdkType,
	        'x-sdk-version': sdkVersion
	    }, defaultTargetWindow);
	};
	exports.wpmpFactory = function (name, logMessages, eventSourceOverrideWindow) {
	    return new wpmp.WindowPostMessageProxy({
	        processTrackingProperties: {
	            addTrackingProperties: hpm.HttpPostMessage.addTrackingProperties,
	            getTrackingProperties: hpm.HttpPostMessage.getTrackingProperties,
	        },
	        isErrorMessage: hpm.HttpPostMessage.isErrorMessage,
	        name: name,
	        logMessages: logMessages,
	        eventSourceOverrideWindow: eventSourceOverrideWindow
	    });
	};
	exports.routerFactory = function (wpmp) {
	    return new router.Router(wpmp);
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var config = {
	    version: '2.3.1-master.17142.1',
	    type: 'js'
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = config;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/*! window-post-message-proxy v0.2.4 | (c) 2016 Microsoft Corporation MIT */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["window-post-message-proxy"] = factory();
		else
			root["window-post-message-proxy"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		"use strict";
		var WindowPostMessageProxy = (function () {
		    function WindowPostMessageProxy(options) {
		        var _this = this;
		        if (options === void 0) { options = {
		            processTrackingProperties: {
		                addTrackingProperties: WindowPostMessageProxy.defaultAddTrackingProperties,
		                getTrackingProperties: WindowPostMessageProxy.defaultGetTrackingProperties
		            },
		            isErrorMessage: WindowPostMessageProxy.defaultIsErrorMessage,
		            receiveWindow: window,
		            name: WindowPostMessageProxy.createRandomString()
		        }; }
		        this.pendingRequestPromises = {};
		        // save options with defaults
		        this.addTrackingProperties = (options.processTrackingProperties && options.processTrackingProperties.addTrackingProperties) || WindowPostMessageProxy.defaultAddTrackingProperties;
		        this.getTrackingProperties = (options.processTrackingProperties && options.processTrackingProperties.getTrackingProperties) || WindowPostMessageProxy.defaultGetTrackingProperties;
		        this.isErrorMessage = options.isErrorMessage || WindowPostMessageProxy.defaultIsErrorMessage;
		        this.receiveWindow = options.receiveWindow || window;
		        this.name = options.name || WindowPostMessageProxy.createRandomString();
		        this.logMessages = options.logMessages || false;
		        this.eventSourceOverrideWindow = options.eventSourceOverrideWindow;
		        this.suppressWarnings = options.suppressWarnings || false;
		        if (this.logMessages) {
		            console.log("new WindowPostMessageProxy created with name: " + this.name + " receiving on window: " + this.receiveWindow.document.title);
		        }
		        // Initialize
		        this.handlers = [];
		        this.windowMessageHandler = function (event) { return _this.onMessageReceived(event); };
		        this.start();
		    }
		    // Static
		    WindowPostMessageProxy.defaultAddTrackingProperties = function (message, trackingProperties) {
		        message[WindowPostMessageProxy.messagePropertyName] = trackingProperties;
		        return message;
		    };
		    WindowPostMessageProxy.defaultGetTrackingProperties = function (message) {
		        return message[WindowPostMessageProxy.messagePropertyName];
		    };
		    WindowPostMessageProxy.defaultIsErrorMessage = function (message) {
		        return !!message.error;
		    };
		    /**
		     * Utility to create a deferred object.
		     */
		    // TODO: Look to use RSVP library instead of doing this manually.
		    // From what I searched RSVP would work better because it has .finally and .deferred; however, it doesn't have Typings information. 
		    WindowPostMessageProxy.createDeferred = function () {
		        var deferred = {
		            resolve: null,
		            reject: null,
		            promise: null
		        };
		        var promise = new Promise(function (resolve, reject) {
		            deferred.resolve = resolve;
		            deferred.reject = reject;
		        });
		        deferred.promise = promise;
		        return deferred;
		    };
		    /**
		     * Utility to generate random sequence of characters used as tracking id for promises.
		     */
		    WindowPostMessageProxy.createRandomString = function () {
		        return (Math.random() + 1).toString(36).substring(7);
		    };
		    /**
		     * Adds handler.
		     * If the first handler whose test method returns true will handle the message and provide a response.
		     */
		    WindowPostMessageProxy.prototype.addHandler = function (handler) {
		        this.handlers.push(handler);
		    };
		    /**
		     * Removes handler.
		     * The reference must match the original object that was provided when adding the handler.
		     */
		    WindowPostMessageProxy.prototype.removeHandler = function (handler) {
		        var handlerIndex = this.handlers.indexOf(handler);
		        if (handlerIndex === -1) {
		            throw new Error("You attempted to remove a handler but no matching handler was found.");
		        }
		        this.handlers.splice(handlerIndex, 1);
		    };
		    /**
		     * Start listening to message events.
		     */
		    WindowPostMessageProxy.prototype.start = function () {
		        this.receiveWindow.addEventListener('message', this.windowMessageHandler);
		    };
		    /**
		     * Stops listening to message events.
		     */
		    WindowPostMessageProxy.prototype.stop = function () {
		        this.receiveWindow.removeEventListener('message', this.windowMessageHandler);
		    };
		    /**
		     * Post message to target window with tracking properties added and save deferred object referenced by tracking id.
		     */
		    WindowPostMessageProxy.prototype.postMessage = function (targetWindow, message) {
		        // Add tracking properties to indicate message came from this proxy
		        var trackingProperties = { id: WindowPostMessageProxy.createRandomString() };
		        this.addTrackingProperties(message, trackingProperties);
		        if (this.logMessages) {
		            console.log(this.name + " Posting message:");
		            console.log(JSON.stringify(message, null, '  '));
		        }
		        targetWindow.postMessage(message, "*");
		        var deferred = WindowPostMessageProxy.createDeferred();
		        this.pendingRequestPromises[trackingProperties.id] = deferred;
		        return deferred.promise;
		    };
		    /**
		     * Send response message to target window.
		     * Response messages re-use tracking properties from a previous request message.
		     */
		    WindowPostMessageProxy.prototype.sendResponse = function (targetWindow, message, trackingProperties) {
		        this.addTrackingProperties(message, trackingProperties);
		        if (this.logMessages) {
		            console.log(this.name + " Sending response:");
		            console.log(JSON.stringify(message, null, '  '));
		        }
		        targetWindow.postMessage(message, "*");
		    };
		    /**
		     * Message handler.
		     */
		    WindowPostMessageProxy.prototype.onMessageReceived = function (event) {
		        var _this = this;
		        if (this.logMessages) {
		            console.log(this.name + " Received message:");
		            console.log("type: " + event.type);
		            console.log(JSON.stringify(event.data, null, '  '));
		        }
		        var sendingWindow = this.eventSourceOverrideWindow || event.source;
		        var message = event.data;
		        if (typeof message !== "object") {
		            if (!this.suppressWarnings) {
		                console.warn("Proxy(" + this.name + "): Received message that was not an object. Discarding message");
		            }
		            return;
		        }
		        var trackingProperties;
		        try {
		            trackingProperties = this.getTrackingProperties(message);
		        }
		        catch (e) {
		            if (!this.suppressWarnings) {
		                console.warn("Proxy(" + this.name + "): Error occurred when attempting to get tracking properties from incoming message:", JSON.stringify(message, null, '  '), "Error: ", e);
		            }
		        }
		        var deferred;
		        if (trackingProperties) {
		            deferred = this.pendingRequestPromises[trackingProperties.id];
		        }
		        // If message does not have a known ID, treat it as a request
		        // Otherwise, treat message as response
		        if (!deferred) {
		            var handled = this.handlers.some(function (handler) {
		                var canMessageBeHandled = false;
		                try {
		                    canMessageBeHandled = handler.test(message);
		                }
		                catch (e) {
		                    if (!_this.suppressWarnings) {
		                        console.warn("Proxy(" + _this.name + "): Error occurred when handler was testing incoming message:", JSON.stringify(message, null, '  '), "Error: ", e);
		                    }
		                }
		                if (canMessageBeHandled) {
		                    var responseMessagePromise = void 0;
		                    try {
		                        responseMessagePromise = Promise.resolve(handler.handle(message));
		                    }
		                    catch (e) {
		                        if (!_this.suppressWarnings) {
		                            console.warn("Proxy(" + _this.name + "): Error occurred when handler was processing incoming message:", JSON.stringify(message, null, '  '), "Error: ", e);
		                        }
		                        responseMessagePromise = Promise.resolve();
		                    }
		                    responseMessagePromise
		                        .then(function (responseMessage) {
		                        if (!responseMessage) {
		                            var warningMessage = "Handler for message: " + JSON.stringify(message, null, '  ') + " did not return a response message. The default response message will be returned instead.";
		                            if (!_this.suppressWarnings) {
		                                console.warn("Proxy(" + _this.name + "): " + warningMessage);
		                            }
		                            responseMessage = {
		                                warning: warningMessage
		                            };
		                        }
		                        _this.sendResponse(sendingWindow, responseMessage, trackingProperties);
		                    });
		                    return true;
		                }
		            });
		            /**
		             * TODO: Consider returning an error message if nothing handled the message.
		             * In the case of the Report receiving messages all of them should be handled,
		             * however, in the case of the SDK receiving messages it's likely it won't register handlers
		             * for all events. Perhaps make this an option at construction time.
		             */
		            if (!handled && !this.suppressWarnings) {
		                console.warn("Proxy(" + this.name + ") did not handle message. Handlers: " + this.handlers.length + "  Message: " + JSON.stringify(message, null, '') + ".");
		            }
		        }
		        else {
		            /**
		             * If error message reject promise,
		             * Otherwise, resolve promise
		             */
		            var isErrorMessage = true;
		            try {
		                isErrorMessage = this.isErrorMessage(message);
		            }
		            catch (e) {
		                console.warn("Proxy(" + this.name + ") Error occurred when trying to determine if message is consider an error response. Message: ", JSON.stringify(message, null, ''), 'Error: ', e);
		            }
		            if (isErrorMessage) {
		                deferred.reject(message);
		            }
		            else {
		                deferred.resolve(message);
		            }
		            // TODO: Move to .finally clause up where promise is created for better maitenance like original proxy code.
		            delete this.pendingRequestPromises[trackingProperties.id];
		        }
		    };
		    WindowPostMessageProxy.messagePropertyName = "windowPostMessageProxy";
		    return WindowPostMessageProxy;
		}());
		exports.WindowPostMessageProxy = WindowPostMessageProxy;
	
	
	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=windowPostMessageProxy.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/*! http-post-message v0.2.3 | (c) 2016 Microsoft Corporation MIT */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["http-post-message"] = factory();
		else
			root["http-post-message"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {
	
		"use strict";
		var HttpPostMessage = (function () {
		    function HttpPostMessage(windowPostMessageProxy, defaultHeaders, defaultTargetWindow) {
		        if (defaultHeaders === void 0) { defaultHeaders = {}; }
		        this.defaultHeaders = defaultHeaders;
		        this.defaultTargetWindow = defaultTargetWindow;
		        this.windowPostMessageProxy = windowPostMessageProxy;
		    }
		    // TODO: See if it's possible to share tracking properties interface?
		    // The responsibility of knowing how to configure windowPostMessageProxy for http should
		    // live in this http class, but the configuration would need ITrackingProperties
		    // interface which lives in WindowPostMessageProxy. Use <any> type as workaround
		    HttpPostMessage.addTrackingProperties = function (message, trackingProperties) {
		        message.headers = message.headers || {};
		        if (trackingProperties && trackingProperties.id) {
		            message.headers.id = trackingProperties.id;
		        }
		        return message;
		    };
		    HttpPostMessage.getTrackingProperties = function (message) {
		        return {
		            id: message.headers && message.headers.id
		        };
		    };
		    HttpPostMessage.isErrorMessage = function (message) {
		        if (typeof (message && message.statusCode) !== 'number') {
		            return false;
		        }
		        return !(200 <= message.statusCode && message.statusCode < 300);
		    };
		    HttpPostMessage.prototype.get = function (url, headers, targetWindow) {
		        if (headers === void 0) { headers = {}; }
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        return this.send({
		            method: "GET",
		            url: url,
		            headers: headers
		        }, targetWindow);
		    };
		    HttpPostMessage.prototype.post = function (url, body, headers, targetWindow) {
		        if (headers === void 0) { headers = {}; }
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        return this.send({
		            method: "POST",
		            url: url,
		            headers: headers,
		            body: body
		        }, targetWindow);
		    };
		    HttpPostMessage.prototype.put = function (url, body, headers, targetWindow) {
		        if (headers === void 0) { headers = {}; }
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        return this.send({
		            method: "PUT",
		            url: url,
		            headers: headers,
		            body: body
		        }, targetWindow);
		    };
		    HttpPostMessage.prototype.patch = function (url, body, headers, targetWindow) {
		        if (headers === void 0) { headers = {}; }
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        return this.send({
		            method: "PATCH",
		            url: url,
		            headers: headers,
		            body: body
		        }, targetWindow);
		    };
		    HttpPostMessage.prototype.delete = function (url, body, headers, targetWindow) {
		        if (body === void 0) { body = null; }
		        if (headers === void 0) { headers = {}; }
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        return this.send({
		            method: "DELETE",
		            url: url,
		            headers: headers,
		            body: body
		        }, targetWindow);
		    };
		    HttpPostMessage.prototype.send = function (request, targetWindow) {
		        if (targetWindow === void 0) { targetWindow = this.defaultTargetWindow; }
		        request.headers = this.assign({}, this.defaultHeaders, request.headers);
		        if (!targetWindow) {
		            throw new Error("target window is not provided.  You must either provide the target window explicitly as argument to request, or specify default target window when constructing instance of this class.");
		        }
		        return this.windowPostMessageProxy.postMessage(targetWindow, request);
		    };
		    /**
		     * Object.assign() polyfill
		     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
		     */
		    HttpPostMessage.prototype.assign = function (target) {
		        var sources = [];
		        for (var _i = 1; _i < arguments.length; _i++) {
		            sources[_i - 1] = arguments[_i];
		        }
		        if (target === undefined || target === null) {
		            throw new TypeError('Cannot convert undefined or null to object');
		        }
		        var output = Object(target);
		        sources.forEach(function (source) {
		            if (source !== undefined && source !== null) {
		                for (var nextKey in source) {
		                    if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
		                        output[nextKey] = source[nextKey];
		                    }
		                }
		            }
		        });
		        return output;
		    };
		    return HttpPostMessage;
		}());
		exports.HttpPostMessage = HttpPostMessage;
	
	
	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=httpPostMessage.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/*! powerbi-router v0.1.5 | (c) 2016 Microsoft Corporation MIT */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["powerbi-router"] = factory();
		else
			root["powerbi-router"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		"use strict";
		var RouteRecognizer = __webpack_require__(1);
		var Router = (function () {
		    function Router(handlers) {
		        this.handlers = handlers;
		        /**
		         * TODO: look at generating the router dynamically based on list of supported http methods
		         * instead of hardcoding the creation of these and the methods.
		         */
		        this.getRouteRecognizer = new RouteRecognizer();
		        this.patchRouteRecognizer = new RouteRecognizer();
		        this.postRouteRecognizer = new RouteRecognizer();
		        this.putRouteRecognizer = new RouteRecognizer();
		        this.deleteRouteRecognizer = new RouteRecognizer();
		    }
		    Router.prototype.get = function (url, handler) {
		        this.registerHandler(this.getRouteRecognizer, "GET", url, handler);
		        return this;
		    };
		    Router.prototype.patch = function (url, handler) {
		        this.registerHandler(this.patchRouteRecognizer, "PATCH", url, handler);
		        return this;
		    };
		    Router.prototype.post = function (url, handler) {
		        this.registerHandler(this.postRouteRecognizer, "POST", url, handler);
		        return this;
		    };
		    Router.prototype.put = function (url, handler) {
		        this.registerHandler(this.putRouteRecognizer, "PUT", url, handler);
		        return this;
		    };
		    Router.prototype.delete = function (url, handler) {
		        this.registerHandler(this.deleteRouteRecognizer, "DELETE", url, handler);
		        return this;
		    };
		    /**
		     * TODO: This method could use some refactoring.  There is conflict of interest between keeping clean separation of test and handle method
		     * Test method only returns boolean indicating if request can be handled, and handle method has opportunity to modify response and return promise of it.
		     * In the case of the router with route-recognizer where handlers are associated with routes, this already guarantees that only one handler is selected and makes the test method feel complicated
		     * Will leave as is an investigate cleaner ways at later time.
		     */
		    Router.prototype.registerHandler = function (routeRecognizer, method, url, handler) {
		        var routeRecognizerHandler = function (request) {
		            var response = new Response();
		            return Promise.resolve(handler(request, response))
		                .then(function (x) { return response; });
		        };
		        routeRecognizer.add([
		            { path: url, handler: routeRecognizerHandler }
		        ]);
		        var internalHandler = {
		            test: function (request) {
		                if (request.method !== method) {
		                    return false;
		                }
		                var matchingRoutes = routeRecognizer.recognize(request.url);
		                if (matchingRoutes === undefined) {
		                    return false;
		                }
		                /**
		                 * Copy parameters from recognized route to the request so they can be used within the handler function
		                 * This isn't ideal because it is side affect which modifies the request instead of strictly testing for true or false
		                 * but I don't see a better place to put this.  If we move it between the call to test and the handle it becomes part of the window post message proxy
		                 * even though it's responsibility is related to routing.
		                 */
		                var route = matchingRoutes[0];
		                request.params = route.params;
		                request.queryParams = matchingRoutes.queryParams;
		                request.handler = route.handler;
		                return true;
		            },
		            handle: function (request) {
		                return request.handler(request);
		            }
		        };
		        this.handlers.addHandler(internalHandler);
		    };
		    return Router;
		}());
		exports.Router = Router;
		var Response = (function () {
		    function Response() {
		        this.statusCode = 200;
		        this.headers = {};
		        this.body = null;
		    }
		    Response.prototype.send = function (statusCode, body) {
		        this.statusCode = statusCode;
		        this.body = body;
		    };
		    return Response;
		}());
		exports.Response = Response;
	
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {(function() {
		    "use strict";
		    function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
		      this.path = path;
		      this.matcher = matcher;
		      this.delegate = delegate;
		    }
		
		    $$route$recognizer$dsl$$Target.prototype = {
		      to: function(target, callback) {
		        var delegate = this.delegate;
		
		        if (delegate && delegate.willAddRoute) {
		          target = delegate.willAddRoute(this.matcher.target, target);
		        }
		
		        this.matcher.add(this.path, target);
		
		        if (callback) {
		          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
		          this.matcher.addChild(this.path, target, callback, this.delegate);
		        }
		        return this;
		      }
		    };
		
		    function $$route$recognizer$dsl$$Matcher(target) {
		      this.routes = {};
		      this.children = {};
		      this.target = target;
		    }
		
		    $$route$recognizer$dsl$$Matcher.prototype = {
		      add: function(path, handler) {
		        this.routes[path] = handler;
		      },
		
		      addChild: function(path, target, callback, delegate) {
		        var matcher = new $$route$recognizer$dsl$$Matcher(target);
		        this.children[path] = matcher;
		
		        var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);
		
		        if (delegate && delegate.contextEntered) {
		          delegate.contextEntered(target, match);
		        }
		
		        callback(match);
		      }
		    };
		
		    function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
		      return function(path, nestedCallback) {
		        var fullPath = startingPath + path;
		
		        if (nestedCallback) {
		          nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
		        } else {
		          return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
		        }
		      };
		    }
		
		    function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
		      var len = 0;
		      for (var i=0; i<routeArray.length; i++) {
		        len += routeArray[i].path.length;
		      }
		
		      path = path.substr(len);
		      var route = { path: path, handler: handler };
		      routeArray.push(route);
		    }
		
		    function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
		      var routes = matcher.routes;
		
		      for (var path in routes) {
		        if (routes.hasOwnProperty(path)) {
		          var routeArray = baseRoute.slice();
		          $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);
		
		          if (matcher.children[path]) {
		            $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
		          } else {
		            callback.call(binding, routeArray);
		          }
		        }
		      }
		    }
		
		    var $$route$recognizer$dsl$$default = function(callback, addRouteCallback) {
		      var matcher = new $$route$recognizer$dsl$$Matcher();
		
		      callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));
		
		      $$route$recognizer$dsl$$eachRoute([], matcher, function(route) {
		        if (addRouteCallback) { addRouteCallback(this, route); }
		        else { this.add(route); }
		      }, this);
		    };
		
		    var $$route$recognizer$$specials = [
		      '/', '.', '*', '+', '?', '|',
		      '(', ')', '[', ']', '{', '}', '\\'
		    ];
		
		    var $$route$recognizer$$escapeRegex = new RegExp('(\\' + $$route$recognizer$$specials.join('|\\') + ')', 'g');
		
		    function $$route$recognizer$$isArray(test) {
		      return Object.prototype.toString.call(test) === "[object Array]";
		    }
		
		    // A Segment represents a segment in the original route description.
		    // Each Segment type provides an `eachChar` and `regex` method.
		    //
		    // The `eachChar` method invokes the callback with one or more character
		    // specifications. A character specification consumes one or more input
		    // characters.
		    //
		    // The `regex` method returns a regex fragment for the segment. If the
		    // segment is a dynamic of star segment, the regex fragment also includes
		    // a capture.
		    //
		    // A character specification contains:
		    //
		    // * `validChars`: a String with a list of all valid characters, or
		    // * `invalidChars`: a String with a list of all invalid characters
		    // * `repeat`: true if the character specification can repeat
		
		    function $$route$recognizer$$StaticSegment(string) { this.string = string; }
		    $$route$recognizer$$StaticSegment.prototype = {
		      eachChar: function(currentState) {
		        var string = this.string, ch;
		
		        for (var i=0; i<string.length; i++) {
		          ch = string.charAt(i);
		          currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: ch });
		        }
		
		        return currentState;
		      },
		
		      regex: function() {
		        return this.string.replace($$route$recognizer$$escapeRegex, '\\$1');
		      },
		
		      generate: function() {
		        return this.string;
		      }
		    };
		
		    function $$route$recognizer$$DynamicSegment(name) { this.name = name; }
		    $$route$recognizer$$DynamicSegment.prototype = {
		      eachChar: function(currentState) {
		        return currentState.put({ invalidChars: "/", repeat: true, validChars: undefined });
		      },
		
		      regex: function() {
		        return "([^/]+)";
		      },
		
		      generate: function(params) {
		        return params[this.name];
		      }
		    };
		
		    function $$route$recognizer$$StarSegment(name) { this.name = name; }
		    $$route$recognizer$$StarSegment.prototype = {
		      eachChar: function(currentState) {
		        return currentState.put({ invalidChars: "", repeat: true, validChars: undefined });
		      },
		
		      regex: function() {
		        return "(.+)";
		      },
		
		      generate: function(params) {
		        return params[this.name];
		      }
		    };
		
		    function $$route$recognizer$$EpsilonSegment() {}
		    $$route$recognizer$$EpsilonSegment.prototype = {
		      eachChar: function(currentState) {
		        return currentState;
		      },
		      regex: function() { return ""; },
		      generate: function() { return ""; }
		    };
		
		    function $$route$recognizer$$parse(route, names, specificity) {
		      // normalize route as not starting with a "/". Recognition will
		      // also normalize.
		      if (route.charAt(0) === "/") { route = route.substr(1); }
		
		      var segments = route.split("/");
		      var results = new Array(segments.length);
		
		      // A routes has specificity determined by the order that its different segments
		      // appear in. This system mirrors how the magnitude of numbers written as strings
		      // works.
		      // Consider a number written as: "abc". An example would be "200". Any other number written
		      // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
		      // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
		      // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
		      // leading symbol, "1".
		      // The rule is that symbols to the left carry more weight than symbols to the right
		      // when a number is written out as a string. In the above strings, the leading digit
		      // represents how many 100's are in the number, and it carries more weight than the middle
		      // number which represents how many 10's are in the number.
		      // This system of number magnitude works well for route specificity, too. A route written as
		      // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
		      // `x`, irrespective of the other parts.
		      // Because of this similarity, we assign each type of segment a number value written as a
		      // string. We can find the specificity of compound routes by concatenating these strings
		      // together, from left to right. After we have looped through all of the segments,
		      // we convert the string to a number.
		      specificity.val = '';
		
		      for (var i=0; i<segments.length; i++) {
		        var segment = segments[i], match;
		
		        if (match = segment.match(/^:([^\/]+)$/)) {
		          results[i] = new $$route$recognizer$$DynamicSegment(match[1]);
		          names.push(match[1]);
		          specificity.val += '3';
		        } else if (match = segment.match(/^\*([^\/]+)$/)) {
		          results[i] = new $$route$recognizer$$StarSegment(match[1]);
		          specificity.val += '1';
		          names.push(match[1]);
		        } else if(segment === "") {
		          results[i] = new $$route$recognizer$$EpsilonSegment();
		          specificity.val += '2';
		        } else {
		          results[i] = new $$route$recognizer$$StaticSegment(segment);
		          specificity.val += '4';
		        }
		      }
		
		      specificity.val = +specificity.val;
		
		      return results;
		    }
		
		    // A State has a character specification and (`charSpec`) and a list of possible
		    // subsequent states (`nextStates`).
		    //
		    // If a State is an accepting state, it will also have several additional
		    // properties:
		    //
		    // * `regex`: A regular expression that is used to extract parameters from paths
		    //   that reached this accepting state.
		    // * `handlers`: Information on how to convert the list of captures into calls
		    //   to registered handlers with the specified parameters
		    // * `types`: How many static, dynamic or star segments in this route. Used to
		    //   decide which route to use if multiple registered routes match a path.
		    //
		    // Currently, State is implemented naively by looping over `nextStates` and
		    // comparing a character specification against a character. A more efficient
		    // implementation would use a hash of keys pointing at one or more next states.
		
		    function $$route$recognizer$$State(charSpec) {
		      this.charSpec = charSpec;
		      this.nextStates = [];
		      this.charSpecs = {};
		      this.regex = undefined;
		      this.handlers = undefined;
		      this.specificity = undefined;
		    }
		
		    $$route$recognizer$$State.prototype = {
		      get: function(charSpec) {
		        if (this.charSpecs[charSpec.validChars]) {
		          return this.charSpecs[charSpec.validChars];
		        }
		
		        var nextStates = this.nextStates;
		
		        for (var i=0; i<nextStates.length; i++) {
		          var child = nextStates[i];
		
		          var isEqual = child.charSpec.validChars === charSpec.validChars;
		          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;
		
		          if (isEqual) {
		            this.charSpecs[charSpec.validChars] = child;
		            return child;
		          }
		        }
		      },
		
		      put: function(charSpec) {
		        var state;
		
		        // If the character specification already exists in a child of the current
		        // state, just return that state.
		        if (state = this.get(charSpec)) { return state; }
		
		        // Make a new state for the character spec
		        state = new $$route$recognizer$$State(charSpec);
		
		        // Insert the new state as a child of the current state
		        this.nextStates.push(state);
		
		        // If this character specification repeats, insert the new state as a child
		        // of itself. Note that this will not trigger an infinite loop because each
		        // transition during recognition consumes a character.
		        if (charSpec.repeat) {
		          state.nextStates.push(state);
		        }
		
		        // Return the new state
		        return state;
		      },
		
		      // Find a list of child states matching the next character
		      match: function(ch) {
		        var nextStates = this.nextStates,
		            child, charSpec, chars;
		
		        var returned = [];
		
		        for (var i=0; i<nextStates.length; i++) {
		          child = nextStates[i];
		
		          charSpec = child.charSpec;
		
		          if (typeof (chars = charSpec.validChars) !== 'undefined') {
		            if (chars.indexOf(ch) !== -1) { returned.push(child); }
		          } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
		            if (chars.indexOf(ch) === -1) { returned.push(child); }
		          }
		        }
		
		        return returned;
		      }
		    };
		
		    // Sort the routes by specificity
		    function $$route$recognizer$$sortSolutions(states) {
		      return states.sort(function(a, b) {
		        return b.specificity.val - a.specificity.val;
		      });
		    }
		
		    function $$route$recognizer$$recognizeChar(states, ch) {
		      var nextStates = [];
		
		      for (var i=0, l=states.length; i<l; i++) {
		        var state = states[i];
		
		        nextStates = nextStates.concat(state.match(ch));
		      }
		
		      return nextStates;
		    }
		
		    var $$route$recognizer$$oCreate = Object.create || function(proto) {
		      function F() {}
		      F.prototype = proto;
		      return new F();
		    };
		
		    function $$route$recognizer$$RecognizeResults(queryParams) {
		      this.queryParams = queryParams || {};
		    }
		    $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
		      splice: Array.prototype.splice,
		      slice:  Array.prototype.slice,
		      push:   Array.prototype.push,
		      length: 0,
		      queryParams: null
		    });
		
		    function $$route$recognizer$$findHandler(state, path, queryParams) {
		      var handlers = state.handlers, regex = state.regex;
		      var captures = path.match(regex), currentCapture = 1;
		      var result = new $$route$recognizer$$RecognizeResults(queryParams);
		
		      result.length = handlers.length;
		
		      for (var i=0; i<handlers.length; i++) {
		        var handler = handlers[i], names = handler.names, params = {};
		
		        for (var j=0; j<names.length; j++) {
		          params[names[j]] = captures[currentCapture++];
		        }
		
		        result[i] = { handler: handler.handler, params: params, isDynamic: !!names.length };
		      }
		
		      return result;
		    }
		
		    function $$route$recognizer$$decodeQueryParamPart(part) {
		      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
		      part = part.replace(/\+/gm, '%20');
		      var result;
		      try {
		        result = decodeURIComponent(part);
		      } catch(error) {result = '';}
		      return result;
		    }
		
		    // The main interface
		
		    var $$route$recognizer$$RouteRecognizer = function() {
		      this.rootState = new $$route$recognizer$$State();
		      this.names = {};
		    };
		
		
		    $$route$recognizer$$RouteRecognizer.prototype = {
		      add: function(routes, options) {
		        var currentState = this.rootState, regex = "^",
		            specificity = {},
		            handlers = new Array(routes.length), allSegments = [], name;
		
		        var isEmpty = true;
		
		        for (var i=0; i<routes.length; i++) {
		          var route = routes[i], names = [];
		
		          var segments = $$route$recognizer$$parse(route.path, names, specificity);
		
		          allSegments = allSegments.concat(segments);
		
		          for (var j=0; j<segments.length; j++) {
		            var segment = segments[j];
		
		            if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }
		
		            isEmpty = false;
		
		            // Add a "/" for the new segment
		            currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
		            regex += "/";
		
		            // Add a representation of the segment to the NFA and regex
		            currentState = segment.eachChar(currentState);
		            regex += segment.regex();
		          }
		          var handler = { handler: route.handler, names: names };
		          handlers[i] = handler;
		        }
		
		        if (isEmpty) {
		          currentState = currentState.put({ invalidChars: undefined, repeat: false, validChars: "/" });
		          regex += "/";
		        }
		
		        currentState.handlers = handlers;
		        currentState.regex = new RegExp(regex + "$");
		        currentState.specificity = specificity;
		
		        if (name = options && options.as) {
		          this.names[name] = {
		            segments: allSegments,
		            handlers: handlers
		          };
		        }
		      },
		
		      handlersFor: function(name) {
		        var route = this.names[name];
		
		        if (!route) { throw new Error("There is no route named " + name); }
		
		        var result = new Array(route.handlers.length);
		
		        for (var i=0; i<route.handlers.length; i++) {
		          result[i] = route.handlers[i];
		        }
		
		        return result;
		      },
		
		      hasRoute: function(name) {
		        return !!this.names[name];
		      },
		
		      generate: function(name, params) {
		        var route = this.names[name], output = "";
		        if (!route) { throw new Error("There is no route named " + name); }
		
		        var segments = route.segments;
		
		        for (var i=0; i<segments.length; i++) {
		          var segment = segments[i];
		
		          if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }
		
		          output += "/";
		          output += segment.generate(params);
		        }
		
		        if (output.charAt(0) !== '/') { output = '/' + output; }
		
		        if (params && params.queryParams) {
		          output += this.generateQueryString(params.queryParams, route.handlers);
		        }
		
		        return output;
		      },
		
		      generateQueryString: function(params, handlers) {
		        var pairs = [];
		        var keys = [];
		        for(var key in params) {
		          if (params.hasOwnProperty(key)) {
		            keys.push(key);
		          }
		        }
		        keys.sort();
		        for (var i = 0; i < keys.length; i++) {
		          key = keys[i];
		          var value = params[key];
		          if (value == null) {
		            continue;
		          }
		          var pair = encodeURIComponent(key);
		          if ($$route$recognizer$$isArray(value)) {
		            for (var j = 0; j < value.length; j++) {
		              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
		              pairs.push(arrayPair);
		            }
		          } else {
		            pair += "=" + encodeURIComponent(value);
		            pairs.push(pair);
		          }
		        }
		
		        if (pairs.length === 0) { return ''; }
		
		        return "?" + pairs.join("&");
		      },
		
		      parseQueryString: function(queryString) {
		        var pairs = queryString.split("&"), queryParams = {};
		        for(var i=0; i < pairs.length; i++) {
		          var pair      = pairs[i].split('='),
		              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
		              keyLength = key.length,
		              isArray = false,
		              value;
		          if (pair.length === 1) {
		            value = 'true';
		          } else {
		            //Handle arrays
		            if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
		              isArray = true;
		              key = key.slice(0, keyLength - 2);
		              if(!queryParams[key]) {
		                queryParams[key] = [];
		              }
		            }
		            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
		          }
		          if (isArray) {
		            queryParams[key].push(value);
		          } else {
		            queryParams[key] = value;
		          }
		        }
		        return queryParams;
		      },
		
		      recognize: function(path) {
		        var states = [ this.rootState ],
		            pathLen, i, l, queryStart, queryParams = {},
		            isSlashDropped = false;
		
		        queryStart = path.indexOf('?');
		        if (queryStart !== -1) {
		          var queryString = path.substr(queryStart + 1, path.length);
		          path = path.substr(0, queryStart);
		          queryParams = this.parseQueryString(queryString);
		        }
		
		        path = decodeURI(path);
		
		        if (path.charAt(0) !== "/") { path = "/" + path; }
		
		        pathLen = path.length;
		        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
		          path = path.substr(0, pathLen - 1);
		          isSlashDropped = true;
		        }
		
		        for (i=0; i<path.length; i++) {
		          states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
		          if (!states.length) { break; }
		        }
		
		        var solutions = [];
		        for (i=0; i<states.length; i++) {
		          if (states[i].handlers) { solutions.push(states[i]); }
		        }
		
		        states = $$route$recognizer$$sortSolutions(solutions);
		
		        var state = solutions[0];
		
		        if (state && state.handlers) {
		          // if a trailing slash was dropped and a star segment is the last segment
		          // specified, put the trailing slash back
		          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
		            path = path + "/";
		          }
		          return $$route$recognizer$$findHandler(state, path, queryParams);
		        }
		      }
		    };
		
		    $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;
		
		    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.11';
		
		    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;
		
		    /* global define:true module:true window: true */
		    if ("function" === 'function' && __webpack_require__(3)['amd']) {
		      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return $$route$recognizer$$default; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		    } else if (typeof module !== 'undefined' && module['exports']) {
		      module['exports'] = $$route$recognizer$$default;
		    } else if (typeof this !== 'undefined') {
		      this['RouteRecognizer'] = $$route$recognizer$$default;
		    }
		}).call(this);
		
		//# sourceMappingURL=route-recognizer.js.map
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))
	
	/***/ },
	/* 2 */
	/***/ function(module, exports) {
	
		module.exports = function(module) {
			if(!module.webpackPolyfill) {
				module.deprecate = function() {};
				module.paths = [];
				// module.parent = undefined by default
				module.children = [];
				module.webpackPolyfill = 1;
			}
			return module;
		}
	
	
	/***/ },
	/* 3 */
	/***/ function(module, exports) {
	
		module.exports = function() { throw new Error("define cannot be used indirect"); };
	
	
	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=router.js.map

/***/ })
/******/ ])
});
;
//# sourceMappingURL=powerbi.js.map