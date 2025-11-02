import type {Token} from "../lexer/Token";
import {JavaScriptLexer} from "../lexer/JavaScriptLexer";
import {TokenType} from "../lexer/TokenType";
import type {
    ArrayExpression,
    BlockStatement, CallExpression,
    ClassBody,
    ClassDeclaration,
    Expression, ExpressionStatement, ForStatement,
    FunctionDeclaration,
    FunctionExpression, Identifier, IfStatement, Literal, MemberExpression, MethodDefinition, NewExpression,
    ObjectExpression, Pattern,
    Program, Property, ReturnStatement,
    Statement, TemplateElement, TemplateLiteral,
    VariableDeclaration,
    VariableDeclarator, WhileStatement
} from "./ASTNode";

export class JavaScriptParser {
    private tokens: Token[];
    private current: number;
    private lexer: JavaScriptLexer;

    constructor() {
        this.tokens = [];
        this.current = 0;
        this.lexer = new JavaScriptLexer();
    }

    // Token navigation methods
    private peek(): Token {
        return this.tokens[this.current] || {type: TokenType.EOF, value: '', line: 0, column: 0};
    }

    private previous(): Token {
        // @ts-ignore
        return this.tokens[this.current - 1];
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private check(type: TokenType): boolean {
        return !this.isAtEnd() && this.peek().type === type;
    }

    private checkKeyword(keyword: string): boolean {
        return this.check(TokenType.KEYWORD) && this.peek().value === keyword;
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private matchKeyword(...keywords: string[]): boolean {
        for (const keyword of keywords) {
            if (this.checkKeyword(keyword)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private consumeKeyword(keyword: string, message: string): Token {
        if (this.checkKeyword(keyword)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private error(token: Token, message: string): Error {
        return new Error(`ParseError: ${message} at line ${token.line}, column ${token.column}`);
    }

    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.PUNCTUATION && this.previous().value === ';') {
                return;
            }

            switch (this.peek().type) {
                case TokenType.KEYWORD:
                    switch (this.peek().value) {
                        case 'function':
                        case 'class':
                        case 'var':
                        case 'let':
                        case 'const':
                        case 'if':
                        case 'for':
                        case 'while':
                        case 'return':
                            return;
                    }
                    break;
            }

            this.advance();
        }
    }

    // Parse entry point
    public parse(code: string): Program {
        this.tokens = this.lexer.tokenize(code);
        this.current = 0;

        const body: Statement[] = [];
        while (!this.isAtEnd()) {
            try {
                const stmt = this.parseStatement();
                if (stmt) body.push(stmt);
            } catch (error) {
                console.error('Parse error:', error);
                this.synchronize();
            }
        }

        return {
            type: 'Program',
            body,
            start: 0,
            end: code.length,
            loc: {
                start: {line: 1, column: 1},
                end: {line: this.previous().line, column: this.previous().column}
            }
        };
    }

    // Statement parsing
    private parseStatement(): Statement {
        if (this.matchKeyword('var', 'let', 'const')) return this.parseVariableDeclaration();
        if (this.matchKeyword('function')) return this.parseFunctionDeclaration();
        if (this.matchKeyword('class')) return this.parseClassDeclaration();
        if (this.matchKeyword('if')) return this.parseIfStatement();
        if (this.matchKeyword('for')) return this.parseForStatement();
        if (this.matchKeyword('while')) return this.parseWhileStatement();
        if (this.matchKeyword('return')) return this.parseReturnStatement();
        if (this.match(TokenType.PUNCTUATION) && this.previous().value === '{') {
            return this.parseBlockStatement();
        }

        return this.parseExpressionStatement();
    }

    private parseVariableDeclaration(): VariableDeclaration {
        const kind = this.previous().value as 'var' | 'let' | 'const';
        const declarations: VariableDeclarator[] = [];

        do {
            declarations.push(this.parseVariableDeclarator());
        } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');

        this.consume(TokenType.PUNCTUATION, "Expected ';' after variable declaration");

        return {
            type: 'VariableDeclaration',
            kind,
            declarations,
            start: this.previous().column - kind.length,
            end: this.previous().column
        };
    }

    private parseVariableDeclarator(): VariableDeclarator {
        const id = this.parseIdentifier();
        let init: Expression | null = null;

        if (this.match(TokenType.OPERATOR) && this.previous().value === '=') {
            init = this.parseExpression();
        }

        return {
            type: 'VariableDeclarator',
            id,
            init,
            start: id.start,
            end: init ? init.end : id.end
        } as VariableDeclarator;
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const async = this.matchKeyword('async');
        if (async) this.consumeKeyword('function', "Expected 'function' after 'async'");

        const generator = this.match(TokenType.OPERATOR) && this.previous().value === '*';

        let id: Identifier | null = null;
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== '(') {
            id = this.parseIdentifier();
        }

        this.consume(TokenType.PUNCTUATION, "Expected '(' after function name");

        const params: Identifier[] = [];
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            do {
                params.push(this.parseIdentifier());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after parameters");
        const body = this.parseBlockStatement();

        return {
            type: 'FunctionDeclaration',
            id,
            params,
            body,
            async,
            generator,
            start: this.previous().column - (async ? 13 : 8),
            end: body.end
        };
    }

    private parseClassDeclaration(): ClassDeclaration {
        const id = this.parseIdentifier();
        let superClass: Expression | null = null;

        if (this.matchKeyword('extends')) {
            superClass = this.parseExpression();
        }

        const body = this.parseClassBody();

        return {
            type: 'ClassDeclaration',
            id,
            superClass,
            body,
            start: this.previous().column - 5,
            end: body.end
        };
    }

    private parseClassBody(): ClassBody {
        this.consume(TokenType.PUNCTUATION, "Expected '{' before class body");

        const body: MethodDefinition[] = [];
        while (!this.check(TokenType.PUNCTUATION) || this.peek().value !== '}') {
            body.push(this.parseMethodDefinition());
        }

        this.consume(TokenType.PUNCTUATION, "Expected '}' after class body");

        return {
            type: 'ClassBody',
            body,
            start: this.previous().column - 1,
            end: this.previous().column
        };
    }

    private parseMethodDefinition(): MethodDefinition {
        // Simplified method parsing
        const key = this.parseIdentifier();
        this.consume(TokenType.PUNCTUATION, "Expected '(' after method name");

        const params: Identifier[] = [];
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            do {
                params.push(this.parseIdentifier());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after parameters");
        const body = this.parseBlockStatement();

        return {
            type: 'MethodDefinition',
            key,
            value: {
                type: 'FunctionExpression',
                id: null,
                params,
                body,
                async: false,
                generator: false,
                start: key.start,
                end: body.end
            },
            kind: 'method',
            static: false,
            start: key.start,
            end: body.end
        };
    }

    private parseIfStatement(): IfStatement {
        this.consume(TokenType.PUNCTUATION, "Expected '(' after 'if'");
        const test = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, "Expected ')' after if condition");

        const consequent = this.parseStatement();
        let alternate: Statement | null = null;

        if (this.matchKeyword('else')) {
            alternate = this.parseStatement();
        }

        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
            start: this.previous().column - 2,
            end: alternate ? alternate.end : consequent.end
        };
    }

    private parseForStatement(): ForStatement {
        this.consume(TokenType.PUNCTUATION, "Expected '(' after 'for'");

        let init: VariableDeclaration | Expression | null = null;
        if (!this.match(TokenType.PUNCTUATION) || this.previous().value !== ';') {
            if (this.matchKeyword('var', 'let', 'const')) {
                init = this.parseVariableDeclaration();
            } else {
                init = this.parseExpression();
                this.consume(TokenType.PUNCTUATION, "Expected ';' after for loop initializer");
            }
        }

        let test: Expression | null = null;
        if (!this.match(TokenType.PUNCTUATION) || this.previous().value !== ';') {
            test = this.parseExpression();
            this.consume(TokenType.PUNCTUATION, "Expected ';' after for loop condition");
        }

        let update: Expression | null = null;
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            update = this.parseExpression();
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after for loop clauses");
        const body = this.parseStatement();

        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body,
            start: this.previous().column - 3,
            end: body.end
        };
    }

    private parseWhileStatement(): WhileStatement {
        this.consume(TokenType.PUNCTUATION, "Expected '(' after 'while'");
        const test = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, "Expected ')' after while condition");
        const body = this.parseStatement();

        return {
            type: 'WhileStatement',
            test,
            body,
            start: this.previous().column - 5,
            end: body.end
        };
    }

    private parseReturnStatement(): ReturnStatement {
        let argument: Expression | null = null;

        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ';') {
            argument = this.parseExpression();
        }

        this.consume(TokenType.PUNCTUATION, "Expected ';' after return statement");

        return {
            type: 'ReturnStatement',
            argument,
            start: this.previous().column - 6,
            end: this.previous().column
        };
    }

