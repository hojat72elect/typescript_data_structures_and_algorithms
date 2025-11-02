import {JavaScriptParser} from "../../../src/hedwig/parser/JavaScriptParser";

describe('JavaScriptParser', () => {


    it('The only test', () => {
        const parser = new JavaScriptParser();
        const code = "let name = 'Hojat' ;";
        const ast = parser.parse(code);
        console.log(JSON.stringify(ast, null, 2));
    });

});