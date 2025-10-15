export default async function fillPage2(doc, page, siteData, drawImage) {
	const { width, height } = page.getSize();

	const initialY = height - 77;
	const verticalOffset = (400 - 77) / 2;

	//#region Text
	// view from x
	const viewFromX = 120;
	page.drawText(siteData.sketches["view-angle-1"], {
		x: viewFromX,
		y: initialY,
		size: 10
	});

	page.drawText(siteData.sketches["view-angle-2"], {
		x: viewFromX,
		y: initialY - verticalOffset * 2,
		size: 10
	});

	// scar no
	const scarNoX = width - 250;
	page.drawText("1", {
		x: scarNoX,
		y: initialY,
		size: 10
	});

	page.drawText("2", {
		x: scarNoX,
		y: initialY - verticalOffset,
		size: 10
	});

	page.drawText("3", {
		x: scarNoX,
		y: initialY - verticalOffset * 2,
		size: 10
	});

	page.drawText("4", {
		x: scarNoX,
		y: initialY - verticalOffset * 3,
		size: 10
	});

	//additional
	page.drawText(siteData.sketches["additional-information"], {
		x: 23,
		y: 49,
		size: 10,
		lineHeight: 12.5,
		maxWidth: width - 23 * 2,
	});
	//#endregion

	//#region Images
	const treeNorthUrl = "/sketches/tree_north.png";
	const treeSouthUrl = "/sketches/tree_south.png";
	const scarDrawing1Url = "/sketches/scar_drawing_1.png";
	const scarDrawing2Url = "/sketches/scar_drawing_2.png";
	const scarDrawing3Url = "/sketches/scar_drawing_3.png";
	const scarDrawing4Url = "/sketches/scar_drawing_4.png";

	// tree
	await drawImage(doc, page, treeNorthUrl, 28, 420, 270, 288);
	await drawImage(doc, page, treeSouthUrl, 28, 97, 270, 288);

	// scars
	const scarsImageOffset = 30;
	await drawImage(doc, page, scarDrawing1Url, width / 2, initialY - verticalOffset + scarsImageOffset, 270, 124.5);
	await drawImage(doc, page, scarDrawing2Url, width / 2, initialY - verticalOffset * 2 + scarsImageOffset, 270, 124.5);
	await drawImage(doc, page, scarDrawing3Url, width / 2, initialY - verticalOffset * 3 + scarsImageOffset, 270, 124.5);
	await drawImage(doc, page, scarDrawing4Url, width / 2, initialY - verticalOffset * 4 + scarsImageOffset, 270, 124.5);
	//#endregion
}