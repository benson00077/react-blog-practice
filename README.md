# [Front-end] Practice note

## TBD: Table of Contetns
to download MarkDown All in One in VSCode

## TBD: File tree
to download awesome extension in VSCode

## Init: 
- Dependencies
  - `eco-system`: react-router-dom
  - `SASS`: node-sass, sass-loader
  - `UI`: antd & ionicons
  - `Date`: moment. `moment().format('MMMM DD, YYYY')` to generate posts date
  - `Posts obj literals`: defined in mocks direcotry (pretend back-end logic datas)
- [TBD] How does these SCSS & UI tools inplemented in `index.js` ? 
  不太確定為何最後會跑到 HTML header 區塊內，然後都變成 style 標籤？
  ```JSX
    import './assets/SCSS/base.scss'
    import 'antd/dist/antd.css'
    import '@quasar/extras/ionicons-v4/ionicons-v4.css'

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );

  ```



## BUILDING: Navigation bar w/ RWD
### [skills] 動態管理 URL
-g 目的：避免 hardcode 每個分頁的 `<Route>` component. To render any dynamic page without having to maintain nav links component, 
- 方法：利用 `match obj` defined in react-router-dom
  - [To learn match obj by official doc](https://reactrouter.com/web/api)
  - [To learn match obj by other's note](https://ithelp.ithome.com.tw/articles/10204451)
  - Code: App.js
    ```JSX
    <Switch>
        // 動態管理URL(對應到不同分頁，卻不用hard-coded每個分頁) 
        <Route path="/:page" component={PageRenderer} /> 
        // 重導向 /home url, 
        <Route path="/" render={() => <Redirect to="/home" />} />
        // 不符合的 404
        <Route component={() => 404} />
    </Switch>
    ```
  - Code: Page-renderer.js，利用 `useRouteMatch` 取得 match 物件內、分析 URL 的 params 物件
    ```JSX
    // match.params 物件為: 
    // Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
    import React from 'react'
    import { useRouteMatch } from 'react-router-dom'

    const generatePage = page => {
        const component = () => require(`./pages/${page}`).default //default export of that required module

        try {
            return React.createElement(component())
        } catch (err) {
            console.warn(err)
            return React.createElement(() => 404)
        }
    }

    function PageRenderer() {
        const {
            params: { page } // ES6 解構賦值 (Destructuring assignment), 2 access page variable
        } = useRouteMatch() // useRouteMatch 取得 match 物件內的 params 物件

        return generatePage(page)
    }

    export default PageRenderer

    ```
### [skills] 引用外部檔案 -- Import vs. Require
- 比較
  | 方法 | 引用or加載 | difference
  | ------ | ------ | ------ |
  |require| 用於讀取並執行js文件，返回該 module 的 export 對象 |  動態編譯、運行時加載、動態加載
  |import| ES6、生成外部 module 的引用而非加載，真正使用到該 module 時才會去加載 | 靜態編譯


## BUILDING: Masonry (blog posts in home page) 

```
Layout of components for blogposts:

Home
└───PostMasonry (Layout for MasonryPost)
|   └───MasonryPost
└───MasonryPost (eg. for specific css inline style)
```

### [skills] CSS Grid merge specifig config
- Where: in home.js (Home page)
- Purpose: 
  - seperation of concerns (`SOC`) 
  - dynamic let one grid out of many have different grid-area style(by Inline style).
- Outcomes: 
  | component | Layout | html tags after rendered | 
  | ------ | ------ | ------ |
  |PostMasonry| Grid 佈局不同 Posts | `<section class="masonry" style="grid-template-columns: repeat(3, minmax(275px, 1fr));">`
  |MasonryPost| Post's title, date, tag, background img | a 標籤內的`styles`(inline style) 多了 `grid-area: 1 / 2 / 3 / 3 ;`

- How:
  - `trending` obj as trending posts obj literals, 零件中被以 posts 的 props name 傳給 PostMasonry 再給 MasonryPost
  - home.js (利用物件的 `dot notation` 直接附加一個 style 屬性，做到 `SOC`)
  ```JSX
    const trendingConfig = {
        1: {
            gridArea: '1 / 2 / 3 / 3'
        }
    }

    const mergeStyles = function (posts, config) {
        posts.forEach((post, index) => {
            post.style = config[index] // if config have that index ...
        })
    }

    mergeStyles(trending, trendingConfig)
  ```
  - masonry-post.js
  ```JSX
    // before
    const style = { backgroundImage: `url("${require(`../../assets/images/${post.image}`).default}")` };

    // after w/ Destructuring 
    const imageBackground = { backgroundImage: `url("${require(`../../assets/images/${post.image}`).default}")` };

    const style = {...imageBackground, ...post.style}

    // the component returns ...
    <div className="tags-container">
        {
            post.categories.map((tag, ind) => (
                <span key={ind} className="tag" style={{ backgroundColor: categoryColors[tag] }}>
                    {tag.toUpperCase()}
                </span>
            ))
        }
    </div>
  ```
  - Careful with `inline style` management: 
    - `RWD`: Here we merged grid-area as an `inline style`, which means `RWD` should specifically dealt with, other than `@media screen and (max-width: 900px){...}` set in SCSS. 
    - `How`: Useing `window.innerWidth` to access the window's visual viewport & Useing `ternary conditional operator` to filter the inline style. 
    - `TBD`: One downside is UI won't change smoothly according to manul draging to change window's visual viewport, only when refresh the page would fix the UI problem. 

### [TroubleShooting] Background img not loaded
- 問題出在 `require(url)` vs `require(url).default` （後者才載出來）
- But WHY ??
  ```JSX
  const style = { backgroundImage: `url("${require(`../../assets/images/${post.image}`)}")` };
  console.log(style)  
  //{backgroundImage: "url("[object Module]")"}

  const style = { backgroundImage: `url("${require(`../../assets/images/${post.image}`).default}")` };
  console.log(style) 
  //{backgroundImage: "url("/static/media/money.88234e16.jpg")"}
  ```


## BUILDING: Pagination & Hooks

### [skills] Pagination 翻頁機能 [TBD]
- home.js 內的 post-grid.js
- [TBD] 控制一頁顯示幾個 Posts：使用 useMemo + useState → BUT why not useEffect or useCallback ?
- 翻頁後自動拉動捲軸向上：useEffect

### [skills] CSS dealing with backgorund img(variouse size) in grid
- 三個重點
  - `<a>` & `<img>` 分別如何 fetch bg-img ?
  - 承上，JSX中如何將其 `url str` (代表檔案路徑的str) 放入 inline style？
  - CSS 如何使圖片置中，儘管圖片原檔大小彼此不一？
- `Posts obj literal` having post.image (對應到真正的圖檔名稱), which is accessed and set as `url str`(檔案路徑的str) and put in CSS `inline style`
- in masonry-post: `url str` as obj literal `{backgroundImage: url}`, and be put into JSX a tag's style property.
  ```JSX
  const imageBackground = { backgroundImage: `url("${require(`../../assets/images/${post.image}`).default}")` };
  const style = windowWidth > 900 ? {...imageBackground, ...post.style} : imageBackground
  // return JSX
  <a className="masonry-post overlay" style={style} href={post.link}> </a>
  ```
  ```CSS
  background-size: cover;
  background-position: center center;
  ```
- in post-grid: url str 放入 JSX `<img>` 的 `src`屬性內
  ```JSX
  // return JSX
  <img src={require(`../../assets/images/${post.image}`).default} alt={post.name}/>
  ```
  ```CSS
  object-fit: cover;
  object-position: center center;
  ```
   





# [Back-end] Practice note

## TBD: Table of Contetns
to download MarkDown All in One in VSCode

## TBD: File tree
to download awesome extension in VSCode

## Init Server
- 初始化 `npm init` in new created file named graphql<br/>
  - `scripts:test` in package.json, let you type `npm run test` in Unix Command to run your script.
  ```
    {
    "name": "react-blog-backend",
    "version": "1.0.0",
    "description": "A Koa and GraphQL backend for React blog",
    "main": "app.js",
    "scripts": {
        "test": "test"
    },
    "author": "Benson Tuan",
    "license": "ISC"
    }
  ```
  - run by `node app` in command line, with GraphQL plaground, a chrome extension

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

## [TBD] GraphSQL
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

## MySQL
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
  - Commented out by `.gitignore`: 檔案內會放環境變數，常存放敏感資料如帳密
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


#### [Skills] Error Control: Sync & Async & Promise-based
1. `Async` Function: inner `Throw err`in cb
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

















## NVM 
brew install mysql lead to brew auto-update and node auto-update, anthus node-sass module throw erre of not suportinig for latest node version.
### ❌ nvm install by MacOS homebrew
    結論：請按照官網去下載，nvm 不支援 homebrew，會引來很多麻煩⋯⋯以下記錄錯誤過程
- `brew install nvm`
- `brew info nvm` see the "caveats" section, like following
  ```
    You should create NVM's working directory if it doesn't exist:

    mkdir ~/.nvm

    Add the following to ~/.zshrc or your desired shell
    configuration file:

    export NVM_DIR="$HOME/.nvm"
    [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
    [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

    You can set $NVM_DIR to any location, but leaving it unchanged from
    /usr/local/opt/nvm will destroy any nvm-installed Node installations
    upon upgrade/reinstall.
  ```
- `mkdir ~/.nvm`. At root dir `ls` don't show the file, but `ls -a` or `ls -al` does shows.
- `~/.zshrc` but terminal says `zsh: permission denied` 
  - zsh is the shell I'm using, some use bash
  - .zshrc is the configuration file itself, would run whenever start zsh
- `cat ~/.zshrc` to read it
  - there are some conda init stuff
- (op1) `vim ~/.zshrc` to edit it
  - To edit, press `i` button
  - To save the changes,  `esc +: qw`
- (op2) `nano ~/.zshrc` to edit it
  - `Ctrl+O` to save
  - `Ctrl+X` to exit 
  - caveats 所說的 `NVM_DIR="$HOME/.nvm"` 改成 `Users/benson/.nvm` 跟改成 `~/.nvm` 但都沒用！Shell 內還是不知道 nvm 是誰
- `source ~/.zshrc` or reset the terminal before run the nvm
  - `source` command can be used to load any functions file into the current shell script or a command prompt.
  - `sourced shell function ` vs `executable binary` [參考文章](https://medium.com/@toumasaya/node-js-環境設定-for-mac-a2628836feaf)
    - 無法使用 `which nvm` 來檢查，因為 nvm 是一個 sourced shell function
    - 最好還是按照官網去下載，nvm 不支援 homebrew，所以才那麼多麻煩⋯⋯
- 不安全的目錄：重新開啟或是 source 檔案後都會出現
  ```
  zsh compinit: insecure directories, run compaudit for list.
  Ignore insecure directories and continue [y] or abort compinit [n]? 
  ```
### ⭕️ 重新整理並安裝 npm, nvm, node
    目標架構：不透過 brew，安裝 nvm，之下安裝 npm，之下安裝 node
#### 解除安裝前面 brew 安裝失敗的東西
(下列的bash_profile 類似於前述我用的 zshrc，刪掉前述新增的config)
  ```
  brew uninstall nvm
  sudo rm -rf ~/.nvm
  sudo rm -rf ~/.npm
  vi /usr/個人電腦用戶名/.bash_profile
  ```
  - `-rf`: combination of 2 commands: `-r` (recursive removal), `-f` (force)
  - `~/.npm` is a cache that npm uses to avoid re-downloading the same package multiple times. 
    - `npm cache clean` to cleanup
#### 解除安裝前面 node
  - `brew uninstall node`
#### nvm install by cURL
  - 以下指令會把 nvm repository 複製到 `~/.nvm`:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    ```
  - 按照[nvm的git官網](https://github.com/nvm-sh/nvm)的除錯建議，新增設定到`~/.zshrc`之後再輸入`. ~/.zshrc`就可以了（等同`source ~/.zshrc`）
#### nvm command 
  | 指令 | 說明 |
  | ------ | ------ |
  |`nvm ls`| 列出 Local 所有的 Node.js 版本 |
  |`nvm ls-remote`| 列出 Remote 所有的 Node.js 版本 |
  |`nvm install [version]` | version = number |
  |`nvm install stable` | 安裝目前的穩定版(但是不是官網推薦版本⋯⋯是最新) |
  |`nvm alias default [version]` | 指令以後預設啟用的 Node.js 版本 |
  |`nvm use [version]` | 使用該版本，但不更改預設啟用的版本 |

#### npm, node installed by nvm
  - 按照上面指令下載 node LTS 版本
  - Node would include npm

### 🔺 記錄前後差異
#### 檢查 node, npm
  - `which node`
    - before: /usr/local/bin
    - after: /Users/benson/.nvm/versions/node/v14.17.0/bin/node
  - `which npm`
    - before: /usr/local/bin
    - after: /Users/benson/.nvm/versions/node/v14.17.0/bin/npm
  - `npm list -g` 全域安裝的套件
    - before
      ```
      (base) benson@BensondeMacBook-Pro .npm % `npm list -g`
      /usr/local/lib
      ├── create-react-app@4.0.3
      ├── npm@7.13.0
      └── sass@1.32.8
      ```
    - after 卻跑出一大串東西，改成改成輸入 `npm list -g --depth=0` 後乾淨許多
      ```
      /Users/benson/.nvm/versions/node/v14.17.0/lib
      └── npm@6.14.13
      ```
  - `npm list` 當前目錄下安裝的套件，以此專案目錄為例
    - before
    ```
    (base) benson@BensondeMacBook-Pro blog-react % `npm ls`
    blog-react@0.1.0 /Users/benson/Documents/workrepo/blog-react
    ├── @quasar/extras@1.10.2
    ├── @testing-library/jest-dom@5.11.10
    ├── @testing-library/react@11.2.6
    ├── @testing-library/user-event@12.8.3
    ├── antd@4.15.0
    ├── moment@2.29.1
    ├── node-sass@5.0.0
    ├── react-dom@17.0.2
    ├── react-router-dom@5.2.0
    ├── react-scripts@4.0.3
    ├── react@17.0.2
    ├── sass-loader@10.1.1
    └── web-vitals@1.1.1
    ```
    - after 噴一堆錯.....
    ``` 
    npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
    ```
#### 檢查 react-blog 專案
貌似是我前面刪掉了 npm cache，`npm start`嘗試啟動react專案後，node-sass噴錯要我執行 `npm rebuild node-sass`，之後就成功開啟了。

