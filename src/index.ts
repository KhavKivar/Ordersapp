import makeWASocket, {
  UserFacingSocketConfig,
  Browsers,
  useMultiFileAuthState,
} from "baileys";
import qrcode from "qrcode-terminal";
import "dotenv/config";

const { state, saveCreds } = await useMultiFileAuthState('auth');
const config_custom: UserFacingSocketConfig = {
  browser: Browsers.windows("Google Chrome"),
  auth: state,
};

const sock = makeWASocket(config_custom);

sock.ev.on("creds.update", saveCreds);

const targetJid = process.env.TARGET_JID || "";
const helloMessage = process.env.MESSAGE || "Hello from OrderSapp!";
let sentOnce = false;

sock.ev.on("connection.update", ({ connection, qr }) => {
  if (qr) {
    console.log("Scan this QR with WhatsApp:");
    qrcode.generate(qr, { small: true });
  }
  if (connection) {
    console.log(`connection: ${connection}`);
  }
  if (connection === "open" && !sentOnce) {
    sentOnce = true;
    void sock.sendMessage(targetJid, { text: helloMessage});
  }
});

sock.ev.on('messages.upsert', ({ messages }) => {
  const msg = messages[0];
  if (!msg.message) return;
  console.log(`New message from ${msg.key.remoteJid}:`, msg.message);
});
