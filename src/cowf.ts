import { COWC, CowErr, COWBinSeq, COWMap, COWStack, COWI, IterPointer } from './COWC'
import { COWCProp } from './COWCProp'
import { COWCState } from './COWCState'
import { CowSM } from './cows'


/* - CowF syntax -

=) => Function || Function Call
=} => Object
=] => Array
=> => Init as Any type
:> => assign
:: => Lazy Existance-is-valid assignment (If exists, then assign)
!: => Lazy Existance-is-invald assignment (If not exists, then assign)

<::> .. <::> => Static COWML (COW Markup Language)
<..> .. <..> => Modular COWML (COW Markup Language)
*/

/*
<::> will produce a document which templates Documents into:
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- HEADER_CORE -->
    {{ <HEADER_CORE> }}
    <!-- SCRIPT_SRC_CACHE -->
    {{ <SCRIPT_SRC_CACHE> }}
  </head>
  <body>
    <!-- DOCUMENT_CORE -->
    {{ <DOCUMENT_CORE> }}
  </body>
  </html>

<..> will only produce:
  {{ <HEADER_CORE> }}
  {{ <DOCUMENT_CORE> }}

Not reccomended, but available; <;;>:
  <;;> will produce:
    {{ <HEADER_CORE> }}
    <cowf-static-element data-cowf="">
      {{ <DOCUMENT_CORE> }}
    </cowf-static-element>
*/

/*
- cache is a global variable that stores the cowf cache,
it is global so that it can be accessed from anywhere in any code when defined.

- cache.VIEW is the HTML that will be served to the user when fowd mode.

will be 'truefalse' if nonexistant.

COMMENTS:
// Comment,
# Comment,
/ * / Multiline Comment, / * /
-- Single Line Comment,
--- Single Line Comment (Header in HeaderCow),

--- EXAMPLE

=) fowd
// =) fowd: 8000

=> Viewport: <::>
  <div: #I-am-ID .I-am-Class {
    <hey: "Hey">
    <p: {
      I'm a syntax!
      WOO!
    } embeded_code: {
      this.innerHTML += "\nI'm embedded code!";
    }>
  }>
<::>

---

if cache.VIEW | cache.VIEW :> EXAMPLE.Viewport

*/

const {
  CowErr,
  COWBinSeq,
  COWMap,
  COWStack,
  COWI,
  IterPointer,
} = COWC

// const Assignment = new class ASSG extends (COWCState<ASSG>) {
//   makeFunction = (name: string, cb: any, stack: COWI) => {
//     return stack.functStack.push(new class PreFN extends (COWCProp<PreFN>) {
//       name = name
//       value = cb
//     });
//   }

//   makeVar = (name: string, value: any, stack: COWI) => {
//     return stack.varStack.push(new class PreVar extends (COWCProp<PreVar>) {
//       name = name
//       value = value
//     })
//   }

//   getLastVar = (stack: COWI) => {
//     return stack.varStack.get(stack.varStack.size - 1);
//   }
// }

const syntaxExample = `

// 
  COWF is like a cool cascading stack ML thing

  COWF takes values as a mini stack.

  Imagine a block above each statement, and requrirements to be met.
  If we make a function dec, we expect params.

  You could implicitly make a function and define params!
  =) hey [wow] {
    <= console.log
  }

  Globally, you have 
  _ as the mini stack
  @ as stack Names
  $ as this
  <= calls with stack
  (: as add to stack

  In COWF, we could make a param list and feed it into a function.

  CowF Blocks follow a markuplike syntax:
  It still allows for assg dec, but typeless props can be made like an object.
//

=) cowf {
  #1 args [ 'base' ]
  
  =} block {
    #1 args []

    args: ['I have not captured anything since am empty now']
  }

  =) [wow] {
    # Expect { wow: 2, base: 1 } #
    :> @.1 1
    :> @.2 2
  }
 
  =) args {
    # Expect { base: 1, null: 2 } #
    :> @.1 1
    :> @.2 2
  }

  =) {
    # Expect { null: 1, null: 2 } #
    :> @.1 1
    :> @.2 2
  }
}

// 
  While in a COW FN block, you can use the following syntax:
  - @ is the args props names, this is useful when handling 
    data formats and would like to arrange arguements with templating.
  - Function properties and internals cascade above the callback
  - Cascading defaults are defined with #, and can have a level of precedence above others.
// 

// Callbacks 
=> window: <::>
  
<::>
`


export const COWF = class COWF extends (COWCProp<COWF>) {
  parse = (text: string) => {
    let split = COWC.splitText(text)
    console.log(split);

    let t = this.parseTokens(split)
    console.log(t);
  }

  parseTokens = (tokens: string[]) => {
    let stack = new COWI;

    let resBucket = [] as any[]

    if (tokens.length === 0) return;

    const iterPointer = new IterPointer(tokens);

    for (; iterPointer.i < tokens.length; iterPointer.inc())
      this.parseToken(iterPointer, stack, resBucket);

    return resBucket;
  }

  parseToken = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let mode = stack.mode[stack.mode.length - 1]
    this[mode](iterPointer, stack, resBucket);
  }

  global = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    let choice: string;
    switch (true) {
      case token == '=)': this.handleFN(iterPointer, stack, resBucket);
        break;
      case token == '=}': this.handleObj(iterPointer, stack, resBucket);
        break;
      case token == '<::>': this.handleStatic(iterPointer, stack, resBucket);
        break;
      case token == '<..>': this.handleModular(iterPointer, stack, resBucket);
        break;
      case token == '<;;>': this.handleJTag(iterPointer, stack, resBucket);
        break;
    }
    this[choice as any]
  }

  handleFN = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    stack.mode.push('assg');
    stack.lossyStack.push({
      name: '',
      value: '',
      type: 'function',
    });
  }

  handleStatic = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    stack.mode.push('doc');
    stack.lossyStack.push({
      name: '',
      value: {
        header: '',
        document: '',
        script: ''
      },
      type: ':doc',
    })
  }

  handleModular = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    stack.mode.push('doc');
    stack.lossyStack.push({
      name: '',
      value: {
        header: '',
        document: '',
      },
      type: '.doc',
    })
  }

  handleJTag = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    stack.mode.push('doc');
    stack.lossyStack.push({
      name: '',
      value: {
        header: '',
        document: '',
      },
      type: ';doc',
    })
  }

  block = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }

  fn = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }

  args = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }

  prop = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }

  doc = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }

  assg = (iterPointer: IterPointer, stack: COWI, resBucket: any[]) => {
    let token = iterPointer.val;

    switch (token) {
      default: break;
    }
  }
}


console.log(
  (new COWF).parse(syntaxExample),
  CowSM
)


try { (window as any).COWF = COWF } catch { }
try { module.exports.COWF = COWF } catch { }