/* #region Find-and-Replace Items */
/*                                */
function addFindReplaceItem(data, atIndex = -1, incrementCount = true, save = true) {
	//:: <div class="find-replace-item">
	//::    <div class="find-replace-item__controls">...</div>
	//::    <div class="find-replace-item__input-area">...</div>
	//::    <div class="find-replace-item__options-area">...</div>
	//:: </div>

	const {
		isActive,
		name,
		findPattern,
		replaceString,
		matchCase,
		// preserveCase,
		isRegex
	} = data ?? {
		isActive: true,
		name: "",
		findPattern: "",
		replaceString: "",
		matchCase: false,
		//preserveCase: false,
		isRegex: false
	};

	// console.log(data);

	const item = document.createElement("div");
	item.classList.add("find-replace-item");
	item.addEventListener("click", (evt) => {
		if(evt.shiftKey) {
			ItemSelector.setRangeSelectedFromRangeBasis(item, true, keepPrevious = evt.ctrlKey);
		}
		else {
			ItemSelector.toggleSelected(item, setAsRangeBasis = true, keepPrevious = evt.ctrlKey);
		}
	});

	item.appendChild(createFindReplaceControlArea(isActive, name));
	item.appendChild(createFindReplaceInputArea(findPattern, replaceString));
	item.appendChild(createFindReplaceOptionsArea(matchCase, isRegex));

	const container = document.getElementById("find-replace__item-container");
	if(atIndex === -1) {
		container.appendChild(item);
		container.appendChild(createFindReplaceGap());
	}
	else {
		const existingItems = container.querySelectorAll(".find-replace-item");
		if(atIndex < 0 || existingItems.length < atIndex) {
			console.error(`Invalid item index ${atIndex} given to ${addFindReplaceItem.name}().`);
			return;
		}
		
		const gap = createFindReplaceGap();
		container.insertBefore(gap, existingItems[atIndex]);
		container.insertBefore(item, gap);
	}

	if(incrementCount) {
		incrementItemCount();
	}

	if(save) {	
		saveSequence();
	}
}

function createFindReplaceControlArea(isActive, name) {
	//:: <div class="find-replace-item__controls">
	//::   <label class="find-replace-item__toggle">
	//::     <input type="checkbox" checked />
	//::     <span class="find-replace-item__toggle-slider"></span>
	//::   </label>
	//::   <label class="find-replace-item__name">
	//::     Name
	//::     <input type="text" />
	//::   </label>
	//::   <button class="find-replace-item__close">×</button>
	//:: </div>

	const controlArea = document.createElement("div");
	controlArea.classList.add("find-replace-item__controls");

	const toggle = document.createElement("label");
	toggle.classList.add("find-replace-item__toggle");
	controlArea.appendChild(toggle);

	const toggleCheckbox = document.createElement("input");
	toggleCheckbox.type = "checkbox";
	toggleCheckbox.checked = isActive;
	toggleCheckbox.addEventListener("change", saveSequence);
	toggle.appendChild(toggleCheckbox);

	const sliderSpan = document.createElement("span");
	sliderSpan.classList.add("find-replace-item__toggle-slider");
	toggle.appendChild(sliderSpan);

	const nameLabel = document.createElement("label");
	nameLabel.classList.add("find-replace-item__name");
	nameLabel.textContent = "Name ";
	controlArea.appendChild(nameLabel);

	const nameInput = document.createElement("input");
	nameInput.classList.add("find-replace-item__name-input");
	nameInput.type = "text";
	if(name !== null && typeof name !== "undefined") {
		nameInput.value = name;
	}
	nameLabel.addEventListener("change", saveSequence);
	nameLabel.addEventListener("click", (evt) => evt.stopPropagation());
	nameLabel.appendChild(nameInput);

	const closeButton = document.createElement("button");
	closeButton.classList.add("find-replace-item__close");
	closeButton.innerHTML = "&times;";
	closeButton.addEventListener("click", () => {
		let parent = closeButton.parentElement;
		while(parent && !parent.classList.contains("find-replace-item")) {
			parent = parent.parentElement;
		}
		removeFindReplaceItem(parent);
	});
	controlArea.appendChild(closeButton);

	return controlArea;
}

function removeFindReplaceItem(item, decrementCount = true, save = true) {
	item.nextElementSibling.replaceWith();
	item.replaceWith();

	if(decrementCount) {
		decrementItemCount();
	}

	if(save) {
		saveSequence();
	}
}

