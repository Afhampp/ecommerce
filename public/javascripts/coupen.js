$(document).ready(function() {
    $('#myFor').submit(function(event) {
      // Prevent the form from submitting normally
      event.preventDefault();
  
      // Get the form data
      var formData = $(this).serialize();
  
      // Send the form data using AJAX
      $.ajax({
        
        url: '/postcoupen', // replace with your backend endpoint
        data: formData,
        method: 'post',
      
        success: function(response) {
          console.log(response.status)
          // Handle the successful response
          if(response.status=="found"){
            $('#coupenfound').html(response.data)
            location.reload()
            
          }
          else if(response.status=="notfound"){
            $('#coupen').html(response.data)
  
          }
          else if(response.status=="min"){
            $('#coupen').html(response.data)
          }
          else if(response.status=="max"){
            $('#coupen').html(response.data)
          }
          else if(response.status=="used"){
            $('#coupen').html(response.data)
          }
          else if(response.status=="already"){
            $('#coupen').html(response.data)
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