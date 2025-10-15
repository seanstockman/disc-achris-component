import { PDFDocument, StandardFonts } from "pdf-lib";
import React from "react";
import * as pdfjsLib from "pdfjs-lib";
import "./pdfManipulator.css";
// import sampleSiteData from "./sampleData/sample1.json";
import fillPage1 from "./page1";
import fillPage2 from "./page2";
import fillPage3 from "./page3";


// const siteData = sampleSiteData;


pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
const existingPdfFilePath = "/ACHRIS Scarred-Tree-VAHR-Form.pdf";

export default function ManipulatePDF() {
  const [downloadUrl, setDownloadUrl] = React.useState(null);

  async function fetchRandomSiteData() {
    const randomNumber = Math.floor(Math.random() * 10 + 1);
    const dataPath = `/sample_data/sample${randomNumber}.json`;
    console.log("Fetching", dataPath);
    try {
      const response = await fetch(dataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  async function fillFormForSite(siteID) {
    const response = await fetch(existingPdfFilePath);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const siteData = await fetchRandomSiteData();
    console.log("siteData:", siteData);
    await fillPage1(pages[0], siteData);
    await fillPage2(pdfDoc, pages[1], siteData, drawImage);
    await fillPage3(pdfDoc, pages[2], siteData, drawImage);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    displayPdfPage(url);
    setLoading(false);
  }
  //#endregion

  function displayPdfPage(url) {
    pdfjsLib.getDocument(url).promise.then(function (pdfDoc) {
      const pdfContainer = document.getElementById("pdf-container");
      pdfContainer.style.display = "block";
      const lastPageToDisplay = pdfDoc.numPages; // pdfDoc.numPages
      for (let i = 1; i <= lastPageToDisplay; i++) {
        const canvas = document.createElement("canvas");
        pdfContainer.appendChild(canvas);
        pdfDoc.getPage(i).then(function (page) {
          const ctx = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      }
    });
  }

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    fillFormForSite(siteId);
  }

  const [siteId, setSiteId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="main">
      <form onSubmit={handleSubmit}>
        <p>Enter the site ID:</p>
        <input
          type="text"
          id="site-id"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
        />
        <input type="submit" value="Submit Site ID" />
      </form>
      {loading && <p><strong>Loading...</strong></p>}
      <p></p>
      {downloadUrl && (
        <a href={downloadUrl} download="filled-form.pdf">
          <button>Download Processed PDF</button>
        </a>
      )}
      <p></p>
      <div id="pdf-container"></div>
    </div>
  );
}

async function drawImage(doc, page, path, x, y, maxWidth, maxHeight) {
  try {
    const imageBytes = await fetch(path).then(res => res.arrayBuffer());
    const image = await doc.embedPng(imageBytes);
    const { width, height } = image.scaleToFit(maxWidth, maxHeight);
    const centeredX = x + (maxWidth - width) / 2;
    const centeredY = y + (maxHeight - height) / 2;
    page.drawImage(image, {
      x: centeredX,
      y: centeredY,
      width,
      height,
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
}