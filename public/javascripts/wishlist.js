function updatecolour(productId) {
  $.ajax({
    url: '/addwish?id=' + productId,
    method: 'get',
    success: (response) => {
      if (response.status) {
        swal({
          title: "Added to wishlist!",
          icon: "success",
          button: "OK",
        });
        
       
      }else{
        
        swal({
          title: "removed from wislist",
          icon: "error",
          button: "OK",
        });
      }
    }
  })
}