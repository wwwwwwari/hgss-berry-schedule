const JSON_PATH_BERRY_DATA = "data/berries.json";
const JSON_PATH_MULCH_DATA = "data/mulches.json";

const ELM_NAME_INPUT_BERRY = "input-berry";
const ELM_NAME_INPUT_MULCH = "input-mulch";
const ELM_NAME_INPUT_PLANTED_TIME = "input-planted-time";
const ELM_NAME_INFO_BERRY_ICON = "info-berry-icon";
const ELM_NAME_INFO_DRAIN_RATE = "info-drain-rate";
const ELM_NAME_INFO_FULL_GROWTH_TIME = "info-full-growth-time";
const ELM_NAME_INFO_HARVEST_TIME = "info-harvest-time";
const ELM_NAME_INFO_MULCH_ICON = "info-mulch-icon";
const ELM_NAME_INFO_PLANTED_TIME = "info-planted-time";
const ELM_NAME_INFO_MAX_REGROWTH = "info-max-regrowth";

const ELM_NAME_SCHEDULE_TABLE = "schedule-table";

const ELM_CLS_SCHEDULE_ROW = "schedule-row";
const ELM_CLS_SCHEDULE_COL_DAY = "schedule-day";
const ELM_CLS_SCHEDULE_COL_TIME = "schedule-time";
const ELM_CLS_SCHEDULE_COL_STAGE = "schedule-stage";
const ELM_CLS_SCHEDULE_COL_MOISTURE = "schedule-moisture";
const ELM_CLS_SCHEDULE_COL_EVENT = "schedule-event";
const ELM_CLS_SCHEDULE_COL_WATER = "schedule-water";
const ELM_CLS_SCHEDULE_COL_WATER_BOX = "schedule-water-checkbox";

const DATA_NAME_MULCH_NONE = "None";
const DATA_NAME_MULCH_GROWTH = "Growth Mulch";
const DATA_NAME_MULCH_DAMP = "Damp Mulch";
const DATA_NAME_MULCH_STABLE = "Stable Mulch";
const DATA_NAME_MULCH_GOOEY = "Gooey Mulch";


const STAGE_GROWTH_NAME = ["Seed", "Sprout", "Sapling", "Flowering Tree", "Berry Tree"];

const MISC_DEFAULT_MAX_REGROWTH = 9;
const MISC_DEFAULT_MAX_PLANTED_TIME_24H = "06:00";
const MISC_PATH_DIR_BERRIES = "img/berries/";
const MISC_PATH_DIR_MULCHES = "img/mulches/";
const MISC_PATH_DIR_STAGES = "img/stages/";
const MISC_EXT_BERRIES = ".png";
const MISC_EXT_MULCHES = ".png";
const MISC_EXT_STAGES = ".png";
const MISC_SEP_TIME = ":";

let berryData = null;
let mulchData = null;
let currentBerryData = null;

