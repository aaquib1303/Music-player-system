console.log("First JS Project")

let isPlaying = false;
let audio = new Audio();
let songs = [];
let curridx = 0;
let currPlaylist = [];
let currentPlaylistName = "";
let isDragging = false;

async function getSongs(folderName) {
    let a = await fetch(`http://127.0.0.1:3000/Songs/${folderName}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function playSong(songUrl, playlistName = "", songIndex = 0, card = null) {
    if (!songUrl) {
        console.warn("No song URL provided");
        return;
    }

    console.log("Trying to play:", songUrl);

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    audio = new Audio(songUrl);

    audio.addEventListener("ended", async () => {
        console.log("Song ended. Playing next...");

        if (currPlaylist.length === 0) return;

        curridx = (curridx + 1) % currPlaylist.length;
        const nextCard = await findCardBySongUrl(currPlaylist[curridx], currentPlaylistName);
        playSong(currPlaylist[curridx], currentPlaylistName, curridx, nextCard);
    });

    if (!card) {
        console.log("no card found..");
        return;
    }

    const cardImg = card.children[1];
    const imgUrl = cardImg.getAttribute("src");
    const singing = card.querySelector("h2").innerText;
    const singer = card.querySelector("p").innerText;
    const songurl = card.getAttribute("data-song");

    document.querySelector(".songinfo img").src = imgUrl;
    document.querySelector(".songinfo h2").innerText = singing;
    document.querySelector(".songinfo p").innerText = singer;

    const currdurEl = document.querySelector(".currdur");
    const totaldurEl = document.querySelector(".totaldur");
    const seekbar = document.querySelector(".seekbar");
    const seekcir = document.querySelector(".seekcircle");
    const seekfill = document.querySelector(".seekfill");

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    audio.addEventListener("loadedmetadata", () => {
        totaldurEl.innerText = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        const current = audio.currentTime;
        const total = audio.duration;
        currdurEl.innerText = formatTime(current);

        if (!isNaN(total) && total > 0) {
            const percent = (current * 100) / (total);
            seekfill.style.width = `${percent}%`;
            seekcir.style.left = `${percent}%`;
        }
    })


    audio.play().then(() => {
        document.getElementById("playbutton").src = "/assets/playbar3.svg";
        isPlaying = true;
        curridx = songIndex;

        document.getElementById("playbar").classList.add("show");
        document.querySelector(".content").classList.add("conhide");

        currentPlaylistName = playlistName;
        console.log(`Currently Playing Song : ${songUrl} , Index : ${curridx} , Playlist : ${currentPlaylistName} `)
    }).catch((err) => {
        console.log("Error playing song : ", err);
    });
}

async function addcard(songnumber, songname, artist, imageaddress, songdura) {
    let bar = document.getElementById("playlistbar");

    let newcard = document.createElement("div");
    newcard.className = "playcard";

    let songnum = document.createElement("div");
    songnum.className = "songnum";
    songnum.innerHTML = songnumber;

    let songpic = document.createElement("img");
    songpic.className = "songpic";
    songpic.src = imageaddress;

    let songdet = document.createElement("div");
    songdet.className = "songdet";

    let songn = document.createElement("h2");
    songn.innerHTML = songname;

    let singn = document.createElement("p");
    singn.innerHTML = artist;

    songdet.appendChild(songn);
    songdet.appendChild(singn);

    let songdur = document.createElement("div");
    songdur.className = "songdur";
    songdur.innerHTML = songdura;

    newcard.appendChild(songnum);
    newcard.appendChild(songpic);
    newcard.appendChild(songdet);
    newcard.appendChild(songdur);

    bar.appendChild(newcard);
}

function formatTime(total) {
    const mins = Math.floor(total / 60);
    const secs = Math.floor(total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;

}

async function getduration(songUrl) {
    return new Promise((resolve) => {
        const tempAudio = new Audio(songUrl);

        tempAudio.addEventListener("loadedmetadata", () => {
            const total = tempAudio.duration;
            const mins = Math.floor(total / 60);
            const secs = Math.floor(total % 60).toString().padStart(2, '0');
            resolve(`${mins}:${secs}`);
        });
        tempAudio.addEventListener("error", () => {
            resolve("0:00");
        })
    })

}

async function showplaylistbar(playlistName) {
    const bar = document.getElementById("playlistbar");
    bar.innerHTML = "";


    const playlistCards = document.querySelectorAll(`.card[data-playlist="${playlistName}"]`);
    currPlaylist = [];

    for (let index = 0; index < playlistCards.length; index++) {
        const card = playlistCards[index];
        const songnumber = index + 1;
        const songname = card.querySelector("h2").innerText;
        const artist = card.querySelector("p").innerText;
        const imageaddress = card.children[1].src
        const songUrl = card.getAttribute("data-song");

        currPlaylist.push(songUrl);

        const songdura = await getduration(songUrl);

        addcard(songnumber, songname, artist, imageaddress, songdura);


    }
    document.querySelectorAll(".playcard").forEach((card, index) => {

        card.addEventListener("click", async () => {
            const songurL = currPlaylist[index];
            const bigcard = await findCardBySongUrl(songurL, playlistName)

            playSong(songurL, playlistName, index, bigcard);
        })

    })
}



async function findCardBySongUrl(songUrl, playlistName) {
    const allCards = document.querySelectorAll(`.card[data-playlist="${playlistName}"]`);
    const fileName = songUrl.split("/").pop();

    for (let card of allCards) {
        const cardUrl = card.getAttribute("data-song");
        if (cardUrl.endsWith(fileName)) {
            return card;
        }
    }

    return null;
}




async function main() {
    const playlists = {
        "My-Library": await getSongs("library"),
        "Nasheeds": await getSongs("nasheeds"),
        "Ringtones": await getSongs("ringtones")
    };

    console.log(playlists);

    document.querySelectorAll(".type").forEach(section => {
        const showallBtn = section.querySelector(".showall");
        const cardCont = section.querySelector(".cardContainer");

        showallBtn.addEventListener("click", () => {
            cardCont.classList.toggle("expanded");
            if (cardCont.classList.contains("expanded")) {
                showallBtn.innerHTML = "Show less";
            }
            else {
                showallBtn.innerHTML = "Show all";
            }
        })
    })

    const playBtn = document.getElementById("playbutton");

    const seekbar = document.querySelector(".seekbar");
    const seekfill = document.querySelector(".seekfill");
    const seekbcirc = document.querySelector(".seekcircle");

    function updateSeek(e) {
        const rect = seekbar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;

        if (!isNaN(audio.duration)) {
            audio.currentTime = percent * audio.duration;
            seekfill.style.width = `${percent * 100}%`;
            seekbcirc.style.left = `${percent * 100}%`;
        }
    }
    seekbar.addEventListener("mousedown", (e) => {
        isDragging = true;
        updateSeek(e);
    });

    window.addEventListener("mousemove", (e) => {
        if (isDragging) updateSeek(e);
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });


    playBtn.addEventListener("click", () => {
        if (!audio.src) return;

        if (isPlaying) {
            audio.pause();
            playBtn.src = "/assets/playbar1.svg";
            isPlaying = false;
        }
        else {
            audio.play().catch((err) => console.error("Play failed : ", err));
            playBtn.src = "/assets/playbar3.svg";
            isPlaying = true;
        }
    })

    const voldrag = document.getElementById("voldrag");
    voldrag.addEventListener("input", async () => {
        audio.volume = voldrag.value;
    })

    const muteBtn = document.querySelector(".muteButton");
    muteBtn.addEventListener("click", async () => {
        console.log("mutebutton clicked...");
        if (audio) {
            if (audio.volume > 0) {
                audio.volume = 0;
                voldrag.value = 0;
                muteBtn.src = "/assets/muted.svg";
            }
            else {
                audio.volume = 1;
                voldrag.value = 1;
                muteBtn.src = "/assets/unmuted.svg"
            }
        }
    })

    const backBtn = document.getElementById("backbutton");
    backBtn.addEventListener("click", async () => {
        console.log("backbtn clicked...")
        if (curridx < 0 || !currPlaylist.length) {
            console.log("Wrong index...");
            return;
        }

        if (audio) audio.pause();

        curridx = (curridx - 1 + currPlaylist.length) % currPlaylist.length;
        console.log("Playing previous song at index : ", curridx);
        const card = await findCardBySongUrl(currPlaylist[curridx], currentPlaylistName);
        playSong(currPlaylist[curridx], currentPlaylistName, curridx, card);

    })

    const nextBtn = document.getElementById("nextbutton");
    nextBtn.addEventListener("click", async () => {
        console.log("nextbtn clicked...")
        if (curridx > currPlaylist.length - 1 || !currPlaylist.length) {
            console.log("Wrong index...");
            return;
        }

        if (audio) audio.pause();

        curridx = (curridx + 1) % currPlaylist.length;
        console.log("Playing previous song at index : ", curridx);
        const card = await findCardBySongUrl(currPlaylist[curridx], currentPlaylistName);
        playSong(currPlaylist[curridx], currentPlaylistName, curridx, card);

    })

    const ham=document.getElementById("ham");
    const sidebar=document.querySelector(".left");
    ham.addEventListener("click", () =>{
        sidebar.classList.toggle("open");
    })




    document.querySelectorAll(".card").forEach((card, index) => {
        const playlistName = card.getAttribute("data-playlist");
        const songUrl = card.getAttribute("data-song");

        if (!playlists[playlistName] || !songUrl) {
            console.log("Invalid playlist");
            return;
        }

        card.addEventListener("click", async () => {
            await showplaylistbar(playlistName)
            console.log(`Song : ${songUrl} , Playlist : ${playlistName}`);

            const fileName = songUrl.split("/").pop();
            const songidx = currPlaylist.findIndex(url => url.endsWith(fileName));

            console.log("Song filename:", fileName);
            console.log("Found at index:", songidx);
            console.log("Current playlist:", currPlaylist);

            if (songidx !== -1) {
                playSong(currPlaylist[songidx], playlistName, songidx, card);

            } else {
                console.warn("Couldn't find song by :", fileName);
                playSong(songUrl, playlistName, 0, card);
            }
        });
    });





}


main();