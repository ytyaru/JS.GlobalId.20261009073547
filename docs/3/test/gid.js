import { describe, it, test, expect } from "bun:test";
import { assertThrow } from "./assert-throw.js";
import { R1, R2, R3, Bin64, RError } from "../src/gid.js";

describe("R1.is", () => {
    describe("byte", () => {
        describe("正常系", () => {
            it.each([1,7,8,9,10,16,R1.c.maxSize].map(v=>[v]))('%p',(v)=>expect(R1.is.byte(v)).toBe(true));
        });
        describe("異常系", () => {
            it.each([0,-1,0.1,R1.c.maxSize+1].map(v=>[v]))('%p',(v)=>expect(R1.is.byte(v)).toBe(false));
        });
    });
    describe("bin", () => {
        describe("正常系", () => {
            it.each([1,7,8,9,10,16].map(v=>[v]))('%p',(v)=>expect(R1.is.bin(new Uint8Array(v))).toBe(true));
        });
        describe("異常系", () => {
            it.each([0,0.1,R1.c.maxSize+1].map(v=>[v]))('%p',(v)=>expect(R1.is.bin(new Uint8Array(v))).toBe(false));
            it.each([-1].map(v=>[v]))('%p',(v)=>assertThrow(RangeError, `length cannot be negative`, ()=>R1.is.bin(new Uint8Array(v))));
        });
    });
    describe("str", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {

        });
    });
});
describe("R1.valid", () => {
    describe("byte", () => {
        describe("正常系", () => {

        });
        describe("異常系", () => {
//            assertThrow()
//            assertThrow(RError, )
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
describe("R1", () => {
    describe("constructor", () => {
        describe("#from", () => {
            describe("#fromByte", () => {
                describe("正常系", () => {
                    it.each([1,7,8,9,10,16,R1.c.maxSize].map(v=>[v]))('%p',(v)=>{
                        const ins = new R1(v);
                        expect(ins).toBeInstanceOf(R1);
                        expect(ins.byte).toBe(v);
                    });
                    
                });
                describe("異常系", () => {

                });

            });
            describe("#fromBin", () => {

            });
            describe("#fromStr", () => {

            });
            describe("RError", () => {

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
        it('exist', ()=>expect(R1.is).toBeDefined())
    });
    describe("valid", () => {
        it('exist', ()=>expect(R1.is).toBeDefined())
    });
});
describe("R2", () => {
    describe("constructor", () => {
        describe("#from", () => {
            describe("#fromByte", () => {
                describe("正常系", () => {
                    it.each([1,2,4,8,16,32,64,128,256,512,1024,R1.c.maxSize].map(v=>[v]))('%p',(v)=>{
                        const ins = new R2(v);
                        expect(ins).toBeInstanceOf(R2);
                        expect(ins.byte).toBe(v);
                    });
                    
                });
                describe("異常系", () => {
                    it.each([0,1,3,5,6,7,9,10,11,12,13,14,15,17,18,19,20,21].map(v=>[v]))('%p',(v)=>{
//                        try {
//                        new R2(v);
//                        } catch(e) {console.log('Throw:', e)}
//                        assertThrow(RError, 'a', new R2(v))
                        new R2(v);
                    });

                });
                /*
                */
            });
            describe("#fromBin", () => {

            });
            describe("#fromStr", () => {

            });
            describe("RError", () => {

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
        it('exist', ()=>expect(R1.is).toBeDefined())
    });
    describe("valid", () => {
        it('exist', ()=>expect(R1.is).toBeDefined())
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
        const id = R1.new(16);
        expect(id.byte).toBe(16);
        expect(id.bin.byteLength).toBe(16);
    });

    it("should correctly convert between Gid, Uint8Array, and Base64URL string", () => {
        const original = R1.new(12);
        
        // Static methods toStr / toBin
        const str = R1.toStr(original.bin);
        const bin = R1.toBin(original.str);

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
        expect(() => R1.toBin("invalid/string+")).toThrow();
        expect(() => R1.toBin("")).toThrow();
    });

    it("should throw an error for invalid Uint8Array inputs", () => {
        expect(() => R1.toStr(new Uint8Array(0))).toThrow();
        expect(() => R1.toStr([1, 2, 3])).toThrow();
    });
});
*/
