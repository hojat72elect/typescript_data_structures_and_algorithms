export class Vector2{

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    negate() {
        this.x *= -1;
        this.y *= -1;
    }

    equals(otherVector: Vector2) {
        return this.x === otherVector.x && this.y === otherVector.y;
    }

    add(otherVector: Vector2) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    subtract(otherVector: Vector2) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }

    multiply(otherVector: Vector2) {
        return new Vector2(this.x * otherVector.x, this.y * otherVector.y);
    }

    divide(otherVector: Vector2) {
        return new Vector2(this.x / otherVector.x, this.y / otherVector.y);
    }

    scale(value: number) {
        this.x *= value;
        this.y *= value;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const length = this.getLength();
        this.x /= length;
        this.y /= length;
    }
}