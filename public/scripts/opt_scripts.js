/* model
   I'll have a few variables to set the state, and any update will trigger a
   render of the stuff that's changed. When the set is updated, I'll first
   change the global variable representing the set, then call a function to
   update the relevant elements of the DOM with the new information.
   */

/* state variables */
var card_data;
var current_set;
var current_card_array;
var current_card;

/* requests */
function request_all() {
	request('all_sets');
}
function request(set) {
	httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'http://localhost:3000/'+set);
	httpRequest.send();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState !== XMLHttpRequest.DONE) {
			return false;
		}
		card_data = JSON.parse(httpRequest.response);
		current_set = card_data.SOI;
		console.log(card_data);
		return card_data;
	};
}


/* card and set navigation */

/* navigate_array
   arr - array to navigate
   cur_pos - key of the current position in the array
   step - how far to navigate from the current position
   returns the key for the new position of the array
   */
function navigate_array (arr, prop_cur_pos, property, step) {
	var keys = new Array();
	keys = Object.keys(arr);
	var new_pos;
	for (var i=0; (arr[keys[i]][property] != prop_cur_pos) && (i<keys.length); i++) {}
	if ((i+step == keys.length) || (i+step < 0)) { return keys[i]; }
	new_pos = keys[i+step];
	return new_pos;
}

/* update the globals containing the current cards and sets */
function prev_set() {
	var set_key = navigate_array(card_data, current_set.code, 'code', -1);
	current_set = card_data[set_key];
	current_card = current_set.cards[0];
	update_set(current_set);
	update_card(current_card);
}

function next_set() {
	var set_key = navigate_array(card_data, current_set.code, 'code', 1);
	current_set = card_data[set_key];
	current_card = current_set.cards[0];
	update_set(current_set);
	update_card(current_card);
}

function next_card() {
	var next = navigate_array(current_set.cards, current_card.name, 'name', 1);
	current_card = current_set.cards[next];
	update_card(current_card);
}

function previous_card() {
	var previous = navigate_array(current_set.cards, current_card.name, 'name', -1);
	current_card = current_set.cards[previous];
	update_card(current_card);
}

/* update functions that interact with the DOM */
function update_set(set) {
	document.getElementById("set_name").textContent = set.name;
	document.getElementById("set_code").textContent = set.code;
}

function update_card(current_card) {
	var context = document.getElementById("canvas_card").getContext('2d');
	draw_card(context, current_card, 0, 0);
}


/* card and set manipulation
   add buttons to toggle display for each color and type
   each button click will trigger a re-draw
   */

/* globals to keep track of what should be drawn */
draw_white = true;
draw_blue = true;
draw_black = true;
draw_red = true;
draw_green = true;
draw_colorless = true;
draw_artifacts = true;
draw_creatures = true;
draw_enchantments = true;
draw_instants = true;
draw_land = true;
draw_planeswalkers = true;
draw_sorceries = true;

/* on clicking each button, update the proper variable, update the set, and redraw
   each toggle function passes a test that the manipulator will use to determine what
   cards should be displayed. If the test returns true and the global is set to 'false',
   the card will not be included in the set */
function toggle_white() {
	var test = (card) => {
		for (var i = 0; i < card.colorIdentity.length; i++) {
			if (card.colorIdentity[i] == 'W') {
				return true;
			}
		}
		return false;
	}
	var changed_set = manipulate_set(draw_white, test);
	update_set_canvas(changed_set);
}

function toggle_blue() {
	var test = (card) => {
		for (var i = 0; i < card.colorIdentity.length; i++) {
			if (card.colorIdentity[i] == 'U') {
				return true;
			}
		}
		return false;
	}
	var changed_set = manipulate_set(draw_blue, test);
	update_set_canvas(changed_set);
}

function toggle_black() {
	var test = (card) => {
		for (var i = 0; i < card.colorIdentity.length; i++) {
			if (card.colorIdentity[i] == 'B') {
				return true;
			}
		}
		return false;
	}
	var changed_set = manipulate_set(draw_black, test);
	update_set_canvas(changed_set);
}

