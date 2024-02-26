"use client";

import Image from "next/image";
import React, { useState } from "react";

function Home() {
  const [responseData, setResponseData] = useState(null);
  const [shopid, setShopid] = useState(""); // State for shopid input

  async function sendMessage() {
    try {
      const response = await fetch("/api/getchirashi", {
        method: "POST",
        body: JSON.stringify({ shopid }), // Send shopid in the request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponseData(data.response); // Store the response data
      } else {
        throw new Error("Something went wrong");
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
          {/* 検索ボタン */}
          <button
            onClick={sendMessage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            検索
          </button>
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
