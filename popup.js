function onWindowLoad() {

  var urlApi = 'http://192.168.0.118:5000/api/testing';

  chrome.storage.local.get(["urlApi"], function(items){
    console.log(items);
    if (items.urlApi) {
      urlApi = items.urlApi;
      $("#urlApi").val(urlApi);
    } else {
      chrome.storage.local.set({ "urlApi": urlApi }, function(){});
    }
  });

  function settings() {
    urlApi = $("#urlApi").val();
    chrome.storage.local.set({ "urlApi": urlApi }, function(){});
    alert("Set new url API: " + urlApi);
    $('#old, h2.error, h4.info, #question').addClass('hide');
    $( "pre.rightAnswer" ).remove();
    toDoPizdato();
  }

  // set url API
  $('#urlApi').keyup(function(e) {
      if(e.which == 13) {
        settings();
      }
  });
  $('#setUrl').click(function(){
    settings();
  });

  function toDoPizdato() {

    chrome.tabs.getSelected(null,function(tab) {

      ////auto get test
      $.get(tab.url, function( htmlCurrentPage ) {
        // console.log($(htmlCurrentPage).find("li.account-dropdown a.dropdown-toggle").attr( "title" ));

        // hide p#start element
        $('#start').addClass('hide');

        //get header
        var header = $(htmlCurrentPage).find("h1.np").text();
        header = header.replace(new RegExp("Test",'g'),"");
        header = header.trim();
        //arr answers
        var arr = [];
        //req json object
        var req = {
          test: header,
          questionData: {
            question: "",
            multiselect: "",
            answers: []
          }
        };

        if(header != '' && $(htmlCurrentPage).find("#questionForm pre").first().text() != '') {

          //get question
          req.questionData.question = $(htmlCurrentPage).find("#questionForm pre").first().text();
          let question = req.questionData.question;

          if (question.indexOf("\n") === -1) {
            pos = question.length - 5;
          } else {
            pos = question.indexOf("\n") - 5;
          }
          
          question = question.substr(0, pos);

          $("#copyToBtn").attr('data-clipboard-text', question);
          new Clipboard("#copyToBtn");

          // set to html text question
          $("#question").text(req.questionData.question);
          //get multiselect
          req.questionData.multiselect = $(htmlCurrentPage).find("#questionForm p.oGood").text();
          $(htmlCurrentPage).find("pre.np").each(function (key, value) {
            ///fill arr
            arr.push($(value).text());
          });
          //append answers
          req.questionData.answers = arr;

          //convert to JSON
          req = JSON.stringify(req);
          // console.log(req);

          //send to server data
          $.ajax({

            type: "POST",
            //the url where you want to sent the userName and password to
            //  url: 'http://192.168.0.118:4000/api/v2/json',
            url: urlApi,
            data: req,
            success: function (data, textStatus, jqXHR) {
              if(data.version == "old") {
                // Old answer image
                $('#old').attr("src", data.image);
                $('#old').removeClass('hide');
              } else if (data.version == "new") {
                if (data.answers.length == 0) {
                  // Has not answer(s)
                  $('h2.hide, h4.hide, #question').removeClass('hide');
                } else {
                  // Right Answer(s)
                  $.each( data.answers, function( key, value ) {
                    var preElement = $('pre.hide').clone();
                    $(preElement).removeClass("hide");
                    $(preElement).addClass("rightAnswer");
                    $(preElement).text(value.text);
                    $('#container').append($(preElement));
                  });
                }
              } else {
                // Invalid data
                $('#start').removeClass("hide").addClass("error").text('Invalid data');
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              // Has not server connection
              $('#start').removeClass("hide").addClass("error").text('Has not server connection');
              // console.log(textStatus);
            },
            contentType: "application/json",
            dataType: 'json',
            async: false
          });

        } else {
          //if not valid page
          $('#start').removeClass("hide").addClass("error").text('Invalid page');
        }

      });
    });
  }

  toDoPizdato();
}

window.onload = onWindowLoad;
