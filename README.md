# My react blog practice note

## Table of Contetns
TBD (to download MarkDown All in One in VSCode)

## BUILDING: Navigation bar w/ RWD
#### 動態管理 URL -- 利用 match obj 
    避免 hardcode 每個分頁的 <Route>
- [To learn match obj by official doc](https://reactrouter.com/web/api)
- [To learn match obj by other's note](https://ithelp.ithome.com.tw/articles/10204451)
- So as to render any dynamic page without having to maintain nav links component, 
    ```JSX
    // App.js 內的 Route 包含：
    // 1.動態管理URL(對應到不同分頁，卻不用hard-coded每個分頁) 
    // 2.重導向 /home url, 
    // 3.不符合的 404
    <Switch>
        <Route path="/:page" component={PageRenderer} />
        <Route path="/" render={() => <Redirect to="/home" />} />
        <Route component={() => 404} />
    </Switch>
    ```

    ```JSX
    // Page-renderer.js 
    // useRouteMatch 取得 match 物件
    // match.params 物件為: Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
    // 用 ES6 解構賦值 (Destructuring assignment) 語法，動態取得 params 應到的 value 
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
            params: { page }
        } = useRouteMatch()

        return generatePage(page)
    }

    export default PageRenderer

    ```
#### 引用外部檔案 -- Import vs. Require
- 比較
  | 方法 | 引用or加載 | difference
  | ------ | ------ | ------ |
  |require| 用於讀取並執行js文件，返回該 module 的 export 對象 |  動態編譯、運行時加載、動態加載
  |import| ES6、生成外部 module 的引用而非加載，真正使用到該 module 時才會去加載 | 靜態編譯


## BUILDING: Masonry(blog posts in home page) 

- 圖片載不出來：問題出在 `require(url)` vs `require(url).default` （後者才載出來）
- But WHY??
  ```JXS
  const style = { backgroundImage: `url("${require(`../../assets/images/${post.image}`)}")` };
  console.log(style)  
  //{backgroundImage: "url("[object Module]")"}

  const style = { backgroundImage: `url("${require(`../../assets/images/${post.image}`).default}")` };
  console.log(style) 
  //{backgroundImage: "url("/static/media/money.88234e16.jpg")"}
  ```
