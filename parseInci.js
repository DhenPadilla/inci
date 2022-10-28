const fs = require("fs");

const parseInciCsv = () => {
    let incis = [];
    const fileContent = fs.readFileSync("strippedINCI2.csv", "utf8");
    const lines = fileContent.split("\n");
    for (let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];
        let lineSplitAndParsed = parseSingleLine(line);
        lineSplitAndParsed.forEach((ingredient) => {
            incis.push(ingredient)
        });
    };
    incis.forEach((e) => {
        fs.appendFileSync("trial4.csv", `${e}\n`);
    })
}

pipeReplace = (line) => {
    // First, replace '/' separator of non-grouped tokens by '|'
    let brackets = 0;
    let tokens = [];
    for (let idx = 0; idx < line.length; idx++) {
        if (line[idx] === '(') {
            brackets++;
        }
        else if (line[idx] === ')') {
            brackets--;
        }
        else if (line[idx] === '/' && brackets === 0) {
            line = line.substring(0, idx) + '|' + line.substring(idx + 1);
        }
    }
    line.split('|').forEach((token) => {
        tokens.push(token);
    });
    return tokens;
}

unwrapLine = (line) => {
    let openBracketIndex = line.indexOf('(');
    let closeBracketIndex = line.lastIndexOf(')');

    let prefixToken = '';
    let suffixToken = '';

    if (((openBracketIndex === -1) || (closeBracketIndex === -1))) {
        return [line];
    }
    else {
        if (openBracketIndex > 0) {
            prefixToken = line.substring(0, openBracketIndex);
        }
        if (closeBracketIndex <= (line.length - 1)) {
            suffixToken = line.substring(closeBracketIndex + 1);
        }
        let middleTokens = line.slice((openBracketIndex + 1), closeBracketIndex).split('/');
        let result = middleTokens.map((token) => (`${prefixToken}${token}${suffixToken}`));
        return result;
    }
}

const hasNumber = (line) => {
    return /\d/.test(line);
}

const parseSingleLine = (line) => {
    let incis = [];
    if (hasNumber(line)) {
        return [line];
    }
    else{ 
        let parsedLines = pipeReplace(line);
        parsedLines.forEach((line) => {
            let unwrappedLine = unwrapLine(line);
            unwrappedLine.forEach((ingredient) => {
                incis.push(ingredient)
            });
        });
        return incis;
    }
}

parseInciCsv();