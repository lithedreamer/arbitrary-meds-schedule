import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

// The actual magic that converts to a string today's day of the week
const weekday = new Intl.DateTimeFormat("en-US", {
	weekday: "long" // "Thursday"
}).format(Date.now());

/* const waketime = new Intl.DateTimeFormat("en-us", {
	hour: 'numeric',
	hourCycle: 'h24',
}).format(Date.now()); */

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

	for (let index = 0; index < times.length; index++) {
		console.log(getHourAsRoundedFormattedString(times[index]) + " - " + medsArray[index]);

		
	}

}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		
/* 		console.log("Trying ++ an hour...");
		addHour(date);
		console.log(date.getHours()); */
		printMedTimes();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a good notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
