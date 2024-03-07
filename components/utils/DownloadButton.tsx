import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import getAllImageUrls from "@/components/utils/ImageUrls";

const SearchButton: React.FC = () => {
  async function downloadImage() {
    const imageUrls = getAllImageUrls();

    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("images");

      if (imgFolder) {
        // 画像をzipファイルに追加
        for (const [name, url] of Object.entries(imageUrls)) {
          const response = await fetch(url);
          const blob = await response.blob();
          imgFolder.file(`${name}.jpg`, blob);
        }

        // zipファイルを生成してダウンロード
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "images.zip");
      } else {
        console.error("Error creating zip file");
      }
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  }

  return (
    <button
      onClick={downloadImage}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
    >
      一括ダウンロード
    </button>
  );
};

export default SearchButton;
