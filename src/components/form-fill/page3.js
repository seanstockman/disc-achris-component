export default async function fillPage3(doc, page, siteData, drawImage) {
	const { width, height } = page.getSize();
	const componentPlanPath = `${process.env.PUBLIC_URL}/components/component_plan.png`;
	const componentProfilePath = `${process.env.PUBLIC_URL}/components/component_profile.png`;

	// plan
	await drawImage(doc, page, componentPlanPath, 22.5, 274, width - 46, height - 343.5);

	page.drawText(siteData.components["plan-scale"], {
		x: 72.5,
		y: 249.5,
		size: 10,
		lineHeight: 12.2,
	});

	// profile
	await drawImage(doc, page, componentProfilePath, 22.5, 109.5, width - 85, 114);
	
	page.drawText(siteData.components["profile-depth-height"], {
		x: 160,
		y: 101.5,
		size: 8,
		lineHeight: 12.2,
	});

	//additional
	page.drawText(siteData.components["additional-information"], {
		x: 23,
		y: 77.5,
		size: 10,
		lineHeight: 12.2,
		maxWidth: width - 23 * 2,
	});
}