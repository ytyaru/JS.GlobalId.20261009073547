export class RError extends Error {constructor(msg,options) {super(msg,options); this.name='RError'}}
class C {// Constant
    // crypto.getRandomValues() 仕様上限 64 KiB = 65536 B = 524288 bit
    static #maxSize = 65536;
    static #b64u = /^[A-Za-z0-9\-_]+$/;
    static get maxSize() {return this.#maxSize}
    static get b64u() {return this.#b64u}
}

class Is {
    //static byte(v) {return Number.isSafeInteger(v) && 0<v && v<=C.maxSize}
    static byte(v, bFn) {return Number.isSafeInteger(v) && 0<v && v<=C.maxSize && (bFn ? bFn(v) : true)}
    static bin(v) {return v instanceof Uint8Array && 0<v.byteLength && v.byteLength<=C.maxSize}
    static str(v) {return 'string'===typeof v && C.b64u.test(v)}
    static #bFn = Object.freeze({
        R1: null,
        R2() {return 0 < b && ((b & (b - 1)) === 0)},
        R3() {return 0===(b % 3)},
    });
    static get bFn() {return this.#bFn}
}
class Valid {
    // バイト長は1〜65536までの整数であるべきです。
    static byte(v,bFn) {if (!Is.byte(v,bFn)) {throw new RError(`Byte length must be an integer between 1 and ${C.maxSize}.`);}}
    // 引数はUint8Arrayであるべきです。bytelengthは1〜65536であるべきです。
    static bin(v) {if (!Is.bin(v)) {throw new RError(`Argument must be a Uint8Array. The byte length must be between 1 and ${C.maxSize}.`);}}
    // 引数はBase64URLであるべきです。正規表現 /^[A-Za-z0-9\-_]+$/ に合致する文字列のみ有効です。
    static str(v) {if (!Is.str(v)) {throw new RError(`Argument must be Base64URL-encoded. Only strings matching the regular expression ${C.b64u} are valid.`)}}
}
export class Bin64 { // Base64URL ↔ Uinit8Array
    static b2s(bin) {
        Valid.bin(bin);
        return btoa(String.fromCharCode(...bin))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
    static s2b(b64url) {
        Valid.str(b64url);
        const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
        return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    }
}
// IDやUniqueは誇張である。同一性を担保できる保証はなくあくまで衝突確率は常に存在する。まだRandomのほうが事実に近い。最もRandomさえも真性乱数なわけではないため正確ではないが。
// R1: 1Byte(8bit)単位。ファイルサイズ単位で有利だがBase64URL表現上は端数が発生しうる。
// R2: 2のN乗Byte単位。ファイルサイズ単位で有利だがBase64URL表現上は端数が発生する。(1,2,4,8,16,32,64,128,256,...)
// R3: 3Byte(24bit)単位。端数が発生しないためBase64URL表現上すべての文字は64字種のどれかになる。但し2のN乗には合致しない。
class R {
    /**
     * @param {number} [byte=8] 生成するバイト数
     */
    constructor(v=8, bFn) {this._ = {...R.#from(v, bFn), bFn};}
//    constructor(v=8, bFn) {this._ = {bFn}; console.log('this._:',this._); this._={...this._, ...R.#from(v)};}
    static #from(v,bFn) {
        if (Is.byte(v,bFn)) {return this.#fromByte(v,bFn)}
        else if (Is.str(v)) {return this.#fromStr(v)}
        else if (Is.bin(v)) {return this.#fromBin(v)}
        else {throw new RError(`The value must be a byte count, a Base64URL string, or a Uint8Array. For any of these types, the quantity or length must be at least 1.`)}
    }
    static #fromByte(byte,bFn) { const bin = this.#randomBin(byte,bFn); return { bin, str:Bin64.b2s(bin) } }
    static #fromBin(bin) { return { bin, str:Bin64.b2s(bin) } }
    static #fromStr(str) { return { bin:Bin64.s2b(str), str } }
    static #randomBin(byte,bFn) {Valid.byte(byte,bFn); return crypto.getRandomValues(new Uint8Array(byte));}
    get byte() {return this._.bin.byteLength}
    get bin() {return this._.bin}
    get str() {return this._.str}
//    get len() {return 0===this._.bin.byteLength ? 0 : Math.ceil((bytesCount * 4) / 3)}
    static toStr(v) {return this.#from(v,this._.bFn).str}
    static toBin(v) {return this.#from(v,this._.bFn).bin}
    static new(v) {return new Gid(v)}
    // exportされない以下クラスを参照できるようにする
    static get c() {return C}
    static get is() {return Is}
    static get valid() {return Valid}
}
export class R1 extends R {// byte: 制限なし
    constructor(v=8) {super(v, Is.bFn.R1)}
}
export class R2 extends R {// byte: 2のN乗であること
    //constructor(v=8) {super(v, b=>0 < b && (b & (b - 1)) === 0)}
    constructor(v=8) {super(v, Is.bFn.R2)}

}
export class R3 extends R {// byte: 3の倍数であること
    //constructor(v=8) {super(v, b=>0===(b % 3))}
    constructor(v=8) {super(v, Is.bFn.R3)}
}

