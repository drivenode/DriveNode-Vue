<template>
  <div id="preview">
    <b-row>
      <b-col>
        <div v-if="isVideo" class="video-playerModal">
          <video-player
            class="video-player-box"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            customEventName="customstatechangedeventname"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @statechanged="playerStateChanged($event)"
          ></video-player>
        </div>
        <div v-if="isPicture">
          <b-img :src="imgSrc" fluid></b-img>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "preview",
  data() {
    return {
      fileId: "",
      mimeType: "",
      isVideo: false,
      playerOptions: {
        // videojs options
        height: "360",
        muted: false,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [],
        controls: true
      },
      imgSrc: "",
      isPicture: false
    };
  },
  mounted() {
    this.$root.$on("onPreviewFileId", (fileId, mimeType) => {
      this.fileId = fileId;
      this.mimeType = mimeType;
      this.mediaType(this.mimeType);
    });
    this.$root.$on("bv::modal::hidden", modal => {
      if (this.player && this.isVideo) {
        this.player.pause(true);
      }
    });
  },
  computed: {
    player() {
      if (this.isVideo) {
        return this.$refs.videoPlayer.player;
      } else {
        return null;
      }
    }
  },
  methods: {
    mediaType(mimeType) {
      this.clearAll();
      let arr = mimeType.split("/");
      switch (arr[0]) {
        case "video":
          this.isVideo = true;
          this.playerOptions.sources.push({
            type: "video/mp4",
            src:
              this.$http.getEndPoint() +
              "/file/preview/" +
              this.fileId +
              "?token=" +
              localStorage.getItem("token")
          });
          break;
        case "image":
          this.isPicture = true;
          this.imgSrc =
            this.$http.getEndPoint() +
            "/file/preview/" +
            this.fileId +
            "?token=" +
            localStorage.getItem("token");
          break;
      }
    },
    clearAll() {
      this.isVideo = false;
      this.isPicture = false;
      this.playerOptions.sources = [];
    },
    // listen event
    onPlayerPlay(player) {
      //console.log("player play!", player);
    },
    onPlayerPause(player) {
      //console.log("player pause!", player);
    },
    playerStateChanged(playerCurrentState) {
      console.log("player current update state", playerCurrentState);
    }
  },
  watch: {
    playerOptions() {}
  }
};
</script>