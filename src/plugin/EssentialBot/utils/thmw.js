(() => {
  const list = [];
  const result = [];

  const get = async () => {
    console.log("正在爬取");
    let currentTitle = "未知标题";
    document.querySelectorAll("tbody tr").forEach(tr => {
      if (tr.classList.contains("tt-header")) {
        let titleElem = tr.querySelector(".tt-titlezh");
        if (titleElem) {
          currentTitle = titleElem.textContent.trim();
        }
      } else if (tr.classList.contains("tt-audio")) {
        let aTag = tr.querySelector("a");
        if (!aTag) return;

        let filePath = decodeURIComponent(new URL(aTag.href).pathname.substring(1));
        list.push({ filePath, realTitle: currentTitle });
      }
    });

    result.push(...await Promise.all(list.map(async ({ filePath, realTitle }) => {
      const api = `https://thwiki.cc/api.php?action=query&titles=${encodeURIComponent(filePath)}&prop=imageinfo&iiprop=url&format=json`;

      try {
        let response = await fetch(api);
        if (!response.ok) {
          console.error(`请求失败: ${response.status}`);
          return null;
        }

        let json = await response.json();
        let pages = json?.query?.pages;
        if (!pages) {
          console.warn(`未找到页面数据: ${filePath}`);
          return null;
        }

        let keys = Object.keys(pages);
        for (let key of keys) {
          let obj = pages[key];
          if (!obj.imageinfo || obj.imageinfo.length === 0) {
            console.warn(`请求出错: ${filePath}`);
            return null;
          }
          let imageinfo = obj.imageinfo[0];

          return {
            name: realTitle,
            path: imageinfo.url
          };
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
      return null;
    })));

    console.log("结果:");
    console.log(JSON.stringify(result.filter(Boolean), null, 2));
  };
  return get();
})();