// Fetch from berries.json and mulches.json to initialize berryData
function loadJsonData(){
	fetch(JSON_PATH_BERRY_DATA)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			berryData = data;
		})
		.catch(error => {
			console.error('Error fetching the data:', error);
		});
	fetch(JSON_PATH_MULCH_DATA)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			mulchData = data;
		})
		.catch(error => {
			console.error('Error fetching the data:', error);
		});
}
function startScript(){	
	// Wait until the main jsons are loaded
	loadJsonData();
	let check = function() {
		setTimeout(function () {
			if (berryData === null || mulchData === null)
				check();
			else {
				console.log("Berries and mulches data loaded");
				initFields();
			}
		}, 500);
	};
	check();
}
// Initialize dropdowns
function initFields(){
	const elmInputBerry = document.getElementById(ELM_NAME_INPUT_BERRY);
	const elmInputMulch = document.getElementById(ELM_NAME_INPUT_MULCH);
	const elmInfoMaxRegrowth = document.getElementById(ELM_NAME_INFO_MAX_REGROWTH);
	// Populate input dropdowns
	for (let i=0; i<berryData.length; i++){
		const newOption = document.createElement("option");
		newOption.value = berryData[i].id;
		newOption.text = berryData[i].name;
		elmInputBerry.appendChild(newOption);
	}
	for (let i=0; i<mulchData.length; i++){
		const newOption = document.createElement("option");
		newOption.value = mulchData[i].id;
		newOption.text = mulchData[i].name;
		elmInputMulch.appendChild(newOption);
	}
	elmInfoMaxRegrowth.innerHTML = MISC_DEFAULT_MAX_REGROWTH;
	
	currentBerryData = new Object();
	currentBerryData.berryId = null;
	currentBerryData.berryName = null;
	currentBerryData.drainRate = null;
	currentBerryData.fullGrowthTime = null;
	currentBerryData.harvestTime = null;
	currentBerryData.maxRegrowth = MISC_DEFAULT_MAX_REGROWTH;
	currentBerryData.mulchName = null;
	currentBerryData.plantedTime24h = MISC_DEFAULT_MAX_PLANTED_TIME_24H;
	
	updateAll();
}
function updateAll(){
	updateInfoBerry();
	updateInfoMulch();
	updateInfoPlantedTime();
	updateSchedule();
}
function updateBerry(){
	updateInfoBerry();
	updateSchedule();
}
function updateMulch(){
	updateInfoMulch();
	updateSchedule();
}
function updatePlantedTime(){
	updateInfoPlantedTime();
	updateSchedule();
}
// Update info section when the berry changes
function updateInfoBerry(){
	const elmInputBerry = document.getElementById(ELM_NAME_INPUT_BERRY);
	const elmInfoBerryIcon = document.getElementById(ELM_NAME_INFO_BERRY_ICON);
	
	const currentBerry = berryData[elmInputBerry.value - 1];
	
	elmInfoBerryIcon.src = MISC_PATH_DIR_BERRIES + elmInputBerry.value + MISC_EXT_BERRIES;
	elmInfoBerryIcon.title = currentBerry.name;
	elmInfoBerryIcon.alt = currentBerry.name;
	
	currentBerryData.berryId = currentBerry.id;
	currentBerryData.berryName = currentBerry.name;

	updateInfoBerryMulch();
}
// Update info section when the mulch changes
function updateInfoMulch(){
	const elmInputMulch = document.getElementById(ELM_NAME_INPUT_MULCH);
	const elmInfoMulchIcon = document.getElementById(ELM_NAME_INFO_MULCH_ICON);
	
	const currentMulch = mulchData[elmInputMulch.value];

	elmInfoMulchIcon.src = MISC_PATH_DIR_MULCHES + elmInputMulch.value + MISC_EXT_MULCHES;
	elmInfoMulchIcon.title = currentMulch.name;
	elmInfoMulchIcon.alt = currentMulch.name;
	
	currentBerryData.mulchName = currentMulch.name;
	
	updateInfoBerryMulch();
}
// Recalculate fields that rely on both berries and mulches
function updateInfoBerryMulch(){
	const elmInputBerry = document.getElementById(ELM_NAME_INPUT_BERRY);
	const elmInputMulch = document.getElementById(ELM_NAME_INPUT_MULCH);

	const elmInfoDrainRate = document.getElementById(ELM_NAME_INFO_DRAIN_RATE);
	const elmInfoFullGrowthTime = document.getElementById(ELM_NAME_INFO_FULL_GROWTH_TIME);
	const elmInfoHarvestTime = document.getElementById(ELM_NAME_INFO_HARVEST_TIME);
	const elmInfoMaxRegrowth = document.getElementById(ELM_NAME_INFO_MAX_REGROWTH);

	const currentBerry = berryData[elmInputBerry.value - 1];
	const currentMulch = mulchData[elmInputMulch.value];
	
	let drainRateValue = currentBerry.drain_rate;
	let fullGrowthTimeValue = currentBerry.stage_4;
	let harvestTimeValue = currentBerry.stage_4;
	let maxRegrowthValue = MISC_DEFAULT_MAX_REGROWTH;

	switch(currentMulch.name){
		case DATA_NAME_MULCH_NONE:
			break;
		case DATA_NAME_MULCH_GROWTH:
			fullGrowthTimeValue = Math.floor(fullGrowthTimeValue * 0.75);
			drainRateValue = drainRateValue * 1.5;
			break;
		case DATA_NAME_MULCH_DAMP:
			fullGrowthTimeValue = fullGrowthTimeValue * 1.5;
			drainRateValue = Math.floor(drainRateValue * 0.5);
			break;
		case DATA_NAME_MULCH_STABLE:
			harvestTimeValue = harvestTimeValue * 1.5;
			break;
		case DATA_NAME_MULCH_GOOEY:
			maxRegrowthValue = maxRegrowthValue * 1.5;
			break;
		default:
			console.log("Invalid mulch name:", currentMulch.name);
			break;
	}

	elmInfoDrainRate.innerHTML = drainRateValue;
	elmInfoFullGrowthTime.innerHTML = fullGrowthTimeValue;
	elmInfoHarvestTime.innerHTML = harvestTimeValue;	
	elmInfoMaxRegrowth.innerHTML = maxRegrowthValue;
	
	currentBerryData.drainRate = drainRateValue;
	currentBerryData.fullGrowthTime = fullGrowthTimeValue;
	currentBerryData.harvestTime = harvestTimeValue;
	currentBerryData.maxRegrowth = maxRegrowthValue;
}
// Update info section when planted time changes
function updateInfoPlantedTime(){
	const elmScheduleTable = document.getElementById(ELM_NAME_SCHEDULE_TABLE);
	const elmInputPlantedTime = document.getElementById(ELM_NAME_INPUT_PLANTED_TIME);
	const elmInfoPlantedTime = document.getElementById(ELM_NAME_INFO_PLANTED_TIME);
	elmInfoPlantedTime.innerHTML = formatAmPmHour(elmInputPlantedTime.value);
	currentBerryData.plantedTime24h = elmInputPlantedTime.value;
}
function updateSchedule(){
	const INDEX_HOUR = 0;
	const INDEX_DAY = 1;
	const INDEX_DAY_HOUR = 2;

	const INDEX_GROWTH_STAGE_IMAGE = 3;
	const INDEX_GROWTH_EVENT_DESC = 4;
	const INDEX_MOISTURE_MOISTURE_PERCENT = 3;
	const INDEX_MOISTURE_SHOULD_WATER = 4;
	const INDEX_MOISTURE_EVENT_DESC = 5;

	const elmScheduleTable = document.getElementById(ELM_NAME_SCHEDULE_TABLE);
	const htmlScheduleHeaderRow = elmScheduleTable.firstElementChild.outerHTML;
	
	const elmInputBerry = document.getElementById(ELM_NAME_INPUT_BERRY);
	const elmInputPlantedTime = document.getElementById(ELM_NAME_INPUT_PLANTED_TIME);
	
	const currentBerry = berryData[elmInputBerry.value - 1];
	
	let growthStageData = [];
	let moistureStageData = [];
	let currentStageImg = getElmStageImg(0, 0);
	
	elmScheduleTable.innerHTML = htmlScheduleHeaderRow;
	
	// First row
	createScheduleRow(0, formatAmPmHour(elmInputPlantedTime.value), currentStageImg, 100 + "%", currentBerry.name + " was planted.", getElmWaterCheckBox(0, false));
	growthStageData = calculateGrowthStages(currentBerry);
	moistureStageData = calculateMoistureStages(currentBerry);
	
	let j=0;
	let k=1;
	for (let i=0; i<moistureStageData.length; i++){
		let eventStr = moistureStageData[i][INDEX_MOISTURE_EVENT_DESC];
		if (moistureStageData[i][INDEX_HOUR] == growthStageData[j][INDEX_HOUR]){
			currentStageImg = growthStageData[j][INDEX_GROWTH_STAGE_IMAGE];
			eventStr = growthStageData[j][INDEX_GROWTH_EVENT_DESC] + "<br>" + eventStr;
			j++;
		}
		createScheduleRow(moistureStageData[i][INDEX_DAY], moistureStageData[i][INDEX_DAY_HOUR], currentStageImg, moistureStageData[i][INDEX_MOISTURE_MOISTURE_PERCENT]+"%", eventStr, getElmWaterCheckBox(k, moistureStageData[i][INDEX_MOISTURE_SHOULD_WATER]));
		k++;

		// if there is a growth stage row is between current and next moisture rows
		if (i+1 < moistureStageData.length){
			if (moistureStageData[i][INDEX_HOUR] < growthStageData[j][INDEX_HOUR] && moistureStageData[i+1][INDEX_HOUR] > growthStageData[j][INDEX_HOUR]){
				currentStageImg = growthStageData[j][INDEX_GROWTH_STAGE_IMAGE];
				eventStr = growthStageData[j][INDEX_GROWTH_EVENT_DESC];
				createScheduleRow(growthStageData[j][INDEX_DAY], growthStageData[j][INDEX_DAY_HOUR], currentStageImg, moistureStageData[i][INDEX_MOISTURE_MOISTURE_PERCENT]+"%", eventStr, getElmWaterCheckBox(k, false));
				j++;
				k++;
			}
		}

	}
	// if there are leftover growth stage rows
	if (j < growthStageData.length){
		for (let i=j; i<growthStageData.length; i++){
			currentStageImg = growthStageData[i][INDEX_GROWTH_STAGE_IMAGE];
			eventStr = growthStageData[i][INDEX_GROWTH_EVENT_DESC];
			createScheduleRow(growthStageData[i][INDEX_DAY], growthStageData[i][INDEX_DAY_HOUR], currentStageImg, moistureStageData[moistureStageData.length - 1][INDEX_MOISTURE_MOISTURE_PERCENT]+"%", eventStr, getElmWaterCheckBox(k, false));
			k++;
		}
	}
}
function createScheduleRow(schedDay, schedTime, schedStage, schedMoisture, schedEvent, schedWater){
	const elmScheduleTable = document.getElementById(ELM_NAME_SCHEDULE_TABLE);
	const elmNewRow = document.createElement("tr");
	elmNewRow.className = ELM_CLS_SCHEDULE_ROW;
	elmScheduleTable.appendChild(elmNewRow);

	createScheduleCol(ELM_CLS_SCHEDULE_COL_DAY, schedDay, elmNewRow);
	createScheduleCol(ELM_CLS_SCHEDULE_COL_TIME, schedTime, elmNewRow);
	createScheduleCol(ELM_CLS_SCHEDULE_COL_STAGE, schedStage, elmNewRow);
	createScheduleCol(ELM_CLS_SCHEDULE_COL_MOISTURE, schedMoisture, elmNewRow);
	createScheduleCol(ELM_CLS_SCHEDULE_COL_EVENT, schedEvent, elmNewRow);
	createScheduleCol(ELM_CLS_SCHEDULE_COL_WATER, schedWater, elmNewRow);
}
function createScheduleCol(colCls, colContent, row){
	const elmNewCol = document.createElement("td");
	elmNewCol.className = colCls;
	elmNewCol.innerHTML = colContent;
	row.appendChild(elmNewCol);
}
function formatAmPmHour(hourStr) {
	const hourStrParts = hourStr.split(MISC_SEP_TIME);
	if (parseInt(hourStrParts[0]) < 12) {
		return hourStr + " AM";
	}
	else if (parseInt(hourStrParts[0]) == 12 && parseInt(hourStrParts[1]) == 0) {
		return hourStr + " PM";
	}
	else {
		if (parseInt(hourStrParts[0]) - 12 < 10){
			return "0" + (parseInt(hourStrParts[0]) - 12) + MISC_SEP_TIME + hourStrParts[1] + " PM";
		}
		return (parseInt(hourStrParts[0]) - 12) + MISC_SEP_TIME + hourStrParts[1] + " PM";
	}
}
function formatMilHour(hourStr) {
	const meridian = hourStr.split(" ")[1];
	const hourStrParts = hourStr.split(MISC_SEP_TIME);
	let offset = 0;
	if (meridian == "PM" && hourStrParts[0] < 12) {
		offset = 12;
	}
	return (parseInt(hourStrParts[0]) + offset) + MISC_SEP_TIME + hourStrParts[1];
}
function formatClockLeadZero(number){
	if (number < 10){
		return "0" + number;
	}
	return number;
}
function getElmStageImg(berryNum, stageNum){
	const newElmImg = document.createElement("img");
	if (stageNum <= 1){
		berryNum = 0;
	}
	newElmImg.className = ELM_CLS_SCHEDULE_COL_STAGE + "_img";
	newElmImg.src = MISC_PATH_DIR_STAGES + berryNum + "_" + stageNum + MISC_EXT_STAGES;
	newElmImg.alt = STAGE_GROWTH_NAME[stageNum];
	newElmImg.title = STAGE_GROWTH_NAME[stageNum];
	return newElmImg.outerHTML;
}
function getElmWaterCheckBox(rowNum, isChecked){
	const newElmCheck = document.createElement("input");
	let returnHTML = "";
	newElmCheck.type = "checkbox";
	newElmCheck.className = ELM_CLS_SCHEDULE_COL_WATER_BOX;
	newElmCheck.id = ELM_CLS_SCHEDULE_COL_WATER_BOX + "-" + rowNum;
	returnHTML = newElmCheck.outerHTML;
	// for whatever reason, setting "checked" attribute to true from JS doesn't tick the box.
	// TODO: qwe change checkbox to something better...
	if (isChecked){
		returnHTMLparts = returnHTML.split(">");
		returnHTMLparts[returnHTMLparts.length-2] = returnHTMLparts[returnHTMLparts.length-2] + " checked";
		returnHTML = returnHTMLparts.join(">");
	}
	return returnHTML;
}
function calculateGrowthStages(){
	const NUM_STAGES = 5;
	const DAY_HOURS = 24;

	let stageDuration = currentBerryData.fullGrowthTime/4;
	let stageList = [];
	// Stage 0 is already initialized
	for (let i=1; i<NUM_STAGES; i++){
		let stageHour = stageDuration * i;
		let stageNum = i;
		let stageName = currentBerryData.berryName + " grows into a " + STAGE_GROWTH_NAME[i] + "!";
		let stageDay = Math.floor(stageHour/DAY_HOURS);
		let stageDayHour = formatClockLeadZero(Math.floor(stageHour % DAY_HOURS));
		let stageDayMin = formatClockLeadZero(((stageHour % DAY_HOURS) - stageDayHour) * 60);
		let stageDayTime24h = addTime24h(currentBerryData.plantedTime24h, stageDayHour + MISC_SEP_TIME + stageDayMin);
		stageList.push([stageHour, stageDay, formatAmPmHour(stageDayTime24h[1]), getElmStageImg(currentBerryData.berryId, stageNum), stageName]);
	}
	return stageList;
}
function calculateMoistureStages(){
	const DAY_HOURS = 24;

	let stageList = [];
	let stageMoisture = 100;
	for (let i=1; i<currentBerryData.fullGrowthTime; i++){
		let stageHour = i;
		let stageName = currentBerryData.berryName + " loses moisture.";
		let stageDay = Math.floor(stageHour/DAY_HOURS);
		let stageDayHour = formatClockLeadZero(Math.floor(stageHour % DAY_HOURS));
		let stageDayMin = formatClockLeadZero(((stageHour % DAY_HOURS) - stageDayHour) * 60);
		let stageDayTime24h = addTime24h(currentBerryData.plantedTime24h, stageDayHour + MISC_SEP_TIME + stageDayMin);
		if (stageMoisture - currentBerryData.drainRate > currentBerryData.drainRate){
			stageMoisture = stageMoisture - currentBerryData.drainRate;
			isWater = false;
		}
		else{
			stageName = "You should water now!";
			stageMoisture = 100;
			isWater = true;
		}
		stageList.push([stageHour, stageDay, formatAmPmHour(stageDayTime24h[1]), stageMoisture, isWater, stageName]);
	}
	return stageList;
}
function addTime24h(time24h1, time24h2){
	const DAY_HOURS = 24;
	const HOUR_MINS = 60;
	const time1 = time24h1.split(MISC_SEP_TIME);
	const time2 = time24h2.split(MISC_SEP_TIME);
	const time1h = parseInt(time1[0]);
	const time1m = parseInt(time1[1]);
	const time2h = parseInt(time2[0]);
	const time2m = parseInt(time2[1]);
	let isNewDay = false;
	let time3m = time1m + time2m;
	let time3h = time1h + time2h;
	if (time3m >= HOUR_MINS){
		time3m = time3m - HOUR_MINS;
		time3h = time3h + 1;
	}
	if (time3h >= DAY_HOURS){
		isNewDay = true;
		time3h = time3h - DAY_HOURS;
	}
	return [isNewDay, formatClockLeadZero(time3h) + MISC_SEP_TIME + formatClockLeadZero(time3m)];
}













