CTFd._internal.challenge.data = undefined;

CTFd._internal.challenge.renderer = CTFd.lib.markdown();

CTFd._internal.challenge.preRender = function () {};

CTFd._internal.challenge.render = function (markdown) {
	return CTFd._internal.challenge.renderer.render(markdown);
};

CTFd._internal.challenge.postRender = function () {};

CTFd._internal.challenge.submit = function (preview) {
	var challenge_id = parseInt(CTFd.lib.$("#challenge-id").val());
	var submission = CTFd.lib.$("#challenge-input").val();

	var body = {
		challenge_id: challenge_id,
		submission: submission,
	};
	var params = {};
	if (preview) {
		params["preview"] = true;
	}

	return CTFd.api
		.post_challenge_attempt(params, body)
		.then(function (response) {
			if (response.status === 429) {
				// User was ratelimited but process response
				return response;
			}
			if (response.status === 403) {
				// User is not logged in or CTF is paused.
				return response;
			}
			return response;
		});
};

function mergeQueryParams(parameters, queryParameters) {
	if (parameters.$queryParameters) {
		Object.keys(parameters.$queryParameters).forEach(function (
			parameterName
		) {
			var parameter = parameters.$queryParameters[parameterName];
			queryParameters[parameterName] = parameter;
		});
	}

	return queryParameters;
}

function container_request(challenge_id) {
	var path = "/containers/api/request";
	var requestButton = document.getElementById("container-request-btn");
	var requestResult = document.getElementById("container-request-result");
	var connectionInfo = document.getElementById("container-connection-info");
	var containerExpires = document.getElementById("container-expires");
	var containerExpiresTime = document.getElementById(
		"container-expires-time"
	);
	var requestError = document.getElementById("container-request-error");

	requestButton.setAttribute("disabled", "disabled");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", path, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("CSRF-Token", init.csrfNonce);
	xhr.send(JSON.stringify({ chal_id: challenge_id }));
	xhr.onload = function () {
		var data = JSON.parse(this.responseText);
		if (data.error !== undefined) {
			// Container error
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.error;
			requestButton.removeAttribute("disabled");
		} else if (data.message !== undefined) {
			// CTFd error
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.message;
			requestButton.removeAttribute("disabled");
		} else {
			// Success
			requestError.style.display = "none";
			requestError.firstElementChild.innerHTML = "";
			requestButton.parentNode.removeChild(requestButton);
			connectionInfo.innerHTML = data.hostname + ":" + data.port;
			containerExpires.innerHTML = Math.ceil(
				(new Date(data.expires * 1000) - new Date()) / 1000 / 60
			);
			containerExpiresTime.innerHTML = new Date(
				data.expires * 1000
			).toLocaleTimeString();
			requestResult.style.display = "";
		}
		console.log(data);
	};
}

function container_reset(challenge_id) {
	var path = "/containers/api/reset";
	var resetButton = document.getElementById("container-reset-btn");
	var requestResult = document.getElementById("container-request-result");
	var containerExpires = document.getElementById("container-expires");
	var containerExpiresTime = document.getElementById(
		"container-expires-time"
	);
	var connectionInfo = document.getElementById("container-connection-info");
	var requestError = document.getElementById("container-request-error");

	resetButton.setAttribute("disabled", "disabled");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", path, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("CSRF-Token", init.csrfNonce);
	xhr.send(JSON.stringify({ chal_id: challenge_id }));
	xhr.onload = function () {
		var data = JSON.parse(this.responseText);
		if (data.error !== undefined) {
			// Container rrror
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.error;
			resetButton.removeAttribute("disabled");
		} else if (data.message !== undefined) {
			// CTFd error
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.message;
			resetButton.removeAttribute("disabled");
		} else {
			// Success
			requestError.style.display = "none";
			connectionInfo.innerHTML = data.hostname + ":" + data.port;
			containerExpires.innerHTML = Math.ceil(
				(new Date(data.expires * 1000) - new Date()) / 1000 / 60
			);
			containerExpiresTime.innerHTML = new Date(
				data.expires * 1000
			).toLocaleTimeString();
			requestResult.style.display = "";
			resetButton.removeAttribute("disabled");
		}
		console.log(data);
	};
}

function container_renew(challenge_id) {
	var path = "/containers/api/renew";
	var renewButton = document.getElementById("container-renew-btn");
	var requestResult = document.getElementById("container-request-result");
	var containerExpires = document.getElementById("container-expires");
	var containerExpiresTime = document.getElementById(
		"container-expires-time"
	);
	var requestError = document.getElementById("container-request-error");

	renewButton.setAttribute("disabled", "disabled");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", path, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("CSRF-Token", init.csrfNonce);
	xhr.send(JSON.stringify({ chal_id: challenge_id }));
	xhr.onload = function () {
		var data = JSON.parse(this.responseText);
		if (data.error !== undefined) {
			// Container rrror
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.error;
			renewButton.removeAttribute("disabled");
		} else if (data.message !== undefined) {
			// CTFd error
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.message;
			renewButton.removeAttribute("disabled");
		} else {
			// Success
			requestError.style.display = "none";
			requestResult.style.display = "";
			containerExpires.innerHTML = Math.ceil(
				(new Date(data.expires * 1000) - new Date()) / 1000 / 60
			);
			containerExpiresTime.innerHTML = new Date(
				data.expires * 1000
			).toLocaleTimeString();
			renewButton.removeAttribute("disabled");
		}
		console.log(data);
	};
}

function container_stop(challenge_id) {
	var path = "/containers/api/stop";
	var stopButton = document.getElementById("container-stop-btn");
	var requestResult = document.getElementById("container-request-result");
	var connectionInfo = document.getElementById("container-connection-info");
	var requestError = document.getElementById("container-request-error");

	stopButton.setAttribute("disabled", "disabled");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", path, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("CSRF-Token", init.csrfNonce);
	xhr.send(JSON.stringify({ chal_id: challenge_id }));
	xhr.onload = function () {
		var data = JSON.parse(this.responseText);
		if (data.error !== undefined) {
			// Container rrror
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.error;
			stopButton.removeAttribute("disabled");
		} else if (data.message !== undefined) {
			// CTFd error
			requestError.style.display = "";
			requestError.firstElementChild.innerHTML = data.message;
			stopButton.removeAttribute("disabled");
		} else {
			// Success
			requestError.style.display = "none";
			requestResult.innerHTML =
				"Container stopped. Reopen this challenge to start another.";
		}
		console.log(data);
	};
}
