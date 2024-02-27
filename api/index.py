from fastapi import FastAPI
import requests
import re
from bs4 import BeautifulSoup
from pydantic import BaseModel


# GETリクエストの型定義（※送られてきたGETが、この型通りなのかチェックする）
class PostRequest(BaseModel):
    shopid: int


# チラシの型定義
class Chirashi(BaseModel):
    name: str
    url: str


# headersにUser-Agentを入れてHTMLを取得する関数
def get_html(url):
    headers = {"User-Agent": "Mozilla/5.0"}  # headersが無いと403になる
    res = requests.get(url=url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    return soup


# チラシが存在するかどうかを確認する関数
def chirashi_exists(url):
    html = get_html(url)
    leaflet = html.find_all("section", id="leaflet")
    return bool(leaflet)  # bool(listオブジェクト)=リストが空ならfalseを返す


# ①店舗のページから、②viewページへのリンクを探す関数
def getlink_viewpage(url):
    # url:①店舗のページ
    # https://tokubai.co.jp/{店舗名}/{shopid}
    html = get_html(url)
    atags = html.find_all("a", target="_blank")  # target="_blank"のaタグを取得
    filtered_atags = [
        tag for tag in atags if "チラシ" in tag.text
    ]  # "チラシ"を含むaタグ
    href_viewpage = filtered_atags[0].get("href")  # hrefを取得
    link_viewpage = "https://tokubai.co.jp" + str(href_viewpage)

    return link_viewpage


# ②viewページから、チラシの画像URLを取得する関数
def getlink_image(url):
    # url:②viewページ
    # https://tokubai.co.jp/{店舗名}/{shopid}/leaflets/58985279?from=leaflet_navigation&origin_shop_id={shopid}

    # テスト
    # url = 'https://tokubai.co.jp/%E3%82%B3%E3%83%BC%E3%83%97%E3%81%95%E3%81%A3%E3%81%BD%E3%82%8D/7626/leaflets/58985279'

    html = get_html(url)
    elems_container = html.find_all(
        "div", class_="container"
    )  # container:下の"このお店の他のチラシ・特売情報"の中にある画像とチラシ名が格納されたコンテナ

    list_chirashi = []
    for elem_container in elems_container:
        # containerの内、other_leaflet_linkが存在するコンテナのみ取得：
        other_leaflet_link = elem_container.find("a", class_="other_leaflet_link")

        if other_leaflet_link:
            href = other_leaflet_link.get("href")  # hrefタグ（＝URLの後半）を取得
            url = (
                "https://tokubai.co.jp" + href
            )  # URLを結合し、[チラシを選択した状態のURL]を取得
            html = get_html(url)  # チラシのページをインスタンス化
            chirashi = html.find(
                "img", class_="leaflet"
            )  # [チラシを選択した状態のURL]にアクセスして、imageタグ(=フルURLがある)を取得

            if chirashi:
                link_image = chirashi.get("src")  # imgタグ内のsrcからフルURLを取得
                img = other_leaflet_link.find(
                    "img"
                )  # imgタグ（alt=チラシの期間,class,src）を取得
                alt = img.get("alt")  # imgタグから、altタグ（=チラシの期間）を取得

                # container_titleタグ(=チラシ名)がある場合に取得
                try:
                    container_title = other_leaflet_link.find(
                        "div", class_="container_title"
                    ).text()
                    container_title = str(container_title)
                except Exception:
                    container_title = ""

                # 末尾に、link_imageの末尾番号を追加
                chirashi_index = re.findall(r"\d+$", link_image)[
                    0
                ]  # findallはlistで返すので注意
                chirashi_name = f"{alt} {container_title}[{chirashi_index}]"
                list_chirashi.append([chirashi_name, link_image])

    return list_chirashi


def getjson_chirashi(shopid):
    url = f"https://tokubai.co.jp/{shopid}"

    # チラシが存在しないページの場合終了
    if not chirashi_exists(url):
        return None

    # チラシが存在する場合の処理
    # スクレイピング
    link_viewpage = getlink_viewpage(url)
    links_image = getlink_image(
        link_viewpage
    )  # [['チラシ名', '画像リンク'],･･･]のリストで返す

    chirashi_json = {}
    for link_image in links_image:
        # チラシの情報をチラシクラスへインスタンス化:型チェックもかねて
        chirashi = Chirashi(name=link_image[0], url=link_image[1])
        # チラシの情報をjsonに追加
        chirashi_json[chirashi.name] = chirashi.url

    return chirashi_json


app = FastAPI()


@app.post("/api/getchirashi")
async def receive_data(postrequest: PostRequest) -> dict:

    shopid = postrequest.shopid
    response = getjson_chirashi(shopid)

    return {"response": response}
