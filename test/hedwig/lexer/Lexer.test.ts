import {JavaScriptLexer} from "../../../src/hedwig/lexer/Lexer";

describe('JavaScriptLexer', () => {

    let lexer: JavaScriptLexer;

    beforeEach(() => {
        lexer = new JavaScriptLexer();
    });

    it('should tokenize a simple variable declaration', () => {
        const code = 'let x = 10;';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'KEYWORD', value: 'let', line: 1, column: 1},
            {type: 'IDENTIFIER', value: 'x', line: 1, column: 5},
            {type: 'OPERATOR', value: '=', line: 1, column: 7},
            {type: 'NUMBER', value: '10', line: 1, column: 9},
            {type: 'PUNCTUATION', value: ';', line: 1, column: 11},
            {type: 'EOF', value: '', line: 1, column: 12},
        ]);
    });

    it('should tokenize a function declaration', () => {
        const code = 'function add(a, b) { return a + b; }';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'KEYWORD', value: 'function', line: 1, column: 1},
            {type: 'IDENTIFIER', value: 'add', line: 1, column: 10},
            {type: 'PUNCTUATION', value: '(', line: 1, column: 13},
            {type: 'IDENTIFIER', value: 'a', line: 1, column: 14},
            {type: 'PUNCTUATION', value: ',', line: 1, column: 15},
            {type: 'IDENTIFIER', value: 'b', line: 1, column: 17},
            {type: 'PUNCTUATION', value: ')', line: 1, column: 18},
            {type: 'PUNCTUATION', value: '{', line: 1, column: 20},
            {type: 'KEYWORD', value: 'return', line: 1, column: 22},
            {type: 'IDENTIFIER', value: 'a', line: 1, column: 29},
            {type: 'OPERATOR', value: '+', line: 1, column: 31},
            {type: 'IDENTIFIER', value: 'b', line: 1, column: 33},
            {type: 'PUNCTUATION', value: ';', line: 1, column: 34},
            {type: 'PUNCTUATION', value: '}', line: 1, column: 36},
            {type: 'EOF', value: '', line: 1, column: 37},
        ]);
    });

    it('should tokenize different types of numbers', () => {
        const code = '123 45.67 8.9e10 11E-2';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'NUMBER', value: '123', line: 1, column: 1},
            {type: 'NUMBER', value: '45.67', line: 1, column: 5},
            {type: 'NUMBER', value: '8.9e10', line: 1, column: 11},
            {type: 'NUMBER', value: '11E-2', line: 1, column: 18},
            {type: 'EOF', value: '', line: 1, column: 23},
        ]);
    });

    it('should tokenize strings with single and double quotes', () => {
        const code = `'hello' "world"`;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'STRING', value: `'hello'`, line: 1, column: 1},
            {type: 'STRING', value: '"world"', line: 1, column: 9},
            {type: 'EOF', value: '', line: 1, column: 16},
        ]);
    });

    it('should tokenize template strings', () => {
        const code = '`template string`';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'TEMPLATE_STRING', value: '`template string`', line: 1, column: 1},
            {type: 'EOF', value: '', line: 1, column: 18},
        ]);
    });

    it('should tokenize comments', () => {
        const code = `
// single line comment
/* multi-line
   comment */
`;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'COMMENT', value: '// single line comment', line: 2, column: 1},
            {type: 'COMMENT', value: '/* multi-line\n   comment */', line: 3, column: 1},
            {type: 'EOF', value: '', line: 5, column: 1},
        ]);
    });

    it('should handle unknown characters', () => {
        const code = '@#$';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'UNKNOWN', value: '@', line: 1, column: 1},
            {type: 'UNKNOWN', value: '#', line: 1, column: 2},
            {type: 'UNKNOWN', value: '$', line: 1, column: 3},
            {type: 'EOF', value: '', line: 1, column: 4},
        ]);
    });

    it('should correctly report line and column numbers', () => {
        const code = `
let a = 1;
const b = "two";
    `;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: 'KEYWORD', value: 'let', line: 2, column: 1},
            {type: 'IDENTIFIER', value: 'a', line: 2, column: 5},
            {type: 'OPERATOR', value: '=', line: 2, column: 7},
            {type: 'NUMBER', value: '1', line: 2, column: 9},
            {type: 'PUNCTUATION', value: ';', line: 2, column: 10},
            {type: 'KEYWORD', value: 'const', line: 3, column: 1},
            {type: 'IDENTIFIER', value: 'b', line: 3, column: 7},
            {type: 'OPERATOR', value: '=', line: 3, column: 9},
            {type: 'STRING', value: '"two"', line: 3, column: 11},
            {type: 'PUNCTUATION', value: ';', line: 3, column: 16},
            {type: 'EOF', value: '', line: 4, column: 5},
        ]);
    });
});
