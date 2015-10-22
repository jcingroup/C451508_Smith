var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.origin = new Point(0, 0);
    return Point;
})();
module.exports = Point;
