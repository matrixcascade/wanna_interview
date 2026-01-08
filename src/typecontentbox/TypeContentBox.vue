<template>
  <div class="typecontentbox_cls">
    <section class="message-section">
          <div class="form-group">
            <input
              v-model="type_content"
              @keydown.enter="handleSendMessage"
              placeholder="输入你和奇葩面试官的battle..."/>

             <button
              @click="handleSendMessage"
              class="btn btn-primary"
            >
              发送
            </button>
          </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { avatarService } from '@/xmovavatar/avatar';
import { llmService } from '@/llm/llm';
const type_content=ref('')
function handleSendMessage()
{
  llmService.send(type_content.value).then(response => {
    avatarService.speak(response);
  });
  type_content.value=''
}
</script>
<style scoped>

.typecontentbox_cls {
  position: absolute;
  z-index: 100;
  bottom: 10px;
  left: 50%;
  min-width: 50%;
  max-width: 90%;
  text-align: center;
  transform: translateX(-50%);
}


.message-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px;
  background: #fafafa;
}


.form-group {
  margin-bottom: 3px;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: inline;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

input{
  width: 80%;
  padding: 5px 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus{
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

textarea {
  resize: vertical;
  min-height: 18px;
}

.btn {
  padding: 10px 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  min-width: 80px;
}


.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

</style>
