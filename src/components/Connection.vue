<template>
  <div class="flex justify-between">
    <div class="text-xl" v-text="connection.id"></div>
    <div class="ml-6">
      <template v-if="connection.connected">
        Connected to {{ connection.remoteId }}
      </template>
      <template v-else>
        Give this link to your friend so he can connect to you<br>
        <Tooltip>
          <a class="cursor-pointer" @click="copyConnectLink"
             v-text="connection.connectLink"></a>
          <template #tooltip>
            Link copied
          </template>
        </Tooltip>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Tooltip from "./Tooltip.vue";
import copy from "copy-to-clipboard";
import connection from "../lib/connection";

function copyConnectLink() {
  copy(connection.connectLink);
}

</script>

<style scoped>

</style>
