/*
1. Render songs
2. Scroll songs
3. Play / pause / seek
4. CD rotate
5. Next/pre 
6. Random 
7. Next / Repeat when audio ended
8. Active song
9. Scroll active song into view
10. Play song when click

Lắng nghe sự kiện đọc ở event
Lấy giá trị đọc ở property
Thực hiện hành động đọc ở method
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const play = $('.player');
const playBtn = $('.btn-toggle-play');
const heading = $('header h2');
const audio = $('#audio');
const cdThum = $('.cd-thumb');
const cd = $('.cd');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const ranDomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {
    isRandom : 0,
    indexCurrentSong : 0,
    isPlaying : false,
    isRepeat : false,
    isPlaying : false,
    songs : [
        {
            name : 'Nếu lúc đó',
            Singer : 'Tlinh',
            path : './music/NeuLucDo.mp3',
            image: './img/img9.jpg'
        },
        {
            name : 'Chỉ một đêm nữa thôi!',
            Singer : 'MCK',
            path : './music/ChiMotDemNuaThoi.mp3',
            image: './img/img2.jpg'
        },
        {
            name : 'Người đáng thương là anh',
            Singer : 'Only C',
            path : './music/NguoiDangThuongLaAnhGuhancciRemix.mp3',
            image: './img/img3.jpg'
        },
        {
            name : 'Bao lâu ta lại yêu một người',
            Singer : 'Doãn Hiếu',
            path : './music/BaoLauTaLaiYeuMotNguoi.mp3',
            image: './img/img4.jpg'
        },
        {
            name : 'Như anh đã thấy em',
            Singer : 'Andiez',
            path : './music/NhuAnhDaThayEm.mp3',
            image: './img/img5.jpg'
        },
        {
            name : 'Say you do',
            Singer : 'Tiên Tiên ',
            path : './music/SayYouDo.mp3',
            image: './img/img6.jpg'
        },
        {
            name : 'Nơi này có anh',
            Singer : 'Sơn Tùng MTP',
            path : './music/NoiNayCoAnh.mp3',
            image: './img/img7.jpg'
        },
        {
            name : 'Mặt mộc',
            Singer : 'V.Anh-Nguyên Ngọc',
            path : './music/MatMoc.mp3',
            image: './img/img8.jpg'
        },
    ],
    render : function() {
        const htmls = this.songs.map((song, index ) => {
            //Active song
            return `
            <div class="song ${index === this.indexCurrentSong ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                     style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.Singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>  
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    // Sử lí sự kiện
    handleEvent : function() {
        const cdWidth = cd.offsetWidth;

        // CD rotate ,phải đặt ở trước hàm pause play, nó chạy trước khi hàm play and pause chạy
        const cdThumAnimate = cdThum.animate([
            {
                transform : 'rotate(360deg) ',
            }
            // { transform: 'rotate(0) scale(2)' },
            // { transform: 'rotate(360deg) scale(1)' }      
            // { transform: 'rotate(0) translate3D(-90%, -90%, 0', color: '#fff' }, 
            // { color: '#431236', offset: 0.2},
            // { transform: 'rotate(360deg) translate3D(-100%, -100%, 0)', color: '#fff' }
        ],
        {
            duration: 10000, //set time 10 giây
            iterations: Infinity
        }
        )
        cdThumAnimate.pause();
        
        // Xử lí phóng to thu nhở CD
        document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    } 

    //Xử lí khi click  vào nút play 
    playBtn.onclick = function (){
        if(app.isPlaying){
            audio.pause();
        }
        else {
            audio.play();
        }

        //khi mà song bị pause
        audio.onpause = function(){
            app.isPlaying = false;
            play.classList.remove('playing');
            cdThumAnimate.pause();
        }

        //Khi mà song play
        audio.onplay = function(){
            app.isPlaying = true;
            play.classList.add('playing');
            cdThumAnimate.play();
        }
    }  

    //Khi mà tiến độ bài hát thay đổi
    // Ontimeupdate nghĩa là tiến độ video chạy đến đâu 
    // Currenttime nghĩa là đo thời gian thực của tiến độ (kiểu như chạy đến đoạn này là đo được là 6s)
    // Currentime có thể set và get 
    // Duration là đo video dài bao nhiêu giây
    audio.ontimeupdate = function (){
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
    }

    // Khi mà tua thay đổi
    // e kiểu thay cho thuộc tính trong progress target để trỏ đến e 
    progress.onchange = function(e){
        const SeekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = SeekTime;
        
    }
        
    // Xử lí khi mà audio kết thúc
    audio.onended = function(){
        if(app.isRepeat){
            audio.play();
        }
        else{
            // Tự động ấn vào nút next khi audio kết thúc
            nextBtn.click();
        }
    }

    // Khi next song
    nextBtn.onclick = function() {
        //Nếu bật nút random thì chạy hàm randomSongBtn
        if(app.isRandom){
            app.ranDomSongBtn();
        }
        else{
            app.nextSongBtn();
        }
        app.scrollActiveSong();
        audio.play();
    }

    //khi pre song
    prevBtn.onclick = function() {
        //Nếu bật nút random thì chạy hàm randomSongBtn
        if(app.isRandom){
            app.ranDomSongBtn();
        }
        else{
            app.preSongBtn();
        }
        app.scrollActiveSong();
        audio.play();
    }

    //Xử lí bật / tắt nút random
    ranDomBtn.onclick = function() {
        app.isRandom = !app.isRandom;
        ranDomBtn.classList.toggle('active', app.isRandom);
        
    }

    // Bật nút repeat
    repeatBtn.onclick = function() {
        app.isRepeat =!app.isRepeat;
        repeatBtn.classList.toggle('active', app.isRepeat);
    }

    // 
    playlist.onclick = function(e) {
        const songPlaylist = e.target.closest('.song:not(.active)');      
        if(songPlaylist || e.target.closest('.option')){
            if(songPlaylist){
                app.indexCurrentSong = Number(songPlaylist.dataset.index);
            }
            else if(e.target.closest('.option')){

            }
        }
        app.loadCurrentSong();
        audio.play();
}

    },
    scrollActiveSong : function (){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center',
            })
        }, 300)
    },
    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name;
        audio.src = this.currentSong.path;
        cdThum.style.backgroundImage = `url(${this.currentSong.image})`;
        this.render();
    },
    preSongBtn :function(){
        this.indexCurrentSong--;
        if(this.indexCurrentSong < 0  ) {
            app.indexCurrentSong = this.songs.length - 1;          
        }
        this.loadCurrentSong();
    },
    nextSongBtn : function() {
        this.indexCurrentSong++;
        if(this.indexCurrentSong >= this.songs.length ) {
            app.indexCurrentSong = 0;          
        }
        this.loadCurrentSong();
    },
    ranDomSongBtn : function() {
        let newSongIndex 
        do {
            newSongIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newSongIndex === this.indexCurrentSong){
            app.indexCurrentSong = newSongIndex;
        }
        this.loadCurrentSong();
    },
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong',{
            get : function (){
                return this.songs[this.indexCurrentSong];
            }
        })
    },
    start : function(){
        // Định nghĩa ra Object
        this.defineProperties();

        // Player nhạc ra screen
        this.loadCurrentSong();

        //Hiển thị playlist
        this.render();
        
        // Xử lí sự kiện trong list
        this.handleEvent();

    }
}

app.start();

// Fix bug ,random + next ,hết bài không chuyển 



//Random ,next, pre loadCurrentSong luôn => gọi hàm không cần load lại nữa
// Khi load cho thêm thằng render vào luôn để cho thằng active hoạt động luôn ,vì mỗi lần
// onclick vào nút random, next, pre thì luôn gọi thằng loadCurrentSong 