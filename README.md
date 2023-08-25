# Result.js

A TypeScript/Javascript Exception Handling Library.

## Introduction

### What is Result.js

Result.ts is a exception handling library for TypeScript/Javascript, aiming for elegant result wrapping, parsing and handling, inspired by [Rust][]'s [`std::result::Result`][] enumeration.

[Rust]: https://www.rust-lang.org
[`std::result::Result`]: https://doc.rust-lang.org/std/result/enum.Result.html

### How to install

First, make sure that you've already installed [nodejs][].

Then, in your terminal, run the following command:

```bash
npm install --save-dev resultjs
```

[nodejs]: https://nodejs.org/

### Quick Start

After installing the library, you could use it in your project.

First, import the core structure:

```ts
import { Result } from 'resultjs';
```

Then, turn your current union object into `Result` object. A `Result<T, E>` object views `T` as success value and `E` as failure value. You could construct a result by calling:

```ts
let success: Result<number, string> = Result.Ok(1); // This creates a success value, aka `Ok(_)`.
let failure: Result<number, string> = Result.Err('error'); // This creates a failure value, aka `Err(_)`.
```

For more information about the FP API, see [the documentation][].

[the documentation]: https://embers-of-the-fire.github.io/result-js/

## License

This repository is licensed under the [MIT License][] and the [Apache License v2.0][].

[MIT License]: ./LICENSE-MIT
[Apache License v2.0]: ./LICENSE-APACHE