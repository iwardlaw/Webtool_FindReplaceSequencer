const FindReplaceGap = (function() {
	//#region Static Data
	const CssClasses = Object.freeze({
		Root: "find-replace-gap",
		Divider: "find-replace-gap__divider",
		AddButton: "find-replace-gap__add-button"
	});
	//#endregion Static Data

	//#region Public Static API
	function createNew(addButtonCallback) {
		//#region Instance Data
		const id = crypto.randomUUID();
		const {
			root,
			divider,
			addButton
		} = createElements();
		//#endregion Instance Data

		//#region Public Instance API
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
		function createElements() {
			const root = createRoot();

			const divider = createDivider();
			root.appendChild(divider);

			const addButton = createAddButton();
			root.appendChild(addButton);

			return {
				root: root,
				divider: divider,
				addButton: addButton
			};
		}
		//#endregion Private Instance API
		
		const publicSelf = Object.freeze({
			id: id,
			appendTo: appendTo,
			insertBefore: insertBefore,
			insertAfter: insertAfter,
			destroy: destroy
		});
		
		addButton.addEventListener("click", () => addButtonCallback?.call(this, publicSelf));

		return publicSelf;
	}
	//#endregion Public Static API

	//#region Private Static API
	function createRoot() {
		const rootDiv = document.createElement("div");
		rootDiv.classList.add(CssClasses.Root);

		return rootDiv;
	}

	function createDivider() {
		const divider = document.createElement("hr");
		divider.classList.add(CssClasses.Divider);

		return divider;
	}

	function createAddButton() {
		const button = document.createElement("button");
		button.classList.add(CssClasses.AddButton);
		button.textContent = "+";

		return button;
	}

	function _temp_createFindReplaceItem() {
		const container = document.getElementById("find-replace__item-container");
		const itemIndex = Math.floor(Array.prototype.indexOf.call(container.children, gap) / 2);
		addFindReplaceItem(getDataFromItem(gap.previousElementSibling ?? gap.nextElementSibling), itemIndex);
	}
	//#endregion Private Static API

	return Object.freeze({
		createNew: createNew
	});
})();