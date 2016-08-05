$(document).ready(function(){
 $(document).on('click','.curb-save',function(event) {
    saveCurb(event);
  });
  $(document).on('click','.curb-delete',function(event) {
    deleteCurb(event);
  });
  $(document).on('click','.curb-edit',function(event) {
    editCurb(event);
  });
}); 