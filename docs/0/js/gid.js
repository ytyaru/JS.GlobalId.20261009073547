class Is {
    static byte(v) {return Number.isSafeInteger(v) && 0<v}
    static bin(v) {v instanceof Unit8Array && 0<v.byteLength}
    static str(v) {return 'string'===typeof v && /^[A-Za-z0-9\-_]+$/.test(v)}
}
class Valid {
    static byte(v) {if (!Is.byte(v)) {throw new Error("Byte length must be a positive number.");}}
    static bin(v) {if (!Is.bin(v)) {throw new Error("Argument must be a Uint8Array. The byteLength must be 1 or greater.");}}
    static str(v) {if (!Is.str(v)) {throw new Error("Argument must be Base64URL. Only strings matching the regular expression `/^[A-Za-z0-9\-_]+$/` are valid.")}
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
    constructor(value=8) {this._ = Gid.#from(v);}
    static #from(v) {
        if (Is.byte(v)) {return this.#fromByte(v)}
        else if (Is.str(v)) {return this.#fromStr(v)}
        else if (Is.bin(v)) {return this.#fromBin(v)}
        else {throw new TypeError(`valueはByte数、Base64URL文字列、Uint8Arrayのいずれかであるべきです。どの型も数や長さは1以上であるべきです。`)}
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
}
