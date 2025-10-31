export class Queue {

    private dataHolder: any[];

    constructor() {
        this.dataHolder = [];
    }

    getSize() {
        return this.dataHolder.length;
    }

    enqueue(element: any) {
        this.dataHolder.push(element);
    }

    dequeue() {
        if (this.dataHolder.length === 0)
            throw new Error("The queue is empty!");

        return this.dataHolder.shift();
    }

    /**
     * @return {any|null} The element in the row with the highest priority. Or null, if the queue is empty.
     */
    peekFront() {
        if (this.dataHolder.length === 0) return null;
        return this.dataHolder[0];
    }

    peekBack() {
        if (this.dataHolder.length === 0) return null;
        return this.dataHolder[this.dataHolder.length - 1];
    }

    /**
     * @returns A string representation of the Queue (for debugging purposes).
     */
    toString(): string {
        let result = "";
        for (let currentNodeValue of this.dataHolder)
            result += `${currentNodeValue}--`;

        return result;
    }

    clear() {
        this.dataHolder = [];
    }
}