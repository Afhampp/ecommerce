
function updateQuantityAjax(count, productId,stock) {
    $.ajax({
      url: '/cart/update/' + productId,
      data: {
        products: productId,
        count: count,
        stock
      },
      method: 'put',
      success: (response) => {
        console.log(response.data);
        if (response.status) {
          var data = response.data;
          $(`#${productId}`).html(data.price);
          $('#totalprice').html(data.total);
          $(`#${productId}k`).html(data.nodata)
        }
        else{
          $(`#${productId}k`).html(response.data)
        }
      }
    })
  }