$(function() {

  let last_saved = new Date(current.last_updated);

  var easyMDE = new EasyMDE({
    element: document.getElementById('md-textarea'),
    showIcons: ['preview', 'side-by-side', "code", "table", 'horizontal-rule', 'strikethrough'],
    forceSync: true,
    status: [{
      className: "custom_autosaver",
      defaultValue: function(el) {
        let today = new Date();
        let time_to_show = '';
        if(today.getDate() === last_saved.getDate() && today.getMonth() === last_saved.getMonth() && today.getFullYear() === last_saved.getFullYear()) {
          time_to_show = last_saved.toLocaleTimeString();
        } else {
          time_to_show = last_saved.toDateString() + ', ' + last_saved.toLocaleTimeString();
        }
        el.innerHTML = "Autosaved: " + time_to_show;
      }
    }, "lines", "words", "cursor"]
  });

  if(current['content'] && current['content'].length) {
    easyMDE.value(current['content']);
  }


  var timeoutId;
  easyMDE.codemirror.on("change", function(){  
    $('.custom_autosaver').html("Saving...");
    // Taken from https://stackoverflow.com/questions/19910843/autosave-input-boxs-to-database-during-pause-in-typing
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change    
        saveToDB(easyMDE.value());
    }, 1000);
  });


  function saveToDB(value) {
    $.ajax({
      type: "POST",
      url: `/md/${current._id}/edit`,
      data: { content: value },
      success: function(data) {
        if (data && data.msg === 'success') {
          last_saved = new Date();
          $('.custom_autosaver').html("Autosaved: " + last_saved.toLocaleTimeString());
          console.log('Successfully saved.'); 
        }
      }
    });
  }
  
});