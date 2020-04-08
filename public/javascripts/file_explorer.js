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
      $('.toolbar-action').removeClass('btn-secondary');
      $('.toolbar-action').addClass('btn-primary');
    } else {
      $('.toolbar-action').addClass('btn-secondary');
      $('.toolbar-action').removeClass('btn-primary');
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
    let selected = [];
    $('.selected').each(function( index, element ){
      selected.push($(element).attr('data-id'));
    });
    return selected
  }

  
  /* Toolbar Actions */

  function deleteModal() {
    $('#main-modal-title').html('Delete');
    if(checkAnySelected()) {
      $('#main-modal-body').html('<p style="font-weight: bold;">Are you sure you want to delete the selected files and folders?</p><p style="font-style: italic;">This action cannot be undone.</p>');
      $('#main-modal-submit').css('display', 'inline');
      $('#main-modal-submit').html('Delete');
      $('#main-modal-submit').removeClass('btn-primary');
      $('#main-modal-submit').addClass('btn-danger');
      $('#main-modal-submit').unbind().click(deleteFunction);
    } else {
      $('#main-modal-body').html('<p>You don\'t have any files or folders selected!</p>');
      $('#main-modal-submit').css('display', 'none');
    }
    $("#main-modal").modal()
  }

  function deleteFunction() {
    console.log('deleted!')
    let selected_ids = getSelected();
    $(`<form action="/md/${current._id}/delete" method="POST">` + 
      '<input type="hidden" name="selected" value="' + selected_ids.toString() + '">' +
      '</form>').appendTo($(document.body)).submit();
  }

  let selected_move_tree_node = null;

  function moveModal() {
    $('#main-modal-title').html('Move');
    if(checkAnySelected()) {
      $('#main-modal-submit').css('display', 'inline');
      $('#main-modal-submit').html('Move');
      $('#main-modal-submit').removeClass('btn-danger');
      $('#main-modal-submit').addClass('btn-primary');
      $.ajax({
        type: "GET",
        url: `/md/folder_tree`,
        success: function(data) {
          if (data && !data.error) {
            $('#main-modal-body').html('<p>Where do you want to move the selected files and folders?</p><div id="tree"></div>');
            // console.log(data);
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
            $('#tree').on('nodeSelected', function(event, data) {
              selected_move_tree_node = data;
            });
            $('#tree').on('nodeUnselected', function(event, data) {
              selected_move_tree_node = null;
            });
            
            $('#main-modal-submit').unbind().click(function() { 
              if(selected_move_tree_node) {
                notifyModal(
                  'Confirm', `<p>Are you sure you want to move item(s) to <span style="font-style: italic">${selected_move_tree_node.text}</span>?</p>`, true, moveFunction
                )
              } else {
                notifyModal(
                  'Error', 'You didn\'t select a folder!', true, moveModal
                )
              }
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
    if(selected_move_tree_node) {
      console.log('moved!');
      let selected_ids = getSelected();
      $(`<form action="/md/${current._id}/move" method="POST">` + 
        '<input type="hidden" name="selected" value="' + selected_ids.toString() + '">' +
        '<input type="hidden" name="location" value="' + selected_move_tree_node.id + '">' +
        '</form>').appendTo($(document.body)).submit();
      selected_move_tree_node = null;
    } else {
      notifyModal(
        'Error', 'You didn\'t select a folder!', true, moveModal
      )
    }
  }

  function notifyModal(title, body, submitActivate, submitFunction) {
    $('#notify-modal-title').html(title);
    $('#notify-modal-body').html(body);
    if(submitActivate) {
      $('#notify-modal-submit').unbind().click(submitFunction);
      $('#notify-modal-submit').css('display', 'inline');
    } else {
      $('#notify-modal-submit').css('display', 'none');
    }
    $('#notify-modal').modal();
  }

  function renameModal() {
    $('#main-modal-title').html('Rename');
    if(checkAnySelected()) {
      if($('.selected').length === 1) {
        $('#main-modal-submit').css('display', 'inline');
        $('#main-modal-submit').html('Rename');
        $('#main-modal-submit').removeClass('btn-danger');
        $('#main-modal-submit').addClass('btn-primary');
        $('#main-modal-body').html(`<form action="/md/${current._id}/rename" method="POST" id="rename_form">
        <div class="form-group">
          <input type="text" class="form-control" name="name" placeholder="New name" id="rename_name">
        </div>
        </form>`);
        $('#main-modal-submit').unbind().click(function () {
          notifyModal(
            'Confirm', `Are you sure you want to rename <span style="font-style:italic;">${$('.selected .content').text()}</span> to <span style="font-style:italic;">${$('#rename_name').val()}</span>?`, true, renameFunction
          )
        });
      } else {
        $('#main-modal-body').html('<p>You can only rename one item at a time!</p>');
        $('#main-modal-submit').css('display', 'none');
      }
    } else {
      $('#main-modal-body').html('<p>You don\'t have any files or folders selected!</p>');
      $('#main-modal-submit').css('display', 'none');
    }
    $("#main-modal").modal()
  }

  function renameFunction() {
    $('<input type="hidden" name="item" value="' + $('.selected').attr('data-id') + '">')
    .appendTo($('#rename_form'));
    $('#rename_form').submit();
  }

  $('#delete_action').click(deleteModal);
  $('#move_action').click(moveModal);
  $('#rename_action').click(renameModal);

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
});
