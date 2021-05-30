# My react blog practice note (Front-end)

## TBD: Table of Contetns
to download MarkDown All in One in VSCode

## TBD: File tree
to download awesome extension in VSCode

## Dependency used
`eco-system`: react-router-dom <br/>
`SASS`: node-sass, sass-loader <br/>
`UI`: antd & ionicons <br/> 
`Date`: moment. `moment().format('MMMM DD, YYYY')` to generate posts date <br/>
`Posts obj literals`: defined in mocks direcotry (pretend back-end logic datas) <br/>
- How does these SCSS & UI tools inplemented in `index.js` ? 
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
### 動態管理 URL 
- 目的：避免 hardcode 每個分頁的 `<Route>` component. To render any dynamic page without having to maintain nav links component, 
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
### 引用外部檔案 -- Import vs. Require
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

### CSS Grid merge specifig config ── merge with posts obj literal thus manipulate one's css out of many
- Where: in home.js
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

### TroubleShooting: Background img not loaded
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

### Pagination 翻頁機能 [TBD]
- home.js 內的 post-grid.js
- [TBD] 控制一頁顯示幾個 Posts：使用 useMemo + useState → BUT why not useEffect or useCallback ?
- 翻頁後自動拉動捲軸向上：useEffect

### CSS dealing with backgorund img(variouse size) in grid
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
   





# My react blog practice note (Front-end)

## TBD: Table of Contetns
to download MarkDown All in One in VSCode

## TBD: File tree
to download awesome extension in VSCode

## Init
- 初始化 `npm init` <br/>
  - `scripts:test` for example, let you type `npm run test` in Unix Command to run your script.
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
  - run by `node app` in command line

- 安裝套件 `npm i -S [dependency...1] [...2] [...3] `
  - apollo-server-koa
  - graphql-tools
  - koa
  - moment

- In app.js 
  - Set Apollo Server
    - Import resolvers & typeDefs
  - Set Koa Server
  - Set Koa as Apollo Server's MiddleWare

## GraphSQL
- type, schema, and resolver

## MySQL
- 3rd normal form (3NF):
  - 確保在一個 table 內，除了 primiry key 的其他鍵值都是彼此獨立無關
  - should never have a many-to-many relationship
  - If having one-to-one relationship, consider merging those 2 table into 1 table.
- Lucidchart website: to draw entity relationship diagram (ERD) and know cardinality
- Composite Key: 例如一個文章有很多個 Likes，但一人只能貢獻一個。 <br/>
  所以這個 table 內的 post_id, author_id 組成一個 Composite 


a reference table :
a table where you have one record from one table and reference to another, and it links them together, so that you can join on that table where those 2 IDs exist