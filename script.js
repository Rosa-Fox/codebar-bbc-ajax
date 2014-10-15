// TV Schedule example
//Retreive and render available genres http://www.bbc.co.uk/tv/programmes/genres.json

function formatDate(start, end) {
    var start_date = new Date(start);
    var end_date = new Date(end);
    var day = start_date.getDate();
    var month = start_date.getMonth() + 1; // the returned months are 0-11
    var year = start_date.getFullYear();
    var start_hour = start_date.getHours();
    var start_mins = start_date.getMinutes();
    var end_hour = end_date.getHours();
    var end_mins = end_date.getMinutes();
    var date = day + "/" + month + "/" + year + " ";
    // add leading 0 and return last two characters to make sure we use 00:00 format
    date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
        ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2);
    return date;
}

function retrieveGenres(funcy){
  $.ajax({
    url: "http://www.bbc.co.uk/tv/programmes/genres.json",
    dataType: 'json'
  }).done(function(data){
    var genreElement = $("#genres");
    console.log(data.categories[4]);
    $.each(data.categories, function(index, category){
      //genreElement.append("<li>" + category.title + "</li>");
      genreElement.append($("<li>").html(category.title).click(category.key, getTomorrowsSchedule));
    });
  });
}

$(document).ready(function(){
   retrieveGenres(function(response){
      console.log(response.title);
  });
})


function displayEpisode(broadcast){
  var listItemHtml = "";
  listItemHtml += "<h1>" + broadcast.programme.display_titles.title + "</h1>" 
  listItemHtml += "<h3>" + broadcast.programme.display_titles.subtitle + "</h3>"
  listItemHtml += "<p>" + broadcast.programme.short_synopsis + "</p>"
  if (broadcast.programme.image) {
    listItemHtml += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/"+ broadcast.programme.image.pid +".jpg />";
  } 
  else {
    listItemHtml += "<img src='http://placehold.it/272x153' />";
  }
  listItemHtml += "<p>Duration: " + broadcast.duration/60 + " minutes </p>"
  var start_date = new Date(broadcast.start)
  listItemHtml += "<p>" + start_date.toUTCString() + "</p>"

  if (broadcast.programme.position){
    listItemHtml += "<a href='#'>View upcoming episodes</a>"
  }
  else {
    listItemHtml += "<p> No upcoming episode information at this moment </p>"
  }
  return listItemHtml
}


function getTomorrowsSchedule(event) {
 // call to retrieve TV schedule
  var programmeElement = $("#programmes");
  programmeElement.empty()
  $(".spinner").addClass("display")
  $(".active").removeClass("active")
  $(event.target).addClass("active")
  $.ajax({
    url: "http://www.bbc.co.uk/tv/programmes/genres/" + event.data + "/schedules/tomorrow.json",
    dataType: 'json'
  }).done(function(data){
    $(".spinner").removeClass("display")
    $.each(data.broadcasts, function(index, broadcast){
    //genreElement.append("<li>" + category.title + "</li>");
      var listItemHtml = displayEpisode(broadcast);

      var listItem = $("<li>");
      programmeElement.append(listItem.html(listItemHtml));
      listItem.find('a').click(function(){
        //needs to display all the info for upcoming episodes 
        //finds upcoming programmes and links to them
        //move things into separate functions
        //need a blank page... ajax... load when it is done etc
        var pid = broadcast.programme.programme.pid
        getUpcomingEpisodes(pid)
      })
      console.log(broadcast);
    });
  });
  return true;
}

function getUpcomingEpisodes(pid){
  var programmeElement = $("#programmes");
  programmeElement.empty()
  $(".spinner").addClass("display");
  $(".active").removeClass("active");
  $(event.target).addClass("active");
  $.ajax({
    url: "http://www.bbc.co.uk/programmes/" + pid + "/episodes/upcoming.json",
    dataType: 'json'
  }).done(function(data){
  $(".spinner").removeClass("display");
  $.each(data.broadcasts, function(index, broadcast){
    //genreElement.append("<li>" + category.title + "</li>");
    //listItemHtml will be produced by the displayEpisode function
    var listItemHtml =  displayEpisode(broadcast)
    var listItem = $("<li>");
    programmeElement.append(listItem.html(listItemHtml));
  });
  });
}
