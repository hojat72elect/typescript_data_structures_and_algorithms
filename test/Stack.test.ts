import {Stack} from "../src/data_structures/Stack";


describe('Stack unit tests', () => {


    test('Simply pushing and popping a Stack generates LIFO behavior and updates the length of the stack as well.', () => {

        const exampleStack = new Stack();
        exampleStack.push("h");
        expect(exampleStack.getSize()).toBe(1);
        exampleStack.push("o");
        expect(exampleStack.getSize()).toBe(2);
        exampleStack.push("j");
        expect(exampleStack.getSize()).toBe(3);
        exampleStack.push("a");
        expect(exampleStack.getSize()).toBe(4);
        exampleStack.push("t");
        expect(exampleStack.getSize()).toBe(5);


        expect(exampleStack.pop()).toBe("t");
        expect(exampleStack.getSize()).toBe(4);
        expect(exampleStack.pop()).toBe("a");
        expect(exampleStack.getSize()).toBe(3);
        expect(exampleStack.pop()).toBe("j");
        expect(exampleStack.getSize()).toBe(2);
        expect(exampleStack.pop()).toBe("o");
        expect(exampleStack.getSize()).toBe(1);
        expect(exampleStack.pop()).toBe("h");
        expect(exampleStack.getSize()).toBe(0);


    })

    test("Popping an empty Stack should return undefined", () => {
        const exampleStack = new Stack();
        expect(exampleStack.pop()).toBeUndefined();
    });

    test("Peeking into a Stack is safe, doesn't have side effects and wouldn't throw an error for empty Stack", () => {

        const exampleStack = new Stack();
        expect(exampleStack.peek()).toBeUndefined();

        exampleStack.push(1);
        expect(exampleStack.peek()).toBe(1);
        exampleStack.push(2);
        exampleStack.push(3);
        expect(exampleStack.peek()).toBe(3);
        exampleStack.pop();
        expect(exampleStack.peek()).toBe(2);


    });

    test("Clearing a stack will throw away all data but keeps reference to the stack", () => {

        const exampleStack = new Stack();
        exampleStack.push(12);
        exampleStack.push(5);
        exampleStack.push(41);
        exampleStack.push(86);
        exampleStack.push(34);

        exampleStack.clear();
        expect(exampleStack.getSize()).toBe(0);
        expect(exampleStack.peek()).toBeUndefined();

    });

});