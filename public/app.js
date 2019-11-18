$(".btn").click(function() {
        console.log("linked")
    })

$(document).ready( () => {
    $(".notePrimary").click(function() {
        var thisId = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: '/articles/' + thisId
        }).then( data => {
            console.log(data.data.note)
            $("." + thisId).append(data.data.note.body)
        })
    })

    $('.saveNote').click(function() {
        var thisId = $(this).attr("data-id");
        console.log(thisId)
        $.ajax({
            method: "POST",
            url: '/note/' + thisId,
            data: {
                title: $(this).attr("data-title"),
                body: $("#noteBody").val()  
            }   
        }).then(response => {
            console.log(response)
            $('#noteBody').empty();
        }) 
    })
})