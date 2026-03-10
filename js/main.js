function runFindReplace() {
	let originalText = document.getElementById("original-text").value;
	document.getElementById("replacement-text").value = FindReplaceList.runOn(originalText);
}

function disableButtonIfEmpty(button, controllingInput) {
	button.disabled = controllingInput.value.length === 0;
}

function saveSequence() {
	localStorage.setItem("find-replace-sequence", JSON.stringify({
		pageHeading: document.getElementById("page-heading-text").value,
		isLightTheme: document.body.classList.contains("theme-dark"),
		originalText: document.getElementById("original-text").value,
		replacementText: document.getElementById("replacement-text").value,
		// copyOnRun: document.getElementById("copy-on-run-checkbox").checked,
		findReplaceItems: FindReplaceList.exportToJson()
	}));
}

function loadSequence() {
	const sequence = JSON.parse(localStorage.getItem("find-replace-sequence"));
	if(sequence) {
		document.getElementById("page-heading-text").value = sequence.pageHeading;
		setTheme(isSetToLight = sequence.isLightTheme, setThemeSlider = true);
		document.getElementById("original-text").value = sequence.originalText;
		document.getElementById("replacement-text").value = sequence.replacementText;
		// document.getElementById("copy-on-run-checkbox").checked = sequence.copyOnRun;
		FindReplaceList.importFromJson(sequence.findReplaceItems);
		if(sequence.originalText?.length > 0) {
			document.getElementById("run-button").disabled = false;
		}
	}
	else {
		FindReplaceList.reset();
	}
}

function initializeTheme() {
	const colorTheme = localStorage.getItem(LocalStorageKeys.ColorTheme);
	const isDarkTheme = colorTheme
		? colorTheme === LocalStorageValues.ColorTheme.Dark
		: browserIsDarkTheme();
	setTheme(setToLight = !isDarkTheme, setThemeSlider = true);
}

function setTheme(setToLight, setThemeSlider) {
	if(setToLight) {
		document.body.classList.remove("theme-dark");
	}
	else {
		document.body.classList.add("theme-dark")
	}

	if(setThemeSlider) {
		document.querySelector("#theme-select-toggle input").checked = setToLight;
	}

	localStorage.setItem(LocalStorageKeys.ColorTheme, setToLight ? LocalStorageValues.ColorTheme.Light : LocalStorageValues.ColorTheme.Dark);
}

if(new URLSearchParams(window.location.search).has("clear-storage")) {
	localStorage.clear();
}
loadSequence();

document.getElementById("page-heading-locked-icon").addEventListener("click", () => {
	document.getElementById("page-heading-text").contentEditable = true;
	document.getElementById("page-heading-locked-icon").classList.add("hidden");
	document.getElementById("page-heading-unlocked-icon").classList.remove("hidden");
});

document.getElementById("page-heading-unlocked-icon").addEventListener("click", () => {
	let pageHeadingText = document.getElementById("page-heading-text");
	pageHeadingText.contentEditable = false;
	pageHeadingText.textContent = pageHeadingText.textContent.trim();
	document.getElementById("page-heading-locked-icon").classList.remove("hidden");
	document.getElementById("page-heading-unlocked-icon").classList.add("hidden");
});

document.getElementById("original-text").addEventListener("change", saveSequence);
document.getElementById("replacement-text").addEventListener("change", saveSequence);
// document.getElementById("copy-on-run-checkbox").addEventListener("change", saveSequence);

document.getElementById("run-button").addEventListener("click", runFindReplace);

for(const closeButton of document.querySelectorAll(".config-modal .modal-close-button")) {
	closeButton.addEventListener("click", (evt) => {
		let parent = evt.target.parentElement;
		while(parent && !parent.classList.contains("config-modal")) {
			parent = parent.parentElement;
		}
		parent?.classList.add("hidden");
	});
}

document.getElementById("original-text").addEventListener("input", (evt) => disableButtonIfEmpty(document.getElementById("run-button"), evt.target));

document.querySelector("#theme-select-toggle input").addEventListener("change", (evt) => setTheme(evt.target.checked, setThemeSlider = false));

initializeTheme();
