/**
 * Each token is a single unit of the source code written in JavaScript programming language.
 * The lexer will create an array of these tokens for a given JS source code.
 */
type Token = {
    type: string;
    value: string;
    line: number;
    column: number;
}

export class JavaScriptLexer {
    // All kinds of tokens we are looking for.
    static TOKEN_TYPES = {

        KEYWORD: "KEYWORD",

        // An identifier is the name of anything defined by the user
        IDENTIFIER: "IDENTIFIER",

        // Literals
        NUMBER: 'NUMBER',
        STRING: 'STRING',
        TEMPLATE_STRING: 'TEMPLATE_STRING',
        REGEX: 'REGEX',
        BOOLEAN: 'BOOLEAN',
        NULL: 'NULL',

        // Operators (can be mathematical, logical, or bitwise)
        OPERATOR: 'OPERATOR',

        PUNCTUATION: 'PUNCTUATION',

        COMMENT: 'COMMENT',

        WHITESPACE: 'WHITESPACE',

        EOF: 'EOF' //End of file
    };

    // Keywords of the JavaScript programming language
    static KEYWORDS = new Set([
        // Declaration keywords
        'var', 'let', 'const', 'function', 'class', 'import', 'export',

        // Control flow keywords
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'break', 'continue', 'return', 'throw', 'try', 'catch', 'finally',

        // Literals
        'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',

        // All the other keywords (we do not categorize them into a specific group at this time)
        'this', 'super', 'new', 'typeof', 'instanceof', 'void', 'delete',
        'in', 'of', 'with', 'yield', 'await', 'async'
    ]);

    static OPERATORS = new Set([
        '+', '-', '*', '/', '%', '**', '++', '--',
        '=', '+=', '-=', '*=', '/=', '%=', '**=',
        '==', '===', '!=', '!==', '>', '<', '>=', '<=',
        '!', '&&', '||', '??', '?.',
        '&', '|', '^', '~', '<<', '>>', '>>>',
        '&=', '|=', '^=', '<<=', '>>=', '>>>',
        '=>', '...'
    ]);

    static PUNCTUATION = new Set(['(', ')', '[', ']', '{', '}', ',', ';', ':', '.']);

    private readonly code: string;
    private position: number;
    private line: number;
    private column: number;
    private tokens: Token[];

    constructor(code: string) {
        this.code = code;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }

    private isWhitespace(char: string) {
        return /[\s\t\r\n]/.test(char);
    }

    private isDigit(char: string) {
        return /[0-9]/.test(char);
    }

    private isLetter(char: string) {
        return /[a-zA-Z_]/.test(char);
    }

    private isAlphaNumeric(char: string) {
        return this.isLetter(char) || this.isDigit(char);
    }

    /**
     * Allows you to look up the character in a specific position (current position of the lexer + offset) of
     * the input code. using this function doesn't change the position of the lexer in your code.
     */
    private peek(offset: number = 0): string {
        const _position = this.position + offset;
        if (_position < this.code.length)
            return this.code[_position] ?? '\0';
        else
            return '\0';
    }

