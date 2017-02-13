function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.getSelected(null,function(tab) {

    ////auto get test pizdato
    $.get(tab.url, function( my_var ) {

        //get header
        var header = $(my_var).find("h1.np").text();
        header = header.replace(new RegExp("Test",'g'),"");
        header = header.trim();

        // styles Success/Error
        var stylesSuccess = {
          "border": "5px",
          "border-color": "#009406",
          "border-style": "solid",
          "border-radius": "7px",
          "padding": "10px"
        };
        var stylesError = {
          "border": "5px",
          "border-color": "red",
          "border-style": "solid",
          "border-radius": "7px",
          "padding": "10px",
          "color": "red"
        };

        if(header != '' && $(my_var).find("#questionForm pre").first().text() != '') {

          //req json object pizdato
          var req = {
              test: header,
              questionData: {
                question: "",
                multiselect: "",
                answers: []
              }
          };
          //set header
          $('#message').text('');
          $('#message').append( $("<h1></h1>").text(header + " Test") );

          //get question pizdato
          var found = $("<pre></pre>");
          $(found).append($(my_var).find("#questionForm pre").first().text());
          $('#message').append(found);
          req.questionData.question = $(my_var).find("#questionForm pre").first().text();

          //get multiselect pizdato
          $('#message').append($(my_var).find("#questionForm p.oGood"));
          req.questionData.multiselect = $(my_var).find("#questionForm p.oGood").text();

          //arr answers
          var arr = [];
          var pres = []
          var ans = $(my_var).find("pre.np").each(function (k, v) {
            ///fill arr pizdato
            pres.push($(v))
            arr.push($(v).text());
          });

          //append answers
          req.questionData.answers = arr;
          $('#message').append(pres);

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
               $('#message').text('');
               if(data.version == "old") {
                 $('#message').append($("<img/>").attr("src", data.image));
                 console.log(textStatus);
                 console.log(data);
               } else if (data.version == "new") {
                 if (data.answers.length == 0) {
                   $('#message').append($("<pre></pre>").text(req.questionData.question));
                   $('#message').append($("<h1></h1>").text("go to: http://stackoverflow.com"));
                 } else {
                   for (var i = 0; i < data.answers.length; i++) {
                     $('#message').append($("<pre></pre>").css(stylesSuccess).text(data.answers[i]));
                   }
                 }
                 console.log(textStatus);
                 console.log(data);
               } else {
                 $('#message').append($("<pre></pre>").css(stylesError).text('Invalid data'));
               }
             },
             error: function (jqXHR, textStatus, errorThrown) {
               //response from server error
               $('#message').text('');
               $('#message').append($("<pre></pre>").css(stylesError).text('Has not server connection'));
               console.log(textStatus);
             },
             contentType: "application/json",
             dataType: 'json',
             async: false
          })

        } else {
          //if not valid page
          $('#message').text('');
          $('#message').append($("<pre></pre>").css(stylesError).text('Invalid page'));
        }

    });
  });


}

window.onload = onWindowLoad;
