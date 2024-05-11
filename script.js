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

const playMusic = (track, pause = false) => {
  console.log('🚀 ~ playMusic ~ track:', track);
  playCurrentSong.src = '/music/' + track;
  let aa = 'pause.svg';

  if (!pause) {
    playCurrentSong.play();
    aa = 'play.svg';
  }

  play.src = aa;
  document.querySelector('.songinfo').innerHTML = decodeURI(track);
  document.querySelector('.songtime').innerHTML = '00:00 / 00:00';

  return;
};

function makeDoubleDigit(str) {
  if (str.length === 1) {
    return `0${str}`;
  }
  return str;
}

async function main() {
  const songs = await getAllSongs();
  playMusic(songs[0], true);
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
      playMusic(musicToPlay.trim());
    });
  });
  play.addEventListener('click', (element) => {
    console.log('🚀 ~ play.addEventListener ~ element:', element);

    if (playCurrentSong.paused) {
      playCurrentSong.play();
      play.src = 'play.svg';
    } else {
      playCurrentSong.pause();
      play.src = 'pause.svg';
    }
  });

  playCurrentSong.addEventListener('timeupdate', () => {
    let tt = `${Math.round(playCurrentSong.currentTime) % 60}`.padStart(2, '0');
    let mm = `${Math.floor(
      Math.round(playCurrentSong.currentTime) / 60
    )}`.padStart(2, '0');

    let totalMM = `${Math.round(playCurrentSong.duration / 60)}`.padStart(
      2,
      '0'
    );

    let totaltt = `${Math.round(playCurrentSong.duration % 60)}`.padStart(
      2,
      '0'
    );

    document.querySelector(
      '.songtime'
    ).innerHTML = `${mm}:${tt} / ${totalMM}:${totaltt}`;

    document.querySelector('.circle').style.left =
      (playCurrentSong.currentTime / playCurrentSong.duration) * 100 + '%';
  });
  document.querySelector('.seekbar').addEventListener('click', (element) => {
    console.log('🚀 ~ play.addEventListener ~ element:1111111111111', element);
    // offsetX gives us the current width covered on the seebar and the target.getBoundingClientRect().width gives us the total width of the seekbar depending on the screen width so by dividing those we get % value of the circle to be moved
    let percent =
      (element.offsetX / element.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + '%';
    playCurrentSong.currentTime = ((playCurrentSong.duration)*percent)/100;
  });
}

main();
