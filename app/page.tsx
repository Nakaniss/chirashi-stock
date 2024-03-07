"use client";

import DownloadButton from "@/components/utils/DownloadButton";
import SearchButton from "@/components/utils/SearchButton";
import Image from "next/image";
import React, { useState } from "react";

function Home() {
  // サーバーからのレスポンスデータを保持するstate
  const [responseData, setResponseData] = useState(null);
  // shopidの入力用state
  const [shopid, setShopid] = useState("");

  // 検索ボタンをクリックしたときの処理
  async function sendMessage() {
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
      } else {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <main>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Chirashi Search</h1>
          {/* input */}
          <input
            type="text"
            placeholder="Enter shopid"
            value={shopid}
            onChange={(e) => setShopid(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-300"
          />

          {/* start buttons */}
          <div className="flex flex-row justify-between">
            {/* 検索ボタン */}
            <div>
              <SearchButton onClick={sendMessage} />
            </div>
            <div>
              {/* 一括ダウンロードボタン */}
              {responseData && (
                <div>
                  <DownloadButton />
                </div>
              )}
            </div>
          </div>
          {/* end buttons */}

          {/* 画像表示 */}
          {responseData && (
            <div>
              {Object.entries(responseData).map(([title, imageUrl]) => {
                if (typeof imageUrl === "string") {
                  return (
                    <div key={title}>
                      <h3 className="text-lg font-semibold">{title}</h3>
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
