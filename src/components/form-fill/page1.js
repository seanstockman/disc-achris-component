export default async function fillPage1(page, siteData) {
  const { width, height } = page.getSize();
  page.drawText(siteData["heritage-register"].name, {
    x: 170,
    y: height - 75 + 10,
    size: 10,
    maxWidth: 120,
    lineHeight: 10,
  });

  const registerNumber = siteData["heritage-register"].number.toString();
  const fontSize = 10;
  const charSpacing = 14.5;
  const extraGap = 14;

  // heritage register number
  for (let i = 0; i < registerNumber.length; i++) {
    const char = registerNumber.charAt(i);
    let currentX = width - 160.5 + charSpacing * i;
    if (i > 3) currentX += extraGap;
    page.drawText(char, {
      x: currentX,
      y: height - 72.5,
      size: fontSize,
    });
  }

  //#region Coords
  const coordinatesHeight = height - 93;

  const easting = siteData.coordinates.easting.toString();
  for (let i = 0; i < easting.length; i++) {
    const char = easting.charAt(i);
    const currentX = 134 + charSpacing * i;
    page.drawText(char, {
      x: currentX,
      y: coordinatesHeight,
      size: fontSize,
    });
  }

  const northing = siteData.coordinates.northing.toString();
  for (let i = 0; i < northing.length; i++) {
    const char = northing.charAt(i);
    const currentX = 242.5 + charSpacing * i;
    page.drawText(char, {
      x: currentX,
      y: coordinatesHeight,
      size: fontSize,
    });
  }

  const zoneX = width - 81;
  const tickHeightOffset = 11.5;

  if (siteData.coordinates.zone === 54) {
    tickBoxAt(page, zoneX, height - 86);
  } else {
    tickBoxAt(page, zoneX, height - 86 - tickHeightOffset);
  }
  //#endregion

  //#region Species
  const species = siteData.species;

  const speciesX = 31;
  const speciesY = height - 134.3;
  const tickWidthOffsetSpecies = 80.8;
  switch (species) {
    case "Red gum":
      tickBoxAt(page, speciesX, speciesY);
      break;

    case "Black box":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies, speciesY);
      break;

    case "Grey box":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies * 2 - 0.3, speciesY);
      break;

    case "Yellow box":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies * 3 + 5.7, speciesY);
      break;

    case "Stringybark":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies * 4 + 5.7, speciesY);
      break;

    case "Mallee":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies * 5, speciesY);
      break;

    case "Box":
      tickBoxAt(page, speciesX + tickWidthOffsetSpecies * 6 - 20.8, speciesY);
      break;

    case "Casuarina":
      tickBoxAt(page, speciesX, speciesY - tickHeightOffset);
      break;

    case "Cypress pine":
      tickBoxAt(
        page,
        speciesX + tickWidthOffsetSpecies,
        speciesY - tickHeightOffset
      );
      break;

    case "Swamp gum":
      tickBoxAt(
        page,
        speciesX + tickWidthOffsetSpecies * 2 + 5.7,
        speciesY - tickHeightOffset
      );
      break;

    case "Other gum":
      tickBoxAt(
        page,
        speciesX + tickWidthOffsetSpecies * 3 + 5.7,
        speciesY - tickHeightOffset
      );
      break;

    case "Uncertain":
      tickBoxAt(
        page,
        speciesX + tickWidthOffsetSpecies * 4 + 5.7,
        speciesY - tickHeightOffset
      );
      break;

    case "Other":
      tickBoxAt(
        page,
        speciesX + tickWidthOffsetSpecies * 5,
        speciesY - tickHeightOffset
      );
      page.drawText(siteData["other-species"], {
        x: speciesX + tickWidthOffsetSpecies * 5 + 40,
        y: speciesY - tickHeightOffset - 2,
        size: 10,
        maxWidth: 130,
        lineHeight: 10,
      });
      break;

    default:
      console.warn("Defined 'species' is invalid.");
      break;
  }
  //#endregion

  //#region Condition
  const condition = siteData.condition;

  const conditionX = 31;
  const conditionY = height - 193;
  const tickWidthOffsetCondition = 111.7;

  switch (condition) {
    case "Good health":
      tickBoxAt(page, conditionX, conditionY);
      break;

    case "Poor health - dying":
      tickBoxAt(page, conditionX, conditionY - tickHeightOffset);
      break;

    case "Natural deterioration evident":
      tickBoxAt(page, conditionX, conditionY - tickHeightOffset * 2);
      break;

    case "Dead - standing":
      tickBoxAt(page, conditionX + tickWidthOffsetCondition, conditionY);
      break;

    case "Fallen":
      tickBoxAt(
        page,
        conditionX + tickWidthOffsetCondition,
        conditionY - tickHeightOffset
      );
      break;

    case "Destroyed":
      tickBoxAt(page, conditionX + tickWidthOffsetCondition * 2, conditionY);
      break;

    case "Removed":
      tickBoxAt(
        page,
        conditionX + tickWidthOffsetCondition * 2,
        conditionY - tickHeightOffset
      );
      break;

    default:
      console.warn("Defined 'condition' is invalid.");
      break;
  }
  //#endregion

  const scarCountX = width - 100;
  page.drawText(siteData.scars.number.toString(), {
    x: scarCountX,
    y: height - 182,
    size: 10,
  });

  page.drawText(siteData.scars["toe-hold-count"].toString(), {
    x: scarCountX,
    y: height - 205,
    size: 10,
  });

  fillScarDescriptions(page, siteData);
}

