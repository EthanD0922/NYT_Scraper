$(".btn").click(function() {
        console.log("linked")
    })

$(document).ready( () => {
    $(".notePrimary").click(() => {
        var thisId = $(this).attr('data-id');
        console.log("notes clicked")
        console.log($('.notePrimary'))
        $.ajax({
            method: "GET",
            url: '/articles/' + thisId
        }).then( data => {
            $("." + thisId).append(data.note.body)
        })
    })})
$(document).on('click', "#saveNote", () => {
    var thisId = $(this).attr("class");
    console.log(thisId)

    $.ajax({
        method: "POST",
        url: '/note/' + thisId,
        data: {
            title: $(this).attr("data-title"),
            body: $("#noteBody").val()  
        }   
    }).then(data => {
        console.log(data)
        $('#noteBody').empty();
    })
})
