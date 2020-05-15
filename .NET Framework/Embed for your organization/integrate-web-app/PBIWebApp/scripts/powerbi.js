/*! powerbi-client v2.10.4 | (c) 2016 Microsoft Corporation MIT */
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
	var factories = __webpack_require__(17);
	exports.factories = factories;
	var models = __webpack_require__(5);
	exports.models = models;
	var report_1 = __webpack_require__(7);
	exports.Report = report_1.Report;
	var dashboard_1 = __webpack_require__(13);
	exports.Dashboard = dashboard_1.Dashboard;
	var tile_1 = __webpack_require__(14);
	exports.Tile = tile_1.Tile;
	var embed_1 = __webpack_require__(2);
	exports.Embed = embed_1.Embed;
	var page_1 = __webpack_require__(8);
	exports.Page = page_1.Page;
	var qna_1 = __webpack_require__(15);
	exports.Qna = qna_1.Qna;
	var visual_1 = __webpack_require__(16);
	exports.Visual = visual_1.Visual;
	var visualDescriptor_1 = __webpack_require__(9);
	exports.VisualDescriptor = visualDescriptor_1.VisualDescriptor;
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
	var report_1 = __webpack_require__(7);
	var create_1 = __webpack_require__(12);
	var dashboard_1 = __webpack_require__(13);
	var tile_1 = __webpack_require__(14);
	var page_1 = __webpack_require__(8);
	var qna_1 = __webpack_require__(15);
	var visual_1 = __webpack_require__(16);
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
	        this.uniqueSessionId = utils.generateUUID();
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
	        this.router.post("/reports/:uniqueId/pages/:pageName/visuals/:visualName/events/:eventName", function (req, res) {
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
	        this.router.post("/tile/:uniqueId/events/:eventName", function (req, res) {
	            var event = {
	                type: 'tile',
	                id: req.params.uniqueId,
	                name: req.params.eventName,
	                value: req.body
	            };
	            _this.handleEvent(event);
	        });
	        /**
	         * Adds handler for Q&A events.
	         */
	        this.router.post("/qna/:uniqueId/events/:eventName", function (req, res) {
	            var event = {
	                type: 'qna',
	                id: req.params.uniqueId,
	                name: req.params.eventName,
	                value: req.body
	            };
	            _this.handleEvent(event);
	        });
	        /**
	         * Adds handler for front load 'ready' message.
	         */
	        this.router.post("/ready/:uniqueId", function (req, res) {
	            var event = {
	                type: 'report',
	                id: req.params.uniqueId,
	                name: 'ready',
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
	     * @param {embed.IEmbedConfigurationBase} [config={}]
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embed = function (element, config) {
	        if (config === void 0) { config = {}; }
	        return this.embedInternal(element, config);
	    };
	    /**
	     * Given a configuration based on an HTML element,
	     * if the component has already been created and attached to the element, reuses the component instance and existing iframe,
	     * otherwise creates a new component instance.
	     * This is used for the phased embedding API, once element is loaded successfully, one can call 'render' on it.
	     *
	     * @param {HTMLElement} element
	     * @param {embed.IEmbedConfigurationBase} [config={}]
	     * @returns {embed.Embed}
	     */
	    Service.prototype.load = function (element, config) {
	        if (config === void 0) { config = {}; }
	        return this.embedInternal(element, config, /* phasedRender */ true, /* isBootstrap */ false);
	    };
	    /**
	     * Given an HTML element and entityType, creates a new component instance, and bootstrap the iframe for embedding.
	     *
	     * @param {HTMLElement} element
	     * @param {embed.IBootstrapEmbedConfiguration} config: a bootstrap config which is an embed config without access token.
	     */
	    Service.prototype.bootstrap = function (element, config) {
	        return this.embedInternal(element, config, /* phasedRender */ false, /* isBootstrap */ true);
	    };
	    Service.prototype.embedInternal = function (element, config, phasedRender, isBootstrap) {
	        if (config === void 0) { config = {}; }
	        var component;
	        var powerBiElement = element;
	        if (powerBiElement.powerBiEmbed) {
	            if (isBootstrap) {
	                throw new Error("Attempted to bootstrap element " + element.outerHTML + ", but the element is already a powerbi element.");
	            }
	            component = this.embedExisting(powerBiElement, config, phasedRender);
	        }
	        else {
	            component = this.embedNew(powerBiElement, config, phasedRender, isBootstrap);
	        }
	        return component;
	    };
	    Service.prototype.getNumberOfComponents = function () {
	        if (!this.embeds) {
	            return 0;
	        }
	        return this.embeds.length;
	    };
	    Service.prototype.getSdkSessionId = function () {
	        return this.uniqueSessionId;
	    };
	    /**
	     * Given a configuration based on a Power BI element, saves the component instance that reference the element for later lookup.
	     *
	     * @private
	     * @param {IPowerBiElement} element
	     * @param {embed.IEmbedConfigurationBase} config
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embedNew = function (element, config, phasedRender, isBootstrap) {
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
	        var component = new Component(this, element, config, phasedRender, isBootstrap);
	        element.powerBiEmbed = component;
	        this.addOrOverwriteEmbed(component, element);
	        return component;
	    };
	    /**
	     * Given an element that already contains an embed component, load with a new configuration.
	     *
	     * @private
	     * @param {IPowerBiElement} element
	     * @param {embed.IEmbedConfigurationBase} config
	     * @returns {embed.Embed}
	     */
	    Service.prototype.embedExisting = function (element, config, phasedRender) {
	        var component = utils.find(function (x) { return x.element === element; }, this.embeds);
	        if (!component) {
	            throw new Error("Attempted to embed using config " + JSON.stringify(config) + " on element " + element.outerHTML + " which already has embedded comopnent associated, but could not find the existing comopnent in the list of active components. This could indicate the embeds list is out of sync with the DOM, or the component is referencing the incorrect HTML element.");
	        }
	        // TODO: Multiple embedding to the same iframe is not supported in QnA
	        if (config.type && config.type.toLowerCase() === "qna") {
	            return this.embedNew(element, config);
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
	                var report = new report_1.Report(this, element, config, /* phasedRender */ false, /* isBootstrap */ false, element.powerBiEmbed.iframe);
	                report.load(config);
	                element.powerBiEmbed = report;
	                this.addOrOverwriteEmbed(component, element);
	                return report;
	            }
	            throw new Error("Embedding on an existing element with a different type than the previous embed object is not supported.  Attempted to embed using config " + JSON.stringify(config) + " on element " + element.outerHTML + ", but the existing element contains an embed of type: " + this.config.type + " which does not match the new type: " + config.type);
	        }
	        component.populateConfig(config, /* isBootstrap */ false);
	        component.load(component.config, phasedRender);
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
	        /** Removes the element frontLoad listener if exists. */
	        var embedElement = powerBiElement.powerBiEmbed;
	        if (embedElement.frontLoadHandler) {
	            embedElement.element.removeEventListener('ready', embedElement.frontLoadHandler, false);
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
	     * handles tile events
	     *
	     * @param {IEvent<any>} event
	     */
	    Service.prototype.handleTileEvents = function (event) {
	        if (event.type === 'tile') {
	            this.handleEvent(event);
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
	                value[pageKey] = new page_1.Page(embed, page.name, page.displayName, true /* isActive */);
	            }
	            utils.raiseCustomEvent(embed.element, event.name, value);
	        }
	    };
	    /**
	     * API for warm starting powerbi embedded endpoints.
	     * Use this API to preload Power BI Embedded in the background.
	     *
	     * @public
	     * @param {embed.IEmbedConfigurationBase} [config={}]
	     * @param {HTMLElement} [element=undefined]
	     */
	    Service.prototype.preload = function (config, element) {
	        var iframeContent = document.createElement("iframe");
	        iframeContent.setAttribute("style", "display:none;");
	        iframeContent.setAttribute("src", config.embedUrl);
	        iframeContent.setAttribute("scrolling", "no");
	        iframeContent.setAttribute("allowfullscreen", "false");
	        var node = element;
	        if (!node) {
	            node = document.getElementsByTagName("body")[0];
	        }
	        node.appendChild(iframeContent);
	        iframeContent.onload = function () {
	            utils.raiseCustomEvent(iframeContent, "preloaded", {});
	        };
	        return iframeContent;
	    };
	    /**
	     * A list of components that this service can embed
	     */
	    Service.components = [
	        tile_1.Tile,
	        report_1.Report,
	        dashboard_1.Dashboard,
	        qna_1.Qna,
	        visual_1.Visual
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
	var sdkConfig = __webpack_require__(4);
	var models = __webpack_require__(5);
	var errors_1 = __webpack_require__(6);
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
	     * @param {IEmbedConfigurationBase} config
	     */
	    function Embed(service, element, config, iframe, phasedRender, isBootstrap) {
	        this.allowedEvents = [];
	        if (utils.autoAuthInEmbedUrl(config.embedUrl)) {
	            throw new Error(errors_1.EmbedUrlNotSupported);
	        }
	        Array.prototype.push.apply(this.allowedEvents, Embed.allowedEvents);
	        this.eventHandlers = [];
	        this.service = service;
	        this.element = element;
	        this.iframe = iframe;
	        this.embeType = config.type.toLowerCase();
	        this.populateConfig(config, isBootstrap);
	        if (this.embeType === 'create') {
	            this.setIframe(false /*set EventListener to call create() on 'load' event*/, phasedRender, isBootstrap);
	        }
	        else {
	            this.setIframe(true /*set EventListener to call load() on 'load' event*/, phasedRender, isBootstrap);
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
	        var errors = models.validateCreateReport(config);
	        if (errors) {
	            throw errors;
	        }
	        return this.service.hpm.post("/report/create", config, { uid: this.config.uniqueId, sdkSessionId: this.service.getSdkSessionId() }, this.iframe.contentWindow)
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
	     * @param {boolean} phasedRender
	     * @returns {Promise<void>}
	     */
	    Embed.prototype.load = function (config, phasedRender) {
	        var _this = this;
	        if (!config.accessToken) {
	            return;
	        }
	        var path = phasedRender && config.type === 'report' ? this.phasedLoadPath : this.loadPath;
	        var headers = {
	            uid: this.config.uniqueId,
	            sdkSessionId: this.service.getSdkSessionId(),
	            bootstrapped: this.config.bootstrapped,
	            sdkVersion: sdkConfig.default.version
	        };
	        return this.service.hpm.post(path, config, headers, this.iframe.contentWindow)
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
	            throw new Error("eventName must be one of " + this.allowedEvents + ". You passed: " + eventName);
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
	        var _this = this;
	        var embedType = this.config.type;
	        embedType = (embedType === 'create' || embedType === 'visual' || embedType === 'qna') ? 'report' : embedType;
	        return this.service.hpm.post('/' + embedType + '/token', accessToken, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            _this.config.accessToken = accessToken;
	            _this.element.setAttribute(Embed.accessTokenAttribute, accessToken);
	            _this.service.accessToken = accessToken;
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
	     * @param {IEmbedConfiguration}
	     * @returns {void}
	     */
	    Embed.prototype.populateConfig = function (config, isBootstrap) {
	        if (this.bootstrapConfig) {
	            this.config = utils.assign({}, this.bootstrapConfig, config);
	            // reset bootstrapConfig because we do not want to merge it in re-embed scenario.
	            this.bootstrapConfig = null;
	        }
	        else {
	            // Copy config - important for multiple iframe scenario.
	            // Otherwise, if a user uses the same config twice, same unique Id which will be used in different iframes.
	            this.config = utils.assign({}, config);
	        }
	        this.config.embedUrl = this.getEmbedUrl(isBootstrap);
	        this.config.groupId = this.getGroupId();
	        this.addLocaleToEmbedUrl(config);
	        this.config.uniqueId = this.getUniqueId();
	        if (isBootstrap) {
	            // save current config in bootstrapConfig to be able to merge it on next call to powerbi.embed
	            this.bootstrapConfig = this.config;
	            this.bootstrapConfig.bootstrapped = true;
	        }
	        else {
	            this.config.accessToken = this.getAccessToken(this.service.accessToken);
	        }
	        this.configChanged(isBootstrap);
	    };
	    /**
	     * Adds locale parameters to embedUrl
	     *
	     * @private
	     * @param {IEmbedConfiguration} config
	     */
	    Embed.prototype.addLocaleToEmbedUrl = function (config) {
	        if (!config.settings) {
	            return;
	        }
	        var localeSettings = config.settings.localeSettings;
	        if (localeSettings && localeSettings.language) {
	            this.config.embedUrl = utils.addParamToUrl(this.config.embedUrl, 'language', localeSettings.language);
	        }
	        if (localeSettings && localeSettings.formatLocale) {
	            this.config.embedUrl = utils.addParamToUrl(this.config.embedUrl, 'formatLocale', localeSettings.formatLocale);
	        }
	    };
	    /**
	     * Gets an embed url from the first available location: options, attribute.
	     *
	     * @private
	     * @returns {string}
	     */
	    Embed.prototype.getEmbedUrl = function (isBootstrap) {
	        var embedUrl = this.config.embedUrl || this.element.getAttribute(Embed.embedUrlAttribute);
	        if (isBootstrap && !embedUrl) {
	            // Prepare flow, embed url was not provided, use hostname to build embed url.
	            embedUrl = this.getDefaultEmbedUrl(this.config.hostname);
	        }
	        if (typeof embedUrl !== 'string' || embedUrl.length === 0) {
	            throw new Error("Embed Url is required, but it was not found. You must provide an embed url either as part of embed configuration or as attribute '" + Embed.embedUrlAttribute + "'.");
	        }
	        return embedUrl;
	    };
	    Embed.prototype.getDefaultEmbedUrl = function (hostname) {
	        if (!hostname) {
	            hostname = Embed.defaultEmbedHostName;
	        }
	        var endpoint = this.getDefaultEmbedUrlEndpoint();
	        // Trim spaces to fix user mistakes.
	        hostname = hostname.toLowerCase().trim();
	        if (hostname.indexOf("http://") === 0) {
	            throw new Error("HTTP is not allowed. HTTPS is required");
	        }
	        if (hostname.indexOf("https://") === 0) {
	            return hostname + "/" + endpoint;
	        }
	        return "https://" + hostname + "/" + endpoint;
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
	     * Gets the group ID from the first available location: options, embeddedUrl.
	     *
	     * @private
	     * @returns {string}
	     */
	    Embed.prototype.getGroupId = function () {
	        return this.config.groupId || Embed.findGroupIdFromEmbedUrl(this.config.embedUrl);
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
	    Embed.prototype.setIframe = function (isLoad, phasedRender, isBootstrap) {
	        var _this = this;
	        if (!this.iframe) {
	            var iframeContent = document.createElement("iframe");
	            var embedUrl = this.config.uniqueId ? utils.addParamToUrl(this.config.embedUrl, 'uid', this.config.uniqueId) : this.config.embedUrl;
	            iframeContent.style.width = '100%';
	            iframeContent.style.height = '100%';
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
	            if (!isBootstrap) {
	                // Validate config if it's not a bootstrap case.
	                var errors = this.validate(this.config);
	                if (errors) {
	                    throw errors;
	                }
	            }
	            this.iframe.addEventListener('load', function () { return _this.load(_this.config, phasedRender); }, false);
	            if (this.service.getNumberOfComponents() <= Embed.maxFrontLoadTimes) {
	                this.frontLoadHandler = function () { return _this.frontLoadSendConfig(_this.config); };
	                // 'ready' event is fired by the embedded element (not by the iframe)
	                this.element.addEventListener('ready', this.frontLoadHandler, false);
	            }
	        }
	        else {
	            this.iframe.addEventListener('load', function () { return _this.createReport(_this.createConfig); }, false);
	        }
	    };
	    /**
	     * Sets Iframe's title
	     */
	    Embed.prototype.setComponentTitle = function (title) {
	        if (!this.iframe) {
	            return;
	        }
	        if (title == null) {
	            this.iframe.removeAttribute("title");
	        }
	        else {
	            this.iframe.setAttribute("title", title);
	        }
	    };
	    /**
	     * Sets element's tabindex attribute
	     */
	    Embed.prototype.setComponentTabIndex = function (tabIndex) {
	        if (!this.element) {
	            return;
	        }
	        this.element.setAttribute("tabindex", (tabIndex == null) ? "0" : tabIndex.toString());
	    };
	    /**
	     * Removes element's tabindex attribute
	     */
	    Embed.prototype.removeComponentTabIndex = function (tabIndex) {
	        if (!this.element) {
	            return;
	        }
	        this.element.removeAttribute("tabindex");
	    };
	    /**
	     * Adds the ability to get groupId from url.
	     * By extracting the ID we can ensure that the ID is always explicitly provided as part of the load configuration.
	     *
	     * @static
	     * @param {string} url
	     * @returns {string}
	     */
	    Embed.findGroupIdFromEmbedUrl = function (url) {
	        var groupIdRegEx = /groupId="?([^&]+)"?/;
	        var groupIdMatch = url.match(groupIdRegEx);
	        var groupId;
	        if (groupIdMatch) {
	            groupId = groupIdMatch[1];
	        }
	        return groupId;
	    };
	    /**
	     * Sends the config for front load calls, after 'ready' message is received from the iframe
	     */
	    Embed.prototype.frontLoadSendConfig = function (config) {
	        if (!config.accessToken) {
	            return;
	        }
	        var errors = this.validate(config);
	        if (errors) {
	            throw errors;
	        }
	        // contentWindow must be initialized
	        if (this.iframe.contentWindow == null)
	            return;
	        return this.service.hpm.post("/frontload/config", config, { uid: this.config.uniqueId }, this.iframe.contentWindow).then(function (response) {
	            return response.body;
	        }, function (response) {
	            throw response.body;
	        });
	    };
	    Embed.allowedEvents = ["loaded", "saved", "rendered", "saveAsTriggered", "error", "dataSelected", "buttonClicked"];
	    Embed.accessTokenAttribute = 'powerbi-access-token';
	    Embed.embedUrlAttribute = 'powerbi-embed-url';
	    Embed.nameAttribute = 'powerbi-name';
	    Embed.typeAttribute = 'powerbi-type';
	    Embed.defaultEmbedHostName = "https://app.powerbi.com";
	    Embed.maxFrontLoadTimes = 2;
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
	 * Generates a random 5 to 6 character string.
	 *
	 * @export
	 * @returns {string}
	 */
	function createRandomString() {
	    return getRandomValue().toString(36).substring(1);
	}
	exports.createRandomString = createRandomString;
	/**
	 * Generates a 20 charachter uuid.
	 *
	 * @export
	 * @returns {string}
	 */
	function generateUUID() {
	    var d = new Date().getTime();
	    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
	        d += performance.now();
	    }
	    return 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        // Generate a random number, scaled from 0 to 15.
	        var r = (getRandomValue() % 16);
	        // Shift 4 times to divide by 16
	        d >>= 4;
	        return r.toString(16);
	    });
	}
	exports.generateUUID = generateUUID;
	/**
	 * Adds a parameter to the given url
	 *
	 * @export
	 * @param {string} url
	 * @param {string} paramName
	 * @param {string} value
	 * @returns {string}
	 */
	function addParamToUrl(url, paramName, value) {
	    var parameterPrefix = url.indexOf('?') > 0 ? '&' : '?';
	    url += parameterPrefix + paramName + '=' + value;
	    return url;
	}
	exports.addParamToUrl = addParamToUrl;
	/**
	 * Checks if the report is saved.
	 *
	 * @export
	 * @param {HttpPostMessage} hpm
	 * @param {string} uid
	 * @param {Window} contentWindow
	 * @returns {Promise<boolean>}
	 */
	function isSavedInternal(hpm, uid, contentWindow) {
	    return hpm.get('/report/hasUnsavedChanges', { uid: uid }, contentWindow)
	        .then(function (response) { return !response.body; }, function (response) {
	        throw response.body;
	    });
	}
	exports.isSavedInternal = isSavedInternal;
	/**
	 * Checks if the embed url is for RDL report.
	 *
	 * @export
	 * @param {string} embedUrl
	 * @returns {boolean}
	 */
	function isRDLEmbed(embedUrl) {
	    return embedUrl.toLowerCase().indexOf("/rdlembed?") >= 0;
	}
	exports.isRDLEmbed = isRDLEmbed;
	/**
	 * Checks if the embed url contains autoAuth=true.
	 *
	 * @export
	 * @param {string} embedUrl
	 * @returns {boolean}
	 */
	function autoAuthInEmbedUrl(embedUrl) {
	    return embedUrl && decodeURIComponent(embedUrl).toLowerCase().indexOf("autoauth=true") >= 0;
	}
	exports.autoAuthInEmbedUrl = autoAuthInEmbedUrl;
	/**
	 * Returns random number
	 */
	function getRandomValue() {
	    // window.msCrypto for IE
	    var cryptoObj = window.crypto || window.msCrypto;
	    var randomValueArray = new Uint32Array(1);
	    cryptoObj.getRandomValues(randomValueArray);
	    return randomValueArray[0];
	}
	exports.getRandomValue = getRandomValue;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	var config = {
	    version: '2.10.4',
	    type: 'js'
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = config;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*! powerbi-models v1.3.2 | (c) 2016 Microsoft Corporation MIT */
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
		exports.Validators = __webpack_require__(1).Validators;
		var TraceType;
		(function (TraceType) {
		    TraceType[TraceType["Information"] = 0] = "Information";
		    TraceType[TraceType["Verbose"] = 1] = "Verbose";
		    TraceType[TraceType["Warning"] = 2] = "Warning";
		    TraceType[TraceType["Error"] = 3] = "Error";
		    TraceType[TraceType["ExpectedError"] = 4] = "ExpectedError";
		    TraceType[TraceType["UnexpectedError"] = 5] = "UnexpectedError";
		    TraceType[TraceType["Fatal"] = 6] = "Fatal";
		})(TraceType = exports.TraceType || (exports.TraceType = {}));
		var PageSizeType;
		(function (PageSizeType) {
		    PageSizeType[PageSizeType["Widescreen"] = 0] = "Widescreen";
		    PageSizeType[PageSizeType["Standard"] = 1] = "Standard";
		    PageSizeType[PageSizeType["Cortana"] = 2] = "Cortana";
		    PageSizeType[PageSizeType["Letter"] = 3] = "Letter";
		    PageSizeType[PageSizeType["Custom"] = 4] = "Custom";
		})(PageSizeType = exports.PageSizeType || (exports.PageSizeType = {}));
		var DisplayOption;
		(function (DisplayOption) {
		    DisplayOption[DisplayOption["FitToPage"] = 0] = "FitToPage";
		    DisplayOption[DisplayOption["FitToWidth"] = 1] = "FitToWidth";
		    DisplayOption[DisplayOption["ActualSize"] = 2] = "ActualSize";
		})(DisplayOption = exports.DisplayOption || (exports.DisplayOption = {}));
		var BackgroundType;
		(function (BackgroundType) {
		    BackgroundType[BackgroundType["Default"] = 0] = "Default";
		    BackgroundType[BackgroundType["Transparent"] = 1] = "Transparent";
		})(BackgroundType = exports.BackgroundType || (exports.BackgroundType = {}));
		var VisualContainerDisplayMode;
		(function (VisualContainerDisplayMode) {
		    VisualContainerDisplayMode[VisualContainerDisplayMode["Visible"] = 0] = "Visible";
		    VisualContainerDisplayMode[VisualContainerDisplayMode["Hidden"] = 1] = "Hidden";
		})(VisualContainerDisplayMode = exports.VisualContainerDisplayMode || (exports.VisualContainerDisplayMode = {}));
		var LayoutType;
		(function (LayoutType) {
		    LayoutType[LayoutType["Master"] = 0] = "Master";
		    LayoutType[LayoutType["Custom"] = 1] = "Custom";
		    LayoutType[LayoutType["MobilePortrait"] = 2] = "MobilePortrait";
		    LayoutType[LayoutType["MobileLandscape"] = 3] = "MobileLandscape";
		})(LayoutType = exports.LayoutType || (exports.LayoutType = {}));
		var HyperlinkClickBehavior;
		(function (HyperlinkClickBehavior) {
		    HyperlinkClickBehavior[HyperlinkClickBehavior["Navigate"] = 0] = "Navigate";
		    HyperlinkClickBehavior[HyperlinkClickBehavior["NavigateAndRaiseEvent"] = 1] = "NavigateAndRaiseEvent";
		    HyperlinkClickBehavior[HyperlinkClickBehavior["RaiseEvent"] = 2] = "RaiseEvent";
		})(HyperlinkClickBehavior = exports.HyperlinkClickBehavior || (exports.HyperlinkClickBehavior = {}));
		var SectionVisibility;
		(function (SectionVisibility) {
		    SectionVisibility[SectionVisibility["AlwaysVisible"] = 0] = "AlwaysVisible";
		    SectionVisibility[SectionVisibility["HiddenInViewMode"] = 1] = "HiddenInViewMode";
		})(SectionVisibility = exports.SectionVisibility || (exports.SectionVisibility = {}));
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
		var ContrastMode;
		(function (ContrastMode) {
		    ContrastMode[ContrastMode["None"] = 0] = "None";
		    ContrastMode[ContrastMode["HighContrast1"] = 1] = "HighContrast1";
		    ContrastMode[ContrastMode["HighContrast2"] = 2] = "HighContrast2";
		    ContrastMode[ContrastMode["HighContrastBlack"] = 3] = "HighContrastBlack";
		    ContrastMode[ContrastMode["HighContrastWhite"] = 4] = "HighContrastWhite";
		})(ContrastMode = exports.ContrastMode || (exports.ContrastMode = {}));
		var MenuLocation;
		(function (MenuLocation) {
		    MenuLocation[MenuLocation["Bottom"] = 0] = "Bottom";
		    MenuLocation[MenuLocation["Top"] = 1] = "Top";
		})(MenuLocation = exports.MenuLocation || (exports.MenuLocation = {}));
		var FiltersLevel;
		(function (FiltersLevel) {
		    FiltersLevel[FiltersLevel["Report"] = 0] = "Report";
		    FiltersLevel[FiltersLevel["Page"] = 1] = "Page";
		    FiltersLevel[FiltersLevel["Visual"] = 2] = "Visual";
		})(FiltersLevel = exports.FiltersLevel || (exports.FiltersLevel = {}));
		var FilterType;
		(function (FilterType) {
		    FilterType[FilterType["Advanced"] = 0] = "Advanced";
		    FilterType[FilterType["Basic"] = 1] = "Basic";
		    FilterType[FilterType["Unknown"] = 2] = "Unknown";
		    FilterType[FilterType["IncludeExclude"] = 3] = "IncludeExclude";
		    FilterType[FilterType["RelativeDate"] = 4] = "RelativeDate";
		    FilterType[FilterType["TopN"] = 5] = "TopN";
		    FilterType[FilterType["Tuple"] = 6] = "Tuple";
		})(FilterType = exports.FilterType || (exports.FilterType = {}));
		var RelativeDateFilterTimeUnit;
		(function (RelativeDateFilterTimeUnit) {
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Days"] = 0] = "Days";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Weeks"] = 1] = "Weeks";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarWeeks"] = 2] = "CalendarWeeks";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Months"] = 3] = "Months";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarMonths"] = 4] = "CalendarMonths";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["Years"] = 5] = "Years";
		    RelativeDateFilterTimeUnit[RelativeDateFilterTimeUnit["CalendarYears"] = 6] = "CalendarYears";
		})(RelativeDateFilterTimeUnit = exports.RelativeDateFilterTimeUnit || (exports.RelativeDateFilterTimeUnit = {}));
		var RelativeDateOperators;
		(function (RelativeDateOperators) {
		    RelativeDateOperators[RelativeDateOperators["InLast"] = 0] = "InLast";
		    RelativeDateOperators[RelativeDateOperators["InThis"] = 1] = "InThis";
		    RelativeDateOperators[RelativeDateOperators["InNext"] = 2] = "InNext";
		})(RelativeDateOperators = exports.RelativeDateOperators || (exports.RelativeDateOperators = {}));
		var Filter = /** @class */ (function () {
		    function Filter(target, filterType) {
		        this.target = target;
		        this.filterType = filterType;
		    }
		    Filter.prototype.toJSON = function () {
		        var filter = {
		            $schema: this.schemaUrl,
		            target: this.target,
		            filterType: this.filterType
		        };
		        // Add displaySettings only when defined
		        if (this.displaySettings !== undefined) {
		            filter.displaySettings = this.displaySettings;
		        }
		        return filter;
		    };
		    ;
		    return Filter;
		}());
		exports.Filter = Filter;
		var NotSupportedFilter = /** @class */ (function (_super) {
		    __extends(NotSupportedFilter, _super);
		    function NotSupportedFilter(target, message, notSupportedTypeName) {
		        var _this = _super.call(this, target, FilterType.Unknown) || this;
		        _this.message = message;
		        _this.notSupportedTypeName = notSupportedTypeName;
		        _this.schemaUrl = NotSupportedFilter.schemaUrl;
		        return _this;
		    }
		    NotSupportedFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.message = this.message;
		        filter.notSupportedTypeName = this.notSupportedTypeName;
		        return filter;
		    };
		    NotSupportedFilter.schemaUrl = "http://powerbi.com/product/schema#notSupported";
		    return NotSupportedFilter;
		}(Filter));
		exports.NotSupportedFilter = NotSupportedFilter;
		var IncludeExcludeFilter = /** @class */ (function (_super) {
		    __extends(IncludeExcludeFilter, _super);
		    function IncludeExcludeFilter(target, isExclude, values) {
		        var _this = _super.call(this, target, FilterType.IncludeExclude) || this;
		        _this.values = values;
		        _this.isExclude = isExclude;
		        _this.schemaUrl = IncludeExcludeFilter.schemaUrl;
		        return _this;
		    }
		    IncludeExcludeFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.isExclude = this.isExclude;
		        filter.values = this.values;
		        return filter;
		    };
		    IncludeExcludeFilter.schemaUrl = "http://powerbi.com/product/schema#includeExclude";
		    return IncludeExcludeFilter;
		}(Filter));
		exports.IncludeExcludeFilter = IncludeExcludeFilter;
		var TopNFilter = /** @class */ (function (_super) {
		    __extends(TopNFilter, _super);
		    function TopNFilter(target, operator, itemCount, orderBy) {
		        var _this = _super.call(this, target, FilterType.TopN) || this;
		        _this.operator = operator;
		        _this.itemCount = itemCount;
		        _this.schemaUrl = TopNFilter.schemaUrl;
		        _this.orderBy = orderBy;
		        return _this;
		    }
		    TopNFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.operator = this.operator;
		        filter.itemCount = this.itemCount;
		        filter.orderBy = this.orderBy;
		        return filter;
		    };
		    TopNFilter.schemaUrl = "http://powerbi.com/product/schema#topN";
		    return TopNFilter;
		}(Filter));
		exports.TopNFilter = TopNFilter;
		var RelativeDateFilter = /** @class */ (function (_super) {
		    __extends(RelativeDateFilter, _super);
		    function RelativeDateFilter(target, operator, timeUnitsCount, timeUnitType, includeToday) {
		        var _this = _super.call(this, target, FilterType.RelativeDate) || this;
		        _this.operator = operator;
		        _this.timeUnitsCount = timeUnitsCount;
		        _this.timeUnitType = timeUnitType;
		        _this.includeToday = includeToday;
		        _this.schemaUrl = RelativeDateFilter.schemaUrl;
		        return _this;
		    }
		    RelativeDateFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.operator = this.operator;
		        filter.timeUnitsCount = this.timeUnitsCount;
		        filter.timeUnitType = this.timeUnitType;
		        filter.includeToday = this.includeToday;
		        return filter;
		    };
		    RelativeDateFilter.schemaUrl = "http://powerbi.com/product/schema#relativeDate";
		    return RelativeDateFilter;
		}(Filter));
		exports.RelativeDateFilter = RelativeDateFilter;
		var BasicFilter = /** @class */ (function (_super) {
		    __extends(BasicFilter, _super);
		    function BasicFilter(target, operator) {
		        var values = [];
		        for (var _i = 2; _i < arguments.length; _i++) {
		            values[_i - 2] = arguments[_i];
		        }
		        var _this = _super.call(this, target, FilterType.Basic) || this;
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
		        filter.requireSingleSelection = !!this.requireSingleSelection;
		        return filter;
		    };
		    BasicFilter.schemaUrl = "http://powerbi.com/product/schema#basic";
		    return BasicFilter;
		}(Filter));
		exports.BasicFilter = BasicFilter;
		var BasicFilterWithKeys = /** @class */ (function (_super) {
		    __extends(BasicFilterWithKeys, _super);
		    function BasicFilterWithKeys(target, operator, values, keyValues) {
		        var _this = _super.call(this, target, operator, values) || this;
		        _this.keyValues = keyValues;
		        _this.target = target;
		        var numberOfKeys = target.keys ? target.keys.length : 0;
		        if (numberOfKeys > 0 && !keyValues) {
		            throw new Error("You should pass the values to be filtered for each key. You passed: no values and " + numberOfKeys + " keys");
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
		var TupleFilter = /** @class */ (function (_super) {
		    __extends(TupleFilter, _super);
		    function TupleFilter(target, operator, values) {
		        var _this = _super.call(this, target, FilterType.Tuple) || this;
		        _this.operator = operator;
		        _this.schemaUrl = TupleFilter.schemaUrl;
		        _this.values = values;
		        return _this;
		    }
		    TupleFilter.prototype.toJSON = function () {
		        var filter = _super.prototype.toJSON.call(this);
		        filter.operator = this.operator;
		        filter.values = this.values;
		        filter.target = this.target;
		        return filter;
		    };
		    TupleFilter.schemaUrl = "http://powerbi.com/product/schema#tuple";
		    return TupleFilter;
		}(Filter));
		exports.TupleFilter = TupleFilter;
		var AdvancedFilter = /** @class */ (function (_super) {
		    __extends(AdvancedFilter, _super);
		    function AdvancedFilter(target, logicalOperator) {
		        var conditions = [];
		        for (var _i = 2; _i < arguments.length; _i++) {
		            conditions[_i - 2] = arguments[_i];
		        }
		        var _this = _super.call(this, target, FilterType.Advanced) || this;
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
		    AdvancedFilter.schemaUrl = "http://powerbi.com/product/schema#advanced";
		    return AdvancedFilter;
		}(Filter));
		exports.AdvancedFilter = AdvancedFilter;
		function isFilterKeyColumnsTarget(target) {
		    return isColumn(target) && !!target.keys;
		}
		exports.isFilterKeyColumnsTarget = isFilterKeyColumnsTarget;
		function isBasicFilterWithKeys(filter) {
		    return getFilterType(filter) === FilterType.Basic && !!filter.keyValues;
		}
		exports.isBasicFilterWithKeys = isBasicFilterWithKeys;
		function getFilterType(filter) {
		    if (filter.filterType) {
		        return filter.filterType;
		    }
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
		    return !!(arg.table && arg.column && !arg.aggregationFunction);
		}
		exports.isColumn = isColumn;
		function isHierarchyLevel(arg) {
		    return !!(arg.table && arg.hierarchy && arg.hierarchyLevel && !arg.aggregationFunction);
		}
		exports.isHierarchyLevel = isHierarchyLevel;
		function isHierarchyLevelAggr(arg) {
		    return !!(arg.table && arg.hierarchy && arg.hierarchyLevel && arg.aggregationFunction);
		}
		exports.isHierarchyLevelAggr = isHierarchyLevelAggr;
		function isColumnAggr(arg) {
		    return !!(arg.table && arg.column && arg.aggregationFunction);
		}
		exports.isColumnAggr = isColumnAggr;
		var QnaMode;
		(function (QnaMode) {
		    QnaMode[QnaMode["Interactive"] = 0] = "Interactive";
		    QnaMode[QnaMode["ResultOnly"] = 1] = "ResultOnly";
		})(QnaMode = exports.QnaMode || (exports.QnaMode = {}));
		var ExportDataType;
		(function (ExportDataType) {
		    ExportDataType[ExportDataType["Summarized"] = 0] = "Summarized";
		    ExportDataType[ExportDataType["Underlying"] = 1] = "Underlying";
		})(ExportDataType = exports.ExportDataType || (exports.ExportDataType = {}));
		var BookmarksPlayMode;
		(function (BookmarksPlayMode) {
		    BookmarksPlayMode[BookmarksPlayMode["Off"] = 0] = "Off";
		    BookmarksPlayMode[BookmarksPlayMode["Presentation"] = 1] = "Presentation";
		})(BookmarksPlayMode = exports.BookmarksPlayMode || (exports.BookmarksPlayMode = {}));
		// This is not an enum because enum strings require
		// us to upgrade typeScript version and change SDK build definition
		exports.CommonErrorCodes = {
		    TokenExpired: 'TokenExpired',
		    NotFound: 'PowerBIEntityNotFound',
		    InvalidParameters: 'Invalid parameters',
		    LoadReportFailed: 'LoadReportFailed',
		    NotAuthorized: 'PowerBINotAuthorizedException',
		    FailedToLoadModel: 'ExplorationContainer_FailedToLoadModel_DefaultDetails',
		};
		exports.TextAlignment = {
		    Left: 'left',
		    Center: 'center',
		    Right: 'right',
		};
		exports.LegendPosition = {
		    Top: 'Top',
		    Bottom: 'Bottom',
		    Right: 'Right',
		    Left: 'Left',
		    TopCenter: 'TopCenter',
		    BottomCenter: 'BottomCenter',
		    RightCenter: 'RightCenter',
		    LeftCenter: 'LeftCenter',
		};
		var SortDirection;
		(function (SortDirection) {
		    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
		    SortDirection[SortDirection["Descending"] = 2] = "Descending";
		})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
		var Selector = /** @class */ (function () {
		    function Selector(schema) {
		        this.$schema = schema;
		    }
		    Selector.prototype.toJSON = function () {
		        return {
		            $schema: this.$schema
		        };
		    };
		    ;
		    return Selector;
		}());
		exports.Selector = Selector;
		var PageSelector = /** @class */ (function (_super) {
		    __extends(PageSelector, _super);
		    function PageSelector(pageName) {
		        var _this = _super.call(this, PageSelector.schemaUrl) || this;
		        _this.pageName = pageName;
		        return _this;
		    }
		    PageSelector.prototype.toJSON = function () {
		        var selector = _super.prototype.toJSON.call(this);
		        selector.pageName = this.pageName;
		        return selector;
		    };
		    PageSelector.schemaUrl = "http://powerbi.com/product/schema#pageSelector";
		    return PageSelector;
		}(Selector));
		exports.PageSelector = PageSelector;
		var VisualSelector = /** @class */ (function (_super) {
		    __extends(VisualSelector, _super);
		    function VisualSelector(visualName) {
		        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
		        _this.visualName = visualName;
		        return _this;
		    }
		    VisualSelector.prototype.toJSON = function () {
		        var selector = _super.prototype.toJSON.call(this);
		        selector.visualName = this.visualName;
		        return selector;
		    };
		    VisualSelector.schemaUrl = "http://powerbi.com/product/schema#visualSelector";
		    return VisualSelector;
		}(Selector));
		exports.VisualSelector = VisualSelector;
		var VisualTypeSelector = /** @class */ (function (_super) {
		    __extends(VisualTypeSelector, _super);
		    function VisualTypeSelector(visualType) {
		        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
		        _this.visualType = visualType;
		        return _this;
		    }
		    VisualTypeSelector.prototype.toJSON = function () {
		        var selector = _super.prototype.toJSON.call(this);
		        selector.visualType = this.visualType;
		        return selector;
		    };
		    VisualTypeSelector.schemaUrl = "http://powerbi.com/product/schema#visualTypeSelector";
		    return VisualTypeSelector;
		}(Selector));
		exports.VisualTypeSelector = VisualTypeSelector;
		var SlicerTargetSelector = /** @class */ (function (_super) {
		    __extends(SlicerTargetSelector, _super);
		    function SlicerTargetSelector(target) {
		        var _this = _super.call(this, VisualSelector.schemaUrl) || this;
		        _this.target = target;
		        return _this;
		    }
		    SlicerTargetSelector.prototype.toJSON = function () {
		        var selector = _super.prototype.toJSON.call(this);
		        selector.target = this.target;
		        return selector;
		    };
		    SlicerTargetSelector.schemaUrl = "http://powerbi.com/product/schema#slicerTargetSelector";
		    return SlicerTargetSelector;
		}(Selector));
		exports.SlicerTargetSelector = SlicerTargetSelector;
		var CommandDisplayOption;
		(function (CommandDisplayOption) {
		    CommandDisplayOption[CommandDisplayOption["Enabled"] = 0] = "Enabled";
		    CommandDisplayOption[CommandDisplayOption["Disabled"] = 1] = "Disabled";
		    CommandDisplayOption[CommandDisplayOption["Hidden"] = 2] = "Hidden";
		})(CommandDisplayOption = exports.CommandDisplayOption || (exports.CommandDisplayOption = {}));
		/*
		 * Visual CRUD
		 */
		var VisualDataRoleKind;
		(function (VisualDataRoleKind) {
		    // Indicates that the role should be bound to something that evaluates to a grouping of values.
		    VisualDataRoleKind[VisualDataRoleKind["Grouping"] = 0] = "Grouping";
		    // Indicates that the role should be bound to something that evaluates to a single value in a scope.
		    VisualDataRoleKind[VisualDataRoleKind["Measure"] = 1] = "Measure";
		    // Indicates that the role can be bound to either Grouping or Measure.
		    VisualDataRoleKind[VisualDataRoleKind["GroupingOrMeasure"] = 2] = "GroupingOrMeasure";
		})(VisualDataRoleKind = exports.VisualDataRoleKind || (exports.VisualDataRoleKind = {}));
		// Indicates the visual preference on Grouping or Measure. Only applicable if kind is GroupingOrMeasure.
		var VisualDataRoleKindPreference;
		(function (VisualDataRoleKindPreference) {
		    VisualDataRoleKindPreference[VisualDataRoleKindPreference["Measure"] = 0] = "Measure";
		    VisualDataRoleKindPreference[VisualDataRoleKindPreference["Grouping"] = 1] = "Grouping";
		})(VisualDataRoleKindPreference = exports.VisualDataRoleKindPreference || (exports.VisualDataRoleKindPreference = {}));
		function normalizeError(error) {
		    var message = error.message;
		    if (!message) {
		        message = error.path + " is invalid. Not meeting " + error.keyword + " constraint";
		    }
		    return {
		        message: message
		    };
		}
		function validateVisualSelector(input) {
		    var errors = exports.Validators.visualSelectorValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateVisualSelector = validateVisualSelector;
		function validateSlicer(input) {
		    var errors = exports.Validators.slicerValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateSlicer = validateSlicer;
		function validateSlicerState(input) {
		    var errors = exports.Validators.slicerStateValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateSlicerState = validateSlicerState;
		function validatePlayBookmarkRequest(input) {
		    var errors = exports.Validators.playBookmarkRequestValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validatePlayBookmarkRequest = validatePlayBookmarkRequest;
		function validateAddBookmarkRequest(input) {
		    var errors = exports.Validators.addBookmarkRequestValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateAddBookmarkRequest = validateAddBookmarkRequest;
		function validateApplyBookmarkByNameRequest(input) {
		    var errors = exports.Validators.applyBookmarkByNameRequestValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateApplyBookmarkByNameRequest = validateApplyBookmarkByNameRequest;
		function validateApplyBookmarkStateRequest(input) {
		    var errors = exports.Validators.applyBookmarkStateRequestValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateApplyBookmarkStateRequest = validateApplyBookmarkStateRequest;
		function validateSettings(input) {
		    var errors = exports.Validators.settingsValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateSettings = validateSettings;
		function validateCustomPageSize(input) {
		    var errors = exports.Validators.customPageSizeValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateCustomPageSize = validateCustomPageSize;
		function validateExtension(input) {
		    var errors = exports.Validators.extensionValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateExtension = validateExtension;
		function validateReportLoad(input) {
		    var errors = exports.Validators.reportLoadValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateReportLoad = validateReportLoad;
		function validateCreateReport(input) {
		    var errors = exports.Validators.reportCreateValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateCreateReport = validateCreateReport;
		function validateDashboardLoad(input) {
		    var errors = exports.Validators.dashboardLoadValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateDashboardLoad = validateDashboardLoad;
		function validateTileLoad(input) {
		    var errors = exports.Validators.tileLoadValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateTileLoad = validateTileLoad;
		function validatePage(input) {
		    var errors = exports.Validators.pageValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validatePage = validatePage;
		function validateFilter(input) {
		    var errors = exports.Validators.filtersValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateFilter = validateFilter;
		function validateSaveAsParameters(input) {
		    var errors = exports.Validators.saveAsParametersValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateSaveAsParameters = validateSaveAsParameters;
		function validateLoadQnaConfiguration(input) {
		    var errors = exports.Validators.loadQnaValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateLoadQnaConfiguration = validateLoadQnaConfiguration;
		function validateQnaInterpretInputData(input) {
		    var errors = exports.Validators.qnaInterpretInputDataValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateQnaInterpretInputData = validateQnaInterpretInputData;
		function validateExportDataRequest(input) {
		    var errors = exports.Validators.exportDataRequestValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateExportDataRequest = validateExportDataRequest;
		function validateVisualHeader(input) {
		    var errors = exports.Validators.visualHeaderValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateVisualHeader = validateVisualHeader;
		function validateVisualSettings(input) {
		    var errors = exports.Validators.visualSettingsValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateVisualSettings = validateVisualSettings;
		function validateCommandsSettings(input) {
		    var errors = exports.Validators.commandsSettingsValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateCommandsSettings = validateCommandsSettings;
		function validateCustomTheme(input) {
		    var errors = exports.Validators.customThemeValidator.validate(input);
		    return errors ? errors.map(normalizeError) : undefined;
		}
		exports.validateCustomTheme = validateCustomTheme;


	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {

		Object.defineProperty(exports, "__esModule", { value: true });
		var typeValidator_1 = __webpack_require__(2);
		var extensionsValidator_1 = __webpack_require__(3);
		var settingsValidator_1 = __webpack_require__(5);
		var bookmarkValidator_1 = __webpack_require__(6);
		var filtersValidator_1 = __webpack_require__(7);
		var fieldRequiredValidator_1 = __webpack_require__(8);
		var anyOfValidator_1 = __webpack_require__(9);
		var reportLoadValidator_1 = __webpack_require__(10);
		var reportCreateValidator_1 = __webpack_require__(11);
		var dashboardLoadValidator_1 = __webpack_require__(12);
		var tileLoadValidator_1 = __webpack_require__(13);
		var pageValidator_1 = __webpack_require__(14);
		var qnaValidator_1 = __webpack_require__(15);
		var saveAsParametersValidator_1 = __webpack_require__(16);
		var mapValidator_1 = __webpack_require__(17);
		var layoutValidator_1 = __webpack_require__(18);
		var exportDataValidator_1 = __webpack_require__(19);
		var selectorsValidator_1 = __webpack_require__(20);
		var slicersValidator_1 = __webpack_require__(21);
		var visualSettingsValidator_1 = __webpack_require__(22);
		var commandsSettingsValidator_1 = __webpack_require__(23);
		var customThemeValidator_1 = __webpack_require__(24);
		var datasetBindingValidator_1 = __webpack_require__(25);
		exports.Validators = {
		    addBookmarkRequestValidator: new bookmarkValidator_1.AddBookmarkRequestValidator(),
		    advancedFilterTypeValidator: new typeValidator_1.EnumValidator([0]),
		    advancedFilterValidator: new filtersValidator_1.AdvancedFilterValidator(),
		    anyArrayValidator: new typeValidator_1.ArrayValidator([new anyOfValidator_1.AnyOfValidator([new typeValidator_1.StringValidator(), new typeValidator_1.NumberValidator(), new typeValidator_1.BooleanValidator()])]),
		    anyFilterValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.BasicFilterValidator(), new filtersValidator_1.AdvancedFilterValidator(), new filtersValidator_1.IncludeExcludeFilterValidator(), new filtersValidator_1.NotSupportedFilterValidator(), new filtersValidator_1.RelativeDateFilterValidator(), new filtersValidator_1.TopNFilterValidator()]),
		    anyValueValidator: new anyOfValidator_1.AnyOfValidator([new typeValidator_1.StringValidator(), new typeValidator_1.NumberValidator(), new typeValidator_1.BooleanValidator()]),
		    applyBookmarkByNameRequestValidator: new bookmarkValidator_1.ApplyBookmarkByNameRequestValidator(),
		    applyBookmarkStateRequestValidator: new bookmarkValidator_1.ApplyBookmarkStateRequestValidator(),
		    applyBookmarkValidator: new anyOfValidator_1.AnyOfValidator([new bookmarkValidator_1.ApplyBookmarkByNameRequestValidator(), new bookmarkValidator_1.ApplyBookmarkStateRequestValidator()]),
		    backgroundValidator: new typeValidator_1.EnumValidator([0, 1]),
		    basicFilterTypeValidator: new typeValidator_1.EnumValidator([1]),
		    basicFilterValidator: new filtersValidator_1.BasicFilterValidator(),
		    booleanArrayValidator: new typeValidator_1.BooleanArrayValidator(),
		    booleanValidator: new typeValidator_1.BooleanValidator(),
		    commandDisplayOptionValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
		    commandExtensionSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
		    commandExtensionValidator: new extensionsValidator_1.CommandExtensionValidator(),
		    commandsSettingsArrayValidator: new typeValidator_1.ArrayValidator([new commandsSettingsValidator_1.CommandsSettingsValidator()]),
		    commandsSettingsValidator: new commandsSettingsValidator_1.CommandsSettingsValidator(),
		    conditionItemValidator: new filtersValidator_1.ConditionItemValidator(),
		    contrastModeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3, 4]),
		    customLayoutDisplayOptionValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
		    customLayoutValidator: new layoutValidator_1.CustomLayoutValidator(),
		    customPageSizeValidator: new pageValidator_1.CustomPageSizeValidator(),
		    customThemeValidator: new customThemeValidator_1.CustomThemeValidator(),
		    dashboardLoadValidator: new dashboardLoadValidator_1.DashboardLoadValidator(),
		    datasetBindingValidator: new datasetBindingValidator_1.DatasetBindingValidator(),
		    displayStateModeValidator: new typeValidator_1.EnumValidator([0, 1]),
		    displayStateValidator: new layoutValidator_1.DisplayStateValidator(),
		    exportDataRequestValidator: new exportDataValidator_1.ExportDataRequestValidator(),
		    extensionArrayValidator: new typeValidator_1.ArrayValidator([new extensionsValidator_1.ExtensionValidator()]),
		    extensionPointsValidator: new extensionsValidator_1.ExtensionPointsValidator(),
		    extensionValidator: new extensionsValidator_1.ExtensionValidator(),
		    fieldRequiredValidator: new fieldRequiredValidator_1.FieldRequiredValidator(),
		    filterColumnTargetValidator: new filtersValidator_1.FilterColumnTargetValidator(),
		    filterConditionsValidator: new typeValidator_1.ArrayValidator([new filtersValidator_1.ConditionItemValidator()]),
		    filterHierarchyTargetValidator: new filtersValidator_1.FilterHierarchyTargetValidator(),
		    filterMeasureTargetValidator: new filtersValidator_1.FilterMeasureTargetValidator(),
		    filterTargetValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.FilterColumnTargetValidator(), new filtersValidator_1.FilterHierarchyTargetValidator(), new filtersValidator_1.FilterMeasureTargetValidator()]),
		    filtersArrayValidator: new typeValidator_1.ArrayValidator([new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.BasicFilterValidator(), new filtersValidator_1.AdvancedFilterValidator(), new filtersValidator_1.RelativeDateFilterValidator()])]),
		    filtersValidator: new filtersValidator_1.FilterValidator(),
		    hyperlinkClickBehaviorValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
		    includeExcludeFilterValidator: new filtersValidator_1.IncludeExcludeFilterValidator(),
		    includeExludeFilterTypeValidator: new typeValidator_1.EnumValidator([3]),
		    layoutTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3]),
		    loadQnaValidator: new qnaValidator_1.LoadQnaValidator(),
		    menuExtensionValidator: new extensionsValidator_1.MenuExtensionValidator(),
		    menuLocationValidator: new typeValidator_1.EnumValidator([0, 1]),
		    notSupportedFilterTypeValidator: new typeValidator_1.EnumValidator([2]),
		    notSupportedFilterValidator: new filtersValidator_1.NotSupportedFilterValidator(),
		    numberArrayValidator: new typeValidator_1.NumberArrayValidator(),
		    numberValidator: new typeValidator_1.NumberValidator(),
		    pageLayoutValidator: new mapValidator_1.MapValidator([new typeValidator_1.StringValidator()], [new layoutValidator_1.VisualLayoutValidator()]),
		    pageSizeTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3, 4, 5]),
		    pageSizeValidator: new pageValidator_1.PageSizeValidator(),
		    pageValidator: new pageValidator_1.PageValidator(),
		    pageViewFieldValidator: new pageValidator_1.PageViewFieldValidator(),
		    pagesLayoutValidator: new mapValidator_1.MapValidator([new typeValidator_1.StringValidator()], [new layoutValidator_1.PageLayoutValidator()]),
		    permissionsValidator: new typeValidator_1.EnumValidator([0, 1, 2, 4, 7]),
		    playBookmarkRequestValidator: new bookmarkValidator_1.PlayBookmarkRequestValidator(),
		    qnaInterpretInputDataValidator: new qnaValidator_1.QnaInterpretInputDataValidator(),
		    qnaSettingValidator: new qnaValidator_1.QnaSettingsValidator(),
		    relativeDateFilterOperatorValidator: new typeValidator_1.EnumValidator([0, 1, 2]),
		    relativeDateFilterTimeUnitTypeValidator: new typeValidator_1.EnumValidator([0, 1, 2, 3, 4, 5, 6]),
		    relativeDateFilterTypeValidator: new typeValidator_1.EnumValidator([4]),
		    relativeDateFilterValidator: new filtersValidator_1.RelativeDateFilterValidator(),
		    reportCreateValidator: new reportCreateValidator_1.ReportCreateValidator(),
		    reportLoadValidator: new reportLoadValidator_1.ReportLoadValidator(),
		    saveAsParametersValidator: new saveAsParametersValidator_1.SaveAsParametersValidator(),
		    settingsValidator: new settingsValidator_1.SettingsValidator(),
		    singleCommandSettingsValidator: new commandsSettingsValidator_1.SingleCommandSettingsValidator(),
		    slicerSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.SlicerTargetSelectorValidator()]),
		    slicerStateValidator: new slicersValidator_1.SlicerStateValidator(),
		    slicerTargetValidator: new anyOfValidator_1.AnyOfValidator([new filtersValidator_1.FilterColumnTargetValidator(), new filtersValidator_1.FilterHierarchyTargetValidator(), new filtersValidator_1.FilterMeasureTargetValidator(), new filtersValidator_1.FilterKeyColumnsTargetValidator(), new filtersValidator_1.FilterKeyHierarchyTargetValidator()]),
		    slicerValidator: new slicersValidator_1.SlicerValidator(),
		    stringArrayValidator: new typeValidator_1.StringArrayValidator(),
		    stringValidator: new typeValidator_1.StringValidator(),
		    tileLoadValidator: new tileLoadValidator_1.TileLoadValidator(),
		    tokenTypeValidator: new typeValidator_1.EnumValidator([0, 1]),
		    topNFilterTypeValidator: new typeValidator_1.EnumValidator([5]),
		    topNFilterValidator: new filtersValidator_1.TopNFilterValidator(),
		    viewModeValidator: new typeValidator_1.EnumValidator([0, 1]),
		    visualCommandSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
		    visualHeaderSelectorValidator: new anyOfValidator_1.AnyOfValidator([new selectorsValidator_1.VisualSelectorValidator(), new selectorsValidator_1.VisualTypeSelectorValidator()]),
		    visualHeaderSettingsValidator: new visualSettingsValidator_1.VisualHeaderSettingsValidator(),
		    visualHeaderValidator: new visualSettingsValidator_1.VisualHeaderValidator(),
		    visualHeadersValidator: new typeValidator_1.ArrayValidator([new visualSettingsValidator_1.VisualHeaderValidator()]),
		    visualLayoutValidator: new layoutValidator_1.VisualLayoutValidator(),
		    visualSelectorValidator: new selectorsValidator_1.VisualSelectorValidator(),
		    visualSettingsValidator: new visualSettingsValidator_1.VisualSettingsValidator(),
		    visualTypeSelectorValidator: new selectorsValidator_1.VisualTypeSelectorValidator(),
		};


	/***/ }),
	/* 2 */
	/***/ (function(module, exports) {

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
		var ObjectValidator = /** @class */ (function () {
		    function ObjectValidator() {
		    }
		    ObjectValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        if (typeof input !== "object" || Array.isArray(input)) {
		            return [{
		                    message: field !== undefined ? field + " must be an object" : "input must be an object",
		                    path: path,
		                    keyword: "type"
		                }];
		        }
		        return null;
		    };
		    return ObjectValidator;
		}());
		exports.ObjectValidator = ObjectValidator;
		var ArrayValidator = /** @class */ (function () {
		    function ArrayValidator(itemValidators) {
		        this.itemValidators = itemValidators;
		    }
		    ArrayValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        if (!(Array.isArray(input))) {
		            return [{
		                    message: field + " property is invalid",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "type"
		                }];
		        }
		        for (var i = 0; i < input.length; i++) {
		            var fieldsPath = (path ? path + "." : "") + field + "." + i;
		            for (var _i = 0, _a = this.itemValidators; _i < _a.length; _i++) {
		                var validator = _a[_i];
		                var errors = validator.validate(input[i], fieldsPath, field);
		                if (errors) {
		                    return [{
		                            message: field + " property is invalid",
		                            path: (path ? path + "." : "") + field,
		                            keyword: "type"
		                        }];
		                }
		            }
		        }
		        return null;
		    };
		    return ArrayValidator;
		}());
		exports.ArrayValidator = ArrayValidator;
		var TypeValidator = /** @class */ (function () {
		    function TypeValidator(expectedType) {
		        this.expectedType = expectedType;
		    }
		    TypeValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        if (!(typeof input === this.expectedType)) {
		            return [{
		                    message: field + " must be a " + this.expectedType,
		                    path: (path ? path + "." : "") + field,
		                    keyword: "type"
		                }];
		        }
		        return null;
		    };
		    return TypeValidator;
		}());
		exports.TypeValidator = TypeValidator;
		var StringValidator = /** @class */ (function (_super) {
		    __extends(StringValidator, _super);
		    function StringValidator() {
		        return _super.call(this, "string") || this;
		    }
		    return StringValidator;
		}(TypeValidator));
		exports.StringValidator = StringValidator;
		var BooleanValidator = /** @class */ (function (_super) {
		    __extends(BooleanValidator, _super);
		    function BooleanValidator() {
		        return _super.call(this, "boolean") || this;
		    }
		    return BooleanValidator;
		}(TypeValidator));
		exports.BooleanValidator = BooleanValidator;
		var NumberValidator = /** @class */ (function (_super) {
		    __extends(NumberValidator, _super);
		    function NumberValidator() {
		        return _super.call(this, "number") || this;
		    }
		    return NumberValidator;
		}(TypeValidator));
		exports.NumberValidator = NumberValidator;
		var ValueValidator = /** @class */ (function () {
		    function ValueValidator(possibleValues) {
		        this.possibleValues = possibleValues;
		    }
		    ValueValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        if (this.possibleValues.indexOf(input) < 0) {
		            return [{
		                    message: field + " property is invalid",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "invalid"
		                }];
		        }
		        return null;
		    };
		    return ValueValidator;
		}());
		exports.ValueValidator = ValueValidator;
		var SchemaValidator = /** @class */ (function (_super) {
		    __extends(SchemaValidator, _super);
		    function SchemaValidator(schemaValue) {
		        var _this = _super.call(this, [schemaValue]) || this;
		        _this.schemaValue = schemaValue;
		        return _this;
		    }
		    SchemaValidator.prototype.validate = function (input, path, field) {
		        return _super.prototype.validate.call(this, input, path, field);
		    };
		    return SchemaValidator;
		}(ValueValidator));
		exports.SchemaValidator = SchemaValidator;
		var EnumValidator = /** @class */ (function (_super) {
		    __extends(EnumValidator, _super);
		    function EnumValidator(possibleValues) {
		        var _this = _super.call(this) || this;
		        _this.possibleValues = possibleValues;
		        return _this;
		    }
		    EnumValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var valueValidator = new ValueValidator(this.possibleValues);
		        return valueValidator.validate(input, path, field);
		    };
		    return EnumValidator;
		}(NumberValidator));
		exports.EnumValidator = EnumValidator;
		var StringArrayValidator = /** @class */ (function (_super) {
		    __extends(StringArrayValidator, _super);
		    function StringArrayValidator() {
		        return _super.call(this, [new StringValidator()]) || this;
		    }
		    StringArrayValidator.prototype.validate = function (input, path, field) {
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return [{
		                    message: field + " must be an array of strings",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "type"
		                }];
		        }
		        return null;
		    };
		    return StringArrayValidator;
		}(ArrayValidator));
		exports.StringArrayValidator = StringArrayValidator;
		var BooleanArrayValidator = /** @class */ (function (_super) {
		    __extends(BooleanArrayValidator, _super);
		    function BooleanArrayValidator() {
		        return _super.call(this, [new BooleanValidator()]) || this;
		    }
		    BooleanArrayValidator.prototype.validate = function (input, path, field) {
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return [{
		                    message: field + " must be an array of booleans",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "type"
		                }];
		        }
		        return null;
		    };
		    return BooleanArrayValidator;
		}(ArrayValidator));
		exports.BooleanArrayValidator = BooleanArrayValidator;
		var NumberArrayValidator = /** @class */ (function (_super) {
		    __extends(NumberArrayValidator, _super);
		    function NumberArrayValidator() {
		        return _super.call(this, [new NumberValidator()]) || this;
		    }
		    NumberArrayValidator.prototype.validate = function (input, path, field) {
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return [{
		                    message: field + " must be an array of numbers",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "type"
		                }];
		        }
		        return null;
		    };
		    return NumberArrayValidator;
		}(ArrayValidator));
		exports.NumberArrayValidator = NumberArrayValidator;


	/***/ }),
	/* 3 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var MenuExtensionValidator = /** @class */ (function (_super) {
		    __extends(MenuExtensionValidator, _super);
		    function MenuExtensionValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    MenuExtensionValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "title",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "icon",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "menuLocation",
		                validators: [validator_1.Validators.menuLocationValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return MenuExtensionValidator;
		}(typeValidator_1.ObjectValidator));
		exports.MenuExtensionValidator = MenuExtensionValidator;
		var ExtensionPointsValidator = /** @class */ (function (_super) {
		    __extends(ExtensionPointsValidator, _super);
		    function ExtensionPointsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ExtensionPointsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "visualContextMenu",
		                validators: [validator_1.Validators.menuExtensionValidator]
		            },
		            {
		                field: "visualOptionsMenu",
		                validators: [validator_1.Validators.menuExtensionValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ExtensionPointsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ExtensionPointsValidator = ExtensionPointsValidator;
		var ExtensionItemValidator = /** @class */ (function (_super) {
		    __extends(ExtensionItemValidator, _super);
		    function ExtensionItemValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ExtensionItemValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "name",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "extend",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.extensionPointsValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ExtensionItemValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ExtensionItemValidator = ExtensionItemValidator;
		var CommandExtensionValidator = /** @class */ (function (_super) {
		    __extends(CommandExtensionValidator, _super);
		    function CommandExtensionValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    CommandExtensionValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "title",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "icon",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "selector",
		                validators: [validator_1.Validators.commandExtensionSelectorValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return CommandExtensionValidator;
		}(ExtensionItemValidator));
		exports.CommandExtensionValidator = CommandExtensionValidator;
		var ExtensionValidator = /** @class */ (function (_super) {
		    __extends(ExtensionValidator, _super);
		    function ExtensionValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ExtensionValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "command",
		                validators: [validator_1.Validators.commandExtensionValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ExtensionValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ExtensionValidator = ExtensionValidator;


	/***/ }),
	/* 4 */
	/***/ (function(module, exports) {

		Object.defineProperty(exports, "__esModule", { value: true });
		var MultipleFieldsValidator = /** @class */ (function () {
		    function MultipleFieldsValidator(fieldValidatorsPairs) {
		        this.fieldValidatorsPairs = fieldValidatorsPairs;
		    }
		    MultipleFieldsValidator.prototype.validate = function (input, path, field) {
		        if (!this.fieldValidatorsPairs) {
		            return null;
		        }
		        var fieldsPath = path ? path + "." + field : field;
		        for (var _i = 0, _a = this.fieldValidatorsPairs; _i < _a.length; _i++) {
		            var fieldValidators = _a[_i];
		            for (var _b = 0, _c = fieldValidators.validators; _b < _c.length; _b++) {
		                var validator = _c[_b];
		                var errors = validator.validate(input[fieldValidators.field], fieldsPath, fieldValidators.field);
		                if (errors) {
		                    return errors;
		                }
		            }
		        }
		        return null;
		    };
		    return MultipleFieldsValidator;
		}());
		exports.MultipleFieldsValidator = MultipleFieldsValidator;


	/***/ }),
	/* 5 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var SettingsValidator = /** @class */ (function (_super) {
		    __extends(SettingsValidator, _super);
		    function SettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "filterPaneEnabled",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "navContentPaneEnabled",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "bookmarksPaneEnabled",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "useCustomSaveAsDialog",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "extensions",
		                validators: [validator_1.Validators.extensionArrayValidator]
		            },
		            {
		                field: "layoutType",
		                validators: [validator_1.Validators.layoutTypeValidator]
		            },
		            {
		                field: "customLayout",
		                validators: [validator_1.Validators.customLayoutValidator]
		            },
		            {
		                field: "background",
		                validators: [validator_1.Validators.backgroundValidator]
		            },
		            {
		                field: "visualSettings",
		                validators: [validator_1.Validators.visualSettingsValidator]
		            },
		            {
		                field: "hideErrors",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "commands",
		                validators: [validator_1.Validators.commandsSettingsArrayValidator]
		            },
		            {
		                field: "hyperlinkClickBehavior",
		                validators: [validator_1.Validators.hyperlinkClickBehaviorValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SettingsValidator = SettingsValidator;


	/***/ }),
	/* 6 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var PlayBookmarkRequestValidator = /** @class */ (function (_super) {
		    __extends(PlayBookmarkRequestValidator, _super);
		    function PlayBookmarkRequestValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    PlayBookmarkRequestValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "playMode",
		                validators: [validator_1.Validators.fieldRequiredValidator, new typeValidator_1.EnumValidator([0, 1])]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return PlayBookmarkRequestValidator;
		}(typeValidator_1.ObjectValidator));
		exports.PlayBookmarkRequestValidator = PlayBookmarkRequestValidator;
		var AddBookmarkRequestValidator = /** @class */ (function (_super) {
		    __extends(AddBookmarkRequestValidator, _super);
		    function AddBookmarkRequestValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    AddBookmarkRequestValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "state",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "displayName",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "apply",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return AddBookmarkRequestValidator;
		}(typeValidator_1.ObjectValidator));
		exports.AddBookmarkRequestValidator = AddBookmarkRequestValidator;
		var ApplyBookmarkByNameRequestValidator = /** @class */ (function (_super) {
		    __extends(ApplyBookmarkByNameRequestValidator, _super);
		    function ApplyBookmarkByNameRequestValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ApplyBookmarkByNameRequestValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "name",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ApplyBookmarkByNameRequestValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ApplyBookmarkByNameRequestValidator = ApplyBookmarkByNameRequestValidator;
		var ApplyBookmarkStateRequestValidator = /** @class */ (function (_super) {
		    __extends(ApplyBookmarkStateRequestValidator, _super);
		    function ApplyBookmarkStateRequestValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ApplyBookmarkStateRequestValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "state",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ApplyBookmarkStateRequestValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ApplyBookmarkStateRequestValidator = ApplyBookmarkStateRequestValidator;


	/***/ }),
	/* 7 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var FilterColumnTargetValidator = /** @class */ (function (_super) {
		    __extends(FilterColumnTargetValidator, _super);
		    function FilterColumnTargetValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterColumnTargetValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "table",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "column",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return FilterColumnTargetValidator;
		}(typeValidator_1.ObjectValidator));
		exports.FilterColumnTargetValidator = FilterColumnTargetValidator;
		var FilterKeyColumnsTargetValidator = /** @class */ (function (_super) {
		    __extends(FilterKeyColumnsTargetValidator, _super);
		    function FilterKeyColumnsTargetValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterKeyColumnsTargetValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "keys",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return FilterKeyColumnsTargetValidator;
		}(FilterColumnTargetValidator));
		exports.FilterKeyColumnsTargetValidator = FilterKeyColumnsTargetValidator;
		var FilterHierarchyTargetValidator = /** @class */ (function (_super) {
		    __extends(FilterHierarchyTargetValidator, _super);
		    function FilterHierarchyTargetValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterHierarchyTargetValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "table",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "hierarchy",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "hierarchyLevel",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return FilterHierarchyTargetValidator;
		}(typeValidator_1.ObjectValidator));
		exports.FilterHierarchyTargetValidator = FilterHierarchyTargetValidator;
		var FilterKeyHierarchyTargetValidator = /** @class */ (function (_super) {
		    __extends(FilterKeyHierarchyTargetValidator, _super);
		    function FilterKeyHierarchyTargetValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterKeyHierarchyTargetValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "keys",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return FilterKeyHierarchyTargetValidator;
		}(FilterHierarchyTargetValidator));
		exports.FilterKeyHierarchyTargetValidator = FilterKeyHierarchyTargetValidator;
		var FilterMeasureTargetValidator = /** @class */ (function (_super) {
		    __extends(FilterMeasureTargetValidator, _super);
		    function FilterMeasureTargetValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterMeasureTargetValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "table",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "measure",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return FilterMeasureTargetValidator;
		}(typeValidator_1.ObjectValidator));
		exports.FilterMeasureTargetValidator = FilterMeasureTargetValidator;
		var BasicFilterValidator = /** @class */ (function (_super) {
		    __extends(BasicFilterValidator, _super);
		    function BasicFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    BasicFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "operator",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "values",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.anyArrayValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.basicFilterTypeValidator]
		            },
		            {
		                field: "requireSingleSelection",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return BasicFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.BasicFilterValidator = BasicFilterValidator;
		var AdvancedFilterValidator = /** @class */ (function (_super) {
		    __extends(AdvancedFilterValidator, _super);
		    function AdvancedFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    AdvancedFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "logicalOperator",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "conditions",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterConditionsValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.advancedFilterTypeValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return AdvancedFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.AdvancedFilterValidator = AdvancedFilterValidator;
		var RelativeDateFilterValidator = /** @class */ (function (_super) {
		    __extends(RelativeDateFilterValidator, _super);
		    function RelativeDateFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    RelativeDateFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "operator",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.relativeDateFilterOperatorValidator]
		            },
		            {
		                field: "timeUnitsCount",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.numberValidator]
		            },
		            {
		                field: "timeUnitType",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.relativeDateFilterTimeUnitTypeValidator]
		            },
		            {
		                field: "includeToday",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.relativeDateFilterTypeValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return RelativeDateFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.RelativeDateFilterValidator = RelativeDateFilterValidator;
		var TopNFilterValidator = /** @class */ (function (_super) {
		    __extends(TopNFilterValidator, _super);
		    function TopNFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    TopNFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "operator",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "itemCount",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.numberValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.topNFilterTypeValidator]
		            },
		            {
		                field: "orderBy",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return TopNFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.TopNFilterValidator = TopNFilterValidator;
		var NotSupportedFilterValidator = /** @class */ (function (_super) {
		    __extends(NotSupportedFilterValidator, _super);
		    function NotSupportedFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    NotSupportedFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "message",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "notSupportedTypeName",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.notSupportedFilterTypeValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return NotSupportedFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.NotSupportedFilterValidator = NotSupportedFilterValidator;
		var IncludeExcludeFilterValidator = /** @class */ (function (_super) {
		    __extends(IncludeExcludeFilterValidator, _super);
		    function IncludeExcludeFilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    IncludeExcludeFilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.filterTargetValidator]
		            },
		            {
		                field: "isExclude",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "values",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.anyArrayValidator]
		            },
		            {
		                field: "filterType",
		                validators: [validator_1.Validators.includeExludeFilterTypeValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return IncludeExcludeFilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.IncludeExcludeFilterValidator = IncludeExcludeFilterValidator;
		var FilterValidator = /** @class */ (function (_super) {
		    __extends(FilterValidator, _super);
		    function FilterValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    FilterValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        return validator_1.Validators.anyFilterValidator.validate(input, path, field);
		    };
		    return FilterValidator;
		}(typeValidator_1.ObjectValidator));
		exports.FilterValidator = FilterValidator;
		var ConditionItemValidator = /** @class */ (function (_super) {
		    __extends(ConditionItemValidator, _super);
		    function ConditionItemValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ConditionItemValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "value",
		                validators: [validator_1.Validators.anyValueValidator]
		            },
		            {
		                field: "operator",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ConditionItemValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ConditionItemValidator = ConditionItemValidator;


	/***/ }),
	/* 8 */
	/***/ (function(module, exports) {

		Object.defineProperty(exports, "__esModule", { value: true });
		var FieldRequiredValidator = /** @class */ (function () {
		    function FieldRequiredValidator() {
		    }
		    FieldRequiredValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return [{
		                    message: field + " is required",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "required"
		                }];
		        }
		        return null;
		    };
		    return FieldRequiredValidator;
		}());
		exports.FieldRequiredValidator = FieldRequiredValidator;


	/***/ }),
	/* 9 */
	/***/ (function(module, exports) {

		Object.defineProperty(exports, "__esModule", { value: true });
		var AnyOfValidator = /** @class */ (function () {
		    function AnyOfValidator(validators) {
		        this.validators = validators;
		    }
		    AnyOfValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var valid = false;
		        for (var _i = 0, _a = this.validators; _i < _a.length; _i++) {
		            var validator = _a[_i];
		            var errors = validator.validate(input, path, field);
		            if (!errors) {
		                valid = true;
		                break;
		            }
		        }
		        if (!valid) {
		            return [{
		                    message: field + " property is invalid",
		                    path: (path ? path + "." : "") + field,
		                    keyword: "invalid"
		                }];
		        }
		        return null;
		    };
		    return AnyOfValidator;
		}());
		exports.AnyOfValidator = AnyOfValidator;


	/***/ }),
	/* 10 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var ReportLoadValidator = /** @class */ (function (_super) {
		    __extends(ReportLoadValidator, _super);
		    function ReportLoadValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ReportLoadValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "accessToken",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "id",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "groupId",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "settings",
		                validators: [validator_1.Validators.settingsValidator]
		            },
		            {
		                field: "pageName",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "filters",
		                validators: [validator_1.Validators.filtersArrayValidator]
		            },
		            {
		                field: "permissions",
		                validators: [validator_1.Validators.permissionsValidator]
		            },
		            {
		                field: "viewMode",
		                validators: [validator_1.Validators.viewModeValidator]
		            },
		            {
		                field: "tokenType",
		                validators: [validator_1.Validators.tokenTypeValidator]
		            },
		            {
		                field: "bookmark",
		                validators: [validator_1.Validators.applyBookmarkValidator]
		            },
		            {
		                field: "theme",
		                validators: [validator_1.Validators.customThemeValidator]
		            },
		            {
		                field: "embedUrl",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "datasetBinding",
		                validators: [validator_1.Validators.datasetBindingValidator]
		            },
		            {
		                field: "contrastMode",
		                validators: [validator_1.Validators.contrastModeValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ReportLoadValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ReportLoadValidator = ReportLoadValidator;


	/***/ }),
	/* 11 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var ReportCreateValidator = /** @class */ (function (_super) {
		    __extends(ReportCreateValidator, _super);
		    function ReportCreateValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ReportCreateValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "accessToken",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "datasetId",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "groupId",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "tokenType",
		                validators: [validator_1.Validators.tokenTypeValidator]
		            },
		            {
		                field: "theme",
		                validators: [validator_1.Validators.customThemeValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ReportCreateValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ReportCreateValidator = ReportCreateValidator;


	/***/ }),
	/* 12 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var DashboardLoadValidator = /** @class */ (function (_super) {
		    __extends(DashboardLoadValidator, _super);
		    function DashboardLoadValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    DashboardLoadValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "accessToken",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "id",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "groupId",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "pageView",
		                validators: [validator_1.Validators.pageViewFieldValidator]
		            },
		            {
		                field: "tokenType",
		                validators: [validator_1.Validators.tokenTypeValidator]
		            },
		            {
		                field: "embedUrl",
		                validators: [validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return DashboardLoadValidator;
		}(typeValidator_1.ObjectValidator));
		exports.DashboardLoadValidator = DashboardLoadValidator;


	/***/ }),
	/* 13 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var TileLoadValidator = /** @class */ (function (_super) {
		    __extends(TileLoadValidator, _super);
		    function TileLoadValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    TileLoadValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "accessToken",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "id",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "dashboardId",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "groupId",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "pageView",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "tokenType",
		                validators: [validator_1.Validators.tokenTypeValidator]
		            },
		            {
		                field: "width",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "height",
		                validators: [validator_1.Validators.numberValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return TileLoadValidator;
		}(typeValidator_1.ObjectValidator));
		exports.TileLoadValidator = TileLoadValidator;


	/***/ }),
	/* 14 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var PageSizeValidator = /** @class */ (function (_super) {
		    __extends(PageSizeValidator, _super);
		    function PageSizeValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    PageSizeValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "type",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.pageSizeTypeValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return PageSizeValidator;
		}(typeValidator_1.ObjectValidator));
		exports.PageSizeValidator = PageSizeValidator;
		var CustomPageSizeValidator = /** @class */ (function (_super) {
		    __extends(CustomPageSizeValidator, _super);
		    function CustomPageSizeValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    CustomPageSizeValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "width",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "height",
		                validators: [validator_1.Validators.numberValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return CustomPageSizeValidator;
		}(PageSizeValidator));
		exports.CustomPageSizeValidator = CustomPageSizeValidator;
		var PageValidator = /** @class */ (function (_super) {
		    __extends(PageValidator, _super);
		    function PageValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    PageValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "name",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return PageValidator;
		}(typeValidator_1.ObjectValidator));
		exports.PageValidator = PageValidator;
		var PageViewFieldValidator = /** @class */ (function (_super) {
		    __extends(PageViewFieldValidator, _super);
		    function PageViewFieldValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    PageViewFieldValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var possibleValues = ["actualSize", "fitToWidth", "oneColumn"];
		        if (possibleValues.indexOf(input) < 0) {
		            return [{
		                    message: "pageView must be a string with one of the following values: \"actualSize\", \"fitToWidth\", \"oneColumn\""
		                }];
		        }
		        return null;
		    };
		    return PageViewFieldValidator;
		}(typeValidator_1.StringValidator));
		exports.PageViewFieldValidator = PageViewFieldValidator;


	/***/ }),
	/* 15 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var LoadQnaValidator = /** @class */ (function (_super) {
		    __extends(LoadQnaValidator, _super);
		    function LoadQnaValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    LoadQnaValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "accessToken",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		            {
		                field: "datasetIds",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringArrayValidator]
		            },
		            {
		                field: "question",
		                validators: [validator_1.Validators.stringValidator]
		            },
		            {
		                field: "viewMode",
		                validators: [validator_1.Validators.viewModeValidator]
		            },
		            {
		                field: "settings",
		                validators: [validator_1.Validators.qnaSettingValidator]
		            },
		            {
		                field: "tokenType",
		                validators: [validator_1.Validators.tokenTypeValidator]
		            },
		            {
		                field: "groupId",
		                validators: [validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return LoadQnaValidator;
		}(typeValidator_1.ObjectValidator));
		exports.LoadQnaValidator = LoadQnaValidator;
		var QnaSettingsValidator = /** @class */ (function (_super) {
		    __extends(QnaSettingsValidator, _super);
		    function QnaSettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    QnaSettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "filterPaneEnabled",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		            {
		                field: "hideErrors",
		                validators: [validator_1.Validators.booleanValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return QnaSettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.QnaSettingsValidator = QnaSettingsValidator;
		var QnaInterpretInputDataValidator = /** @class */ (function (_super) {
		    __extends(QnaInterpretInputDataValidator, _super);
		    function QnaInterpretInputDataValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    QnaInterpretInputDataValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "datasetIds",
		                validators: [validator_1.Validators.stringArrayValidator]
		            },
		            {
		                field: "question",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return QnaInterpretInputDataValidator;
		}(typeValidator_1.ObjectValidator));
		exports.QnaInterpretInputDataValidator = QnaInterpretInputDataValidator;


	/***/ }),
	/* 16 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var SaveAsParametersValidator = /** @class */ (function (_super) {
		    __extends(SaveAsParametersValidator, _super);
		    function SaveAsParametersValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SaveAsParametersValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "name",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SaveAsParametersValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SaveAsParametersValidator = SaveAsParametersValidator;


	/***/ }),
	/* 17 */
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
		var typeValidator_1 = __webpack_require__(2);
		var MapValidator = /** @class */ (function (_super) {
		    __extends(MapValidator, _super);
		    function MapValidator(keyValidators, valueValidators) {
		        var _this = _super.call(this) || this;
		        _this.keyValidators = keyValidators;
		        _this.valueValidators = valueValidators;
		        return _this;
		    }
		    MapValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        for (var key in input) {
		            if (input.hasOwnProperty(key)) {
		                var fieldsPath = (path ? path + "." : "") + field + "." + key;
		                for (var _i = 0, _a = this.keyValidators; _i < _a.length; _i++) {
		                    var keyValidator = _a[_i];
		                    errors = keyValidator.validate(key, fieldsPath, field);
		                    if (errors) {
		                        return errors;
		                    }
		                }
		                for (var _b = 0, _c = this.valueValidators; _b < _c.length; _b++) {
		                    var valueValidator = _c[_b];
		                    errors = valueValidator.validate(input[key], fieldsPath, field);
		                    if (errors) {
		                        return errors;
		                    }
		                }
		            }
		        }
		        return null;
		    };
		    return MapValidator;
		}(typeValidator_1.ObjectValidator));
		exports.MapValidator = MapValidator;


	/***/ }),
	/* 18 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var CustomLayoutValidator = /** @class */ (function (_super) {
		    __extends(CustomLayoutValidator, _super);
		    function CustomLayoutValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    CustomLayoutValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "pageSize",
		                validators: [validator_1.Validators.pageSizeValidator]
		            },
		            {
		                field: "displayOption",
		                validators: [validator_1.Validators.customLayoutDisplayOptionValidator]
		            },
		            {
		                field: "pagesLayout",
		                validators: [validator_1.Validators.pagesLayoutValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return CustomLayoutValidator;
		}(typeValidator_1.ObjectValidator));
		exports.CustomLayoutValidator = CustomLayoutValidator;
		var VisualLayoutValidator = /** @class */ (function (_super) {
		    __extends(VisualLayoutValidator, _super);
		    function VisualLayoutValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualLayoutValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "x",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "y",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "z",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "width",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "height",
		                validators: [validator_1.Validators.numberValidator]
		            },
		            {
		                field: "displayState",
		                validators: [validator_1.Validators.displayStateValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualLayoutValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualLayoutValidator = VisualLayoutValidator;
		var DisplayStateValidator = /** @class */ (function (_super) {
		    __extends(DisplayStateValidator, _super);
		    function DisplayStateValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    DisplayStateValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "mode",
		                validators: [validator_1.Validators.displayStateModeValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return DisplayStateValidator;
		}(typeValidator_1.ObjectValidator));
		exports.DisplayStateValidator = DisplayStateValidator;
		var PageLayoutValidator = /** @class */ (function (_super) {
		    __extends(PageLayoutValidator, _super);
		    function PageLayoutValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    PageLayoutValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "visualsLayout",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.pageLayoutValidator]
		            },
		            {
		                field: "defaultLayout",
		                validators: [validator_1.Validators.visualLayoutValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return PageLayoutValidator;
		}(typeValidator_1.ObjectValidator));
		exports.PageLayoutValidator = PageLayoutValidator;


	/***/ }),
	/* 19 */
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
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var ExportDataRequestValidator = /** @class */ (function (_super) {
		    __extends(ExportDataRequestValidator, _super);
		    function ExportDataRequestValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    ExportDataRequestValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "rows",
		                validators: [new typeValidator_1.NumberValidator()]
		            },
		            {
		                field: "exportDataType",
		                validators: [new typeValidator_1.EnumValidator([0, 1])]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return ExportDataRequestValidator;
		}(typeValidator_1.ObjectValidator));
		exports.ExportDataRequestValidator = ExportDataRequestValidator;


	/***/ }),
	/* 20 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var typeValidator_2 = __webpack_require__(2);
		var VisualSelectorValidator = /** @class */ (function (_super) {
		    __extends(VisualSelectorValidator, _super);
		    function VisualSelectorValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualSelectorValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                // Not required for this selector only - Backward compatibility
		                field: "$schema",
		                validators: [validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#visualSelector")]
		            },
		            {
		                field: "visualName",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualSelectorValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualSelectorValidator = VisualSelectorValidator;
		var VisualTypeSelectorValidator = /** @class */ (function (_super) {
		    __extends(VisualTypeSelectorValidator, _super);
		    function VisualTypeSelectorValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualTypeSelectorValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "$schema",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#visualTypeSelector")]
		            },
		            {
		                field: "visualType",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualTypeSelectorValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualTypeSelectorValidator = VisualTypeSelectorValidator;
		var SlicerTargetSelectorValidator = /** @class */ (function (_super) {
		    __extends(SlicerTargetSelectorValidator, _super);
		    function SlicerTargetSelectorValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SlicerTargetSelectorValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "$schema",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator, new typeValidator_2.SchemaValidator("http://powerbi.com/product/schema#slicerTargetSelector")]
		            },
		            {
		                field: "target",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerTargetValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SlicerTargetSelectorValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SlicerTargetSelectorValidator = SlicerTargetSelectorValidator;


	/***/ }),
	/* 21 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var SlicerValidator = /** @class */ (function (_super) {
		    __extends(SlicerValidator, _super);
		    function SlicerValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SlicerValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "selector",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerSelectorValidator]
		            },
		            {
		                field: "state",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.slicerStateValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SlicerValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SlicerValidator = SlicerValidator;
		var SlicerStateValidator = /** @class */ (function (_super) {
		    __extends(SlicerStateValidator, _super);
		    function SlicerStateValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SlicerStateValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "filters",
		                validators: [validator_1.Validators.filtersArrayValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SlicerStateValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SlicerStateValidator = SlicerStateValidator;


	/***/ }),
	/* 22 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var VisualSettingsValidator = /** @class */ (function (_super) {
		    __extends(VisualSettingsValidator, _super);
		    function VisualSettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualSettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "visualHeaders",
		                validators: [validator_1.Validators.visualHeadersValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualSettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualSettingsValidator = VisualSettingsValidator;
		var VisualHeaderSettingsValidator = /** @class */ (function (_super) {
		    __extends(VisualHeaderSettingsValidator, _super);
		    function VisualHeaderSettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualHeaderSettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "visible",
		                validators: [validator_1.Validators.booleanValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualHeaderSettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualHeaderSettingsValidator = VisualHeaderSettingsValidator;
		var VisualHeaderValidator = /** @class */ (function (_super) {
		    __extends(VisualHeaderValidator, _super);
		    function VisualHeaderValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    VisualHeaderValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "settings",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.visualHeaderSettingsValidator]
		            },
		            {
		                field: "selector",
		                validators: [validator_1.Validators.visualHeaderSelectorValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return VisualHeaderValidator;
		}(typeValidator_1.ObjectValidator));
		exports.VisualHeaderValidator = VisualHeaderValidator;


	/***/ }),
	/* 23 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var CommandsSettingsValidator = /** @class */ (function (_super) {
		    __extends(CommandsSettingsValidator, _super);
		    function CommandsSettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    CommandsSettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "copy",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "drill",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "drillthrough",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "expandCollapse",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "exportData",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "includeExclude",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "removeVisual",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "search",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "seeData",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "sort",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		            {
		                field: "spotlight",
		                validators: [validator_1.Validators.singleCommandSettingsValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return CommandsSettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.CommandsSettingsValidator = CommandsSettingsValidator;
		var SingleCommandSettingsValidator = /** @class */ (function (_super) {
		    __extends(SingleCommandSettingsValidator, _super);
		    function SingleCommandSettingsValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    SingleCommandSettingsValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "displayOption",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.commandDisplayOptionValidator]
		            },
		            {
		                field: "selector",
		                validators: [validator_1.Validators.visualCommandSelectorValidator]
		            },
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return SingleCommandSettingsValidator;
		}(typeValidator_1.ObjectValidator));
		exports.SingleCommandSettingsValidator = SingleCommandSettingsValidator;


	/***/ }),
	/* 24 */
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
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var CustomThemeValidator = /** @class */ (function (_super) {
		    __extends(CustomThemeValidator, _super);
		    function CustomThemeValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    CustomThemeValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "themeJson",
		                validators: [new typeValidator_1.ObjectValidator()]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return CustomThemeValidator;
		}(typeValidator_1.ObjectValidator));
		exports.CustomThemeValidator = CustomThemeValidator;


	/***/ }),
	/* 25 */
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
		var validator_1 = __webpack_require__(1);
		var multipleFieldsValidator_1 = __webpack_require__(4);
		var typeValidator_1 = __webpack_require__(2);
		var DatasetBindingValidator = /** @class */ (function (_super) {
		    __extends(DatasetBindingValidator, _super);
		    function DatasetBindingValidator() {
		        return _super !== null && _super.apply(this, arguments) || this;
		    }
		    DatasetBindingValidator.prototype.validate = function (input, path, field) {
		        if (input == null) {
		            return null;
		        }
		        var errors = _super.prototype.validate.call(this, input, path, field);
		        if (errors) {
		            return errors;
		        }
		        var fields = [
		            {
		                field: "datasetId",
		                validators: [validator_1.Validators.fieldRequiredValidator, validator_1.Validators.stringValidator]
		            }
		        ];
		        var multipleFieldsValidator = new multipleFieldsValidator_1.MultipleFieldsValidator(fields);
		        return multipleFieldsValidator.validate(input, path, field);
		    };
		    return DatasetBindingValidator;
		}(typeValidator_1.ObjectValidator));
		exports.DatasetBindingValidator = DatasetBindingValidator;


	/***/ })
	/******/ ])
	});
	;
	//# sourceMappingURL=models.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	exports.APINotSupportedForRDLError = "This API is currently not supported for RDL reports";
	exports.EmbedUrlNotSupported = "Embed URL is invalid for this scenario. Please use Power BI REST APIs to get the valid URL";


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var embed = __webpack_require__(2);
	var models = __webpack_require__(5);
	var utils = __webpack_require__(3);
	var errors = __webpack_require__(6);
	var page_1 = __webpack_require__(8);
	var defaults_1 = __webpack_require__(10);
	var bookmarksManager_1 = __webpack_require__(11);
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
	    function Report(service, element, baseConfig, phasedRender, isBootstrap, iframe) {
	        var config = baseConfig;
	        _super.call(this, service, element, config, iframe, phasedRender, isBootstrap);
	        this.loadPath = "/report/load";
	        this.phasedLoadPath = "/report/prepare";
	        Array.prototype.push.apply(this.allowedEvents, Report.allowedEvents);
	        this.bookmarksManager = new bookmarksManager_1.BookmarksManager(service, config, this.iframe);
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
	     * Render a preloaded report, using phased embedding API
	     *
	     * ```javascript
	     * // Load report
	     * var report = powerbi.load(element, config);
	     *
	     * ...
	     *
	     * // Render report
	     * report.render()
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    Report.prototype.render = function (config) {
	        return this.service.hpm.post("/report/render", config, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
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
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
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
	        var config = this.config;
	        var reportId = config.id || this.element.getAttribute(Report.reportIdAttribute) || Report.findIdFromEmbedUrl(config.embedUrl);
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
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.service.hpm.get('/report/pages', { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body
	                .map(function (page) {
	                return new page_1.Page(_this, page.name, page.displayName, page.isActive, page.visibility, page.defaultSize, page.defaultDisplayOption);
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
	     * @param {boolean} [isActive]
	     * @returns {Page}
	     */
	    Report.prototype.page = function (name, displayName, isActive, visibility) {
	        return new page_1.Page(this, name, displayName, isActive, visibility);
	    };
	    /**
	     * Prints the active page of the report by invoking `window.print()` on the embed iframe component.
	     */
	    Report.prototype.print = function () {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
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
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
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
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        var page = {
	            name: pageName,
	            displayName: null,
	            isActive: true
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
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
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
	        if (utils.isRDLEmbed(this.config.embedUrl) && settings.customLayout != null) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
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
	     * Handle config changes.
	     *
	     * @returns {void}
	     */
	    Report.prototype.configChanged = function (isBootstrap) {
	        var config = this.config;
	        if (this.isMobileSettings(config.settings))
	            config.embedUrl = utils.addParamToUrl(config.embedUrl, "isMobile", "true");
	        // Calculate settings from HTML element attributes if available.
	        var filterPaneEnabledAttribute = this.element.getAttribute(Report.filterPaneEnabledAttribute);
	        var navContentPaneEnabledAttribute = this.element.getAttribute(Report.navContentPaneEnabledAttribute);
	        var elementAttrSettings = {
	            filterPaneEnabled: (filterPaneEnabledAttribute == null) ? defaults_1.Defaults.defaultSettings.filterPaneEnabled : (filterPaneEnabledAttribute !== "false"),
	            navContentPaneEnabled: (navContentPaneEnabledAttribute == null) ? defaults_1.Defaults.defaultSettings.navContentPaneEnabled : (navContentPaneEnabledAttribute !== "false")
	        };
	        // Set the settings back into the config.
	        this.config.settings = utils.assign({}, elementAttrSettings, config.settings);
	        if (isBootstrap) {
	            return;
	        }
	        config.id = this.getId();
	    };
	    Report.prototype.getDefaultEmbedUrlEndpoint = function () {
	        return "reportEmbed";
	    };
	    /**
	     * Switch Report view mode.
	     *
	     * @returns {Promise<void>}
	     */
	    Report.prototype.switchMode = function (viewMode) {
	        var newMode;
	        if (typeof viewMode === "string") {
	            newMode = viewMode;
	        }
	        else {
	            newMode = this.viewModeToString(viewMode);
	        }
	        var url = '/report/switchMode/' + newMode;
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
	    /**
	     * checks if the report is saved.
	     *
	     * ```javascript
	     * report.isSaved()
	     * ```
	     *
	     * @returns {Promise<boolean>}
	     */
	    Report.prototype.isSaved = function () {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return utils.isSavedInternal(this.service.hpm, this.config.uniqueId, this.iframe.contentWindow);
	    };
	    /**
	     * Apply a theme to the report
	     *
	     * ```javascript
	     * report.applyTheme(theme);
	     * ```
	     */
	    Report.prototype.applyTheme = function (theme) {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.applyThemeInternal(theme);
	    };
	    /**
	    * Reset and apply the default theme of the report
	    *
	    * ```javascript
	    * report.resetTheme();
	    * ```
	    */
	    Report.prototype.resetTheme = function () {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.applyThemeInternal({});
	    };
	    Report.prototype.applyThemeInternal = function (theme) {
	        return this.service.hpm.put('/report/theme', theme, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) {
	            return response.body;
	        })
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    Report.prototype.viewModeToString = function (viewMode) {
	        var mode;
	        switch (viewMode) {
	            case models.ViewMode.Edit:
	                mode = "edit";
	                break;
	            case models.ViewMode.View:
	                mode = "view";
	                break;
	        }
	        return mode;
	    };
	    Report.prototype.isMobileSettings = function (settings) {
	        return settings && (settings.layoutType === models.LayoutType.MobileLandscape || settings.layoutType === models.LayoutType.MobilePortrait);
	    };
	    Report.allowedEvents = ["filtersApplied", "pageChanged", "commandTriggered", "swipeStart", "swipeEnd", "bookmarkApplied", "dataHyperlinkClicked"];
	    Report.reportIdAttribute = 'powerbi-report-id';
	    Report.filterPaneEnabledAttribute = 'powerbi-settings-filter-pane-enabled';
	    Report.navContentPaneEnabledAttribute = 'powerbi-settings-nav-content-pane-enabled';
	    Report.typeAttribute = 'powerbi-type';
	    Report.type = "Report";
	    return Report;
	}(embed.Embed));
	exports.Report = Report;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var visualDescriptor_1 = __webpack_require__(9);
	var models = __webpack_require__(5);
	var utils = __webpack_require__(3);
	var errors = __webpack_require__(6);
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
	     * @param {boolean} [isActivePage]
	     * @param {models.SectionVisibility} [visibility]
	     */
	    function Page(report, name, displayName, isActivePage, visibility, defaultSize, defaultDisplayOption) {
	        this.report = report;
	        this.name = name;
	        this.displayName = displayName;
	        this.isActive = isActivePage;
	        this.visibility = visibility;
	        this.defaultSize = defaultSize;
	        this.defaultDisplayOption = defaultDisplayOption;
	    }
	    /**
	     * Gets all page level filters within the report.
	     *
	     * ```javascript
	     * page.getFilters()
	     *  .then(filters => { ... });
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
	            displayName: null,
	            isActive: true
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
	    /**
	     * Gets all the visuals on the page.
	     *
	     * ```javascript
	     * page.getVisuals()
	     *   .then(visuals => { ... });
	     * ```
	     *
	     * @returns {Promise<VisualDescriptor[]>}
	     */
	    Page.prototype.getVisuals = function () {
	        var _this = this;
	        if (utils.isRDLEmbed(this.report.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.report.service.hpm.get("/report/pages/" + this.name + "/visuals", { uid: this.report.config.uniqueId }, this.report.iframe.contentWindow)
	            .then(function (response) {
	            return response.body
	                .map(function (visual) {
	                return new visualDescriptor_1.VisualDescriptor(_this, visual.name, visual.title, visual.type, visual.layout);
	            });
	        }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Checks if page has layout.
	     *
	     * ```javascript
	     * page.hasLayout(layoutType)
	     *  .then(hasLayout: boolean => { ... });
	     * ```
	     *
	     * @returns {(Promise<boolean>)}
	     */
	    Page.prototype.hasLayout = function (layoutType) {
	        if (utils.isRDLEmbed(this.report.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        var layoutTypeEnum = models.LayoutType[layoutType];
	        return this.report.service.hpm.get("/report/pages/" + this.name + "/layoutTypes/" + layoutTypeEnum, { uid: this.report.config.uniqueId }, this.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    return Page;
	}());
	exports.Page = Page;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * A Power BI visual within a page
	 *
	 * @export
	 * @class VisualDescriptor
	 * @implements {IVisualNode}
	 */
	var VisualDescriptor = (function () {
	    function VisualDescriptor(page, name, title, type, layout) {
	        this.name = name;
	        this.title = title;
	        this.type = type;
	        this.layout = layout;
	        this.page = page;
	    }
	    /**
	     * Gets all visual level filters of the current visual.
	     *
	     * ```javascript
	     * visual.getFilters()
	     *  .then(filters => { ... });
	     * ```
	     *
	     * @returns {(Promise<models.IFilter[]>)}
	     */
	    VisualDescriptor.prototype.getFilters = function () {
	        return this.page.report.service.hpm.get("/report/pages/" + this.page.name + "/visuals/" + this.name + "/filters", { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Removes all filters from the current visual.
	     *
	     * ```javascript
	     * visual.removeFilters();
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    VisualDescriptor.prototype.removeFilters = function () {
	        return this.setFilters([]);
	    };
	    /**
	     * Sets the filters on the current visual to 'filters'.
	     *
	     * ```javascript
	     * visual.setFilters(filters);
	     *   .catch(errors => { ... });
	     * ```
	     *
	     * @param {(models.IFilter[])} filters
	     * @returns {Promise<void>}
	     */
	    VisualDescriptor.prototype.setFilters = function (filters) {
	        return this.page.report.service.hpm.put("/report/pages/" + this.page.name + "/visuals/" + this.name + "/filters", filters, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Exports Visual data.
	     * Can export up to 30K rows.
	     * @param rows: Optional. Default value is 30K, maximum value is 30K as well.
	     * @param exportDataType: Optional. Default is models.ExportDataType.Summarized.
	     * ```javascript
	     * visual.exportData()
	     *  .then(data => { ... });
	     * ```
	     *
	     * @returns {(Promise<models.ExportDataType>)}
	     */
	    VisualDescriptor.prototype.exportData = function (exportDataType, rows) {
	        var exportDataRequestBody = {
	            rows: rows,
	            exportDataType: exportDataType
	        };
	        return this.page.report.service.hpm.post("/report/pages/" + this.page.name + "/visuals/" + this.name + "/exportData", exportDataRequestBody, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Set slicer state.
	     * Works only for visuals of type slicer.
	     * @param state: A new state which contains the slicer filters.
	     * ```javascript
	     * visual.setSlicerState()
	     *  .then(() => { ... });
	     * ```
	     */
	    VisualDescriptor.prototype.setSlicerState = function (state) {
	        return this.page.report.service.hpm.put("/report/pages/" + this.page.name + "/visuals/" + this.name + "/slicer", state, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Get slicer state.
	     * Works only for visuals of type slicer.
	     *
	     * ```javascript
	     * visual.getSlicerState()
	     *  .then(state => { ... });
	     * ```
	     *
	     * @returns {(Promise<models.ISlicerState>)}
	     */
	    VisualDescriptor.prototype.getSlicerState = function () {
	        return this.page.report.service.hpm.get("/report/pages/" + this.page.name + "/visuals/" + this.name + "/slicer", { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Clone existing visual to a new instance.
	     *
	     * @returns {(Promise<models.ICloneVisualResponse>)}
	     */
	    VisualDescriptor.prototype.clone = function (request) {
	        if (request === void 0) { request = {}; }
	        return this.page.report.service.hpm.post("/report/pages/" + this.page.name + "/visuals/" + this.name + "/clone", request, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Sort a visual by dataField and direction.
	     *
	     * @param request: Sort by visual request.
	     *
	     * ```javascript
	     * visual.sortBy(request)
	     *  .then(() => { ... });
	     * ```
	     */
	    VisualDescriptor.prototype.sortBy = function (request) {
	        return this.page.report.service.hpm.put("/report/pages/" + this.page.name + "/visuals/" + this.name + "/sortBy", request, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    return VisualDescriptor;
	}());
	exports.VisualDescriptor = VisualDescriptor;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var Defaults = (function () {
	    function Defaults() {
	    }
	    Defaults.defaultSettings = {
	        filterPaneEnabled: true
	    };
	    Defaults.defaultQnaSettings = {
	        filterPaneEnabled: false
	    };
	    return Defaults;
	}());
	exports.Defaults = Defaults;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(3);
	var errors = __webpack_require__(6);
	/**
	 * Manages report bookmarks.
	 *
	 * @export
	 * @class BookmarksManager
	 * @implements {IBookmarksManager}
	 */
	var BookmarksManager = (function () {
	    function BookmarksManager(service, config, iframe) {
	        this.service = service;
	        this.config = config;
	        this.iframe = iframe;
	    }
	    /**
	     * Gets bookmarks that are defined in the report.
	     *
	     * ```javascript
	     * // Gets bookmarks that are defined in the report
	     * bookmarksManager.getBookmarks()
	     *   .then(bookmarks => {
	     *     ...
	     *   });
	     * ```
	     *
	     * @returns {Promise<models.IReportBookmark[]>}
	     */
	    BookmarksManager.prototype.getBookmarks = function () {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.service.hpm.get("/report/bookmarks", { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Apply bookmark By name.
	     *
	     * ```javascript
	     * bookmarksManager.apply(bookmarkName)
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    BookmarksManager.prototype.apply = function (bookmarkName) {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        var request = {
	            name: bookmarkName
	        };
	        return this.service.hpm.post("/report/bookmarks/applyByName", request, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Play bookmarks: Enter or Exit bookmarks presentation mode.
	     *
	     * ```javascript
	     * // Enter presentation mode.
	     * bookmarksManager.play(true)
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    BookmarksManager.prototype.play = function (playMode) {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        var playBookmarkRequest = {
	            playMode: playMode
	        };
	        return this.service.hpm.post("/report/bookmarks/play", playBookmarkRequest, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Capture bookmark from current state.
	     *
	     * ```javascript
	     * bookmarksManager.capture()
	     * ```
	     *
	     * @returns {Promise<models.IReportBookmark>}
	     */
	    BookmarksManager.prototype.capture = function () {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        return this.service.hpm.post("/report/bookmarks/capture", null, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Apply bookmark state.
	     *
	     * ```javascript
	     * bookmarksManager.applyState(bookmarkName)
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    BookmarksManager.prototype.applyState = function (state) {
	        if (utils.isRDLEmbed(this.config.embedUrl)) {
	            return Promise.reject(errors.APINotSupportedForRDLError);
	        }
	        var request = {
	            state: state
	        };
	        return this.service.hpm.post("/report/bookmarks/applyState", request, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    return BookmarksManager;
	}());
	exports.BookmarksManager = BookmarksManager;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var models = __webpack_require__(5);
	var embed = __webpack_require__(2);
	var utils = __webpack_require__(3);
	var Create = (function (_super) {
	    __extends(Create, _super);
	    function Create(service, element, config, phasedRender, isBootstrap) {
	        _super.call(this, service, element, config, /* iframe */ undefined, phasedRender, isBootstrap);
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
	     * Handle config changes.
	     *
	     * @returns {void}
	     */
	    Create.prototype.configChanged = function (isBootstrap) {
	        if (isBootstrap) {
	            return;
	        }
	        var config = this.config;
	        this.createConfig = {
	            accessToken: config.accessToken,
	            datasetId: config.datasetId || this.getId(),
	            groupId: config.groupId,
	            settings: config.settings,
	            tokenType: config.tokenType,
	            theme: config.theme
	        };
	    };
	    Create.prototype.getDefaultEmbedUrlEndpoint = function () {
	        return "reportEmbed";
	    };
	    /**
	     * checks if the report is saved.
	     *
	     * ```javascript
	     * report.isSaved()
	     * ```
	     *
	     * @returns {Promise<boolean>}
	     */
	    Create.prototype.isSaved = function () {
	        return utils.isSavedInternal(this.service.hpm, this.config.uniqueId, this.iframe.contentWindow);
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
/* 13 */
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
	    function Dashboard(service, element, config, phasedRender, isBootstrap) {
	        _super.call(this, service, element, config, /* iframe */ undefined, phasedRender, isBootstrap);
	        this.loadPath = "/dashboard/load";
	        this.phasedLoadPath = "/dashboard/prepare";
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
	        var config = this.config;
	        var dashboardId = config.id || this.element.getAttribute(Dashboard.dashboardIdAttribute) || Dashboard.findIdFromEmbedUrl(config.embedUrl);
	        if (typeof dashboardId !== 'string' || dashboardId.length === 0) {
	            throw new Error("Dashboard id is required, but it was not found. You must provide an id either as part of embed configuration or as attribute '" + Dashboard.dashboardIdAttribute + "'.");
	        }
	        return dashboardId;
	    };
	    /**
	     * Validate load configuration.
	     */
	    Dashboard.prototype.validate = function (baseConfig) {
	        var config = baseConfig;
	        var error = models.validateDashboardLoad(config);
	        return error ? error : this.ValidatePageView(config.pageView);
	    };
	    /**
	     * Handle config changes.
	     *
	     * @returns {void}
	     */
	    Dashboard.prototype.configChanged = function (isBootstrap) {
	        if (isBootstrap) {
	            return;
	        }
	        // Populate dashboard id into config object.
	        this.config.id = this.getId();
	    };
	    Dashboard.prototype.getDefaultEmbedUrlEndpoint = function () {
	        return "dashboardEmbed";
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var models = __webpack_require__(5);
	var embed = __webpack_require__(2);
	/**
	 * The Power BI tile embed component
	 *
	 * @export
	 * @class Tile
	 * @extends {Embed}
	 */
	var Tile = (function (_super) {
	    __extends(Tile, _super);
	    function Tile(service, element, baseConfig, phasedRender, isBootstrap) {
	        var config = baseConfig;
	        _super.call(this, service, element, config, /* iframe */ undefined, phasedRender, isBootstrap);
	        this.loadPath = "/tile/load";
	        Array.prototype.push.apply(this.allowedEvents, Tile.allowedEvents);
	    }
	    /**
	     * The ID of the tile
	     *
	     * @returns {string}
	     */
	    Tile.prototype.getId = function () {
	        var config = this.config;
	        var tileId = config.id || Tile.findIdFromEmbedUrl(this.config.embedUrl);
	        if (typeof tileId !== 'string' || tileId.length === 0) {
	            throw new Error("Tile id is required, but it was not found. You must provide an id either as part of embed configuration.");
	        }
	        return tileId;
	    };
	    /**
	     * Validate load configuration.
	     */
	    Tile.prototype.validate = function (config) {
	        var embedConfig = config;
	        return models.validateTileLoad(embedConfig);
	    };
	    /**
	     * Handle config changes.
	     *
	     * @returns {void}
	     */
	    Tile.prototype.configChanged = function (isBootstrap) {
	        if (isBootstrap) {
	            return;
	        }
	        // Populate tile id into config object.
	        this.config.id = this.getId();
	    };
	    Tile.prototype.getDefaultEmbedUrlEndpoint = function () {
	        return "tileEmbed";
	    };
	    /**
	     * Adds the ability to get tileId from url.
	     * By extracting the ID we can ensure that the ID is always explicitly provided as part of the load configuration.
	     *
	     * @static
	     * @param {string} url
	     * @returns {string}
	     */
	    Tile.findIdFromEmbedUrl = function (url) {
	        var tileIdRegEx = /tileId="?([^&]+)"?/;
	        var tileIdMatch = url.match(tileIdRegEx);
	        var tileId;
	        if (tileIdMatch) {
	            tileId = tileIdMatch[1];
	        }
	        return tileId;
	    };
	    Tile.type = "Tile";
	    Tile.allowedEvents = ["tileClicked", "tileLoaded"];
	    return Tile;
	}(embed.Embed));
	exports.Tile = Tile;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var models = __webpack_require__(5);
	var embed = __webpack_require__(2);
	/**
	 * The Power BI Qna embed component
	 *
	 * @export
	 * @class Qna
	 * @extends {Embed}
	 */
	var Qna = (function (_super) {
	    __extends(Qna, _super);
	    function Qna(service, element, config, phasedRender, isBootstrap) {
	        _super.call(this, service, element, config, /* iframe */ undefined, phasedRender, isBootstrap);
	        this.loadPath = "/qna/load";
	        this.phasedLoadPath = "/qna/prepare";
	        Array.prototype.push.apply(this.allowedEvents, Qna.allowedEvents);
	    }
	    /**
	     * The ID of the Qna embed component
	     *
	     * @returns {string}
	     */
	    Qna.prototype.getId = function () {
	        return null;
	    };
	    /**
	     * Change the question of the Q&A embed component
	     *
	     * @param question - question which will render Q&A data
	     * @returns {string}
	     */
	    Qna.prototype.setQuestion = function (question) {
	        var qnaData = {
	            question: question
	        };
	        return this.service.hpm.post('/qna/interpret', qnaData, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Handle config changes.
	     *
	     * @returns {void}
	     */
	    Qna.prototype.configChanged = function (isBootstrap) {
	        // Nothing to do in qna embed.
	    };
	    Qna.prototype.getDefaultEmbedUrlEndpoint = function () {
	        return "qnaEmbed";
	    };
	    /**
	     * Validate load configuration.
	     */
	    Qna.prototype.validate = function (config) {
	        return models.validateLoadQnaConfiguration(config);
	    };
	    Qna.type = "Qna";
	    Qna.allowedEvents = ["loaded", "visualRendered"];
	    return Qna;
	}(embed.Embed));
	exports.Qna = Qna;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var models = __webpack_require__(5);
	var report_1 = __webpack_require__(7);
	/**
	 * The Power BI Visual embed component
	 *
	 * @export
	 * @class Visual
	 */
	var Visual = (function (_super) {
	    __extends(Visual, _super);
	    /**
	     * Creates an instance of a Power BI Single Visual.
	     *
	     * @param {service.Service} service
	     * @param {HTMLElement} element
	     * @param {embed.IEmbedConfiguration} config
	     */
	    function Visual(service, element, baseConfig, phasedRender, isBootstrap, iframe) {
	        _super.call(this, service, element, baseConfig, phasedRender, isBootstrap, iframe);
	    }
	    Visual.prototype.load = function (baseConfig, phasedRender) {
	        var config = baseConfig;
	        if (!config.accessToken) {
	            // bootstrap flow.
	            return;
	        }
	        if (typeof config.pageName !== 'string' || config.pageName.length === 0) {
	            throw new Error("Page name is required when embedding a visual.");
	        }
	        if (typeof config.visualName !== 'string' || config.visualName.length === 0) {
	            throw new Error("Visual name is required, but it was not found. You must provide a visual name as part of embed configuration.");
	        }
	        // calculate custom layout settings and override config.
	        var width = config.width ? config.width : this.iframe.offsetWidth;
	        var height = config.height ? config.height : this.iframe.offsetHeight;
	        var pageSize = {
	            type: models.PageSizeType.Custom,
	            width: width,
	            height: height,
	        };
	        var pagesLayout = {};
	        pagesLayout[config.pageName] = {
	            defaultLayout: {
	                displayState: {
	                    mode: models.VisualContainerDisplayMode.Hidden
	                }
	            },
	            visualsLayout: {}
	        };
	        pagesLayout[config.pageName].visualsLayout[config.visualName] = {
	            displayState: {
	                mode: models.VisualContainerDisplayMode.Visible
	            },
	            x: 1,
	            y: 1,
	            z: 1,
	            width: pageSize.width,
	            height: pageSize.height
	        };
	        config.settings = config.settings || {};
	        config.settings.filterPaneEnabled = false;
	        config.settings.navContentPaneEnabled = false;
	        config.settings.layoutType = models.LayoutType.Custom;
	        config.settings.customLayout = {
	            displayOption: models.DisplayOption.FitToPage,
	            pageSize: pageSize,
	            pagesLayout: pagesLayout
	        };
	        return _super.prototype.load.call(this, config, phasedRender);
	    };
	    /**
	     * Gets the list of pages within the report - not supported in visual embed.
	     *
	     * @returns {Promise<Page[]>}
	     */
	    Visual.prototype.getPages = function () {
	        throw Visual.GetPagesNotSupportedError;
	    };
	    /**
	     * Sets the active page of the report - not supported in visual embed.
	     *
	     * @param {string} pageName
	     * @returns {Promise<void>}
	     */
	    Visual.prototype.setPage = function (pageName) {
	        throw Visual.SetPageNotSupportedError;
	    };
	    /**
	     * Gets filters that are applied to the filter level.
	     * Default filter level is visual level.
	     *
	     * ```javascript
	     * visual.getFilters(filtersLevel)
	     *   .then(filters => {
	     *     ...
	     *   });
	     * ```
	     *
	     * @returns {Promise<models.IFilter[]>}
	     */
	    Visual.prototype.getFilters = function (filtersLevel) {
	        var url = this.getFiltersLevelUrl(filtersLevel);
	        return this.service.hpm.get(url, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .then(function (response) { return response.body; }, function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Sets filters at the filter level.
	     * Default filter level is visual level.
	     *
	     * ```javascript
	     * const filters: [
	     *    ...
	     * ];
	     *
	     * visual.setFilters(filters, filtersLevel)
	     *  .catch(errors => {
	     *    ...
	     *  });
	     * ```
	     *
	     * @param {(models.IFilter[])} filters
	     * @returns {Promise<void>}
	     */
	    Visual.prototype.setFilters = function (filters, filtersLevel) {
	        var url = this.getFiltersLevelUrl(filtersLevel);
	        return this.service.hpm.put(url, filters, { uid: this.config.uniqueId }, this.iframe.contentWindow)
	            .catch(function (response) {
	            throw response.body;
	        });
	    };
	    /**
	     * Removes all filters from the current filter level.
	     * Default filter level is visual level.
	     *
	     * ```javascript
	     * visual.removeFilters(filtersLevel);
	     * ```
	     *
	     * @returns {Promise<void>}
	     */
	    Visual.prototype.removeFilters = function (filtersLevel) {
	        return this.setFilters([], filtersLevel);
	    };
	    Visual.prototype.getFiltersLevelUrl = function (filtersLevel) {
	        var config = this.config;
	        switch (filtersLevel) {
	            case models.FiltersLevel.Report:
	                return "/report/filters";
	            case models.FiltersLevel.Page:
	                return "/report/pages/" + config.pageName + "/filters";
	            default:
	                return "/report/pages/" + config.pageName + "/visuals/" + config.visualName + "/filters";
	        }
	    };
	    Visual.type = "visual";
	    Visual.GetPagesNotSupportedError = "Get pages is not supported while embedding a visual.";
	    Visual.SetPageNotSupportedError = "Set page is not supported while embedding a visual.";
	    return Visual;
	}(report_1.Report));
	exports.Visual = Visual;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var config_1 = __webpack_require__(4);
	var wpmp = __webpack_require__(18);
	var hpm = __webpack_require__(19);
	var router = __webpack_require__(20);
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
	        suppressWarnings: true,
	        name: name,
	        logMessages: logMessages,
	        eventSourceOverrideWindow: eventSourceOverrideWindow
	    });
	};
	exports.routerFactory = function (wpmp) {
	    return new router.Router(wpmp);
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/*! window-post-message-proxy v0.2.6 | (c) 2016 Microsoft Corporation MIT */
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
	/***/ (function(module, exports) {

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
		        // window.msCrypto for IE
		        var cryptoObj = window.crypto || window.msCrypto;
		        var randomValueArray = new Uint32Array(1);
		        cryptoObj.getRandomValues(randomValueArray);
		        return randomValueArray[0].toString(36).substring(1);
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


	/***/ })
	/******/ ])
	});
	;
	//# sourceMappingURL=windowPostMessageProxy.js.map

/***/ }),
/* 19 */
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
/* 20 */
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