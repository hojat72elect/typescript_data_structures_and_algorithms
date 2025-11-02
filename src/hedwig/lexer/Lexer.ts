/**
 * Each token is a single unit of the source code written in JavaScript programming language.
 * The lexer will create an array of these tokens for a given JS source code.
 */
type Token = {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

/**
 * All kinds of tokens we are looking for.
 */
enum TokenType {
    KEYWORD = "KEYWORD",

    // An identifier is the name of anything defined by the user
    IDENTIFIER = "IDENTIFIER",

    // Literals
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    TEMPLATE_STRING = 'TEMPLATE_STRING',
    BOOLEAN = 'BOOLEAN',
    NULL = 'NULL',

    // Operators (can be mathematical, logical, or bitwise)
    OPERATOR = 'OPERATOR',

    PUNCTUATION = 'PUNCTUATION',

    COMMENT = 'COMMENT',

    //End of file
    EOF = 'EOF',

    // The character is not recognizable by our lexer
    UNKNOWN = 'UNKNOWN'
}

export class JavaScriptLexer {

    private readonly KEYWORDS = new Set([
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
    private readonly OPERATORS = new Set([
        '+', '-', '*', '/', '%', '**', '++', '--',
        '=', '+=', '-=', '*=', '/=', '%=', '**=',
        '==', '===', '!=', '!==', '>', '<', '>=', '<=',
        '!', '&&', '||', '??', '?.',
        '&', '|', '^', '~', '<<', '>>', '>>>',
        '&=', '|=', '^=', '<<=', '>>=', '>>>',
        '=>', '...'
    ]);
    private readonly PUNCTUATION = new Set(['(', ')', '[', ']', '{', '}', ',', ';', ':', '.']);

    private position: number;
    private line: number;
    private column: number;
    private tokens: Token[];

    constructor() {
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
    private peek(code: string, offset: number = 0): string {
        const _position = this.position + offset;
        if (_position < code.length)
            return code[_position] ?? '\0';
        else
            return '\0';
    }

    /**
     * Returns the current character of the source code and also moves the offset of the code reader by one.
     */
    private advance(code: string) {
        const currentCharacter = this.peek(code);
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
    private skipWhiteSpace(code: string) {
        while (this.isWhitespace(this.peek(code)))
            this.advance(code);
    }

    /**
     * Reads a number from the source code and returns it as a token.
     */
    private tokenizeNumber(code: string): Token {
        let number = '';
        let hasDot = false;
        let hasExponent = false;

        while (this.isDigit(this.peek(code)) || (!hasDot && this.peek(code) === '.') || (!hasExponent && (this.peek(code) === 'e' || this.peek(code) === 'E'))) {
            const currentCharacter = this.peek(code);

            if (currentCharacter === '.') {
                if (hasDot) break;
                hasDot = true;
            } else if (currentCharacter === 'e' || currentCharacter === 'E') {
                if (hasExponent) break;
                hasExponent = true;
                number += this.advance(code);

                // If your exponential number has a character 'e' or 'E' inside it, right after that character, there might be a sign (+ or -)
                if (this.peek(code) === '+' || this.peek(code) === '-')
                    number += this.advance(code);

                continue;
            }
            number += this.advance(code);
        }

        return {
            type: TokenType.NUMBER,
            value: number,
            line: this.line,
            column: this.column - number.length
        };

    }

    /**
     * A normal string (non-templated) in JavaScript starts with either ' or ".
     */
    private tokenizeString(code: string, quoteCharacter: string): Token {
        let string = quoteCharacter;
        this.advance(code); // The opening quote character has already been added to the string, so we skip it

        while (this.peek(code) !== quoteCharacter && this.peek(code) !== '\0') {
            if (this.peek(code) === "\\") {
                string += this.advance(code); // Add the backslash to the string
                if (this.peek(code) !== '\0') {
                    string += this.advance(code); // Add the escaped character to the string
                }
            } else {
                string += this.advance(code);
            }
        }

        if (this.peek(code) === quoteCharacter) {
            string += this.advance(code); // Add the closing quote character to the string
        }

        return {
            type: TokenType.STRING,
            value: string,
            line: this.line,
            column: this.column - string.length
        };
    }

    /**
     * Template strings in JavaScript are opened and closed with a backtick.
     */
    private tokenizeTemplateString(code: string): Token {
        let templateString = '`';
        this.advance(code); // The opening backtick has already been added to the string so we skip it.

        while (this.peek(code) !== '`' && this.peek(code) !== '\0') {
            if (this.peek(code) === '\\') {
                templateString += this.advance(code); // Add the backslash to the string
                if (this.peek(code) !== '\0') {
                    templateString += this.advance(code); // Add the escaped character which comes after the backslash
                }
            } else if (this.peek(code) === '$' && this.peek(code, 1) === '{') {
                templateString += this.advance(code); // Add '$'
                templateString += this.advance(code); // Add '{'
                // For the sake of simplicity, we're considering the whole template as one token
                // TODO : Each one of the expressions inside a template string should be further tokenized.
            } else {
                templateString += this.advance(code);
            }
        }

        if (this.peek(code) === '`') {
            templateString += this.advance(code); // Add the closing backtick to the string
        }

        return {
            type: TokenType.TEMPLATE_STRING,
            value: templateString,
            line: this.line,
            column: this.column - templateString.length
        };
    }

    private tokenizeIdentifier(code: string): Token {
        let identifier = '';

        while (this.isAlphaNumeric(this.peek(code)))
            identifier += this.advance(code);

        if (this.KEYWORDS.has(identifier)) {
            const type = identifier === 'true' || identifier === 'false'
                ? TokenType.BOOLEAN
                : identifier === 'null'
                    ? TokenType.NULL
                    : TokenType.KEYWORD;

            return {
                type,
                value: identifier,
                line: this.line,
                column: this.column - identifier.length
            };
        }

        return {
            type: TokenType.IDENTIFIER,
            value: identifier,
            line: this.line,
            column: this.column - identifier.length
        };
    }

    private tokenizeComment(code: string): Token {
        const startLine = this.line;
        const startColumn = this.column;
        let comment = '';

        if (this.peek(code, 1) === '/') {
            // This is a single line comment
            this.advance(code); // Read the first '/'
            this.advance(code); // Read the second '/'
            comment = "//";

            while (this.peek(code) !== '\n' && this.peek(code) !== "\0") {
                comment += this.advance(code);
            }
        } else if (this.peek(code, 1) === '*') {
            // This is a multi-line comment
            this.advance(code); // Read the '/'
            this.advance(code); // Read the '*'
            comment = "/*"

            while (!(this.peek(code) === '*' && this.peek(code, 1) === '/') && this.peek(code) !== '\0') {
                comment += this.advance(code);
            }

            // After reading the whole comment, we need to make sure we have read the closing '*/' as well.
            if (this.peek(code) === '*') comment += this.advance(code);
            if (this.peek(code) === '/') comment += this.advance(code);
        }

        return {
            type: TokenType.COMMENT,
            value: comment,
            line: startLine,
            column: startColumn
        };
    }

    /**
     * If it doesn't manage to read any operators or punctuations, it will return null.
     */
    private tokenizeOperatorOrPunctuation(code: string): Token | null {
        let operator = '';

        // Try to match the longest possible operator (longest operator in JS has 4 characters)
        for (let length = 4; length >= 1; length--) {
            const candidate = code.substring(this.position, this.position + length);

            if (this.OPERATORS.has(candidate)) {
                operator = candidate;
                break;
            } else if (this.PUNCTUATION.has(candidate)) {
                operator = candidate;
                break;
            }
        }

        if (operator) {
            for (let i = 0; i < operator.length; i++) {
                this.advance(code);
            }

            const type = this.OPERATORS.has(operator) ? TokenType.OPERATOR : TokenType.PUNCTUATION;

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
    public tokenize(code: string): Token[] {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;

        while (this.position < code.length) {
            const currentCharacter = this.peek(code);

            if (this.isWhitespace(currentCharacter)) {
                this.skipWhiteSpace(code);
                continue;
            }

            // Comments
            if (currentCharacter === '/' && (this.peek(code, 1) === '/' || this.peek(code, 1) === '*')) {
                this.tokens.push(this.tokenizeComment(code));
                continue;
            }

            // Numbers
            if (this.isDigit(currentCharacter) || (currentCharacter === '.' && this.isDigit(this.peek(code, 1)))) {
                this.tokens.push(this.tokenizeNumber(code));
                continue;
            }

            // Strings
            if (currentCharacter === '"' || currentCharacter === "'") {
                this.tokens.push(this.tokenizeString(code, currentCharacter));
                continue;
            }

            // Template strings
            if (currentCharacter === '`') {
                this.tokens.push(this.tokenizeTemplateString(code));
                continue;
            }

            // Identifiers and keywords
            if (this.isLetter(currentCharacter)) {
                this.tokens.push(this.tokenizeIdentifier(code));
                continue;
            }

            // Operators and punctuation
            const opToken = this.tokenizeOperatorOrPunctuation(code);
            if (opToken) {
                this.tokens.push(opToken);
                continue;
            }

            // If we get to this point, it's an unrecognized character
            this.tokens.push({
                type: TokenType.UNKNOWN,
                value: currentCharacter,
                line: this.line,
                column: this.column
            });
            this.advance(code);
        }

        // Add an EOF token for finishing the source code
        this.tokens.push({
            type: TokenType.EOF,
            value: '',
            line: this.line,
            column: this.column
        });

        return this.tokens;
    }
}