function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.getSelected(null,function(tab) {

    ////auto get test pizdato
    $.get(tab.url, function( my_var ) {

        //get header
        var header = $(my_var).find("h1.np").text();
        header = header.replace(new RegExp("Test",'g'),"");
        header = header.trim();

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
             //url: 'http://192.168.0.145:5000/api/v2/json',
             url: 'http://192.168.0.128:5000/api/v2/json',
             data: req,
             success: function (data, textStatus, jqXHR) {
               //response from server success
               if(data.img) {                 
                 $('#message').text('');
                 $('#message').append($("<img/>").attr("src", data.img));
                 console.log(textStatus);
                 console.log(data);
               }
             },
             error: function (jqXHR, textStatus, errorThrown) {
               //response from server error
               console.log(textStatus);
             },
             contentType: "application/json",
             dataType: 'json',
             async: false
             //json object to sent to the authentication url
          })

        } else {
          //if not valid page
          alert("this page is not valid");
        }

    });
  });


}

window.onload = onWindowLoad;
