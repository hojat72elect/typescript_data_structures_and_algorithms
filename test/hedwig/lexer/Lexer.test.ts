import {TokenType} from "../../../src/hedwig/lexer/TokenType";
import {JavaScriptLexer} from "../../../src/hedwig/lexer/JavaScriptLexer";


describe('JavaScriptLexer', () => {

    let lexer: JavaScriptLexer;

    beforeEach(() => {
        lexer = new JavaScriptLexer();
    });

    it('Tokenize a simple variable declaration', () => {
        const code = 'let x = 10;';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.KEYWORD, value: 'let', line: 1, column: 1},
            {type: TokenType.IDENTIFIER, value: 'x', line: 1, column: 5},
            {type: TokenType.OPERATOR, value: '=', line: 1, column: 7},
            {type: TokenType.NUMBER, value: '10', line: 1, column: 9},
            {type: TokenType.PUNCTUATION, value: ';', line: 1, column: 11},
            {type: TokenType.EOF, value: '', line: 1, column: 12},
        ]);
    });

    it('Tokenize a function declaration', () => {
        const code = 'function add(a, b) { return a + b; }';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.KEYWORD, value: 'function', line: 1, column: 1},
            {type: TokenType.IDENTIFIER, value: 'add', line: 1, column: 10},
            {type: TokenType.PUNCTUATION, value: '(', line: 1, column: 13},
            {type: TokenType.IDENTIFIER, value: 'a', line: 1, column: 14},
            {type: TokenType.PUNCTUATION, value: ',', line: 1, column: 15},
            {type: TokenType.IDENTIFIER, value: 'b', line: 1, column: 17},
            {type: TokenType.PUNCTUATION, value: ')', line: 1, column: 18},
            {type: TokenType.PUNCTUATION, value: '{', line: 1, column: 20},
            {type: TokenType.KEYWORD, value: 'return', line: 1, column: 22},
            {type: TokenType.IDENTIFIER, value: 'a', line: 1, column: 29},
            {type: TokenType.OPERATOR, value: '+', line: 1, column: 31},
            {type: TokenType.IDENTIFIER, value: 'b', line: 1, column: 33},
            {type: TokenType.PUNCTUATION, value: ';', line: 1, column: 34},
            {type: TokenType.PUNCTUATION, value: '}', line: 1, column: 36},
            {type: TokenType.EOF, value: '', line: 1, column: 37},
        ]);
    });

    it('Tokenize various types of numbers', () => {
        const code = '123 45.67 8.9e10 11E-2';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.NUMBER, value: '123', line: 1, column: 1},
            {type: TokenType.NUMBER, value: '45.67', line: 1, column: 5},
            {type: TokenType.NUMBER, value: '8.9e10', line: 1, column: 11},
            {type: TokenType.NUMBER, value: '11E-2', line: 1, column: 18},
            {type: TokenType.EOF, value: '', line: 1, column: 23},
        ]);
    });

    it('Tokenize strings with single and double quotes', () => {
        const code = `'hello' "world"`;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.STRING, value: `'hello'`, line: 1, column: 1},
            {type: TokenType.STRING, value: '"world"', line: 1, column: 9},
            {type: TokenType.EOF, value: '', line: 1, column: 16},
        ]);
    });

    it('Tokenize template strings', () => {
        const code = '`template string`';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.TEMPLATE_STRING, value: '`template string`', line: 1, column: 1},
            {type: TokenType.EOF, value: '', line: 1, column: 18},
        ]);
    });

    it('Tokenize comments', () => {
        const code = `
// single line comment
/* multi-line
   comment */
`;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.COMMENT, value: '// single line comment', line: 2, column: 1},
            {type: TokenType.COMMENT, value: '/* multi-line\n   comment */', line: 3, column: 1},
            {type: TokenType.EOF, value: '', line: 5, column: 1},
        ]);
    });

    it('Tokenize unknown characters', () => {
        const code = '@#$';
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.UNKNOWN, value: '@', line: 1, column: 1},
            {type: TokenType.UNKNOWN, value: '#', line: 1, column: 2},
            {type: TokenType.UNKNOWN, value: '$', line: 1, column: 3},
            {type: TokenType.EOF, value: '', line: 1, column: 4},
        ]);
    });

    it('should correctly report line and column numbers', () => {
        const code = `
let a = 1;
const b = "two";
    `;
        const tokens = lexer.tokenize(code);
        expect(tokens).toEqual([
            {type: TokenType.KEYWORD, value: 'let', line: 2, column: 1},
            {type: TokenType.IDENTIFIER, value: 'a', line: 2, column: 5},
            {type: TokenType.OPERATOR, value: '=', line: 2, column: 7},
            {type: TokenType.NUMBER, value: '1', line: 2, column: 9},
            {type: TokenType.PUNCTUATION, value: ';', line: 2, column: 10},
            {type: TokenType.KEYWORD, value: 'const', line: 3, column: 1},
            {type: TokenType.IDENTIFIER, value: 'b', line: 3, column: 7},
            {type: TokenType.OPERATOR, value: '=', line: 3, column: 9},
            {type: TokenType.STRING, value: '"two"', line: 3, column: 11},
            {type: TokenType.PUNCTUATION, value: ';', line: 3, column: 16},
            {type: TokenType.EOF, value: '', line: 4, column: 5},
        ]);
    });
});