//#region Descriptions
function fillScarDescriptions(page, siteData) {
  const { height } = page.getSize();
  const initialX = 172;
  const initialY = height - 267;
  const scarOffsetXInitial = 83;
  const scarOffsetX = 94.5;
  const verticalOffset = 10;
  const textSize = 9;

  for (let i = 0; i < siteData.scars.number; i++) {
    let currentY = initialY;
    const scar = siteData.scars.descriptions[i];
    let siteX = initialX;
    let regrowthOffsetYes = 19;
    let regrowthOffsetNo = 19;
    if (i > 0) {
      siteX += scarOffsetXInitial + scarOffsetX * (i - 1);
      switch (i) {
        case 1:
          siteX += 1;
          regrowthOffsetYes += 3.8;
          regrowthOffsetNo += 5.5;
          break;
        case 2:
          siteX -= 2;
          regrowthOffsetYes += 0.8;
          regrowthOffsetNo += 8.5;
          break;
        case 3:
          siteX += 1;
          regrowthOffsetYes += 3.8;
          regrowthOffsetNo += 5;
          break;
        case 4:
          siteX -= 0.5;
          regrowthOffsetYes += 2.7;
          regrowthOffsetNo += 6.5;
          break;
        default:
          console.warn("Scar count > 5.");
          break;
      }
    }

    // geometry
    page.drawText(scar.geometry.length.toString(), {
      x: siteX,
      y: initialY,
      size: textSize,
    });

    page.drawText(scar.geometry.width.toString(), {
      x: siteX,
      y: initialY - verticalOffset,
      size: textSize,
    });

    page.drawText(scar.geometry["height-above-ground"].toString(), {
      x: siteX,
      y: initialY - verticalOffset * 2,
      size: textSize,
    });

    currentY -= 50;

    // overgrowth
    page.drawText(scar.overgrowth.top.toString(), {
      x: siteX,
      y: currentY,
      size: textSize
    });

    page.drawText(scar.overgrowth["middle-left"].toString(), {
      x: siteX,
      y: currentY - verticalOffset,
      size: textSize
    });

    page.drawText(scar.overgrowth["middle-right"].toString(), {
      x: siteX,
      y: currentY - verticalOffset * 2,
      size: textSize
    });

    page.drawText(scar.overgrowth.bottom.toString(), {
      x: siteX,
      y: currentY - verticalOffset * 3,
      size: textSize
    });

    //orientation
    currentY -= 55

    page.drawText(scar.orientation.toString(), {
      x: siteX,
      y: currentY,
      size: textSize
    });

    //origin
    currentY -= 28.5;
    switch (scar.origin) {
      case "Highly Likely Aboriginal":
        markBoxAt(page, siteX, currentY);
        break;
      case "Definitely Aboriginal":
        markBoxAt(page, siteX, currentY - verticalOffset);
        break;
      default:
        console.warn("Defined 'scar" + i + ".origin' is invalid.");
        break;
    }

    //type
    currentY -= 42;
    switch (scar.type) {
      case "Bark removed":
        markBoxAt(page, siteX, currentY);
        break;
      case "Heart-wood removed":
        markBoxAt(page, siteX, currentY - verticalOffset);
        break;
      case "Resource extraction":
        markBoxAt(page, siteX, currentY - verticalOffset * 1);
        break;
      case "Carved tree":
        markBoxAt(page, siteX, currentY - verticalOffset * 2);
        break;
      case "Other":
        markBoxAt(page, siteX, currentY - verticalOffset * 3);
        page.drawText(scar["type-other"], {
          x: siteX - 20,
          y: currentY - verticalOffset * 4 + 1,
          size: 8,
        });
        break;
      default:
        console.warn("Defined 'scar" + i + ".type' is invalid.");
        break;
    }

    //type
    currentY -= 71;
    switch (scar.preservation) {
      case "Excellent":
        markBoxAt(page, siteX, currentY);
        break;
      case "Good":
        markBoxAt(page, siteX, currentY - verticalOffset);
        break;
      case "Fair":
        markBoxAt(page, siteX, currentY - verticalOffset * 1);
        break;
      case "Poor":
        markBoxAt(page, siteX, currentY - verticalOffset * 2);
        break;
      case "Very poor":
        markBoxAt(page, siteX, currentY - verticalOffset * 3);
        break;
      case "Destroyed":
        markBoxAt(page, siteX, currentY - verticalOffset * 4);
        break;
      default:
        console.warn("Defined 'scar" + i + ".preservation' is invalid.");
        break;
    }

    // axe-marks
    currentY -= 69;
    const mark = scar["axe-mark"];

    page.drawText(mark.count, {
      x: siteX,
      y: currentY,
      size: 8
    });

    currentY -= 24
    switch (mark.method) {
      case "Stone":
        markBoxAt(page, siteX, currentY);
        break;
      case "Steel":
        markBoxAt(page, siteX, currentY - verticalOffset);
        break;
      case "Unidenified origin":
        markBoxAt(page, siteX, currentY - verticalOffset * 2);
        break;
      default:
        console.warn("Defined 'scar" + i + ".axe-mark.method' is invalid.");
        break;
    }

    currentY -= 51.2
    switch (mark.type) {
      case "Parallel - linear":
        markBoxAt(page, siteX, currentY);
        break;
      case "Parallel - curved":
        markBoxAt(page, siteX, currentY - verticalOffset);
        break;
      case "Linear - singular":
        markBoxAt(page, siteX, currentY - verticalOffset * 2);
        break;
      case "Criss-cross":
        markBoxAt(page, siteX, currentY - verticalOffset * 3);
        break;
      case "Random":
        markBoxAt(page, siteX, currentY - verticalOffset * 4);
        break;
      default:
        console.warn("Defined 'scar" + i + ".axe-mark.type' is invalid.");
        break;
    }

    // stem regrowth
    currentY -= 69.2;
    switch (scar["stem-regrowth-present"]) {
      case "Y":
        tickBoxAt(page, siteX - regrowthOffsetYes, currentY);
        break;
      case "N":
        tickBoxAt(page, siteX + regrowthOffsetNo, currentY);
        break;
      default:
        console.warn("Defined 'scar" + i + ".axe-mark.type' is invalid.");
        break;
    }
  }
}
//#endregion

function tickBoxAt(page, x, y) {
  page.drawSquare({
    x: x,
    y: y,
    size: 4,
  });
}

function markBoxAt(page, x, y) {
  page.drawText("X", {
    x: x,
    y: y,
    size: 10,
  });

  // page.drawSquare({
  //   x: x,
  //   y: y,
  //   size: 8,
  // });
}