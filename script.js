
let prevUrl = '';
setTimeout(() => {
  findItemUrl();
  document
    .querySelector('div[data-sorttype="price"]')
    .addEventListener("click", function () {
      findItemUrl();
    });

    setInterval(()=>{
      if (!prevUrl){
        prevUrl = location.href;
        return
      }

      if (prevUrl !== location.href){
        console.log('href was changed')
        prevUrl = location.href
        findItemUrl();
      }
    },2000);
}, 2000);



function findItemUrl() {
  const items = document.querySelectorAll(".market_listing_row_link");
  items.forEach(async (item, index) => {
    const href = item.href.split('?').filter((t)=>!/filter/.test(t)).join('');

    let temp = await getItem(href, index);
    if (!temp) return;

    document
      .querySelectorAll(".market_listing_row")
      [index].appendChild(createPriceItem(temp));
  });
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
