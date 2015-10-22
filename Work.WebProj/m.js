(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Pt = require("./point");
var p1 = new Pt(10, 20);
var p2 = Pt.origin;

},{"./point":2}],2:[function(require,module,exports){
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.origin = new Point(0, 0);
    return Point;
})();
module.exports = Point;

},{}]},{},[1]);
