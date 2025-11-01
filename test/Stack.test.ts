import {Stack} from "../src/data_structures/Stack";


describe('Stack', () => {
    let stack: Stack;

    beforeEach(() => {
        stack = new Stack();
    });

    test('The initial stack without input is empty.', () => {
        expect(stack.isEmpty()).toBe(true);
        expect(stack.getSize()).toBe(0);
    });

    test('Loading the constructor with an array will make them initial contents of the stack.', () => {
        const initialArray = [1, 2, 3];
        const stackWithItems = new Stack(initialArray);
        expect(stackWithItems.isEmpty()).toBe(false);
        expect(stackWithItems.getSize()).toBe(3);
        expect(stackWithItems.peek()).toBe(3);
    });

    test('push adds an element', () => {
        stack.push(10);
        expect(stack.isEmpty()).toBe(false);
        expect(stack.getSize()).toBe(1);
        expect(stack.peek()).toBe(10);
    });

    test('pop removes and returns the top element', () => {
        stack.push(10);
        stack.push(20);
        const poppedElement = stack.pop();
        expect(poppedElement).toBe(20);
        expect(stack.getSize()).toBe(1);
        expect(stack.peek()).toBe(10);
    });

    test("Popping an empty Stack returns undefined", () => {
        expect(stack.pop()).toBeUndefined();
        expect(stack.isEmpty()).toBe(true);
    });

    test('peek returns the top element without removing it', () => {
        stack.push(10);
        stack.push(20);
        expect(stack.peek()).toBe(20);
        expect(stack.getSize()).toBe(2);
    });

    test('peeking an empty stack returns undefined', () => {
        expect(stack.peek()).toBeUndefined();
    });

    test("Clearing a stack will throw away all data but keeps reference to the stack", () => {


        stack.push(12);
        stack.push(5);
        stack.push(41);
        stack.push(86);
        stack.push(34);

        stack.clear();
        expect(stack.getSize()).toBe(0);
        expect(stack.peek()).toBeUndefined();

    });

});