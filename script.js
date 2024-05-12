let songs;
let folderName = 'music/ncs';
async function getAllSongs(folder) {
  console.log('🚀 ~ getAllSongs ~ folder:', folder);
  let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
  response = await response.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let aTags = div.getElementsByTagName('a');
  let songsList = [];
  for (let index = 0; index < aTags?.length; index++) {
    const element = aTags[index];
    if (element.href.endsWith('.mp3')) {
      songsList.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  return songsList;
}
let playCurrentSong = new Audio();

const playMusic = (track, folder, pause = false) => {
  console.log('🚀 ~ playMusic ~ folder:', folder);
  console.log('🚀 ~ playMusic ~ track:', track);

  playCurrentSong.src = `/${folder}/` + track;
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

async function main() {
  songs = await getAllSongs(folderName);
  console.log('🚀 ~ main ~ songs:', songs);
  playMusic(songs[0], folderName, true);
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

  let musicToPlay = '';
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach((e) => {
    e.addEventListener('click', (element) => {
      musicToPlay = e.querySelector('.info').firstElementChild.innerHTML.trim();
      playMusic(musicToPlay.trim(), folderName);
    });
  });
  play.addEventListener('click', (element) => {
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
    // offsetX gives us the current width covered on the seebar and the target.getBoundingClientRect().width gives us the total width of the seekbar depending on the screen width so by dividing those we get % value of the circle to be moved
    let percent =
      (element.offsetX / element.target.getBoundingClientRect().width) * 100;
    document.querySelector('.circle').style.left = percent + '%';
    playCurrentSong.currentTime = (playCurrentSong.duration * percent) / 100;
  });

  document.querySelector('.hamburger').addEventListener('click', (element) => {
    document.querySelector('.left').style.left = 0;
  });
  document.querySelector('.close').addEventListener('click', (element) => {
    document.querySelector('.left').style.left = '-120%';
  });

  previous.addEventListener('click', (element) => {
    const currentSongName = playCurrentSong.src.split(folderName + '/')[1];
    console.log(
      '🚀 ~ previous.addEventListener ~ currentSongName:',
      currentSongName
    );

    const currentSongIndex = songs.indexOf(currentSongName);
    console.log(
      '🚀 ~ previous.addEventListener ~ currentSongIndex:',
      currentSongIndex
    );

    if (currentSongIndex > 0) {
      playMusic(songs[currentSongIndex - 1], folderName);
    }
  });
  next.addEventListener('click', (element) => {
    const currentSongName = playCurrentSong.src.split(folderName + '/')[1];
    console.log(
      '🚀 ~ next.addEventListener ~ currentSongName:',
      currentSongName
    );

    const currentSongIndex = songs.indexOf(currentSongName);
    console.log(
      '🚀 ~ next.addEventListener ~ currentSongIndex:',
      currentSongIndex
    );

    if (songs?.length - currentSongIndex - 1 > 0) {
      playMusic(songs[currentSongIndex + 1], folderName);
    }
  });

  document
    .querySelector('.range')
    .getElementsByTagName('input')[0]
    .addEventListener('change', (element) => {
      playCurrentSong.volume = parseInt(element.target.value) / 100;
    });
}

main();
