var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AwesomeCordovaNativePlugin, cordova } from '@awesome-cordova-plugins/core';
var NativeStorageOriginal = /** @class */ (function (_super) {
    __extends(NativeStorageOriginal, _super);
    function NativeStorageOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeStorageOriginal.prototype.initWithSuiteName = function (reference) { return cordova(this, "initWithSuiteName", { "platforms": ["iOS"] }, arguments); };
    NativeStorageOriginal.prototype.setItem = function (reference, value) { return cordova(this, "setItem", {}, arguments); };
    NativeStorageOriginal.prototype.getItem = function (reference) { return cordova(this, "getItem", {}, arguments); };
    NativeStorageOriginal.prototype.keys = function () { return cordova(this, "keys", {}, arguments); };
    NativeStorageOriginal.prototype.remove = function (reference) { return cordova(this, "remove", {}, arguments); };
    NativeStorageOriginal.prototype.clear = function () { return cordova(this, "clear", {}, arguments); };
    NativeStorageOriginal.pluginName = "NativeStorage";
    NativeStorageOriginal.plugin = "cordova-plugin-nativestorage";
    NativeStorageOriginal.pluginRef = "NativeStorage";
    NativeStorageOriginal.repo = "https://github.com/TheCocoaProject/cordova-plugin-nativestorage";
    NativeStorageOriginal.platforms = ["Android", "Browser", "iOS", "macOS", "Windows"];
    return NativeStorageOriginal;
}(AwesomeCordovaNativePlugin));
var NativeStorage = new NativeStorageOriginal();
export { NativeStorage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGF3ZXNvbWUtY29yZG92YS1wbHVnaW5zL3BsdWdpbnMvbmF0aXZlLXN0b3JhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyx1Q0FBK0MsTUFBTSwrQkFBK0IsQ0FBQzs7SUFtQ3pELGlDQUEwQjs7OztJQVUzRCx5Q0FBaUIsYUFBQyxTQUFpQjtJQVluQywrQkFBTyxhQUFDLFNBQWlCLEVBQUUsS0FBVTtJQVdyQywrQkFBTyxhQUFDLFNBQWlCO0lBVXpCLDRCQUFJO0lBV0osOEJBQU0sYUFBQyxTQUFpQjtJQVV4Qiw2QkFBSzs7Ozs7O3dCQXBHUDtFQW9DbUMsMEJBQTBCO1NBQWhELGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb3Jkb3ZhLCBBd2Vzb21lQ29yZG92YU5hdGl2ZVBsdWdpbiwgUGx1Z2luIH0gZnJvbSAnQGF3ZXNvbWUtY29yZG92YS1wbHVnaW5zL2NvcmUnO1xuXG4vKipcbiAqIEBuYW1lIE5hdGl2ZSBTdG9yYWdlXG4gKiBAcHJlbWllciBuYXRpdmVzdG9yYWdlXG4gKiBAZGVzY3JpcHRpb24gTmF0aXZlIHN0b3JhZ2Ugb2YgdmFyaWFibGVzIGluIEFuZHJvaWQgYW5kIGlPU1xuICogQHVzYWdlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBOYXRpdmVTdG9yYWdlIH0gZnJvbSAnQGF3ZXNvbWUtY29yZG92YS1wbHVnaW5zL25hdGl2ZS1zdG9yYWdlL25neCc7XG4gKlxuICogY29uc3RydWN0b3IocHJpdmF0ZSBuYXRpdmVTdG9yYWdlOiBOYXRpdmVTdG9yYWdlKSB7IH1cbiAqXG4gKiAuLi5cbiAqXG4gKiB0aGlzLm5hdGl2ZVN0b3JhZ2Uuc2V0SXRlbSgnbXlpdGVtJywge3Byb3BlcnR5OiAndmFsdWUnLCBhbm90aGVyUHJvcGVydHk6ICdhbm90aGVyVmFsdWUnfSlcbiAqICAgLnRoZW4oXG4gKiAgICAgKCkgPT4gY29uc29sZS5sb2coJ1N0b3JlZCBpdGVtIScpLFxuICogICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHN0b3JpbmcgaXRlbScsIGVycm9yKVxuICogICApO1xuICpcbiAqIHRoaXMubmF0aXZlU3RvcmFnZS5nZXRJdGVtKCdteWl0ZW0nKVxuICogICAudGhlbihcbiAqICAgICBkYXRhID0+IGNvbnNvbGUubG9nKGRhdGEpLFxuICogICAgIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gKiAgICk7XG4gKiBgYGBcbiAqL1xuQFBsdWdpbih7XG4gIHBsdWdpbk5hbWU6ICdOYXRpdmVTdG9yYWdlJyxcbiAgcGx1Z2luOiAnY29yZG92YS1wbHVnaW4tbmF0aXZlc3RvcmFnZScsXG4gIHBsdWdpblJlZjogJ05hdGl2ZVN0b3JhZ2UnLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL1RoZUNvY29hUHJvamVjdC9jb3Jkb3ZhLXBsdWdpbi1uYXRpdmVzdG9yYWdlJyxcbiAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnLCAnQnJvd3NlcicsICdpT1MnLCAnbWFjT1MnLCAnV2luZG93cyddLFxufSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOYXRpdmVTdG9yYWdlIGV4dGVuZHMgQXdlc29tZUNvcmRvdmFOYXRpdmVQbHVnaW4ge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgc2hhcmVkIHN0b3JhZ2Ugd2l0aCB0aGUgc3VpdGUgbmFtZSB3aGVuIHVzaW5nIGFwcCBncm91cHMgaW4gaU9TXG4gICAqXG4gICAqIEBwYXJhbSByZWZlcmVuY2Uge3N0cmluZ31cbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgcGxhdGZvcm1zOiBbJ2lPUyddLFxuICB9KVxuICBpbml0V2l0aFN1aXRlTmFtZShyZWZlcmVuY2U6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZXMgYSB2YWx1ZVxuICAgKlxuICAgKiBAcGFyYW0gcmVmZXJlbmNlIHtzdHJpbmd9XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgQENvcmRvdmEoKVxuICBzZXRJdGVtKHJlZmVyZW5jZTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHN0b3JlZCBpdGVtXG4gICAqXG4gICAqIEBwYXJhbSByZWZlcmVuY2Uge3N0cmluZ31cbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAgZ2V0SXRlbShyZWZlcmVuY2U6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZpbmcgYWxsIGtleXNcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAga2V5cygpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgc2luZ2xlIHN0b3JlZCBpdGVtXG4gICAqXG4gICAqIEBwYXJhbSByZWZlcmVuY2Uge3N0cmluZ31cbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAgcmVtb3ZlKHJlZmVyZW5jZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgc3RvcmVkIHZhbHVlcy5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKClcbiAgY2xlYXIoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cbn1cbiJdfQ==