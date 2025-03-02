// 取得當前網頁的 localStorage 資料
const localStorageData = { ...localStorage };

// 將資料傳回給背景腳本或擴充功能的其他部分
chrome.runtime.sendMessage({
  type: "LOCAL_STORAGE_DATA",
  data: localStorageData,
});
