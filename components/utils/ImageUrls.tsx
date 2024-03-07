// <img>内のaltとsrcを取得し、配列で返す関数
const getImageInfo = (imageElement: HTMLImageElement) => {
  // imgタグ内のaltを取得
  const title = imageElement.getAttribute("alt") || "";
  // imgタグ内のsrcを取得
  const src = imageElement.getAttribute("src") || "";

  // srcにdomainを結合してurlにする
  const currentDomain = window.location.origin;

  // URLのパラメータを除去し文字列に変換
  const urlObject = new URL(src, currentDomain);
  const url = urlObject.toString();

  return { title, url };
};

const getAllImageUrls = (): Record<string, string> => {
  // ページ内のすべての画像要素を取得
  const imageElements = document.querySelectorAll("img");

  // imgタグからtitleとurlを抽出して、imageUrlsという配列を作成
  const imageUrls = Array.from(imageElements).map(getImageInfo);

  // imageUrls 配列をtitle をキー、url を値とするオブジェクトを作成
  const urlsObject = imageUrls.reduce((acc, cur) => {
    acc[cur.title] = cur.url;
    return acc;
  }, {} as Record<string, string>);

  // オブジェクトを返す
  return urlsObject;
};

export default getAllImageUrls;
