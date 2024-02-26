# このファイルはメインの処理を記載したファイルです。
# get_json_app/views.pyで呼び出されます。

# スクレイピングの処理
from api.scraping import chirashi_exists
from api.scraping import getlink_viewpage
from api.scraping import getlink_image

# データ型定義
from api.Models import Chirashi  # チラシ


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
