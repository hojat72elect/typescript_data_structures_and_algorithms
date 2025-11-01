export class Queue {

    private dataHolder: any[];

    constructor() {
        this.dataHolder = [];
    }

    isEmpty() {
        return this.dataHolder.length === 0;
    }

    getSize() {
        return this.dataHolder.length;
    }

    enqueue(newValue: any) {
        this.dataHolder.push(newValue);
    }

    dequeue() {
        if (this.isEmpty()) return undefined;
        return this.dataHolder.shift();
    }

    /**
     * @return The element in the row with the highest priority. Or null, if the queue is empty.
     */
    peekFront() {
        if (this.isEmpty()) return undefined;
        return this.dataHolder[0];
    }

    peekBack() {
        if (this.isEmpty()) return undefined;
        return this.dataHolder[this.dataHolder.length - 1];
    }

    /**
     * @returns A string representation of the Queue (for debugging purposes).
     */
    toString(): string {
        return this.dataHolder.join("--");
    }

    clear() {
        this.dataHolder = [];
    }
}