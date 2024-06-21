import { COWC } from './COWC'

/* COW bytecode

global operations:
1010: Control flow
1110: Get - Get from Scope
1111: Call - clones a var

Call
1111
.... // name
1010 // control

Get
1110
.... // name
1010 // control

magic
0100 0011  0100 1111
0101 0111  0100 0011
0101 1111  0100 0010
0100 0011  0101 1111
0100 1000  0100 0001
0100 1001  0011 0000
0000 0000  0000 0000
0000 0000  0000 0000
COWC_BC_HAI0

Control flow Data types

scope
1010 // Control
1000 // Scope
.... // Name
1010 // Control
.... // Scope
1010 // End

var
1010 // Control
0001 // Variable
.... // Name
1010 // Control
.... // Variable Data
1010 // End

func
1010 // Control
0010 // Function
0000 // Flags 1
.... // Name
1010 // Control
.... // Params
1010 // Control
.... // Function Data
1010 // end
*/

class COWBC {
  static header = new COWC.COWBinSeq(`
    0100 0011  0100 1111
    0101 0111  0100 0011
    0101 1111  0100 0010
    0100 0011  0101 1111
    0100 1000  0100 0001
    0100 1001  0011 0000
    0000 0000  0000 0000
    0000 0000  0000 0000
  `)

  static makeBlock(name: string, value: string) {
    return new COWC.COWBinSeq(`
      ${name}
      ${value}
      1010     End
    `)
  }

  static makeContBlock(value: string) {
    return this.makeBlock(
      `1010`,
      value
    )
  }

  static makeVar(name: string, value: string) {
    return this.makeContBlock(`
      0001     Variable
      1010     Control
      ${name}
      1010     Control
      ${value}
    `)
  }

  static makeFn(name: string, params: string, body: string) {
    return this.makeContBlock(`
      0010     Function
      1010     Control
      ${params}
      1010     Control
      ${body}
    `)
  }

  static makeCall(name: string, params: string) {
    return new COWC.COWBinSeq(`
      1111     Call
      1010     Control
      ${name}
      1010     Control
      ${params}
      1010     End
    `)
  }

  static makeGet(name: string, scope: string) {
    return new COWC.COWBinSeq(`
      1110     Get
      1010     Control
      ${name}
      1010     Control
      ${scope}
      1010     End
    `)
  }

  static stringToBin(str: string) {
    let bin = new COWC.COWBinSeq
    for (let i = 0; i < str.length; i++) {
      let binChar = Number(str.charCodeAt(i).toString(2))
      bin.push(binChar as 0 | 1)
    }
    return bin
  }

  static binToString(bin: typeof COWC.COWBinSeq) {
    let str = ''
    for (let i = 0; i < bin.length; i++) {
      str += String.fromCharCode(parseInt(bin.get(i).toString(), 2))
    }
    return str
  }

  static hasHeader(bin: InstanceType<typeof COWC.COWBinSeq>) {
    return bin.toString().startsWith(COWBC.header.toString())
  }

  static splitHeader(bin: InstanceType<typeof COWC.COWBinSeq>) {
    if (!COWBC.hasHeader(bin)) return ['', bin]
    let header = COWBC.header.toString()
    let txt = bin.toString().slice(header.length)
    return [header, new COWC.COWBinSeq(txt)]
  }
}