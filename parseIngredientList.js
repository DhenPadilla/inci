const readline = require('readline');
const { Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const credentials = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
};
 
const queryIngredient = async (ingredient) => {
    const pool = new Pool(credentials);
    const text = `SELECT * FROM ingredients WHERE name LIKE $1`;
    const values = [ingredient];
    return pool.query(text, values);
}

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    rl.question("Input ingredients... \n", function (ingredients) {
        let tokenisedIngredients = parseIngredientList(ingredients);
        let count = 0;

        tokenisedIngredients.forEach(async (i) => {
            console.log(`Querying DB for ${i}`);
            let ingredient = await queryIngredient(i);
            console.log(`returned: ${JSON.stringify(ingredient.rows[0], null, ' ')}`);
            if (ingredient.rows[0] !== undefined) {
                count++;
            }
            console.log(`Found: ${count} ingredients`);
        })
        rl.close();
    });
}

const parseIngredientList = (ingredientText) => {
    let ingredients = ingredientText.split(',');
    console.log("Ingredient count: ", ingredients.length);
    let possibleIngredients = [];
    ingredients.forEach((ingredient) => {
        let cleanedIngredientNames = unwrapIngredient(ingredient).map((i) => cleanIngredientName(i));
        cleanedIngredientNames.forEach((i) => {
            possibleIngredients.push(i);
        })
    });
    return [...new Set(possibleIngredients)];;
}

const unwrapIngredient = (ingredient) => {
    let openBracketIndex = ingredient.indexOf('(');
    let closeBracketIndex = ingredient.lastIndexOf(')');

    let prefixToken = '';
    let suffixToken = '';

    if (((openBracketIndex === -1) || (closeBracketIndex === -1))) {
        return [cleanIngredientName(ingredient)];
    }
    else {
        if (openBracketIndex > 0) {
            prefixToken = ingredient.substring(0, (openBracketIndex - 1));
        }
        if (closeBracketIndex <= (ingredient.length - 1)) {
            suffixToken = ingredient.substring(closeBracketIndex + 1);
        }
        let middleToken = ingredient.slice((openBracketIndex + 1), closeBracketIndex);
        let result = [
            `${prefixToken} ${suffixToken}`, 
            `${prefixToken} ${middleToken}`, 
            `${middleToken} ${suffixToken}`, 
            `${middleToken}`
        ];
        return result;
    }
}

const cleanIngredientName = (ingredientName) => {
    let replaced = ingredientName.replace(/[^a-z0-9 ]/gi, '');
    replaced = replaced.replace(/[ ]/gi, '%') + '%';
    return replaced.toUpperCase();
}

main();