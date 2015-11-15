function request() {
	httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'http://localhost:3000/origins');
	httpRequest.send();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState !== XMLHttpRequest.DONE) {
			return;
		}
		console.log(httpRequest);
		var origins = JSON.parse(httpRequest.response);
		console.log(origins);
	};
}
var b = document.getElementById("ajaxButton");
b.addEventListener("click", request, false);
