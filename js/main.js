function runFindReplace() {
	let originalText = document.getElementById("original-text").value;
	document.getElementById("replacement-text").value = FindReplaceList.runOn(originalText);
}

function disableButtonIfEmpty(button, controllingInput) {
	button.disabled = controllingInput.value.length === 0;
}

// function setItemCount(count) {
// 	const container = document.getElementById("find-replace__item-container");
// 	const items = container.querySelectorAll(".find-replace-item");
// 	const countDiff = count - items.length;

// 	if(countDiff > 0) {
// 		const lastItem = Array.prototype.at.call(items, -1);
// 		for(let i = 0; i < countDiff; i++) {
// 			addFindReplaceItem(getDataFromItem(lastItem), incrementCount = false);
// 		}
// 	}
// 	else {
// 		for(let i = items.length - 1; i >= count; i--) {
// 			removeFindReplaceItem(items[i], decrementCount = false);
// 		}
// 	}
// }

// function incrementItemCount() {
// 	document.getElementById("find-replace__item-count").stepUp();
// }

// function decrementItemCount() {
// 	document.getElementById("find-replace__item-count").stepDown();
// }

function saveSequence() {
	localStorage.setItem("find-replace-sequence", JSON.stringify({
		pageHeading: document.getElementById("page-heading-text").value,
		isLightTheme: document.body.classList.contains("theme-dark"),
		originalText: document.getElementById("original-text").value,
		replacementText: document.getElementById("replacement-text").value,
		// copyOnRun: document.getElementById("copy-on-run-checkbox").checked,
		// findReplaceItems: exportList()
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
		// importList(sequence.findReplaceItems);
		FindReplaceList.importFromJson(sequence.findReplaceItems);
		if(sequence.originalText?.length > 0) {
			document.getElementById("run-button").disabled = false;
		}
	}
	else {
		// addFindReplaceItem();
		FindReplaceList.reset();
	}
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

	saveSequence();
}

// document.getElementById("find-replace__item-count").value = 0;
// document.getElementById("find-replace__item-container").appendChild(createFindReplaceGap());
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

// document.getElementById("find-replace__export-button").addEventListener("click", () => {
// 	const exportModal = document.getElementById("export-modal");
// 	exportModal.querySelector("textarea").value = exportList();
// 	exportModal.classList.remove("hidden");
// });

// document.getElementById("find-replace__import-button").addEventListener("click", () => document.getElementById("import-modal").classList.remove("hidden"));
// document.getElementById("import-modal__import-button").addEventListener("click", (evt) => importList(evt.target.parentElement.querySelector("textarea")?.value, evt.target.parentElement.parentElement));

FindReplaceList.importModal = document.getElementById("import-modal");
FindReplaceList.exportModal = document.getElementById("export-modal");

document.getElementById("import-modal__import-button").addEventListener("click", FindReplaceList.importFromTextFromModal);

//document.getElementById("find-replace__item-count").addEventListener("change", (evt) => setItemCount(evt.target.value));

document.getElementById("import-modal__textarea").addEventListener("input", (evt) => disableButtonIfEmpty(document.getElementById("import-modal__import-button"), evt.target));
document.getElementById("original-text").addEventListener("input", (evt) => disableButtonIfEmpty(document.getElementById("run-button"), evt.target));

document.querySelector("#theme-select-toggle input").addEventListener("change", (evt) => setTheme(evt.target.checked, setThemeSlider = false));

let browserDarkThemePreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
setTheme(setToLight = !browserDarkThemePreference.matches, setThemeSlider = true);
// browserDarkThemePreference.addEventListener('change', (evt) => {
// 	setTheme(setToLight = !evt.matches, setThemeSlider = true);
// });
