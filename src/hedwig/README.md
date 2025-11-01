## Hedwig Compiler

This directory contains my first attempt of making a compiler for JavaScript programming language.

different parts of a compiler from high-level point of view.

<ul>
<li>Lexer</li>
<li>Parser</li>
<li>Semantic analysis / type checking</li>
<li>Intermediate Representation (IR)</li>
<li>Constant folding (optimization 1)</li>
<li>Dead Code Elimination (optimization 2)</li>
<li>Inlining (optimization 3)</li>
<li>Backend</li>
For the first iteration, I am going to target the Dart language's VM, but later on, will remove the VM and  implement the backend as <u>an ownership and borrowing system</u>.
<li>Memory Management Model</li>
<li>GC</li>
I will need it for now, but will remove it when we get rid of our VM.
<li>IO</li>
</ul>