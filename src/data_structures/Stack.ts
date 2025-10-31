/**
 * A LIFO data structure. It's easy to implement and reason about.
 */
export class Stack {
    private dataHolder: any[];

    constructor() {
        this.dataHolder = [];
    }

    push(value: any) {
        this.dataHolder.push(value);
    }

    peek() {
        if (this.dataHolder.length === 0) return null;
        return this.dataHolder[this.dataHolder.length - 1];
    }

    pop() {
        if (this.dataHolder.length === 0)
            throw new Error("The stack is empty!!");

        return this.dataHolder.pop();
    }

    clear() {
        this.dataHolder = [];
    }

    getSize() {
        return this.dataHolder.length;
    }

    toString() {
        let stringRepresentation = "";
        [...this.dataHolder].reverse().map((stackElement: any) => {
            stringRepresentation += ` ${stackElement} -> `;
        });
        return stringRepresentation;
    }
}