    private parseBlockStatement(): BlockStatement {
        const start = this.previous().column;
        const body: Statement[] = [];

        while (!this.check(TokenType.PUNCTUATION) || this.peek().value !== '}') {
            body.push(this.parseStatement());
        }

        this.consume(TokenType.PUNCTUATION, "Expected '}' after block");

        return {
            type: 'BlockStatement',
            body,
            start,
            end: this.previous().column
        };
    }

    private parseExpressionStatement(): ExpressionStatement {
        const expression = this.parseExpression();
        this.consume(TokenType.PUNCTUATION, "Expected ';' after expression");

        return {
            type: 'ExpressionStatement',
            expression,
            start: expression.start,
            end: this.previous().column
        };
    }

    // Expression parsing with operator precedence
    private parseExpression(): Expression {
        return this.parseAssignment();
    }

    private parseAssignment(): Expression {
        const expression = this.parseConditional();

        if (this.match(TokenType.OPERATOR) && this.isAssignmentOperator(this.previous().value)) {
            const operator = this.previous().value;
            const right = this.parseAssignment();

            return {
                type: 'AssignmentExpression',
                operator,
                left: expression as Pattern,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseConditional(): Expression {
        const expression = this.parseLogicalOR();

        if (this.match(TokenType.OPERATOR) && this.previous().value === '?') {
            const consequent = this.parseExpression();
            this.consume(TokenType.OPERATOR, "Expected ':' in conditional expression");
            const alternate = this.parseExpression();

            return {
                type: 'ConditionalExpression',
                test: expression,
                consequent,
                alternate,
                start: expression.start,
                end: alternate.end
            };
        }

        return expression;
    }

    private parseLogicalOR(): Expression {
        let expression = this.parseLogicalAND();

        while (this.match(TokenType.OPERATOR) && this.previous().value === '||') {
            const operator = this.previous().value;
            const right = this.parseLogicalAND();
            expression = {
                type: 'LogicalExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseLogicalAND(): Expression {
        let expression = this.parseEquality();

        while (this.match(TokenType.OPERATOR) && this.previous().value === '&&') {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expression = {
                type: 'LogicalExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseEquality(): Expression {
        let expression = this.parseComparison();

        while (this.match(TokenType.OPERATOR) && this.isEqualityOperator(this.previous().value)) {
            const operator = this.previous().value;
            const right = this.parseComparison();
            expression = {
                type: 'BinaryExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseComparison(): Expression {
        let expression = this.parseAdditive();

        while (this.match(TokenType.OPERATOR) && this.isComparisonOperator(this.previous().value)) {
            const operator = this.previous().value;
            const right = this.parseAdditive();
            expression = {
                type: 'BinaryExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseAdditive(): Expression {
        let expression = this.parseMultiplicative();

        while (this.match(TokenType.OPERATOR) && (this.previous().value === '+' || this.previous().value === '-')) {
            const operator = this.previous().value;
            const right = this.parseMultiplicative();
            expression = {
                type: 'BinaryExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseMultiplicative(): Expression {
        let expression = this.parseUnary();

        while (this.match(TokenType.OPERATOR) &&
        (this.previous().value === '*' || this.previous().value === '/' || this.previous().value === '%')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expression = {
                type: 'BinaryExpression',
                operator,
                left: expression,
                right,
                start: expression.start,
                end: right.end
            };
        }

        return expression;
    }

    private parseUnary(): Expression {
        if (this.match(TokenType.OPERATOR) && this.isUnaryOperator(this.previous().value)) {
            const operator = this.previous().value;
            const argument = this.parseUnary();

            return {
                type: 'UnaryExpression',
                operator,
                prefix: true,
                argument,
                start: this.previous().column - operator.length,
                end: argument.end
            };
        }

        if (this.matchKeyword('await')) {
            const argument = this.parseUnary();

            return {
                type: 'AwaitExpression',
                argument,
                start: this.previous().column - 5,
                end: argument.end
            };
        }

        return this.parseUpdate();
    }

    private parseUpdate(): Expression {
        if (this.match(TokenType.OPERATOR) && (this.previous().value === '++' || this.previous().value === '--')) {
            const operator = this.previous().value;
            const argument = this.parseUpdate();

            return {
                type: 'UpdateExpression',
                operator,
                prefix: true,
                argument,
                start: this.previous().column - operator.length,
                end: argument.end
            };
        }

        const expression = this.parseCall();

        if (this.match(TokenType.OPERATOR) && (this.previous().value === '++' || this.previous().value === '--')) {
            return {
                type: 'UpdateExpression',
                operator: this.previous().value,
                prefix: false,
                argument: expression,
                start: expression.start,
                end: this.previous().column
            };
        }

        return expression;
    }

    private parseCall(): Expression {
        let expression = this.parsePrimary();

        while (true) {
            if (this.match(TokenType.PUNCTUATION) && this.previous().value === '(') {
                expression = this.parseCallExpression(expression);
            } else if (this.match(TokenType.PUNCTUATION) && this.previous().value === '[') {
                expression = this.parseMemberExpression(expression, true);
            } else if (this.match(TokenType.PUNCTUATION) && this.previous().value === '.') {
                expression = this.parseMemberExpression(expression, false);
            } else if (this.matchKeyword('new')) {
                expression = this.parseNewExpression(expression);
            } else {
                break;
            }
        }

        return expression;
    }

    private parseCallExpression(callee: Expression): CallExpression {
        const args: Expression[] = [];

        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            do {
                args.push(this.parseExpression());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after arguments");

        return {
            type: 'CallExpression',
            callee,
            arguments: args,
            start: callee.start,
            end: this.previous().column
        };
    }

    private parseMemberExpression(object: Expression, computed: boolean): MemberExpression {
        let property: Expression;

        if (computed) {
            property = this.parseExpression();
            this.consume(TokenType.PUNCTUATION, "Expected ']' after computed property");
        } else {
            property = this.parseIdentifier();
        }

        return {
            type: 'MemberExpression',
            object,
            property,
            computed,
            start: object.start,
            end: property.end
        };
    }

    private parseNewExpression(callee: Expression): NewExpression {
        this.consume(TokenType.PUNCTUATION, "Expected '(' after new expression");

        const args: Expression[] = [];
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            do {
                args.push(this.parseExpression());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after new arguments");

        return {
            type: 'NewExpression',
            callee,
            arguments: args,
            start: callee.start,
            end: this.previous().column
        };
    }

    private parsePrimary(): Expression {
        if (this.matchKeyword('this')) {
            return {
                type: 'ThisExpression',
                start: this.previous().column - 4,
                end: this.previous().column
            };
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return this.parseIdentifier();
        }

        if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN, TokenType.NULL)) {
            return this.parseLiteral();
        }

        if (this.match(TokenType.TEMPLATE_STRING)) {
            return this.parseTemplateLiteral();
        }

        if (this.match(TokenType.PUNCTUATION) && this.previous().value === '(') {
            const expression = this.parseExpression();
            this.consume(TokenType.PUNCTUATION, "Expected ')' after expression");
            return expression;
        }

        if (this.match(TokenType.PUNCTUATION) && this.previous().value === '[') {
            return this.parseArrayExpression();
        }

        if (this.match(TokenType.PUNCTUATION) && this.previous().value === '{') {
            return this.parseObjectExpression();
        }

        throw this.error(this.peek(), 'Expected expression');
    }

    private parseIdentifier(): Identifier {
        return {
            type: 'Identifier',
            name: this.previous().value,
            start: this.previous().column - this.previous().value.length,
            end: this.previous().column
        };
    }

    private parseLiteral(): Literal {
        let value: string | number | boolean | null;

        switch (this.previous().type) {
            case TokenType.NUMBER:
                value = parseFloat(this.previous().value);
                break;
            case TokenType.STRING:
                value = this.previous().value.slice(1, -1); // Remove quotes
                break;
            case TokenType.BOOLEAN:
                value = this.previous().value === 'true';
                break;
            case TokenType.NULL:
                value = null;
                break;
            default:
                value = this.previous().value;
        }

        return {
            type: 'Literal',
            value,
            raw: this.previous().value,
            start: this.previous().column - this.previous().value.length,
            end: this.previous().column
        };
    }

    private parseTemplateLiteral(): TemplateLiteral {
        // Simplified template literal parsing
        const raw = this.previous().value;
        const quasis: TemplateElement[] = [{
            type: 'TemplateElement',
            value: {cooked: raw.slice(1, -1), raw: raw},
            tail: true,
            start: this.previous().column - raw.length,
            end: this.previous().column
        }];

        return {
            type: 'TemplateLiteral',
            quasis,
            expressions: [],
            start: this.previous().column - raw.length,
            end: this.previous().column
        };
    }

    private parseArrayExpression(): ArrayExpression {
        const elements: (Expression | null)[] = [];

        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ']') {
            do {
                if (this.check(TokenType.PUNCTUATION) && this.peek().value === ',') {
                    elements.push(null);
                } else {
                    elements.push(this.parseExpression());
                }
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ']' after array literal");

        return {
            type: 'ArrayExpression',
            elements,
            start: this.previous().column - 1,
            end: this.previous().column
        };
    }

    private parseObjectExpression(): ObjectExpression {
        const properties: Property[] = [];

        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== '}') {
            do {
                properties.push(this.parseProperty());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected '}' after object literal");

        return {
            type: 'ObjectExpression',
            properties,
            start: this.previous().column - 1,
            end: this.previous().column
        };
    }

    private parseProperty(): Property {
        const key = this.parseExpression();
        let kind: 'init' | 'get' | 'set' = 'init';
        let value: Expression;
        let computed = false;
        let method = false;
        let shorthand = false;

        if (this.match(TokenType.PUNCTUATION) && this.previous().value === ':') {
            value = this.parseExpression();
        } else if (this.check(TokenType.PUNCTUATION) && this.peek().value === '(') {
            // @ts-ignore
            value = this.parseFunctionExpression();
            method = true;
        } else {
            value = key;
            shorthand = true;
        }

        return {
            type: 'Property',
            key,
            value,
            kind,
            method,
            shorthand,
            computed,
            start: key.start,
            end: value.end
        };
    }

    private parseFunctionExpression(): FunctionExpression {
        this.consume(TokenType.PUNCTUATION, "Expected '(' after function");

        const params: Identifier[] = [];
        if (!this.check(TokenType.PUNCTUATION) || this.peek().value !== ')') {
            do {
                params.push(this.parseIdentifier());
            } while (this.match(TokenType.PUNCTUATION) && this.previous().value === ',');
        }

        this.consume(TokenType.PUNCTUATION, "Expected ')' after parameters");
        const body = this.parseBlockStatement();

        return {
            type: 'FunctionExpression',
            id: null,
            params,
            body,
            async: false,
            generator: false,
            start: this.previous().column - 8,
            end: body.end
        };
    }

    // Helper methods for operator classification
    private isAssignmentOperator(operator: string): boolean {
        return ['=', '+=', '-=', '*=', '/=', '%=', '**='].includes(operator);
    }

    private isEqualityOperator(operator: string): boolean {
        return ['==', '===', '!=', '!=='].includes(operator);
    }

    private isComparisonOperator(operator: string): boolean {
        return ['<', '>', '<=', '>='].includes(operator);
    }

    private isUnaryOperator(operator: string): boolean {
        return ['!', '~', '+', '-', 'typeof', 'void', 'delete'].includes(operator);
    }
}