
function razorpayPayment(data){
  var options = {
            "key": "rzp_test_y2XJO1zYgaa6Gs", // Enter the Key ID generated from the Dashboard
            "amount": data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "ecommerce", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
            
              verifyPayment(response,data.order)
            },
            "prefill": {
              "name": "Gaurav Kumar", //your customer's name
              "email": "gaurav.kumar@example.com",
              "contact": "9000090000"
            },
            "notes": {
              "address": "Razorpay Corporate Office"
            },
            "theme": {
              "color": "#3399cc"
            }
};
var rzp1 = new Razorpay(options);
rzp1.open();
}



$(document).ready(function() {
  $('#myForm').submit(function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Get the form data
    var formData = $(this).serialize();

    // Send the form data using AJAX
    $.ajax({
      
      url: '/postpayment', // replace with your backend endpoint
      data: formData,
      method: 'post',
    
      success: function(response) {
        console.log(response.status)
        // Handle the successful response
        if(response.status=="paypal"){
          var data=response.data
          
          razorpayPayment(data)
        }
        else if(response.status=="COD"){
          swal({
            title: "Placed Order",
            icon: "success",
            button: "OK",
          }).then(() => {
            location.href = '/paymentcomplete';
          });

        }
        else if(response.status=="non"){
          $("#error").html(response.data.msg)
        }
        else {
          $("#adress").html(response.data.msg)
        }
       //
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle errors here
        console.error(textStatus, errorThrown);
      }
    });
  });
});
function verifyPayment(response,data){
  $.ajax({
    url:'/verify-payment',
    data:{
      response,
      data
    },
    method:"post",
    success:function(response){
      if(response.status){
        location.href='/paymentcomplete'
      }
      else{
        alert("payment failed")

      }
    }
  })
}