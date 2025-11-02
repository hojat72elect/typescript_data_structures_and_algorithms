## Parser

Our parser is a module that sits on top of the lexer. It consumes the tokens created by the
lexer and creates an Abstract Syntax Tree (AST) in the form of a JSON object.

The current version of our parser only focuses on the JavaScript programming language; we
might add other languages in the future as well.