<template>
  <div class="home">
    <form id="app" @submit="checkForm" action="/something" method="post">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li 
            v-for="error in errors"
            :key="error"
          >{{ error }}</li>
        </ul>
      </p>
      
      <p>
        <label for="name">Name</label>
        <input type="text"  v-model="name">
      </p>

      <p>
        <label for="room">Room</label>
        <input type="text" v-model="room">
      </p>

      <p>
        <input type="submit" value="Submit">  
      </p>

  </form>
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server: "{{socketMessage}}"</p>
    <button @click="pingServer()">Ping Server</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      errors: [],
      name: null,
      room: null,
    }
  },
  sockets: {
    // Fired when the socket connects
    connection() {
      this.isConnected = true;
      //this.emit
    },
    disconnect() {
      this.isConnected = false;
    },
    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    }
  },
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server
      this.$socket.emit('pingServer', 'PING PING!')
    }
  }
}
</script>
