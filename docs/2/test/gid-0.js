import { describe, it, expect } from "bun:test";
import { Gid, Bin64 } from "../src/gid.js";

describe("Gid Class Tests", () => {
    it("should create a Gid with default byte length (8)", () => {
        const id = new Gid();
        expect(id.byte).toBe(8);
        expect(id.bin).toBeInstanceOf(Uint8Array);
        expect(id.bin.byteLength).toBe(8);
        expect(typeof id.str).toBe("string");
        expect(id.str.length).toBeGreaterThan(0);
    });

    it("should create a Gid with custom byte length", () => {
        const id = Gid.new(16);
        expect(id.byte).toBe(16);
        expect(id.bin.byteLength).toBe(16);
    });

    it("should correctly convert between Gid, Uint8Array, and Base64URL string", () => {
        const original = Gid.new(12);
        
        // Static methods toStr / toBin
        const str = Gid.toStr(original.bin);
        const bin = Gid.toBin(original.str);

        expect(str).toBe(original.str);
        expect(bin).toEqual(original.bin);
    });

    it("should throw an error for invalid byte lengths", () => {
        expect(() => new Gid(0)).toThrow();
        expect(() => new Gid(-5)).toThrow();
        expect(() => new Gid(3.5)).toThrow();
        expect(() => new Gid("8")).toThrow();
    });

    it("should throw an error for invalid Base64URL strings in `toBin` or `fromStr` equivalents", () => {
        // Contains invalid character '+' or '/' or '=' or spaces
        expect(() => Gid.toBin("invalid/string+")).toThrow();
        expect(() => Gid.toBin("")).toThrow();
    });

    it("should throw an error for invalid Uint8Array inputs", () => {
        expect(() => Gid.toStr(new Uint8Array(0))).toThrow();
        expect(() => Gid.toStr([1, 2, 3])).toThrow();
    });
});
