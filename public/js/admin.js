$(function(){
  $(".del").click(function(e){
    var target = $(e.target);
    var id = target.data("id");
    var tr = $(".item-id-" + id);

    $.ajax({
      type: "DELETE",
      url: "/admin/list?id=" + id,
      success: function(data){
        console.log(data.success);
        if(data.retCode == "001"){
          tr.remove();
        }
      }
    })

  })
})