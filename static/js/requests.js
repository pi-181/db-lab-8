var currentDataUrl;
var server_url = 'http://localhost:3000/';

$(function() {
	var $loadingModal = $('.loading');
	var $errorSpan = $('.error');

	try {
		$loadingModal.show();

		$.ajax({
			url: server_url + 'currency',
			method: 'get',
			contentType: "application/json; charset=utf-8",
			success: function (response) {
				$loadingModal.hide();
				$errorSpan.empty();
				var $selectCurrency = $('#select-currency');
				var $firstOption = $selectCurrency.find('option')[0];
				$selectCurrency.empty().append($firstOption);

				for(var i in response) {
					var $newOption = $('<option>').val(response[i].name).text(response[i].name);
					$selectCurrency.append($newOption);
				}
			},
			error: function (error) {
				$loadingModal.hide();
				$errorSpan.text(error.responseText);
			}
		});

		$('#form-add-spend').on('submit', function (e) {
			e.preventDefault();
			var formData = serializeForm($(this));
			$loadingModal.show();
			$.ajax({
				url: server_url + 'operation',
				data: formData,
				method: 'post',
				contentType: "application/json; charset=utf-8",
				success: function (response) {
					$loadingModal.hide();
					$errorSpan.empty();
					alert("Додано!");
					if (currentDataUrl) {
						getData(currentDataUrl, true)
					}
				},
				error: function (error) {
					$loadingModal.hide();
					$errorSpan.text(error.responseText);
					alert("Помилка!");
				}
			});
		});
		$("#button-all").on('click', function (e) {
			currentDataUrl = server_url + 'operation';
			getData(currentDataUrl, true);
		});
		$("#button-group").on('click', function (e) {
			$loadingModal.show();
			$.ajax({
				method: 'get',
				url: server_url + 'group_by_currency',
				contentType: "application/json; charset=utf-8",
				success: function (response) {
					$loadingModal.hide();
					$errorSpan.empty();
					console.log(response);
				},
				error: function (error) {
					$loadingModal.hide();
					$errorSpan.text(error.responseText);
				}
			})
		});
		$("#button-gt").on('click', function (e) {
			$loadingModal.show();
			$.ajax({
				method: 'get',
				url: server_url + 'great_spendings',
				contentType: "application/json; charset=utf-8",
				success: function (response) {
					$loadingModal.hide();
					$errorSpan.empty();
					console.log(response);
				},
				error: function (error) {
					$loadingModal.hide();
					$errorSpan.text(error.responseText);
				}
			})
		});
		$("#button-convert").on('click', function (e) {
			$loadingModal.show();
			$.ajax({
				method: 'get',
				url: server_url + 'convert_uah',
				contentType: "application/json; charset=utf-8",
				success: function (response) {
					$loadingModal.hide();
					$errorSpan.empty();
					console.log(response);
				},
				error: function (error) {
					$loadingModal.hide();
					$errorSpan.text(error.responseText);
				}
			})
		})

	} catch (e) {
		$loadingModal.hide();
		$errorSpan.text(e.message);
	}
});

function bindEditRemoveListeners() {
	var $loadingModal = $('.loading');
	var $errorSpan = $('.error');
	$('.button-remove').on('click', function (e) {
		var id = $(this).data('id');
		console.log(id);
		var data = JSON.stringify({
			'id': id
		});
		$loadingModal.show();
		$.ajax({
			url: server_url + 'operation',
			data: data,
			method: 'delete',
			contentType: "application/json; charset=utf-8",
			success: function (response) {
				$loadingModal.hide();
				$errorSpan.empty();
				alert("Видалено!");
				if (currentDataUrl) {
					getData(currentDataUrl, true)
				}
			},
			error: function (error) {
				$loadingModal.hide();
				$errorSpan.text(error.toString());
				alert("Помилка!");
			}
		})
	});
	$('.button-edit').on('click', function (e) {
		var id = $(this).data('id');
		console.log(id);
	})
}
function getData(fetch_url, is_table) {
	var $loadingModal = $('.loading');
	var $errorSpan = $('.error');

	$loadingModal.show();
	$.ajax({
		url: fetch_url,
		method: 'get',
		contentType: "application/json; charset=utf-8",
		success: function (response) {
			$loadingModal.hide();
			$errorSpan.empty();
			if (is_table) {
				fillTable(response);
			} else {
				fillText(response);
			}
			bindEditRemoveListeners();
		},
		error: function (error) {
			$loadingModal.hide();
			$errorSpan.text(error.responseText);
		}
	});
}
function fillTable(data) {
	var $resultTbody = $("#table-result").find('tbody');
	var templateRow = $("#row-template").text();
	var resultRows = '';

	for (var i in data) {
		resultRows += templateRow
			.replace('{date}', data[i].date || '-')
			.replace('{sum}', data[i].sum || '-')
			.replace('{currency}', data[i].currency || '-')
			.replace('{source}', data[i].source || '-')
			.replace('{description}', data[i].description || '-')
			.replace(/{id}/g, data[i]._id);
	}

	$resultTbody.empty().html(resultRows);
	$("#div-text-result").hide();
	$("#div-table-result").show();
}
function fillText(data) {
	var templateRow = $("#text-template").text();
	var resultRows = '';

	for (var i in data) {
		resultRows += templateRow
			.replace('{sum}', data[i].sum || '-')
			.replace('{currency}', data[i].currency || '-');
	}
	$("#div-table-result").hide();
	$("#div-text-result").empty().html(resultRows).show();
}
function serializeForm(form) {
	var formData = form.serializeArray();
	var result = {};
	for(var i in formData) {
		result[formData[i].name] = formData[i].value;
	}
	return JSON.stringify(result);
}
