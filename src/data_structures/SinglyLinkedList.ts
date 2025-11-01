class ListNode<T> {
    value: T;
    next: ListNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export class SinglyLinkedList<T> {
    private headNode: ListNode<T> | null;
    private tailNode: ListNode<T> | null;
    private size: number;

    constructor() {
        this.headNode = null;
        this.tailNode = null;
        this.size = 0;
    }

    isEmpty() {
        return this.size === 0;
    }

    /**
     * Add a new node to the beginning of the list.
     */
    prepend(value: T) {
        const newNode = new ListNode(value);
        if (this.isEmpty()) {
            this.headNode = newNode;
            this.tailNode = newNode;
        } else {
            newNode.next = this.headNode;
            this.headNode = newNode;
        }

        this.size++;
    }

    /**
     * Add a new node to the end of the list.
     */
    append(value: T) {
        const newNode = new ListNode(value);
        if (this.isEmpty()) {
            this.headNode = newNode;
            this.tailNode = newNode;
        } else {
            this.tailNode!.next = newNode;
            this.tailNode = newNode;
        }

        this.size++;
    }

    /**
     * Insert a new node at a specific index. nodes of this list are indexed starting from 0.
     */
    insertAt(value: T, index: number) {
        if (index < 0 || index > this.size)
            throw new Error("Index out of bounds");

        if (index === 0) {
            this.prepend(value);
            return;
        }

        if (index === this.size) {
            this.append(value);
            return;
        }

        const newNode = new ListNode(value);
        let currentNode = this.headNode;
        let previousNode: ListNode<T> | null = null;
        let currentIndex = 0;

        while (currentIndex !== index) {
            previousNode = currentNode;
            currentNode = currentNode!.next;
            currentIndex++;
        }

        previousNode!.next = newNode;
        newNode.next = currentNode;
        this.size++;
    }

    /**
     * Removes an element from the beginning of the linked list.
     */
    removeFromFront(): T | null {
        if (this.isEmpty()) return null;

        const removedValue = this.headNode!.value;

        if (this.headNode === this.tailNode) {
            this.headNode = null;
            this.tailNode = null;
        } else {
            this.headNode = this.headNode!.next;
        }

        this.size--;
        return removedValue;
    }

    /**
     * Removes an element from the end of the linked list.
     */
    removeFromEnd(): T | null {
        if (this.isEmpty()) return null;

        const removedValue = this.tailNode!.value;

        if (this.headNode === this.tailNode) {
            this.headNode = null;
            this.tailNode = null;
        } else {
            let current = this.headNode;
            while (current!.next !== this.tailNode) {
                current = current!.next;
            }
            current!.next = null;
            this.tailNode = current;
        }

        this.size--;
        return removedValue;
    }

    removeAt(index: number): T | null {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        if (index === 0) {
            return this.removeFromFront();
        }

        if (index === this.size - 1) {
            return this.removeFromEnd();
        }

        let current = this.headNode;
        let previous: ListNode<T> | null = null;
        let currentIndex = 0;

        while (currentIndex < index) {
            previous = current;
            current = current!.next;
            currentIndex++;
        }

        previous!.next = current!.next;
        this.size--;
        return current!.value;
    }

    /**
     * Removes the first occurrence of the value.
     */
    remove(value: T): boolean {
        if (this.isEmpty()) {
            return false;
        }

        if (this.headNode!.value === value) {
            this.removeFromFront();
            return true;
        }

        let current = this.headNode;
        let previous: ListNode<T> | null = null;

        while (current !== null) {
            if (current.value === value) {
                if (current === this.tailNode) {
                    this.tailNode = previous;
                }
                previous!.next = current.next;
                this.size--;
                return true;
            }
            previous = current;
            current = current.next;
        }

        return false;
    }

    contains(value: T): boolean {
        let current = this.headNode;

        while (current !== null) {
            if (current.value === value) {
                return true;
            }
            current = current.next;
        }

        return false;
    }

    /**
     * Find the index of first occurrence of the value.
     */
    indexOf(value: T): number {
        let current = this.headNode;
        let index = 0;

        while (current !== null) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }

        return -1;
    }

    /**
     * Get the element at a specific index (without removing it).
     */
    get(index: number): T | null {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        let current = this.headNode;
        let currentIndex = 0;

        while (currentIndex < index) {
            current = current!.next;
            currentIndex++;
        }

        return current!.value;
    }

    /**
     * Updates the value at a specific index. The size of the list doesn't change.
     */
    set(index: number, value: T): void {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }

        let current = this.headNode;
        let currentIndex = 0;

        while (currentIndex < index) {
            current = current!.next;
            currentIndex++;
        }

        current!.value = value;
    }

    getSize() {
        return this.size;
    }

    /**
     * Convert this list to an array of items
     */
    toArray(): T[] {
        const result: T[] = [];
        let current = this.headNode;

        while (current !== null) {
            result.push(current.value);
            current = current.next;
        }

        return result;
    }

    /**
     *  Mostly used for debugging purposes.
     */
    toString() {
        let current = this.headNode;
        const values: string[] = [];

        while (current !== null) {
            values.push(String(current.value));
            current = current.next;
        }

        console.log(values.join(" -> "));
    }

    clear(): void {
        this.headNode = null;
        this.tailNode = null;
        this.size = 0;
    }

    /**
     * Reverses the whole list in place.
     */
    reverse() {
        if (this.size <= 1) {
            return;
        }

        let previous: ListNode<T> | null = null;
        let current = this.headNode;
        let next: ListNode<T> | null = null;

        this.tailNode = this.headNode;

        while (current !== null) {
            next = current.next;
            current.next = previous;
            previous = current;
            current = next;
        }

        this.headNode = previous;
    }
}