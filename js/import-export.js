function exportList() {
	const data = [];
	const findReplaceItems = document.querySelectorAll(".find-replace-item");

	for(const item of findReplaceItems) {
		data.push({
			isActive: item.querySelector(".find-replace-item__toggle input").checked,
			name: item.querySelector(".find-replace-item__name-input").value,
			findPattern: item.querySelector(".input__find input").value,
			replaceString: item.querySelector(".input__replace input").value,
			matchCase: item.querySelector(".option__match-case input").checked,
			//preserveCase: item.querySelector(".option__preserve-case input").checked,
			isRegex: item.querySelector(".option__regular-expression input").checked
		});
	}

	return JSON.stringify(data, null, 2);
}

function importList(importText, modal, save = true) {
	let data;
	try {
		data = JSON.parse(importText);
	}
	catch {
		alert("Import text must be valid JSON.");
		return;
	}

	document.getElementById("find-replace__item-container").innerHTML = createFindReplaceGap().outerHTML;
	for(const itemData of data) {
		addFindReplaceItem(itemData, save = false);
	}

	if(save) {
		saveSequence();
	}

	modal?.classList.add("hidden");
}
