const FindReplaceItem = (function() {
	//#region Static Data
	const CssClasses = Object.freeze({
		Root: "find-replace-item",
		ControlArea: "find-replace-item__controls",
		ToggleLabel: "find-replace-item__toggle",
		ToggleCheckbox: "find-replace-item__toggle-checkbox",
		ToggleSlider: "find-replace-item__toggle-slider",
		NameLabel: "find-replace-item__name",
		NameInput: "find-replace-item__name-input",
		CloseButton: "find-replace-item__close",
		InputArea: "find-replace-item__input-area",
		InputBase: "find-replace-item__input",
		InputOfType: (type) => `input__${CssClasses.ConvertToClassString(type)}`,
		InputLabelText: "find-replace-item__input-label-text",
		OptionsArea: "find-replace-item__options-area",
		OptionBase: "find-replace-item__option",
		OptionOfType: (type) => `option__${CssClasses.ConvertToClassString(type)}`,
		OptionText: "find-replace-item__option-label-text",
		ConvertToClassString: (value) => value.toLowerCase().replace(/\s+/g, "-")
	});

	const DefaultData = Object.freeze({
		isActive: true,
		name: "",
		findPattern: "",
		replaceString: "",
		matchCase: false,
		// preserveCase: false,
		isRegex: false
	});
	//#endregion Static Data

	//#region Public Static API
	function createNew(data) {
		//#region Instance Data
		const id = crypto.randomUUID();
		const {
			root,
			toggle,
			closeButton,
			nameField,
			findField,
			replaceField,
			matchCaseCheckbox,
			// preserveCaseCheckbox,
			regexCheckbox
		} = createElements(data);

		const publicSelf = Object.freeze({
			get isSelected() { return root.classList.contains("selected") },
			get isActive() { return toggle.checked },
			set isActive(value) { toggle.checked = value },
			get name() { return nameField.value },
			set name(value) { nameField.value = value },
			get findPattern() { return findField.value },
			set findPattern(value) { findField.value = value },
			get replaceString() { return replaceField.value },
			set replaceString(value) { replaceField.value = value },
			get matchCase() { return matchCaseCheckbox.checked },
			set matchCase(value) { matchCaseCheckbox.checked = value },
			// get preserveCase() { return preserveCaseCheckbox.checked },
			// set preserveCase(value) { preserveCaseCheckbox.checked = value },
			get isRegex() { return regexCheckbox.checked },
			set isRegex(value) { regexCheckbox.checked = value },
			get data() {
				return {
					isActive: this.isActive,
					name: this.name,
					findPattern: this.findPattern,
					replaceString: this.replaceString,
					matchCase: this.matchCase,
					// preserveCase: this.preserveCase,
					isRegex: this.isRegex
				}
			},
			set data(value) {
				this.isActive = value.isActive;
				this.name = value.name;
				this.findPattern = value.findPattern;
				this.replaceString = value.replaceString;
				this.matchCase = value.matchCase;
				// this.preserveCase = value.preserveCase;
				this.isRegex = value.isRegex;
			},
			id: id,
			appendTo: appendTo,
			insertBefore: insertBefore,
			insertAfter: insertAfter,
			destroy: destroy
		});
		//#endregion Instance Data

		//#region Public Instance API
		function createElements(data) {
			data ??= DefaultData;

			const root = createRoot();
			const controlArea = createControlArea(data);
			const inputArea = createInputArea(data);
			const optionsArea = createOptionsArea(data);

			root.appendChild(controlArea.root);
			root.appendChild(inputArea.root);
			root.appendChild(optionsArea.root);

			return {
				root: root,
				toggle: controlArea.toggle,
				closeButton: controlArea.closeButton,
				nameField: controlArea.nameField,
				findField: inputArea.findField,
				replaceField: inputArea.replaceField,
				matchCaseCheckbox: optionsArea.matchCaseCheckbox,
				// preserveCaseCheckbox: optionsArea.preserveCaseCheckbox,
				regexCheckbox: optionsArea.regexCheckbox
			};
		}

		function appendTo(parentNode) {
			parentNode.appendChild(root);
		}

		function insertBefore(parentNode, referenceNode) {
			parentNode.insertBefore(root, referenceNode);
		}

		function insertAfter(parentNode, referenceNode) {
			const nextReferenceSibling = referenceNode?.nextElementSibling;
			if(nextReferenceSibling) {
				parentNode.insertBefore(root, nextReferenceSibling);
			}
			else {
				parentNode.appendChild(root);
			}
		}

		function destroy() {
			root.remove();
		}
		//#endregion Public Instance API

		//#region Private Instance API
		function createRoot() {
			const rootDiv = document.createElement("div");
			rootDiv.classList.add(CssClasses.Root);
			rootDiv.addEventListener("click", (evt) => handleItemSelection(evt));

			return rootDiv;
		}

		function handleItemSelection(evt) {
			if(evt.shiftKey) {
				ItemSelector.setRangeSelectedFromRangeBasis(root, true, keepPrevious = evt.ctrlKey);
			}
			else {
				ItemSelector.toggleSelected(root, setAsRangeBasis = true, keepPrevious = evt.ctrlKey);
			}
		}

		function createControlArea(data) {
			const controlAreaDiv = document.createElement("div");
			controlAreaDiv.classList.add(CssClasses.ControlArea);
			
			const toggleLabel = createToggleLabel();
			controlAreaDiv.appendChild(toggleLabel);
			
			const toggle = createToggle(data.isActive);
			toggleLabel.appendChild(toggle);
			
			const sliderSpan = createToggleSliderSpan();
			toggleLabel.appendChild(sliderSpan);
			
			const nameLabel = createNameLabel();
			controlAreaDiv.appendChild(nameLabel);
			
			const nameField = createNameField(data.name);
			nameLabel.appendChild(nameField);
			
			const closeButton = createCloseButton();
			controlAreaDiv.appendChild(closeButton);
			
			return {
				root: controlAreaDiv,
				toggle: toggle,
				nameField: nameField,
				closeButton: closeButton
			};
		}

		function createToggleLabel() {
			const toggleLabel = document.createElement("label");
			toggleLabel.classList.add(CssClasses.ToggleLabel);

			return toggleLabel;
		}

		function createToggle(isActive) {
			const toggleCheckbox = document.createElement("input");
			toggleCheckbox.classList.add(CssClasses.ToggleCheckbox);
			toggleCheckbox.type = "checkbox";
			toggleCheckbox.checked = isActive;
			toggleCheckbox.addEventListener("change", saveSequence);

			return toggleCheckbox;
		}

		function createToggleSliderSpan() {
			const sliderSpan = document.createElement("span");
			sliderSpan.classList.add(CssClasses.ToggleSlider);

			return sliderSpan;
		}

		function createNameLabel() {
			const nameLabel = document.createElement("label");
			nameLabel.classList.add(CssClasses.NameLabel);
			nameLabel.textContent = "Name ";
			nameLabel.addEventListener("change", saveSequence);
			nameLabel.addEventListener("click", (evt) => evt.stopPropagation());

			return nameLabel;
		}

		function createNameField(name) {
			const nameInput = document.createElement("input");
			nameInput.classList.add(CssClasses.NameInput);
			nameInput.type = "text";
			if(name !== null && typeof name !== "undefined") {
				nameInput.value = name;
			}

			return nameInput;
		}

		function createCloseButton() {
			const closeButton = document.createElement("button");
			closeButton.classList.add(CssClasses.CloseButton);
			closeButton.innerHTML = "&times;";
			closeButton.addEventListener("click", () => FindReplaceList.remove(publicSelf));
			
			return closeButton;
		}

		function _temp_close(save) {
			if(root !== null) {
				root.nextElementSibling.replaceWith();
				root.replaceWith();

				if(decrementCount) {
					decrementItemCount();
				}

				if(save) {
					saveSequence();
				}
			}
		}

		function createInputArea(data) {
			const inputArea = document.createElement("div");
			inputArea.classList.add(CssClasses.InputArea);

			const findInput = createFindInput(data.findPattern);
			inputArea.appendChild(findInput.root);

			const replaceInput = createReplaceInput(data.replaceString);
			inputArea.appendChild(replaceInput.root);

			return {
				root: inputArea,
				findField: findInput.input,
				replaceField: replaceInput.input
			};
		}

		function createFindInput(findPattern) {
			return createInput("Find", findPattern ?? DefaultData.findPattern);
		}

		function createReplaceInput(replaceString) {
			return createInput("Replace", replaceString ?? DefaultData.replaceString);
		}

		function createInput(title, value) {
			const label = document.createElement("label");

			const text = createInputLabelText(title);
			label.appendChild(text);

			const inputField = createInputField(title, value);
			label.appendChild(inputField);

			return {
				root: label,
				input: inputField
			};
		}

		function createInputLabelText(title) {
			const inputText = document.createElement("span");
			inputText.classList.add(CssClasses.InputLabelText);
			inputText.textContent = title;

			return inputText;
		}

		function createInputField(title, value) {
			const input = document.createElement("input");
			input.classList.add(CssClasses.InputBase, CssClasses.InputOfType(title));
			input.type = "text";
			input.placeholder = "[empty]";
			if(value !== null && typeof value !== "undefined") {
				input.value = value;
			}
			input.addEventListener("click", (evt) => evt.stopPropagation());

			return input;
		}

		function createOptionsArea(data) {
			const optionsArea = document.createElement("div");
			optionsArea.classList.add(CssClasses.OptionsArea);

			const matchCaseOption = createMatchCaseOption(data.matchCase);
			optionsArea.appendChild(matchCaseOption.root);

			const regexOption = createRegexOption(data.isRegex);
			optionsArea.appendChild(regexOption.root);

			return {
				root: optionsArea,
				matchCaseCheckbox: matchCaseOption.checkbox,
				regexCheckbox: regexOption.checkbox
			};
		}

		function createMatchCaseOption(shouldMatchCase) {
			return createOption("Match Case", shouldMatchCase);
		}

		function createRegexOption(isRegex) {
			return createOption("Regular Expression", isRegex);
		}

		function createOption(title, isSelected) {
			const label = createOptionLabel();

			const option = createOptionField(title, isSelected);
			label.appendChild(option);

			const whitespace = createWhitespaceNode();
			label.appendChild(whitespace);

			const text = createOptionText(title);
			label.appendChild(text);

			return {
				root: label,
				checkbox: option
			};
		}

		function createOptionLabel() {
			const optionLabel = document.createElement("label");
			optionLabel.addEventListener("click", (evt) => evt.stopPropagation());

			return optionLabel;
		}

		function createOptionField(title, isSelected) {
			const input = document.createElement("input");
			input.classList.add(CssClasses.OptionBase, CssClasses.OptionOfType(title));
			input.type = "checkbox";
			input.checked = isSelected;
			input.addEventListener("change", saveSequence);
			input.addEventListener("click", (evt) => evt.stopPropagation());

			return input;
		}

		function createWhitespaceNode() {
			return document.createTextNode(" ");
		}

		function createOptionText(title) {
			const optionText = document.createElement("span");
			optionText.classList.add(CssClasses.OptionText);
			optionText.textContent = title;

			return optionText;
		}
		//#endregion Private Instance API

		return publicSelf;
	}
	//#endregion Public Static API

	return Object.freeze({
		createNew: createNew,
	});
})();