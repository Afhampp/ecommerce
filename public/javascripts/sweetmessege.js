



function addtocart(id){
    $.ajax({
        url:'/addtocart?id='+id,
        method:'get',
        success:(response)=>{
           
            if(response.status==true){
                swal({
                    title: "Added to cart!",
                    icon: "success",
                    button: "OK",
                  });
            }
            else if(response.status=="out"){
                swal({
                    title: "Out Of stock",
                    icon: "error",
                    button: "OK",
                  });
            }

            else{
                swal("Please Sign in to add");
            }
            
        }
    })
}