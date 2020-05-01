(function () {
  const MARK_CLASS_ITEM = 'js-mk-item'
  // const axios = require('axios');
  let prevUrl = "";
  let listPrices = [];

  let inProcessItem = true;

  addSortBtns();

  setTimeout(() => {
    findItemUrl();
    document
      .querySelector('div[data-sorttype="price"]')
      .addEventListener("click", function () {
        findItemUrl();
      });

    setInterval(() => {
      if (!prevUrl) {
        prevUrl = location.href;
        return;
      }

      if (prevUrl !== location.href) {
        console.log("href was changed");
        prevUrl = location.href;
        findItemUrl();
      }
    }, 1000);
  }, 1000);

  async function findItemUrl() {
    removeMKItem();
    const items = document.querySelectorAll(".market_listing_row_link");
    listPrices = [];
    inProcessItem = true;

    // items.forEach(async (item, index) => {
    //   const href = item.href
    //     .split("?")
    //     .filter((t) => !/filter/.test(t))
    //     .join("");

    //   listPrices[index] = 0;
    //   let temp = await getItem(href, index);
    //   if (!temp) return;

    //   document
    //     .querySelectorAll(".market_listing_row")
    //     [index].appendChild(createPriceItem(temp));
    //   listPrices[index] = temp;
    // });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const href = item.href
        .split("?")
        .filter((t) => !/filter/.test(t))
        .join("");

      listPrices[i] = { element: item, price: 0 };
      let temp = await getItem(href, i);
      if (!temp) continue;

      document
        .querySelectorAll(".market_listing_row")
        [i].appendChild(createPriceItem(temp));
      listPrices[i].price = parseFloat(temp.split(",").join("."));
    }

    inProcessItem = false;
  }

  async function getItem(url, index) {
    try {
      const { data } = await axios.get(url);

      return parsePageItem(data);
    } catch (err) {
      console.log(err);
    }
  }

  function parsePageItem(data) {
    if (!data) return;
    const regx = new RegExp(
      /<span class="market_listing_price market_listing_price_with_fee">/
    );

    let temp = data.match(regx);

    let s = data
      .slice(temp.index, temp.index + 125)
      .split("")
      .filter((item) => {
        return !!item.trim();
      })
      .join("");

    return s.match(/\d+(,)?\d+/)[0];
  }

  function createPriceItem(value) {
    const div = document.createElement("div");
    div.textContent = value;
    div.style.fontSize = 18;
    div.style.color = "#f00";

    return div;
  }

  function sortByPrice(sortBy = "abc") {
    return function () {
      if (inProcessItem) return;
      if (listPrices.length === 0) return;
      const parent = document.querySelector("#searchResultsRows");
      const items = document.querySelectorAll(".market_listing_row_link");
      console.log("[SORT]", items);

      let absPrices = [...listPrices];

      absPrices.sort((a, b) => {
        if (sortBy === "abc") {
          if (a.price < b.price) return -1;
          if (a.price > b.price) return 1;
        }

        if (sortBy === "cba") {
          if (a.price < b.price) return 1;
          if (a.price > b.price) return -1;
        }

        return 0;
      });
      console.log("[SORT]", sortBy, absPrices);

      items.forEach((item) => {
        item.remove();
      });

      absPrices.forEach((item) => {
        item.element.classList.add(MARK_CLASS_ITEM);
        parent.appendChild(item.element);
      });
    };
  }

  function removeMKItem() {
    console.log('[REMOVE]')
    const items = document.querySelectorAll(`.${MARK_CLASS_ITEM}`);
    items.forEach((item) => {
      item.remove();
    });
  }

  function addSortBtns() {
    const p = document.querySelector(".market_search_results_header");

    const c = document.createElement("div");
    c.style.display = "flex";

    c.appendChild(createBtn("abc", sortByPrice("abc")));
    c.appendChild(createBtn("cba", sortByPrice("cba")));

    p.appendChild(c);

    function createBtn(title, onClick) {
      const btn = document.createElement("button");
      btn.title = title;
      btn.textContent = title;

      btn.style.padding = `4px 14px`;
      btn.style.marginRight = "5px";
      btn.style.marginLeft = "5px";
      btn.style.display = "block";
      btn.style.border = 0;
      btn.style.color = "#fff";
      btn.style.backgroundColor = "#FE2712";
      btn.onclick = onClick;
      return btn;
    }
  }
})();
