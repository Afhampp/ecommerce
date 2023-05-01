
function deleteimage( productId,image) {
    $.ajax({
      url: '/admin/deleteimage',
      data: {
        productId,
         image,
        
      },
      method: 'get',
      success: (response) => {
        console.log(response.data);
        if (response.status) {
          location.reload()
        }
        
      }
    })
  }