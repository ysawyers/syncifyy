<template>
  <div
    :style="{
      'background-color': darkMode ? 'rgba(18, 18, 18)' : 'white',
      height: windowHeight - 56 + 'px',
    }"
  >
    <div class="flex justify-center pt-3 mb-3">
      <button class="mr-3 text-red-600 focus:outline-none" @click="leaveLobby()">
        <i class="fa fa-arrow-circle-left" style="font-size:34px;"></i>
      </button>

      <p
        :style="{
          'font-size': '2.25rem',
          color: darkMode ? 'white' : 'black',
        }"
      >
        {{ lobbyTitle }}
      </p>
      <button v-if="!darkMode" @click="darkMode = true" class="ml-3 text-black focus:outline-none">
        <i class="fa fa-moon-o" style="font-size:32px;"></i>
      </button>
      <button v-if="darkMode" @click="darkMode = false" class="ml-3 text-yellow-500 focus:outline-none">
        <i class="fa fa-sun-o" style="font-size:32px;"></i>
      </button>
    </div>
    <div>
      <div class="flex justify-center">
        <youtube v-if="!fullScreen" :video-id="videoId" :playerVars="playerVars" @ended="ended" ref="youtube" style="pointer-events: none;"></youtube>
        <youtube v-if="fullScreen" :video-id="videoId" :playerVars="playerVars" :width="frameWidth" :height="frameHeight" @ended="ended" ref="youtube" style="pointer-events: none;"></youtube>
      </div>

      <div class="flex items-center justify-center mt-4">
        <button @click="playVideo" class="p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white" style="border: 1.5px solid gray;">
          <i class="fa fa-play" style="font-size: 20px;"></i>
        </button>
        <button @click="pauseVideo" class="p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white ml-2" style="border: 1.5px solid gray;">
          <i class="fa fa-pause"></i>
        </button>
        <div @click="findCursorTime($event)" class="timeline" ref="timeline">
          <div
            class="timeline-cursor"
            v-bind:style="{
              width: videoPercentage + '%',
              color: darkMode ? 'white' : 'black',
            }"
          ></div>
        </div>
        <button
          @click="
            {
              fullScreen = !fullScreen;
              showDashboard = !showDashboard;
            }
          "
          class="ml-2 p-1 pl-2 pr-2 border-black rounded bg-red-600 focus:outline-none hover:bg-red-500 text-white"
          style="border: 1.5px solid gray;"
        >
          <i class="fa fa-expand" style="font-size:20px;"></i>
        </button>
      </div>

      <p class="text-red-600 text-center mt-2">{{ errorMessage }}</p>

      <div v-if="showDashboard" v-bind:style="{ color: darkMode ? 'white' : 'black' }">
        <div class="rounded-r-sm ml-2" style="height: 17em; width: 35%; margin-top: 4em;">
          <div class="w-full h-8 flex mb-2" style="border: 2px solid gray;">
            <button
              class="bg-red-600 pl-2 pr-2 text-white focus:outline-none hover:bg-red-700"
              @click="
                {
                  showChat = true;
                  showPeopleWatching = false;
                  showSwitchVideo = false;
                }
              "
            >
              Chat
            </button>
            <button
              class="bg-red-600 pl-2 pr-2 border-l text-white focus:outline-none hover:bg-red-700"
              @click="
                {
                  showChat = false;
                  showPeopleWatching = true;
                  showSwitchVideo = false;
                }
              "
            >
              People Watching
            </button>
            <button
              class="bg-red-600 pl-2 pr-2 border-l border-r text-white focus:outline-none hover:bg-red-700"
              @click="
                {
                  showChat = false;
                  showPeopleWatching = false;
                  showSwitchVideo = true;
                }
              "
            >
              Switch Video
            </button>
          </div>
          <div
            v-if="showChat"
            class="w-full overflow-y-auto flex flex-col-reverse"
            v-bind:style="{
              height: '88%',
              border: darkMode ? '2px solid #f5f5f5' : '2px solid gray',
              'background-color': darkMode ? '#696969' : 'white',
            }"
          >
            <div v-for="messages in chat.slice().reverse()" :key="messages.index">
              <p class="ml-1">{{ messages }}</p>
            </div>
          </div>

          <div
            v-if="showPeopleWatching"
            class="w-full overflow-y-auto"
            v-bind:style="{
              height: '88%',
              border: darkMode ? '2px solid #f5f5f5' : '2px solid gray',
              'background-color': darkMode ? '#696969' : 'white',
            }"
          >
            <p class="mb-2">Currently Watching: {{ this.usersWatching.length }}</p>
            <div v-for="user in usersWatching" :key="user.id">
              <p class="ml-1">{{ usersWatching.indexOf(user) + 1 }}. {{ user }}</p>
            </div>
          </div>

          <div
            v-if="showSwitchVideo"
            class="w-full"
            v-bind:style="{
              height: '88%',
              border: darkMode ? '2px solid #f5f5f5' : '2px solid gray',
              'background-color': darkMode ? '#696969' : 'white',
            }"
          >
            <div style="margin-top: 5em; position: relative;">
              <form @submit.prevent="switchVideo()" class="text-center position: absolute; margin: 0; top: 50%;">
                <input v-if="!darkMode" v-model="newVideoURL" type="text" style="width:60%" class="focus:outline-none border-b bg-transparent" placeholder="Insert Youtube URL" />
                <input v-if="darkMode" v-model="newVideoURL" type="text" style="width:60%;" class="focus:outline-none border-b bg-transparent text-white" placeholder="Insert Youtube URL" />
                <input type="submit" value="Change Video" class="ml-3 p-1 rounded bg-red-600 text-white focus:outline-none hover:bg-red-500" style="border: 1.5px solid gray;" />
              </form>
            </div>
          </div>

          <div
            class="w-full"
            v-bind:style="{
              height: '15%',
              border: darkMode ? '2px solid gray' : '2px solid black',
              'margin-top': '5px',
            }"
          >
            <div v-if="showChat">
              <form class="ml-2" style="padding-top: 7px;" @submit.prevent="sendMessage()">
                <input v-model="message" class="mr-2 focus:outline-none bg-transparent" type="text" style="width:90%; border-bottom: 1.5px solid red;" placeholder="Send Message" />
                <input
                  type="submit"
                  value="send"
                  class="pl-1 pr-1"
                  v-bind:style="{
                    color: darkMode ? 'white' : 'black',
                    'background-color': darkMode ? 'gray' : '#d3d3d3',
                  }"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'MainLobbyView',

  data() {
    return {
      username: '',
      lobbyTitle: '',
      currentLobbyId: null,
      videoId: '',
      newVideoURL: null,
      fullScreen: false,
      frameHeight: 0,
      frameWidth: 0,
      playerVars: {
        controls: 0,
        disablekb: 1,
        rel: 0,
        modestbranding: 1,
      },
      videoLength: 0,
      videoPercentage: 0,
      showDashboard: true,
      showChat: true,
      showPeopleWatching: false,
      showSwitchVideo: false,
      message: '',
      chat: [],
      usersWatching: [],
      darkMode: false,
      errorMessage: '',
      socket: io(process.env.VUE_APP_SERVER_URL),
    };
  },
  computed: {
    player() {
      return this.$refs.youtube.player; // youtube player to get access to youtube API functions
    },
  },
  methods: {
    async ended() {
      // when the video ends...
      clearInterval(this.interval); // stop the interval
      this.videoPercentage = 100; // the progress bar should be at 100%
    },
    async playVideo() {
      // when play is clicked
      await this.player.playVideo(); // play video to the user
      this.socket.emit('playing', this.currentLobbyId); // emit event to all clients (in the lobby)
    },
    async pauseVideo() {
      // when pause is clicked
      await this.player.pauseVideo(); // pause video to the user
      this.socket.emit('paused', this.currentLobbyId); // emit event to all clients (in the lobby)
    },
    async switchVideo() {
      const newVideo = this.$youtube.getIdFromUrl(this.newVideoURL);
      if (newVideo == null) {
        this.errorMessage = 'Invalid URL!'; // add timeout
      } else {
        this.errorMessage = '';
        try {
          const API_URL = process.env.VUE_APP_CHANGE_VIDEO;
          await axios.put(API_URL, { lobbyId: this.currentLobbyId, newVideoId: newVideo }, { headers: { authorization: localStorage.token } });
          this.socket.emit('new-video', this.currentLobbyId); // emit to all clients a new video has been inserted (in lobby)
        } catch (error) {
          this.errorMessage = error.response.data;
        }
      }
    },
    async sendMessage() {
      if (this.message.length > 0) {
        let chatMessage = this.username + ': ' + this.message;
        this.message = '';
        this.socket.emit('chat-message', { lobby: this.currentLobbyId, chatMessage: chatMessage });
      }
    },
    findCursorTime: function(e) {
      let timeline = this.$refs.timeline.getBoundingClientRect();
      let timelineLen = timeline.width;
      let cursorPos = e.clientX - timeline.left;

      let cursorPercentage = (cursorPos / timelineLen) * 100;

      this.socket.emit('seek-to', {
        newPositionInTimeline: Math.round(cursorPercentage), // change
        currentLobbyId: this.currentLobbyId,
      });
    },
    closeBrowser() {
      this.socket.emit('lost-connection', {
        lobbyId: this.currentLobbyId,
        username: this.username,
      });
    },
    leaveLobby() {
      // push back to lobbies and send request to remove it from database
      const API_URL = process.env.VUE_APP_LEAVE_LOBBY;
      const currRouteId = this.$router.currentRoute.path.split('/')[2];

      axios
        .put(API_URL, {}, { headers: { authorization: localStorage.token } })
        .then(() => {
          this.darkMode = false;
          this.$router.push('/lobbies');
          this.socket.emit('lost-connection', {
            lobbyId: this.currentLobbyId,
            username: this.username,
          });
        })
        .catch((error) => {
          this.errorMessage = error.response.data;
        });
    },
    deleteUpload() {
      this.socket.emit('lost-connection', {
        lobbyId: this.currentLobbyId,
        username: this.username,
      });
    },
    async inLobby(clientsLobbyId) {
      // display title of the current lobby
      const response = await axios.get(process.env.VUE_APP_ALL_LOBBIES, {
        headers: { authorization: localStorage.token },
      });

      let lobbies = response.data;
      for (var i = 0; i < lobbies.length; i++) {
        if (lobbies[i].uuid == this.currentLobbyId) {
          if (clientsLobbyId == lobbies[i].uuid) {
            return true;
          }
        }
      }
      return false;
    },
  },

  created() {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    const S_API_URL = process.env.VUE_APP_CURRENTLY_WATCHING;

    const currRouteId = this.$router.currentRoute.path.split('/')[2];

    axios
      .get(API_URL, {
        headers: {
          Authorization: localStorage.token,
        },
      })
      .then((response) => {
        const lobbies = response.data;
        for (var i = 0; i < lobbies.length; i++) {
          if (lobbies[i].uuid == currRouteId) {
            this.lobbyTitle = lobbies[i].title;
            this.currentLobbyId = lobbies[i].uuid;
          }
        }

        axios
          .post(
            S_API_URL,
            {
              lobbyId: this.currentLobbyId,
            },
            {
              headers: {
                authorization: localStorage.token,
              },
            }
          )
          .then((videoId) => {
            this.videoId = videoId.data;
          });
      });

    window.addEventListener('beforeunload', this.closeBrowser);
  },
  mounted() {
    this.frameHeight = screen.height - 400;
    this.frameWidth = screen.width - 50;

    const API_URL = process.env.VUE_APP_NEW_VIDEO;
    const SS_API_URL = process.env.VUE_APP_FETCH_USERNAME;

    axios
      .get(API_URL, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .then((response) => {
        if (response.data.addConnection) {
          const S_API_URL = process.env.VUE_APP_ASSIGN_LOBBY;
          const routeId = this.$router.currentRoute.path.split('/')[2];

          axios.put(S_API_URL, { lobbyId: routeId }, { headers: { authorization: localStorage.token } });
        }
      });

    axios
      .get(SS_API_URL, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .then((response) => {
        this.username = response.data.username;
        const routeId = this.$router.currentRoute.path.split('/')[2];

        this.socket.emit('new-connection', { lobbyId: routeId, username: this.username });
      });

    this.socket.on('play', async (clientsLobbyId) => {
      let isValidRequest = await this.inLobby(clientsLobbyId);

      if (isValidRequest) {
        this.interval = setInterval(async () => {
          this.videoLength = await this.player.getDuration();
          let currentTimestamp = await this.player.getCurrentTime();
          let percentage = (currentTimestamp / this.videoLength) * 100;
          this.videoPercentage = percentage;

          console.log(this.videoLength);
        }, 10);
        this.player.playVideo();
      }
    });
    this.socket.on('seeking', async (data) => {
      let isValidRequest = await this.inLobby(data.currentLobbyId);

      if (isValidRequest) {
        this.player.playVideo();
        this.videoPercentage = data.newPositionInTimeline;
        let newVideoTime = (this.videoPercentage / 100) * this.videoLength;
        await this.player.seekTo(newVideoTime);
        this.socket.emit('playing', data.currentLobbyId);
      }
    });
    this.socket.on('reload', async (clientsLobbyId) => {
      // on new video
      let isValidRequest = await this.inLobby(clientsLobbyId);
      if (isValidRequest) {
        // if it was from someone in the lobby
        window.location.reload(); // reload
      }
    });
    this.socket.on('pause', async (clientsLobbyId) => {
      // on pause
      let isValidRequest = await this.inLobby(clientsLobbyId); // if paused by someone in the lobby
      if (isValidRequest) {
        clearInterval(this.interval); // stop interval
        this.player.pauseVideo(); // pause
      }
    });
    this.socket.on('message', (data) => {
      if (this.currentLobbyId === data.lobby) {
        this.$set(this.chat, this.chat.length, data.chatMessage);
      }
    });

    this.socket.on('watcher-join', (data) => {
      let usersWatching = [];
      for (const user in data.sockets) {
        usersWatching.push(user);
      }

      this.usersWatching = usersWatching;
    });

    this.socket.on('watcher-leave', (data) => {
      if (this.currentLobbyId === data.lobbyId) {
        this.$delete(this.usersWatching, this.usersWatching.indexOf(data.username));
      }
    });
  },
};
</script>

<style>
.timeline {
  height: 10px;
  width: 40%;
  margin-left: 10px;
  background-color: rgb(145, 145, 145);
  cursor: pointer;
}

.timeline-cursor {
  background-color: red;
  height: 10px;
  border-right: 3px solid;
}

.timeline-cursor-dark {
  background-color: red;
  height: 10px;
  border-right: 3px solid white;
}

.darkModeDisplay {
  background-color: rgb(15, 15, 15);
}

.titleDark {
  color: white;
}

.fa-arrow-circle-left {
  background-image: radial-gradient(at center, white 50%, transparent 40%);
}

.fa-sun-o {
  background-image: radial-gradient(at center, rgb(255, 253, 253) 50%, transparent 40%);
}
</style>
