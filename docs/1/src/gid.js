export class GidError extends Error {constructor(msg,options) {super(msg,options); this.name='GidError'}}
class C {// Constant
    // crypto.getRandomValues() 仕様上限 64 KiB = 65536 B = 524288 bit
    static #maxSize = 65536;
    static #b64u = /^[A-Za-z0-9\-_]+$/;
    static get maxSize() {return this.#maxSize}
    static get b64u() {return this.#b64u}
}
class Is {
    static byte(v) {return Number.isSafeInteger(v) && 0<v && v<=C.maxSize}
    static bin(v) {return v instanceof Uint8Array && 0<v.byteLength && v.byteLength<=C.maxSize}
    static str(v) {return 'string'===typeof v && C.b64u.test(v)}
}
class Valid {
    // バイト長は1〜65536までの整数であるべきです。
    static byte(v) {if (!Is.byte(v)) {throw new GidError(`Byte length must be an integer between 1 and ${C.maxSize}.`);}}
    // 引数はUint8Arrayであるべきです。bytelengthは1〜65536であるべきです。
    static bin(v) {if (!Is.bin(v)) {throw new GidError(`Argument must be a Uint8Array. The byte length must be between 1 and ${C.maxSize}.`);}}
    // 引数はBase64URLであるべきです。正規表現 /^[A-Za-z0-9\-_]+$/ に合致する文字列のみ有効です。
    static str(v) {if (!Is.str(v)) {throw new GidError(`Argument must be Base64URL-encoded. Only strings matching the regular expression ${C.b64u} are valid.`)}}
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
export class Gid {
    /**
     * @param {number} [byte=8] 生成するバイト数
     */
    constructor(v=8) {this._ = Gid.#from(v);}
    static #from(v) {
        if (Is.byte(v)) {return this.#fromByte(v)}
        else if (Is.str(v)) {return this.#fromStr(v)}
        else if (Is.bin(v)) {return this.#fromBin(v)}
        else {throw new GidError(`The value must be a byte count, a Base64URL string, or a Uint8Array. For any of these types, the quantity or length must be at least 1.`)}
    }
    static #fromByte(byte) { const bin = this.#randomBin(byte); return { bin, str:Bin64.b2s(bin) } }
    static #fromBin(bin) { return { bin, str:Bin64.b2s(bin) } }
    static #fromStr(str) { return { bin:Bin64.s2b(str), str } }
    static #randomBin(byte) {Valid.byte(byte); return crypto.getRandomValues(new Uint8Array(byte));}
    get byte() {return this._.bin.byteLength}
    get bin() {return this._.bin}
    get str() {return this._.str}
    static toStr(v) {return this.#from(v).str}
    static toBin(v) {return this.#from(v).bin}
    static new(v) {return new Gid(v)}
    // exportされない以下クラスを参照できるようにする
    static get c() {return C}
    static get is() {return Is}
    static get valid() {return Valid}
}

