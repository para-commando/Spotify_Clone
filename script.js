async function getAllSongs() {
  let reponse = await fetch('http://127.0.0.1:3080/music/');
  reponse = await reponse.text();
  let div = document.createElement('div');
  div.innerHTML = reponse;
  let aTags = div.getElementsByTagName('a');
  let songsList = [];
  for (let index = 0; index < aTags?.length; index++) {
    const element = aTags[index];
    if (element.href.endsWith('.mp3')) {
      songsList.push(element.href);
    }
  }
  console.log("🚀 ~ getAllSongs ~ songsList:", songsList)
  return;

}
console.log(getAllSongs());

