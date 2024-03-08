"use client";

import DownloadButton from "@/components/utils/DownloadButton";
import LoadingButton from "@/components/utils/LoadingButton";
import SearchButton from "@/components/utils/SearchButton";
import Image from "next/image";
import React, { useState } from "react";

function Home() {
  // サーバーからのレスポンスデータを保持するstate
  const [responseData, setResponseData] = useState(null);
  // shopidの入力用state
  const [shopid, setShopid] = useState("");
  // 読み込み中ならTrueを返すフラグ
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  // 検索ボタンをクリックしたときの処理
  async function sendRequest() {
    //読み込み開始と同時にtrueにする
    setIsRequestInProgress(true);
    //shopidを送信して、APIからデータを取得する
    try {
      const response = await fetch("/api/getchirashi", {
        method: "POST",
        body: JSON.stringify({ shopid }), // shopidをAPIに送信
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData(data.response); // responseを保持
        setIsRequestInProgress(false);
      } else {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        setIsRequestInProgress(false);
        throw new Error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsRequestInProgress(false);
    }
  }

  return (
    <main>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-4xl font-bold my-2">チラシストック</h1>
          <p className="text-xs text-slate-500 my-4">
            shopidで検索すると、現在公開されているチラシ画像が表示されます。
          </p>
          {/* input */}
          <input
            type="tel"
            maxLength={10}
            id="shopid"
            name="shopid"
            autoComplete="on"
            placeholder="shopidを入力してください (例:20176)"
            value={shopid}
            onChange={(e) => setShopid(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-300"
          />

          {/* start buttons */}
          <div className="flex flex-row justify-between mb-2">
            {/* 検索ボタン */}
            <div>
              {isRequestInProgress && (
                <div>
                  <LoadingButton />
                </div>
              )}
              {!isRequestInProgress && (
                <div>
                  <SearchButton onClick={sendRequest} />
                </div>
              )}
            </div>
            {/* 一括ダウンロードボタン */}
            {responseData && (
              <div>
                <DownloadButton />
              </div>
            )}
          </div>

          {/* end buttons */}

          {/* 画像表示 */}
          {responseData && (
            <div>
              {Object.entries(responseData).map(([title, imageUrl]) => {
                if (typeof imageUrl === "string") {
                  return (
                    <div key={title}>
                      <h3 className="text-lg font-semibold mt-2">{title}</h3>
                      <Image
                        src={imageUrl}
                        alt={title}
                        width={500}
                        height={500}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
