/* - CowF syntax -

{ =) } => Function || Function Call
{ => } => Let
{ :> } => assign

--- EXAMPLE

=) cowf

<::>
  <key: value>
<::>

*/


const COWF = {
  getBlock: (string: string, startingIndex: number, delim: string): string => {
    // Get the next delim index
    let delimIndex = string.indexOf(delim, startingIndex);
    // If the delim is not found, return the rest of the string
    if (delimIndex === -1) {
      return string.substring(startingIndex);
    }

    // Otherwise, return the block of the string
    return string.substring(startingIndex, delimIndex);
  },

  findCowfBody: (string: string) => {
    // Find the first <::>
    let headerIndex = string.indexOf("<::>");
    // If the header is not found, return -1
    if (headerIndex === -1) {
      return -1;
    }
    
  },

  splitArrayByDelim: (arr: string[], delim: string) => {
    // Split the array by the delim
    let chunks = []
    let currentChunk = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === delim) {
        chunks.push(currentChunk);
        currentChunk = [];
      } else {
        currentChunk.push(arr[i]);
      }
    }
  },

  extractKeyTag: (string: string): string => {
    /* <{ KEY }: { VALUE }> => <foo: "bar"> */

    let trimmed
    
    return ''
  },
  
  parse: function(text: string): string {
    var split: string[] = text.split(/\b|\s/g);
    var contextBucket: string[] = [];
    var returnObj: Record<string, any> = {};

    // Remove empty
    var split = split.filter((item) => item.trim() !== '');
    
    const states = {
      arrayBlock: {
        active: false,
        openCount: 0,
        closeCount: 0
      },
      sawBlock: {
        active: false,
        openCount: 0,
        closeCount: 0
      },
    };

    split.forEach((word, i) => {
      const trimmedWord: string = word.trim();

      const startsWith = (prefix: string) => trimmedWord.startsWith(prefix);
      const endsWith = (suffix: string) => trimmedWord.endsWith(suffix);
      
    });

    console.log(split);

    return '';
  },
};

COWF.parse(`
=) cowf

<::>
  <key: value>
<::>
`)

// module.exports = COWF;