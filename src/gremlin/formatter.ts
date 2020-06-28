namespace gremlinFormatter {
  const inlineSteps: string[] = [
    "g",
    "V",
    "withStrategies",
    "build",
    "IncludeSystemProperties",
    "create",
    "count",
  ];

  const indentedSteps: string[] = [
    "where",
  ];

  const indentingSteps: string[] = [
    "project",
    "in",
    "out",
    "inV",
    "outV",
    "inE",
    "outE",
  ];

  const scopedSteps: string[] = ["where", "coalesce", "map"];

  const padLeft = (level: number) => {
    let result: string = "";

    for (let i: number = 0; i < level; i++) {
      result += "\t";
    }

    return result;
  };

  export function format(queryText: string) {
    const query: string = queryText.replace(/(\r\n|\n|\r|\s)/gm, "");
    const scopeStack: number[][] = [];

    let result: string = "";
    let skipRounds: number = 0;

    for (let i: number = 0, tablevel = 0; i < query.length; i++) {
      const char: string = query.charAt(i);

      if (skipRounds) {
        skipRounds--;
        result += char;
        continue;
      }

      switch (char) {
        // double underscore is always followed by a dot, which we want to keep on the same row as the underscores
        // ex: coalesce(__.out(), __.constant())
        case "_": {
          const next: string = query.charAt(i + 1);

          if (next === "_") {
            result += `\n${padLeft(tablevel)}`;
            skipRounds = 2;
          }

          result += char;
          break;
        }

        // dots are followed by steps. some should remain on the same tablevel, some should indent, and some should remain inline
        // default to preserving tablevel on new line
        case ".": {
          const remainder: string = query.substring(i + 1);
          const stepEnd: number = remainder.indexOf("(");
          const step: string = remainder.substring(0, stepEnd);

          if (step === "V") {
            // we always want to increase tablevel after V()
            tablevel++;
          }

          if (inlineSteps.indexOf(step) === -1) {
            result += `\n`;

            if (indentedSteps.indexOf(step) !== -1) {
              tablevel++;
            }

            result += `${padLeft(tablevel)}`;

            if (indentingSteps.indexOf(step) !== -1) {
              tablevel++;
            }
          }

          result += char;
          break;
        }

        // opening paranthesis are preceded by steps. some should be ignored, while others should start a new line with an increase in indentation (scoped)
        case "(": {
          const precursor: string = query.substring(0, i);
          const stepStart: number = precursor.lastIndexOf(".");
          const stepStartAlt: number = precursor.lastIndexOf("("); // sometimes steps do not start with a dot e.g. map(fold())
          const actualStepStart: number =
            stepStartAlt > stepStart ? stepStartAlt : stepStart;

          const step: string = precursor.substring(actualStepStart + 1);

          if (scopedSteps.indexOf(step) !== -1) {
            scopeStack.push([tablevel]); // create a new trace
            tablevel++;
          } else {
            if (scopeStack.length) {
              scopeStack[scopeStack.length - 1].push(tablevel); // gotta trace all inside a scope
            }
          }

          result += char;

          break;
        }

        // closing paranthesis on scoped steps should reduce indentation level
        case ")": {
          if (scopeStack.length) {
            const _tablevel: number | undefined = scopeStack[
              scopeStack.length - 1
            ].pop();

            if (!scopeStack[scopeStack.length - 1].length) {
              // stack emptied
              scopeStack.pop();

              tablevel = _tablevel as number;
              result += `\n${padLeft(tablevel)}`;
            }
          }

          result += char;
          break;
        }

        case ",": {
          result += char;

          const previousChar: string = query.charAt(i - 1);

          // this is probably inside coalesce
          if (previousChar === ")") {
            if (scopeStack.length) {
              const lastScope: number[] = scopeStack[scopeStack.length - 1];

              if (lastScope.length) {
                tablevel = lastScope[lastScope.length - 1];
              }
            }

            result += `\n${padLeft(tablevel + 1)}`;
          }

          break;
        }

        default:
          result += char;
          break;
      }
    }

    return result;
  };
}

export { gremlinFormatter };