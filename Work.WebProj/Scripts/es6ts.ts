{
    let a: number = 10;
    var b: number = 20;
}

console.log(b);

class Animal {
    public name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number) {
        alert(`${this.name} moved ${distanceInMeters}m.`);
    }
}