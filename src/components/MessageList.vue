<template>
  <div class="d-flex flex-column h-100">
    <!-- Chat Legend (sticky header) -->
    <div class="flex-shrink-0 sticky-top bg-white z-3 border-bottom">
      <ChatLegendPrivate
        :groupID="props.groupID"
      />
    </div>
    <!-- Messages container -->
    <div class="flex-grow-1 overflow-auto mb-2 px-3 messages-container">
      <div v-if="messages.length === 0" class="text-center mt-3 text-muted">
        <p>No messages yet.</p>
      </div>
      <ul>
        <li
          v-for="message in messages"
          :key="message.id"
          class="list-unstyled max-w-100"
        >
          <MessageItem
            :group-i-d="groupID"
            :userID="userID"
            :messageID="message.id"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, defineProps, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
    getDocs,
    getDoc
} from "firebase/firestore";
import MessageItem from "@/components/MessageItem.vue";
import ChatLegendPrivate from "@/components/ChatLegendPrivate.vue";

const props = defineProps({
  userID: {
    type: String,
    required: true,
  },
  groupID: {
    type: String,
    required: true,
  },
});

const messages = ref([]);
console.log("Group ID:", props.groupID);
onSnapshot(
  query(collection(db, "groups", props.groupID, "messages"), orderBy("date")),
  async (querySnapshot) => {
    messages.value = [];
    querySnapshot.forEach((doc) => {
      messages.value.push({ id: doc.id, ...doc.data() });
    });
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
  }
);

onMounted(async () => {
  // Update all the messages to confirm read
  const groupDoc = doc(db, "groups", props.groupID);
  const groupData = await getDoc(groupDoc);
  const groupMembers = groupData.data().groupMembers || [];
  const groupAdmins = groupData.data().groupAdmins || [];
  const allMembers = [...groupMembers, ...groupAdmins];
  const messagesRef = collection(db, "groups", props.groupID, "messages");
  const messagesSnapshot = await getDocs(messagesRef);
  messagesSnapshot.forEach(async (messageDoc) => {
    const messageData = messageDoc.data();
    const readby = messageData.readby || {};
    allMembers.forEach((member) => {
      if (!readby[member]) {
        readby[member] = false;
      }
    });
    await updateDoc(messageDoc.ref, { readby });
  });
});

</script>

<style scoped>
.writeSection {
  background-color: white;
}

.d-flex.h-100 {
  height: 100%;
}

.flex-grow-1.messages-container {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow-y: auto;
  width: 100%;
}

ul.list-unstyled {
  display: flex;
  flex-direction: column-reverse;
}

.max-w-100 {
  margin: 0 auto;
}
</style>
