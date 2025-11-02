import type {NodeType} from "./NodeType";

/**
 * The basic building block of our AST.
 */
export interface ASTNode {
    type: NodeType;
    start: number;
    end: number;
    loc?: {
        start: { line: number; column: number };
        end: { line: number; column: number };
    };
}

export interface Program extends ASTNode {
    type: 'Program';
    body: Statement[];
}

export type Statement =
    | VariableDeclaration
    | FunctionDeclaration
    | ClassDeclaration
    | ExpressionStatement
    | BlockStatement
    | IfStatement
    | ForStatement
    | WhileStatement
    | ReturnStatement;

export type Expression =
    | Identifier
    | Literal
    | BinaryExpression
    | UnaryExpression
    | CallExpression
    | MemberExpression
    | AssignmentExpression
    | ArrayExpression
    | ObjectExpression
    | TemplateLiteral
    | ThisExpression
    | NewExpression
    | UpdateExpression
    | LogicalExpression
    | ConditionalExpression
    | AwaitExpression;

export interface VariableDeclaration extends ASTNode {
    type: 'VariableDeclaration';
    kind: 'var' | 'let' | 'const';
    declarations: VariableDeclarator[];
}

export interface VariableDeclarator extends ASTNode {
    id: Identifier;
    init: Expression | null;
}

export interface FunctionDeclaration extends ASTNode {
    type: 'FunctionDeclaration';
    id: Identifier | null;
    params: Identifier[];
    body: BlockStatement;
    async: boolean;
    generator: boolean;
}

export interface ClassDeclaration extends ASTNode {
    type: 'ClassDeclaration';
    id: Identifier | null;
    superClass: Expression | null;
    body: ClassBody;
}

export interface ClassBody extends ASTNode {
    type: 'ClassBody';
    body: MethodDefinition[];
}

export interface MethodDefinition extends ASTNode {
    type: 'MethodDefinition';
    key: Identifier | Literal;
    value: FunctionExpression;
    kind: 'method' | 'constructor' | 'get' | 'set';
    static: boolean;
}

export interface FunctionExpression extends ASTNode {
    type: 'FunctionExpression';
    id: Identifier | null;
    params: Identifier[];
    body: BlockStatement;
    async: boolean;
    generator: boolean;
}

export interface ExpressionStatement extends ASTNode {
    type: 'ExpressionStatement';
    expression: Expression;
}

export interface BlockStatement extends ASTNode {
    type: 'BlockStatement';
    body: Statement[];
}

export interface IfStatement extends ASTNode {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}

export interface ForStatement extends ASTNode {
    type: 'ForStatement';
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}

export interface WhileStatement extends ASTNode {
    type: 'WhileStatement';
    test: Expression;
    body: Statement;
}

export interface ReturnStatement extends ASTNode {
    type: 'ReturnStatement';
    argument: Expression | null;
}

export interface Identifier extends ASTNode {
    type: 'Identifier';
    name: string;
}

export interface Literal extends ASTNode {
    type: 'Literal';
    value: string | number | boolean | null;
    raw: string;
}

export interface BinaryExpression extends ASTNode {
    type: 'BinaryExpression';
    operator: string;
    left: Expression;
    right: Expression;
}

export interface UnaryExpression extends ASTNode {
    type: 'UnaryExpression';
    operator: string;
    prefix: boolean;
    argument: Expression;
}

export interface UpdateExpression extends ASTNode {
    type: 'UpdateExpression';
    operator: string;
    argument: Expression;
    prefix: boolean;
}

export interface LogicalExpression extends ASTNode {
    type: 'LogicalExpression';
    operator: string;
    left: Expression;
    right: Expression;
}

export interface CallExpression extends ASTNode {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
}

export interface MemberExpression extends ASTNode {
    type: 'MemberExpression';
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface AssignmentExpression extends ASTNode {
    type: 'AssignmentExpression';
    operator: string;
    left: Pattern;
    right: Expression;
}

export interface ArrayExpression extends ASTNode {
    type: 'ArrayExpression';
    elements: (Expression | null)[];
}

export interface ObjectExpression extends ASTNode {
    type: 'ObjectExpression';
    properties: Property[];
}

export interface Property extends ASTNode {
    type: 'Property';
    key: Expression;
    value: Expression;
    kind: 'init' | 'get' | 'set';
    method: boolean;
    shorthand: boolean;
    computed: boolean;
}

export interface TemplateLiteral extends ASTNode {
    type: 'TemplateLiteral';
    quasis: TemplateElement[];
    expressions: Expression[];
}

export interface TemplateElement extends ASTNode {
    type: 'TemplateElement';
    value: { cooked: string; raw: string };
    tail: boolean;
}

export interface ThisExpression extends ASTNode {
    type: 'ThisExpression';
}

export interface NewExpression extends ASTNode {
    type: 'NewExpression';
    callee: Expression;
    arguments: Expression[];
}

export interface ConditionalExpression extends ASTNode {
    type: 'ConditionalExpression';
    test: Expression;
    consequent: Expression;
    alternate: Expression;
}

export interface AwaitExpression extends ASTNode {
    type: 'AwaitExpression';
    argument: Expression;
}

export type Pattern = Identifier | MemberExpression | ArrayPattern | ObjectPattern;

export interface ArrayPattern extends ASTNode {
    type: 'ArrayPattern';
    elements: (Pattern | null)[];
}

export interface ObjectPattern extends ASTNode {
    type: 'ObjectPattern';
    properties: Property[];
}