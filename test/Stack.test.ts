import {Stack} from "../src/data_structures/Stack";


describe('Stack Data Structure', () => {
    let stack:Stack;

    beforeEach(() => {
        stack = new Stack();
    });

    test('Simply pushing and popping a Stack generates LIFO behavior and updates the length of the stack as well.', () => {

        stack.push("h");
        expect(stack.getSize()).toBe(1);
        stack.push("o");
        expect(stack.getSize()).toBe(2);
        stack.push("j");
        expect(stack.getSize()).toBe(3);
        stack.push("a");
        expect(stack.getSize()).toBe(4);
        stack.push("t");
        expect(stack.getSize()).toBe(5);

        expect(stack.pop()).toBe("t");
        expect(stack.getSize()).toBe(4);
        expect(stack.pop()).toBe("a");
        expect(stack.getSize()).toBe(3);
        expect(stack.pop()).toBe("j");
        expect(stack.getSize()).toBe(2);
        expect(stack.pop()).toBe("o");
        expect(stack.getSize()).toBe(1);
        expect(stack.pop()).toBe("h");
        expect(stack.getSize()).toBe(0);


    })

    test("Popping an empty Stack should return undefined", () => {

        expect(stack.pop()).toBeUndefined();
    });

    test("Peeking into a Stack is safe, doesn't have side effects and wouldn't throw an error for empty Stack", () => {


        expect(stack.peek()).toBeUndefined();

        stack.push(1);
        expect(stack.peek()).toBe(1);
        stack.push(2);
        stack.push(3);
        expect(stack.peek()).toBe(3);
        stack.pop();
        expect(stack.peek()).toBe(2);


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