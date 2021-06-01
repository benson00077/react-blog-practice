const path = require('path')
const fs = require('fs')


// fs.readdir(path.resolve(__dirname, './database/migrations'), (err, files)=> {
//     if (err) throw new Error(err)
//     return console.log(files);
// })



// fs.readdir(path.resolve(__dirname, './database/migration'), (err, files)=> {
//     if (err) return console.log(err)
//     return console.log(files);
// })


fs.readdir(path.resolve(__dirname, './database/migrations'), (err, files)=> {
    if (err) throw new Error(err)
    return console.log(files);
})