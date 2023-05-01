function deletecart(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          url: "/deletesingle?id="+id,
          method: "GET",
          success: (response) => {
            if (response.status) {
              swal({
                title: "Item deleted",
                text: "The item has been successfully deleted from your cart.",
                icon: "success",
                
              })
              location.reload();
            } else {
              swal({
                title: "Error",
                text: "An error occurred while deleting the item.",
                icon: "error",
              });
            }
          },
          error: () => {
            swal({
              title: "Error",
              text: "An error occurred while deleting the item.",
              icon: "error",
            });
          },
        });
      }
    });
  }
  