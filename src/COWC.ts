import { COWCProp } from './COWCProp';

type COWIModes = 'global' | 'block' | 'fn' | 'args' | 'prop' | 'doc' | 'assg';

export class COWC extends COWCProp<COWC> {
  static div = /\b|\s/g;

  static splitArrayByDelim = (arr: string[], delim: string) => {
    // Split the array by the delim
    let chunks = []
    let currentChunk = []
    for (let i = 0; i < arr.length; i++) if (arr[i] === delim) {
      if (!currentChunk.length) continue;
      chunks.push(currentChunk);
      currentChunk = [];
    }
    else currentChunk.push(arr[i]);

    if (currentChunk.length > 0)
      chunks.push(currentChunk);

    return chunks;
  }

  splitByBlock = (arr: string[], delims: [string, string]) => {
    let chunks = []
    let currentChunk = []
    let into = 0
    let outu = 0

    for (let i = 0; i < arr.length; i++) {
      let it = arr[i]
      let [bs, be] = delims;

      if (it === bs) into++;
      else if (it === be) outu++;

      let isDelim = (it === bs || it === be)

      if (into === outu) {
        if (!currentChunk.length) continue;
        chunks.push(currentChunk);
        currentChunk = [];
        into = 0;
        outu = 0;
      }
      else if (into > outu && !isDelim) currentChunk.push(arr[i]);
    }

    if (currentChunk.length > 0)
      chunks.push(currentChunk);

    return chunks;
  }

  static splitText(text: string): string[] {
    return text
      .split(COWC.div)
      .filter(item => item.trim() !== '')
  }

  static COWCProp = COWCProp;

  static COWMap = class COWMap extends Map implements COWCProp {
    // @head
    static self = this;
    self = this;
    p = COWMap;
  };

  static CowErr = class CowErr extends Error implements COWCProp {
    // @head
    static self = this;
    self = this;
    p = CowErr;

    constructor(message: string) {
      super(message);
      this.name = "CowErr";
    }

    toss = () => console.error(this);

    throw() {
      throw this;
    }
  };

  static COWStack = class Stack extends this.COWMap {
    push(state: any) {
      let len = this.size;
      this.set(len.toString(), state);
      return len;
    }

    pop() {
      let len = this.size;
      let dlen = len - 1;
      let state = this.get(`${dlen}`);
      this.delete(`${dlen}`);
      return state;
    }

    peek(index = 0) {
      return this.get(`${this.size - 1 - index}`);
    }

    isEmpty() {
      return this.size === 0;
    }

    toArray() {
      return [...this.values()];
    }
  };

  static COWBinSeq = class COWBinSeq {
    #stack = new COWC.COWStack;

    set(id: any, state: 1 | 0) {
      this.#stack.set(`${id}`, state);
    }

    push(state: 1 | 0) {
      return this.#stack.push(state);
    }

    put1() {
      return this.push(1);
    }

    put0() {
      return this.push(0);
    }

    get(i: number) {
      return this.#stack.get(`${i}`);
    }

    is(i: number) {
      return this.get(i) === 1;
    }

    toggle(ind: number) {
      let v = this.get(ind);
      let swap = v === 1 ? 0 : 1;
      this.set(ind, swap as 1 | 0);
    }

    pop() {
      return this.#stack.pop();
    }

    get stack() {
      return this.#stack;
    }

    toString() {
      let str = '';
      for (const [, state] of this.#stack)
        str += state;
      return str;
    }

    parse(str: string[] | string) {
      for (const state of str) if (state == '1' || state == '0')
        this.push(Number(state) as 1 | 0);
      return this;
    }

    constructor(str?: string[] | string) {
      str && this.parse(str);
    }

    matches(seq: string[] | string | COWBinSeq) {
      return this.toString() === seq.toString();
    }
  };

  static IterPointer = class IterPointer {
    IterPointer = IterPointer

    #i = 0;
    get i() {
      return this.#i;
    }
    set i(v) {
      this.#i = v;
    }

    inc(v = 1) {
      this.i += v;
    }

    dec(v = 1) {
      this.inc(-v)
    }

    constructor(public tokens: string[]) { }

    get(v = 0) {
      return this.tokens[this.i + v];
    }

    get val() {
      return this.get()
    }

    next(v = 1) {
      return this.get(v);
    }

    prev(v = 1) {
      return this.get(-v);
    }

    getSect(start: number, end: number) {
      return this.tokens.slice(this.i + start, end);
    }
  }

  static COWI = class COWI {
    mode = ['global'] as COWIModes[];
    prevMode(i = 1): COWIModes {
      return this.mode[this.mode.length - i - 1];
    }

    lossyStack = new COWC.COWStack;
    mainStack = new COWC.COWStack;
    functStack = new COWC.COWStack;
    varStack = new COWC.COWStack;
    finalStack = new COWC.COWStack;
  }

}

export type COWMap = InstanceType<typeof COWC.COWMap>;
export type CowErr = InstanceType<typeof COWC.CowErr>;
export type COWStack = InstanceType<typeof COWC.COWStack>;
export type COWBinSeq = InstanceType<typeof COWC.COWBinSeq>;
export type IterPointer = InstanceType<typeof COWC.IterPointer>;
export type COWI = InstanceType<typeof COWC.COWI>;