function toggle_red() {
	var test = (card) => {
		for (var i = 0; i < card.colorIdentity.length; i++) {
			if (card.colorIdentity[i] == 'R') {
				return true;
			}
		}
		return false;
	}
	var changed_set = manipulate_set(draw_red, test);
	update_set_canvas(changed_set);
}

function toggle_green() {
	var test = (card) => {
		for (var i = 0; i < card.colorIdentity.length; i++) {
			if (card.colorIdentity[i] == 'G') {
				return true;
			}
		}
		return false;
	}
	var changed_set = manipulate_set(draw_green, test);
	update_set_canvas(changed_set);
}


function toggle_colorless() {
	var test = (card) => {
		if (card.hasOwnProperty('colorIdentity') == false) {
				return true;
		}
		return false;
	}
	var changed_set = manipulate_set(draw_colorless, test);
	update_set_canvas(changed_set);
}

function toggle_artifacts() {
	var test = (card) => {
		if (card.type.match(/artifact/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_artifacts, test);
	update_set_canvas(changed_set);
}

function toggle_creatures() {
	var test = (card) => {
		if (card.type.match(/creature/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_creatures, test);
	update_set_canvas(changed_set);
}

function toggle_enchantments() {
	var test = (card) => {
		if (card.type.match(/enchantment/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_enchantments, test);
	update_set_canvas(changed_set);
}

function toggle_instants() {
	var test = (card) => {
		if (card.type.match(/instant/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_instants,test);
	update_set_canvas(changed_set);
}

function toggle_land() {
	var test = (card) => {
		if (card.type.match(/land/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_land,test);
	update_set_canvas(changed_set);
}

function toggle_planeswalkers() {
	var test = (card) => {
		if (card.type.match(/planeswalker/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_planeswalkers,test);
	update_set_canvas(changed_set);
}

function toggle_sorceries() {
	var test = (card) => {
		if (card.type.match(/sorcery/g)) {
			return true;
		}
		return false;
	}

	var changed_set = manipulate_set(draw_sorceries,test);
	update_set_canvas(changed_set);
}

/* takes a global variable to change, and a function to test elements of the set against
   manipulates the set to fit the new global setting
   redraws the set */
function manipulate_set (global, test) {
	global = !global;
	var changed_set = new Array;
	var j = 0;
	for (var i = 0; i < current_set.cards.length; i++) {
		if (test(current_set.cards[i]) == global) {
			changed_set[j] = current_set.cards[i];
		}
	}
	return changed_set;
}




/* drawing functions */
/* globals for the big canvas */
var set_ctx = document.getElementById("canvas_set").getContext('2d');
var card_disp_width = 200;
var card_disp_height = 40;
var color_fills = new Array;
color_fills['W'] = '#eeeeee';
color_fills['U'] = '#ccccff';
color_fills['B'] = '#aaaaaa';
color_fills['R'] = '#ffcccc';
color_fills['G'] = '#ccffcc';
color_fills['A'] = '#cccccc';

/* draw a card on the supplied canvas
   take a card object and canvas as input
   */
function draw_card(ctx, card, w, h) {

	/* set fillStyle according to color identity */
	if (card.hasOwnProperty('colorIdentity') == false) {
		ctx.fillStyle = color_fills['A'];
	} else if (card.colorIdentity.length == 1) {
		ctx.fillStyle = color_fills[card.colorIdentity[0]];
	} else {
		var gradient = ctx.createLinearGradient(w, h, w+card_disp_width, h);
		var num_colors = card.colorIdentity.length;
		var colorstop_pos = 0
		for (var i=0; i<num_colors; i++) {
			gradient.addColorStop(0+(i*(1/(num_colors-1))), color_fills[card.colorIdentity[i]]);
			ctx.fillStyle = gradient;
		}
	}

	ctx.fillRect(w, h, card_disp_width, card_disp_height);
	ctx.fillStyle = '#000000';

	ctx.textAlign = 'left';
	ctx.fillText(card.name, w+5, h+15);
	ctx.fillText(card.type, w+5, h+30);
	ctx.textAlign = 'right';

	var mana_cost;
	if (card.hasOwnProperty('manaCost')) {
		mana_cost = card.manaCost;
	} else {
		mana_cost = '';
	}
	ctx.fillText(mana_cost, w+(card_disp_width-5), h+15);

	if ((card.type.match(/Creature/g)) != null) {
		ctx.fillText(card.power + "/" + card.toughness, w+(card_disp_width-5), h+30);
	}
}

/* draw an array of cards, laid out by manacost
   ctx - context for a canvas to draw on
   cards - array of card objects
   */
function draw_set(canvas, ctx, cards) {
	/* have to keep track of how many cards have been drawn at each manacost
	   resizing the canvas erases everything drawn on it, so resizing has to be done
	   before drawing */

	/* loop through the set, counting the number of cards at each cmc
	   bound to be other prep work, maybe related to double-faced and flip cards */
	var cost_count = new Array();
	for (var i=0; i<20; i++) {
		cost_count[i] = 0;
	}

	var cmc;
	for (i=0; i<cards.length; i++) {
		if (cards[i].hasOwnProperty('cmc')) {
			cmc = cards[i].cmc;
		} else {
			cmc = 0;
		}
		cost_count[cmc] += 1;
	}

	var max_cost_count = 0;
	for (i=0; i<cost_count.length; i++) {
		if (cost_count[i] > max_cost_count) {
			max_cost_count = cost_count[i];
		}
	}
	canvas.height = (max_cost_count * (card_disp_height+5));

	/* loop through the cards to draw each */
	for (i=0; i < cost_count.length; i++) {
		cost_count[i] = 0;
	}

	for (i=0; i < cards.length; i++) {
		if (cards[i].hasOwnProperty('cmc')) {
			cmc = cards[i].cmc;
		} else {
			cmc = 0;
		}
		cost_count[cmc] += 1;
		draw_card(ctx, cards[i], cmc*(card_disp_width+5), cost_count[cmc]*(card_disp_height+5));
	}
}

function draw_all_cards() {
	update_set_canvas(current_set.cards);
}

function update_set_canvas(cards) {
	var canvas = document.getElementById('canvas_set');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw_set(canvas, ctx, cards);
}


/* page setup */

document.getElementById("ajaxButton").addEventListener("click", request_all, false);
document.getElementById("prev_set").addEventListener("click", prev_set, false);
document.getElementById("next_set").addEventListener("click", next_set, false);
document.getElementById("prev_card").addEventListener("click", previous_card, false);
document.getElementById("next_card").addEventListener("click", next_card, false);
document.getElementById("draw_set").addEventListener("click", draw_all_cards, false);

document.getElementById("draw_white").addEventListener("click",toggle_white);
document.getElementById("draw_blue").addEventListener("click",toggle_blue);
document.getElementById("draw_black").addEventListener("click",toggle_black);
document.getElementById("draw_red").addEventListener("click",toggle_red);
document.getElementById("draw_green").addEventListener("click",toggle_green);
document.getElementById("draw_colorless").addEventListener("click",toggle_colorless);
document.getElementById("draw_artifacts").addEventListener("click",toggle_artifacts);
document.getElementById("draw_creatures").addEventListener("click",toggle_creatures);
document.getElementById("draw_enchantments").addEventListener("click",toggle_enchantments);
document.getElementById("draw_instants").addEventListener("click",toggle_instants);
document.getElementById("draw_land").addEventListener("click",toggle_land);
document.getElementById("draw_planeswalkers").addEventListener("click",toggle_planeswalkers);
document.getElementById("draw_sorceries").addEventListener("click",toggle_sorceries);
/* invoke and test everything */

(function initial_load () {
	request('all_sets');
	console.log("setting up");
}());
