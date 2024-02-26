from fastapi import FastAPI

# from fastapi.middleware.cors import CORSMiddleware

from api.chirashi_stock import getjson_chirashi

from api.Models import PostRequest


app = FastAPI()

# # Next.jsでAPIを叩くための記述
# origins = ["http://localhost:8000"]  # ここにNext.jsのURLを設定
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# TODO:requestにハッシュ化したTOKEN含ませたい
@app.post("/api/getchirashi")
async def receive_data(postrequest: PostRequest) -> dict:

    shopid = postrequest.shopid
    response = getjson_chirashi(shopid)

    return {"response": response}
