'use strict';

var tslib = require('tslib');
var i0 = require('@angular/core');
var core = require('@awesome-cordova-plugins/core');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var i0__namespace = /*#__PURE__*/_interopNamespaceDefault(i0);

var NativeStorage = /** @class */ (function (_super) {
    tslib.__extends(NativeStorage, _super);
    function NativeStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeStorage.prototype.initWithSuiteName = function (reference) { return core.cordova(this, "initWithSuiteName", { "platforms": ["iOS"] }, arguments); };
    NativeStorage.prototype.setItem = function (reference, value) { return core.cordova(this, "setItem", {}, arguments); };
    NativeStorage.prototype.getItem = function (reference) { return core.cordova(this, "getItem", {}, arguments); };
    NativeStorage.prototype.keys = function () { return core.cordova(this, "keys", {}, arguments); };
    NativeStorage.prototype.remove = function (reference) { return core.cordova(this, "remove", {}, arguments); };
    NativeStorage.prototype.clear = function () { return core.cordova(this, "clear", {}, arguments); };
    NativeStorage.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: NativeStorage, deps: null, target: i0__namespace.ɵɵFactoryTarget.Injectable });
    NativeStorage.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: NativeStorage });
    NativeStorage.pluginName = "NativeStorage";
    NativeStorage.plugin = "cordova-plugin-nativestorage";
    NativeStorage.pluginRef = "NativeStorage";
    NativeStorage.repo = "https://github.com/TheCocoaProject/cordova-plugin-nativestorage";
    NativeStorage.platforms = ["Android", "Browser", "iOS", "macOS", "Windows"];
    NativeStorage = tslib.__decorate([], NativeStorage);
    return NativeStorage;
}(core.AwesomeCordovaNativePlugin));
i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0__namespace, type: NativeStorage, decorators: [{
            type: i0.Injectable
        }], propDecorators: { initWithSuiteName: [], setItem: [], getItem: [], keys: [], remove: [], clear: [] } });

exports.NativeStorage = NativeStorage;
