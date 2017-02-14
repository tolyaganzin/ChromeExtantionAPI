function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.getSelected(null,function(tab) {

    ////auto get test
    $.get(tab.url, function( htmlCurrentPage ) {

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
        console.log(req);

        //send to server data
        $.ajax({

          type: "POST",
          //the url where you want to sent the userName and password to
          //  url: 'http://192.168.0.118:4000/api/v2/json',
          url: 'http://192.168.0.145:5000/api/v2/testing',
          data: req,
          success: function (data, textStatus, jqXHR) {
            //response from server success
            console.log(textStatus);
            console.log(data);
            if(data.version == "old") {
              // Old answer image
              $('img.hide').attr("src", data.image);
              $('img.hide').removeClass('hide');
            } else if (data.version == "new") {
              if (data.answers.length == 0) {
                // Has not answer(s)
                $('h2.hide, h3.hide, h4.hide').removeClass('hide');  
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
            console.log(textStatus);
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

window.onload = onWindowLoad;
