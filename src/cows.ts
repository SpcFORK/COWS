// CowStack Lang

class CowErr extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CowErr";
  }

  toss = () => console.error(this);

  throw() {
    throw this;
  }
};

const makeErr = (fnName: string, msg: string, node: CowNode) => {
  let e = new CowErr('')
  e.stack = `${fnName}: ${msg}\n-  `;
  e.cause = `Node at: ${node.index}:${node.thisReg}-${node.nextReg}`
    + `\n-  CSM`
  e.name = 'CowSM-Err';
  e.throw()
}

const makeErrNS = (fnName: string, node: CowNode) => (msg: string) => makeErr(fnName, msg, node)

class CowStatics {
  C_TRUE = true
  C_FALSE = false
  C_NUMBER = new Array(10).fill(0).map((_, i) => i)
  C_CHARS = (
    'abcdefghijklmnopqrstuvwxyz'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + '0123456789'
    + '#$%&*+-./:<=>?@^_`{|}~'
  )
  C_CHARS_LEN = this.C_CHARS.length
  
  ASG = (rest: any[], scope: CowScope, node: CowNode) => {
    let [name, value] = rest;

    let ens = makeErrNS('ASG', node)
    !name && ens('No name found')
    !value && ens('No value found')

    scope.values.set(name, value);
  }

  TAP = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, value] = rest;

    let ens = makeErrNS('TAP', node)
    !value && ens('No value found')

    scope.bucket.push(value);
  }

  PUT = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, name] = rest;

    let ens = makeErrNS('PUT', node)
    !name && ens('No Name found')

    scope.values.set(name, scope.bucket);
  }

  REC = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, name] = rest;

    let ens = makeErrNS('REC', node)
    !name && ens('No Name found')

    let stackRes = scope.values.get(name);
    !stackRes && ens(`No value found for ${name}`)

    scope.bucket = stackRes;
  }

  CLR = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, name] = rest;

    let ens = makeErrNS('CLR', node)
    !name && ens('No name found')

    scope.values.delete(name);
  }

  UBCK = (rest: any[], scope: CowScope, node: CowNode) => {
    scope.bucket = []
  }

  PRT = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, name] = rest;

    let ens = makeErrNS('PRT', node)
    !name && ens('No name found')

    console.log(scope.values.get(name));
  }

  PRB = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, name] = rest;

    let ens = makeErrNS('PRB', node)
    !name && ens('No name found')

    console.log(scope.bucket, name)
    console.log(scope.bucket[name]);
  }

  SWP = (rest: any[], scope: CowScope, node: CowNode) => {
    let [, i1, i2] = rest;

    let ens = makeErrNS('SWP', node)
    !i1 && ens('No i1 found')
    !i2 && ens('No i2 found')

    {
      [scope.bucket[i1], scope.bucket[i2]] = [scope.bucket[i2], scope.bucket[i1]];
    }
  }

  #jumpTo(i: number, scope: CowScope, t: CowSM) {
    let so = scope.stack.find(n => n.thisReg == i)
    if (!so) new CowErr(`No scope found at ${i}`).throw()
    t.iterRun(scope.stack, scope, so)
  }

  JMP = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [, i] = rest;

    let ens = makeErrNS('JMP', node)
    !i && ens('No Jump i found')

    this.#jumpTo(i, scope, t)
  }

  THEN = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [, i] = rest;

    let ens = makeErrNS('IF_JUMP', node)
    !i && ens('No Jump i found')

    !scope.bucket && ens('No bucket found')

    if (scope.bucket.every(v => !!v))
      this.#jumpTo(i, scope, t)
  }

  DRP = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [ws, ...restOf] = rest;

    let ens = makeErrNS('DRP', node)

    if (!ws) scope.bucket.pop()
    else for (const item of restOf)
      if (item && scope.bucket[item]) scope.bucket.splice(item, 1)
      else ens('No item found: ' + item)
  }

  // This imports a JS value directly into the bucket !!
  // This is for smarty smart people only !!
  IMP = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [, globalName] = rest;

    let ens = makeErrNS('ACC', node)
    !globalName && ens('No globalName found')

    let val = Reflect.get(globalThis, globalName)
    !val && ens(`No value found for ${globalName}`)

    scope.bucket.push(val)
  }

  PRP = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [, prop] = rest;

    let ens = makeErrNS('PRP', node)
    !prop && ens('No prop found')

    let fItem = scope.bucket.pop()
    !fItem && ens('No item found')

    let val = Reflect.get(fItem, prop)
    !val && ens(`No value found for ${prop}`)

    scope.bucket.push(val)
  }

  DOJ = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [ws, ...restOf] = rest;

    let ens = makeErrNS('DOJ', node)

    if (!ws) scope.bucket.map(eval)
    else for (const i of restOf) {
      let item = scope.bucket[i]

      if (item) scope.bucket[i] = new Function(
        'return ' + item
      )()
      else ens('No item found: ' + i)
    }
  }

  // ---
  // @ Math

  ADD = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    // () [a, b, ...] => a + b only
    // (a, b) [...] => a + b only

    let [ws, a, , b] = rest;

    let ens = makeErrNS('ADD', node)

    if (!ws) {
      a = scope.bucket.pop()
      b = scope.bucket.pop()
    }
    if (a && b)
      scope.bucket.push(a + b);
    else ens('No a or b found');
  }

  SUB = (rest: any[], scope: CowScope, node: CowNode, t: CowSM) => {
    let [ws, a, , b] = rest;

    let ens = makeErrNS('SUB', node)

    if (!ws) {
      b = scope.bucket.pop()
      a = scope.bucket.pop()
    }
    if (a && b) 
      scope.bucket.push(a - b);
    else ens('No a or b found');
  }
}

