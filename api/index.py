from fastapi import FastAPI

# from api.chirashi_stock import getjson_chirashi
# from api.Models import PostRequest

app = FastAPI()

# test start
import logging
import sys


@app.get("/")
async def root():
    logging.basicConfig(
        level=logging.INFO
    )  # ログレベルを設定 (INFOレベル以上のログを表示)
    logging.info("ログ出力テスト")  # ログ出力
    logging.warning("警告ログ出力テスト")  # 警告ログ出力
    logging.error("エラーログ出力テスト")  # エラーログ出力
    logging.info(sys.path)
    print(sys.path)
    return {"message": "Hello World"}


# test end

# TODO:requestにハッシュ化したTOKEN含ませたい
# @app.post("/api/getchirashi")
# async def receive_data(postrequest: PostRequest) -> dict:

#     shopid = postrequest.shopid
#     response = getjson_chirashi(shopid)

#     return {"response": response}


# from fastapi.middleware.cors import CORSMiddleware
# # Next.jsでAPIを叩くための記述
# origins = ["https://chirashi-stock.vercel.app/"]  # ここにNext.jsのURLを設定
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
