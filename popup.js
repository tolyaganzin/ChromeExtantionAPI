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

        ////req json object pizdato
        var req = {test: header, question: '', answers: []}

        ///get question pizdato
        $('#message').text(header);
        var found = $("<p></p>");
        $(found).append($(my_var).find("#questionForm pre p").text());
        $('#message').append(found);
        req.question = $(my_var).find("#questionForm pre p").text();

        found = $("<p></p>");
        //arr answers
        var arr = [];
        var ans = $(my_var).find("pre.np").each(function (k, v) {
          ///fill arr pizdato
          arr.push($(v).text());
        });
        req.answers = arr;
        $(found).append(ans);
        $('#message').append(found);

        console.log(req);

        //send post json data to server pizdato
        $.post( "http://192.168.0.145:5000/api/v2/json", req )
        .done(function() {
          console.log(200);
          alert( "success" );
        })
        .fail(function() {
          console.log(404);
          alert( "error. Server not found" );
        });

    });
  });


}

window.onload = onWindowLoad;
