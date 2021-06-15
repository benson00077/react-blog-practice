# Table of Content
My personal note when building this repo

- [Table of Content](#table-of-content)
- [NVM](#nvm)
  - [❌ Installed by MacOS homebrew](#-installed-by-macos-homebrew)
  - [⭕️ 重新整理並安裝 npm, nvm, node](#️-重新整理並安裝-npm-nvm-node)
    - [解除安裝前面 brew 安裝失敗的東西](#解除安裝前面-brew-安裝失敗的東西)
    - [解除安裝前面 node](#解除安裝前面-node)
    - [nvm installed by cURL](#nvm-installed-by-curl)
    - [nvm command](#nvm-command)
    - [npm, node installed by nvm](#npm-node-installed-by-nvm)
  - [🔺 記錄前後差異](#-記錄前後差異)
    - [檢查 node, npm](#檢查-node-npm)
    - [檢查 react-blog 專案](#檢查-react-blog-專案)



# NVM 
brew install mysql lead to brew auto-update and node auto-update, anthus node-sass module throw erre of not suportinig for latest node version.
## ❌ Installed by MacOS homebrew
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
## ⭕️ 重新整理並安裝 npm, nvm, node
    目標架構：不透過 brew，安裝 nvm，之下安裝 npm，之下安裝 node
### 解除安裝前面 brew 安裝失敗的東西
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
### 解除安裝前面 node
  - `brew uninstall node`
### nvm installed by cURL
  - 以下指令會把 nvm repository 複製到 `~/.nvm`:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    ```
  - 按照[nvm的git官網](https://github.com/nvm-sh/nvm)的除錯建議，新增設定到`~/.zshrc`之後再輸入`. ~/.zshrc`就可以了（等同`source ~/.zshrc`）
### nvm command 
  | 指令 | 說明 |
  | ------ | ------ |
  |`nvm ls`| 列出 Local 所有的 Node.js 版本 |
  |`nvm ls-remote`| 列出 Remote 所有的 Node.js 版本 |
  |`nvm install [version]` | version = number |
  |`nvm install stable` | 安裝目前的穩定版(但是不是官網推薦版本⋯⋯是最新) |
  |`nvm alias default [version]` | 指令以後預設啟用的 Node.js 版本 |
  |`nvm use [version]` | 使用該版本，但不更改預設啟用的版本 |
  |`nvm current` | current node version

### npm, node installed by nvm
  - 按照上面指令下載 node LTS 版本
  - Node would include npm

## 🔺 記錄前後差異
### 檢查 node, npm
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
### 檢查 react-blog 專案
貌似是我前面刪掉了 npm cache，`npm start`嘗試啟動react專案後，node-sass噴錯要我執行 `npm rebuild node-sass`，之後就成功開啟了。

