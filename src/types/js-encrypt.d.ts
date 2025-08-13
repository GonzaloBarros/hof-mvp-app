declare module 'js-encrypt' {
    export class JSEncrypt {
      constructor(options?: any);
      setPublicKey(key: string): void;
      setPrivateKey(key: string): void;
      encrypt(text: string): string | false;
      decrypt(text: string): string | false;
    }
  }
  