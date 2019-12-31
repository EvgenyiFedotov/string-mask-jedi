import { createMask, GetMatch, TokenConfig } from "../../src";

describe("RegExp, string", () => {
  test("single", () => {
    const time = createMask("ddsdd", {
      d: /\d/,
      s: ":",
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("array", () => {
    const time = createMask("dsd", {
      d: [/\d/, /\d/],
      s: ":",
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });
});

describe("GetMatch", () => {
  test("single", () => {
    const time = createMask("dd:dd", {
      d: () => /\d/,
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("array", () => {
    const time = createMask("d:d", {
      d: [() => /\d/, () => /\d/],
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("outside", () => {
    const h: GetMatch = (state) => {
      const {
        tokens: [h1],
      } = state;

      return h1.value.match(/[2]/) ? /[0123]/ : /\d/;
    };
    const time = createMask("H:dd", {
      H: [/[012]/, h],
      d: /\d/,
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
    expect(time.run("24:22").value).toBe("22:42");
  });
});

describe("TokenConfig", () => {
  test("single", () => {
    const time = createMask("dd:dd", {
      d: { getMatch: () => /\d/, defaultValue: "", additional: false },
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("array", () => {
    const time = createMask("d:d", {
      d: [
        { getMatch: () => /\d/, defaultValue: "", additional: false },
        { getMatch: () => /\d/, defaultValue: "", additional: false },
      ],
    });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("outside", () => {
    const d: TokenConfig = {
      getMatch: () => /\d/,
      defaultValue: "",
      additional: false,
    };

    const time = createMask("dd:dd", { d });

    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });
});

describe("Mask", () => {
  const h: GetMatch = (state) => {
    const {
      tokens: [h1],
    } = state;

    return h1.value.match(/[2]/) ? /[0123]/ : /\d/;
  };
  const hours = createMask("Hh", { H: /[012]/, h });
  const minutes = createMask("m", { m: [/[012345]/, /\d/] });
  const time = createMask("h:m", { h: hours, m: minutes });

  test("single", () => {
    expect(time.run("2222").value).toBe("22:22");
    expect(time.run("23:22").value).toBe("23:22");
  });

  test("array", () => {
    const periodTime = createMask("t - t", { t: time });

    expect(periodTime.run("11112222").value).toBe("11:11 - 22:22");
    expect(periodTime.run("11:22-2333").value).toBe("11:22 - 23:33");
  });

  test("with converter", () => {
    const myHours = createMask(
      "h",
      { h: hours },
      {
        converters: [
          (tokens, configTokens) => {
            if (tokens.length === configTokens.length) {
              tokens[0].value = "9";
            }
          },
        ],
      },
    );
    const myMinutes = createMask(
      "m",
      { m: minutes },
      {
        converters: [
          (tokens, configTokens) => {
            if (tokens.length === configTokens.length) {
              tokens[0].value = "8";
            }
          },
        ],
      },
    );
    const myTime = createMask(
      "h:m",
      {
        h: myHours,
        m: myMinutes,
      },
      {
        converters: [
          (tokens, configTokens) => {
            if (tokens.length === configTokens.length) {
              tokens[tokens.length - 1].value = "7";
            }
          },
        ],
      },
    );

    expect(myTime.run("1234").value).toBe("92:87");
  });
});
