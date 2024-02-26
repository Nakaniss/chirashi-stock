from pydantic import BaseModel


# GETリクエストの型定義（※送られてきたGETが、この型通りなのかチェックする）
class PostRequest(BaseModel):
    # データ例
    # {
    #     "shopid": 123
    # }
    shopid: int


# チラシの型定義
class Chirashi(BaseModel):
    name: str
    url: str
