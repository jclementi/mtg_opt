/* model
   I'll have a few variables to set the state, and any update will trigger a
   render of the stuff that's changed. When the set is updated, I'll first
   change the global variable representing the set, then call a function to
   update the relevant elements of the DOM with the new information.
   */

/* state variables */
var card_data;
var current_set;
var current_card;

/* requests */
function request() {
	httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'http://localhost:3000/all_sets');
	httpRequest.send();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState !== XMLHttpRequest.DONE) {
			return;
		}
		console.log(httpRequest);
		card_data = JSON.parse(httpRequest.response);
		current_set = card_data.THS;
	};
}

/* navigates through the sets loaded into memory
   has to find the currently loaded set before stepping
   */
function navigate_set(all_sets, set_name, step) {
	var keys = new Array();
	keys = Object.keys(all_sets);
	var set_key, i;
	for (i=0; (keys[i] != set_name) && (i<keys.length); i++) {}
	set_key = keys[i+step];
	return set_key;
}

function prev_set() {
	var set_key = navigate_set(card_data, current_set.code, -1);
	current_set = card_data[set_key];
	update_set(current_set);
}

function next_set() {
	var set_key = navigate_set(card_data, current_set.code, 1);
	current_set = card_data[set_key];
	update_set(current_set);
}

function update_set(set) {
	document.getElementById("set_name").textContent = set.name;
	document.getElementById("set_code").textContent = set.code;
}

document.getElementById("ajaxButton").addEventListener("click", request, false);
document.getElementById("prev_set").addEventListener("click", prev_set, false);
document.getElementById("next_set").addEventListener("click", next_set, false);
