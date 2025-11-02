import type {TokenType} from "./TokenType";

/**
 * Each token is a single unit of the source code written in JavaScript programming language.
 * The lexer will create an array of these tokens for a given JS source code.
 */
export type Token = {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}