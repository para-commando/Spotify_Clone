async function getAllSongs() {
  let response = await fetch('http://127.0.0.1:5500/music/');
  response = await response.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let aTags = div.getElementsByTagName('a');
  let songsList = [];
  for (let index = 0; index < aTags?.length; index++) {
    const element = aTags[index];
    if (element.href.endsWith('.mp3')) {
      songsList.push(element.href.split('/music/')[1]);
    }
  }
  return songsList;
}
let playCurrentSong = new Audio();

const playMusic = (track) => {
  console.log("🚀 ~ playMusic ~ track:",track)
  playCurrentSong.src ='/music/'+track;
  // playCurrentSong.play();
};
async function main() {
  const songs = await getAllSongs();

  console.log('🚀 ~ main ~ songs:', songs);
  let songUL = document
    .querySelector('.songList')
    .getElementsByTagName('ul')[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
    <img class="invert" src="music.svg" alt="" />
    <div class="info">
      <div> ${song.replaceAll('%20', '')}</div>
      <div>Mayum</div>
    </div>
    <div class="playnow">
      <span>Play now</span>
      <img class="invert" src="play.svg" alt="" />
    </div>
   </li>`;
  }
  // console.log('🚀 ~ main ~ songUL:', songUL);
  console.log(
    "🚀 ~ Array.from ~ document.querySelectorAll('.songList'):",
    document.querySelectorAll('.songList')
  );
  let musicToPlay = '';
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach((e) => {
    e.addEventListener('click', (element) => {
      musicToPlay = e.querySelector('.info').firstElementChild.innerHTML.trim();
      console.log('🚀 ~ e.addEventListener ~ musicToPlay:', musicToPlay);
      playMusic(musicToPlay.trim())

    });
    // playCurrentSong.play(musicToPlay);
  });
}

main();
