const isLowerCase = (str) => str === str.toLowerCase() && str !== str.toUpperCase();

function alphaToDecimal(alphaNum) {
	const lowerBaseCode = "a".charCodeAt();
	const upperBaseCode = "A".charCodeAt();

	const charArr = alphaNum.split("");
	let value = 0;

	for(let i = 0; i < charArr.length; i++) {
		const thisDigitValue = charArr[i].charCodeAt() - (isLowerCase(charArr[i]) ? lowerBaseCode : upperBaseCode) + 1;
		value += thisDigitValue * 26 ** (charArr.length - i - 1);
	}

	return value;
}

function replaceAllCaseInsensitive(string, pattern, replacement) {
	if(pattern === "" || pattern === replacement) {
		return string;
	}

	if(typeof pattern === "object" && pattern instanceof RegExp) {
		replacement = replacement.replaceAll("\\n", "\n");
		return this.replaceAll(new RegExp(pattern, "gi"), replacement);
	}

	let ret = "";
	pattern = pattern.toLowerCase();

	while(true) {
		// console.log(ret);

		const index = string.toLowerCase().indexOf(pattern);
		if(index === -1) {
			ret += string;
			break;
		}

		ret += string.substring(0, index) + replacement;
		string = string.substring(index + pattern.length);
	}

	return ret;
}

function substituteRegexReplacementEscapes(replaceString) {
	return replaceString
		.replaceAll("\\f", "\f")
		.replaceAll("\\n", "\n")
		.replaceAll("\\r", "\r")
		.replaceAll("\\t", "\t")
		.replaceAll("\\v", "\v")
		.replaceAll(/\\U(.)/g, (_match, group1) => group1.toUpperCase())
		.replaceAll(/\\L(.)/g, (_match, group1) => group1.toLowerCase());
}

function queryInParents(element, selector) {
	let parent = element.parentElement;
	while(parent !== null) {
		if(parent.matches(selector)) {
			return parent;
		}
		parent = parent.parentElement;
	}

	return null;
}

function arrayHasIndex(arr, idx) {
	return 0 <= idx && idx < arr.length;
}

function shiftWithinArray(arr, startIdx, stopIdx, shouldRotate) {
	if(!arrayHasIndex(arr, startIdx) || !arrayHasIndex(arr, stopIdx)) {
		throw new RangeError("Indices provided to 'shiftArray' must be within the array's bounds.");
	}

	if(startIdx === stopIdx) {
		return;
	}

	const lastValue = arr[stopIdx];

	if(startIdx > stopIdx) {
		for(let i = stopIdx; i > startIdx; i--) {
			arr[i] = arr[i - 1];
		}
	}
	else if(startIdx < stopIdx) {
		for(let i = stopIdx; i < startIdx; i++) {
			arr[i] = arr[i + 1];
		}
	}

	if(shouldRotate) {
		arr[startIdx] = lastValue;
	}
}
