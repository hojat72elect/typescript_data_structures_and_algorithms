/**
 * All kinds of tokens we are looking for.
 */
export enum TokenType {
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