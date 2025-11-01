import {SinglyLinkedList} from "../src/data_structures/SinglyLinkedList";

describe("SinglyLinkedList", () => {
    let list: SinglyLinkedList<any>;

    beforeEach(() => {
        list = new SinglyLinkedList<any>();
    });

    it("Should be empty on initialization", () => {
        expect(list.isEmpty()).toBe(true);
        expect(list.getSize()).toBe(0);
    });

    it("Prepend a node to an empty list", () => {
        list.prepend(1);
        expect(list.isEmpty()).toBe(false);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(1);
    });

    it("Prepend a node to a non-empty list", () => {
        list.append(2);
        list.prepend(1);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
    });

    it("Append a node to an empty list", () => {
        list.append(1);
        expect(list.isEmpty()).toBe(false);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(1);
    });

    it("Append a node to a non-empty list", () => {
        list.append(1);
        list.append(2);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
    });

    it("Inserting at an out of bounds index", () => {
        expect(() => list.insertAt(1, -1)).toThrow("Index out of bounds");
        expect(() => list.insertAt(1, 1)).toThrow("Index out of bounds");
    });

    it("Inserting at the beginning", () => {
        list.append(2);
        list.insertAt(1, 0);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
    });

    it("Inserting at the end", () => {
        list.append(1);
        list.insertAt(2, 1);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
    });

    it("Inserting to the middle", () => {
        list.append(1);
        list.append(3);
        list.insertAt(2, 1);
        expect(list.getSize()).toBe(3);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
        expect(list.get(2)).toBe(3);
    });

    it("Remove from front of an empty list", () => {
        expect(list.removeFromFront()).toBeNull();
    });

    it("Remove from front of a list with one element", () => {
        list.append(1);
        expect(list.removeFromFront()).toBe(1);
        expect(list.isEmpty()).toBe(true);
    });

    it("Remove from the front of a list with multiple elements", () => {
        list.append(1);
        list.append(2);
        expect(list.removeFromFront()).toBe(1);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(2);
    });

    it("Remove from end of an empty list", () => {
        expect(list.removeFromEnd()).toBeNull();
    });

    it("Remove from end of a list with one element", () => {
        list.append(1);
        expect(list.removeFromEnd()).toBe(1);
        expect(list.isEmpty()).toBe(true);
    });

    it("Remove from end of a list with multiple elements", () => {
        list.append(1);
        list.append(2);
        expect(list.removeFromEnd()).toBe(2);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(1);
    });

    it("Removing at an out of bounds index", () => {
        expect(() => list.removeAt(-1)).toThrow("Index out of bounds");
        expect(() => list.removeAt(0)).toThrow("Index out of bounds");
    });

    it("Removing from the beginning", () => {
        list.append(1);
        list.append(2);
        expect(list.removeAt(0)).toBe(1);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(2);
    });

    it("Removing from the end", () => {
        list.append(1);
        list.append(2);
        expect(list.removeAt(1)).toBe(2);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(1);
    });

    it("Removing from the middle", () => {
        list.append(1);
        list.append(2);
        list.append(3);
        expect(list.removeAt(1)).toBe(2);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(3);
    });

    it("Removing from an empty list", () => {
        expect(list.remove(1)).toBe(false);
    });

    it("Removing a non-existent value", () => {
        list.append(1);
        list.append(2);
        expect(list.remove(3)).toBe(false);
        expect(list.getSize()).toBe(2);
    });

    it("Removing the head", () => {
        list.append(1);
        list.append(2);
        expect(list.remove(1)).toBe(true);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(2);
    });

    it("Removing the tail", () => {
        list.append(1);
        list.append(2);
        expect(list.remove(2)).toBe(true);
        expect(list.getSize()).toBe(1);
        expect(list.get(0)).toBe(1);
    });

    it("Removing from the middle", () => {
        list.append(1);
        list.append(2);
        list.append(3);
        expect(list.remove(2)).toBe(true);
        expect(list.getSize()).toBe(2);
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(3);
    });

    it("Empty list doesn't contain anything", () => {
        expect(list.contains(1)).toBe(false);
    });

    it("The list contains existing values", () => {
        list.append(1);
        list.append(2);
        expect(list.contains(2)).toBe(true);
    });

    it("The list doesn't contain non existing values", () => {
        list.append(1);
        list.append(2);
        expect(list.contains(3)).toBe(false);
    });

    it("Returns -1 index for an empty list", () => {
        expect(list.indexOf(1)).toBe(-1);
    });

    it("Returns correct index for existing values", () => {
        list.append(1);
        list.append(2);
        list.append(3);
        expect(list.indexOf(2)).toBe(1);
    });

    it("Returns -1 index for a non-existent value", () => {
        list.append(1);
        list.append(2);
        expect(list.indexOf(3)).toBe(-1);
    });

    it("Getting the item at an out of bounds index", () => {
        expect(() => list.get(-1)).toThrow("Index out of bounds");
        expect(() => list.get(0)).toThrow("Index out of bounds");
    });

    it("Getting the correct value", () => {
        list.append(1);
        list.append(2);
        expect(list.get(1)).toBe(2);
    });

    it("Setting the item at an out of bounds index", () => {
        expect(() => list.set(-1, 1)).toThrow("Index out of bounds");
        expect(() => list.set(0, 1)).toThrow("Index out of bounds");
    });

    it("should set the value at the specified index", () => {
        list.append(1);
        list.append(3);
        list.set(1, 2);
        expect(list.get(1)).toBe(2);
        expect(list.getSize()).toBe(2);
    });

    it("Returns an empty array for an empty list", () => {
        expect(list.toArray()).toEqual([]);
    });

    it("Returns the correct array for a non-empty list", () => {
        list.append(1);
        list.append(2);
        list.append(3);
        expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it("Clearing the list", () => {
        list.append(1);
        list.append(2);
        list.clear();
        expect(list.isEmpty()).toBe(true);
        expect(list.getSize()).toBe(0);
    });

    it("Reversing an empty or single-element list", () => {
        list.reverse();
        expect(list.toArray()).toEqual([]);
        list.append(1);
        list.reverse();
        expect(list.toArray()).toEqual([1]);
    });

    it("Reversing a list with multiple elements", () => {
        list.append(1);
        list.append(2);
        list.append(3);
        list.reverse();
        expect(list.toArray()).toEqual([3, 2, 1]);
    });

});
