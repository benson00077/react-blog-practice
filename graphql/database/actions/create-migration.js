// command line: cd graphql
// npm run create-migration -- --tabkeName=roles...

const fs = require('fs')
const path = require('path')

let tableName

try {
    // process.arvg = array of argv pass in node script from command line
    tableName = process.argv.find(
        (arg) => arg.includes('--tableName=')
    ).split('=')[1]
} catch (err) {
    return console.err('--tableName parameter not found. Please specify a table name.')
}

// unix time filename, let db insert in correct order
const fileName = new Date().getTime() + `_${tableName}.sql`

fs.writeFile(path.resolve(__dirname, `../migrations/${fileName}`), '', (err) => {
    if (err) throw new Error(err)
    console.log('Created new migration file in migrations folder.')
})