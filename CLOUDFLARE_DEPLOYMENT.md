# 課堂操作中心｜GitHub＋Cloudflare Pages 發布步驟

> 目的：把「操作練習＋指令卡」發布成學員可用手機開啟的 HTTPS 網址。  
> 目前模板已發布；本文同時保留給學員建立自己版本時使用。

- GitHub：<https://github.com/vicxd0728/course-ai-workbench-template-v1>
- Pages 首頁：<https://course-ai-workbench-template-v1.pages.dev/>
- QR 指令中心：<https://course-ai-workbench-template-v1.pages.dev/guide.html>

## 發布前確認

在專案資料夾執行：

```powershell
npm.cmd install
npm.cmd test
npm.cmd run build
```

確認測試通過，而且 `dist` 資料夾同時含有：

- `index.html`：操作練習。
- `guide.html`：學員指令卡。

## 一、建立 GitHub 儲存庫

1. 在 GitHub 建立新的空白儲存庫。
2. 不要加入真實客戶資料、`.env`、密碼或管理用金鑰。
3. 把這個模板資料夾提交並推送到該儲存庫。
4. 確認 GitHub 網頁上看得到 `index.html`、`guide.html`、`src` 與 `package.json`。

## 二、連接 Cloudflare Pages

1. 登入 Cloudflare Dashboard。
2. 進入 **Workers & Pages**，選擇建立 Pages 專案。
3. 選擇 **Connect to Git**，連接剛才的 GitHub 儲存庫。
4. 使用下列建置設定：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

本機 Windows 使用 `npm.cmd run build`；Cloudflare 的 Build command 使用 `npm run build`。

5. 範例模式不需要設定環境變數，也不需要資料庫。
6. 儲存並開始部署，等待狀態顯示成功。

## 三、部署後驗收

依序用無痕視窗與手機開啟：

```text
https://course-ai-workbench-template-v1.pages.dev/
https://course-ai-workbench-template-v1.pages.dev/guide.html
```

至少確認：

- 兩頁都能開啟並互相切換。
- 指令卡的每個「複製」按鈕都能顯示「已複製」。
- 三個案例可完成決策、任務與結果寫回。
- 手機版沒有水平溢出，按鈕可正常點擊。
- 重新整理後，範例資料只保留在該瀏覽器。

範例模式採瀏覽器本機儲存，不會跨裝置同步。若日後啟用 Supabase，必須另行驗證登入、RLS 權限與跨裝置讀回；不能用這次靜態部署代表資料庫已完成。

## 四、替換 PPT 與現場 QR Code

部署與手機驗收都通過後：

1. 以 `https://你的-pages-網址/guide.html` 產生 QR Code。
2. 把 PPT 中的暫用 QR Code／本機網址換成正式網址。
3. 手機實掃 PPT 上的 QR Code，確認最後落在「課堂指令卡」。
4. 上課前再掃一次；若正式網址有異動，必須重新產生並替換 QR Code。

不要把 `http://127.0.0.1:4175/` 製成給學員掃描的 QR Code；那個網址只能在講師自己的電腦使用。