function createFindReplaceInputArea(findPattern, replaceString) {
	//:: <div class="find-replace-item__input-area">
	//::   <label class="find-replace-item__input input__find">...</label>
	//::   <label class="find-replace-item__input input__replace">...</label>
	//:: </div>

	const inputArea = document.createElement("div");
	inputArea.classList.add("find-replace-item__input-area");

	inputArea.appendChild(createFindReplaceInput("Find", findPattern));
	inputArea.appendChild(createFindReplaceInput("Replace", replaceString));

	return inputArea;
}

function createFindReplaceInput(title, value) {
	//:: <label class="find-replace-item__input input__{inputClass}">
	//::   <span class="find-replace-item__input-label-text">{text}</span>
	//::   <input type="text" placeholder="[empty]" />
	//:: </label>

	const inputLabel = document.createElement("label");
	const inputClass = title.toLowerCase();
	inputLabel.classList.add("find-replace-item__input", `input__${inputClass}`);

	const inputText = document.createElement("span");
	inputText.classList.add("find-replace-item__input-label-text");
	inputText.textContent = title;
	inputLabel.appendChild(inputText);

	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = "[empty]";
	if(value !== null && typeof value !== "undefined") {
		input.value = value;
	}
	input.addEventListener("click", (evt) => evt.stopPropagation());
	inputLabel.appendChild(input);

	return inputLabel;
}

function createFindReplaceOptionsArea(matchCase, isRegex) {
	//:: <div class="find-replace-item__options-area">
	//::   <label class="find-replace-item__option option__match-case">...</label>
	//::   <label class="find-replace-item__option option__regular-expression">...</label>
  //:: </div>

	const optionsArea = document.createElement("div");
	optionsArea.classList.add("find-replace-item__options-area");

	optionsArea.appendChild(createFindReplaceOption("Match case", matchCase));
	// optionsArea.appendChild(createFindReplaceOption("Preserve case"));
	optionsArea.appendChild(createFindReplaceOption("Regular Expression", isRegex));

	return optionsArea;
}

function createFindReplaceOption(text, isSelected) {
	//:: <label class="find-replace-item__option option__{optionClass}">
	//::   <input type="checkbox" />
	//::   [space]
	//::   <span class="find-replace-item__option-label-text">{text}</span>
	//:: </label>
	
	const optionLabel = document.createElement("label");
	const optionClass = text.toLowerCase().replace(/\s+/g, "-");
	optionLabel.classList.add("find-replace-item__option", `option__${optionClass}`);
	optionLabel.addEventListener("click", (evt) => evt.stopPropagation());

	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = isSelected;
	input.addEventListener("change", saveSequence);
	input.addEventListener("click", (evt) => evt.stopPropagation());
	optionLabel.appendChild(input);

	const whitespace = document.createTextNode(" ");
	optionLabel.appendChild(whitespace);

	const optionText = document.createElement("span");
	optionText.classList.add("find-replace-item__option-label-text");
	optionText.textContent = text;
	optionLabel.appendChild(optionText);

	return optionLabel;
}

function createFindReplaceGap() {
	const gap = document.createElement("div");
	gap.classList.add("find-replace-gap");

	const divider = document.createElement("hr");
	divider.classList.add("find-replace-gap__divider");
	gap.appendChild(divider);

	const addButton = document.createElement("button");
	addButton.classList.add("find-replace-gap__add-button");
	addButton.innerText = "+";
	addButton.addEventListener("click", () => {
		const container = document.getElementById("find-replace__item-container");
		const itemIndex = Math.floor(Array.prototype.indexOf.call(container.children, gap) / 2);
		addFindReplaceItem(getDataFromItem(gap.previousElementSibling ?? gap.nextElementSibling), itemIndex);
	});
	gap.appendChild(addButton);

	return gap;
}

function getDataFromItem(item) {
	return item ? {
		isActive: item.querySelector(".find-replace-item__toggle input").checked,
		name: item.querySelector(".find-replace-item__name-input").value,
		findPattern: item.querySelector(".input__find input").value,
		replaceString: item.querySelector(".input__replace input").value,
		matchCase: item.querySelector(".option__match-case input").checked,
		// preserveCase: item.querySelector(".option__preserve-case input").checked,
		isRegex: item.querySelector(".option__regular-expression input").checked
	} : null;
}

function selectControl(evt, controlName, value) {
	evt.stopPropagation();
	if(evt.target.queryInParents(".find-replace-element")?.classList.contains("selected")) {
		ItemSelector.applyToSelected(controlName, value);
	}
}
/*                                   */
/* #endregion Find-and-Replace Items */