    /**
     * Returns the current character of the source code and also moves the offset of the code reader by one.
     *  TODO: This should return the character that was advanced over.
     */
    private advance() {
        const currentCharacter = this.peek();
        if (currentCharacter === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        this.position++;

        return currentCharacter;
    }

    /**
     *  Allows you to skip white spaces inside the source code until you get to meaningful parts of the code base.
     */
    private skipWhiteSpace() {
        while (this.isWhitespace(this.peek()))
            this.advance();
    }

    /**
     * Reads a number from the source code and returns it as a token.
     */
    private tokenizeNumber(): Token {
        let number = '';
        let hasDot = false;
        let hasExponent = false;

        while (this.isDigit(this.peek()) || (!hasDot && this.peek() === '.') || (!hasExponent && (this.peek() === 'e' || this.peek() === 'E'))) {
            const currentCharacter = this.peek();

            if (currentCharacter === '.') {
                if (hasDot) break;
                hasDot = true;
            } else if (currentCharacter === 'e' || currentCharacter === 'E') {
                if (hasExponent) break;
                hasExponent = true;
                number += this.advance();

                // If your exponential number has a character 'e' or 'E' inside it, right after that character, there might be a sign (+ or -)
                if (this.peek() === '+' || this.peek() === '-')
                    number += this.advance();

                continue;
            }
            number += this.advance();
        }

        return {
            type: JavaScriptLexer.TOKEN_TYPES.NUMBER,
            value: number,
            line: this.line,
            column: this.column - number.length
        };

    }

    /**
     * A normal string (non-templated) in JavaScript starts with either ' or ".
     */
    private tokenizeString(quoteCharacter: string): Token {
        let string = quoteCharacter;
        this.advance(); // The opening quote character has already been added to the string, so we skip it

        while (this.peek() !== quoteCharacter && this.peek() !== '\0') {
            if (this.peek() === "\\") {
                string += this.advance(); // Add the backslash to the string
                if (this.peek() !== '\0') {
                    string += this.advance(); // Add the escaped character to the string
                }
            } else {
                string += this.advance();
            }
        }

        if (this.peek() === quoteCharacter) {
            string += this.advance(); // Add the closing quote character to the string
        }

        return {
            type: JavaScriptLexer.TOKEN_TYPES.STRING,
            value: string,
            line: this.line,
            column: this.column - string.length
        };
    }

    /**
     * Template strings in JavaScript are opened and closed with a backtick.
     */
    private tokenizeTemplateString(): Token {
        let templateString = '`';
        this.advance(); // The opening backtick has already been added to the string so we skip it.

        while (this.peek() !== '`' && this.peek() !== '\0') {
            if (this.peek() === '\\') {
                templateString += this.advance(); // Add the backslash to the string
                if (this.peek() !== '\0') {
                    templateString += this.advance(); // Add the escaped character which comes after the backslash
                }
            } else if (this.peek() === '$' && this.peek(1) === '{') {
                templateString += this.advance(); // Add '$'
                templateString += this.advance(); // Add '{'
                // For the sake of simplicity, we're considering the whole template as one token
                // TODO : Each one of the expressens inside a template string should be further tokenized.
            } else {
                templateString += this.advance();
            }
        }

        if (this.peek() === '`') {
            templateString += this.advance(); // Add the closing backtick to the string
        }

        return {
            type: JavaScriptLexer.TOKEN_TYPES.TEMPLATE_STRING,
            value: templateString,
            line: this.line,
            column: this.column - templateString.length
        };
    }

    private tokenizeIdentifier(): Token {
        let identifier = '';

        while (this.isAlphaNumeric(this.peek()))
            identifier += this.advance();

        if (JavaScriptLexer.KEYWORDS.has(identifier)) {
            const type = identifier === 'true' || identifier === 'false'
                ? JavaScriptLexer.TOKEN_TYPES.BOOLEAN
                : identifier === 'null'
                    ? JavaScriptLexer.TOKEN_TYPES.NULL
                    : JavaScriptLexer.TOKEN_TYPES.KEYWORD;

            return {
                type,
                value: identifier,
                line: this.line,
                column: this.column - identifier.length
            };
        }

        return {
            type: JavaScriptLexer.TOKEN_TYPES.IDENTIFIER,
            value: identifier,
            line: this.line,
            column: this.column - identifier.length
        };
    }

    private tokenizeComment(): Token {
        const startLine = this.line;
        const startColumn = this.column;
        let comment = '';

        if (this.peek(1) === '/') {
            // This is a single line comment
            this.advance(); // Read the first '/'
            this.advance(); // Read the second '/'
            comment = "//";

            while (this.peek() !== '\n' && this.peek() !== "\0") {
                comment += this.advance();
            }
        } else if (this.peek(1) === '*') {
            // This is a multi-line comment
            this.advance(); // Read the '/'
            this.advance(); // Read the '*'
            comment = "/*"

            while (!(this.peek() === '*' && this.peek(1) === '/') && this.peek() !== '\0') {
                comment += this.advance();
            }

            // After reading the whole comment, we need to make sure we have read the closing '*/' as well.
            if (this.peek() === '*') comment += this.advance();
            if (this.peek() === '/') comment += this.advance();
        }

        return {
            type: JavaScriptLexer.TOKEN_TYPES.COMMENT,
            value: comment,
            line: startLine,
            column: startColumn
        };
    }

    /**
     * If it doesn't manage to read any operators or punctuations, it will return null.
     */
    private tokenizeOperatorOrPunctuation(): Token | null {
        let operator = '';

        // Try to match the longest possible operator (longest operator in JS has 4 characters)
        for (let length = 4; length >= 1; length--) {
            const candidate = this.code.substring(this.position, this.position + length);

            if (JavaScriptLexer.OPERATORS.has(candidate)) {
                operator = candidate;
                break;
            } else if (JavaScriptLexer.PUNCTUATION.has(candidate)) {
                operator = candidate;
                break;
            }
        }

        if (operator) {
            for (let i = 0; i < operator.length; i++) {
                this.advance();
            }

            const type = JavaScriptLexer.OPERATORS.has(operator) ? JavaScriptLexer.TOKEN_TYPES.OPERATOR : JavaScriptLexer.TOKEN_TYPES.PUNCTUATION;

            return {
                type,
                value: operator,
                line: this.line,
                column: this.column - operator.length
            };
        }

        return null;
    }

    /**
     * The main part of this lexer which is in charge of the whole tokenization process.
     */
    public tokenize(): Token[] {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;

        while (this.position < this.code.length) {
            const currentCharacter = this.peek();

            if (this.isWhitespace(currentCharacter)) {
                this.skipWhiteSpace();
                continue;
            }

            // Comments
            if (currentCharacter === '/' && (this.peek(1) === '/' || this.peek(1) === '*')) {
                this.tokens.push(this.tokenizeComment());
                continue;
            }

            // Numbers
            if (this.isDigit(currentCharacter) || (currentCharacter === '.' && this.isDigit(this.peek(1)))) {
                this.tokens.push(this.tokenizeNumber());
                continue;
            }

            // Strings
            if (currentCharacter === '"' || currentCharacter === "'") {
                this.tokens.push(this.tokenizeString(currentCharacter));
                continue;
            }

            // Template strings
            if (currentCharacter === '`') {
                this.tokens.push(this.tokenizeTemplateString());
                continue;
            }

            // Identifiers and keywords
            if (this.isLetter(currentCharacter)) {
                this.tokens.push(this.tokenizeIdentifier());
                continue;
            }

            // Operators and punctuation
            const opToken = this.tokenizeOperatorOrPunctuation();
            if (opToken) {
                this.tokens.push(opToken);
                continue;
            }

            // If we get to this point, it's an unrecognized character
            this.tokens.push({
                type: 'UNKNOWN',
                value: currentCharacter,
                line: this.line,
                column: this.column
            });
            this.advance();
        }

        // Add an EOF token for finishing the source code
        this.tokens.push({
            type: JavaScriptLexer.TOKEN_TYPES.EOF,
            value: '',
            line: this.line,
            column: this.column
        });

        return this.tokens;
    }
}