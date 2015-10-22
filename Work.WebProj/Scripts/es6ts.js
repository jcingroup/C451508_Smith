{
    var a = 10;
    var b = 20;
}
console.log(b);
var Animal = (function () {
    function Animal(theName) {
        this.name = theName;
    }
    Animal.prototype.move = function (distanceInMeters) {
        alert(this.name + " moved " + distanceInMeters + "m.");
    };
    return Animal;
})();
