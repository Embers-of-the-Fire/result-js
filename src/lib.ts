/** Type of a `Result`. */
enum ResultType {
    /** A `Ok<T>` value. */
    Ok,
    /** A `Err<E>` value. */
    Err,
}

/** Unwrap error. */
class UnwrapError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnwrapError";
    }
}

/** Result type for typescript. */
class Result<T, E> {
    /** Actual value of the result. */
    private value: T | E;
    private type: ResultType;

    // Constructor Group
    /** Constructor. */
    private constructor(value: T | E, type: ResultType) {
        this.value = value;
        this.type = type;
    }
    /** Create an `Ok<T>` value. */
    static Ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, ResultType.Ok);
    }
    /** Create an `Err<E>` value. */
    static Err<T, E>(value: E): Result<T, E> {
        return new Result<T, E>(value, ResultType.Err);
    }

    /** Returns `true` if the result is Ok. */
    isOk(): boolean {
        return this.type === ResultType.Ok;
    }
    /** Returns `true` if the result is Ok and the value inside of it matches a predicate.  */
    isOkAnd(func: (value: T) => boolean): boolean {
        if (this.type === ResultType.Ok) {
            return func(this.value as T);
        } else {
            return false;
        }
    }
    /** Returns `true` if the result is Err. */
    isErr(): boolean {
        return this.type === ResultType.Err;
    }
    /** Returns `true` if the result is Err and the value inside of it matches a predicate. */
    isErrAnd(func: (value: E) => boolean): boolean {
        if (this.type === ResultType.Err) {
            return func(this.value as E);
        } else {
            return false;
        }
    }

    /** Converts from `Result<T, E> to `T | null`, and discarding the error, if any. */
    ok(): T | null {
        if (this.type === ResultType.Ok) {
            return this.value as T;
        } else {
            return null;
        }
    }
    /** Converts from `Result<T, E> to `E | null`, and discarding the ok value, if any. */
    err(): E | null {
        if (this.type === ResultType.Err) {
            return this.value as E;
        } else {
            return null;
        }
    }

    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained Ok value, leaving an Err value untouched.
     * This function can be used to compose the results of two functions.
     */
    map<U>(op: (value: T) => U): Result<U, E> {
        if (this.type === ResultType.Ok) {
            return Result.Ok(op(this.value as T));
        } else {
            return Result.Err(this.value as E);
        }
    }
    /**
     * Returns the provided default (if Err), or applies a function to the contained value (if Ok),
     * Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `mapOrElse`, which is lazily evaluated.
     */
    mapOr<U>(d: U, func: (value: T) => U): U {
        if (this.type === ResultType.Ok) {
            return func(this.value as T);
        } else {
            return d;
        }
    }
    /**
     * Maps a `Result<T, E>` to `U` by applying fallback function default to a contained Err value, or function to a contained Ok value.
     * This function can be used to unpack a successful result while handling an error.
     */
    mapOrElse<U>(d: (value: E) => U, f: (value: T) => U): U {
        if (this.type === ResultType.Ok) {
            return f(this.value as T);
        } else {
            return d(this.value as E);
        }
    }
    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained Err value, leaving an Ok value untouched.
     * This function can be used to pass through a successful result while handling an error.
     */
    mapErr<F>(op: (value: E) => F): Result<T, F> {
        if (this.type === ResultType.Err) {
            return Result.Err(op(this.value as E));
        } else {
            return Result.Ok(this.value as T);
        }
    }

    /** Calls the provided closure with the contained value (if Ok). */
    inspect(func: (value: T) => void): Result<T, E> {
        if (this.type === ResultType.Ok) {
            func(this.value as T);
        }
        return this;
    } /** Calls the provided closure with the contained value (if Err). */
    inspectErr(func: (value: E) => void): Result<T, E> {
        if (this.type === ResultType.Err) {
            func(this.value as E);
        }
        return this;
    }

    /**
     * Returns the contained Ok value.
     *
     * **Hint**: If you’re having trouble remembering how to phrase expect error messages remember to focus on the word “should” as in “env variable should be set by blah” or “the given binary should be available and executable by the current user”.
     * @throws {UnwrapError} Raise an error of the msg if it's err.
     */
    expect(msg: string): T {
        if (this.type === ResultType.Ok) {
            return this.value as T;
        } else {
            throw new UnwrapError(msg);
        }
    }
    /**
     * Returns the contained Err value.
     * @throws {UnwrapError} Raise an error of the msg if it's ok.
     */
    expectErr(msg: string): E {
        if (this.type === ResultType.Err) {
            return this.value as E;
        } else {
            throw new UnwrapError(msg);
        }
    }
    /**
     * Returns the contained Ok value.
     * @throws {UnwrapError} Raise an error if it's err.
     */
    unwrap(): T {
        if (this.type === ResultType.Ok) {
            return this.value as T;
        } else {
            throw new UnwrapError("Call `Result.unwrap()` on an Err value: " + `${this.value}`);
        }
    }
    /**
     * Returns the contained Err value.
     * @throws {UnwrapError} Raise an error if it's err.
     */
    unwrapErr(): E {
        if (this.type === ResultType.Err) {
            return this.value as E;
        } else {
            throw new UnwrapError("Call `Result.unwrapErr()` on an Ok value: " + `${this.value}`);
        }
    }
    /**
     * Unwrap a result. Return the value if it's ok, and return `else_value` if it's err.
     * If you want to get a better performance when getting that fallback value, see `Result.unwrapOrElse()` method.
     */
    unwrapOr(else_value: T): T {
        if (this.type === ResultType.Ok) {
            return this.value as T;
        } else {
            return else_value;
        }
    }
    /** Unwrap a result. Return the value if it's ok, and call the function if it's err. */
    unwrapOrElse(else_func: () => T): T {
        if (this.type === ResultType.Ok) {
            return this.value as T;
        } else {
            return else_func();
        }
    }

    /**
     * Returns `res` if the result is Ok, otherwise returns the Err value of self.
     * Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.
     */
    and<U>(res: Result<U, E>): Result<U, E> {
        if (this.type === ResultType.Ok) {
            return res;
        } else {
            return Result.Err(this.value as E);
        }
    }
    /**
     * Calls `op` if the result is Ok, otherwise returns the Err value of self.
     * This function can be used for control flow based on Result values.
     */
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E> {
        if (this.type === ResultType.Ok) {
            return op(this.value as T);
        } else {
            return Result.Err(this.value as E);
        }
    }

    /**
     * Returns `res` if the result is Err, otherwise returns the Ok value of self.
     * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
     */
    or<F>(res: Result<T, F>): Result<T, F> {
        if (this.type === ResultType.Err) {
            return res;
        } else {
            return Result.Ok(this.value as T);
        }
    }
    /**
     * Calls `op` if the result is Err, otherwise returns the Ok value of self.
     * This function can be used for control flow based on result values.
     */
    orElse<F>(op: (value: E) => Result<T, F>): Result<T, F> {
        if (this.type === ResultType.Err) {
            return op(this.value as E);
        } else {
            return Result.Ok(this.value as T);
        }
    }

    /** Returns an array over the possibly contained value. */
    toArray(): T[] {
        if (this.type === ResultType.Ok) {
            return [this.value as T];
        } else {
            return [];
        }
    }

    /**
     * Transposes a Result of a nullable ok value into a nullable Result value.
     * `Ok(null/undefined)` will be mapped to `null`.
     * @param result Value of the result.
     */
    static transpose<T, E>(result: Result<T | undefined | null, E>): Result<T, E> | null {
        if (result.type == ResultType.Err) {
            return Result.Err(result.value as E);
        } else if (result.value == null) {
            return null;
        } else {
            return Result.Ok(result.value as T);
        }
    }

    /**
     * Converts from Result<Result<T, E>, E> to Result<T, E>
     * @param result Value of the result.
     */
    static flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E> {
        if (result.type === ResultType.Err) {
            return Result.Err(result.value as E);
        } else {
            return result.value as Result<T, E>;
        }
    }
}
export { Result, ResultType, UnwrapError };
