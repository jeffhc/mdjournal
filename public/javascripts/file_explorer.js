$(function() {
  let ANY_SELECTED = false;
  
  
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
    if($('.selected').length > 0) {
      ANY_SELECTED = true;
    } else {
      ANY_SELECTED = false;
    }
    if(ANY_SELECTED) {
      $('#toolbar_actions').css('display', 'inline');
      // $('#select_action').css('display', 'none');
    } else {
      console.log('none selected')
      // $('.explorer-item').off('click');
      // $('.selected').toggleClass('selected');
      $('#toolbar_actions').css('display', 'none');
      // $('#select_action').css('display', 'inline');
    }
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
  });
  $('#deselect_all_action').click(function() {
    $('.selected').removeClass('selected');
    checkAllSelected();
    checkAnySelected();
  });
});
