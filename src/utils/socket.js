import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:4000';
const socket = io.connect(ENDPOINT);

export default socket;
