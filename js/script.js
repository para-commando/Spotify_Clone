let songs;
let folderName = '';
let songsList = '';
async function getAllSongs(folder) {
  let response = await fetch(`/${folder}/`);
  response = await response.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let aTags = div.getElementsByTagName('a');
  songsList = [];
  for (let index = 0; index < aTags?.length; index++) {
    const element = aTags[index];
    if (element.href.endsWith('.mp3')) {
      songsList.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // displaying all the songs in a given folder on left side of the screen
  let songUL = document
    .querySelector('.songList')
    .getElementsByTagName('ul')[0];
  songUL.innerHTML = '';
  for (const song of songsList) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
   <img class="invert" src="img/music.svg" alt="" />
   <div class="info">
     <div> ${song.replaceAll('%20', '')}</div>
     <div>Mayum</div>
   </div>
   <div class="playnow">
     <span>Play now</span>
     <img class="invert" src="img/play.svg" alt="" />
   </div>
  </li>`;
  }

  // adding event listeners on each of the songs listed on left side to play it upon clicking on it
  let musicToPlay = '';
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach((e) => {
    e.addEventListener('click', (element) => {
      musicToPlay = e.querySelector('.info').firstElementChild.innerHTML.trim();
      playMusic(musicToPlay.trim(), folderName);
    });
  });
  playMusic(songsList[0], folderName);
  return songsList;
}
let playCurrentSong = new Audio();

const playMusic = (track, folder, pause = false) => {
  playCurrentSong.src = `/${folder}/` + track;
  let aa = 'img/pause.svg';

  if (!pause) {
    playCurrentSong.play();
    aa = 'img/play.svg';
  }

  play.src = aa;
  document.querySelector('.songinfo').innerHTML = decodeURI(track);
  document.querySelector('.songtime').innerHTML = '00:00 / 00:00';

  return;
};
async function displayAlbums() {
  let response = await fetch(`/music/`);
  response = await response.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let anchors = div.getElementsByTagName('a');
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (
      element.href.includes('/music/') &&
      !element.href.includes('.htaccess')
    ) {
      let folder = element.href.split('/music/')[1];
      let response = await fetch(`/music/${folder}/info.json`);
      response = await response.json();
      let cardContainer = document.querySelector('.cardContainer');
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` <div data-folder="${folder}" class="card">
        <div class="play">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
          >
            <path
              fill="#000000"
              d="M5 20V4L19 12L5 20Z"
              stroke="#141B34"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <img
          src="/music/${folder}/cover.jpg"
          alt=""
        />
        <h2>${response.title}</h2>
        <p>${response.description}</p>
      </div>`;
    }
  }
  // adding event listeners on cards/folders on the right side to display the songs present in it on the left side of the screen
  Array.from(document.getElementsByClassName('card')).forEach((element) => {
    element.addEventListener('click', async (item) => {
      // currentTarget is used so that element we are concerned in this block of code is called when user clicks on any part of the card. if currentTarget is not used then when user clicks on the image part of the card then image tag will be returned and if he clicks on the text part then text tag will be returned since we have put data attribute on the card class we want only that class to be returned.
      folderName = `music/${item.currentTarget.dataset.folder}`;

      songs = await getAllSongs(folderName);
    });
  });

  previous.addEventListener('click', (element) => {
    const currentSongName = playCurrentSong.src.split(folderName + '/')[1];

    const currentSongIndex = songs.indexOf(currentSongName);

    if (currentSongIndex > 0) {
      playMusic(songs[currentSongIndex - 1], folderName);
    }
  });
  next.addEventListener('click', (element) => {
    const currentSongName = playCurrentSong.src.split(folderName + '/')[1];

    const currentSongIndex = songs.indexOf(currentSongName);

    if (songs?.length - currentSongIndex - 1 > 0) {
      playMusic(songs[currentSongIndex + 1], folderName);
    }
  });

  return;
}
async function main() {
  // await getAllSongs(folderName);
  await displayAlbums();
  // creating event listeners to play current/previous/next songs
  play.addEventListener('click', (element) => {
    if (playCurrentSong.paused) {
      playCurrentSong.play();
      play.src = 'img/play.svg';
    } else {
      playCurrentSong.pause();
      play.src = 'img/pause.svg';
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

  // event listener to listen for the volume range changes
  document
    .querySelector('.range')
    .getElementsByTagName('input')[0]
    .addEventListener('change', (element) => {
      playCurrentSong.volume = parseInt(element.target.value) / 100;
    });
  let prevVol = 0;
  let preVolValue = 0;
  volumeIcon.addEventListener('click', (element) => {
    if (volumeIcon.src.includes('volume.svg')) {
      prevVol = playCurrentSong.volume;
      playCurrentSong.volume = 0;
      const volumeRangeVal = document
        .querySelector('.range')
        .getElementsByTagName('input')[0];

      preVolValue = volumeRangeVal.value;
      volumeRangeVal.value = 0;

      volumeIcon.src = 'img/volumeMute.svg';
    } else if (volumeIcon.src.includes('volumeMute.svg')) {
      volumeIcon.src = 'img/volume.svg';
      const volumeRangeVal = document
        .querySelector('.range')
        .getElementsByTagName('input')[0];

      volumeRangeVal.value = preVolValue;
      playCurrentSong.volume = prevVol;
    }
  });
}
main();
