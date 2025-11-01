import {Vector2} from "../src/data_structures/Vector2";

describe('Behavioral tests on Vector 2D', () => {

    test('Should have the correct coordinates and length', () => {
        const sut = new Vector2(5, 8);
        expect(sut.x).toBe(5);
        expect(sut.y).toBe(8);
        expect(sut.getLength()).toBe(9.433981132056603);
    });

    test('should point to origin after being reset ', () => {
        const sut = new Vector2(5, 8);
        sut.reset();
        expect(sut.x).toBe(0);
        expect(sut.y).toBe(0);
    });

    test('The copy should refer to exact same point', () => {

        const sut = new Vector2(23, 56);
        const copy = sut.copy();

        expect(copy.x).toBe(23);
        expect(copy.y).toBe(56);
        expect(sut.equals(copy)).toBe(true);
    });

    test('The 4 elementary arithmetic operations should work correctly', () => {

        const v1 = new Vector2(3, 5);
        const v2 = new Vector2(2, 6);

        const addedVectors = v1.add(v2);
        const subtractedVectors = v1.subtract(v2);
        const multipliedVectors = v1.multiply(v2);
        const dividedVectors = v1.divide(v2);

        expect(addedVectors.x).toBe(5);
        expect(addedVectors.y).toBe(11);
        expect(subtractedVectors.x).toBe(1);
        expect(subtractedVectors.y).toBe(-1);
        expect(multipliedVectors.x).toBe(6);
        expect(multipliedVectors.y).toBe(30);
        expect(dividedVectors.x).toBe(1.5);
        expect(dividedVectors.y).toBe(0.8333333333333334);

    });

    test('Scaling a vector should work correctly', () => {

        const sut = new Vector2(3, 5);
        sut.scale(7);
        expect(sut.x).toBe(21);
        expect(sut.y).toBe(35);

    });

    test('Negation of a vector should work correctly', () => {

        const sut = new Vector2(13, 15);
        sut.negate();
        expect(sut.x).toBe(-13);
        expect(sut.y).toBe(-15);

    });

    test('After being normalized, the length of a vector should be 1', () => {

        const sut = new Vector2(3, 4);
        sut.normalize();
        expect(sut.getLength()).toBe(1);

    });
});