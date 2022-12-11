
// The actual magic that converts to a string today's day of the week
const weekday = new Intl.DateTimeFormat("en-US", {
	weekday: "long" // "Thursday"
}).format(Date.now());

function roundTo(num: number, interval: number) { Number
	return Math.round(num / interval) * interval;
}

// Rounds a date to the nearest [interval] hours
function roundHours(date: Date, interval: number) { Date
	var newDate = new Date(date);
	var h = newDate.getHours() + newDate.getMinutes() / 60 + newDate.getSeconds() / 3600 + newDate.getMilliseconds() / 3600000;
	newDate.setMinutes(0);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);
	newDate.setHours(roundTo(h, interval));
	return newDate;
}

// 01:00 -> 0100
function getHourAsRoundedFormattedString(date: Date) { String
	const options = { hourCycle: "h23", hour: "2-digit", minute: "2-digit", };
	const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
		hourCycle: "h23", hour: "2-digit", minute: "2-digit",
	});
	let rawwakeuptime = date;

	// console.log("The raw time is "  + rawwakeuptime);

	const parts = dateTimeFormat.formatToParts(roundHours(rawwakeuptime, 1));
	const partValues = parts.map(p => p.value);

	let roundedtime = partValues[0] + "" + [partValues[2]]; 

	return roundedtime;

}
function addHour(time: Date) { Date
	// set hours + 1

	// ensure type consistency
	let newtime = new Date(time);
	let oldtime = newtime.getHours();
	newtime.setHours(oldtime+1);
	return newtime;
}

function getArrayOfTimes():Date[]  { 
	const starttime = new Date(Date.now());
	var arrayOfTimes = new Array();
	arrayOfTimes[0] = [starttime];
	console.log("starttime: " + arrayOfTimes[0]);

	for (let index = 0; index < 16; index++) {
		arrayOfTimes.push(addHour(arrayOfTimes[index]));
		console.log(arrayOfTimes[index]);
	}

	return arrayOfTimes;
}

function printMedTimes() { 

	var times = getArrayOfTimes();
	let medsArray: string[] = ['Pantoprazole', 'Adderall and Lyrica', '', 'Daily Meds and Iron + Vitamin C',
	 '', '', '', 'Adderall', '', '', '', '', 'Fiber', '', '', 'Lyrica', ''];

	 let medSchedule = "";

	for (let index = 0; index < times.length; index++) {
		console.log();
		medSchedule += "- [ ] " + getHourAsRoundedFormattedString(times[index]) + " - " + medsArray[index] + "\n";
		
	}
	return medSchedule;
}

module.exports = printMedTimes;