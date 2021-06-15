# Table of Content

- [Table of Content](#table-of-content)
- [[Back-end] Practice note](#back-end-practice-note)
  - [BUILDING: Init Server `app.js`](#building-init-server-appjs)
  - [[TBD] BUILDING: Init GraphSQL `./schemas`](#tbd-building-init-graphsql-schemas)
  - [SQL db notion](#sql-db-notion)
    - [[skills] Data modeling](#skills-data-modeling)
  - [BUILDING: MySQL](#building-mysql)
    - [Init for MySQL](#init-for-mysql)
    - [Init for connection](#init-for-connection)
    - [Run Mysql (global call)](#run-mysql-global-call)
    - [[TBD] Build connection to MySQL](#tbd-build-connection-to-mysql)
    - [[TBD] Create and run db migration](#tbd-create-and-run-db-migration)
    - [[Skills] Error Control: Sync & Async & Promise-based](#skills-error-control-sync--async--promise-based)


# [Back-end] Practice note
Tree by `tree -I 'node_nodules`
```zsh
graphql
├── app.js
├── database
│   ├── actions
│   │   ├── create-migration.js
│   │   ├── db-connect.js
│   │   └── run-migration.js
│   ├── migrations
│   │   ├── 1622546389081_roles.sql
│   │   ├── # ...
│   │   └── 1622546475851_seeds.sql
│   └── mysql.js
├── package-lock.json
├── package.json
└── schemas
    ├── index.js
    └── posts
        ├── index.js
        ├── mocks
        │   ├── featured.js
        │   └── trending.js
        └── posts-schema.graphql
```

## BUILDING: Init Server `app.js`
- 初始化 `npm init` in new created file named graphql, generate package.json<br/>
- Dependencies: setting by `npm i -S [dependency...1] [...2] [...3] `
  - apollo-server-koa
  - graphql-tools
  - koa
  - moment
  - bluebird: handle promises in different way

- In app.js → BUT what's under the hood ?
  - Set Apollo Server
    - Import resolvers & typeDefs
  - Set Koa Server
  - Set Koa as Apollo Server's MiddleWare
  - Koa server listen to port
  - `node app` in command line, with GraphQL plaground chrome extension

## [TBD] BUILDING: Init GraphSQL `./schemas`
- type, schema, and resolver

## SQL db notion
### [skills] Data modeling
- Draw entity relationship diagram (ERD) to know cardinality
  - Database Cardinality: 
    - Definition: [See here](https://orangematter.solarwinds.com/2020/01/05/what-is-cardinality-in-a-database/)
    - Tools: [Lucidchart](https://www.lucidchart.com/pages/) to draw ERD
  - 3rd normal form (3NF):
    - 確保在一個 table 內，除了 primiry key 的其他鍵值都是彼此獨立無關
    - should never have a many-to-many relationship (between 2 tables)
    - Instead, using a `reference table` instead, which links those 2 table together.
    - If having one-to-one relationship, consider merging those 2 table into 1.
  - Composite Key: 例如一個文章有很多個 Likes，但一人只能貢獻一個。 <br/>
  所以這個 table 內的 post_id, author_id 組成一個 Composite key

## BUILDING: MySQL
### Init for MySQL
- `brew install mysql`
- CLI: `mysql.server start`
- [troubleshoting]: 
  - brew auto-updated when installing, node was as well updated. BUT node-sass not yet suport it.
  - Install nvm to manage node version, instead of homebrew.

### Init for connection
- Dependencies: setting by `npm i -S [dependency...1] [...2] [...3] `
  - `mysql2`: db connector
  - `knex`: A sql query builder
  - `dotenv`: Access file `.env`
- Create file `.env`
  - Commented out by `.gitignore`: 因.env檔案內會放環境變數，常存放敏感資料如帳密
  - Allows us to have a separate .env file in every enviroment. After deploying would have different sql db, user, password...
  - `.env` for local test setting as below
  ```
    MYSQL_HOST=127.0.0.1
    MYSQL_USER=root
    MYSQL_PASS=
    MYSQL_DB=react_blog
  ```
  - 根據[官方文件](https://www.npmjs.com/package/dotenv)，config() 會在執行的目錄下讀取 .env 檔，並註冊到 process.env
  ```Javascript
  let result = require('dotenv').config()

  if (result.error) {
      throw result.error
  }
  console.log(result.parsed)
  ```
### Run Mysql (global call)
  | 指令 | 說明 |
  | ------ | ------ |
  | `mysql.server start` | 
  | `mysql.server stop` |
  | `mysql -u root -p` | 密碼連線，root可改成使用者名稱 
  | `show databases`  | 
  | `use [database]` | To access a specific database
  | `show tables` | 

### [TBD] Build connection to MySQL
- how ? 

### [TBD] Create and run db migration
- Add command in package.json 
  - `npm create-migration --tableName=roles` 
  - `npm run-migration ...`


### [Skills] Error Control: Sync & Async & Promise-based
1. `Async` Function: inner `Throw err`in cb ( 注意這裡的 Async 指的是那個 cb )
    ```JavaScript
    // run-migration.js
    const path = require('path')
    const fs = require('fs')

    fs.readdir(path.resolve(__dirname, './database/migration'), (err, files)=> {
        if (err) throw new Error(err)  // or throw err
        return console.log(files);
    })
    ```
    - [TBD] 這些定義 cb 為參數傳入的函數，怎麼調用到那些 “傳遞給 cb 的參數"？例如上例中的 (err, files) ? 
2. `Sync` Function: outer `Try & Catch` 
    ```JavaScript
    const fs = require('fs')
        
    try {
        const file = fs.readFileSync('./README.md')
        console.log(file)
    } catch(err) {
        console.log('讀檔失敗')
    }
    ```
3. `Promise` based: `.then().catch()`
    - [TBD] 題目：例如使用 `fs.readdir`拿到每個檔案名的陣列後，要再用`fs.readfile()`讀取每個檔案，直覺上你的寫法？現在較好的寫法為？

4. [TBD] How to know if Async or Sync?
    `theFunc.constructor.name` 會得出結果 → constructor 到底是什麼？跟 prototype 的關係？