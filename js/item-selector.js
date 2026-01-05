const ItemSelector = (function() {
	/// private
	const selectedItems = new Set();
	/// private
	let rangeBasisItem = null;

	/// public
	function setSelected(item, value, setAsRangeBasis = true, keepPrevious = false) {
		if(value && !selectedItems.has(item)) {
			if(!keepPrevious) {
				clearSelectedItems();
			}
			selectedItems.add(item);
			item.classList.add("selected");
		}
		else if(!value && selectedItems.has(item)) {
			if(keepPrevious) {
				selectedItems.delete(item);
				item.classList.remove("selected");
			}
			else {
				clearSelectedItems();
			}
		}

		if(setAsRangeBasis) {
			rangeBasisItem = item;
		}
	}

	/// public
	function toggleSelected(item, setAsRangeBasis = true, keepPrevious = false) {
		setSelected(item, !selectedItems.has(item), setAsRangeBasis, keepPrevious);
	}

	/// public
	function setRangeSelected(fromItem, toItem, value, keepPrevious = false) {
		if(!fromItem || !toItem) {
			console.error("Both 'fromItem' and 'toItem' must be nonnull.");
			return;
		}

		const allItems = document.querySelectorAll(".find-replace-item");
		const fromIdx = Array.prototype.indexOf.call(allItems, fromItem);
		const toIdx = Array.prototype.indexOf.call(allItems, toItem);

		const firstIdx = Math.min(toIdx, fromIdx);
		const lastIdx = Math.max(toIdx, fromIdx);

		if(!keepPrevious) {
			clear();
		}
		for(let i = firstIdx; i <= lastIdx; i++) {
			setSelected(allItems[i], value, setAsRangeBasis = i === fromIdx, keepPrevious = true);
		}
	}

	/// public
	function setRangeSelectedFromRangeBasis(toItem, value, keepPrevious = false) {
		setRangeSelected(rangeBasisItem, toItem, value, keepPrevious);	
	}

	/// public
	function clear() {
		clearSelectedItems();
		rangeBasisItem = null;
	}

	/// private
	function clearSelectedItems() {
		for(const selectedItem of selectedItems) {
			selectedItem.classList.remove("selected");
		}
		selectedItems.clear();
	}

	/// public
	function getRangeBasisItem() {
		return rangeBasisItem;
	}

	/// public
	function getAllSelected() {
		const allItems = document.querySelectorAll(".find-replace-item");
		const ret = [];
		for(const selectedItem of selectedItems) {
			if(selectedItems.has(selectedItem) && selectedItem in allItems) {
				ret.push(selectedItem);
			}
			else {
				selectedItems.delete(selectedItem);
			}
		}
	}

	/// public
	function applyControlValueToSelected(control, value) {
		switch(control) {
			case FindReplaceControl.OnOffToggle:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.CloseButton:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.Name:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.FindPattern:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.ReplaceString:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.MatchCase:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.PreserveCase:
				for(const item of selectedItems) {

				}
				break;
			case FindReplaceControl.RegularExpression:
				for(const item of selectedItems) {

				}
				break;
		}
	}

	return Object.freeze({
		setSelected: setSelected,
		toggleSelected: toggleSelected,
		setRangeSelected: setRangeSelected,
		setRangeSelectedFromRangeBasis: setRangeSelectedFromRangeBasis,
		clear: clear,
		getLastInteracted: getRangeBasisItem,
		getAllSelected: getAllSelected
	});
})();