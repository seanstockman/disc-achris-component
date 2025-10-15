import { PDFDocument, StandardFonts } from "pdf-lib";
import React, { useEffect } from "react";
import * as pdfjsLib from "pdfjs-lib";
import "./pdfManipulator.css";
import sampleSiteData from "./sampleData/sampleWith5.json";
import fillPage1 from "./page1";
import fillPage2 from "./page2";

const siteData = sampleSiteData;
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
const existingPdfFilePath = "/ACHRIS Scarred-Tree-VAHR-Form.pdf";
let mounted = false;


export default function ManipulatePDF() {
  useEffect(() => {
    if (mounted) return;
    fillFormForSite("");
    mounted = true;
  }, []);

  const [downloadUrl, setDownloadUrl] = React.useState(null);

  async function fillFormForSite(siteID) {
    const response = await fetch(existingPdfFilePath);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    await fillPage1(pages[0], siteData);
    await fillPage2(pdfDoc, pages[1], siteData);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    displayPdfPage(url);
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

  const [siteId, setSiteId] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // fillFormForSite(siteId);
  }

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
      {downloadUrl && (
        <a href={downloadUrl} download="filled-form.pdf">
          <button>Download Processed PDF</button>
        </a>
      )}
      <br />
      <div id="pdf-container"></div>
    </div>
  );
}
