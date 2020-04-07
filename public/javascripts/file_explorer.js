$(function() {


  $('.explorer-item').on('click', function(e) {
    $(this).toggleClass('selected');
    checkAnySelected();
    checkAllSelected();
  });
  $(".explorer-item a").click(function(e) {
    e.stopPropagation();
  });

  function checkAnySelected() {
    // SELECT_MODE = !SELECT_MODE;
    let ANY_SELECTED = false;
    if($('.selected').length > 0) {
      ANY_SELECTED = true;
    } else {
      ANY_SELECTED = false;
    }
    if(ANY_SELECTED) {
      // $('#toolbar_actions').css('visibility', 'visible');
      // $('#select_action').css('display', 'none');
      $('#move_action').removeClass('btn-secondary');
      $('#delete_action').removeClass('btn-secondary');
      $('#move_action').addClass('btn-primary');
      $('#delete_action').addClass('btn-primary');
    } else {
      // $('.explorer-item').off('click');
      // $('.selected').toggleClass('selected');
      // $('#toolbar_actions').css('visibility', 'hidden');
      // $('#select_action').css('display', 'inline');
      $('#move_action').addClass('btn-secondary');
      $('#delete_action').addClass('btn-secondary');
      $('#move_action').removeClass('btn-primary');
      $('#delete_action').removeClass('btn-primary');
    }
    return ANY_SELECTED;
  }

  function checkAllSelected() {
    if($('.selected').length === $('.explorer-item').length) {
      $('#deselect_all_action').css('display', 'inline');
      $('#select_all_action').css('display', 'none');
      return true;
    } else {
      $('#select_all_action').css('display', 'inline');
      $('#deselect_all_action').css('display', 'none');
      return false;
    }
  }

  function getSelected() {
    $('.selected').each(function( index, element ){
      console.log($(element).attr('data-id'));
    });
  }

  // $('#select_action').click(toggleSelectMode);
  // $('#cancel_action').click(toggleSelectMode);

  $('#select_all_action').click(function() {
    $('.explorer-item').addClass('selected');
    checkAllSelected();
    checkAnySelected();
  });
  $('#deselect_all_action').click(function() {
    $('.selected').removeClass('selected');
    checkAllSelected();
    checkAnySelected();
  });

  // Clicking on body will also deselect all
  // TO-DO

  function deleteModal() {
    $('#main-modal-title').html('Delete');
    if(checkAnySelected()) {
      $('#main-modal-body').html('<p style="font-weight: bold;">Are you sure you want to delete the selected files and folders?</p>');
      $('#main-modal-submit').css('display', 'inline');
      $('#main-modal-submit').html('Delete');
      $('#main-modal-submit').removeClass('btn-primary');
      $('#main-modal-submit').addClass('btn-danger');
      $('#main-modal-submit').click(deleteFunction);
    } else {
      $('#main-modal-body').html('<p>You don\'t have any files or folders selected!</p>');
      $('#main-modal-submit').css('display', 'none');
    }
    $("#main-modal").modal()
  }

  function deleteFunction() {

  }

  function moveModal() {
    $('#main-modal-title').html('Move');
    if(checkAnySelected()) {
      $('#main-modal-submit').css('display', 'inline');
      $('#main-modal-submit').html('Move');
      $('#main-modal-submit').removeClass('btn-danger');
      $('#main-modal-submit').addClass('btn-primary');
      $('#main-modal-submit').click(moveFunction);
      $.ajax({
        type: "GET",
        url: `/md/folder_tree`,
        success: function(data) {
          if (data && !data.error) {
            $('#main-modal-body').html('<p>Where do you want to move the selected files and folders?</p><div id="tree"></div>');
            console.log(data);
            $('#tree').treeview({
              color: "#428bca",
              expandIcon: "fa fa-plus",
              collapseIcon: "fa fa-minus",
              nodeIcon: "fa fa-folder",
              selectedIcon: "fa fa-folder",
              showTags: true,
              data
            });
            $('.badge').each(function() { $(this).addClass('badge-secondary') });
            $('.badge.badge-secondary').css('float', 'right');
            $('#tree').on('click', function () {
              $('.badge').each(function() { $(this).addClass('badge-secondary') });
              $('.badge.badge-secondary').css('float', 'right');
            });
          } else {
            $('#main-modal-body').html('<p>Error loading folder tree!</p>');
          }
        }
      });
    } else {
      $('#main-modal-body').html('<p>You don\'t have any files or folders selected!</p>');
      $('#main-modal-submit').css('display', 'none');
    }
    $("#main-modal").modal()
  }

  function moveFunction() {
    
  }

  function formatToTreeView(obj, callback) {
    if (obj['name']) {
      obj['text'] = obj['name'];
    }
    let found_children = false;
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (i === 'children' && obj[i].length) {
          found_children = true;
          obj['nodes'] = obj[i];
          for (var child of obj['children']) {
            formatToTreeView(child, callback);
          }
        }
      }
    }
    if (!found_children) {
      callback();
    }
  }

  function processTree(rootNode, markRequestStart, markRequestComplete, onComplete) {

    if (rootNode['name']) {
      rootNode['text'] = rootNode['name'];
    }

    // Count of outstanding requests.
    // Upon a return of any request,
    // if this count is zero, we know we're done.
    var outstandingRequests = 0;

    // A list of processed nodes,
    // which is used to handle artifacts
    // of non-tree graphs (cycles, etc).
    // Technically, since we're processing a "tree",
    // this logic isn't needed, and could be
    // completely removed.
    //
    // ... but this also gives us something to inspect
    // in the sample test code. :)
    var processedNodes = [];

    markRequestStart = markRequestStart ? markRequestStart : function() {
      outstandingRequests++;
    }

    markRequestComplete = markRequestComplete ? markRequestComplete : function(node) {
      outstandingRequests--;
      processedNodes.push(node);
      // We're done, let's execute the overall callback
      if (outstandingRequests < 1) { onComplete(processedNodes); }
    }

    function processNode(node) {
      // Kickoff request for this node
      markRequestStart();

      // Recursively process all child nodes (kicking off requests for each)
      if (node['children'] && node['children'].length) {
        node['nodes'] = node['children'];
        node['nodes'].forEach(function (childNode) {
          markRequestStart();
          processTree(childNode, markRequestStart, markRequestComplete, () => { markRequestComplete(childNode); });
        });
      }
      markRequestComplete(node);
    }

    processNode(rootNode);
  }

  $('#delete_action').click(deleteModal);
  $('#move_action').click(moveModal);
});
