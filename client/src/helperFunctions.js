// Time converter function by shomrat from: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
// Retrieved on 3-2-20
export const timeConverter = (UNIX_timestamp) => {
    if(UNIX_timestamp === 0) {
      return '';
    } else if (typeof UNIX_timestamp === 'undefined') {
      return "Long, long time ago";
    }
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}