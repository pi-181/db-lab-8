const server_url = 'http://localhost:3000/';
let currentDataUrl;

$(function () {
  const $loadingModal = $('.loading');
  const $errorSpan = $('.error');

  try {
    $loadingModal.show();

    $.ajax({
      url: server_url + 'currency',
      method: 'get',
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        $loadingModal.hide();
        $errorSpan.empty();
        const $selectCurrency = $('#select-currency');
        const $firstOption = $selectCurrency.find('option')[0];
        $selectCurrency.empty().append($firstOption);

        for (const i in response) {
          const $newOption = $('<option>').val(response[i].name).text(response[i].name);
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
      currentDataUrl = server_url + 'group_by_currency';
      getData(currentDataUrl, false);
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
      currentDataUrl = server_url + 'convert_uah';
      getData(currentDataUrl, true);
    })

  } catch (e) {
    $loadingModal.hide();
    $errorSpan.text(e.message);
  }
});

function bindEditRemoveListeners() {
  const $loadingModal = $('.loading');
  const $errorSpan = $('.error');

  $('.button-remove').on('click', function (e) {
    const id = $(this).data('id');
    console.log(id);
    const data = JSON.stringify({'id': id});
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
    const btn = $(this);
    const id = btn.data('id');

    let desc = btn.closest('td').prev().prev();
    let source = desc.prev();
    let currency = source.prev();
    let sum = currency.prev();
    let date = sum.prev();

    let data = {};
    if (desc[0].innerText !== '-') data.description = desc[0].innerText;
    if (currency[0].innerText !== '-') data.currency = currency[0].innerText;
    if (source[0].innerText !== '-') data.source = source[0].innerText;
    if (sum[0].innerText !== '-') data.sum = sum[0].innerText;
    if (date[0].innerText !== '-') data.date = date[0].innerText;
    data = JSON.stringify(data);

    $.ajax({
      url: server_url + 'operation/' + id,
      data: data,
      method: 'patch',
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        $loadingModal.hide();
        $errorSpan.empty();
        alert("Відредаговано!");
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

  })
}

function getData(fetch_url, is_table) {
  const $loadingModal = $('.loading');
  const $errorSpan = $('.error');

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
  const $resultTbody = $("#table-result").find('tbody');
  const templateRow = $("#row-template").text();
  let resultRows = '';

  for (const i in data) {
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
  const templateRow = $("#text-template").text();
  let resultRows = '';

  for (const i in data) {
    resultRows += templateRow
      .replace('{sum}', data[i].sum || '-')
      .replace('{currency}', data[i].currency || '-');
  }
  $("#div-table-result").hide();
  $("#text-result-space").empty().html(resultRows);
  $("#div-text-result").show();
}

function serializeForm(form) {
  const formData = form.serializeArray();
  const result = {};
  for (const i in formData) {
    result[formData[i].name] = formData[i].value;
  }
  return JSON.stringify(result);
}
