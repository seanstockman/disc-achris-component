import { drawText, rgb } from "pdf-lib";

export default function fillPage1(page, font, siteData) {
  const { width, height } = page.getSize();
  page.drawText(siteData["heritage-register"].name, {
    x: 170,
    y: height - 75 + 10,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
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
      font,
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
      font,
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
      font,
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

    case "Box (non-specific)":
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
        font,
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

    case "Poor health (dying)":
      tickBoxAt(page, conditionX, conditionY - tickHeightOffset);
      break;

    case "Natural deterioration evident":
      tickBoxAt(page, conditionX, conditionY - tickHeightOffset * 2);
      break;

    case "Dead (standing)":
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
}

function tickBoxAt(page, x, y) {
  page.drawSquare({
    x: x,
    y: y,
    size: 4,
  });
}
