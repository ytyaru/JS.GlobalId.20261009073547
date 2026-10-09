export class Gid {
    /**
     * @param {number} [byte=8] 生成するバイト数
     */
    constructor(byte = 8) {
        if (typeof byte !== 'number' || byte <= 0) {
            throw new Error("Byte length must be a positive number.");
        }
        
        // Bun / Web標準の crypto.getRandomValues を使用
        const bin = new Uint8Array(byte);
        crypto.getRandomValues(bin);
        
        this._ = {
            bin,
            str: Gid._binToBase64URL(bin)
        };
    }

    get byte() {
        return this._.bin.byteLength;
    }

    get bin() {
        return this._.bin;
    }

    get str() {
        return this._.str;
    }

    /**
     * 指定バイト数のランダムなBase64URL文字列を直接返す
     */
    static toStr(byte = 8) {
        return new Gid(byte).str;
    }

    /**
     * 指定バイト数のランダムなUint8Arrayを直接返す
     */
    static toBin(byte = 8) {
        return new Gid(byte).bin;
    }

    /**
     * Base64URL文字列から Gid インスタンスを復元する
     */
    static fromStr(v) {
        const bin = Gid._base64URLToBin(v);
        const instance = new Gid(1); // ダミー作成後に値を置き換え
        instance._ = {
            bin,
            str: v
        };
        return instance;
    }

    /**
     * Uint8Arrayから Gid インスタンスを復元する
     */
    static fromBin(v) {
        if (!(v instanceof Uint8Array)) {
            throw new Error("Argument must be a Uint8Array.");
        }
        const instance = new Gid(1);
        instance._ = {
            bin: v,
            str: Gid._binToBase64URL(v)
        };
        return instance;
    }

    static new(byte = 8) {
        return new Gid(byte);
    }

    // --- 内部ヘルパー (Base64URL 相互変換) ---

    static _binToBase64URL(uint8Array) {
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static _base64URLToBin(base64url) {
        let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
}
