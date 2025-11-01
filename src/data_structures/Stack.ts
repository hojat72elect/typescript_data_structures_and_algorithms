/**
 * A LIFO data structure. It's easy to implement and reason about.
 */
export class Stack {
    private dataHolder: any[];

    constructor(data: any[] = []) {
        this.dataHolder = data;
    }

    push(newValue: any) {
        this.dataHolder.push(newValue);
    }

    peek() {
        if (this.isEmpty()) return undefined;
        return this.dataHolder[this.dataHolder.length - 1];
    }

    pop() {
        if (this.isEmpty()) return undefined;
        return this.dataHolder.pop();
    }

    clear() {
        this.dataHolder = [];
    }

    getSize() {
        return this.dataHolder.length;
    }

    isEmpty() {
        return this.dataHolder.length === 0;
    }

    toString() {
        return this.dataHolder.join(", ");
    }
}