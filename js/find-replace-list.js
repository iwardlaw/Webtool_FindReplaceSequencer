const FindReplaceList = (function() {
	//#region Data
	// const self = this;
	const items = [];
	const gaps = [];
	const initialGap = makeNewGap();
	let isSettingCounterValue = false;

	const root = document.getElementById("find-replace__item-container");
	initialGap.appendTo(root);

	const counter = document.getElementById("find-replace__item-count");
	counter.value = 0;
	counter.addEventListener("change", () => {
		if(!isSettingCounterValue) {
			setLength(counter.value, setCounterValue = false);
		}
	});

	const importModal = document.getElementById("import-modal");
	const exportModal = document.getElementById("export-modal");

	const importModalImportButton = document.getElementById("import-modal__import-button");
	importModalImportButton.addEventListener("click", importTextFromModal);

	const importModalTextArea = document.getElementById("import-modal__textarea");
	importModalTextArea.addEventListener("input", () => disableButtonIfEmpty(importModalImportButton, importModalTextArea));

	const importButton = document.getElementById("find-replace__import-button");
	importButton.addEventListener("click", () => importModal?.classList.remove("hidden"));
	
	const exportButton = document.getElementById("find-replace__export-button");
	exportButton.addEventListener("click", () => {
		if(exportModal) {
			exportModal.querySelector("textarea").value = exportToText();
			exportModal.classList.remove("hidden");
		}
	});
	//#endregion Data

	function importTextFromModal(shouldSave = true) {
		importFromText(importModalTextArea?.value, shouldSave);
	}

	function importFromText(text, shouldSave = true) {
		try {
			importFromJson(JSON.parse(text), shouldSave);
		}
		catch(err) {
			if(err instanceof SyntaxError) {
				alert("Import text must be valid JSON.");
			}
			else {
				throw err;
			}
		}
	}

	function importFromJson(jsonDataList, shouldSave = true) {
		clear();

		for(const itemData of jsonDataList) {
			append(itemData);
		}

		if(shouldSave) {
			saveSequence();
		}
	}

	function exportToText() {
		return JSON.stringify(exportToJson(), space = 2);
	}

	function exportToJson() {
		const jsonDataList = new Array(items.length);
		for(let i = 0; i < items.length; i++) {
			jsonDataList[i] = items[i].data;
		}

		return jsonDataList;
	}

	function runOn(text) {
		for(const item of items) {
			if(!item.isActive) {
				continue;
			}

			let findPattern = item.findPattern;
			let replaceString = item.replaceString;
			if(item.isRegex) {
				const flags = item.matchCase ? "g" : "gi";
				findPattern = new RegExp(findPattern, flags);
				replaceString = substituteRegexReplacementEscapes(replaceString);
			}

			text = item.isRegex || item.matchCase
				? text.replaceAll(findPattern, replaceString)
				: replaceAllCaseInsensitive(text, findPattern, replaceString);
		}

		return text;
	}

	function reset() {
		clear();
		insertAtGap(initialGap);
	}

	function append(item) {
		insertAt(item, items.length);
	}

	function insertAt(item, idx) {
		if(Number.isNaN(idx)) {
			throw new RangeError(`Index value '${idx}' provided to 'insertAt' is not a number.`);
		}

		idx = Math.max(0, Math.min(idx, items.length));

		const newItem = makeNewItem(item);
		const newGap = makeNewGap();

		items.splice(idx, 0, newItem);
		gaps.splice(idx, 0, newGap);

		const childIndex = idx * 2 + 1;
		newGap.insertBefore(root, root.children[childIndex]);
		newItem.insertBefore(root, root.children[childIndex]);

		isSettingCounterValue = true;
		counter.value = items.length;
		isSettingCounterValue = false;
	}

	function insertAtGap(gapElem) {
		let itemAndGapIdx = 0;
		let itemData = items[0]?.data;
	
		if(items.length > 0 && gapElem !== initialGap) {
			itemAndGapIdx = Math.min(gaps.indexOf(gapElem), items.length - 1);
			itemData = items[itemAndGapIdx].data;
		}

		insertAt(itemData, itemAndGapIdx);
	}

	function remove(item) {
		let idx = items.indexOf(item);
		if(idx === -1) {
			throw new Error("Item does not exist in the list. Cannot remove.");
		}

		removeAt(idx);
	}

	function removeAt(idx) {
		if(idx < 0 || items.length < idx) {
			throw new RangeError(`Cannot remove item at nonexistent invalid ${idx}.`);
		}

		items[idx].destroy();
		items.splice(idx, 1);

		gaps[idx].destroy();
		gaps.splice(idx, 1);

		isSettingCounterValue = true;
		counter.stepDown();
		isSettingCounterValue = false;
	}

	function clear() {
		root.innerHTML = "";
		initialGap.appendTo(root);
	}

	function makeNewItem(data) {
		return FindReplaceItem.createNew(data);
	}

	function makeNewGap() {
		return FindReplaceGap.createNew(addButtonCallback = insertAtGap);
	}

	function moveItem(oldIdx, newIdx) {
		if(items.length < 2) {
			return;
		}

		items[oldIdx].insertBefore(root, gaps[newIdx]);
		gaps[oldIdx].insertBefore(root, gaps[newIdx]);

		shiftWithinArray(items, oldIdx, newIdx, shouldRotate = true);
		shiftWithinArray(gaps, oldIdx, newIdx, shouldRotate = true);
	}

	function setLength(value, setCounterValue) {
		if(Number.isNaN(value)) {
			throw new RangeError(`Value '${value}' provided to 'length' is not a number.`);
		}

		if(value > items.length) {
			expandToLength(value);
		}
		else if(value < items.length) {
			compressToLength(value);
		}

		if(setCounterValue) {
			isSettingCounterValue = true;
			counter.value = value;
			isSettingCounterValue = false;
		}
	}

	function expandToLength(newLength) {
		const newItemData = items.at(-1)?.data;
		const fillStartIndex = items.length;

		for(let i = fillStartIndex; i < newLength; i++) {
			insertAtGap(gaps.at(-1));
		}
	}

	function compressToLength(newLength) {
		if(newLength < 0) {
			throw new RangeError("Cannot set list length to less than 0.");
		}

		for(let i = items.length - 1; i >= newLength; i--) {
			items[i].destroy();
			gaps[i].destroy();
		}

		items.length = newLength;
		gaps.length = newLength;

		const newChildLength = items.length * 2 + 1;
		for(let i = root.children.length - 1; i >= newChildLength; i--) {
			const child = root.children[i];
			child.remove();
			child = null;
		}
	}

	return Object.freeze({
		get length() { return items.length },
		set length(value) { setLength(value, setCounterValue = true) },
		get importModal() { return importModal },
		set importModal(value) { importModal = value },
		get exportModal() { return exportModal },
		set exportModal(value) { exportModal = value },
		append: append,
		insertAt: insertAt,
		remove: remove,
		removeAt: removeAt,
		reset: reset,
		importTextFromModal: importTextFromModal,
		importFromText: importFromText,
		importFromJson: importFromJson,
		exportToText: exportToText,
		exportToJson: exportToJson,
		runOn: runOn,
	});
})();