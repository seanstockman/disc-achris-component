export default async function fillPage2(doc, page, siteData, drawImage) {
  const { width, height } = page.getSize();

  const initialY = height - 77;
  const verticalOffset = (400 - 77) / 2;

  //#region Trees
  // view from x
  const viewFromX = 120;
  page.drawText(siteData.sketches["view-angle-1"], {
    x: viewFromX,
    y: initialY,
    size: 10,
  });

  page.drawText(siteData.sketches["view-angle-2"], {
    x: viewFromX,
    y: initialY - verticalOffset * 2,
    size: 10,
  });

  const treeNorthUrl = "/sketches/tree_north.png";
  const treeSouthUrl = "/sketches/tree_south.png";

  // tree
  await drawImage(doc, page, treeNorthUrl, 28, 420, 270, 288);
  await drawImage(doc, page, treeSouthUrl, 28, 97, 270, 288);
  //#endregion

  //#region Scars
  const scarNoX = width - 250;
  const scarDrawingUrlPrefix = "/sketches/scar_drawing_";
  const scarDrawingUrlSuffix = ".png";

  const scarsImageOffset = 30;
  for (let i = 0; i < siteData.scars.number && i < 4; i++) {
    page.drawText((i + 1).toString(), {
      x: scarNoX,
      y: initialY - verticalOffset * i,
      size: 10,
    });

    const url =
      scarDrawingUrlPrefix +
      Math.floor(Math.random() * 4 + 1) +
      scarDrawingUrlSuffix;
    await drawImage(
      doc,
      page,
      url,
      width / 2,
      initialY - verticalOffset * (i + 1) + scarsImageOffset,
      270,
      124.5
    );
  }
  //#endregion

  //#region Additional
  page.drawText(siteData.sketches["additional-information"], {
    x: 23,
    y: 49,
    size: 10,
    lineHeight: 12.5,
    maxWidth: width - 23 * 2,
  });
}
