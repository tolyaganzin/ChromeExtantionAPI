function onWindowLoad() {
  ///////set pizdato
  // var test = '';
  /////get pizdato test
  // chrome.storage.local.get(["selectedTest"], function(items){
  //   if (items.selectedTest) {
  //     test = items.selectedTest;
  //     $("#setPizdato").val(test)
  //     console.log(items);
  //   }
  // });
  /////select and set pizdato test
  // $("#setPizdato").change(function(){
  //   console.log('old test: ' + test);
  //   test = $(this).val();
  //   console.log('Selected test: ' + test);
  //   chrome.storage.local.set({ "selectedTest": test }, function(){});
  // });
  ///////////////////////////////////

  var message = document.querySelector('#message');

  chrome.tabs.getSelected(null,function(tab) {

    $.get(tab.url, function( my_var ) {
        ////auto get test pizdato
        var header = $(my_var).find("h1.np").text();

        header = header.replace(new RegExp("Test",'g'),"");
        header = header.trim();

        if(header != '' && $(my_var).find("#questionForm pre").first().text() != '') {
          ////req json object pizdato
          var req = {
              test: header,
              questionData: {
                question: "",
                multiselect: "",
                answers: []
              }
          };

          ///get question pizdato
          $('#message').text(header);
          var found = $("<p></p>");
          $(found).append($(my_var).find("#questionForm pre").first());
          $('#message').append(found);
          req.questionData.question = $(my_var).find("#questionForm pre").first().text();

          //get multiselect pizdato
          found = $("<p></p>");
          $(found).append($(my_var).find("#questionForm p.oGood"));
          $('#message').append(found);
          req.questionData.multiselect = $(my_var).find("#questionForm p.oGood").text();



          found = $("<p></p>");
          //arr answers
          var arr = [];
          var ans = $(my_var).find("pre.np").each(function (k, v) {
            ///fill arr pizdato
            arr.push($(v).text());
          });
          req.questionData.answers = arr;
          $(found).append(ans);
          $('#message').append(found);

          req = JSON.stringify(req);
          console.log(req);

          $.ajax({
             type: "POST",
             //the url where you want to sent the userName and password to
            //  url: 'http://192.168.0.145:5000/api/v2/json',
             url: 'http://192.168.0.128:5000/api/v2/json',
             data: req,
             success: function (data, textStatus, jqXHR) {
               console.log(textStatus);
               alert(textStatus);
             },
             error: function (jqXHR, textStatus, errorThrown) {
               console.log(textStatus);
               alert(textStatus);
             },
             contentType: "application/json",
             dataType: 'json',
             async: false
             //json object to sent to the authentication url
          })

        } else {
          alert("this page is not valid");
        }

    });
  });


}

window.onload = onWindowLoad;