class CowScope {
  values: Map<string, any> = new Map(Object.entries(new CowStatics));
  children: CowScope[] = [];

  bucket: any[] = []

  constructor(
    public name: string,
    public stack: CowNode[],
    public parent: CowScope | null = null,
  ) {
    if (parent) parent.children.push(this);
  }
}

class CowNode {
  index: number;

  constructor(
    public code: string,
    public thisReg: number,
    public nextReg: number,
    public stack: CowNode[],
  ) {
    stack.push(this);
    this.index = stack.length - 1;
  }

  #next?: CowNode;
  #prev?: CowNode;

  get next(): CowNode | undefined {
    if (this.#next) return this.#next;
    let s = this.findNextReg(this.nextReg, this.index);
    if (!s) return undefined;
    this.#next = s;
    s.#prev = this;
    return s;
  }

  get prev(): CowNode | undefined {
    if (this.#prev) return this.#prev;
  }

  findNextReg(reg: number, i: number): CowNode | undefined {
    return this.stack
      .slice(i)
      .find((s) => s.thisReg === reg);
  }

  findReg(reg: number): CowNode | undefined {
    return this.stack
      .find((s) => s.thisReg === reg)
  }

  removeNext() {
    this.#next && (this.#next.#prev = undefined)
    this.#next = undefined;
  }

  removePrev() {
    this.#prev && (this.#prev.#next = undefined)
    this.#prev = undefined;
  }
}

export class CowSM {
  stack = [] as CowNode[];

  makeInst(code: string, thisReg: number, nextReg: number) {
    return new CowNode(code, thisReg, nextReg, this.stack);
  }

  load(stack: CowNode[] | [string, number, number][]) {
    // const everyIsArr = (arr: any[]) => 
    let [sNodes, sArrs] = [stack as CowNode[], stack as [string, number, number][]]

    if (!sNodes.every((a) => Array.isArray(a))) for (const node of sNodes)
      this.makeInst(node.code, node.thisReg, node.nextReg);

    else for (const [code, thisReg, nextReg] of sArrs)
      this.makeInst(code, thisReg, nextReg);

    return this.stack;
  }

  run() {
    let stackClone = this.stack.slice();

    let scope = new CowScope('global', stackClone);

    if (!stackClone.length) return;

    return this.iterRun(stackClone, scope);
  }

  iterRun(stackClone: CowNode[], scope: CowScope, node = stackClone[0]) {
    let instr = node;
    while (instr) {
      this.handle(scope, instr);
      instr = instr.next!;
    }

    return scope.bucket[scope.bucket.length - 1];
  }

  handle(scope: CowScope, instr: CowNode, t = this) {
    const [name, ...rest] = instr.code.split(/\b/);

    let v = scope.values.get(name);
    if (v) this.handleVar(v, rest, scope, instr, t);
    else throw new Error(`Instr ${name} not found`);
  }

  handleVar(v: any, rest: any[], scope: CowScope, instr: CowNode, t: CowSM) {
    let tv = typeof v
    if (tv == 'function') return this.handleFN(v, rest, scope, instr, t);
    this.handleVal(v, rest, scope);
  }

  handleFN(fn: Function, rest: any[], scope: CowScope, instr: CowNode, t: CowSM) {
    fn(rest, scope, instr, t);
  }

  handleVal(v: any, rest: any[], scope: CowScope) {
    let scopedItem = v;
    const isntSpace = (s: string) => s !== ' ';
    // V has props?
    if (typeof v === 'object')
      for (const item of rest) if (item in v && isntSpace(item)) scopedItem = v[item];

    scope.bucket.push(scopedItem);
    console.log(scope.bucket);
  }
}


/* 

a = 1
b = 2

c = a + b
print a + b

*/


let cow = new CowSM();
console.log(
  cow.load([
    ['C_NUMBER 1', 0, 1],
    ['C_NUMBER 4', 1, 2],
    ['C_NUMBER 2', 2, 3],
    ['ADD', 3, 4],
    ['ADD', 4, 5],
  ]),
  cow.run()
)