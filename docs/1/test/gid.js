import { describe, it, test, expect } from "bun:test";
import { assertThrow } from "./assert-throw.js";
import { Gid, Bin64, GidError } from "../src/gid.js";

describe("Gid.is", () => {
    describe("byte", () => {
        describe("正常系", () => {
            it.each([1,7,8,9,10,16,Gid.c.maxSize].map(v=>[v]))('%p',(v)=>expect(Gid.is.byte(v)).toBe(true));
        });
        describe("異常系", () => {
            it.each([0,-1,0.1,Gid.c.maxSize+1].map(v=>[v]))('%p',(v)=>expect(Gid.is.byte(v)).toBe(false));
        });
    });
    describe("bin", () => {
        describe("正常系", () => {
            it.each([1,7,8,9,10,16].map(v=>[v]))('%p',(v)=>expect(Gid.is.bin(new Uint8Array(v))).toBe(true));
        });
        describe("異常系", () => {
            it.each([0,0.1,Gid.c.maxSize+1].map(v=>[v]))('%p',(v)=>expect(Gid.is.bin(new Uint8Array(v))).toBe(false));
            it.each([-1].map(v=>[v]))('%p',(v)=>assertThrow(RangeError, `length cannot be negative`, ()=>Gid.is.bin(new Uint8Array(v))));
        });
    });
    describe("str", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {

        });
    });
});
describe("Gid.valid", () => {
    describe("byte", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {
//            assertThrow()
//            assertThrow(GidError, )
        });
    });
    describe("bin", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {

        });
    });
    describe("str", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {

        });
    });
});
describe("Bin64", () => {
    describe("b2s", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {
//            assertThrow()
        });
    });
    describe("s2b", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {

        });
    });
});
describe("Gid", () => {
    describe("constructor", () => {
        describe("#from", () => {
            describe("#fromByte", () => {

            });
            describe("#fromBin", () => {

            });
            describe("#fromStr", () => {

            });
            describe("GidError", () => {

            });

        });

        describe("正常系", () => {
            it('', ()=>{})
        });
        describe("異常系", () => {

        });
    });
    describe("byte", () => {

    });
    describe("bin", () => {

    });
    describe("str", () => {

    });
    describe("toStr", () => {

    });
    describe("toBin", () => {

    });
    describe("new", () => {

    });
    describe("is", () => {
        it('exist', ()=>expect(Gid.is).toBeDefined())
    });
    describe("valid", () => {
        it('exist', ()=>expect(Gid.is).toBeDefined())
    });
});
/*
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
*/
