import { Result } from "../src/lib";

test("test result identifier", () => {
    let result1: Result<number, string> = Result.Ok(1);
    expect(result1.isOk()).toBeTruthy();
    expect(result1.isErr()).toBeFalsy();
    expect(result1.isOkAnd((value) => value === 1)).toBeTruthy();
    expect(result1.isOkAnd((value) => value === 2)).toBeFalsy();
    expect(result1.isErrAnd((value) => value === "err")).toBeFalsy();
    let result2: Result<number, string> = Result.Err("err");
    expect(result2.isOk()).toBeFalsy();
    expect(result2.isErr()).toBeTruthy();
    expect(result2.isOkAnd((value) => value === 1)).toBeFalsy();
    expect(result2.isErrAnd((value) => value === "err")).toBeTruthy();
    expect(result2.isErrAnd((value) => value === "abc")).toBeFalsy();
});

test("test result unwrap", () => {
    let result1: Result<number, string> = Result.Ok(1);
    expect(result1.unwrap()).toBe(1);
    expect(() => result1.unwrapErr()).toThrow();
    expect(result1.unwrapOr(3)).toBe(1);
    expect(result1.unwrapOrElse(() => 3)).toBe(1);
    expect(result1.ok()).toBe(1);
    expect(result1.err()).toBeNull();
    let result2: Result<number, string> = Result.Err("err");
    expect(() => result2.unwrap()).toThrow();
    expect(result2.unwrapErr()).toBe("err");
    expect(result2.unwrapOr(3)).toBe(3);
    expect(result2.unwrapOrElse(() => 3)).toBe(3);
    expect(result2.ok()).toBeNull();
    expect(result2.err()).toBe("err");
});

test("test result mapping", () => {
    let result1: Result<number, string> = Result.Ok(1);
    expect(result1.map((v) => v + 1)).toEqual(Result.Ok(2));
    expect(result1.mapOr("1", (value) => `${value + 1}`)).toMatch("2");
    expect(
        result1.mapOrElse(
            (e) => e,
            (v) => `${v + 1}`
        )
    ).toMatch("2");
    expect(result1.mapErr((e) => e)).toEqual(Result.Ok(1));
    let result2: Result<number, string> = Result.Err("err");
    expect(result2.map((v) => v + 1)).toEqual(Result.Err("err"));
    expect(result2.mapOr("1", (value) => `${value + 1}`)).toMatch("1");
    expect(
        result2.mapOrElse(
            (e) => e + "123",
            (v) => `${v + 1}`
        )
    ).toMatch("err123");
    expect(result2.mapErr((e) => e + "123")).toEqual(Result.Err("err123"));
});

test("test result inspecting & expecting", () => {
    let result1: Result<number, string> = Result.Ok(1);
    let res1c = "123";
    result1.inspect((v) => (res1c = v.toString()));
    expect(res1c).toMatch("1");
    result1.inspectErr((e) => (res1c = e));
    expect(res1c).toMatch("1");
    expect(result1.expect("ok_exp")).toBe(1);
    expect(() => result1.expectErr("err_exp")).toThrow();
    expect(() => result1.expectErr("err_exp")).toThrow(/^err_exp$/);
    let result2: Result<number, string> = Result.Err("err");
    let res2c = "123";
    result2.inspect((v) => (res2c = v.toString()));
    expect(res2c).toMatch("123");
    result2.inspectErr((e) => (res2c = e));
    expect(res2c).toMatch("err");
    expect(result2.expectErr("err_exp")).toBe("err");
    expect(() => result2.expect("ok_exp")).toThrow();
    expect(() => result2.expect("ok_exp")).toThrow(/^ok_exp$/);
});

test("test result calculation", () => {
    let result1: Result<number, string> = Result.Ok(1);
    expect(result1.and(Result.Ok("a"))).toEqual(Result.Ok("a"));
    expect(result1.andThen((v) => Result.Ok((v + 1).toString()))).toEqual(Result.Ok("2"));
    expect(result1.or(Result.Err("or-err"))).toEqual(Result.Ok(1));
    expect(result1.orElse((e) => Result.Err(Number.parseInt(e)))).toEqual(Result.Ok(1));
    let result2: Result<number, string> = Result.Err("err");
    expect(result2.and(Result.Ok("a"))).toEqual(Result.Err("err"));
    expect(result2.andThen((v) => Result.Ok((v + 1).toString()))).toEqual(Result.Err("err"));
    expect(result2.or(Result.Err("or-err"))).toEqual(Result.Err("or-err"));
    expect(result2.orElse((e) => Result.Err(e + "123"))).toEqual(Result.Err("err123"));
});

test("test result to array", () => {
    let result1: Result<number, string> = Result.Ok(1);
    expect(result1.toArray()).toContain(1);
    expect(result1.toArray().length).toBe(1);
    let result2: Result<number, string> = Result.Err("err");
    expect(result2.toArray()).not.toContain("err");
    expect(result2.toArray().length).toBe(0);
});

test("test nested result", () => {
    expect(Result.transpose(Result.Ok(null))).toBeNull();
    expect(Result.transpose(Result.Ok(1))).toEqual(Result.Ok(1));
    expect(Result.transpose(Result.Err("err"))).toEqual(Result.Err("err"));
    expect(Result.flatten(Result.Ok(Result.Ok("nest ok")))).toEqual(Result.Ok("nest ok"));
    expect(Result.flatten(Result.Ok(Result.Err("err")))).toEqual(Result.Err("err"));
    expect(Result.flatten<number, string>(Result.Err("err"))).toEqual(Result.Err("err"));
});
